'use strict'
export var startingMenusStates = {
  // NewInfo: 1,
  NotStarted: 1,
  Menu: 2,
  Selected: 3
}

export var gameMode = {
  StoryMode: 1,
  Shop: 2,
  ItemsInfo: 3,
  Settings: 4
}

export var storyModeStates = {
  Selecting: 1,
  Playing: 2,
  Lost: 3,
  WonStage: 4,
  Paused: 5
}

export var ShopMode/* shopStates */ = {
  ShopMenu: 1,
  Backround: 2,
  Player: 3
}

export var BackgroundStyles = {
  Classic: 0,
  Plastic: 1
}

export var cubeStyle = {
  Classic: 0,
  Alien: 1,
  Sad: 2,
  Happy: 3
}

export var settingStates = {
  Selecting: 1,
  Keybinds: 2,
  ThemeColourSelection: 3,
  Sound: 4
}

export var gameStates = {
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
  CurrentLevel: function () {
    return gameStates.levelController.levels[gameStates.currentLevelIndex]
  },

  SetGameState: function (gameState, type) {
    if (type === 'Starting') { gameStates.currentStartingMenusState = gameState }
    if (type === 'StoryMode') { gameStates.currentStoryModeState = gameState }
    if (type === 'Settings') { gameStates.currentSettingState = gameState }
  }
}

export var drawUpdate = {
  highestLevelLock: true,
  blueCubeSadLock: true,
  blueCubeAlienLock: true
}

