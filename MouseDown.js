"use strict";
const {draw} = require('./Draw')
const {startingMenusStates, storyModeStates, gameMode, ShopMode, PlayerStyles, BackgroundStyles, cubeStyle, gameStates} = require ('./GameData')

export function MouseDown(event) {
    var isTouching = function(x, y, width, height, mouseX, mouseY, mouseWidth, mouseHeight) {
        var boxLeft = x
        var boxRight = x + width
        var boxTop = y
        var boxBottom = y + height
        var mouseLeft = mouseX
        var mouseRight = mouseX + mouseWidth
        var mouseTop = mouseY
        var mouseBottom = mouseY + mouseHeight
        if (boxLeft >= mouseLeft && boxLeft < mouseRight &&
            boxTop >= mouseTop && boxTop < mouseBottom) {
            return true
        }
        // Check if the right-top point is inside otherBox
        if (boxRight > mouseLeft && boxRight < mouseRight &&
            boxTop >= mouseTop && boxTop < mouseBottom) {
            return true
        } 
        // Check if the right-bottom point is inside otherBox
        if (boxRight > mouseLeft && boxRight < mouseRight &&
            boxBottom > mouseTop && boxBottom < mouseBottom) {
            return true
        }

        // Check if the left-bottom point is inside otherBox
        if (boxLeft >= mouseLeft && boxLeft < mouseRight &&
            boxBottom > mouseTop && boxBottom < mouseBottom) {
            return true
        }

        ////////////////////////

        // Check if the left-top point is inside otherBox
        if (mouseLeft >= boxLeft && mouseLeft < boxRight &&
            mouseTop >= boxTop && mouseTop < boxBottom) {
            return true
        }
        // Check if the right-top point is inside otherBox
        if (mouseRight > boxLeft && mouseRight < boxRight &&
            mouseTop >= boxTop && mouseTop < boxBottom) {
            return true
        }
        // Check if the right-bottom point is inside otherBox
        if (mouseRight > boxLeft && mouseRight < boxRight &&
            mouseBottom > boxTop && mouseBottom < boxBottom) {
            return true
        }

        // Check if the left-bottom point is inside otherBox
        if (mouseLeft >= boxLeft && mouseLeft < boxRight &&
            mouseBottom > boxTop && mouseBottom < boxBottom) {
            return true
        }
        return false
    }
    
    // Start Game "Menu"
    if (gameStates.currentStartingMenusState === startingMenusStates.NotStarted && isTouching(0, 500, 850, 100, event.offsetX, event.offsetY, 1, 1)) {
        gameStates.SetGameState(startingMenusStates.Menu, "Starting")
        return
    }

    if (isTouching(900, 475, 100, 100, event.offsetX, event.offsetY, 1, 1)) {
        if (gameStates.currentGameMode === gameMode.StoryMode && gameStates.currentStoryModeState === storyModeStates.Playing) {
            gameStates.SetGameState(storyModeStates.Paused, "StoryMode")
            gameStates.CurrentLevel().enemies.forEach(function(enemy) {    
                window.clearTimeout(enemy.timeoutID)
                enemy.pausedDate = new Date()
            })
            return 
        }

        if (gameStates.currentGameMode === gameMode.StoryMode && gameStates.currentStoryModeState === storyModeStates.Paused) {
            gameStates.SetGameState(storyModeStates.Playing, "StoryMode")
                gameStates.CurrentLevel().enemies.forEach(function(enemy) {
                    if (enemy.timeoutID !== null || enemy.timeoutID !== undefined) {
                        enemy.timeoutID = setTimeout(function() {
                            enemy.action()
                        }, enemy.waitTime - (enemy.pausedDate - enemy.oldDate))
                    }   
                })
            return 
        }

        else if (gameStates.currentShopMode > 1) {
            gameStates.currentShopMode = ShopMode.ShopMenu
            return    
        }

        else if (gameStates.currentStartingMenusState >= startingMenusStates.Menu && gameStates.currentStoryModeState === storyModeStates.Selecting) {
            gameStates.SetGameState(gameStates.currentStartingMenusState - 1, "Starting")
            return
        }
    }

    // Down "Menus"
    if (event.offsetY > gameStates.selectorYBottom && event.offsetY < 600 && event.offsetX < 850 && gameStates.menuController.CheckMenu() !== undefined)
        gameStates.menuController.menus[gameStates.menuController.CheckMenu()].moveDown()

    // Up "Menus"
    if (event.offsetY < gameStates.selectorY && event.offsetY < 600 && event.offsetX < 850 && gameStates.menuController.CheckMenu() !== undefined)
        gameStates.menuController.menus[gameStates.menuController.CheckMenu()].moveUp()
    
    // Selected "Menus"
    if (event.offsetY > gameStates.selectorY && event.offsetY < 600 && event.offsetX < 850 && event.offsetY < gameStates.selectorYBottom && gameStates.menuController.CheckMenu() !== undefined) {
        gameStates.menuController.menus[gameStates.menuController.CheckMenu()].selected() 
        return
    }

    if (gameStates.currentStartingMenusState === startingMenusStates.Selected) {
        // Down "Shop Backround"   
        if (gameStates.currentBackgroundStyle < 2 && gameStates.currentShopMode === ShopMode.Backround && gameStates.currentGameMode === gameMode.Shop && event.offsetX < 850 && event.offsetX > 690 && event.offsetY > 450 && event.offsetY < 600)
            gameStates.currentBackgroundStyle = gameStates.currentBackgroundStyle + 1

        // Up "Shop Backround"
        if (gameStates.currentBackgroundStyle != 1 && gameStates.currentShopMode === ShopMode.Backround && gameStates.currentGameMode === gameMode.Shop && event.offsetX < 160 && event.offsetX > 0 && event.offsetY > 450 && event.offsetY < 600)
            gameStates.currentBackgroundStyle = gameStates.currentBackgroundStyle - 1
        
        if (gameStates.currentGameMode === gameMode.Shop && gameStates.currentShopMode === ShopMode.Backround && event.offsetY > 425 && event.offsetY < 600 && event.offsetX < 610 && event.offsetX > 225) {
            
            if (gameStates.currentBackgroundStyle === BackgroundStyles.Plastic) {
                draw.spriteStyle = false
                draw.plasticStyle = true
            }

            if (gameStates.currentBackgroundStyle === BackgroundStyles.Sprite) {
                draw.plasticStyle = false
                draw.spriteStyle = true
            }
            return
            }

        // Down "Shop Player"   
        if ( gameStates.currentPlayerStyle < 5 && gameStates.currentShopMode === ShopMode.Player && gameStates.currentGameMode === gameMode.Shop && event.offsetX < 850 && event.offsetX > 690 && event.offsetY > 450 && event.offsetY < 600)
            gameStates.currentPlayerStyle = gameStates.currentPlayerStyle + 1

        // Up "Shop Player"
        if (gameStates.currentPlayerStyle != 1 && gameStates.currentShopMode === ShopMode.Player && gameStates.currentGameMode === gameMode.Shop && event.offsetX < 160 && event.offsetX > 0 && event.offsetY > 450 && event.offsetY < 600)
            gameStates.currentPlayerStyle = gameStates.currentPlayerStyle - 1
        
        if (gameStates.currentGameMode === gameMode.Shop && gameStates.currentShopMode === ShopMode.Player && event.offsetY > 425 && event.offsetY < 600 && event.offsetX < 610 && event.offsetX > 225) {
            
            if (gameStates.currentPlayerStyle === PlayerStyles.BlueCube) {
                gameStates.currentCubeStyle = cubeStyle.BlueCube
            }
            
            else if (gameStates.currentPlayerStyle === PlayerStyles.BlueCubeAlien && draw.blueCubeAlienLock === false) {
                gameStates.currentCubeStyle = cubeStyle.Alien   
            }
            
            else if (gameStates.currentPlayerStyle === PlayerStyles.BlueCubeLava) {
                gameStates.currentCubeStyle = cubeStyle.Lava
            }
            
            else if (gameStates.currentPlayerStyle === PlayerStyles.BlueCubeWooden && draw.blueCubeWoodenLock === false) {
                gameStates.currentCubeStyle = cubeStyle.Wooden 
            }
            
            else if (gameStates.currentPlayerStyle === PlayerStyles.BlueCubeSad && draw.blueCubeSadLock === false) {
                gameStates.currentCubeStyle = cubeStyle.Sad 
            } 
            
            return
        }

        // Down "Level Selector"   
        if (gameStates.currentLevelIndex < gameStates.levelController.levels.length - 1 && gameStates.currentStoryModeState === storyModeStates.Selecting && gameStates.currentGameMode === gameMode.StoryMode && event.offsetX < 850 && event.offsetX > 690 && event.offsetY > 450 && event.offsetY < 600 && gameStates.mobile === true)
            gameStates.currentLevelIndex = gameStates.currentLevelIndex + 1

        // Up "Level Selector"
        if (gameStates.currentLevelIndex != 0 && gameStates.currentStoryModeState === storyModeStates.Selecting && gameStates.currentGameMode === gameMode.StoryMode && event.offsetX < 160 && event.offsetX > 0 && event.offsetY > 450 && event.offsetY < 600 && gameStates.mobile === true)
            gameStates.currentLevelIndex = gameStates.currentLevelIndex - 1
        
        // Level Selector to Game
        if (gameStates.currentStoryModeState === storyModeStates.Selecting && gameStates.currentGameMode === gameMode.StoryMode && event.offsetY > 500 && event.offsetY < 600 && event.offsetX < 610 && event.offsetX > 225) {
            gameStates.SetGameState(storyModeStates.Playing, "StoryMode")
            return
        }

        if (gameStates.currentGameMode === gameMode.ItemsInfo) {
            gameStates.infoController.Mousedown(event)
        }
        
        if (gameStates.currentStoryModeState === storyModeStates.Playing && gameStates.currentGameMode === gameMode.StoryMode) {
            gameStates.CurrentLevel().players.forEach(function(player) {
                var leftOffset = player.x + player.width / 2 - 850 * (gameStates.CurrentLevel().currentX - 1) - event.offsetX
                var rightOffset = event.offsetX - (player.x + player.width / 2 - 850 * (gameStates.CurrentLevel().currentX - 1))
                var topOffset = player.y + player.height / 2 - 600 * (gameStates.CurrentLevel().currentY - 1) - event.offsetY 
                var bottomOffset = event.offsetY - (player.y + player.height / 2 - 600 * (gameStates.CurrentLevel().currentY - 1))
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
                    return
                }
            })
        }
    }
}