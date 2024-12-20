'use strict'
const { gameMode, startingMenusStates, storyModeStates, shopStates, gameStates, settingStates, dataManagement } = require('../data/GameData')
const { canvas } = require('./Canvas')
const { images } = require('./Images')
export const draw = {
  DrawImage: function (image, x, y) {
    canvas.context.drawImage(image, 0, 0, image.width, image.height, x, y, image.width, image.height)
  },
  ChangeShadow: function (offsetX, offsetY, offsetColour) {
    canvas.context.shadowOffsetX = offsetX
    canvas.context.shadowOffsetY = offsetY
    canvas.context.shadowColor = offsetColour
  },
  MainDraw: function () {
    gameStates.background.DrawBackround()
    this.MainDrawGame()
    gameStates.background.DrawToolBar()
    this.MainDrawToolBar()
  },
  MainDrawGame: function () {
    if (gameStates.currentStartingMenusState === startingMenusStates.Selected && gameStates.currentGameMode !== gameMode.Unselected) {
      if (gameStates.currentGameMode === gameMode.StoryMode) { this.StoryModeDraw() }

      if (gameStates.currentGameMode === gameMode.Shop) { this.ShopDraw() }

      if (gameStates.currentGameMode === gameMode.ItemsInfo) { gameStates.infoController.Draw() }

      if (gameStates.currentGameMode === gameMode.Settings) { this.SettingsDraw() }

      if (gameStates.arrayChartController.findCurrentArrayChart() !== false) { this.DrawCharts() }
    } else {
      this.StartingDraw()
    }
  },
  MainDrawToolBar: function () {
    if (gameStates.currentGameMode === gameMode.StoryMode && gameStates.currentStartingMenusState === startingMenusStates.Selected) {
      switch (gameStates.currentStoryModeState) {
        case storyModeStates.WorldSelecting:
          break
        case storyModeStates.Selecting:
          this.DrawSideBarLines(1, 2)
          this.DrawTimer()
          gameStates.CurrentLevel().storage.Draw(2, 2)
          break
        case storyModeStates.Tutorials:
          break
        case storyModeStates.Playing :
          this.DrawSideBarLines(1, 2)
          this.DrawTimer()
          gameStates.CurrentLevel().storage.Draw(2, 2)
          break
        case storyModeStates.Paused:
          this.DrawSideBarLines(1, 2)
          this.DrawTimer()
          gameStates.CurrentLevel().storage.Draw(2, 2)
          break
        case storyModeStates.Lost:
          this.DrawSideBarLines(1, 1)
          this.DrawTimer()
          gameStates.lossScreen.DrawSideBar()
          break
        case storyModeStates.WonStage:
          this.DrawSideBarLines(1, 0)
          this.DrawTimer()
          break
      }
    }

    if (gameStates.currentGameMode === gameMode.Settings && gameStates.currentSettingState === settingStates.Saving) {
      this.SavingSettingsDraw()
    }
    this.DrawToolBarButtons()
  },
  StartingDraw: function () {
    if (gameStates.currentStartingMenusState === startingMenusStates.NotStarted) { gameStates.titleScreen.Draw(this) }
    if (gameStates.currentStartingMenusState === startingMenusStates.Menu) { gameStates.menuController.MainMenu.Draw() }
  },
  StoryModeDraw: function () {
    if (gameStates.currentStoryModeState === storyModeStates.Playing || gameStates.currentStoryModeState === storyModeStates.Paused || (gameStates.currentStoryModeState === storyModeStates.Selecting && gameStates.CurrentLevel().checkLocked())) {
      gameStates.CurrentLevel().draw()
    }

    if (gameStates.currentStoryModeState === storyModeStates.WorldSelecting) { gameStates.worldSelector.Draw() }

    if (gameStates.currentStoryModeState === storyModeStates.Selecting) { gameStates.levelSelector.Draw() }

    // if (gameStates.currentStoryModeState === storyModeStates.Tutorials) { gameStates.infoController.DrawTutorials() }

    if (gameStates.currentStoryModeState === storyModeStates.WonStage) {
      gameStates.menuController.WinMenu.Draw()
      gameStates.winScreen.DrawScreen()
      return
    }

    if (gameStates.currentStoryModeState === storyModeStates.Lost) {
      gameStates.menuController.LoseMenu.Draw()
      gameStates.lossScreen.DrawScreen()
    }

    if (gameStates.currentStoryModeState === storyModeStates.Paused) {
      canvas.context.fillStyle = 'rgba(128, 128, 128, 0.6)'
      canvas.context.fillRect(0, 0, 850, 600)
      gameStates.menuController.PauseMenu.Draw()
    }
  },
  ShopDraw: function () {
    if (gameStates.currentShopState === shopStates.Menu) { gameStates.menuController.ShopMenu.Draw() }
  },
  SettingsDraw: function () {
    if (gameStates.currentSettingState === settingStates.Selecting) { gameStates.menuController.SettingsMenu.Draw() }

    if (gameStates.currentSettingState === settingStates.Keybinds) {
      if (gameStates.keybindController.seletingKeybind === true) {
        this.DrawRebindingText()
      } else {
        gameStates.menuController.KeybindsSelector.Draw()
        gameStates.keybindController.keybinds.forEach(function (keybind) {
          keybind.Draw()
        })
      }
    }

    if (gameStates.currentSettingState === settingStates.Saving) {
      gameStates.menuController.SavingMenu.Draw()
    }

    if (gameStates.currentSettingState === settingStates.Sound) {
      gameStates.menuController.SoundMenu.Draw()
    }
  },
  SavingSettingsDraw: function () {
    canvas.context.textAlign = 'center'
    canvas.context.font = '40px Arial'
    canvas.context.fillStyle = 'black'
    canvas.context.fillText('Auto Save:', 975, 75)

    // Draws Images
    if (dataManagement.autoSave) {
      this.DrawImage(images.activated, 885, 100)
    } else if (!dataManagement.autoSave) {
      this.DrawImage(images.notActivated, 885, 100)
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
    this.ChangeShadow(4, 4, 'black')
    switch (gameStates.keybindController.currentType) {
      case 'A':
        canvas.context.fillStyle = gameStates.currentThemeColour
        canvas.context.fillText(gameStates.keybindController.currentKeybind.displayNameA, 410, 320)
        this.ChangeShadow(0, 0, 'black')
        canvas.context.strokeText(gameStates.keybindController.currentKeybind.displayNameA, 410, 320)
        break

      case 'B':

        canvas.context.fillText(gameStates.keybindController.currentKeybind.displayNameB, 410, 320)
        this.ChangeShadow(0, 0, 'black')
        canvas.context.strokeText(gameStates.keybindController.currentKeybind.displayNameB, 410, 320)
        break
    }
    this.ChangeShadow(0, 0, 'black')
    canvas.context.fillStyle = 'rgb(97, 97, 117)'
    if (gameStates.keybindController.triedRebinding) { canvas.context.fillText('Try Again', 410, 420) }
    canvas.context.font = '60px Arial'
    canvas.context.fillText('Click the back arrow to exit', 410, 575)
    // Reset Alignment
    canvas.context.textAlign = 'left'
  },
  DrawSideBarLines: function (lineA, lineB) {
    if (lineA === 1) {
      canvas.context.fillRect(850, 175, canvas.width - 850, 4)
    }

    if (lineB === 1) {
      canvas.context.fillRect(850, 390, canvas.width - 850, 4)
    }

    if (lineB === 2) {
      canvas.context.fillRect(850, 450, canvas.width - 850, 4)
    }
  },
  DrawToolBarButtons: function () {
    switch (gameStates.currentStoryModeState) {
      case storyModeStates.Playing:
        draw.DrawImage(images.PauseButton, 925, 475)
        break

      default:
        if (gameStates.currentStoryModeState !== storyModeStates.Lost && gameStates.currentStoryModeState !== storyModeStates.Paused && gameStates.currentStoryModeState !== storyModeStates.WonStage && gameStates.currentStartingMenusState !== startingMenusStates.NotStarted) {
          draw.DrawImage(images.BackButton, 925, 475)
        }
        break
    }
  },
  DrawTimer: function () {
    canvas.context.font = '75px Arial'
    canvas.context.fillStyle = 'black'
    if (gameStates.CurrentLevel().checkLocked()) {
      canvas.context.fillText(gameStates.CurrentLevel().timeLimit, 965, 110)
    } else {
      canvas.context.fillText('???', 965, 105)
    }
    this.AnimateClock()
    // this.DrawImage(images.Clock, 860, 10)
    canvas.context.drawImage(images.Clock, gameStates.CurrentLevel().clockFrame, 0, 96, 116, 860, 15, 48 * 2, 58 * 2)
  },
  AnimateClock: function () {
    if (gameStates.currentStoryModeState === storyModeStates.Playing) {
      if (gameStates.CurrentLevel().clockFrame === 96 * 63 && gameStates.CurrentLevel().timeWaited === 48) {
        gameStates.CurrentLevel().clockFrame = 0
        gameStates.CurrentLevel().timeWaited = 0
      } else if (gameStates.CurrentLevel().timeWaited === 48) {
        gameStates.CurrentLevel().clockFrame += 96
        gameStates.CurrentLevel().timeWaited = 0
      } else {
        gameStates.CurrentLevel().timeWaited += 6
      }
    }
  }
}
