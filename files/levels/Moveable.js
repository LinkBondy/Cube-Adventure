const { images } = require('../drawing/Images')
const { draw } = require('../drawing/Draw')
const { cubeStyle, gameStates, BackgroundStyles, storyModeStates } = require('../data/GameData')
const { canvas } = require('../drawing/Canvas')
const { GameObject } = require('./Class')
export class Cuber extends GameObject {
  constructor (x, y, width, height, directions, blockSpeed, waitTime) {
    super(x, y, width, height)
    // Moving
    this.directions = directions
    this.blockSpeed = blockSpeed
    // Waiting
    this.waitTime = waitTime
    this.timeoutID = undefined
    this.oldDate = undefined
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
    if (this.timeoutID !== null && this.timeoutID !== undefined) {
      this.timeoutID = setTimeout(function () {
        this.action()
      }.bind(this), this.waitTime - (gameStates.pausedDate - this.oldDate))
    }
  }

  stopTimer () {
    window.clearTimeout(this.timeoutID)
  }

  update () {
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
      this.x = this.x - this.blockSpeed * gameStates.delta
    }

    // Right
    if (this.directions[1]) {
      this.x = this.x + this.blockSpeed * gameStates.delta
    }

    // Up
    if (this.directions[2]) {
      this.y = this.y - this.blockSpeed * gameStates.delta
    }

