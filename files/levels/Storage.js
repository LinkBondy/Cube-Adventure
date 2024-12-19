'use strict'
const { images } = require('../drawing/Images')
const { draw } = require('../drawing/Draw')
const { gameStates, BackgroundStyles, drawUpdate, eventFunctions } = require('../data/GameData')
const { canvas } = require('../drawing/Canvas')

export class Storage {
  constructor (items) {
    this.items = items
    this.slotRow = 2
    this.slotCol = 2
    this.rowIndex = 0
    this.colIndex = 0
  }

  Draw () {
    let totalItemsDrawn = 0
    const self = this
    for (let row = 0; row < this.slotRow; row++) {
      for (let col = 0; col < this.slotCol; col++) {
        this.DrawBorder(row, col)
        if (self.items.length > totalItemsDrawn) {
          this.DrawItems(row, col, totalItemsDrawn)
          if (this.items[totalItemsDrawn].availableFunctions[2]) {
            this.DrawSlotAcessories(row, col, totalItemsDrawn)
          }
          totalItemsDrawn += 1
        }
      }
    }
  }

  DrawBorder (row, col) {
    const startCol = 850 + 16
    const startRow = 200
    draw.DrawImage(images.Frame, 120 * col + startCol, 125 * row + startRow)
  }

  DrawItems (row, col, totalItemsDrawn) {
    const startCol = 850 + 25
    const startRow = 200 + 10
    let image = images.BlueCube
    switch (this.items[totalItemsDrawn].tag) {
      case 'lifeJacket':
        if (gameStates.currentBackgroundStyle === BackgroundStyles.Classic) {
          image = images.LifeJacket_80x80
        }
        if (gameStates.currentBackgroundStyle === BackgroundStyles.Plastic) {
          image = images.LifeJacketPlastic_80x80
        }
        break

      case 'threeBead':
        if (gameStates.currentBackgroundStyle === BackgroundStyles.Classic) {
          image = images.ThreeBead_80x80
        }
        if (gameStates.currentBackgroundStyle === BackgroundStyles.Plastic) {
          image = images.ThreeBeadPlastic_80x80
        }
        break

      case 'pickaxe':
        if (gameStates.currentBackgroundStyle === BackgroundStyles.Classic) {
          image = images.Pickaxe_80x80
        }
        if (gameStates.currentBackgroundStyle === BackgroundStyles.Plastic) {
          image = images.PickaxePlastic_80x80
        }
        break

      default:
        if (gameStates.currentBackgroundStyle === BackgroundStyles.Classic) {
          image = images.BlueCube
        }
        if (gameStates.currentBackgroundStyle === BackgroundStyles.Plastic) {
          image = images.BlueCubePlastic_80x80
        }
        break
    }
    draw.DrawImage(image, 120 * col + startCol, 125 * row + startRow)
  }

  DrawSlotAcessories (row, col, totalItemsDrawn) {
    const startCol = 850 + 80
    const startRow = 258 + 10

    // Draw Background
    canvas.context.fillStyle = 'rgba(255, 255, 255, 0.5)'
    canvas.context.fillRect(120 * col + startCol - 20, 125 * row + startRow - 4, 50, 30)

    // Draw Slot Number
    canvas.context.fillStyle = 'rgba(0, 0, 0, 0.5)'
    canvas.context.font = '23px Arial'
    canvas.context.textAlign = 'right'
    canvas.context.textBaseline = 'top'
    canvas.context.fillText(this.items[totalItemsDrawn].startKey, 120 * col + startCol, 125 * row + startRow)

    // Draw Activated Icon
    canvas.context.textAlign = 'left'
    canvas.context.textBaseline = 'alphabetic'
    let image
    if (this.items[totalItemsDrawn].activated) {
      image = images.activated
    }

    if (!this.items[totalItemsDrawn].activated) {
      image = images.notActivated
    }
    canvas.context.drawImage(image, 0, 0, image.width, image.height, 120 * col + startCol + 5, 125 * row + startRow - 1, 23, 23)
  }

  ChangeActivation (slot) {
    this.items[slot].activated = !this.items[slot].activated
    if (this.items[slot].activated) {
      this.items[slot].Activate()
    } else {
      this.items[slot].Deactivate()
    }
  }

  AddItem (item) {
    if (item === 'lifeJacket') {
      this.items.push(new LifeJacketItem())
    }
    if (item === 'threeBead') {
      this.items.push(new ThreeBeadItem())
    }
    if (item === 'pickaxe') {
      this.items.push(new PickaxeItem(this.rowIndex, this.colIndex))
    }

    if (this.items[this.items.length - 1].availableFunctions[0]) {
      this.items[this.items.length - 1].OnPickUp()
    }

    if (this.colIndex > 1) {
      this.rowIndex += 1
      this.colIndex = 0
    } else {
      this.colIndex += 1
    }
  }

