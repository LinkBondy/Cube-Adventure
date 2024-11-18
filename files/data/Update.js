'use strict'
const { gameMode, startingMenusStates, storyModeStates, gameStates, settingStates } = require('./GameData')

export const update = {
  UpdateGame: function () {
    // if (gameStates.currentStartingMenusState === startingMenusStates.Menu) { gameStates.menuController.MainMenu.Update() }

    if (gameStates.currentStartingMenusState === startingMenusStates.Selected) {
      if (gameStates.currentGameMode === gameMode.StoryMode) {
        gameStates.gameController.CheckUnlocked()
        if (gameStates.currentStoryModeState === storyModeStates.Playing) {
          gameStates.CurrentLevel().update()
          gameStates.lossScreen.CheckLose()
          gameStates.winScreen.CheckWin()
        }
      }

      if (gameStates.arrayChartController.findCurrentArrayChart() !== false) { this.chartUpdate() }

      if (gameStates.currentSettingState === settingStates.Keybinds && gameStates.currentGameMode === gameMode.Settings) { this.keybindUpdate() }
    }
  },
  chartUpdate: function () {
    let numberDrew = 0
    for (let col = 0; col < gameStates.arrayChartController.arrayCharts[gameStates.arrayChartController.findCurrentArrayChart()].loopHeight; col++) {
      for (let row = 0; row < gameStates.arrayChartController.arrayCharts[gameStates.arrayChartController.findCurrentArrayChart()].loopWidth; row++) {
        gameStates.arrayChartController.arrayCharts[gameStates.arrayChartController.findCurrentArrayChart()].items[numberDrew].Update()
        numberDrew++
      }
    }
    gameStates.arrayChartController.arrayCharts[gameStates.arrayChartController.findCurrentArrayChart()].update()
  },
  keybindUpdate: function () {
    gameStates.keybindController.keybinds.forEach(function (keybind) {
      keybind.Update()
    })
  }
}
