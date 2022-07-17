const { images } = require('../drawing/Images')
const { draw } = require('../drawing/Draw')
const { cubeStyle, gameStates, BackgroundStyles } = require('../data/GameData')
const { canvas } = require('../drawing/Canvas')
const { GameObject } = require('./Class')
export class Enemy extends GameObject {
  constructor (x, y, width, height, movesLeft, movesRight, movesUp, movesDown, blockSpeed, waitTime) {
    super(x, y, width, height)
    // Moving
    this.movesLeft = movesLeft
    this.movesRight = movesRight
    this.movesUp = movesUp
    this.movesDown = movesDown
    this.blockSpeed = blockSpeed
    // Waiting
    this.waitTime = waitTime
    this.timeoutID = undefined
    this.oldDate = undefined
    this.pausedDate = undefined
    // Original variables for reseting
    this.original_x = this.x
    this.original_y = this.y
    this.originalMovesLeft = this.movesLeft
    this.originalMovesRight = this.movesRight
    this.originalMovesUp = this.movesUp
    this.originalMovesDown = this.movesDown
    this.original_blockSpeed = blockSpeed
    // Other
    this.inWater = undefined
    this.stopHole = false
  }

  reset () {
    window.clearTimeout(this.timeoutID)
    this.x = this.original_x
    this.y = this.original_y
    this.movesLeft = this.originalMovesLeft
    this.movesRight = this.originalMovesRight
    this.movesUp = this.originalMovesUp
    this.movesDown = this.originalMovesDown
    this.blockSpeed = this.original_blockSpeed
    this.inWater = undefined
  }

  setTimer () {
    if (this.timeoutID !== null && this.timeoutID !== undefined) {
      this.timeoutID = setTimeout(function () {
        this.action()
      }.bind(this), this.waitTime - (this.pausedDate - this.oldDate))
    }
  }

  stopTimer () {
    window.clearTimeout(this.timeoutID)
    this.pausedDate = new Date()
  }

