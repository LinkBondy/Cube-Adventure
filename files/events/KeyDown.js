'use strict'
const { startingMenusStates, storyModeStates, gameMode, gameStates, eventFunctions } = require('../data/GameData')
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
    eventFunctions.backButtonAction()
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
      gameStates.CurrentLevel().pauseLevelTime()
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
