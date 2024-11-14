'use strict'
export const startingMenusStates = {
  NotStarted: 1,
  Menu: 2,
  Selected: 3
}

export const gameMode = {
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

export const ShopMode/* shopStates */ = {
  ShopMenu: 1,
  Backround: 2,
  Player: 3
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
  ThemeColourSelection: 3,
  Saving: 4,
  Sound: 5
}

export const gameStates = {
  currentStartingMenusState: startingMenusStates.NotStarted,
  currentStoryModeState: storyModeStates.Selecting,
  currentSettingState: settingStates.Selecting,
  currentGameMode: gameMode.StoryMode,
  currentShopMode: ShopMode.ShopMenu,
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
    return gameStates.levelController.levels[gameStates.currentLevelIndex]
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
      window.localStorage.setItem('level', gameStates.infoController.unlockedLevel)
      window.localStorage.setItem('newUpdate', false)
      if (gameStates.infoController.unlockedLevel !== gameStates.levelController.levels.length && gameStates.infoController.unlockedLevel === gameStates.currentLevelIndex - 1) {
        window.localStorage.setItem('stateGame', gameStates.currentStoryModeState)
      } else { window.localStorage.setItem('stateGame', -1) }
      window.localStorage.setItem('PlayerAlienLock', drawUpdate.blueCubeAlienLock)
      window.localStorage.setItem('PlayerSadLock', drawUpdate.blueCubeSadLock)
      window.localStorage.setItem('highestLevelLock', drawUpdate.highestLevelLock)
      window.localStorage.setItem('StyleCube', gameStates.currentCubeStyle)
      window.localStorage.setItem('backgroundStyle', gameStates.currentBackgroundStyle)
      window.localStorage.setItem('currentThemeColourSelection', gameStates.arrayChartController.arrayCharts[0].currentSelection)
      window.localStorage.setItem('keybindArray', JSON.stringify(gameStates.keybindController.keybinds))
    }
  },

  Load: function () {
    if (window.localStorage.getItem('autoSave') !== null) {
      this.autoSave = JSON.parse(window.localStorage.getItem('autoSave'))
    }

    const newUpdate = window.localStorage.getItem('newUpdate')
    if (newUpdate !== null) {
      const level = Number(window.localStorage.getItem('level'))
      const stateGame = Number(window.localStorage.getItem('stateGame'))
      if (level !== null) {
        gameStates.infoController.unlockedLevel = level
        if (stateGame === storyModeStates.WonStage) {
          gameStates.infoController.unlockedLevel++
        }
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
        gameStates.levelController.levels[8].items.splice(1, 1)
      }
    }

    const BackgroundStyle = Number(window.localStorage.getItem('backgroundStyle'))
    if (BackgroundStyle !== null) {
      gameStates.currentBackgroundStyle = BackgroundStyle
      gameStates.arrayChartController.arrayCharts[1].currentSelection = BackgroundStyle
    }

    const StyleCube = Number(window.localStorage.getItem('StyleCube'))
    if (StyleCube !== null) {
      gameStates.currentCubeStyle = StyleCube
      gameStates.arrayChartController.arrayCharts[2].currentSelection = StyleCube
    }

    const currentThemeColourSelection = window.localStorage.getItem('currentThemeColourSelection')
    if (currentThemeColourSelection !== null) {
      gameStates.currentThemeColour = gameStates.arrayChartController.arrayCharts[0].items[currentThemeColourSelection].value
      gameStates.arrayChartController.arrayCharts[0].currentSelection = currentThemeColourSelection
    }

    const loadArrayKeybind = JSON.parse(window.localStorage.getItem('keybindArray'))
    if (loadArrayKeybind !== null) { gameStates.keybindController.load(loadArrayKeybind) }
  }
}
