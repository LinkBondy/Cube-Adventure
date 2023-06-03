'use strict'
const { images } = require('../drawing/Images')
const { draw } = require('../drawing/Draw')
const { gameStates, BackgroundStyles } = require('../data/GameData')
const { canvas } = require('../drawing/Canvas')
const { GameObject } = require('./Class')
export class Unlock extends GameObject {
  constructor (x, y, width, height, color1, color2, activatedcolor, title, colorNumber) {
    super(x, y, width, height, color1)
    this.original_x = this.x
    this.original_y = this.y
    this.color2 = color2
    this.activatedcolor = activatedcolor
    this.title = title
    this.colorNumber = colorNumber
  }

  update () {
    const self = this
    gameStates.CurrentLevel().players.forEach(function (player) {
      if (self.intersects(/* 0, */ player)) {
        gameStates.CurrentLevel().rocks.forEach(function (rock) {
          if (self.title === rock.title && rock.allowMovement === rock.originalAllowMovement) {
            rock.allowMovement = !rock.allowMovement
          }
        })
        gameStates.CurrentLevel().changeDirectionSquares.forEach(function (changeDirectionSquare) {
          if (self.title === changeDirectionSquare.title) {
            changeDirectionSquare.allowDirectionChange = true
          }
        })
        self.activated = true
      }
    })

    gameStates.CurrentLevel().enemies.forEach(function (enemy) {
      if (self.intersects(/* 1, */ enemy)) {
        gameStates.CurrentLevel().rocks.forEach(function (rock) {
          if (self.title === rock.title && rock.allowMovement === rock.originalAllowMovement) {
            rock.allowMovement = !rock.allowMovement
          }
        })
        gameStates.CurrentLevel().changeDirectionSquares.forEach(function (changeDirectionSquare) {
          if (self.title === changeDirectionSquare.title) {
            changeDirectionSquare.allowDirectionChange = true
          }
        })
        self.activated = true
      }
    })
  }

  Draw () {
    if ((this.x >= (gameStates.CurrentLevel().currentX - 1) * 850 && this.x < gameStates.CurrentLevel().currentX * 850) && (this.y >= (gameStates.CurrentLevel().currentY - 1) * 600 && this.y < gameStates.CurrentLevel().currentY * 600)) {
      if (gameStates.currentBackgroundStyle === BackgroundStyles.Classic) {
        if (this.colorNumber === 1) {
          if (this.activated) { draw.DrawImage(images.SwitchW1ActivatedBlue, this.x, this.y) } else { draw.DrawImage(images.SwitchW1Blue, this.x, this.y) }
        } else if (this.colorNumber === 2) {
          if (this.activated) { draw.DrawImage(images.SwitchW1ActivatedPurple, this.x, this.y) } else { draw.DrawImage(images.SwitchW1Purple, this.x, this.y) }
        }
      } else if (gameStates.currentBackgroundStyle === BackgroundStyles.Plastic) {
        canvas.context.fillStyle = this.color1
        canvas.context.fillRect(this.x, this.y, this.width, this.height)
        if (this.activated) { canvas.context.fillStyle = this.activatedcolor } else { canvas.context.fillStyle = this.color2 }
        canvas.context.fillRect(this.x + 10, this.y + 10, 30, 30)
      }
    }
  }

  reset () {
    this.x = this.original_x
    this.y = this.original_y
    this.activated = false
  }
};

export class Teleporter extends GameObject {
  constructor (x, y, width, height, teleportTo, colorNumber) {
    super(x, y, width, height)
    this.original_x = this.x
    this.original_y = this.y
    this.originalTeleportingX = undefined
    this.originalTeleportingY = undefined
    this.original_y = this.y
    this.colorNumber = colorNumber
    this.stop = false
    this.teleportTo = teleportTo
  }

