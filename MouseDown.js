"use strict";
var exitNumber = 0
const {draw} = require('./Draw')
const {startingMenusStates, storyModeStates, gameMode, ShopMode, PlayerStyles, BackgroundStyles, cubeStyle, gameStates} = require ('./GameData')

export function MouseDown(event) {
    // Start Game "Menu"
    if (gameStates.currentStartingMenusState === startingMenusStates.NotStarted && event.offsetY > 500 && event.offsetY < 600 && event.offsetX < 850) {
        gameStates.SetGameState(startingMenusStates.Menu, "Starting")
        return
    }

    function CheckExit() {
        gameStates.CurrentLevel().players.forEach(function(player) { 
            if (event.offsetX < player.x + 50 && event.offsetX > player.x && event.offsetY < player.y + 50 && event.offsetY > player.y && gameStates.currentGameMode < 3 && gameStates.currentStoryModeState === storyModeStates.Playing) {
                exitNumber++
            }
        })
        if (exitNumber === 2) {
            exitNumber = 0
            return true
        } else {
            return false
        }
    }

        if (event.offsetY > 0 && event.offsetY < 100 && event.offsetX < 850 && event.offsetX > 750 && gameStates.mobile || CheckExit()) {
            if (gameStates.currentGameMode === gameMode.StoryMode && gameStates.storyModeStates === storyModeStates.Playing) {
                gameStates.SetGameState(storyModeStates.Paused, "StoryMode")
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
            // "Right" Arrow /// "d" Key (Right)
            gameStates.CurrentLevel().players.forEach(function(player) {    
                if (event.offsetX > player.x + 50 && event.offsetY > player.y - 50 && event.offsetY < player.y + 100 && player.x < 800 && event.offsetY < 600 && event.offsetX < 850)
                player.moveRight()
                return
            })

            
                // "Down" Arrow / "s" Key (Down)
            gameStates.CurrentLevel().players.forEach(function(player) {    
                if (event.offsetY > player.y + 50 && event.offsetX > player.x - 50 && event.offsetX < player.x + 100 && player.y < 550 && event.offsetY < 600 && event.offsetX < 850)
                player.moveDown()
                return
            })
            
                // "Up" Arrow / "w" Key (Up)
                gameStates.CurrentLevel().players.forEach(function(player) {    
                if (event.offsetY < player.y && event.offsetX > player.x - 50 && event.offsetX < player.x + 100 && player.y !== 0 && event.offsetY < 600 && event.offsetX < 850)
                player.moveUp()
                return
            })

                // "Left" Arrow / "a" Key (Left)
            gameStates.CurrentLevel().players.forEach(function(player) {
                if (event.offsetX < player.x && event.offsetY > player.y - 50 && event.offsetY < player.y + 100 && player.x !== 0 && event.offsetY < 600 && event.offsetX < 850)
                player.moveLeft()
                return
            })
        }
    }
}