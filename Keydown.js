"use strict";
const {startingMenusStates, storyModeStates, gameMode, ShopMode, PlayerStyles, BackgroundStyles, cubeStyle, gameStates, levelTools} = require ('./GameData')
const {draw} = require('./Draw')

export function Keydown(event) {
    console.log(event)
    // Start Game "Menu"
    if ((event.key === " " || event.key === "Enter") && gameStates.currentStartingMenusState === startingMenusStates.NotStarted) {
        gameStates.SetGameState(startingMenusStates.Menu, "Starting")
        return
    }

    if (event.key === "Backspace" && (gameStates.currentStartingMenusState === startingMenusStates.Menu || gameStates.currentStartingMenusState === startingMenusStates.Selected)) {           
        if (gameStates.currentShopMode > 1) {
            gameStates.currentShopMode = ShopMode.ShopMenu
            return   
        }

        else if (gameStates.currentStartingMenusState >= startingMenusStates.Menu && gameStates.currentStoryModeState === storyModeStates.Selecting) {
            gameStates.SetGameState(gameStates.currentStartingMenusState - 1, "Starting")
            return
        }
    }
    // Down "Menus"
    if ((event.keyCode === 40 || event.key === "s") && gameStates.menuController.CheckMenu() !== undefined)
        gameStates.menuController.menus[gameStates.menuController.CheckMenu()].moveDown()

    // Up "Menus"
    if ((event.keyCode === 38 || event.key === "w") && gameStates.menuController.CheckMenu() !== undefined)
        gameStates.menuController.menus[gameStates.menuController.CheckMenu()].moveUp()
    
    // Selected "Menus"
    if ((event.key === " " || event.key === "Enter") && gameStates.menuController.CheckMenu() !== undefined) {
        gameStates.menuController.menus[gameStates.menuController.CheckMenu()].selected() 
        return
    }

    if (gameStates.currentStartingMenusState === startingMenusStates.Selected) {
        // Down "Shop Backround"   
        if ((event.keyCode === 40 || event.key === "s") && gameStates.currentBackgroundStyle < 2 && gameStates.currentShopMode === ShopMode.Backround && gameStates.currentGameMode === gameMode.Shop)
            gameStates.currentBackgroundStyle = gameStates.currentBackgroundStyle + 1

        // Up "Shop Backround"
        if ((event.keyCode === 38 || event.key === "w") && gameStates.currentBackgroundStyle != 1 && gameStates.currentShopMode === ShopMode.Backround && gameStates.currentGameMode === gameMode.Shop)
            gameStates.currentBackgroundStyle = gameStates.currentBackgroundStyle - 1
        
        if ((event.key === " " || event.key === "Enter") && gameStates.currentGameMode === gameMode.Shop && gameStates.currentShopMode === ShopMode.Backround) {
            
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
        if ((event.keyCode === 40 || event.key === "s") && gameStates.currentPlayerStyle < 5 && gameStates.currentShopMode === ShopMode.Player && gameStates.currentGameMode === gameMode.Shop)
            gameStates.currentPlayerStyle = gameStates.currentPlayerStyle + 1

        // Up "Shop Player"
        if ((event.keyCode === 38 || event.key === "w") && gameStates.currentPlayerStyle != 1 && gameStates.currentShopMode === ShopMode.Player && gameStates.currentGameMode === gameMode.Shop)
            gameStates.currentPlayerStyle = gameStates.currentPlayerStyle - 1
        
        if ((event.key === " " || event.key === "Enter")  && gameStates.currentShopMode === ShopMode.Player && gameStates.currentGameMode === gameMode.Shop) {
            
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
    ///
        // Down "Level Selector"   
        if ((event.keyCode === 40 || event.key === "s") && gameStates.currentLevelIndex < gameStates.levelController.levels.length - 1 && gameStates.currentStoryModeState === storyModeStates.Selecting && gameStates.currentGameMode === gameMode.StoryMode)
            gameStates.currentLevelIndex = gameStates.currentLevelIndex + 1

        // Up "Level Selector"
        if ((event.keyCode === 38 || event.key === "w") && gameStates.currentLevelIndex != 0 && gameStates.currentStoryModeState === storyModeStates.Selecting && gameStates.currentGameMode === gameMode.StoryMode)
            gameStates.currentLevelIndex = gameStates.currentLevelIndex - 1

        // Level Selector to Game
        if ((event.key === " " || event.key === "Enter") && gameStates.currentStoryModeState === storyModeStates.Selecting && gameStates.currentGameMode === gameMode.StoryMode && gameStates.levelController.CheckLocked()) {
            gameStates.SetGameState(storyModeStates.Playing, "StoryMode")
            return
        }
    ///
        if (gameStates.currentGameMode === gameMode.ItemsInfo) {
            gameStates.infoController.Keydown(event)
        }
    ///
        // Game to Pause Menu
        if ((event.key === " " || event.key === "Enter") && gameStates.currentStoryModeState === storyModeStates.Playing && gameStates.currentGameMode === gameMode.StoryMode) {
            gameStates.SetGameState(storyModeStates.Paused, "StoryMode")
            return
        }

        if (gameStates.currentStoryModeState === storyModeStates.Playing && gameStates.currentGameMode === gameMode.StoryMode) {
            //console.log('key pressed/')
                // "Right" Arrow || "d" Key
            gameStates.CurrentLevel().players.forEach(function(player) {    
                if ((event.keyCode === 39 || event.key === "d") && player.x < 800)
                player.moveRight()
                return
            })
            
                // "Down" Arrow || "s" Key
            gameStates.CurrentLevel().players.forEach(function(player) {    
                if ((event.keyCode === 40 || event.key === "s") && player.y < 550)
                player.moveDown()
                return
            })
            
                // "Up" Arrow || "w" Key
            gameStates.CurrentLevel().players.forEach(function(player) {    
                if ((event.keyCode === 38 || event.key === "w") && player.y !== 0)
                player.moveUp()
                return
            })
            
                // "Left" Arrow || "a" Key
            gameStates.CurrentLevel().players.forEach(function(player) {
                if ((event.keyCode === 37 || event.key === "a") && player.x !== 0)
                player.moveLeft()
                return
            })
        }
    }       
}