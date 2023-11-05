'use strict'
const { gameMode, startingMenusStates, storyModeStates, gameStates, settingStates } = require('./GameData')

export const update = {
  UpdateGame: function (delta) {
    // if (gameStates.currentStartingMenusState === startingMenusStates.Menu) { gameStates.menuController.MainMenu.Update() }

    if (gameStates.currentStartingMenusState === startingMenusStates.Selected) {
      if (gameStates.currentStoryModeState === storyModeStates.Playing && gameStates.currentGameMode === gameMode.StoryMode) {
        this.updateLevels(delta)
        gameStates.lossScreen.CheckLose()
        gameStates.winScreen.CheckWin()
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
  },
  updateLevels: function (delta) {
    if (gameStates.currentStoryModeState === storyModeStates.Playing && gameStates.currentGameMode === gameMode.StoryMode) {
      gameStates.CurrentLevel().enemies.forEach(function (enemy) {
        enemy.update(delta)
      })
      gameStates.CurrentLevel().players.forEach(function (player) {
        player.update(delta)
        player.changeSlideVariables()
      })
      gameStates.CurrentLevel().reverseTiles.forEach(function (reverseTile) {
        reverseTile.update(delta)
      })
      gameStates.CurrentLevel().holes.forEach(function (hole) {
        hole.update(delta)
      })
      gameStates.CurrentLevel().teleporters.forEach(function (teleporter) {
        teleporter.update(delta)
      })
    }
  }
}
