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
  Selecting: 1,
  Playing: 2,
  Lost: 3,
  WonStage: 4,
  Paused: 5
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
  Sound: 4
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
  mobile: false,
  loading: true,
  CurrentLevel: function () {
    return gameStates.levelController.levels[gameStates.currentLevelIndex]
  },

  SetGameState: function (gameState, type) {
    if (type === 'Starting') {
      gameStates.currentStartingMenusState = gameState
    }
    if (type === 'StoryMode') {
      gameStates.currentStoryModeState = gameState
      if (gameStates.currentStoryModeState === storyModeStates.Playing) {
        levelTools.UpdateLevelTime()
      }
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

export const levelTools = {
  currentLosses: 0,
  loseCounterStop: false,
  winLevel: false,
  NextLevel: function () {
    levelTools.Restart()
    if (gameStates.infoController.unlockedLevel === gameStates.currentLevelIndex) { gameStates.infoController.unlockedLevel++ }
  },

  Restart: function () {
    gameStates.CurrentLevel().reset()
    gameStates.CurrentLevel().players.forEach(function (player) {
      player.reset()
    })

    gameStates.CurrentLevel().finishAreas.forEach(function (finishArea) {
      finishArea.reset()
    })

    gameStates.CurrentLevel().enemies.forEach(function (enemy) {
      enemy.reset()
    })

    gameStates.CurrentLevel().waters.forEach(function (water) {
      water.reset()
    })

    gameStates.CurrentLevel().holes.forEach(function (hole) {
      hole.reset()
    })

    gameStates.CurrentLevel().unlocks.forEach(function (unlock) {
      unlock.reset()
    })

    gameStates.CurrentLevel().teleporters.forEach(function (teleporter) {
      teleporter.reset()
    })

    gameStates.CurrentLevel().items.forEach(function (item) {
      item.reset()
    })

    gameStates.CurrentLevel().rocks.forEach(function (rock) {
      rock.reset()
    })

    gameStates.CurrentLevel().changeDirectionSquares.forEach(function (changeDirectionSquare) {
      changeDirectionSquare.reset()
    })

    gameStates.CurrentLevel().walls.forEach(function (wall) {
      wall.reset()
    })
    gameStates.CurrentLevel().currentX = gameStates.CurrentLevel().startingX
    gameStates.CurrentLevel().currentY = gameStates.CurrentLevel().startingY
  },

  UpdateLevelTime: function () {
    if (gameStates.currentStoryModeState === storyModeStates.Playing) {
      gameStates.CurrentLevel().timeLimit -= 1
      window.setTimeout(levelTools.UpdateLevelTime, 1000)
    }
  }
}

export const dataManagement = {
  Save: function () {
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
  },

  Load: function () {
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
        gameStates.levelController.levels[7].items[1].stopCollecting = true
      }
    }

    const BackgroundStyle = Number(window.localStorage.getItem('backgroundStyle'))
    if (BackgroundStyle !== null) {
      gameStates.currentBackgroundStyle = BackgroundStyle
    }

    const currentThemeColourSelection = window.localStorage.getItem('currentThemeColourSelection')
    if (currentThemeColourSelection !== null) {
      gameStates.currentThemeColour = gameStates.arrayChartController.arrayCharts[0].items[currentThemeColourSelection].value
      gameStates.arrayChartController.arrayCharts[0].currentSelection = currentThemeColourSelection
    }

    const StyleCube = Number(window.localStorage.getItem('StyleCube'))
    if (StyleCube !== null) {
      gameStates.currentCubeStyle = StyleCube
    }

    const loadArrayKeybind = JSON.parse(window.localStorage.getItem('keybindArray'))
    if (loadArrayKeybind !== null) { gameStates.keybindController.load(loadArrayKeybind) }
  }
}
