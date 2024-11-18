'use strict'
const { startingMenusStates, storyModeStates, gameMode, ShopMode, settingStates, gameStates } = require('../data/GameData')
export function Keydown (event) {
  // console.log(event)
  const keybindArray = gameStates.keybindController.keybinds
  // Start Game "Menu"
  if (gameStates.currentStartingMenusState === startingMenusStates.NotStarted) {
    gameStates.titleScreen.KeyDown(event, keybindArray)
    return
  }

  // Back Action
  if ((keybindArray[5/* back */].keybindA === event.key || keybindArray[5/* back */].keybindB === event.key) && (gameStates.currentStartingMenusState === startingMenusStates.Menu || gameStates.currentStartingMenusState === startingMenusStates.Selected) && !gameStates.keybindController.seletingKeybind) {
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
      if (gameStates.currentShopMode === 1) {
        gameStates.ReturnToMainMenu()
      } else {
        gameStates.currentShopMode = ShopMode.ShopMenu
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
        return
      }
    }
  }

  if (gameStates.menuController.CheckMenu() !== undefined) {
    gameStates.menuController.menus[gameStates.menuController.CheckMenu()].Keydown(event, keybindArray, stopEvents)
    return
  }

  if (gameStates.currentStartingMenusState === startingMenusStates.Selected) {
    // Select World
    if (gameStates.currentGameMode === gameMode.StoryMode) {
      if (gameStates.currentStoryModeState === storyModeStates.WorldSelecting) {
        gameStates.worldSelector.KeyDown(event, keybindArray)
        return
      }

      if (gameStates.currentStoryModeState === storyModeStates.Selecting) {
        gameStates.levelSelector.KeyDown(event, keybindArray)
        return
      }
    }
    ///
    if (gameStates.currentGameMode === gameMode.ItemsInfo) {
      gameStates.infoController.Keydown(event, keybindArray)
    }
    ///
    // Game to Pause Menu
    if ((keybindArray[4/* select */].keybindA === event.key || keybindArray[4/* select */].keybindB === event.key) && gameStates.currentStoryModeState === storyModeStates.Playing && gameStates.currentGameMode === gameMode.StoryMode) {
      gameStates.SetGameState(storyModeStates.Paused, 'StoryMode')
      gameStates.CurrentLevel().pauseLevelTime()
      gameStates.CurrentLevel().cubers.forEach(function (cuber) {
        cuber.stopTimer()
      })
      return
    }

    if (gameStates.arrayChartController.findCurrentArrayChart() !== false) {
      gameStates.arrayChartController.arrayCharts[gameStates.arrayChartController.findCurrentArrayChart()].Keydown(event, keybindArray)
    }

    if (gameStates.currentStoryModeState === storyModeStates.Playing && gameStates.currentGameMode === gameMode.StoryMode) {
      gameStates.CurrentLevel().players.forEach(function (player) {
        player.Keydown(event, keybindArray)
        player.changeSlideVariables()
      })
    }
  }
}

const stopEvents = {
  stopMouseUp: false
}
export function KeyUp (event) {
  // console.log(event)
  if (stopEvents.stopMouseUp === true) {
    stopEvents.stopMouseUp = false
    return
  }
  if (!gameStates.loading) {
    if (gameStates.keybindController.seletingKeybind) { gameStates.keybindController.setKeybinds(event) }
  }
}
