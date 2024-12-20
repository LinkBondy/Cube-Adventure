'use strict'
const { gameMode, startingMenusStates, storyModeStates, shopStates, gameStates, settingStates, dataManagement, eventFunctions } = require('../data/GameData')
const { canvas } = require('../drawing/Canvas')

class MenuItem {
  constructor (title, valueX, valueY, color, action) {
    this.title = title
    this.valueX = valueX
    this.valueY = valueY
    this.color = color
    this.action = action
  }
}

class Menu {
  constructor (menuItems, itemWidth, itemHeight, x, y, width, height, fontSize) {
    this.menuItems = menuItems
    this.selectedIndexX = 0
    this.selectedIndexY = 0
    this.itemWidth = itemWidth
    this.itemHeight = itemHeight
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.fontSize = fontSize
  }

  moveLeft () {
    if (this.selectedIndexX !== 0) {
      this.selectedIndexX = this.selectedIndexX - 1
    }
  }

  moveRight () {
    if (this.selectedIndexX !== this.itemWidth - 1) {
      this.selectedIndexX = this.selectedIndexX + 1
    }
  }

  moveUp () {
    if (this.selectedIndexY !== 0) {
      this.selectedIndexY = this.selectedIndexY - 1
    }
  }

  moveDown () {
    if (this.selectedIndexY !== this.itemHeight - 1) {
      this.selectedIndexY = this.selectedIndexY + 1
    }
  }

  selected () {
    // Find the selected menuItem
    const menuItem = this.menuItems[this.selectedIndexX * this.itemHeight + this.selectedIndexY]
    menuItem.action()
  }

  Keydown (event, keybindArray, stopEvents) {
    // Left "Menus"
    if (keybindArray[0/* left */].keybindA === event.key || keybindArray[0/* left */].keybindB === event.key) { this.moveLeft() }

    // Right "Menus"
    if (keybindArray[1/* right */].keybindA === event.key || keybindArray[1/* right */].keybindB === event.key) { this.moveRight() }

    // Down "Menus"
    if (keybindArray[3/* down */].keybindA === event.key || keybindArray[3/* down */].keybindB === event.key) { this.moveDown() }

    // Up "Menus"
    if (keybindArray[2/* up */].keybindA === event.key || keybindArray[2/* up */].keybindB === event.key) { this.moveUp() }

    // Selected "Menus"
    if (keybindArray[4/* select */].keybindA === event.key || keybindArray[4/* select */].keybindB === event.key) {
      this.selected()
      if (gameStates.keybindController.seletingKeybind) { stopEvents.stopMouseUp = true }
    }
  }

  MouseDown (event) {
    const self = this
    const heightPerItem = this.height / this.itemHeight
    const widthPerItem = this.width / this.itemWidth
    this.menuItems.forEach(function (menuItem) {
      // Selected "Menus"
      if (eventFunctions.isTouching(self.x + widthPerItem * (menuItem.valueX - 1), self.y + heightPerItem * (menuItem.valueY - 1), widthPerItem, heightPerItem, event) && gameStates.menuController.CheckMenu() !== undefined) {
        if ((menuItem.valueX - 1) === self.selectedIndexX && (menuItem.valueY - 1) === self.selectedIndexY) {
          gameStates.menuController.menus[gameStates.menuController.CheckMenu()].selected()
        } else {
          self.selectedIndexX = menuItem.valueX - 1
          self.selectedIndexY = menuItem.valueY - 1
        }
      }
    })
  }

