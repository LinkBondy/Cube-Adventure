'use strict'
const { gameMode, startingMenusStates, storyModeStates, /* shopStates, */ gameStates, settingStates, dataManagement } = require('../data/GameData')
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

      // if (gameStates.currentGameMode === gameMode.Shop) { this.ShopDraw() }

      if (gameStates.currentGameMode === gameMode.AdventureLog) { gameStates.adventureLogController.Draw() }

      if (gameStates.currentGameMode === gameMode.Settings) { this.SettingsDraw() }

      if (gameStates.arrayChartController.findCurrentArrayChart() !== false) { this.DrawCharts() }
    } else {
      this.StartingDraw()
    }
    this.DrawMenus()
  },
  MainDrawToolBar: function () {
    if (gameStates.currentGameMode === gameMode.StoryMode && gameStates.currentStartingMenusState === startingMenusStates.Selected) {
      switch (gameStates.currentStoryModeState) {
        case storyModeStates.WorldSelecting:
          break
        case storyModeStates.Selecting:
          this.DrawSideBarLines(1, 2)
          gameStates.CurrentLevel().drawTimers()
          gameStates.CurrentLevel().storage.Draw(2, 2)
          break
        case storyModeStates.Tutorials:
          break
        case storyModeStates.Playing :
          this.DrawSideBarLines(1, 2)
          gameStates.CurrentLevel().drawTimers()
          gameStates.CurrentLevel().storage.Draw(2, 2)
          break
        case storyModeStates.Paused:
          this.DrawSideBarLines(1, 2)
          gameStates.CurrentLevel().drawTimers()
          gameStates.CurrentLevel().storage.Draw(2, 2)
          break
        case storyModeStates.Lost:
          this.DrawSideBarLines(1, 1)
          gameStates.CurrentLevel().drawTimers()
          gameStates.lossScreen.DrawSideBar()
          break
        case storyModeStates.WonStage:
          this.DrawSideBarLines(1, 0)
          gameStates.CurrentLevel().drawTimers()
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
  },
  StoryModeDraw: function () {
    if (gameStates.currentStoryModeState === storyModeStates.Playing || gameStates.currentStoryModeState === storyModeStates.Paused || (gameStates.currentStoryModeState === storyModeStates.Selecting && gameStates.CurrentLevel().checkLocked())) {
      gameStates.CurrentLevel().draw()
    }

    if (gameStates.currentStoryModeState === storyModeStates.WorldSelecting) { gameStates.worldSelector.Draw() }

    if (gameStates.currentStoryModeState === storyModeStates.Selecting) { gameStates.levelSelector.Draw() }

    // if (gameStates.currentStoryModeState === storyModeStates.Tutorials) { gameStates.adventureLogController.DrawTutorials() }

    if (gameStates.currentStoryModeState === storyModeStates.WonStage) {
      gameStates.winScreen.DrawScreen()
      return
    }

    if (gameStates.currentStoryModeState === storyModeStates.Lost) {
      gameStates.lossScreen.DrawScreen()
    }

    if (gameStates.currentStoryModeState === storyModeStates.Paused) {
      canvas.context.fillStyle = 'rgba(128, 128, 128, 0.6)'
      canvas.context.fillRect(0, 0, 850, 600)
    }
  },
  /* ShopDraw: function () {}, */
  SettingsDraw: function () {
    if (gameStates.currentSettingState === settingStates.Keybinds || gameStates.currentSettingState === settingStates.SpecialKeybinds) {
      if (gameStates.CurrentKeybind().selectingKeybind) {
        this.DrawRebindingText()
      } else {
        gameStates.CurrentKeybind().Draw()
      }
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
  DrawMenus: function () {
    if (gameStates.menuController.CheckMenu() !== undefined) {
      gameStates.menuController.menus[gameStates.menuController.CheckMenu()].Draw()
    }
  },
  DrawCharts: function () {
    let numberDrew = 0
    for (let col = 0; col < gameStates.arrayChartController.arrayCharts[gameStates.arrayChartController.findCurrentArrayChart()].itemsHeight; col++) {
      for (let row = 0; row < gameStates.arrayChartController.arrayCharts[gameStates.arrayChartController.findCurrentArrayChart()].itemsWidth; row++) {
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
    switch (gameStates.CurrentKeybind().currentType) {
      case 'A':
        canvas.context.fillStyle = gameStates.currentThemeColour
        canvas.context.fillText(gameStates.CurrentKeybind().currentKeybind.displayNameA, 410, 320)
        this.ChangeShadow(0, 0, 'black')
        canvas.context.strokeText(gameStates.CurrentKeybind().currentKeybind.displayNameA, 410, 320)
        break

      case 'B':
        canvas.context.fillText(gameStates.CurrentKeybind().currentKeybind.displayNameB, 410, 320)
        this.ChangeShadow(0, 0, 'black')
        canvas.context.strokeText(gameStates.CurrentKeybind().currentKeybind.displayNameB, 410, 320)
        break
    }
    this.ChangeShadow(0, 0, 'black')
    canvas.context.fillStyle = 'rgb(97, 97, 117)'
    if (gameStates.CurrentKeybind().triedRebinding) { canvas.context.fillText('Try Again', 410, 420) }
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
  }
}
