'use strict'
const { startingMenusStates, storyModeStates, gameMode, ShopMode, settingStates, gameStates } = require('./GameData')

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
  if (gameStates.currentStartingMenusState === startingMenusStates.NotStarted && isTouching(0, 500, 850, 100, event.offsetX, event.offsetY)) {
    gameStates.SetGameState(startingMenusStates.Menu, 'Starting')
    return
  }

  if (isTouching(900, 475, 100, 100, event.offsetX, event.offsetY)) {
    if (gameStates.currentGameMode === gameMode.StoryMode && gameStates.currentStoryModeState === storyModeStates.Playing) {
      gameStates.SetGameState(storyModeStates.Paused, 'StoryMode')
      gameStates.CurrentLevel().enemies.forEach(function (enemy) {
        window.clearTimeout(enemy.timeoutID)
        enemy.pausedDate = new Date()
      })
      return
    }

    if (gameStates.currentGameMode === gameMode.StoryMode && gameStates.currentStoryModeState === storyModeStates.Paused) {
      gameStates.SetGameState(storyModeStates.Playing, 'StoryMode')
      gameStates.CurrentLevel().enemies.forEach(function (enemy) {
        enemy.setTimer()
      })
      return
    } else if (gameStates.currentShopMode > 1) {
      gameStates.currentShopMode = ShopMode.ShopMenu
      return
    } else if (gameStates.currentSettingState > 1) {
      switch (gameStates.keybindController.seletingKeybind) {
        case true:
          gameStates.keybindController.finishRebinding()
          break

        case false:
          gameStates.currentSettingState = settingStates.Selecting
          break
      }
      return
    } else if (gameStates.currentStartingMenusState >= startingMenusStates.Menu && gameStates.currentStoryModeState === storyModeStates.Selecting) {
      gameStates.SetGameState(gameStates.currentStartingMenusState - 1, 'Starting')
      return
    }
  }
  if (gameStates.arrayChartController.findCurrentArrayChart() !== false) {
    const arrayChart = gameStates.arrayChartController.arrayCharts[gameStates.arrayChartController.findCurrentArrayChart()]
    for (let numberChecked = 0; numberChecked < arrayChart.items.length; numberChecked++) {
      if (isTouching(arrayChart.items[numberChecked].x, arrayChart.items[numberChecked].y, arrayChart.sectionWidth, arrayChart.sectionHeight, event.offsetX, event.offsetY)) {
        arrayChart.action(arrayChart, numberChecked)
      }
    }
  }

  // Left "Menus"
  if (isTouching(0, gameStates.selectorY, gameStates.selectorX, gameStates.selectorYBottom - gameStates.selectorY, event.offsetX, event.offsetY) && gameStates.menuController.CheckMenu() !== undefined) { gameStates.menuController.menus[gameStates.menuController.CheckMenu()].moveLeft() }

  // Right "Menus"
  if (isTouching(gameStates.selectorXBottom + 1, gameStates.selectorY, 850 - gameStates.selectorXBottom, gameStates.selectorYBottom - gameStates.selectorY, event.offsetX, event.offsetY) && gameStates.menuController.CheckMenu() !== undefined) { gameStates.menuController.menus[gameStates.menuController.CheckMenu()].moveRight() }

  // Down "Menus"
  if (isTouching(gameStates.selectorX, gameStates.selectorYBottom + 1, gameStates.selectorXBottom - gameStates.selectorX, 600 - gameStates.selectorYBottom, event.offsetX, event.offsetY) && gameStates.menuController.CheckMenu() !== undefined) { gameStates.menuController.menus[gameStates.menuController.CheckMenu()].moveDown() }

  // Up "Menus"
  if (isTouching(gameStates.selectorX, 0, gameStates.selectorXBottom - gameStates.selectorX, gameStates.selectorY, event.offsetX, event.offsetY) && gameStates.menuController.CheckMenu() !== undefined) { gameStates.menuController.menus[gameStates.menuController.CheckMenu()].moveUp() }

  // Selected "Menus"
  if (isTouching(gameStates.selectorX, gameStates.selectorY - 1, gameStates.selectorXBottom - gameStates.selectorX, gameStates.selectorYBottom - gameStates.selectorY, event.offsetX, event.offsetY) && gameStates.menuController.CheckMenu() !== undefined) {
    gameStates.menuController.menus[gameStates.menuController.CheckMenu()].selected()
    return
  }

  if (gameStates.currentStartingMenusState === startingMenusStates.Selected) {
    // Down "Level Selector"
    if (gameStates.currentLevelIndex < gameStates.levelController.levels.length - 1 && gameStates.currentStoryModeState === storyModeStates.Selecting && gameStates.currentGameMode === gameMode.StoryMode && event.offsetX < 850 && event.offsetX > 690 && event.offsetY > 450 && event.offsetY < 600 && gameStates.mobile === true) { gameStates.currentLevelIndex = gameStates.currentLevelIndex + 1 }

    // Up "Level Selector"
    if (gameStates.currentLevelIndex != 0 && gameStates.currentStoryModeState === storyModeStates.Selecting && gameStates.currentGameMode === gameMode.StoryMode && event.offsetX < 160 && event.offsetX > 0 && event.offsetY > 450 && event.offsetY < 600 && gameStates.mobile === true) { gameStates.currentLevelIndex = gameStates.currentLevelIndex - 1 }

    // Level Selector to Game
    if (gameStates.currentStoryModeState === storyModeStates.Selecting && gameStates.currentGameMode === gameMode.StoryMode && event.offsetY > 500 && event.offsetY < 600 && event.offsetX < 610 && event.offsetX > 225) {
      gameStates.SetGameState(storyModeStates.Playing, 'StoryMode')
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
