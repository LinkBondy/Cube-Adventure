'use strict'
const { images } = require('../../drawing/Images')
const { draw } = require('../../drawing/Draw')
const { gameStates, BackgroundStyles } = require('../../data/GameData')
const { GameObject } = require('./Class')
export class Item extends GameObject {
  constructor (x, y, width, height, type, collected) {
    super(x, y, width, height)
    this.type = type
    this.collected = collected
  }
};

export class LifeJacket extends Item {
  constructor (x, y, width, height) {
    super(x, y, width, height, 'lifeJacket', false)
    this.original_x = this.x
    this.original_y = this.y
  }

  Draw () {
    if ((this.x >= (gameStates.CurrentLevel().currentX - 1) * 850 && this.x < gameStates.CurrentLevel().currentX * 850) && (this.y >= (gameStates.CurrentLevel().currentY - 1) * 600 && this.y < gameStates.CurrentLevel().currentY * 600)) {
      if (!this.collected) {
        if (gameStates.currentBackgroundStyle === BackgroundStyles.Classic) {
          draw.DrawImage(images.LifeJacket, this.x, this.y)
        }

        if (gameStates.currentBackgroundStyle === BackgroundStyles.Plastic) {
          draw.DrawImage(images.LifeJacketPlastic, this.x, this.y)
        }
      }
    }
  }

  reset () {
    this.x = this.original_x
    this.y = this.original_y
    this.collected = false
  }
};

export class Pickaxe extends Item {
  constructor (x, y, width, height) {
    super(x, y, width, height, 'pickaxe', false)
    this.original_x = this.x
    this.original_y = this.y
  }

  Draw () {
    if ((this.x >= (gameStates.CurrentLevel().currentX - 1) * 850 && this.x < gameStates.CurrentLevel().currentX * 850) && (this.y >= (gameStates.CurrentLevel().currentY - 1) * 600 && this.y < gameStates.CurrentLevel().currentY * 600)) {
      if (!this.collected) {
        if (gameStates.currentBackgroundStyle === BackgroundStyles.Classic) {
          draw.DrawImage(images.Pickaxe, this.x, this.y)
        }

        if (gameStates.currentBackgroundStyle === BackgroundStyles.Plastic) {
          draw.DrawImage(images.PickaxePlastic, this.x, this.y)
        }
      }
    }
  }

  reset () {
    this.x = this.original_x
    this.y = this.original_y
    this.collected = false
  }
};

export class ThreeBead extends Item {
  constructor (x, y, width, height) {
    super(x, y, width, height, 'threeBead', false)
    this.original_x = this.x
    this.original_y = this.y
  }

  Draw () {
    if ((this.x >= (gameStates.CurrentLevel().currentX - 1) * 850 && this.x < gameStates.CurrentLevel().currentX * 850) && (this.y >= (gameStates.CurrentLevel().currentY - 1) * 600 && this.y < gameStates.CurrentLevel().currentY * 600)) {
      if (!this.collected) {
        if (gameStates.currentBackgroundStyle === BackgroundStyles.Classic) {
          draw.DrawImage(images.ThreeBead, this.x, this.y)
        }

        if (gameStates.currentBackgroundStyle === BackgroundStyles.Plastic) {
          draw.DrawImage(images.ThreeBeadPlastic, this.x, this.y)
        }
      }
    }
  }

  reset () {
    this.x = this.original_x
    this.y = this.original_y
    this.collected = false
  }
};
