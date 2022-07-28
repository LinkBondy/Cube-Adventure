const { images } = require('../drawing/Images')
const { draw } = require('../drawing/Draw')
const { gameMode, storyModeStates, gameStates, BackgroundStyles, drawUpdate } = require('../data/GameData')
const { GameObject } = require('./Class')
export class Item extends GameObject {
  constructor (x, y, width, height, typeNumber) {
    super(x, y, width, height)
    this.original_x = this.x
    this.original_y = this.y
    this.typeNumber = typeNumber
    this.allowMovementWater = false
    this.collected = false
  }

  Draw () {
    if (this.typeNumber === 1 && !this.collected && gameStates.currentBackgroundStyle === BackgroundStyles.Classic) {
      draw.DrawImage(images.LifeJacket, this.x, this.y)
    }

    if (this.typeNumber === 1 && !this.collected && gameStates.currentBackgroundStyle === BackgroundStyles.Plastic) {
      draw.DrawImage(images.LifeJacketPlastic, this.x, this.y)
    }

    if (this.typeNumber === 2 && !this.collected && gameStates.currentBackgroundStyle === BackgroundStyles.Classic && gameStates.currentGameMode === gameMode.StoryMode && drawUpdate.blueCubeAlienLock) {
      draw.DrawImage(images.Three_Bead, this.x, this.y)
    }

    if (this.typeNumber === 2 && !this.collected && gameStates.currentBackgroundStyle === BackgroundStyles.Plastic && gameStates.currentGameMode === gameMode.StoryMode && drawUpdate.blueCubeAlienLock) {
      draw.DrawImage(images.Three_Bead_Plastic, this.x, this.y)
    }
  }

  update () {

  }

  reset () {
    this.x = this.original_x
    this.y = this.original_y
    this.allowMovementWater = false
    if (this.typeNumber === 2 && this.collected && gameStates.currentStoryModeState === storyModeStates.WonStage) {
      drawUpdate.blueCubeAlienLock = false
    }
    this.collected = false
  }
};
