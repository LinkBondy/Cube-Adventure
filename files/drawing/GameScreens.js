'use strict'
const { gameStates, storyModeStates, startingMenusStates, drawUpdate, eventFunctions } = require('../data/GameData')
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

  MouseDown (event) {
    if (eventFunctions.isTouching(0, 500, 850, 100, event)) {
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
    // Death Clock
    if (this.loseReason === 'death') {
      canvas.context.font = '70px Arial'
      canvas.context.fillText('You were drowned by', 425, 70)
      canvas.context.fillText('Grapple Weed!', 425, 150)
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
    if (this.loseReason === 'water') {
      canvas.context.font = '80px Arial'
      canvas.context.fillText('You Drowned in Water!', 425, 110)
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
            self.SetLoss(gameStates.CurrentLevel().timers[0].time, 'enemy')
          }
        })
        gameStates.CurrentLevel().expanders.forEach(function (expander) {
          if (player.intersectsWithHitboxes(expander)) {
            self.SetLoss(gameStates.CurrentLevel().timers[0].time, 'enemy')
          }
        })
        gameStates.CurrentLevel().holes.forEach(function (hole) {
          if (player.intersectsAll(0, hole) && hole.revealedHole) {
            self.SetLoss(gameStates.CurrentLevel().timers[0].time, 'hole')
          }
        })
        gameStates.CurrentLevel().waters.forEach(function (water) {
          if (player.intersects(water) && !gameStates.CurrentLevel().haveItem('lifeJacket')) {
            self.SetLoss(gameStates.CurrentLevel().timers[0].time, 'water')
          }
        })

        gameStates.CurrentLevel().timers.forEach(function (timer) {
          if (timer.time <= 0 && timer.active) {
            self.SetLoss(0, timer.type)
          }
        })
      })
    }
  }

  SetLoss (timeLeft, reason) {
    const self = this
    this.loseLevel = true
    setTimeout(function () {
      gameStates.CurrentLevel().timers.forEach(function (timer) { timer.pause() })
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
    this.exitCompleted = 0
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
            self.SetWin(finishArea.type)
          }
        })
      })
    }
  }

  SetWin (type) {
    this.winLevel = true
    const self = this
    setTimeout(function () {
      // Clear the level timers
      gameStates.CurrentLevel().timers.forEach(function (timer) { timer.pause() })

      // Set the state to Story Mode
      gameStates.SetGameState(storyModeStates.WonStage, 'StoryMode')

      // Save the current exit
      self.exitCompleted = type

      // Set the current exit to complete
      gameStates.CurrentLevel().exitsCompleted[self.exitCompleted] = true

      // Set the current exit to complete
      if (gameStates.FindLevel(0, 11 - 1).exitsCompleted[0]) { drawUpdate.highestLevelLock = false }

      // Call all of the OnExit Items
      for (let i = 0; i < gameStates.CurrentLevel().storage.items.length; i++) {
        if (gameStates.CurrentLevel().storage.items[i].availableFunctions[1]) {
          gameStates.CurrentLevel().storage.items[i].OnExit()
        }
      }
    }, 300)
  }

  NextLevel () {
    if (gameStates.CurrentLevel().nextLevels.length === 0) {
      gameStates.CurrentLevel().restart()
      gameStates.SetGameState(storyModeStates.Selecting, 'StoryMode')
    } else {
      // Save the original level and world
      const originalLevel = gameStates.levelSelector.levelIndex
      const originalWorld = gameStates.worldSelector.currentSelectedWorld
      const originalWorldIndex = gameStates.worldSelector.worldIndex

      // Restart the level
      gameStates.CurrentLevel().restart()

      // Set the next level and world
      const nextLevel = gameStates.CurrentLevel().nextLevels[this.exitCompleted].level
      gameStates.worldSelector.worldIndex = gameStates.CurrentLevel().nextLevels[this.exitCompleted].world
      gameStates.worldSelector.currentSelectedWorld = gameStates.gameController.worlds[gameStates.worldSelector.worldIndex]
      gameStates.worldSelector.currentWorld = gameStates.worldSelector.currentSelectedWorld
      gameStates.levelSelector.levelIndex = nextLevel

      // Check if the next level is locked or if there are no more levels to continue to
      if (!gameStates.CurrentLevel().checkLocked()) {
        // If it is, set the game state to selecting and reset the level and world back to the original and exit to the selection menu
        gameStates.SetGameState(storyModeStates.Selecting, 'StoryMode')
        gameStates.levelSelector.levelIndex = originalLevel
        gameStates.worldSelector.currentSelectedWorld = originalWorld
        gameStates.worldSelector.currentWorld = originalWorld
        gameStates.worldSelector.worldIndex = originalWorldIndex
      } else {
        // Otherwise, start the next level
        gameStates.CurrentLevel().startLevel()
      }
    }

    // Reset other flags
    gameStates.winScreen.winLevel = false
    this.exitCompleted = 0
  }
}