  Draw () {
    const self = this
    // Setting the width and height per menuItem
    const heightPerItem = this.height / this.itemHeight
    const widthPerItem = this.width / this.itemWidth
    this.menuItems.forEach(function (menuItem) {
      if ((menuItem.valueX - 1) === self.selectedIndexX && (menuItem.valueY - 1) === self.selectedIndexY) {
        canvas.context.shadowColor = 'rgba(0, 0, 0, 0.8)'
        canvas.context.shadowOffsetX = 5
        canvas.context.shadowOffsetY = 5
        canvas.context.shadowBlur = 10
        canvas.context.fillStyle = 'rgba(145, 145, 145, 0.8)'
        canvas.context.beginPath()
        canvas.context.roundRect(self.x + widthPerItem * (menuItem.valueX - 1) + 2.5, self.y + heightPerItem * (menuItem.valueY - 1), widthPerItem - 9.5, heightPerItem - 9.5, 100)
        canvas.context.fill()
        // Stating the MenuItem's size and colour
        canvas.context.font = self.fontSize + 'px Arial'
        canvas.context.fillStyle = menuItem.color
      } else {
        canvas.context.font = self.fontSize / 1.5 + 'px Arial'
        canvas.context.fillStyle = 'gray'
      }
      // Drawing the MenuItem's text and images
      canvas.context.shadowBlur = 0
      canvas.context.shadowOffsetX = 0
      canvas.context.shadowOffsetY = 0
      const textX = widthPerItem * (menuItem.valueX - 1) + self.x
      const textY = heightPerItem * (menuItem.valueY - 1) + self.y
      canvas.context.textAlign = 'center'
      canvas.context.textBaseline = 'middle'

      canvas.context.fillText(menuItem.title, textX + widthPerItem / 2 + 2.5, textY + heightPerItem / 2 + 2.5)

      canvas.context.fillStyle = 'black'
      canvas.context.textAlign = 'left'
      canvas.context.textBaseline = 'alphabetic'
      canvas.context.shadowOffsetX = 0
      canvas.context.shadowOffsetY = 0
    })
  }
}