  update (delta) {
    const oldX = this.x
    const oldY = this.y
    let intersectsWall = false
    let intersectsWater = false
    const self = this
    if ((this.movesLeft && this.movesRight) || (this.movesUp && this.movesDown)) {
      const chooseMovement = Math.floor(Math.random() * 2 + 1)
      // console.log(Math2)
      if (chooseMovement === 1) {
        if (this.movesLeft && this.movesRight) {
          this.movesLeft = false
        }

        if (this.movesUp && this.movesDown) {
          this.movesUp = false
        }
      }

      if (chooseMovement === 2) {
        if (this.movesLeft && this.movesRight) {
          this.movesRight = false
        }

        if (this.movesUp && this.movesDown) {
          this.movesDown = false
        }
      }
    }
    // Move Enemy
    if (this.movesLeft) {
      this.x = this.x - this.blockSpeed * delta
    }

    if (this.movesRight) {
      this.x = this.x + this.blockSpeed * delta
    }

    if (this.movesUp) {
      this.y = this.y - this.blockSpeed * delta
    }

    if (this.movesDown) {
      this.y = this.y + this.blockSpeed * delta
    }

    // Check if touching changeDirectionSquares
    gameStates.CurrentLevel().changeDirectionSquares.forEach(function (changeDirectionSquare) {
      if (changeDirectionSquare.intersectsAll(self) && changeDirectionSquare.allowDirectionChange) {
        // console.log("hi")
        if ((changeDirectionSquare.changeLeft && changeDirectionSquare.changeRight) || (changeDirectionSquare.changeUp && changeDirectionSquare.changeDown)) {
          const chooseMovementChange = Math.floor(Math.random() * 2 + 1)

          if (chooseMovementChange === 1) {
            if (changeDirectionSquare.changeLeft && changeDirectionSquare.changeRight) { changeDirectionSquare.changeLeft = false }

            if (changeDirectionSquare.changeUp && changeDirectionSquare.changeDown) { changeDirectionSquare.changeUp = false }
          }

          if (chooseMovementChange === 2) {
            if (changeDirectionSquare.changeLeft && changeDirectionSquare.changeRight) { changeDirectionSquare.changeRight = false }

            if (changeDirectionSquare.changeUp && changeDirectionSquare.changeDown) { changeDirectionSquare.changeDown = false }
          }
        }
        if (self.movesLeft || self.movesRight) {
          if (changeDirectionSquare.changeUp) {
            self.movesUp = true
          }

          if (changeDirectionSquare.changeDown) {
            self.movesDown = true
          }
          self.movesLeft = false
          self.movesRight = false
        } else if (self.movesUp || self.movesDown) {
          if (changeDirectionSquare.changeLeft) {
            self.movesLeft = true
          }

          if (changeDirectionSquare.changeRight) {
            self.movesRight = true
          }
          self.movesUp = false
          self.movesDown = false
        }
      }
    })

    // Check if touching walls
    gameStates.CurrentLevel().walls.forEach(function (wall) {
      if (wall.intersects(self) && !wall.allowMovement) {
        intersectsWall = true
      }
    })

    // Check if touching rocks
    gameStates.CurrentLevel().rocks.forEach(function (rock) {
      if (!rock.allowMovement && rock.intersects(self)) {
        intersectsWall = true
      }
    })

    // Check if touching holes
    gameStates.CurrentLevel().holes.forEach(function (hole) {
      if (!hole.fullHole && hole.intersectsAll(self)) {
        hole.currentIntersects = hole.currentIntersects + 1
        self.stopHole = true
        hole.stopEnemy = true
      }

      if (hole.stopEnemy && self.stopHole && !hole.intersects(self)) {
        self.stopHole = false
        hole.stopEnemy = false
      }

      if (hole.fullHole && hole.intersects(self) && self.stopHole === false && hole.stopEnemy === false) {
        intersectsWall = true
      }
    })

    // Check if touching waters
    gameStates.CurrentLevel().waters.forEach(function (water) {
      if (water.intersects(self)) {
        intersectsWater = true
      }
    })
    // Chnage speed if in water
    if (intersectsWater && (this.inWater === false || this.inWater === undefined)) {
      this.blockSpeed = this.blockSpeed / 2
    }

    if (!intersectsWater && this.inWater === true) {
      this.blockSpeed = this.blockSpeed * 2
    }
    this.inWater = intersectsWater

    // Check if touching finishAreas
    gameStates.CurrentLevel().finishAreas.forEach(function (finishArea) {
      if (finishArea.intersects(self)) {
        intersectsWall = true
      }
    })

    if ((this.movesLeft && this.x <= (0 + 850 * (gameStates.CurrentLevel().width - 1))) || (this.movesLeft && intersectsWall)) {
      this.movesLeft = false
      this.x = oldX
      if (this.waitTime !== undefined && this.waitTime !== null) {
        this.oldDate = new Date()
        this.action = function () {
          self.movesRight = true
          self.timeoutId = undefined
          // self.action = undefined
        }
        this.timeoutID = setTimeout(function () {
          self.action()
        }, self.waitTime)
      } else {
        this.movesRight = true
      }
      return
    }

    if ((this.movesRight && this.x >= (850 * gameStates.CurrentLevel().width - this.width)) || (this.movesRight && intersectsWall)) {
      this.movesRight = false
      this.x = oldX
      if (this.waitTime !== undefined) {
        this.oldDate = new Date()
        this.action = function () {
          self.movesLeft = true
          self.timeoutId = undefined
          // self.action = undefined
        }
        this.timeoutID = setTimeout(function () {
          self.action()
        }, self.waitTime)
      } else {
        this.movesLeft = true
      }
      return
    }

    if ((this.movesUp && this.y <= (600 * (gameStates.CurrentLevel().height - 1))) || (this.movesUp && intersectsWall)) {
      this.movesUp = false
      this.y = oldY
      if (this.waitTime !== undefined) {
        this.oldDate = new Date()
        this.action = function () {
          self.movesDown = true
          self.timeoutId = undefined
          // self.action = undefined
        }
        this.timeoutID = setTimeout(function () {
          self.action()
        }, self.waitTime)
      } else {
        this.movesDown = true
      }
      return
    }

    if ((this.movesDown && this.y >= (600 * gameStates.CurrentLevel().height - this.height)) || (this.movesDown && intersectsWall)) {
      this.movesDown = false
      this.y = oldY
      if (this.waitTime !== undefined) {
        this.oldDate = new Date()
        this.action = function () {
          self.movesUp = true
          self.timeoutId = undefined
          // self.action = undefined
        }
        this.timeoutId = setTimeout(function () {
          self.action()
        }, self.waitTime)
      } else {
        this.movesUp = true
      }
    }
  }

