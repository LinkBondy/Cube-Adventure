'use strict'
export const startingMenusStates = {
  NotStarted: 1,
  Menu: 2,
  Selected: 3
}

export const gameMode = {
  Unselected: 0,
  StoryMode: 1,
  Shop: 2,
  ItemsInfo: 3,
  Settings: 4
}

export const storyModeStates = {
  WorldSelecting: 1,
  Selecting: 2,
  Playing: 3,
  Tutorials: 4,
  Lost: 5,
  WonStage: 6,
  Paused: 7
}

export const shopStates = {
  Menu: 1,
  Player: 2,
  ThemeColour: 3,
  Background: 4
}

export const BackgroundStyles = {
  Classic: 0,
  Plastic: 1
}

export const cubeStyle = {
  Classic: 0,
  Alien: 1,
  Sad: 2,
  Happy: 3
}

export const settingStates = {
  Selecting: 1,
  Keybinds: 2,
  Mobile: 3,
  Saving: 4,
  Sound: 5
}

export const gameStates = {
  currentStartingMenusState: startingMenusStates.NotStarted,
  currentStoryModeState: storyModeStates.WorldSelecting,
  currentSettingState: settingStates.Selecting,
  currentGameMode: gameMode.Unselected,
  currentShopState: shopStates.Menu,
  currentBackgroundStyle: BackgroundStyles.Classic,
  currentCubeStyle: cubeStyle.BlueCube,
  currentThemeColour: 'lightgray',
  currentLevelIndex: 0,
  delta: 1,
  pausedDate: undefined,
  isRunning: true,
  mobile: false,
  loading: true,
  stopTime: false,
  CurrentLevel: function () {
    return gameStates.worldSelector.currentWorld.levels[gameStates.currentLevelIndex]
  },

  SetGameState: function (gameState, type) {
    if (type === 'Starting') {
      gameStates.currentStartingMenusState = gameState
    }
    if (type === 'StoryMode') {
      gameStates.currentStoryModeState = gameState
    }
    if (type === 'Settings') {
      gameStates.currentSettingState = gameState
    }
  },

  ReturnToMainMenu: function () {
    gameStates.SetGameState(startingMenusStates.Menu, 'Starting')
    gameStates.currentGameMode = gameMode.Unselected
  }
}

export const drawUpdate = {
  highestLevelLock: true,
  blueCubeSadLock: true,
  blueCubeAlienLock: true
}

