'use strict'
const { canvas } = require('../drawing/Canvas')
const { gameStates } = require('../data/GameData')

export class KeybindController {
  constructor () {
    this.keybinds = [
      new Keybind('Left', 1, 'ArrowLeft', 'a'),
      new Keybind('Right', 2, 'ArrowRight', 'd'),
      new Keybind('Up', 3, 'ArrowUp', 'w'),
      new Keybind('Down', 4, 'ArrowDown', 's'),
      new Keybind('Select', 5, ' ', 'Enter', 'Space'),
      new Keybind('Back', 6, 'Backspace', 'b')
    ]

    this.originalKeybinds = [
      new Keybind('Left', 1, 'ArrowLeft', 'a'),
      new Keybind('Right', 2, 'ArrowRight', 'd'),
      new Keybind('Up', 3, 'ArrowUp', 'w'),
      new Keybind('Down', 4, 'ArrowDown', 's'),
      new Keybind('Select', 5, ' ', 'Enter', 'Space'),
      new Keybind('Back', 6, 'Backspace', 'b')
    ]
    this.seletingKeybind = false
    this.triedRebinding = false
    this.currentMenuItem = undefined
    this.currentKeybind = undefined
    this.currentType = undefined
  }

  startRebind (type, keybindNumber, usedMenuItem) {
    this.seletingKeybind = true
    this.currentKeybind = this.keybinds[keybindNumber - 1]
    this.currentMenuItem = usedMenuItem
    this.currentType = type
  }

  setKeybinds (event) {
    if (this.checkKeybinds(event.key)) {
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

  checkKeybinds (keybind) {
    for (let keybindNumber = 0; keybindNumber !== this.keybinds.length; keybindNumber++) {
      if (keybind === this.keybinds[keybindNumber].keybindA || keybind === this.keybinds[keybindNumber].keybindB) {
        return false
      }
    }
    return true
  }

  finishRebinding () {
    this.seletingKeybind = false
    this.triedRebinding = false
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

  load (savedArray) {
    this.keybinds = []
    for (let keybindsLoaded = 0; keybindsLoaded < this.originalKeybinds.length; keybindsLoaded++) {
      this.keybinds.push(new Keybind(savedArray[keybindsLoaded].name, savedArray[keybindsLoaded].value, savedArray[keybindsLoaded].keybindA, savedArray[keybindsLoaded].keybindB, savedArray[keybindsLoaded].displayNameA, savedArray[keybindsLoaded].displayNameB))
    }
  }
}

export class Keybind {
  constructor (name, value, keybindA, keybindB, displayNameA, displayNameB) {
    this.name = name

    if (displayNameA === undefined) { this.displayNameA = keybindA } else { this.displayNameA = displayNameA }

    ///

    if (displayNameB === undefined) { this.displayNameB = keybindB } else { this.displayNameB = displayNameB }

    this.keybindA = keybindA
    this.keybindB = keybindB
    this.x = 10
    this.y = (value - 1) * (600 / 7) + 55
    this.value = value
  }

  Draw () {
    canvas.context.font = '40px Arial'
    canvas.context.fillStyle = 'darkgray'
    // canvas.context.textBaseline = 'middle'
    canvas.context.fillText(this.name, this.x, this.y)
    canvas.context.fillText('Reset', this.x, (7 - 1) * (600 / 7) + 55)
    canvas.context.textBaseline = 'alphabetic'
  }

  Update () {
    gameStates.menuController.menus[2].menuItems[this.value - 1].title = this.displayNameA
    gameStates.menuController.menus[2].menuItems[this.value + gameStates.keybindController.keybinds.length].title = this.displayNameB
  }
}