  Draw () {
    if (gameStates.currentBackgroundStyle === BackgroundStyles.Classic) {
      draw.DrawImage(images.RedCube, this.x, this.y)
    } else if (gameStates.currentBackgroundStyle === BackgroundStyles.Plastic) {
      draw.DrawImage(images.RedCubePlastic, this.x, this.y)
    }
  }
};

export class Player extends GameObject {
  constructor (x, y, width, height) {
    super(x, y, width, height)
    // Original variables for reseting
    this.original_x = this.x
    this.original_y = this.y
    // Other
    this.previousIntersectsHole = false
  }

  moveRight () {
    const oldX = this.x
    this.x = this.x + 50
    let intersectsWall = false
    const self = this
    gameStates.CurrentLevel().walls.forEach(function (wall) {
      if (!wall.allowMovement && wall.intersects(self)) {
        intersectsWall = true
        gameStates.CurrentLevel().holes.forEach(function (hole) {
          hole.stopPlayer = true
        })
      }
    })

    gameStates.CurrentLevel().rocks.forEach(function (rock) {
      if (!rock.allowMovement && rock.intersects(self)) {
        intersectsWall = true
        gameStates.CurrentLevel().holes.forEach(function (hole) {
          hole.stopPlayer = true
        })
      }
    })

    gameStates.CurrentLevel().waters.forEach(function (water) {
      gameStates.CurrentLevel().items.forEach(function (item) {
        if (!item.allowMovementWater && item.typeNumber === 1 && water.intersects(self)) {
          intersectsWall = true
          gameStates.CurrentLevel().holes.forEach(function (hole) {
            hole.stopPlayer = true
          })
        }
      })
    })

    gameStates.CurrentLevel().holes.forEach(function (hole) {
      if (hole.intersects(self) && !hole.fullHole && !hole.stopPlayer) {
        hole.currentIntersects = hole.currentIntersects + 0.5
        hole.previousIntersectsHole = true
      }
      if (!hole.intersects(self) && hole.previousIntersectsHole && !hole.stopPlayer) {
        hole.currentIntersects = hole.currentIntersects + 0.5
        hole.previousIntersectsHole = false
      }
    })

    gameStates.CurrentLevel().items.forEach(function (item) {
      if (item.intersects(self)) {
        if (item.typeNumber === 1) {
          item.allowMovementWater = true
        }
        item.collected = true
      }
    })

    if (intersectsWall) {
      this.x = oldX
    }
    gameStates.CurrentLevel().holes.forEach(function (hole) {
      if (hole.stopPlayer) { hole.stopPlayer = false }
    })
  }

