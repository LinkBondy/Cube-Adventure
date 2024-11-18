'use strict'
const { gameStates, storyModeStates, startingMenusStates, drawUpdate } = require('../data/GameData')
const { canvas } = require('../drawing/Canvas')

export class TitleScreen {
  Draw (self) {
    self.ChangeShadow(8, 8, 'rgb(50, 50, 50)')
    canvas.context.font = '210px Arial'
    canvas.context.fillStyle = 'black'
    canvas.context.fillText('CUBE', 0, 225)
    canvas.context.font = '125px Arial'
    canvas.context.shadowColor = 'rgba(127, 0, 0)'
    canvas.context.shadowOffsetX = 0
    canvas.context.shadowOffsetY = 0

    canvas.context.textAlign = 'center'
    const gradient = canvas.context.createLinearGradient(0, 0, 750, 0)
    gradient.addColorStop(0, 'rgb(255, 5, 5)')
    gradient.addColorStop(1, 'rgb(145, 4, 12)')
    canvas.context.fillStyle = gradient
    canvas.context.fillText('Adventure', 425, 400)
    canvas.context.font = '60px Arial'

    canvas.context.fillStyle = 'darkred'
    canvas.context.shadowColor = 'rgba(67, 0, 0)'
    canvas.context.fillText('Press Enter to Begin', 425, 550)
    canvas.context.textAlign = 'left'

    self.ChangeShadow(8, 8, 'rgb(50, 50, 50)')
    canvas.context.fillStyle = 'black'
    canvas.context.fillRect(600, 50, 200, 200)
    self.ChangeShadow(0, 0, 'rgb(0, 0, 0)')

    canvas.context.fillStyle = gameStates.currentThemeColour
    canvas.context.fillRect(620, 90, 40, 40)
    canvas.context.fillRect(740, 90, 40, 40)
    canvas.context.fillRect(620, 180, 160, 40)
  }

  KeyDown (event, keybindArray) {
    if ((keybindArray[4/* select */].keybindA === event.key || keybindArray[4/* select */].keybindB === event.key)) {
      gameStates.SetGameState(startingMenusStates.Menu, 'Starting')
    }
  }

  MouseDown (event, isTouching) {
    if (isTouching(0, 500, 850, 100, event.offsetX, event.offsetY)) {
      gameStates.SetGameState(startingMenusStates.Menu, 'Starting')
    }
  }
}

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
        gameStates.CurrentLevel().cubers.forEach(function (cuber) {
          if (player.intersects(cuber)) {
            self.SetLoss(gameStates.CurrentLevel().timeLimit, 'enemy')
          }
        })
        gameStates.CurrentLevel().expanders.forEach(function (expander) {
          if (player.intersectsWithHitboxes(expander)) {
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
      window.clearTimeout(gameStates.CurrentLevel().currentTimeout)
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
    canvas.context.textAlign = 'center'
    canvas.context.fillText(gameStates.CurrentLevel().title + ' Complete!', 425, 100)
    canvas.context.textAlign = 'left'
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
      window.clearTimeout(gameStates.CurrentLevel().currentTimeout)
      gameStates.SetGameState(storyModeStates.WonStage, 'StoryMode')
      gameStates.CurrentLevel().completed = true
      if (gameStates.infoController.unlockedLevel === gameStates.worldSelector.currentWorld.levels.length) { drawUpdate.highestLevelLock = false }
    }, 300)
  }
}
