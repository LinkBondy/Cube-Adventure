'use strict'
const { canvas } = require('../drawing/Canvas')
const { gameStates, eventFunctions } = require('../data/GameData')

export class KeybindController {
  constructor () {
    this.keybindSelectors = []
  }

  start () {
    for (let selector = 0; selector < this.keybindSelectors.length; selector++) {
      this.keybindSelectors[selector].start()
    }
  }

  setupKeybinds () {
    this.keybindSelectors.push(new KeybindSelector([
      new Keybind('Left', 1, 'ArrowLeft', 'a'),
      new Keybind('Right', 2, 'ArrowRight', 'd'),
      new Keybind('Up', 3, 'ArrowUp', 'w'),
      new Keybind('Down', 4, 'ArrowDown', 's'),
      new Keybind('Select', 5, ' ', 'Enter', 'Space'),
      new Keybind('Back', 6, 'Backspace', 'b')
    ], 'basicKeybinds', 0, 0, 600, 15))

    this.keybindSelectors.push(new KeybindSelector([
      new Keybind('Pickaxe Activate', 1, 'p', 'P')
    ], 'specialKeybinds', 0, 0, 300, 35))
  }

  checkKeybinds (keybind) {
    for (let s = 0; s < this.keybindSelectors.length; s++) {
      for (let keybindNumber = 0; keybindNumber < this.keybindSelectors[s].keybinds.length; keybindNumber++) {
        if (keybind === this.keybindSelectors[s].keybinds[keybindNumber].keybindA || keybind === this.keybindSelectors[s].keybinds[keybindNumber].keybindB) {
          return false
        }
      }
    }
    return true
  }

  load (savedArray) {
    for (let k = 0; k < this.keybindSelectors.length; k++) {
      if (savedArray[k].length === this.keybindSelectors[k].keybinds.length) {
        this.keybindSelectors[k].keybinds = []
        for (let keybindsLoaded = 0; keybindsLoaded < savedArray[k].length; keybindsLoaded++) {
          const loadingArray = savedArray[k][keybindsLoaded]
          this.keybindSelectors[k].keybinds.push(new Keybind(loadingArray.name, loadingArray.value, loadingArray.keybindA, loadingArray.keybindB, loadingArray.displayNameA, loadingArray.displayNameB))
        }
      }
    }
  }
}

class KeybindSelector {
  constructor (keybinds, title, x, y, height, offset) {
    this.keybinds = keybinds
    this.originalKeybinds = this.keybinds
    this.title = title
    this.x = x
    this.y = y
    this.height = height
    this.offset = offset
    //
    this.selectingKeybind = false
    this.triedRebinding = false
    this.currentMenuItem = undefined
    this.currentKeybind = undefined
    this.currentType = undefined
  }

  Draw () {
    for (let k = 0; k < this.keybinds.length; k++) {
      this.keybinds[k].Draw()
    }

    canvas.context.font = '40px Arial'
    canvas.context.fillStyle = 'darkgray'
    canvas.context.fillText('Reset', 10 + this.x, (this.keybinds.length) * this.heightPerItem + (this.heightPerItem - this.offset) + this.y)
  }

  start () {
    for (let k = 0; k < this.keybinds.length; k++) {
      this.heightPerItem = this.height / (this.keybinds.length + 1)
      this.keybinds[k].x = 10 + this.x
      this.keybinds[k].y = k * this.heightPerItem + (this.heightPerItem - this.offset) + this.y
    }
  }

  startRebind (type, keybindNumber, usedMenuItem) {
    this.selectingKeybind = true
    this.currentKeybind = this.keybinds[keybindNumber - 1]
    this.currentMenuItem = usedMenuItem
    this.currentType = type
  }

  setKeybinds (event) {
    if (gameStates.keybindController.checkKeybinds(event.key)) {
      console.log(event.key)
      console.log(event)
      switch (this.currentType) {
        case 'A':
          if (event.key === ' ') { this.currentKeybind.displayNameA = 'Space' } else if (event.key === 'Dead') {
            this.currentKeybind.displayNameA = event.code + '+'
            if (event.altKey) {
              this.currentKeybind.displayNameA = this.currentKeybind.displayNameA + 'alt'
              if (event.shiftKey) {
                this.currentKeybind.displayNameA = this.currentKeybind.displayNameA + '+'
              }
            }
            if (event.shiftKey) {
              this.currentKeybind.displayNameA = this.currentKeybind.displayNameA + 'shift'
            }
          } else {
            this.currentKeybind.displayNameA = event.key
          }
          ///
          this.currentKeybind.keybindA = event.key
          this.currentMenuItem.title = this.currentKeybind.displayNameA
          break
        case 'B':
          if (event.key === ' ') { this.currentKeybind.displayNameB = 'Space' } else if (event.key === 'Dead') {
            this.currentKeybind.displayNameB = event.code + '+'
            if (event.altKey) {
              this.currentKeybind.displayNameB = this.currentKeybind.displayNameB + 'alt'
              if (event.shiftKey) {
                this.currentKeybind.displayNameB = this.currentKeybind.displayNameB + '+'
              }
            }
            if (event.shiftKey) {
              this.currentKeybind.displayNameB = this.currentKeybind.displayNameB + 'shift'
            }
          } else {
            this.currentKeybind.displayNameB = event.key
          }
          ///
          this.currentKeybind.keybindB = event.key
          this.currentMenuItem.title = this.currentKeybind.displayNameB
          break
      }
      this.finishRebinding()
    } else {
      this.triedRebinding = true
    }
  }

  finishRebinding () {
    this.selectingKeybind = false
    this.triedRebinding = false
    eventFunctions.stopMouseUp = true
    this.currentMenuItem = undefined
    this.currentKeybind = undefined
    this.currentType = undefined
  }

  resetKeybinds (type) {
    for (let keybindNumber = 0; keybindNumber !== this.keybinds.length; keybindNumber++) {
      switch (type) {
        case 'A':
          this.keybinds[keybindNumber].keybindA = this.originalKeybinds[keybindNumber].keybindA
          this.keybinds[keybindNumber].displayNameA = this.originalKeybinds[keybindNumber].displayNameA
          break

        case 'B':
          this.keybinds[keybindNumber].keybindB = this.originalKeybinds[keybindNumber].keybindB
          this.keybinds[keybindNumber].displayNameB = this.originalKeybinds[keybindNumber].displayNameB
          break
      }
    }
  }
}

export class Keybind {
  constructor (name, value, keybindA, keybindB, displayNameA, displayNameB) {
    this.name = name

    if (displayNameA === undefined) { this.displayNameA = keybindA } else { this.displayNameA = displayNameA }
    if (displayNameB === undefined) { this.displayNameB = keybindB } else { this.displayNameB = displayNameB }

    this.keybindA = keybindA
    this.keybindB = keybindB
    this.x = 0
    this.y = 0
    this.value = value
  }

  Draw () {
    canvas.context.font = '40px Arial'
    canvas.context.fillStyle = 'darkgray'
    canvas.context.fillText(this.name, this.x, this.y)
  }

  Update () {
    const currentMenu = gameStates.menuController.CheckMenu()
    console.log(gameStates.CurrentKeybind().seletingKeybind)
    console.log(gameStates.menuController.menus)
    console.log(currentMenu)
    console.log(gameStates.menuController.menus[currentMenu])
    gameStates.menuController.menus[currentMenu].menuItems[this.value - 1].title = this.displayNameA
    gameStates.menuController.menus[currentMenu].menuItems[this.value + gameStates.CurrentKeybind().keybinds.length].title = this.displayNameB
  }
}
