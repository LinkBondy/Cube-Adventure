'use strict'
const { startingMenusStates, storyModeStates, gameMode, ShopMode, settingStates, gameStates } = require('../data/GameData')
export function Keydown (event) {
  console.log(event)
  const keybindArray = gameStates.keybindController.keybinds
  // Start Game "Menu"
  if ((keybindArray[4/* select */].keybindA === event.key || keybindArray[4/* select */].keybindB === event.key) && gameStates.currentStartingMenusState === startingMenusStates.NotStarted) {
    gameStates.SetGameState(startingMenusStates.Menu, 'Starting')
    return
  }

  if ((keybindArray[5/* back */].keybindA === event.key || keybindArray[5/* back */].keybindB === event.key) && (gameStates.currentStartingMenusState === startingMenusStates.Menu || gameStates.currentStartingMenusState === startingMenusStates.Selected) && !gameStates.keybindController.seletingKeybind) {
    if (gameStates.currentShopMode > 1) {
      gameStates.currentShopMode = ShopMode.ShopMenu
      return
    }

    if (gameStates.currentSettingState > 1) {
      gameStates.SetGameState(settingStates.Selecting, 'Settings')
      return
    } else if (gameStates.currentStartingMenusState >= startingMenusStates.Menu && gameStates.currentStoryModeState === storyModeStates.Selecting) {
      gameStates.SetGameState(gameStates.currentStartingMenusState - 1, 'Starting')
      return
    }
  }
  if (gameStates.menuController.CheckMenu() !== undefined) {
    gameStates.menuController.menus[gameStates.menuController.CheckMenu()].Keydown(event, keybindArray, stopEvents)
    return
  }

  if (gameStates.currentStartingMenusState === startingMenusStates.Selected) {
    // Down "Level Selector"
    if ((keybindArray[3/* down */].keybindA === event.key || keybindArray[3/* down */].keybindB === event.key) && gameStates.currentLevelIndex < gameStates.levelController.levels.length - 1 && gameStates.currentStoryModeState === storyModeStates.Selecting && gameStates.currentGameMode === gameMode.StoryMode) { gameStates.currentLevelIndex = gameStates.currentLevelIndex + 1 }

    // Up "Level Selector"
    if ((keybindArray[2/* up */].keybindA === event.key || keybindArray[2/* up */].keybindB === event.key) && gameStates.currentLevelIndex !== 0 && gameStates.currentStoryModeState === storyModeStates.Selecting && gameStates.currentGameMode === gameMode.StoryMode) { gameStates.currentLevelIndex = gameStates.currentLevelIndex - 1 }

    // Level Selector to Game
    if ((keybindArray[4/* select */].keybindA === event.key || keybindArray[4/* select */].keybindB === event.key) && gameStates.currentStoryModeState === storyModeStates.Selecting && gameStates.currentGameMode === gameMode.StoryMode && gameStates.levelController.CheckLocked()) {
      gameStates.SetGameState(storyModeStates.Playing, 'StoryMode')
      return
    }
    ///
    if (gameStates.currentGameMode === gameMode.ItemsInfo) {
      gameStates.infoController.Keydown(event, keybindArray)
    }
    ///
    // Game to Pause Menu
    if ((keybindArray[4/* select */].keybindA === event.key || keybindArray[4/* select */].keybindB === event.key) && gameStates.currentStoryModeState === storyModeStates.Playing && gameStates.currentGameMode === gameMode.StoryMode) {
      gameStates.SetGameState(storyModeStates.Paused, 'StoryMode')
      gameStates.CurrentLevel().enemies.forEach(function (enemy) {
        enemy.stopTimer()
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
