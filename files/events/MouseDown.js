'use strict'
const { startingMenusStates, storyModeStates, gameMode, ShopMode, settingStates, gameStates } = require('../data/GameData')

export function MouseDown (event) {
  const isTouching = function (x, y, width, height, mouseX, mouseY) {
    const boxLeft = x
    const boxRight = x + width
    const boxTop = y
    const boxBottom = y + height
    ///
    if (mouseX >= boxLeft && mouseX <= boxRight &&
            mouseY >= boxTop && mouseY <= boxBottom) {
      return true
    }
    return false
  }

  // Start Game "Menu"
  if (gameStates.currentStartingMenusState === startingMenusStates.NotStarted) {
    gameStates.titleScreen.MouseDown(event, isTouching)
    return
  }

  // Back-Button / Pause-Button / Resume-Button
  if (isTouching(925, 475, 100, 100, event.offsetX, event.offsetY)) {
    console.log(gameStates.currentGameMode)
    if (gameStates.currentGameMode === gameMode.Unselected && gameStates.currentStartingMenusState > 1) {
      gameStates.SetGameState(gameStates.currentStartingMenusState - 1, 'Starting')
      return
    }

    if (gameStates.currentGameMode === gameMode.StoryMode) {
      if (gameStates.currentStoryModeState === 1) {
        gameStates.ReturnToMainMenu()
      } else if (gameStates.currentStoryModeState === storyModeStates.Playing) {
        // Pause Game
        gameStates.SetGameState(storyModeStates.Paused, 'StoryMode')
        gameStates.CurrentLevel().cubers.forEach(function (cuber) {
          window.clearTimeout(cuber.timeoutID)
          cuber.pausedDate = new Date()
        })
        gameStates.CurrentLevel().pauseLevelTime()
      } else if (gameStates.currentStoryModeState === storyModeStates.Paused) {
        // Resume Game
        gameStates.SetGameState(storyModeStates.Playing, 'StoryMode')
        gameStates.CurrentLevel().resumeLevelTime()
        gameStates.CurrentLevel().cubers.forEach(function (cuber) {
          cuber.setTimer()
        })
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

  // Check if an Array Chart is beening displayed
  if (gameStates.arrayChartController.findCurrentArrayChart() !== false) {
    const arrayChart = gameStates.arrayChartController.arrayCharts[gameStates.arrayChartController.findCurrentArrayChart()]
    for (let numberChecked = 0; numberChecked < arrayChart.items.length; numberChecked++) {
      if (isTouching(arrayChart.items[numberChecked].x, arrayChart.items[numberChecked].y, arrayChart.sectionWidth, arrayChart.sectionHeight, event.offsetX, event.offsetY)) {
        arrayChart.action(arrayChart, numberChecked)
      }
    }
  }

  if (gameStates.menuController.CheckMenu() !== undefined) {
    gameStates.menuController.menus[gameStates.menuController.CheckMenu()].MouseDown(event, isTouching)
    return
  }

  // Check if a game mode is selected
  if (gameStates.currentStartingMenusState === startingMenusStates.Selected) {
    if (gameStates.currentStoryModeState === storyModeStates.WorldSelecting) {
      gameStates.worldSelector.MouseDown(event, isTouching)
      return
    }

    if (gameStates.currentStoryModeState === storyModeStates.Selecting) {
      gameStates.levelSelector.MouseDown(event, isTouching)
      return
    }

    if (gameStates.currentGameMode === gameMode.ItemsInfo) {
      gameStates.infoController.Mousedown(event)
    }

    if (gameStates.currentStoryModeState === storyModeStates.Playing && gameStates.currentGameMode === gameMode.StoryMode) {
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