export const dataManagement = {
  autoSave: true,
  Save: function (override) {
    window.localStorage.setItem('autoSave', this.autoSave)
    if (this.autoSave || override) {
      const world1LevelsCompleted = []
      const specialLevelsCompleted = []
      for (let l = 0; l < gameStates.gameController.worlds[0].levels.length; l++) {
        world1LevelsCompleted.push(gameStates.gameController.worlds[0].levels[l].completed)
      }

      for (let l = 0; l < gameStates.gameController.worlds[1].levels.length; l++) {
        specialLevelsCompleted.push(gameStates.gameController.worlds[1].levels[l].completed)
      }
      window.localStorage.setItem('world1Levels', JSON.stringify(world1LevelsCompleted))
      window.localStorage.setItem('specialLevels', JSON.stringify(specialLevelsCompleted))
      window.localStorage.setItem('newUpdate', false)
      window.localStorage.setItem('PlayerAlienLock', drawUpdate.blueCubeAlienLock)
      window.localStorage.setItem('PlayerSadLock', drawUpdate.blueCubeSadLock)
      window.localStorage.setItem('highestLevelLock', drawUpdate.highestLevelLock)
      window.localStorage.setItem('StyleCube', gameStates.currentCubeStyle)
      window.localStorage.setItem('backgroundStyle', gameStates.currentBackgroundStyle)
      window.localStorage.setItem('currentThemeColourSelection', gameStates.arrayChartController.arrayCharts[1].currentSelection)
      window.localStorage.setItem('keybindArray', JSON.stringify(gameStates.keybindController.keybinds))
    }
  },

  Load: function () {
    if (window.localStorage.getItem('autoSave') !== null) {
      this.autoSave = JSON.parse(window.localStorage.getItem('autoSave'))
    }

    if (window.localStorage.getItem('world1Levels') !== null) {
      const completedLevelsW1 = JSON.parse(window.localStorage.getItem('world1Levels'))

      for (let l = 0; l < gameStates.gameController.worlds[0].levels.length; l++) {
        gameStates.gameController.worlds[0].levels[l].completed = completedLevelsW1[l]
      }
    }

    if (window.localStorage.getItem('specialLevels') !== null) {
      const completedLevelsSpecial = JSON.parse(window.localStorage.getItem('specialLevels'))

      for (let l = 0; l < gameStates.gameController.worlds[1].levels.length; l++) {
        gameStates.gameController.worlds[1].levels[l].completed = completedLevelsSpecial[l]
      }
    }

    if (window.localStorage.getItem('highestLevelLock') !== null) {
      const highestLevelLock = JSON.parse(window.localStorage.getItem('highestLevelLock'))
      drawUpdate.highestLevelLock = highestLevelLock
    }

    if (window.localStorage.getItem('PlayerSadLock') !== null) {
      const SadLock = JSON.parse(window.localStorage.getItem('PlayerSadLock'))
      drawUpdate.blueCubeSadLock = SadLock
    }

    if (window.localStorage.getItem('PlayerAlienLock') !== null) {
      const AlienLock = JSON.parse(window.localStorage.getItem('PlayerAlienLock'))
      drawUpdate.blueCubeAlienLock = AlienLock
      if (!drawUpdate.blueCubeAlienLock) {
        gameStates.gameController.world1[8].items.splice(1, 1)
      }
    }

    const BackgroundStyle = Number(window.localStorage.getItem('backgroundStyle'))
    if (BackgroundStyle !== null) {
      gameStates.currentBackgroundStyle = BackgroundStyle
      gameStates.arrayChartController.arrayCharts[2].currentSelection = BackgroundStyle
    }

    const StyleCube = Number(window.localStorage.getItem('StyleCube'))
    if (StyleCube !== null) {
      gameStates.currentCubeStyle = StyleCube
      gameStates.arrayChartController.arrayCharts[0].currentSelection = StyleCube
    }

    const currentThemeColourSelection = window.localStorage.getItem('currentThemeColourSelection')
    if (currentThemeColourSelection !== null) {
      gameStates.currentThemeColour = gameStates.arrayChartController.arrayCharts[1].items[Number(currentThemeColourSelection)].value
      gameStates.arrayChartController.arrayCharts[1].currentSelection = currentThemeColourSelection
    }

    const loadArrayKeybind = JSON.parse(window.localStorage.getItem('keybindArray'))
    if (loadArrayKeybind !== null) { gameStates.keybindController.load(loadArrayKeybind) }
  }
}

export const eventFunctions = {
  isTouching: function (x, y, width, height, event) {
    const boxLeft = x
    const boxRight = x + width
    const boxTop = y
    const boxBottom = y + height
    const mouseX = event.offsetX
    const mouseY = event.offsetY
    ///
    if (mouseX >= boxLeft && mouseX <= boxRight &&
            mouseY >= boxTop && mouseY <= boxBottom) {
      return true
    }
    return false
  },

  backButtonAction: function () {
    if (gameStates.currentGameMode === gameMode.Unselected && gameStates.currentStartingMenusState > 1) {
      gameStates.SetGameState(gameStates.currentStartingMenusState - 1, 'Starting')
      return
    }

    if (gameStates.currentGameMode === gameMode.StoryMode) {
      if (gameStates.currentStoryModeState === 1) {
        gameStates.ReturnToMainMenu()
      } else if (gameStates.currentStoryModeState === storyModeStates.Selecting) {
        gameStates.SetGameState(storyModeStates.WorldSelecting, 'StoryMode')
        gameStates.currentLevelIndex = 0
      }
      return
    }

    if (gameStates.currentGameMode === gameMode.Shop) {
      if (gameStates.currentShopState === shopStates.Menu) {
        gameStates.ReturnToMainMenu()
      } else {
        gameStates.currentShopState = shopStates.Menu
      }
      return
    }

    if (gameStates.currentGameMode === gameMode.ItemsInfo) {
      gameStates.ReturnToMainMenu()
      return
    }

    if (gameStates.currentGameMode === gameMode.Settings) {
      if (gameStates.currentSettingState === 1) {
        gameStates.ReturnToMainMenu()
      } else {
        switch (gameStates.keybindController.seletingKeybind) {
          case true:
            gameStates.keybindController.finishRebinding()
            break

          case false:
            gameStates.currentSettingState = settingStates.Selecting
            break
        }
      }
    }
  }
}
