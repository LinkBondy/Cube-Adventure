'use strict'
const { images } = require('../drawing/Images')
const { draw } = require('../drawing/Draw')
const { gameStates, BackgroundStyles } = require('../data/GameData')
const { canvas } = require('../drawing/Canvas')
const { GameObject } = require('./Class')
export class ReverseTile extends GameObject {
  constructor (x, y, width, height, colorType) {
    super(x, y, width, height)
    this.original_x = this.x
    this.original_y = this.y
    this.borderColour = 'rgb(150, 150, 150)'
    this.deactivatedColorA = 'rgb(49, 141, 165)'
    this.activatedColorA = 'rgb(0, 241, 254)'
    this.deactivatedColorB = 'rgb(204, 153, 204)'
    this.activatedColorB = 'rgb(242, 124, 238)'
    this.colorType = colorType
    this.activated = false
  }

  update () {
    const self = this
    gameStates.CurrentLevel().players.forEach(function (player) {
      if (self.intersects(/* 0, */ player)) {
        gameStates.CurrentLevel().rocks.forEach(function (rock) {
          if (self.colorType === rock.colorType && rock.allowMovement === rock.originalAllowMovement) {
            rock.allowMovement = !rock.allowMovement
          }
        })
        gameStates.CurrentLevel().changeDirectionSquares.forEach(function (changeDirectionSquare) {
          if (self.colorType === changeDirectionSquare.colorType) {
            changeDirectionSquare.allowDirectionChange = true
          }
        })
        self.activated = true
      }
    })

    gameStates.CurrentLevel().enemies.forEach(function (enemy) {
      if (self.intersects(/* 1, */ enemy)) {
        gameStates.CurrentLevel().rocks.forEach(function (rock) {
          if (self.colorType === rock.colorType && rock.allowMovement === rock.originalAllowMovement) {
            rock.allowMovement = !rock.allowMovement
          }
        })
        gameStates.CurrentLevel().changeDirectionSquares.forEach(function (changeDirectionSquare) {
          if (self.colorType === changeDirectionSquare.colorType) {
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
        let image
        if (!this.activated) {
          switch (this.colorType) {
            case 'blue':
              image = images.SwitchW1Blue
              break

            case 'pink':
              image = images.SwitchW1Purple
              break
          }
        } else if (this.activated) {
          switch (this.colorType) {
            case 'blue':
              image = images.SwitchW1ActivatedBlue
              break

            case 'pink':
              image = images.SwitchW1ActivatedPurple
              break
          }
        }
        draw.DrawImage(image, this.x, this.y)
      } else if (gameStates.currentBackgroundStyle === BackgroundStyles.Plastic) {
        canvas.context.fillStyle = this.borderColour
        canvas.context.fillRect(this.x, this.y, this.width, this.height)
        if (!this.activated) {
          switch (this.colorType) {
            case 'blue':
              canvas.context.fillStyle = this.deactivatedColorA
              break

            case 'pink':
              canvas.context.fillStyle = this.deactivatedColorB
              break
          }
        } else if (this.activated) {
          switch (this.colorType) {
            case 'blue':
              canvas.context.fillStyle = this.activatedColorA
              break

            case 'pink':
              canvas.context.fillStyle = this.activatedColorB
              break
          }
        }
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
        switch (gameStates.levelController.currentWorld) {
          case 1:
            canvas.context.drawImage(images.Hole, this.DrawingX, 0, 50, 50, this.x, this.y, this.width, this.height)
            break
          case 3 :
            canvas.context.drawImage(images.UndergroundHole, this.DrawingX, 0, 50, 50, this.x, this.y, this.width, this.height)
            break
        }
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
      if (gameStates.currentBackgroundStyle === BackgroundStyles.Classic) {
        for (let x = this.left(); x < this.right(); x += 50) {
          for (let y = this.top(); y < this.bottom(); y += 50) {
            draw.DrawImage(images.finishLine, x, y)
          }
        }
      } else if (gameStates.currentBackgroundStyle === BackgroundStyles.Plastic) {
        canvas.context.fillStyle = this.color1
        canvas.context.fillRect(this.x, this.y, this.width, this.height)
      }
    }
  }

  reset () {
    this.x = this.original_x
    this.y = this.original_y
  }
};
