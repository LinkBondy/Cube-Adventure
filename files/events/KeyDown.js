'use strict'
const { startingMenusStates, storyModeStates, gameMode, gameStates, eventFunctions, settingStates } = require('../data/GameData')
export function Keydown (event) {
  // console.log(event)
  const keybindArray = gameStates.keybindController.keybindSelectors[0].keybinds
  // const specialKeybindArray = gameStates.keybindController.keybindSelectors[1].keybinds
  // Debug Mode
  if (event.key === '.') {
    gameStates.debug = !gameStates.debug
    console.log(gameStates.debug)
  }
  // Start Game "Menu"
  if (gameStates.currentStartingMenusState === startingMenusStates.NotStarted) {
    gameStates.titleScreen.KeyDown(event, keybindArray)
    return
  }

  // Back Action
  if ((keybindArray[5/* back */].keybindA === event.key || keybindArray[5/* back */].keybindB === event.key) && (gameStates.currentStartingMenusState === startingMenusStates.Menu || gameStates.currentStartingMenusState === startingMenusStates.Selected) && !gameStates.keybindController.selectingKeybind) {
    eventFunctions.backButtonAction()
  }

  if (gameStates.menuController.CheckMenu() !== undefined) {
    gameStates.menuController.menus[gameStates.menuController.CheckMenu()].Keydown(event, keybindArray)
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

      if (gameStates.currentStoryModeState === storyModeStates.Playing) {
        for (let i = 0; i < gameStates.CurrentLevel().storage.items.length; i++) {
          if (gameStates.CurrentLevel().storage.items[i].availableFunctions[2]) {
            gameStates.CurrentLevel().storage.items[i].Keydown(event)
          }
        }
        if (eventFunctions.stopMovement) {
          eventFunctions.stopMovement = false
        } else {
          gameStates.CurrentLevel().players.forEach(function (player) {
            player.Keydown(event, keybindArray)
            player.changeSlideVariables()
          })
        }
      }
    }
    ///
    if (gameStates.currentGameMode === gameMode.AdventureLog) {
      gameStates.adventureLogController.Keydown(event, keybindArray)
    }
    ///
    // Game to Pause Menu
    if ((keybindArray[4/* select */].keybindA === event.key || keybindArray[4/* select */].keybindB === event.key) && gameStates.currentStoryModeState === storyModeStates.Playing && gameStates.currentGameMode === gameMode.StoryMode) {
      gameStates.CurrentLevel().pause()
      return
    }

    if (gameStates.arrayChartController.findCurrentArrayChart() !== false) {
      gameStates.arrayChartController.arrayCharts[gameStates.arrayChartController.findCurrentArrayChart()].Keydown(event, keybindArray)
    }
  }
}

export function KeyUp (event) {
  console.log(event)
  if (!gameStates.loading) {
    if (gameStates.currentSettingState === settingStates.Keybinds || gameStates.currentSettingState === settingStates.SpecialKeybinds) {
      if (gameStates.CurrentKeybind().selectingKeybind) {
        if (!eventFunctions.stopMouseUp) {
          gameStates.CurrentKeybind().setKeybinds(event)
        } else {
          eventFunctions.stopMouseUp = false
        }
      }
    }
  }
}