    // Down
    if (this.directions[3]) {
      this.y = this.y + this.blockSpeed * gameStates.delta
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

    gameStates.CurrentLevel().crackedRocks.forEach(function (crakedRock) {
      if (!crakedRock.allowMovement && crakedRock.intersects(self)) {
        intersectsBarrier = true
        currentBarrierIntersected = crakedRock
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
    if (gameStates.currentBackgroundStyle === BackgroundStyles.Classic) {
      draw.DrawImage(images.RedCube, this.x, this.y)
    } else if (gameStates.currentBackgroundStyle === BackgroundStyles.Plastic) {
      draw.DrawImage(images.RedCubePlastic, this.x, this.y)
    }
  }
};

export class Expander extends GameObject {
  constructor (x, y, startWidth, startHeight, endWidth, endHeight, direction, widthSpeed, heightSpeed, waitTime) {
    super(x, y, startWidth, startHeight)
    this.hitboxes = []
    this.originalX = this.x
    this.originalY = this.y
    this.startWidth = startWidth
    this.startHeight = startHeight
    this.endWidth = endWidth
    this.endHeight = endHeight
    this.widthSpeed = widthSpeed
    this.heightSpeed = heightSpeed
    this.waitTime = waitTime
    this.steps = waitTime - 350
    this.direction = direction
    this.originalDirection = this.direction
    if (this.direction === 'expanding') {
      this.width = this.startWidth
      this.height = this.startHeight
    }

    if (this.direction === 'shrinking') {
      this.width = this.endWidth
      this.height = this.endHeight
    }
    this.waiting = true
    this.animationFrames = 0
    this.animating = false
    this.animatingDirection = 'backwards'
  }

  Draw () {
    // const widthScale = 20 * (this.width / this.startWidth)
    // const heightScale = 10 * (this.height / this.startHeight)
    let expanderSpike
    if (gameStates.currentBackgroundStyle === BackgroundStyles.Classic) {
      expanderSpike = images.ExpanderSpike
    } else if (gameStates.currentBackgroundStyle === BackgroundStyles.Plastic) {
      expanderSpike = images.ExpanderSpikePlastic
    } else {
      console.log('Expander Draw: Background Not Found')
    }

    if (gameStates.currentStoryModeState === storyModeStates.Paused && this.animating) {
      this.animate(expanderSpike)
    } else if (this.animating) {
      switch (this.animatingDirection) {
        case 'forwards':
          this.animationFrames += 1
          this.animate()
          if (this.animationFrames === 28) {
            this.animating = false
          }
          break

        case 'backwards':
          this.animationFrames -= 1
          this.animate()
          if (this.animationFrames === 0) {
            this.animating = false
            this.animatingDirection = 'forwards'
          }
          break
      }
    }

    if (this.waiting === true && this.animating === false) {
      if (this.steps <= 280) {
        this.animating = true
        this.animationFrames = 28
        this.animatingDirection = 'backwards'
      }
      for (let x = this.left() + 10; x <= this.right() - 20; x += 10) {
        // Draw Top Spikes
        draw.DrawImage(expanderSpike, x, this.top())

        // Draw Bottom Spikes
        canvas.context.save()
        canvas.context.translate(x + 5, (this.bottom() - 5))
        canvas.context.rotate(180 * Math.PI / 180)
        canvas.context.scale(-1, 1)
        canvas.context.translate(-(x + 5), -(this.bottom() - 5))
        draw.DrawImage(expanderSpike, x, (this.bottom() - 10))
        canvas.context.restore()
      }

      for (let y = this.top() + 10; y <= this.bottom() - 20; y += 10) {
        // Draw Left Spikes
        canvas.context.save()
        canvas.context.translate(this.left() + 5, y + 5)
        canvas.context.rotate(270 * Math.PI / 180)
        canvas.context.translate(-(this.left() + 5), -(y + 5))
        draw.DrawImage(expanderSpike, this.left(), y)
        canvas.context.restore()

        // Draw Right Spikes
        canvas.context.save()
        canvas.context.translate(this.right() - 5, y + 5)
        canvas.context.rotate(90 * Math.PI / 180)
        canvas.context.scale(-1, 1)
        canvas.context.translate(-(this.right() - 5), -(y + 5))
        draw.DrawImage(expanderSpike, this.right() - 10, y)
        canvas.context.restore()
      }
    }
    canvas.context.fillStyle = 'purple'
    canvas.context.fillRect(this.x + 10, this.y + 10, this.width - 20, this.height - 20)

    // canvas.context.drawImage(images.Expander, 0, 0, images.Expander.width, images.Expander.height, this.x, this.y, this.width, this.height)
  }

  animate () {
    let expanderSpikeAnimation
    if (gameStates.currentBackgroundStyle === BackgroundStyles.Classic) {
      expanderSpikeAnimation = images.ExpanderSpikeAnimation
    } else if (gameStates.currentBackgroundStyle === BackgroundStyles.Plastic) {
      expanderSpikeAnimation = images.ExpanderSpikePlasticAnimation
    } else {
      console.log('Expander Draw: Background Not Found')
    }
    for (let x = this.left() + 10; x <= this.right() - 20; x += 10) {
      canvas.context.drawImage(expanderSpikeAnimation, 10 * this.animationFrames, 0, 10, expanderSpikeAnimation.height, x, this.top() - 2, 10, 22)

      canvas.context.save()
      canvas.context.translate(x + 5, (this.bottom() - 5))
      canvas.context.rotate(180 * Math.PI / 180)
      canvas.context.scale(-1, 1)
      canvas.context.translate(-(x + 5), -(this.bottom() - 5))
      canvas.context.drawImage(expanderSpikeAnimation, 10 * this.animationFrames, 0, 10, expanderSpikeAnimation.height, x, this.bottom() - 12, 10, 22)
      canvas.context.restore()
      // canvas.context.drawImage(images.ExpanderSpikesHorizontal, 0, 12, 10, 10, x, this.bottom() - 10, 10, 10)
    }

    for (let y = this.top() + 10; y <= this.bottom() - 20; y += 10) {
      canvas.context.save()
      canvas.context.translate(this.left() + 5, y + 5)
      canvas.context.rotate(270 * Math.PI / 180)
      canvas.context.translate(-(this.left() + 5), -(y + 5))
      canvas.context.drawImage(expanderSpikeAnimation, 10 * this.animationFrames, 0, 10, expanderSpikeAnimation.height, this.left(), y - 2, 10, 22)
      canvas.context.restore()

      canvas.context.save()
      canvas.context.translate(this.right() - 5, y + 5)
      canvas.context.rotate(90 * Math.PI / 180)
      canvas.context.scale(-1, 1)
      canvas.context.translate(-(this.right() - 5), -(y + 5))
      canvas.context.drawImage(expanderSpikeAnimation, 10 * this.animationFrames, 0, 10, expanderSpikeAnimation.height, this.right() - 10, y - 2, 10, 22)
      canvas.context.restore()
    }
  }

  update () {
    if (this.waiting) {
      this.steps -= 10
      if (this.steps <= 0) {
        this.steps = this.waitTime
        this.waiting = false
      }
    } else if (this.direction === 'expanding') {
      this.x -= this.widthSpeed / 2 * gameStates.delta
      this.y -= this.heightSpeed / 2 * gameStates.delta
      this.width += this.widthSpeed * gameStates.delta
      this.height += this.heightSpeed * gameStates.delta
      if (this.width === this.endWidth) {
        this.waiting = true
        this.animating = true
        this.direction = 'shrinking'
      }
    } else if (this.direction === 'shrinking') {
      this.x += this.widthSpeed / 2 * gameStates.delta
      this.y += this.heightSpeed / 2 * gameStates.delta
      this.width -= this.widthSpeed * gameStates.delta
      this.height -= this.heightSpeed * gameStates.delta
      if (this.width === this.startWidth) {
        this.waiting = true
        this.animating = true
        this.direction = 'expanding'
      }
    }
  }

  updateHitboxes () {
    if (!this.waiting) {
      const hitbox1 = {
        x: this.x + 10,
        y: this.y + 10,
        width: this.width - 20,
        height: this.height - 20
      }
      // console.log(hitbox1)
      this.hitboxes = [hitbox1]
    } else {
      if (!this.animating) {
        const hitbox1 = {
          x: this.x,
          y: this.y + 10,
          width: this.width,
          height: this.height - 20
        }
        const hitbox2 = {
          x: this.x + 10,
          y: this.y,
          width: this.width - 20,
          height: this.height
        }
        this.hitboxes = [hitbox1, hitbox2]
      } else {
        let offset = -10
        if (this.animationFrames <= 1) {
          offset = -10
        }
        if (this.animationFrames === 2) {
          offset = -9
        }
        if (this.animationFrames === 3) {
          offset = -8
        }
        if (this.animationFrames >= 4 && this.animationFrames <= 5) {
          offset = -7
        }
        if (this.animationFrames === 6) {
          offset = -6
        }
        if (this.animationFrames >= 7 && this.animationFrames <= 8) {
          offset = -5
        }
        if (this.animationFrames === 9) {
          offset = -4
        }
        if (this.animationFrames >= 10 && this.animationFrames <= 11) {
          offset = -3
        }
        if (this.animationFrames === 12) {
          offset = -2
        }
        if (this.animationFrames === 13) {
          offset = -1
        }
        if (this.animationFrames >= 14 && this.animationFrames <= 16) {
          offset = 0
        }
        if (this.animationFrames === 17) {
          offset = 1
        }
        if (this.animationFrames >= 18 && this.animationFrames <= 22) {
          offset = 2
        }
        if (this.animationFrames >= 23 && this.animationFrames <= 26) {
          offset = 1
        }
        if (this.animationFrames >= 27 && this.animationFrames <= 28) {
          offset = 0
        }
        const hitbox1 = {
          x: this.x - offset,
          y: this.y + 10,
          width: this.width + offset * 2,
          height: this.height - 20
        }
        const hitbox2 = {
          x: this.x + 10,
          y: this.y - offset,
          width: this.width - 20,
          height: this.height + offset * 2
        }
        this.hitboxes = [hitbox1, hitbox2]
      }
    }
    for (let i = 0; i < this.hitboxes.length; i++) {
      const currentHitbox = this.hitboxes[i]
      currentHitbox.left = function () { return currentHitbox.x }
      currentHitbox.right = function () { return currentHitbox.x + currentHitbox.width }
      currentHitbox.top = function () { return currentHitbox.y }
      currentHitbox.bottom = function () { return currentHitbox.y + currentHitbox.height }
    }
  }

  reset () {
    this.x = this.originalX
    this.y = this.originalY
    this.direction = this.originalDirection
    if (this.direction === 'expanding') {
      this.width = this.startWidth
      this.height = this.startHeight
    }
    if (this.direction === 'shrinking') {
      this.width = this.endWidth
      this.height = this.endHeight
    }
    this.steps = this.waitTime - 350
    this.waiting = true
    this.animationFrames = 0
    this.animating = false
    this.animatingDirection = 'backwards'
  }
};

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

    this.adjustObjects(intersectsBarrier)

    if (intersectsBarrier) {
      this.x = oldX
    }
  }

  moveRight () {
    const oldX = this.x
    this.x += this.speed
    const intersectsBarrier = this.checkMovement()

    this.adjustObjects(intersectsBarrier)

    if (intersectsBarrier) {
      this.x = oldX
    }
  }

  moveUp () {
    const oldY = this.y
    this.y -= this.speed
    const intersectsBarrier = this.checkMovement()

    this.adjustObjects(intersectsBarrier)

    if (intersectsBarrier) {
      this.y = oldY
    }
  }

  moveDown () {
    const oldY = this.y
    this.y += this.speed
    const intersectsBarrier = this.checkMovement()

    this.adjustObjects(intersectsBarrier)

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

    if (stop === true) {
      return true
    }

    return false
  }

  adjustObjects (intersectsBarrier) {
    const self = this
    gameStates.CurrentLevel().holes.forEach(function (hole) {
      if (hole.intersects(self) && !hole.fullHole && !intersectsBarrier) {
        hole.currentIntersects = hole.currentIntersects + 0.5
        hole.previousIntersectsHole = true
      }
      if (!hole.intersects(self) && hole.previousIntersectsHole && !intersectsBarrier) {
        hole.currentIntersects = hole.currentIntersects + 0.5
        hole.previousIntersectsHole = false
      }
    })

    gameStates.CurrentLevel().items.forEach(function (item) {
      if (item.intersects(self) && !item.collected) {
        gameStates.CurrentLevel().storage.AddItem(item.type)
        item.collected = true
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
