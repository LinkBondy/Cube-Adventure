const { images } = require('../drawing/Images')
const { draw } = require('../drawing/Draw')
const { cubeStyle, gameStates, BackgroundStyles } = require('../data/GameData')
const { canvas } = require('../drawing/Canvas')
const { GameObject } = require('./Class')
export class Enemy extends GameObject {
  constructor (x, y, width, height, directions, blockSpeed, waitTime) {
    super(x, y, width, height)
    // Moving
    this.directions = directions
    this.blockSpeed = blockSpeed
    // Waiting
    this.waitTime = waitTime
    this.timeoutID = undefined
    this.oldDate = undefined
    this.pausedDate = undefined
    // Original variables for reseting
    this.original_x = this.x
    this.original_y = this.y
    this.originalDirections = [...this.directions]
    this.original_blockSpeed = blockSpeed
    // Other
    this.inWater = undefined
    this.stopHole = false
    this.updatedDirections = false
    this.stopChangeDirection = false
    this.changeDirectionSquareUsed = false
  }

  reset () {
    // console.log(this.timeoutID)
    window.clearTimeout(this.timeoutID)
    // console.log(this.timeoutID)
    this.x = this.original_x
    this.y = this.original_y
    this.directions = [...this.originalDirections]
    this.blockSpeed = this.original_blockSpeed
    this.inWater = undefined
    this.updatedDirections = false
  }

  setTimer () {
    console.log('Before Change' + this.directions)
    if (this.timeoutID !== null && this.timeoutID !== undefined) {
      this.timeoutID = setTimeout(function () {
        this.action()
      }.bind(this), this.waitTime - (this.pausedDate - this.oldDate))
    }
    console.log('After Change' + this.directions)
  }

  stopTimer () {
    window.clearTimeout(this.timeoutID)
    this.pausedDate = new Date()
  }

