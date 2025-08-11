'use strict'
const { images } = require('../../drawing/Images')
const { gameStates, BackgroundStyles } = require('../../data/GameData')
const { canvas } = require('../../drawing/Canvas')
const { GameObject } = require('./Class')

export class Hole extends GameObject {
  constructor (x, y, width, height, remainingIntersects) {
    super(x, y, width, height)
    this.originalX = this.x
    this.originalY = this.y
    this.remainingIntersects = remainingIntersects
    this.originalRemainingIntersects = this.remainingIntersects
    if (this.remainingIntersects === 0) {
      this.revealedHole = true
    } else {
      this.revealedHole = false
    }
    this.originalRevealedHole = this.revealedHole
    this.stopPlayer = false
    this.stopEnemy = false
  }

  Draw () {
    let drawingX = 0
    if ((this.x >= (gameStates.CurrentLevel().currentX - 1) * 850 && this.x < gameStates.CurrentLevel().currentX * 850) && (this.y >= (gameStates.CurrentLevel().currentY - 1) * 600 && this.y < gameStates.CurrentLevel().currentY * 600)) {
      drawingX = 100 - 50 * this.remainingIntersects

      if (gameStates.currentBackgroundStyle === BackgroundStyles.Classic) {
        switch (gameStates.CurrentLevel().currentArea) {
          case 1:
            canvas.context.drawImage(images.Hole, drawingX, 0, 50, 50, this.x, this.y, this.width, this.height)
            break
          case 2:
            canvas.context.drawImage(images.UndergroundHole, drawingX, 0, 50, 50, this.x, this.y, this.width, this.height)
            break
        }
      }

      if (gameStates.currentBackgroundStyle === BackgroundStyles.Plastic) {
        canvas.context.drawImage(images.HolePlastic, drawingX, 0, 50, 50, this.x, this.y, this.width, this.height)
      }
    }
  }

  reset () {
    this.x = this.originalX
    this.y = this.originalY
    this.remainingIntersects = this.originalRemainingIntersects
    this.revealedHole = this.originalRevealedHole
  }
}

export class GrappleWeed extends GameObject {
  constructor (x, y, width, height, grip) {
    super(x, y, width, height)
    this.grip = grip
    this.originalGrip = grip
    this.escapeDirection = 'centre'
    this.holdingPlayer = false
    this.originalX = this.x
    this.originalY = this.y
  }

  Draw () {
    switch (gameStates.currentBackgroundStyle) {
      case BackgroundStyles.Classic:
        if (this.holdingPlayer) {
          switch (this.escapeDirection) {
            case 'left':
              canvas.context.drawImage(images.GrappleWeedHolding, 96, 0, 48, 48, this.x, this.y, this.width, this.height)
              break
            case 'right':
              canvas.context.drawImage(images.GrappleWeedHolding, 144, 0, 48, 48, this.x, this.y, this.width, this.height)
              break
            case 'up':
              canvas.context.drawImage(images.GrappleWeedHolding, 48, 0, 48, 48, this.x, this.y, this.width, this.height)
              break
            case 'down':
              canvas.context.drawImage(images.GrappleWeedHolding, 192, 0, 48, 48, this.x, this.y, this.width, this.height)
              break
            case 'centre':
              canvas.context.drawImage(images.GrappleWeedHolding, 0, 0, 50, 50, this.x, this.y, this.width, this.height)
              break
          }
        } else { canvas.context.drawImage(images.GrappleWeed, this.x, this.y, this.width, this.height) }
        break
      case BackgroundStyles.Plastic:
        canvas.context.fillStyle = 'green'
        canvas.context.fillRect(this.x, this.y, this.width, this.height)
        break
    }
  }

  reset () {
    this.grip = this.originalGrip
    this.escapeDirection = 'centre'
    this.holdingPlayer = false
    this.x = this.originalX
    this.y = this.originalY
  }
}