  moveLeft () {
    const oldX = this.x
    this.x = this.x - 50
    let intersectsWall = false
    const self = this
    gameStates.CurrentLevel().walls.forEach(function (wall) {
      if (!wall.allowMovement && wall.intersects(self)) {
        intersectsWall = true
        gameStates.CurrentLevel().holes.forEach(function (hole) {
          hole.stopPlayer = true
        })
      }
    })

    gameStates.CurrentLevel().rocks.forEach(function (rock) {
      if (!rock.allowMovement && rock.intersects(self)) {
        intersectsWall = true
        gameStates.CurrentLevel().holes.forEach(function (hole) {
          hole.stopPlayer = true
        })
      }
    })

    gameStates.CurrentLevel().waters.forEach(function (water) {
      gameStates.CurrentLevel().items.forEach(function (item) {
        if (!item.allowMovementWater && item.typeNumber === 1 && water.intersects(self)) {
          intersectsWall = true
          gameStates.CurrentLevel().holes.forEach(function (hole) {
            hole.stopPlayer = true
          })
        }
      })
    })

    gameStates.CurrentLevel().holes.forEach(function (hole) {
      if (hole.intersects(self) && !hole.fullHole && !hole.stopPlayer) {
        hole.currentIntersects = hole.currentIntersects + 0.5
        hole.previousIntersectsHole = true
      }
      if (!hole.intersects(self) && hole.previousIntersectsHole && !hole.stopPlayer) {
        hole.currentIntersects = hole.currentIntersects + 0.5
        hole.previousIntersectsHole = false
      }
    })

    gameStates.CurrentLevel().items.forEach(function (item) {
      if (item.intersects(self)) {
        if (item.typeNumber === 1) {
          item.allowMovementWater = true
        }
        item.collected = true
      }
    })

    if (intersectsWall) {
      this.x = oldX
    }
    gameStates.CurrentLevel().holes.forEach(function (hole) {
      if (hole.stopPlayer) { hole.stopPlayer = false }
    })
  }

  moveDown () {
    const oldY = this.y
    this.y = this.y + 50
    let intersectsWall = false
    const self = this
    gameStates.CurrentLevel().walls.forEach(function (wall) {
      if (!wall.allowMovement && wall.intersects(self)) {
        intersectsWall = true
        gameStates.CurrentLevel().holes.forEach(function (hole) {
          hole.stopPlayer = true
        })
      }
    })

    gameStates.CurrentLevel().rocks.forEach(function (rock) {
      if (!rock.allowMovement && rock.intersects(self)) {
        intersectsWall = true
        gameStates.CurrentLevel().holes.forEach(function (hole) {
          hole.stopPlayer = true
        })
      }
    })

    gameStates.CurrentLevel().waters.forEach(function (water) {
      gameStates.CurrentLevel().items.forEach(function (item) {
        if (!item.allowMovementWater && item.typeNumber === 1 && water.intersects(self)) {
          intersectsWall = true
          gameStates.CurrentLevel().holes.forEach(function (hole) {
            hole.stopPlayer = true
          })
        }
      })
    })

    gameStates.CurrentLevel().holes.forEach(function (hole) {
      if (hole.intersects(self) && !hole.fullHole && !hole.stopPlayer) {
        hole.currentIntersects = hole.currentIntersects + 0.5
        hole.previousIntersectsHole = true
      }
      if (!hole.intersects(self) && hole.previousIntersectsHole && !hole.stopPlayer) {
        hole.currentIntersects = hole.currentIntersects + 0.5
        hole.previousIntersectsHole = false
      }
    })

    gameStates.CurrentLevel().items.forEach(function (item) {
      if (item.intersects(self)) {
        if (item.typeNumber === 1) {
          item.allowMovementWater = true
        }
        item.collected = true
      }
    })

    if (intersectsWall) {
      this.y = oldY
    }
    gameStates.CurrentLevel().holes.forEach(function (hole) {
      if (hole.stopPlayer) { hole.stopPlayer = false }
    })
  }