  update (delta) {
    const oldX = this.x
    const oldY = this.y
    let currentBarrierIntersected
    let intersectsBarrier = false
    let intersectsWater = false
    const self = this
    const chooseDirection = []
    if (!this.updatedDirections) {
      for (let directionsCheck = 0; directionsCheck < this.directions.length; directionsCheck++) {
        if (this.directions[directionsCheck] === true) {
          chooseDirection.push(directionsCheck)
        }
      }

      if (chooseDirection.length >= 2) {
        const chooseMovement = Math.floor(Math.random() * chooseDirection.length + 1)
        // console.log(Math2)
        if (chooseMovement === 1) {
          for (let directionsSet = chooseDirection.length - 1; directionsSet >= 0; directionsSet--) {
            if (directionsSet !== 0) {
              this.directions[chooseDirection[directionsSet]] = false
            }
          }
        } else if (chooseMovement === 2) {
          for (let directionsSet = chooseDirection.length - 1; directionsSet >= 0; directionsSet--) {
            if (directionsSet !== 1) {
              this.directions[chooseDirection[directionsSet]] = false
            }
          }
        } else if (chooseMovement === 3) {
          for (let directionsSet = chooseDirection.length - 1; directionsSet >= 0; directionsSet--) {
            if (directionsSet !== 2) {
              this.directions[chooseDirection[directionsSet]] = false
            }
          }
        } else if (chooseMovement === 4) {
          for (let directionsSet = chooseDirection.length - 1; directionsSet >= 0; directionsSet--) {
            if (directionsSet !== 3) {
              this.directions[chooseDirection[directionsSet]] = false
            }
          }
        }
      }
      this.updatedDirections = true
    }
    // Left
    if (this.directions[0]) {
      this.x = this.x - this.blockSpeed * delta
    }

    // Right
    if (this.directions[1]) {
      this.x = this.x + this.blockSpeed * delta
    }

    // Up
    if (this.directions[2]) {
      this.y = this.y - this.blockSpeed * delta
      // console.log("Up")
    }

    // Down
    if (this.directions[3]) {
      this.y = this.y + this.blockSpeed * delta
      // console.log("Down")
    }

    // Check if touching changeDirectionSquares
    gameStates.CurrentLevel().changeDirectionSquares.forEach(function (changeDirectionSquare) {
      if (changeDirectionSquare.intersectsAll(self.blockSpeed / 2, self) && changeDirectionSquare.allowDirectionChange && !self.stopChangeDirection) {
        self.stopChangeDirection = true
        self.changeDirectionSquareUsed = changeDirectionSquare
        self.x = changeDirectionSquare.x
        self.y = changeDirectionSquare.y
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
        if (self.directions[0/* left */] || self.directions[1/* right */]) {
          if (changeDirectionSquare.changeUp) {
            self.directions[2/* up */] = true
          }

          if (changeDirectionSquare.changeDown) {
            self.directions[3/* down */] = true
          }
          self.directions[0/* left */] = false
          self.directions[1/* right */] = false
        } else if (self.directions[2/* up */] || self.directions[3/* down */]) {
          if (changeDirectionSquare.changeLeft) {
            self.directions[0/* left */] = true
          }

          if (changeDirectionSquare.changeRight) {
            self.directions[1/* right */] = true
          }
          self.directions[2/* up */] = false
          self.directions[3/* down */] = false
        }
      }
    })

    if (this.changeDirectionSquareUsed !== false && this.stopChangeDirection && !this.changeDirectionSquareUsed.intersectsAll(this.blockSpeed / 2, this)) {
      this.stopChangeDirection = false
      this.changeDirectionSquareUsed = false
    }

    // Check if touching walls
    gameStates.CurrentLevel().walls.forEach(function (wall) {
      if (wall.intersects(self) && !wall.AllowMovement(wall, 'enemy')) {
        intersectsBarrier = true
        currentBarrierIntersected = wall
      }
    })

    // Check if touching rocks
    gameStates.CurrentLevel().rocks.forEach(function (rock) {
      if (!rock.allowMovement && rock.intersects(self)) {
        intersectsBarrier = true
        currentBarrierIntersected = rock
      }
    })

    // Check if touching holes
    gameStates.CurrentLevel().holes.forEach(function (hole) {
      if (!hole.fullHole && hole.intersectsAll(0, self)) {
        hole.currentIntersects = hole.currentIntersects + 1
        self.stopHole = true
        hole.stopEnemy = true
      }

      if (hole.stopEnemy && self.stopHole && !hole.intersects(self)) {
        self.stopHole = false
        hole.stopEnemy = false
      }

      if (hole.fullHole && hole.intersects(self) && self.stopHole === false && hole.stopEnemy === false) {
        intersectsBarrier = true
        currentBarrierIntersected = hole
      }
    })

    // Check if touching waters
    gameStates.CurrentLevel().waters.forEach(function (water) {
      if (water.intersects(self)) {
        intersectsWater = true
      }
    })
    // Chnage speed if in/out water
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
        intersectsBarrier = true
        currentBarrierIntersected = finishArea
      }
    })

    if ((this.directions[0/* left */] && oldX < 0) || (this.directions[0/* left */] && intersectsBarrier)) {
      this.directions[0/* left */] = false
      if (currentBarrierIntersected !== undefined) { this.x = currentBarrierIntersected.x + currentBarrierIntersected.width } else { this.x = 0 }
      if (this.waitTime !== undefined && this.waitTime !== null) {
        this.oldDate = new Date()
        this.action = function () {
          self.directions[1/* right */] = true
          self.timeoutId = undefined
          // self.action = undefined
        }
        this.timeoutID = setTimeout(function () {
          self.action()
        }, self.waitTime)
      } else {
        this.directions[1/* right */] = true
      }
      return
    }

    if ((this.directions[1/* right */] && oldX > 850 * gameStates.CurrentLevel().width - this.width) || (this.directions[1/* right */] && intersectsBarrier)) {
      this.directions[1/* right */] = false
      if (currentBarrierIntersected !== undefined) { this.x = currentBarrierIntersected.x - 50 } else { this.x = 850 * gameStates.CurrentLevel().width - this.width }
      if (this.waitTime !== undefined) {
        this.oldDate = new Date()
        this.action = function () {
          self.directions[0/* left */] = true
          self.timeoutId = undefined
          // self.action = undefined
        }
        this.timeoutID = setTimeout(function () {
          self.action()
        }, self.waitTime)
      } else {
        this.directions[0/* left */] = true
      }
      return
    }

    if ((this.directions[2/* up */] && oldY < 0) || (this.directions[2/* up */] && intersectsBarrier)) {
      this.directions[2/* up */] = false
      if (currentBarrierIntersected !== undefined) { this.y = currentBarrierIntersected.y + currentBarrierIntersected.height } else { this.y = 0 }
      if (this.waitTime !== undefined) {
        this.oldDate = new Date()
        this.action = function () {
          self.directions[3/* down */] = true
          self.timeoutId = undefined
          // self.action = undefined
        }
        this.timeoutID = setTimeout(function () {
          self.action()
        }, self.waitTime)
      } else {
        this.directions[3/* down */] = true
      }
      return
    }

    if ((this.directions[3/* down */] && oldY > 600 * gameStates.CurrentLevel().height - this.height) || (this.directions[3/* down */] && intersectsBarrier)) {
      this.directions[3/* down */] = false
      if (currentBarrierIntersected !== undefined) { this.y = currentBarrierIntersected.y - 50 } else { this.y = 600 * gameStates.CurrentLevel().height - this.height }
      if (this.waitTime !== undefined) {
        this.oldDate = new Date()
        this.action = function () {
          self.directions[2/* up */] = true
          self.timeoutId = undefined
          // self.action = undefined
        }
        this.timeoutId = setTimeout(function () {
          self.action()
        }, self.waitTime)
      } else {
        this.directions[2/* up */] = true
      }
    }
  }

  Draw () {
    // if ((this.x >= (gameStates.CurrentLevel().currentX - 1) * 850 && this.x < gameStates.CurrentLevel().currentX * 850) && (this.y >= (gameStates.CurrentLevel().currentY - 1) * 600 && this.y < gameStates.CurrentLevel().currentY * 600)) {
    if (gameStates.currentBackgroundStyle === BackgroundStyles.Classic) {
      draw.DrawImage(images.RedCube, this.x, this.y)
    } else if (gameStates.currentBackgroundStyle === BackgroundStyles.Plastic) {
      draw.DrawImage(images.RedCubePlastic, this.x, this.y)
    }
  // }
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
    this.waterMovement = false
  }

  moveRight () {
    const oldX = this.x
    this.x = this.x + 50
    let intersectsBarrier = false
    const self = this
    gameStates.CurrentLevel().walls.forEach(function (wall) {
      if (!wall.AllowMovement(wall, 'player') && wall.intersects(self)) {
        intersectsBarrier = true
        gameStates.CurrentLevel().holes.forEach(function (hole) {
          hole.stopPlayer = true
        })
      }
    })

    gameStates.CurrentLevel().rocks.forEach(function (rock) {
      if (!rock.allowMovement && rock.intersects(self)) {
        intersectsBarrier = true
        gameStates.CurrentLevel().holes.forEach(function (hole) {
          hole.stopPlayer = true
        })
      }
    })

    gameStates.CurrentLevel().waters.forEach(function (water) {
      if (!self.waterMovement && water.intersects(self)) {
        intersectsBarrier = true
        gameStates.CurrentLevel().holes.forEach(function (hole) {
          hole.stopPlayer = true
        })
      }
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
      if (item.intersects(self) && !item.collected) {
        self.waterMovement = true
        item.UseItem(item, self)
      }
    })

    if (intersectsBarrier) {
      this.x = oldX
    }
    gameStates.CurrentLevel().holes.forEach(function (hole) {
      if (hole.stopPlayer) { hole.stopPlayer = false }
    })
  }

  moveLeft () {
    const oldX = this.x
    this.x = this.x - 50
    let intersectsBarrier = false
    const self = this
    gameStates.CurrentLevel().walls.forEach(function (wall) {
      if (!wall.AllowMovement(wall, 'player') && wall.intersects(self)) {
        intersectsBarrier = true
        gameStates.CurrentLevel().holes.forEach(function (hole) {
          hole.stopPlayer = true
        })
      }
    })

    gameStates.CurrentLevel().rocks.forEach(function (rock) {
      if (!rock.allowMovement && rock.intersects(self)) {
        intersectsBarrier = true
        gameStates.CurrentLevel().holes.forEach(function (hole) {
          hole.stopPlayer = true
        })
      }
    })

    gameStates.CurrentLevel().waters.forEach(function (water) {
      if (!self.waterMovement && water.intersects(self)) {
        intersectsBarrier = true
        gameStates.CurrentLevel().holes.forEach(function (hole) {
          hole.stopPlayer = true
        })
      }
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
      if (item.intersects(self) && !item.collected) {
        item.UseItem(item, self)
      }
    })

    if (intersectsBarrier) {
      this.x = oldX
    }
    gameStates.CurrentLevel().holes.forEach(function (hole) {
      if (hole.stopPlayer) { hole.stopPlayer = false }
    })
  }

  moveDown () {
    const oldY = this.y
    this.y = this.y + 50
    let intersectsBarrier = false
    const self = this
    gameStates.CurrentLevel().walls.forEach(function (wall) {
      if (!wall.AllowMovement(wall, 'player') && wall.intersects(self)) {
        intersectsBarrier = true
        gameStates.CurrentLevel().holes.forEach(function (hole) {
          hole.stopPlayer = true
        })
      }
    })

    gameStates.CurrentLevel().rocks.forEach(function (rock) {
      if (!rock.allowMovement && rock.intersects(self)) {
        intersectsBarrier = true
        gameStates.CurrentLevel().holes.forEach(function (hole) {
          hole.stopPlayer = true
        })
      }
    })

    gameStates.CurrentLevel().waters.forEach(function (water) {
      if (!self.waterMovement && water.intersects(self)) {
        intersectsBarrier = true
        gameStates.CurrentLevel().holes.forEach(function (hole) {
          hole.stopPlayer = true
        })
      }
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
      if (item.intersects(self) && !item.collected) {
        item.UseItem(item, self)
      }
    })

    if (intersectsBarrier) {
      this.y = oldY
    }
    gameStates.CurrentLevel().holes.forEach(function (hole) {
      if (hole.stopPlayer) { hole.stopPlayer = false }
    })
  }

  moveUp () {
    const oldY = this.y
    this.y = this.y - 50
    let intersectsBarrier = false
    const self = this
    gameStates.CurrentLevel().walls.forEach(function (wall) {
      if (!wall.AllowMovement(wall, 'player') && wall.intersects(self)) {
        intersectsBarrier = true
        gameStates.CurrentLevel().holes.forEach(function (hole) {
          hole.stopPlayer = true
        })
      }
    })

    gameStates.CurrentLevel().rocks.forEach(function (rock) {
      if (!rock.allowMovement && rock.intersects(self)) {
        intersectsBarrier = true
        gameStates.CurrentLevel().holes.forEach(function (hole) {
          hole.stopPlayer = true
        })
      }
    })

    gameStates.CurrentLevel().waters.forEach(function (water) {
      if (!self.waterMovement && water.intersects(self)) {
        intersectsBarrier = true
        gameStates.CurrentLevel().holes.forEach(function (hole) {
          hole.stopPlayer = true
        })
      }
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
      if (item.intersects(self) && !item.collected) {
        item.UseItem(item, self)
      }
    })

    if (intersectsBarrier) {
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

  update (delta) {
  }

  reset () {
    this.x = this.original_x
    this.y = this.original_y
    this.waterMovement = false
  }

  Draw () {
    if ((this.x >= (gameStates.CurrentLevel().currentX - 1) * 850 && this.x < gameStates.CurrentLevel().currentX * 850) && (this.y >= (gameStates.CurrentLevel().currentY - 1) * 600 && this.y < gameStates.CurrentLevel().currentY * 600)) {
      if (gameStates.currentCubeStyle === cubeStyle.Classic) { this.drawX = 0 } else if (gameStates.currentCubeStyle === cubeStyle.Alien) { this.drawX = 50 } else if (gameStates.currentCubeStyle === cubeStyle.Sad) { this.drawX = 100 } else if (gameStates.currentCubeStyle === cubeStyle.Happy) { this.drawX = 150 }

      if (gameStates.currentBackgroundStyle === BackgroundStyles.Classic) {
        canvas.context.drawImage(images.BlueCube, this.drawX, 0, 50, images.BlueCube.height, this.x, this.y, 50, images.BlueCube.height)
      } else if (gameStates.currentBackgroundStyle === BackgroundStyles.Plastic) {
        canvas.context.drawImage(images.BlueCubePlastic, this.drawX, 0, 50, images.BlueCubePlastic.height, this.x, this.y, 50, images.BlueCubePlastic.height)
      }
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
    if ((this.x >= (gameStates.CurrentLevel().currentX - 1) * 850 && this.x < gameStates.CurrentLevel().currentX * 850) && (this.y >= (gameStates.CurrentLevel().currentY - 1) * 600 && this.y < gameStates.CurrentLevel().currentY * 600)) {
      if (!this.allowDirectionChange) { canvas.context.fillStyle = this.color2 } else { canvas.context.fillStyle = this.color1 }
      canvas.context.fillRect(this.x, this.y, this.width, this.height)
    }
  }

  reset () {
    this.x = this.original_x
    this.y = this.original_y
    this.allowDirectionChange = this.allowDirectionChangeOld
  }
};
