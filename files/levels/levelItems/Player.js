'use strict'
const { images } = require('../../drawing/Images')
const { cubeStyle, gameStates, BackgroundStyles } = require('../../data/GameData')
const { canvas } = require('../../drawing/Canvas')
const { GameObject } = require('./Class')

export class Player extends GameObject {
  constructor (x, y, width, height) {
    super(x, y, width, height)
    // Original variables for reseting
    this.original_x = this.x
    this.original_y = this.y
    // Other
    this.speed = 50
    this.previousIntersectsHole = false
    this.waterMovement = false
  }

  moveLeft () {
    const oldX = this.x
    this.x -= this.speed
    const intersectsBarrier = this.checkMovement()

    this.adjustObjects(intersectsBarrier, 'left')

    if (intersectsBarrier) {
      this.x = oldX
    }
  }

  moveRight () {
    const oldX = this.x
    this.x += this.speed
    const intersectsBarrier = this.checkMovement()

    this.adjustObjects(intersectsBarrier, 'right')

    if (intersectsBarrier) {
      this.x = oldX
    }
  }

  moveUp () {
    const oldY = this.y
    this.y -= this.speed
    const intersectsBarrier = this.checkMovement()

    this.adjustObjects(intersectsBarrier, 'up')

    if (intersectsBarrier) {
      this.y = oldY
    }
  }

  moveDown () {
    const oldY = this.y
    this.y += this.speed
    const intersectsBarrier = this.checkMovement()

    this.adjustObjects(intersectsBarrier, 'down')

    if (intersectsBarrier) {
      this.y = oldY
    }
  }

  checkMovement () {
    const self = this
    let stop = false

    gameStates.CurrentLevel().walls.forEach(function (wall) {
      if (!wall.AllowMovement(wall, 'player') && wall.intersects(self)) {
        stop = true
      }
    })

    gameStates.CurrentLevel().rocks.forEach(function (rock) {
      if (!rock.allowMovement && rock.intersects(self)) {
        stop = true
      }
    })

    gameStates.CurrentLevel().crackedRocks.forEach(function (crackedRock) {
      if (!crackedRock.allowMovement && crackedRock.intersects(self)) {
        stop = true
      }
    })

    gameStates.CurrentLevel().waters.forEach(function (water) {
      if (!self.waterMovement && water.intersects(self)) {
        stop = true
      }
    })

    gameStates.CurrentLevel().grappleWeeds.forEach(function (grappleWeed) {
      if (self.captured && grappleWeed.holdingPlayer && grappleWeed.grip > 0) {
        stop = true
      }
    })

    if (stop === true) {
      return true
    }

    return false
  }

  adjustObjects (intersectsBarrier, direction) {
    const self = this
    gameStates.CurrentLevel().reverseTiles.forEach(function (reverseTile) {
      if (self.intersects(/* 0, */ reverseTile)) {
        gameStates.CurrentLevel().rocks.forEach(function (rock) {
          if (reverseTile.colorType === rock.colorType && reverseTile.activated === false) {
            rock.allowMovement = !rock.allowMovement
          }
        })
        gameStates.CurrentLevel().changeDirectionSquares.forEach(function (changeDirectionSquare) {
          if (reverseTile.colorType === changeDirectionSquare.colorType) {
            changeDirectionSquare.allowDirectionChange = true
          }
        })
        reverseTile.activated = true
      }
    })

    gameStates.CurrentLevel().holes.forEach(function (hole) {
      if (hole.previousIntersectsHole) {
        hole.previousIntersectsHole = false
        hole.remainingIntersects -= 1
        if (hole.remainingIntersects === 0) {
          hole.revealedHole = true
        }
      }

      if (hole.intersects(self) && !intersectsBarrier && !hole.revealedHole) {
        hole.previousIntersectsHole = true
      }
    })

    gameStates.CurrentLevel().items.forEach(function (item) {
      if (item.intersects(self) && !item.collected) {
        gameStates.CurrentLevel().storage.AddItem(item.type)
        item.collected = true
      }
    })

    gameStates.CurrentLevel().grappleWeeds.forEach(function (grappleWeed) {
      // If A grappleWeed's grip is zero and,
      // the player can move out from a grappleWeed from the chosen direction
      // AND the player is captured
      // AND a grappleWeed is holding the player
      // then reset the death clock and the grappleWeed
      if (!grappleWeed.intersects(self) && grappleWeed.grip <= 0 && grappleWeed.holdingPlayer && self.captured && !intersectsBarrier) {
        grappleWeed.reset()
        self.captured = false
        gameStates.CurrentLevel().switchClock(['death'], 'reset')
      }

      // If A grappleWeed is holding the player
      // AND the player is captured
      // then decrease the grip and the set the escape direction
      if (grappleWeed.holdingPlayer && self.captured) {
        if (grappleWeed.grip > 0) {
          grappleWeed.grip -= 1
        }
        grappleWeed.escapeDirection = direction
      }
    })

    gameStates.CurrentLevel().grappleWeeds.forEach(function (grappleWeed) {
      // If the player intersects the grappleWeed
      // AND a grappleWeed is not already holding the player
      // AND the player isn't captured
      if (grappleWeed.intersects(self) && !grappleWeed.holdingPlayer && !self.captured) {
        self.captured = true
        grappleWeed.holdingPlayer = true
        gameStates.CurrentLevel().switchClock(['death'], 'start')
      }
    })
  }