  moveUp () {
    const oldY = this.y
    this.y = this.y - 50
    let intersectsWall = false
    const self = this
    gameStates.CurrentLevel().walls.forEach(function (wall) {
      if (!wall.allowMovement && wall.intersects(self)) {
        intersectsWall = true
        gameStates.CurrentLevel().holes.forEach(function (hole) {
          hole.stopPlayer = true
        })
      }
    })

    gameStates.CurrentLevel().rocks.forEach(function (rock) {
      if (!rock.allowMovement && rock.intersects(self)) {
        intersectsWall = true
        gameStates.CurrentLevel().holes.forEach(function (hole) {
          hole.stopPlayer = true
        })
      }
    })

    gameStates.CurrentLevel().waters.forEach(function (water) {
      gameStates.CurrentLevel().items.forEach(function (item) {
        if (!item.allowMovementWater && item.typeNumber === 1 && water.intersects(self)) {
          intersectsWall = true
          gameStates.CurrentLevel().holes.forEach(function (hole) {
            hole.stopPlayer = true
          })
        }
      })
    })

    gameStates.CurrentLevel().holes.forEach(function (hole) {
      if (hole.intersects(self) && !hole.fullHole && !hole.stopPlayer) {
        hole.currentIntersects = hole.currentIntersects + 0.5
        hole.previousIntersectsHole = true
      }
      if (!hole.intersects(self) && hole.previousIntersectsHole && !hole.stopPlayer) {
        hole.currentIntersects = hole.currentIntersects + 0.5
        hole.previousIntersectsHole = false
      }
    })

    gameStates.CurrentLevel().items.forEach(function (item) {
      if (item.intersects(self)) {
        if (item.typeNumber === 1) {
          item.allowMovementWater = true
        }
        item.collected = true
      }
    })

    if (intersectsWall) {
      this.y = oldY
    }
    gameStates.CurrentLevel().holes.forEach(function (hole) {
      if (hole.stopPlayer) { hole.stopPlayer = false }
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

  reset () {
    this.x = this.original_x
    this.y = this.original_y
  }

  update () {
  }

  Draw () {
    if (gameStates.currentCubeStyle === cubeStyle.Classic) { this.drawX = 0 } else if (gameStates.currentCubeStyle === cubeStyle.Alien) { this.drawX = 50 } else if (gameStates.currentCubeStyle === cubeStyle.Sad) { this.drawX = 100 } else if (gameStates.currentCubeStyle === cubeStyle.Happy) { this.drawX = 150 }

    if (gameStates.currentBackgroundStyle === BackgroundStyles.Classic) {
      canvas.context.drawImage(images.BlueCube, this.drawX, 0, 50, images.BlueCube.height, this.x, this.y, 50, images.BlueCube.height)
    } else if (gameStates.currentBackgroundStyle === BackgroundStyles.Plastic) {
      canvas.context.drawImage(images.BlueCubePlastic, this.drawX, 0, 50, images.BlueCubePlastic.height, this.x, this.y, 50, images.BlueCubePlastic.height)
    }
  }
};
gameStates.currentCubeStyle = cubeStyle.BlueCube

export class ChangeDirectionSquare extends GameObject {
  constructor (x, y, width, height, changeLeft, changeRight, changeUp, changeDown, allowDirectionChange, title) {
    super(x, y, width, height, 'red')
    this.original_x = this.x
    this.original_y = this.y
    this.color2 = 'orange'
    this.allowDirectionChangeOld = allowDirectionChange
    this.allowDirectionChange = allowDirectionChange
    this.changeLeft = changeLeft
    this.changeRight = changeRight
    this.changeUp = changeUp
    this.changeDown = changeDown
    this.title = title
  }

  Draw () {
    if (!this.allowDirectionChange) { canvas.context.fillStyle = this.color2 } else { canvas.context.fillStyle = this.color1 }
    canvas.context.fillRect(this.x, this.y, this.width, this.height)
  }

  reset () {
    this.x = this.original_x
    this.y = this.original_y
    this.allowDirectionChange = this.allowDirectionChangeOld
  }
};
