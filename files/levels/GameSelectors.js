'use strict'
const { gameStates, storyModeStates, eventFunctions } = require('../data/GameData')
const { canvas } = require('../drawing/Canvas')
const { images } = require('../drawing/Images')
const { draw } = require('../drawing/Draw')

export class WorldSelector {
  constructor () {
    this.worldIndex = 0
    this.currentWorld = undefined
    this.currentSelectedWorld = undefined
  }

  KeyDown (event, keybindArray) {
    if ((keybindArray[0/* left */].keybindA === event.key || keybindArray[0/* left */].keybindB === event.key)) {
      if (this.worldIndex > 0) {
        this.worldIndex -= 1
      } else if (this.worldIndex === 0) {
        this.worldIndex = gameStates.gameController.worlds.length - 1
      }
    }

    if ((keybindArray[1/* right */].keybindA === event.key || keybindArray[1/* right */].keybindB === event.key)) {
      if (this.worldIndex < gameStates.gameController.worlds.length - 1) {
        this.worldIndex += 1
      } else if (this.worldIndex === gameStates.gameController.worlds.length - 1) {
        this.worldIndex = 0
      }
    }

    if ((keybindArray[4/* select */].keybindA === event.key || keybindArray[4/* select */].keybindB === event.key)) {
      gameStates.SetGameState(storyModeStates.Selecting, 'StoryMode')
      this.currentWorld = gameStates.gameController.worlds[this.worldIndex]
    }
    this.currentSelectedWorld = gameStates.gameController.worlds[this.worldIndex]
    console.log(this.currentSelectedWorld)
  }

  MouseDown (event) {
    // Left "World Selector"
    if (eventFunctions.isTouching(690, 450, 160, 150, event)) {
      if (this.worldIndex > 0) {
        this.worldIndex -= 1
      } else if (this.worldIndex === 0) {
        this.worldIndex = gameStates.gameController.worlds.length - 1
      }
    }

    // Right "World Selector"
    if (eventFunctions.isTouching(0, 450, 160, 150, event)) {
      if (this.worldIndex < gameStates.gameController.worlds.length - 1) {
        this.worldIndex += 1
      } else if (this.worldIndex === gameStates.gameController.worlds.length - 1) {
        this.worldIndex = 0
      }
    }

    // World Selector to Level Selector
    if (eventFunctions.isTouching(0, 120, 850, 200, event) && this.CheckLocked()) {
      gameStates.SetGameState(storyModeStates.Selecting, 'StoryMode')
      this.currentWorld = gameStates.gameController.worlds[this.worldIndex]
    }
    this.currentSelectedWorld = gameStates.gameController.worlds[this.worldIndex]
    console.log(this.currentSelectedWorld)
  }

  Draw () {
    canvas.context.font = '75px Arial'
    canvas.context.fillStyle = this.currentSelectedWorld.textColour

    // Draw World Title
    canvas.context.textAlign = 'center'
    canvas.context.fillText(this.currentSelectedWorld.title, 425, 250)
    canvas.context.textAlign = 'left'

    // Draw arrows to change worlds
    canvas.context.save()
    canvas.context.translate(767.5, 510)
    canvas.context.rotate(270 * Math.PI / 180)
    canvas.context.translate(-767.5, -510)
    draw.DrawImage(images.DownArrow, 690, 432.5)
    // canvas.context.scale(-1, 1)
    canvas.context.restore()

    canvas.context.save()
    canvas.context.translate(87.5, 510)
    canvas.context.rotate(270 * Math.PI / 180)
    canvas.context.translate(-87.5, -510)
    draw.DrawImage(images.UpArrow, 10, 432.5)
    // canvas.context.scale(-1, 1)
    canvas.context.restore()
  }
}

export class LevelSelector {
  constructor () {
    this.levelIndex = 0
  }

  Draw () {
    canvas.context.font = '125px Arial'
    canvas.context.fillStyle = 'rgba(255, 255, 132, 0.788)'

    // Draw level number
    canvas.context.textAlign = 'center'
    canvas.context.fillText(gameStates.CurrentLevel().title, 425, 575)
    canvas.context.textAlign = 'left'

    // Draw Locked Screen if level isn't unlocked
    if (!gameStates.CurrentLevel().checkLocked()) {
      canvas.context.font = '175px Arial'
      canvas.context.fillStyle = 'rgba(255, 255, 132)'
      canvas.context.fillText('Locked', 10, 275)
      draw.DrawImage(images.LockedIcon, 562.5, 10)
    }

    // Draw arrows to change level if applicable
    if (gameStates.currentLevelIndex < gameStates.worldSelector.currentWorld.levels.length - 1) {
      draw.DrawImage(images.DownArrow, 690, 450)
    }

    if (gameStates.currentLevelIndex > 0) {
      draw.DrawImage(images.UpArrow, 10, 450)
    }
  }

  KeyDown (event, keybindArray) {
    // Down "Level Selector"
    if ((keybindArray[3/* down */].keybindA === event.key || keybindArray[3/* down */].keybindB === event.key) && gameStates.currentLevelIndex < gameStates.worldSelector.currentWorld.levels.length - 1) { gameStates.currentLevelIndex += 1 }

    // Up "Level Selector"
    if ((keybindArray[2/* up */].keybindA === event.key || keybindArray[2/* up */].keybindB === event.key) && gameStates.currentLevelIndex !== 0) { gameStates.currentLevelIndex -= 1 }

    // Level Selector to Game
    if ((keybindArray[4/* select */].keybindA === event.key || keybindArray[4/* select */].keybindB === event.key) && gameStates.CurrentLevel().checkLocked()) {
      gameStates.CurrentLevel().startLevel()
    }
  }

  MouseDown (event) {
    // Down "Level Selector"
    if (eventFunctions.isTouching(690, 450, 160, 150, event) && gameStates.currentLevelIndex < gameStates.worldSelector.currentWorld.levels.length - 1) { gameStates.currentLevelIndex += 1 }

    // Up "Level Selector"
    if (eventFunctions.isTouching(0, 450, 160, 150, event) && gameStates.currentLevelIndex !== 0) { gameStates.currentLevelIndex -= 1 }

    // Level Selector to Game
    if (eventFunctions.isTouching(225, 500, 385, 100, event) && gameStates.CurrentLevel().checkLocked()) {
      gameStates.CurrentLevel().startLevel()
    }
  }

  CheckLocked () {
    return gameStates.CurrentLevel().unlocked
  }
}
