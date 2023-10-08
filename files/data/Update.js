'use strict'
const { gameMode, /* startingMenusStates, */ storyModeStates, gameStates, levelTools, settingStates, drawUpdate } = require('./GameData')

export const update = {
  UpdateGame: function (delta) {
    // if (gameStates.currentStartingMenusState === startingMenusStates.Menu) { gameStates.menuController.MainMenu.Update() }

    if (gameStates.currentStoryModeState === storyModeStates.Playing && gameStates.currentGameMode === gameMode.StoryMode) { this.updateLevels(delta) }

    if (gameStates.arrayChartController.findCurrentArrayChart() !== false) { this.chartUpdate() }

    if (gameStates.currentSettingState === settingStates.Keybinds && gameStates.currentGameMode === gameMode.Settings) { this.keybindUpdate() }

    this.checkWinLose()
    this.drawUpdate()
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

  drawUpdate: function () {
    if (gameStates.infoController.unlockedLevel === gameStates.levelController.levels.length) { drawUpdate.highestLevelLock = false }
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
      gameStates.CurrentLevel().unlocks.forEach(function (unlock) {
        unlock.update(delta)
      })
      gameStates.CurrentLevel().holes.forEach(function (hole) {
        hole.update(delta)
      })
      gameStates.CurrentLevel().teleporters.forEach(function (teleporter) {
        teleporter.update(delta)
      })
    }
  },

  updateLose: function () {
    if (levelTools.loseCounterStop === false) {
      levelTools.currentLosses = levelTools.currentLosses + 1
      if (levelTools.currentLosses === 50) {
        drawUpdate.blueCubeSadLock = false
      }
      levelTools.loseCounterStop = true
    }
  },

  checkWinLose: function () {
    if (this.checkWin() && gameStates.currentStoryModeState !== storyModeStates.WonStage && !levelTools.winLevel) {
      levelTools.winLevel = true
      setTimeout(function () {
        gameStates.SetGameState(storyModeStates.WonStage, 'StoryMode')
        levelTools.winLevel = false
      }, 300)
    } else if (this.checkLose() && gameStates.currentStoryModeState !== storyModeStates.Lost && !levelTools.loseLevel) {
      levelTools.loseLevel = true
      setTimeout(function () {
        update.updateLose()
        gameStates.SetGameState(storyModeStates.Lost, 'StoryMode')
        levelTools.loseLevel = false
      }, 30)
    }
  },

  checkWin: function () {
    let win = false
    gameStates.CurrentLevel().players.forEach(function (player) {
      gameStates.CurrentLevel().finishAreas.forEach(function (finishArea) {
        if (finishArea.intersects(player)) {
          win = true
        }
      })
    })
    return win
  },

  checkLose: function () {
    let lose = false
    gameStates.CurrentLevel().players.forEach(function (player) {
      gameStates.CurrentLevel().enemies.forEach(function (enemy) {
        if (player.intersects(enemy)) {
          lose = true
        }
      })
      gameStates.CurrentLevel().holes.forEach(function (hole) {
        if (player.intersectsAll(0, hole) && hole.fullHole) {
          lose = true
        }
      })
      if (gameStates.CurrentLevel().timeLimit <= 0) {
        lose = true
      }
    })
    return lose
  }
}
