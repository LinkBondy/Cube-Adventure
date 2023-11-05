'use strict'
const { gameStates, storyModeStates, drawUpdate } = require('../data/GameData')
const { canvas } = require('../drawing/Canvas')

export class LossScreen {
  constructor () {
    this.loseReason = 'You Lose!'
    this.currentLosses = 0
    this.timeLeft = 0
    this.loseLevel = false
  }

  DrawScreen () {
    canvas.context.textAlign = 'center'
    canvas.context.fillStyle = 'darkorchid'
    if (this.loseReason === 'time') {
      canvas.context.font = '85px Arial'
      canvas.context.fillText('You Ran Out Of Time!', 425, 120)
    }
    if (this.loseReason === 'hole') {
      canvas.context.font = '100px Arial'
      canvas.context.fillText('You Fell In a Hole!', 425, 120)
    }
    if (this.loseReason === 'enemy') {
      canvas.context.font = '70px Arial'
      canvas.context.fillText('You Were Captured', 425, 70)
      canvas.context.fillText('By an Enemy!', 425, 150)
    }
    canvas.context.textAlign = 'start'
  }

  DrawSideBar () {
    canvas.context.textAlign = 'center'
    canvas.context.font = '75px Arial'
    canvas.context.fillStyle = 'darkmagenta'
    canvas.context.fillText('Losses', 975, 275)
    canvas.context.fillText(this.currentLosses, 975, 350)
    canvas.context.textAlign = 'start'
  }

  CheckLose () {
    const self = this
    if (gameStates.currentStoryModeState !== storyModeStates.Lost && !this.loseLevel) {
      gameStates.CurrentLevel().players.forEach(function (player) {
        gameStates.CurrentLevel().enemies.forEach(function (enemy) {
          if (player.intersects(enemy)) {
            self.SetLoss(gameStates.CurrentLevel().timeLimit, 'enemy')
          }
        })
        gameStates.CurrentLevel().holes.forEach(function (hole) {
          if (player.intersectsAll(0, hole) && hole.fullHole) {
            self.SetLoss(gameStates.CurrentLevel().timeLimit, 'hole')
          }
        })
        if (gameStates.CurrentLevel().timeLimit <= 0) {
          self.SetLoss(0, 'time')
        }
      })
    }
  }

  SetLoss (timeLeft, reason) {
    const self = this
    this.loseLevel = true
    setTimeout(function () {
      self.loseReason = reason
      self.timeLeft = timeLeft
      self.currentLosses += 1
      if (self.currentLosses === 50) { drawUpdate.blueCubeSadLock = false }
      gameStates.SetGameState(storyModeStates.Lost, 'StoryMode')
    }, 30)
  }
}

export class WinScreen {
  constructor () {
    this.timeLeft = 0
    this.winLevel = false
  }

  DrawScreen () {
    canvas.context.font = '88px Arial'
    canvas.context.fillStyle = 'red'
    canvas.context.fillText('Level ' + (gameStates.currentLevelIndex + 1) + ' Complete!', 60, 100)
  }

  CheckWin () {
    const self = this
    if (gameStates.currentStoryModeState !== storyModeStates.WonStage && !this.winLevel) {
      gameStates.CurrentLevel().players.forEach(function (player) {
        gameStates.CurrentLevel().finishAreas.forEach(function (finishArea) {
          if (finishArea.intersects(player)) {
            self.SetWin()
          }
        })
      })
    }
  }

  SetWin () {
    this.winLevel = true
    setTimeout(function () {
      gameStates.SetGameState(storyModeStates.WonStage, 'StoryMode')
      if (gameStates.infoController.unlockedLevel === gameStates.currentLevelIndex) { gameStates.infoController.unlockedLevel++ }
      if (gameStates.infoController.unlockedLevel === gameStates.levelController.levels.length) { drawUpdate.highestLevelLock = false }
    }, 300)
  }
}
