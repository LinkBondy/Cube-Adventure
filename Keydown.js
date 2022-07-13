'use strict'
const { startingMenusStates, storyModeStates, gameMode, ShopMode, settingStates, gameStates } = require('./GameData')

export function Keydown (event) {
  console.log(event)
  const keybindArray = gameStates.keybindController.keybinds
  // Start Game "Menu"
  if ((keybindArray[4/* select */].keybindA === event.key || keybindArray[4/* select */].keybindB === event.key) && gameStates.currentStartingMenusState === startingMenusStates.NotStarted) {
    gameStates.SetGameState(startingMenusStates.Menu, 'Starting')
    return
  }

  if ((keybindArray[5/* back */].keybindA === event.key || keybindArray[5/* back */].keybindB === event.key) && (gameStates.currentStartingMenusState === startingMenusStates.Menu || gameStates.currentStartingMenusState === startingMenusStates.Selected && !gameStates.keybindController.seletingKeybind)) {
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
  // Left "Menus"
  if ((keybindArray[0/* left */].keybindA === event.key || keybindArray[0/* left */].keybindB === event.key) && gameStates.menuController.CheckMenu() !== undefined) { gameStates.menuController.menus[gameStates.menuController.CheckMenu()].moveLeft() }

  // Right "Menus"
  if ((keybindArray[1/* right */].keybindA === event.key || keybindArray[1/* right */].keybindB === event.key) && gameStates.menuController.CheckMenu() !== undefined) { gameStates.menuController.menus[gameStates.menuController.CheckMenu()].moveRight() }

  // Down "Menus"
  if ((keybindArray[3/* down */].keybindA === event.key || keybindArray[3/* down */].keybindB === event.key) && gameStates.menuController.CheckMenu() !== undefined) { gameStates.menuController.menus[gameStates.menuController.CheckMenu()].moveDown() }

  // Up "Menus"
  if ((keybindArray[2/* up */].keybindA === event.key || keybindArray[2/* up */].keybindB === event.key) && gameStates.menuController.CheckMenu() !== undefined) { gameStates.menuController.menus[gameStates.menuController.CheckMenu()].moveUp() }

  // Selected "Menus"
  if ((keybindArray[4/* select */].keybindA === event.key || keybindArray[4/* select */].keybindB === event.key) && gameStates.menuController.CheckMenu() !== undefined) {
    gameStates.menuController.menus[gameStates.menuController.CheckMenu()].selected()
    if (gameStates.keybindController.seletingKeybind) { stopEvents.stopMouseUp = true }
    return
  }

  if (gameStates.currentStartingMenusState === startingMenusStates.Selected) {
    // Down "Level Selector"
    if ((keybindArray[3/* down */].keybindA === event.key || keybindArray[3/* down */].keybindB === event.key) && gameStates.currentLevelIndex < gameStates.levelController.levels.length - 1 && gameStates.currentStoryModeState === storyModeStates.Selecting && gameStates.currentGameMode === gameMode.StoryMode) { gameStates.currentLevelIndex = gameStates.currentLevelIndex + 1 }

    // Up "Level Selector"
    if ((keybindArray[2/* up */].keybindA === event.key || keybindArray[2/* up */].keybindB === event.key) && gameStates.currentLevelIndex != 0 && gameStates.currentStoryModeState === storyModeStates.Selecting && gameStates.currentGameMode === gameMode.StoryMode) { gameStates.currentLevelIndex = gameStates.currentLevelIndex - 1 }

    // Level Selector to Game
    if ((keybindArray[4/* select */].keybindA === event.key || keybindArray[4/* select */].keybindB === event.key) && gameStates.currentStoryModeState === storyModeStates.Selecting && gameStates.currentGameMode === gameMode.StoryMode && gameStates.levelController.CheckLocked()) {
      gameStates.SetGameState(storyModeStates.Playing, 'StoryMode')
      return
    }
    ///
    if (gameStates.currentGameMode === gameMode.ItemsInfo) {
      gameStates.infoController.Keydown(event)
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
      const arrayChart = gameStates.arrayChartController.arrayCharts[gameStates.arrayChartController.findCurrentArrayChart()]
      // "Left" Arrow || "a" Key
      if ((keybindArray[0/* left */].keybindA === event.key || keybindArray[0/* left */].keybindB === event.key) && arrayChart.currentX !== 0) { arrayChart.currentX-- }

      // "Right" Arrow || "d" Key
      if ((keybindArray[1/* right */].keybindA === event.key || keybindArray[1/* right */].keybindB === event.key) && arrayChart.currentX !== arrayChart.loopWidth - 1) { arrayChart.currentX++ }

      // "Up" Arrow || "w" Key
      if ((keybindArray[2/* up */].keybindA === event.key || keybindArray[2/* up */].keybindB === event.key) && arrayChart.currentY !== 0) { arrayChart.currentY-- }

      // "Down" Arrow || "s" Key
      if ((keybindArray[3/* down */].keybindA === event.key || keybindArray[3/* down */].keybindB === event.key) && arrayChart.currentY !== arrayChart.loopHeight - 1) { arrayChart.currentY++ }

      if ((keybindArray[4/* select */].keybindA === event.key || keybindArray[4/* select */].keybindB === event.key)) {
        arrayChart.action(arrayChart, arrayChart.currentY * arrayChart.loopWidth + arrayChart.currentX)
        return
      }
      return
    }

    if (gameStates.currentStoryModeState === storyModeStates.Playing && gameStates.currentGameMode === gameMode.StoryMode) {
      gameStates.CurrentLevel().players.forEach(function (player) {
        // "Right" Arrow || "d" Key
        if (keybindArray[1/* right */].keybindA === event.key || keybindArray[1/* right */].keybindB === event.key) {
          player.moveRight()
          return
        }

        // "Down" Arrow || "s" Key
        if (keybindArray[3/* down */].keybindA === event.key || keybindArray[3/* down */].keybindB === event.key) {
          player.moveDown()
          return
        }

        // "Up" Arrow || "w" Key
        if (keybindArray[2/* up */].keybindA === event.key || keybindArray[2/* up */].keybindB === event.key) {
          player.moveUp()
          return
        }

        // "Left" Arrow || "a" Key
        if (keybindArray[0/* left */].keybindA === event.key || keybindArray[0/* left */].keybindB === event.key) {
          player.moveLeft()
          return
        }
        player.changeSlideVariables()
      })
    }
  }
}

export var stopEvents = {
  stopMouseUp: false
}
export function KeyUp (event) {
  console.log(event)
  if (stopEvents.stopMouseUp === true) {
    stopEvents.stopMouseUp = false
    return
  }

  if (gameStates.keybindController.seletingKeybind) { gameStates.keybindController.setKeybinds(event) }
}