  Keydown (event, keybindArray) {
    // "Right" Arrow || "d" Key
    if (keybindArray[1/* right */].keybindA === event.key || keybindArray[1/* right */].keybindB === event.key) {
      this.moveRight()
      return
    }

    // "Down" Arrow || "s" Key
    if (keybindArray[3/* down */].keybindA === event.key || keybindArray[3/* down */].keybindB === event.key) {
      this.moveDown()
      return
    }

    // "Up" Arrow || "w" Key
    if (keybindArray[2/* up */].keybindA === event.key || keybindArray[2/* up */].keybindB === event.key) {
      this.moveUp()
      return
    }

    // "Left" Arrow || "a" Key
    if (keybindArray[0/* left */].keybindA === event.key || keybindArray[0/* left */].keybindB === event.key) {
      this.moveLeft()
    }
  }

  update () {
  }

  reset () {
    this.x = this.original_x
    this.y = this.original_y
    this.waterMovement = false
    this.captured = false
  }

  Draw () {
    let faceX = 0
    if ((this.x >= (gameStates.CurrentLevel().currentX - 1) * 850 && this.x < gameStates.CurrentLevel().currentX * 850) && (this.y >= (gameStates.CurrentLevel().currentY - 1) * 600 && this.y < gameStates.CurrentLevel().currentY * 600)) {
      if (gameStates.currentCubeStyle === cubeStyle.Classic) { faceX = 0 } else if (gameStates.currentCubeStyle === cubeStyle.Alien) { faceX = 22 } else if (gameStates.currentCubeStyle === cubeStyle.Sad) { faceX = 44 } else if (gameStates.currentCubeStyle === cubeStyle.Happy) { faceX = 66 }

      const /* let */ bodyX = 0
      /* if (this.pyro) {
        bodyX = 50
      } */
      const faceWidth = 20 * (this.width / 50)
      const faceHeight = 20 * (this.height / 50)

      if (gameStates.currentBackgroundStyle === BackgroundStyles.Classic) {
        if (!this.captured) {
          canvas.context.drawImage(images.PlayerBodies, bodyX, 0, 50, images.PlayerBodies.height, this.x, this.y, this.width, this.height)
          canvas.context.drawImage(images.PlayerFaces, faceX, 0, 20, images.PlayerFaces.height, this.x + 15, this.y + 15, faceWidth, faceHeight)
        }
      } else if (gameStates.currentBackgroundStyle === BackgroundStyles.Plastic) {
        canvas.context.drawImage(images.PlayerBodiesPlastic, bodyX, 0, 50, images.PlayerBodiesPlastic.height, this.x, this.y, this.width, this.height)
        canvas.context.drawImage(images.PlayerFacesPlastic, faceX, 0, 20, images.PlayerFacesPlastic.height, this.x + 15, this.y + 15, faceWidth, faceHeight)
      }
    }
  }
};
gameStates.currentCubeStyle = cubeStyle.BlueCube