export class MenuController {
  constructor () {
    this.menus = []
    this.menus.push(this.MainMenu = new Menu([
      new MenuItem('Story Mode', 1, 1, 'rgb(0, 166, 255)', function () {
        gameStates.currentStartingMenusState = startingMenusStates.Selected
        gameStates.currentGameMode = gameMode.StoryMode
        gameStates.currentStoryModeState = storyModeStates.WorldSelecting
      }),
      new MenuItem('Customize', 1, 2, 'rgb(0, 122, 216)', function () {
        gameStates.currentStartingMenusState = startingMenusStates.Selected
        gameStates.currentGameMode = gameMode.Shop
        gameStates.currentShopState = shopStates.Menu
      }),
      new MenuItem('Adventure Log', 1, 3, 'rgb(0, 67, 190)', function () {
        gameStates.currentStartingMenusState = startingMenusStates.Selected
        gameStates.currentGameMode = gameMode.ItemsInfo
      }),
      new MenuItem('Settings', 1, 4, 'rgb(0, 0, 139)', function () {
        gameStates.currentStartingMenusState = startingMenusStates.Selected
        gameStates.currentGameMode = gameMode.Settings
        gameStates.currentSettingState = settingStates.Selecting
      })
      /* new MenuItem('Comming Soon', 1, 5, 'rgb(55, 0, 110)', function () {
      }) */
    ], /* itemWidth */1, /* itemHeight */4, /* x */0, /* y */0, /* width */850, /* height */600, /* fontSize */85))

    this.menus.push(this.ShopMenu = new Menu([
      new MenuItem('Player', 1, 1, 'lightcoral', function () {
        gameStates.currentShopState = shopStates.Player
      }),
      new MenuItem('Theme Colour', 1, 2, 'rgb(240, 160, 40)', function () {
        gameStates.currentShopState = shopStates.ThemeColour
      }),
      new MenuItem('Background', 1, 3, 'gold', function () {
        gameStates.currentShopState = shopStates.Background
      })
    ], /* itemWidth */1, /* itemHeight */3, /* x */0, /* y */0, /* width */850, /* height */600, /* fontSize */105))

    this.menus.push(this.KeybindsSelector = new Menu([
      new MenuItem('ArrowLeft', 1, 1, 'rgb(172, 0, 172)', function () { gameStates.keybindController.startRebind('A', 1, this) }),
      new MenuItem('ArrowRight', 1, 2, 'rgb(183, 0, 158)', function () { gameStates.keybindController.startRebind('A', 2, this) }),
      new MenuItem('ArrowUp', 1, 3, 'rgb(195, 0, 144)', function () { gameStates.keybindController.startRebind('A', 3, this) }),
      new MenuItem('ArrowDown', 1, 4, 'rgb(207, 0, 130)', function () { gameStates.keybindController.startRebind('A', 4, this) }),
      ///
      new MenuItem('Space', 1, 5, 'rgb(219, 0, 116)', function () { gameStates.keybindController.startRebind('A', 5, this) }),
      new MenuItem('Backspace', 1, 6, 'rgb(231, 0, 102)', function () { gameStates.keybindController.startRebind('A', 6, this) }),
      new MenuItem('Column 1', 1, 7, 'rgb(255, 0, 75)', function () { gameStates.keybindController.resetKeybinds('A') }),
      ///
      ///
      new MenuItem('a', 2, 1, 'rgb(172, 0, 172)', function () { gameStates.keybindController.startRebind('B', 1, this) }),
      new MenuItem('d', 2, 2, 'rgb(183, 0, 158)', function () { gameStates.keybindController.startRebind('B', 2, this) }),
      new MenuItem('w', 2, 3, 'rgb(195, 0, 144)', function () { gameStates.keybindController.startRebind('B', 3, this) }),
      new MenuItem('s', 2, 4, 'rgb(207, 0, 130)', function () { gameStates.keybindController.startRebind('B', 4, this) }),
      ///
      new MenuItem('Enter', 2, 5, 'rgb(219, 0, 116)', function () { gameStates.keybindController.startRebind('B', 5, this) }),
      new MenuItem('b', 2, 6, 'rgb(231, 0, 102)', function () { gameStates.keybindController.startRebind('B', 6, this) }),
      new MenuItem('Column 2', 2, 7, 'rgb(255, 0, 75)', function () { gameStates.keybindController.resetKeybinds('B') })
    ], /* itemWidth */2, /* itemHeight */7, /* x */290, /* y */0, /* width */510, /* height */600, /* fontSize */40))

    this.menus.push(this.SettingsMenu = new Menu([
      new MenuItem('Keybinds', 1, 1, 'rgb(230, 200, 0)', function () {
        gameStates.SetGameState(settingStates.Keybinds, 'Settings')
      }),
      /* new MenuItem('Mobile', 1, 2, 'rgb(182, 200, 0)', function () {
        gameStates.SetGameState(settingStates.Mobile, 'Settings')
      }), */
      new MenuItem('Saving', 1, 2, 'rgb(135, 200, 0)', function () {
        gameStates.SetGameState(settingStates.Saving, 'Settings')
      })
      /* new MenuItem('Sound', 1, 4, 'rgb(0, 200, 0)', function () {
        gameStates.SetGameState(settingStates.Sound, 'Settings')
      }) */
    ], /* itemWidth */1, /* itemHeight */2, /* x */0, /* y */0, /* width */850, /* height */600, /* fontSize */95))

    this.menus.push(this.SavingMenu = new Menu([
      new MenuItem('Auto Save', 1, 1, 'limeGreen', function () {
        dataManagement.autoSave = !dataManagement.autoSave
      }),
      new MenuItem('Save Game', 1, 2, 'rgb(40, 200, 150)', function () {
        dataManagement.Save(true)
      })
    ], /* itemWidth */1, /* itemHeight */2, /* x */0, /* y */0, /* width */850, /* height */600, /* fontSize */115))

    this.menus.push(this.SoundMenu = new Menu([
      new MenuItem('Music', 1, 1, 'limeGreen', function () {
        // Changes the Volume of Music
      }),
      new MenuItem('Sound Effects', 1, 2, 'limeGreen', function () {
        // Changes the Volume of Sound Effects
      }),
      new MenuItem('Mute', 1, 3, 'rgb(40, 200, 150)', function () {
        // Mutes the Volume
      })
    ], /* itemWidth */1, /* itemHeight */3, /* x */0, /* y */0, /* width */850, /* height */600, /* fontSize */90))

    this.menus.push(this.LoseMenu = new Menu([
      new MenuItem('Retry', 1, 1, 'rgb(120, 0, 225)', function () {
        gameStates.lossScreen.loseLevel = false
        gameStates.CurrentLevel().restart()
        gameStates.CurrentLevel().startLevel()
      }),
      new MenuItem('Selection Menu', 1, 2, 'rgb(90, 0, 225)', function () {
        gameStates.CurrentLevel().restart()
        gameStates.SetGameState(storyModeStates.Selecting, 'StoryMode')
        gameStates.lossScreen.loseLevel = false
      }),
      new MenuItem('Main Menu', 1, 3, 'rgb(60, 0, 225)', function () {
        gameStates.CurrentLevel().restart()
        gameStates.SetGameState(storyModeStates.WorldSelecting, 'StoryMode')
        gameStates.currentStartingMenusState = startingMenusStates.Menu
        gameStates.currentGameMode = gameMode.Unselected
        gameStates.currentLevelIndex = 0
        gameStates.lossScreen.loseLevel = false
      })
    ], /* itemWidth */1, /* itemHeight */3, /* x */0, /* y */175, /* width */850, /* height */425, /* fontSize */90))

    this.menus.push(this.WinMenu = new Menu([
      new MenuItem('Continue', 1, 1, 'rgb(255, 0, 75)', function () {
        gameStates.winScreen.NextLevel()
      }),
      new MenuItem('Selection Menu', 1, 2, 'rgb(255, 5, 115)', function () {
        gameStates.CurrentLevel().restart()
        gameStates.SetGameState(storyModeStates.Selecting, 'StoryMode')
        gameStates.winScreen.winLevel = false
      }),
      new MenuItem('Main Menu', 1, 3, 'rgb(255, 10, 150)', function () {
        gameStates.CurrentLevel().restart()
        gameStates.SetGameState(storyModeStates.WorldSelecting, 'StoryMode')
        gameStates.currentStartingMenusState = startingMenusStates.Menu
        gameStates.currentGameMode = gameMode.Unselected
        gameStates.currentLevelIndex = 0
        gameStates.winScreen.winLevel = false
      })
    ], /* itemWidth */1, /* itemHeight */3, /* x */0, /* y */150, /* width */850, /* height */450, /* fontSize */100))

    this.menus.push(this.PauseMenu = new Menu([
      new MenuItem('Resume', 1, 1, 'rgb(255, 0, 86)', function () {
        gameStates.CurrentLevel().resumeLevelTime()
        gameStates.SetGameState(storyModeStates.Playing, 'StoryMode')
        gameStates.CurrentLevel().cubers.forEach(function (cuber) {
          cuber.setTimer()
        })
      }),
      new MenuItem('Retry', 1, 2, 'rgb(255, 85, 20)', function () {
        gameStates.CurrentLevel().restart()
        gameStates.CurrentLevel().startLevel()
      }),
      new MenuItem('Selection Menu', 1, 3, 'rgb(255, 124, 0)', function () {
        gameStates.CurrentLevel().restart()
        gameStates.SetGameState(storyModeStates.Selecting, 'StoryMode')
      }),
      new MenuItem('Main Menu', 1, 4, 'rgb(255, 170, 0)', function () {
        gameStates.CurrentLevel().restart()
        gameStates.SetGameState(storyModeStates.WorldSelecting, 'StoryMode')
        gameStates.currentGameMode = gameMode.Unselected
        gameStates.currentStartingMenusState = startingMenusStates.Menu
        gameStates.currentLevelIndex = 0
      })
    ], /* itemWidth */1, /* itemHeight */4, /* x */0, /* y */0, /* width */850, /* height */600, /* fontSize */90))
  }

  CheckMenu () {
    // Find the current menu
    if (gameStates.currentStartingMenusState === startingMenusStates.Menu) { return 0 }
    ///
    if (gameStates.currentStartingMenusState === startingMenusStates.Selected) {
      if (gameStates.currentShopState === shopStates.Menu && gameStates.currentGameMode === gameMode.Shop) { return 1 }
      ///
      if (gameStates.currentGameMode === gameMode.Settings) {
        if (gameStates.currentSettingState === settingStates.Keybinds && !gameStates.keybindController.seletingKeybind) { return 2 }
        ///
        if (gameStates.currentSettingState === settingStates.Selecting) { return 3 }

        if (gameStates.currentSettingState === settingStates.Saving) { return 4 }

        if (gameStates.currentSettingState === settingStates.Sound) { return 5 }
      }
      ///
      if (gameStates.currentGameMode === gameMode.StoryMode) {
        if (gameStates.currentStoryModeState === storyModeStates.Lost) { return 6 }
        ///
        if (gameStates.currentStoryModeState === storyModeStates.WonStage) { return 7 }
        ///
        if (gameStates.currentStoryModeState === storyModeStates.Paused) { return 8 }
      }
    }
  }
}