export var levelTools = {
  currentLosses: 0,
  loseCounterStop: false,
  UpdateGame: function (delta) {
    if (gameStates.currentStoryModeState === storyModeStates.Playing && gameStates.currentGameMode === gameMode.StoryMode) { this.updateLevels(delta) }

    if (gameStates.arrayChartController.findCurrentArrayChart() !== false) { this.chartUpdate() }

    if (gameStates.currentSettingState === settingStates.Keybinds && gameStates.currentGameMode === gameMode.Settings) { this.keybindUpdate() }

    this.checkWinLose()
    this.drawUpdate()
  },

  chartUpdate: function () {
    let numberDrew = 0
    for (let col = 0; col < gameStates.arrayChartController.arrayCharts[gameStates.arrayChartController.findCurrentArrayChart()].loopHeight; col++) {
      for (let row = 0; row < gameStates.arrayChartController.arrayCharts[gameStates.arrayChartController.findCurrentArrayChart()].loopWidth; row++) {
        gameStates.arrayChartController.arrayCharts[gameStates.arrayChartController.findCurrentArrayChart()].items[numberDrew].Update()
        numberDrew++
      }
    }
    gameStates.arrayChartController.arrayCharts[gameStates.arrayChartController.findCurrentArrayChart()].update()
  },

  keybindUpdate: function () {
    gameStates.keybindController.keybinds.forEach(function (keybind) {
      keybind.Update()
    })
  },

  drawUpdate: function () {
    if (gameStates.infoController.unlockedLevel === gameStates.levelController.levels.length) { drawUpdate.highestLevelLock = false }
  },

  updateLevels: function (delta) {
    if (gameStates.currentStoryModeState === storyModeStates.Playing && gameStates.currentGameMode === gameMode.StoryMode) {
      gameStates.CurrentLevel().enemies.forEach(function (enemy) {
        enemy.update(delta)
      })
      gameStates.CurrentLevel().players.forEach(function (player) {
        player.update(delta)
        player.changeSlideVariables()
      })
      gameStates.CurrentLevel().unlocks.forEach(function (unlock) {
        unlock.update(delta)
      })
      gameStates.CurrentLevel().holes.forEach(function (hole) {
        hole.update(delta)
      })
      gameStates.CurrentLevel().items.forEach(function (item) {
        item.update(delta)
      })
      gameStates.CurrentLevel().teleporters.forEach(function (teleporter) {
        teleporter.update(delta)
      })
    }
  },

  checkWinLose: function () {
    if (levelTools.checkWin() && gameStates.currentStoryModeState !== storyModeStates.WonStage) {
      setTimeout(function () {
        gameStates.SetGameState(storyModeStates.WonStage, 'StoryMode')
      }, 300)
    } else if (levelTools.checkLose() && gameStates.currentStoryModeState !== storyModeStates.Lost) {
      setTimeout(function () {
        gameStates.SetGameState(storyModeStates.Lost, 'StoryMode')
      }, 30)
    }
  },

  checkWin: function () {
    let win = false
    gameStates.CurrentLevel().players.forEach(function (player) {
      gameStates.CurrentLevel().finishAreas.forEach(function (finishArea) {
        if (finishArea.intersects(player)) {
          win = true
        }
      })
    })
    return win
  },

  checkLose: function () {
    let lose = false
    gameStates.CurrentLevel().players.forEach(function (player) {
      gameStates.CurrentLevel().enemies.forEach(function (enemy) {
        if (player.intersects(enemy)) {
          lose = true
        }
      })
      gameStates.CurrentLevel().holes.forEach(function (hole) {
        if (player.intersectsAll(hole) && hole.fullHole) {
          lose = true
        }
      })
    })
    return lose
  },

  NextLevel: function () {
    levelTools.Restart()
    if (gameStates.infoController.unlockedLevel === gameStates.currentLevelIndex) { gameStates.infoController.unlockedLevel++ }
  },

  Restart: function () {
    gameStates.CurrentLevel().finishAreas.forEach(function (finishArea) {
      finishArea.reset()
    })

    gameStates.CurrentLevel().enemies.forEach(function (enemy) {
      enemy.reset()
    })

    gameStates.CurrentLevel().players.forEach(function (player) {
      player.reset()
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
  }

}

export var dataManagement = {
  Save: function (draw) {
    window.localStorage.setItem('level', gameStates.infoController.unlockedLevel)
    window.localStorage.setItem('newUpdate', false)
    if (gameStates.infoController.unlockedLevel !== gameStates.levelController.levels.length && gameStates.infoController.unlockedLevel === gameStates.currentLevelIndex - 1) {
      window.localStorage.setItem('stateGame', gameStates.currentStoryModeState)
    } else { window.localStorage.setItem('stateGame', -1) }
    window.localStorage.setItem('PlayerAlienLock', drawUpdate.blueCubeAlienLock)
    window.localStorage.setItem('PlayerWoodenLock', draw.blueCubeWoodenLock)
    window.localStorage.setItem('PlayerSadLock', drawUpdate.blueCubeSadLock)
    window.localStorage.setItem('StyleCube', gameStates.currentCubeStyle)
    window.localStorage.setItem('backgroundStyle', gameStates.currentBackgroundStyle)
    window.localStorage.setItem('currentThemeColourSelection', gameStates.arrayChartController.arrayCharts[0].currentSelection)
    ///
    // var keybindArray = gameStates.keybindController.keybinds
    // var savingArrayKeybind = []
    // for(var pushed = 0; pushed < 7; pushed++) {
    // savingArrayKeybind.push(keybindArray[pushed])
    // }
    window.localStorage.setItem('keybindArray', JSON.stringify(gameStates.keybindController.keybinds))
  },

  Load: function (draw) {
    const newUpdate = window.localStorage.getItem('newUpdate')
    if (newUpdate !== null && newUpdate !== NaN) {
      const level = Number(window.localStorage.getItem('level'))
      const stateGame = Number(window.localStorage.getItem('stateGame'))
      if (level !== null) {
        gameStates.infoController.unlockedLevel = level
        if (stateGame == storyModeStates.WonStage) {
          gameStates.infoController.unlockedLevel++
        }
      }
    }

    let WoodenLock = window.localStorage.getItem('PlayerWoodenLock')
    if (WoodenLock !== null && WoodenLock !== NaN) {
      if (WoodenLock === 'true') { WoodenLock = true }

      if (WoodenLock === 'false') { WoodenLock = false }

      draw.blueCubeWoodenLock = WoodenLock
    }

    let SadLock = window.localStorage.getItem('PlayerSadLock')
    if (SadLock !== null && SadLock !== NaN) {
      if (SadLock === 'true') { SadLock = true }

      if (SadLock === 'false') { SadLock = false }

      drawUpdate.blueCubeSadLock = SadLock
    }

    let AlienLock = window.localStorage.getItem('PlayerAlienLock')
    if (AlienLock !== null && AlienLock !== NaN) {
      if (AlienLock === 'true') { AlienLock = true }

      if (AlienLock === 'false') { AlienLock = false }

      drawUpdate.blueCubeAlienLock = AlienLock
    }

    const BackgroundStyle = Number(window.localStorage.getItem('backgroundStyle'))
    gameStates.currentBackgroundStyle = BackgroundStyle

    const currentThemeColourSelection = window.localStorage.getItem('currentThemeColourSelection')
    if (currentThemeColourSelection !== null && currentThemeColourSelection !== NaN) {
      gameStates.currentThemeColour = gameStates.arrayChartController.arrayCharts[0].items[currentThemeColourSelection].value
      gameStates.arrayChartController.arrayCharts[0].currentSelection = currentThemeColourSelection
    }

    const StyleCube = Number(window.localStorage.getItem('StyleCube'))
    gameStates.currentCubeStyle = StyleCube

    const loadArrayKeybind = JSON.parse(window.localStorage.getItem('keybindArray'))
    if (loadArrayKeybind !== null) { gameStates.keybindController.load(loadArrayKeybind) }
  }
}
