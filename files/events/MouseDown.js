'use strict'
const { startingMenusStates, storyModeStates, gameMode, gameStates, eventFunctions } = require('../data/GameData')

export function MouseDown (event) {
  // Start Game "Menu"
  if (gameStates.currentStartingMenusState === startingMenusStates.NotStarted) {
    gameStates.titleScreen.MouseDown(event)
    return
  }

  // Back-Button
  if (eventFunctions.isTouching(925, 475, 100, 100, event) && !(gameStates.currentStoryModeState === storyModeStates.Playing && gameStates.currentGameMode === gameMode.StoryMode)) {
    eventFunctions.backButtonAction()
    return
  }

  // Check if an Array Chart is beening displayed
  if (gameStates.arrayChartController.findCurrentArrayChart() !== false) {
    const arrayChart = gameStates.arrayChartController.arrayCharts[gameStates.arrayChartController.findCurrentArrayChart()]
    for (let numberChecked = 0; numberChecked < arrayChart.items.length; numberChecked++) {
      if (eventFunctions.isTouching(arrayChart.items[numberChecked].x, arrayChart.items[numberChecked].y, arrayChart.sectionWidth, arrayChart.sectionHeight, event)) {
        arrayChart.action(arrayChart, numberChecked)
      }
    }
  }

  if (gameStates.menuController.CheckMenu() !== undefined) {
    gameStates.menuController.menus[gameStates.menuController.CheckMenu()].MouseDown(event)
    return
  }

  // Check if a game mode is selected
  if (gameStates.currentStartingMenusState === startingMenusStates.Selected) {
    if (gameStates.currentStoryModeState === storyModeStates.WorldSelecting && gameStates.currentGameMode === gameMode.StoryMode) {
      gameStates.worldSelector.MouseDown(event)
      return
    }

    if (gameStates.currentStoryModeState === storyModeStates.Selecting && gameStates.currentGameMode === gameMode.StoryMode) {
      gameStates.levelSelector.MouseDown(event)
      return
    }

    if (gameStates.currentGameMode === gameMode.ItemsInfo) {
      gameStates.infoController.Mousedown(event)
    }

    if (gameStates.currentStoryModeState === storyModeStates.Playing && gameStates.currentGameMode === gameMode.StoryMode) {
      if (eventFunctions.isTouching(925, 475, 100, 100, event)) {
        // Pause Game
        gameStates.CurrentLevel().pauseLevelTime()
      } else {
        for (let i = 0; i < gameStates.CurrentLevel().storage.items.length; i++) {
          if (gameStates.CurrentLevel().storage.items[i].availableFunctions[2]) {
            gameStates.CurrentLevel().storage.items[i].Mousedown(event)
          }
        }

        if (eventFunctions.stopMovement) {
          eventFunctions.stopMovement = false
        } else {
          gameStates.CurrentLevel().players.forEach(function (player) {
            const leftOffset = player.x + player.width / 2 - 850 * (gameStates.CurrentLevel().currentX - 1) - event.offsetX
            const rightOffset = event.offsetX - (player.x + player.width / 2 - 850 * (gameStates.CurrentLevel().currentX - 1))
            const topOffset = player.y + player.height / 2 - 600 * (gameStates.CurrentLevel().currentY - 1) - event.offsetY
            const bottomOffset = event.offsetY - (player.y + player.height / 2 - 600 * (gameStates.CurrentLevel().currentY - 1))
            if (leftOffset > rightOffset && leftOffset > topOffset && leftOffset > bottomOffset) {
              player.moveLeft()
              return
            }
            if (rightOffset > leftOffset && rightOffset > topOffset && rightOffset > bottomOffset) {
              player.moveRight()
              return
            }
            if (topOffset > bottomOffset && topOffset > leftOffset && topOffset > rightOffset) {
              player.moveUp()
              return
            }
            if (bottomOffset > topOffset && bottomOffset > leftOffset && bottomOffset > rightOffset) {
              player.moveDown()
            }
          })
        }
      }
    }
  }
}