  update () {
    const self = this
    gameStates.CurrentLevel().players.forEach(function (player) {
      gameStates.CurrentLevel().teleporters.forEach(function (teleporter) {
        if (self.intersects(player) && !self.stop) {
          if (self.teleportTo === teleporter.teleportTo && self.colorNumber === teleporter.colorNumber && self !== teleporter) {
            teleporter.stop = true
            player.y = teleporter.y
            player.x = teleporter.x
          }
        }
        if (!teleporter.intersects(player) && teleporter.stop) {
          self.stop = false
        }
      })
    })
  }

  Draw () {
    if ((this.x >= (gameStates.CurrentLevel().currentX - 1) * 850 && this.x < gameStates.CurrentLevel().currentX * 850) && (this.y >= (gameStates.CurrentLevel().currentY - 1) * 600 && this.y < gameStates.CurrentLevel().currentY * 600)) {
      if (gameStates.currentBackgroundStyle === BackgroundStyles.Classic) {
        if (this.colorNumber === 1) {
          draw.DrawImage(images.TeleporterTomatoSprite, this.x, this.y)
        }

        if (this.colorNumber === 2) {
          draw.DrawImage(images.TeleporterPurpleSprite, this.x, this.y)
        }
      } else if (gameStates.currentBackgroundStyle === BackgroundStyles.Plastic) {
        if (this.colorNumber === 1) {
          draw.DrawImage(images.TeleporterTomato, this.x, this.y)
        }

        if (this.colorNumber === 2) {
          draw.DrawImage(images.TeleporterPurple, this.x, this.y)
        }
      }
    }
  }

  reset () {
    this.x = this.original_x
    this.y = this.original_y
  }
};

export class Hole extends GameObject {
  constructor (x, y, width, height, fullHole, currentIntersects, maxIntersects) {
    super(x, y, width, height)
    this.original_x = this.x
    this.original_y = this.y
    this.fullHole = fullHole
    this.currentIntersects = currentIntersects
    this.originalCurrentIntersects = this.currentIntersects
    this.maxIntersects = maxIntersects
    this.previousIntersectsHole = false
    this.stopPlayer = false
    this.stopEnemy = false
    this.DrawingX = undefined
  }

  Draw () {
    if ((this.x >= (gameStates.CurrentLevel().currentX - 1) * 850 && this.x < gameStates.CurrentLevel().currentX * 850) && (this.y >= (gameStates.CurrentLevel().currentY - 1) * 600 && this.y < gameStates.CurrentLevel().currentY * 600)) {
      if (this.fullHole) { this.DrawingX = 100 } else if (this.currentIntersects < this.maxIntersects && this.currentIntersects !== 0) { this.DrawingX = 50 } else { this.DrawingX = 0 }

      if (gameStates.currentBackgroundStyle === BackgroundStyles.Classic) {
        canvas.context.drawImage(images.Hole, this.DrawingX, 0, 50, 50, this.x, this.y, this.width, this.height)
      }

      if (gameStates.currentBackgroundStyle === BackgroundStyles.Plastic) {
        canvas.context.drawImage(images.HolePlastic, this.DrawingX, 0, 50, 50, this.x, this.y, this.width, this.height)
      }
    }
  }

  update () {
    if (this.currentIntersects >= this.maxIntersects) {
      this.fullHole = true
    }
  }

  reset () {
    this.x = this.original_x
    this.y = this.original_y
    this.fullHole = false
    this.currentIntersects = this.originalCurrentIntersects
  }
}

export class FinishArea extends GameObject {
  constructor (x, y, width, height) {
    super(x, y, width, height, 'pink')
    this.original_x = this.x
    this.original_y = this.y
  }

  Draw () {
    if ((this.x >= (gameStates.CurrentLevel().currentX - 1) * 850 && this.x < gameStates.CurrentLevel().currentX * 850) && (this.y >= (gameStates.CurrentLevel().currentY - 1) * 600 && this.y < gameStates.CurrentLevel().currentY * 600)) {
      canvas.context.fillStyle = this.color1
      canvas.context.fillRect(this.x, this.y, this.width, this.height)
    }
  }

  reset () {
    this.x = this.original_x
    this.y = this.original_y
  }
};
