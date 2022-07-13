'use strict'
const { gameMode, startingMenusStates, storyModeStates, ShopMode, gameStates, levelTools, settingStates, drawUpdate } = require('./GameData')
const { canvas } = require('./Canvas')
const { images } = require('./Images')
export var draw = {
  DrawImage: function (image, x, y) {
    canvas.context.drawImage(image, 0, 0, image.width, image.height, x, y, image.width, image.height)
  },
  DrawGame: function () {
    gameStates.background.DrawBackround()
    if (gameStates.currentStartingMenusState === startingMenusStates.Selected) {
      if (gameStates.currentGameMode === gameMode.StoryMode) { this.StoryModeDraw() }

      if (gameStates.currentGameMode === gameMode.Shop) { this.ShopDraw() }

      if (gameStates.currentGameMode === gameMode.ItemsInfo) { gameStates.infoController.Draw() }

      if (gameStates.currentGameMode === gameMode.Settings) { this.SettingsDraw() }

      if (gameStates.arrayChartController.findCurrentArrayChart() !== false) { this.DrawCharts() }
    } else {
      if (gameStates.currentStartingMenusState === startingMenusStates.NotStarted) { this.StartingSreenDraw() }
      if (gameStates.currentStartingMenusState === startingMenusStates.Menu) { gameStates.menuController.MainMenu.Draw() }
    }
    gameStates.background.DrawToolBar()
    this.DrawToolBarButtons()
  },
  StoryModeDraw: function () {
    if (gameStates.currentStoryModeState === storyModeStates.Playing || gameStates.currentStoryModeState === storyModeStates.Paused || gameStates.currentStoryModeState === storyModeStates.Selecting && gameStates.levelController.CheckLocked()) {
      this.LevelsDraw()
    }

    if (gameStates.currentStoryModeState === storyModeStates.Selecting) { this.DrawSelectLevel() }
    // this.DrawRules()

    if (gameStates.currentStoryModeState === storyModeStates.WonStage) {
      gameStates.menuController.WinMenu.Draw()
      this.DrawFinishText()
      return
    }

    if (gameStates.currentStoryModeState === storyModeStates.Lost) {
      if (levelTools.loseCounterStop === false) {
        levelTools.currentLosses = levelTools.currentLosses + 1
        if (levelTools.currentLosses === 50) {
          drawUpdate.blueCubeSadLock = false
        }
        levelTools.loseCounterStop = true
      }
      gameStates.menuController.LoseMenu.Draw()
      this.DrawLoseText()
    }

    if (gameStates.currentStoryModeState === storyModeStates.Paused) {
      canvas.context.fillStyle = 'rgba(128, 128, 128, 0.6)'
      canvas.context.fillRect(0, 0, 850, 600)
      gameStates.menuController.PauseMenu.Draw()
    }
  },
  ShopDraw: function () {
    if (gameStates.currentShopMode === ShopMode.ShopMenu) { gameStates.menuController.ShopMenu.Draw() }
  },
  StartingSreenDraw: function () {
    canvas.context.font = '275px Arial'
    canvas.context.fillStyle = 'black'
    canvas.context.fillText('CUB', 0, 250)
    canvas.context.font = '125px Arial'
    canvas.context.fillStyle = 'red'
    canvas.context.fillText('Adventure', 120, 400)
    canvas.context.font = '60px Arial'
    canvas.context.fillStyle = 'darkred'
    canvas.context.fillText('Press Enter to Begin', 120, 550)
    ///
    canvas.context.fillStyle = 'black'
    canvas.context.fillRect(600, 50, 200, 200)
    canvas.context.fillStyle = gameStates.currentThemeColour
    canvas.context.fillRect(600 + 20, 50 + 40, 40, 40)
    canvas.context.fillRect(600 + 140, 50 + 40, 40, 40)
    canvas.context.fillRect(600 + 20, 50 + 130, 160, 40)
  },
  LevelsDraw: function () {
    canvas.context.save()
    canvas.context.translate(0 - 850 * (gameStates.CurrentLevel().currentX - 1), 0 - 600 * (gameStates.CurrentLevel().currentY - 1))
    gameStates.CurrentLevel().waters.forEach(function (water) {
      water.Draw()
    })

    gameStates.CurrentLevel().finishAreas.forEach(function (finishArea) {
      finishArea.Draw()
    })

    gameStates.CurrentLevel().holes.forEach(function (hole) {
      hole.Draw()
    })

    gameStates.CurrentLevel().unlocks.forEach(function (unlock) {
      unlock.Draw()
    })

    gameStates.CurrentLevel().teleporters.forEach(function (teleporter) {
      teleporter.Draw()
    })

    gameStates.CurrentLevel().items.forEach(function (item) {
      item.Draw()
    })

    gameStates.CurrentLevel().rocks.forEach(function (rock) {
      rock.Draw()
    })

    /* gameStates.CurrentLevel().changeDirectionSquares.forEach(function(changeDirectionSquare) {
            changeDirectionSquare.Draw()
        },) */

    gameStates.CurrentLevel().players.forEach(function (player) {
      player.Draw()
    })

    gameStates.CurrentLevel().enemies.forEach(function (enemy) {
      enemy.Draw()
    })

    gameStates.CurrentLevel().walls.forEach(function (wall) {
      wall.Draw()
    })
    canvas.context.restore()
  },
  DrawRules: function () {
    canvas.context.font = '175px Arial'
    canvas.context.fillStyle = 'purple'
    canvas.context.fillText('Rules', 200, 175)
    ///
    canvas.context.font = '45px Arial'
    canvas.context.fillStyle = 'rgb(2, 0, 139)'
    canvas.context.fillText('Get to the pink to beat levels', 150, 275)
    canvas.context.fillText('Watch out for enemies', 200, 350)
    if (!gameStates.mobile) {
      canvas.context.fillText('Use A, W, S, D or Arrow Keys to move', 50, 425)
    } else if (gameStates.mobile) {
      canvas.context.font = '35px Arial'
      canvas.context.fillText('Tap above, below, to the left or to the right to move', 35, 415)
    }
    canvas.context.font = '75px Arial'
    canvas.context.fillStyle = 'blue'
    canvas.context.fillText('Press space to start', 80, 550)
  },
  DrawFinishText: function () {
    canvas.context.font = '88px Arial'
    canvas.context.fillStyle = 'red'
    canvas.context.fillText('Level ' + (gameStates.currentLevelIndex + 1) + ' Complete!', 60, 100)
  },
  DrawLoseText: function () {
    canvas.context.font = '130px Arial'
    canvas.context.fillStyle = 'darkorchid'
    canvas.context.fillText('You Lose', 10, 120)
    canvas.context.font = '75px Arial'
    canvas.context.fillStyle = 'darkmagenta'
    canvas.context.fillText('Losses', 575, 75)
    canvas.context.fillText((levelTools.currentLosses), 675, 150)
  },
  DrawSelectLevel: function () {
    canvas.context.font = '125px Arial'
    canvas.context.fillStyle = 'rgba(255, 255, 132, 0.788)'
    canvas.context.fillText('Level ' + (gameStates.currentLevelIndex + 1), 225, 575)
    if (!gameStates.levelController.CheckLocked()) {
      canvas.context.font = '175px Arial'
      canvas.context.fillStyle = 'rgba(255, 255, 132)'
      canvas.context.fillText('Locked', 10, 275)
      draw.DrawImage(images.LockedIcon, 562.5, 10)
    }
    if (gameStates.mobile === true) {
      draw.DrawImage(images.UpArrow, 10, 450)
      draw.DrawImage(images.DownArrow, 690, 450)
    }
  },
  SettingsDraw: function () {
    if (gameStates.currentSettingState === settingStates.Selecting) { gameStates.menuController.SettingsMenu.Draw() }

    if (gameStates.keybindController.seletingKeybind === true) {
      this.DrawRebindingText()
    } else if (gameStates.currentSettingState === settingStates.Keybinds) {
      gameStates.menuController.KeybindsSelector.Draw()
      gameStates.keybindController.keybinds.forEach(function (keybind) {
        keybind.Draw()
      })
    }
  },
  DrawCharts: function () {
    let numberDrew = 0
    for (let col = 0; col < gameStates.arrayChartController.arrayCharts[gameStates.arrayChartController.findCurrentArrayChart()].loopHeight; col++) {
      for (let row = 0; row < gameStates.arrayChartController.arrayCharts[gameStates.arrayChartController.findCurrentArrayChart()].loopWidth; row++) {
        gameStates.arrayChartController.arrayCharts[gameStates.arrayChartController.findCurrentArrayChart()].items[numberDrew].Draw(row, col)
        numberDrew++
      }
    }
    numberDrew = 0
    gameStates.arrayChartController.arrayCharts[gameStates.arrayChartController.findCurrentArrayChart()].Draw()
  },
  DrawRebindingText: function () {
    // Set Alignment
    canvas.context.textAlign = 'center'
    // Set font and size
    canvas.context.font = '80px Arial'
    // Set font colour
    canvas.context.fillStyle = 'rgb(97, 97, 117)'
    // Draw text
    canvas.context.fillText('Select an unused key', 410, 120)
    canvas.context.fillText('to replace:', 410, 220)
    canvas.context.fillStyle = gameStates.currentThemeColour
    canvas.context.font = '80px Arial'
    canvas.context.shadowColor = 'black'
    canvas.context.shadowOffsetX = 5
    canvas.context.shadowOffsetY = 5
    switch (gameStates.keybindController.currentType) {
      case 'A':
        canvas.context.fillStyle = gameStates.currentThemeColour
        canvas.context.fillText(gameStates.keybindController.currentKeybind.displayNameA, 410, 320)
        canvas.context.shadowOffsetX = 0
        canvas.context.shadowOffsetY = 0
        canvas.context.strokeText(gameStates.keybindController.currentKeybind.displayNameA, 410, 320)
        break

      case 'B':

        canvas.context.fillText(gameStates.keybindController.currentKeybind.displayNameB, 410, 320)
        canvas.context.shadowOffsetX = 0
        canvas.context.shadowOffsetY = 0
        canvas.context.strokeText(gameStates.keybindController.currentKeybind.displayNameB, 410, 320)
        break
    }
    canvas.context.shadowOffsetX = 0
    canvas.context.shadowOffsetY = 0
    canvas.context.fillStyle = 'rgb(97, 97, 117)'
    if (gameStates.keybindController.triedRebinding) { canvas.context.fillText('Try Again', 410, 420) }
    canvas.context.font = '60px Arial'
    canvas.context.fillText('Click the back arrow to exit', 410, 575)
    // Reset Alignment
    canvas.context.textAlign = 'left'
  },
  DrawToolBarButtons: function () {
    switch (gameStates.currentStoryModeState) {
      case storyModeStates.Playing:
        draw.DrawImage(images.PauseButton, 900, 475)
        break

      case storyModeStates.Paused:
        draw.DrawImage(images.PlayButton, 900, 475)
        break

      default:
        if (gameStates.currentStoryModeState !== storyModeStates.Lost && gameStates.currentStoryModeState !== storyModeStates.WonStage && gameStates.currentStartingMenusState !== startingMenusStates.NotStarted) { draw.DrawImage(images.BackButton, 900, 475) }
        break
    }
  }
}