  Start () {
    let totalItemsDrawn = 0
    for (let row = 0; row < this.slotRow; row++) {
      for (let col = 0; col < this.slotCol; col++) {
        if (this.items.length > totalItemsDrawn) {
          this.items[totalItemsDrawn].row = row
          this.items[totalItemsDrawn].col = col
        }
        totalItemsDrawn += 1
      }
    }
  }
}

export class LifeJacketItem {
  constructor () {
    this.tag = 'lifeJacket'
    this.availableFunctions = [true, false, false]
  }

  OnPickUp () {
    gameStates.CurrentLevel().players.forEach(function (player) {
      player.waterMovement = true
    })
  }
}

export class ThreeBeadItem {
  constructor () {
    this.tag = 'threeBead'
    this.availableFunctions = [false, true, false]
  }

  OnExit () {
    gameStates.FindLevel(0, 8).items.splice(1, 1)
    drawUpdate.blueCubeAlienLock = false
  }
}

export class PickaxeItem {
  constructor (row, col) {
    this.row = row
    this.col = col
    //
    this.tag = 'pickaxe'
    this.activated = false
    this.availableFunctions = [false, false, true]
    this.startKey = 'p'
  }

  Keydown (event) {
    const self = this
    if (this.activated) {
      gameStates.CurrentLevel().players.forEach(function (player) {
        gameStates.CurrentLevel().crackedRocks.forEach(function (crackedRock) {
          if (!crackedRock.allowMovement) {
            if (gameStates.keybindController.keybinds[0/* left */].keybindA === event.key || gameStates.keybindController.keybinds[0/* left */].keybindB === event.key) {
              self.MineLeft(player, crackedRock)
            }

            if (gameStates.keybindController.keybinds[1/* right */].keybindA === event.key || gameStates.keybindController.keybinds[1/* right */].keybindB === event.key) {
              self.MineRight(player, crackedRock)
            }

            if (gameStates.keybindController.keybinds[2/* up */].keybindA === event.key || gameStates.keybindController.keybinds[2/* up */].keybindB === event.key) {
              self.MineUp(player, crackedRock)
            }

            if (gameStates.keybindController.keybinds[3/* down */].keybindA === event.key || gameStates.keybindController.keybinds[3/* down */].keybindB === event.key) {
              self.MineDown(player, crackedRock)
            }
          }
        })
      })
    }

    // Keydown 'p to select pickaxe, direction to use pickaxe"
    if (event.key === this.startKey) {
      this.activated = !this.activated
    }
  }

  Mousedown (event) {
    const self = this
    const offestX = 850 * (gameStates.CurrentLevel().currentX - 1)
    const offsetY = 600 * (gameStates.CurrentLevel().currentY - 1)
    if (this.activated) {
      gameStates.CurrentLevel().players.forEach(function (player) {
        gameStates.CurrentLevel().crackedRocks.forEach(function (crackedRock) {
          if (!crackedRock.allowMovement) {
            if (eventFunctions.isTouching(player.x - 50 - offestX, player.y - offsetY, 50, 50, event)) {
              self.MineLeft(player, crackedRock)
            }

            if (eventFunctions.isTouching(player.x + 50 - offestX, player.y - offsetY, 50, 50, event)) {
              self.MineRight(player, crackedRock)
            }

            if (eventFunctions.isTouching(player.x - offestX, player.y - 50 - offsetY, 50, 50, event)) {
              self.MineUp(player, crackedRock)
            }

            if (eventFunctions.isTouching(player.x - offestX, player.y + 50 - offsetY, 50, 50, event)) {
              self.MineDown(player, crackedRock)
            }
          }
        })
      })
    }
    if (eventFunctions.isTouching(120 * this.col + 850 + 16, 125 * this.row + 200, 100, 100, event)) {
      this.activated = !this.activated
    }
  }

  MineLeft (player, crackedRock) {
    player.x -= 50
    if (crackedRock.intersects(player)) {
      this.Mine(crackedRock)
    }
    player.x += 50
  }

  MineRight (player, crackedRock) {
    player.x += 50
    if (crackedRock.intersects(player)) {
      this.Mine(crackedRock)
    }
    player.x -= 50
  }

  MineUp (player, crackedRock) {
    player.y -= 50
    if (crackedRock.intersects(player)) {
      this.Mine(crackedRock)
    }
    player.y += 50
  }

  MineDown (player, crackedRock) {
    player.y += 50
    if (crackedRock.intersects(player)) {
      this.Mine(crackedRock)
    }
    player.y -= 50
  }

  Mine (crackedRock) {
    crackedRock.cracks += 1
    if (crackedRock.cracks >= 4) {
      crackedRock.allowMovement = true
      eventFunctions.stopMovement = true
    }
  }
}
