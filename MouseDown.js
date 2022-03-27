"use strict";
var exitNumber = 0
const {draw} = require('./Draw')
const {GameState, GameMode, ShopMode, PlayerStyles, BackgroundStyles, cubeStyle, gameStates, levelTools} = require ('./GameData')

export function MouseDown(event) {
    // Start Game "Menu"
    if (gameStates.currentGameState === GameState.NotStarted && event.offsetY > 500 && event.offsetY < 600 && event.offsetX < 850) {
        gameStates.SetGameState(GameState.Menu)
        return
    }
    ///
        function CheckExit() {
            gameStates.CurrentLevel().players.forEach(function(player) { 
                if (event.offsetX < player.x + 50 && event.offsetX > player.x && event.offsetY < player.y + 50 && event.offsetY > player.y && gameStates.currentGameMode < 3 && gameStates.currentGameState === GameState.Started) {
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
        ///  
        if (event.offsetY > 0 && event.offsetY < 100 && event.offsetX < 850 && event.offsetX > 750 && gameStates.currentGameState <= 2 && gameStates.currentGameState > 0 && gameStates.mobile || CheckExit()) {
            if (gameStates.currentGameMode === GameMode.StoryMode && gameStates.currentGameState === GameState.Started) {
                gameStates.SetGameState(GameState.Paused)
                return 
            }

            else if (gameStates.currentGameState <= 3 && gameStates.currentGameState > 0) {
                gameStates.SetGameState(gameStates.currentGameState - 1)
            }

            if (gameStates.currentGameMode === GameMode.Freeplay) {
                levelTools.Restart()
                gameStates.currentLevelIndex = gameStates.infoController.unlockedLevel
                levelTools.Restart()   
            }
        
            else if (gameStates.currentShopMode > 1) {
                gameStates.currentShopMode = ShopMode.ShopMenu    
            }
            return
        }
    ///
    // Down "Menu"
    if (gameStates.currentGameState === GameState.Menu && event.offsetY > gameStates.selectorYBottom && event.offsetY < 600 && event.offsetX < 850)
        gameStates.menuController.MainMenu.moveDown()

    // Up "Menu"
    if (gameStates.currentGameState === GameState.Menu && event.offsetY < gameStates.selectorY && event.offsetY < 600 && event.offsetX < 850)
        gameStates.menuController.MainMenu.moveUp()
    
    if (gameStates.currentGameState === GameState.Menu && event.offsetY > gameStates.selectorY && event.offsetY < 600 && event.offsetX < 850 && event.offsetY < gameStates.selectorYBottom) {
        gameStates.menuController.MainMenu.selected() 
        return
    }

    ///

    // Down "Shop"
    if (gameStates.currentGameState === GameState.Rules && gameStates.currentGameMode === GameMode.Shop && event.offsetY > gameStates.selectorYBottom && event.offsetX < 850)
        gameStates.menuController.ShopMenu.moveDown()

    // Up "Shop"
    if (gameStates.currentGameState === GameState.Rules && gameStates.currentGameMode === GameMode.Shop && event.offsetY < gameStates.selectorY && event.offsetX < 850)
        gameStates.menuController.ShopMenu.moveUp()

    if (gameStates.currentGameState === GameState.Rules && gameStates.currentGameMode === GameMode.Shop && event.offsetY > gameStates.selectorY && event.offsetY < gameStates.selectorYBottom && event.offsetX < 850) {
        gameStates.menuController.ShopMenu.selected()
        return
    }

    ///

    // Down "Shop Backround"   
    if (gameStates.currentBackgroundStyle < 2 && gameStates.currentGameState === GameState.Started && gameStates.currentShopMode === ShopMode.Backround && gameStates.currentGameMode === GameMode.Shop && event.offsetX < 850 && event.offsetX > 690 && event.offsetY > 450 && event.offsetY < 600)
        gameStates.currentBackgroundStyle = gameStates.currentBackgroundStyle + 1

    // Up "Shop Backround"
    if (gameStates.currentBackgroundStyle != 1 && gameStates.currentGameState === GameState.Started && gameStates.currentShopMode === ShopMode.Backround && gameStates.currentGameMode === GameMode.Shop && event.offsetX < 160 && event.offsetX > 0 && event.offsetY > 450 && event.offsetY < 600)
        gameStates.currentBackgroundStyle = gameStates.currentBackgroundStyle - 1
    
    if (gameStates.currentGameState === GameState.Started && gameStates.currentGameMode === GameMode.Shop && gameStates.currentShopMode === ShopMode.Backround && event.offsetY > 425 && event.offsetY < 600 && event.offsetX < 610 && event.offsetX > 225) {
        
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
    if ( gameStates.currentPlayerStyle < 5 && gameStates.currentGameState === GameState.Started && gameStates.currentShopMode === ShopMode.Player && gameStates.currentGameMode === GameMode.Shop && event.offsetX < 850 && event.offsetX > 690 && event.offsetY > 450 && event.offsetY < 600)
        gameStates.currentPlayerStyle = gameStates.currentPlayerStyle + 1

    // Up "Shop Player"
    if (gameStates.currentPlayerStyle != 1 && gameStates.currentGameState === GameState.Started && gameStates.currentShopMode === ShopMode.Player && gameStates.currentGameMode === GameMode.Shop && event.offsetX < 160 && event.offsetX > 0 && event.offsetY > 450 && event.offsetY < 600)
        gameStates.currentPlayerStyle = gameStates.currentPlayerStyle - 1
    
    if (gameStates.currentGameState === GameState.Started && gameStates.currentGameMode === GameMode.Shop && gameStates.currentShopMode === ShopMode.Player && event.offsetY > 425 && event.offsetY < 600 && event.offsetX < 610 && event.offsetX > 225) {
        
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


    // Down "Freeplay"   
    if (gameStates.currentLevelIndex < gameStates.levelController.levels.length - 1 && gameStates.currentGameState === GameState.Rules && gameStates.currentGameMode === GameMode.Freeplay && event.offsetX < 850 && event.offsetX > 690 && event.offsetY > 450 && event.offsetY < 600 && gameStates.mobile === true)
        gameStates.currentLevelIndex = gameStates.currentLevelIndex + 1

    // Up "Freeplay"
    if (gameStates.currentLevelIndex != 0 && gameStates.currentGameState === GameState.Rules && gameStates.currentGameMode === GameMode.Freeplay && event.offsetX < 160 && event.offsetX > 0 && event.offsetY > 450 && event.offsetY < 600 && gameStates.mobile === true)
        gameStates.currentLevelIndex = gameStates.currentLevelIndex - 1

    if (gameStates.currentGameMode === GameMode.ItemsInfo) {
        gameStates.infoController.Mousedown(event)
    }

    // Rules to Game "Story Mode"
    if (gameStates.currentGameState === GameState.Rules && gameStates.currentGameMode === GameMode.StoryMode && event.offsetY > 500 && event.offsetY < 600 && event.offsetX < 850) {
        gameStates.SetGameState(GameState.Started)
        return
    }

    // Rules to Game "Freeplay"
    if (gameStates.currentGameState === GameState.Rules && gameStates.currentGameMode === GameMode.Freeplay && event.offsetY > 500 && event.offsetY < 600 && event.offsetX < 610 && event.offsetX > 225) {
        gameStates.SetGameState(GameState.Started)
        return
    }

    // Down "Pause Menu"
    if (gameStates.currentGameState === GameState.Paused && gameStates.currentGameMode === GameMode.StoryMode && event.offsetY > gameStates.selectorYBottom && event.offsetY < 600 && event.offsetX < 850)
        gameStates.menuController.PauseMenu.moveDown()


    // Up "Pause Menu"
    if (gameStates.currentGameState === GameState.Paused && gameStates.currentGameMode === GameMode.StoryMode && event.offsetY < gameStates.selectorY && event.offsetY < 600 && event.offsetX < 850)
        gameStates.menuController.PauseMenu.moveUp()

    if (gameStates.currentGameState === GameState.Paused && gameStates.currentGameMode === GameMode.StoryMode && event.offsetY > gameStates.selectorY && event.offsetY < gameStates.selectorYBottom && event.offsetX < 850) {
        gameStates.menuController.PauseMenu.selected()
        return
    }
    
    // Down "Win"
    if (gameStates.currentGameState === GameState.WonStage && event.offsetY > gameStates.selectorYBottom && event.offsetY < 600 && event.offsetX < 850)
        gameStates.menuController.WinMenu.moveDown()


    // Up "Win"
    if (gameStates.currentGameState === GameState.WonStage && event.offsetY < gameStates.selectorY && event.offsetY < 600 && event.offsetX < 850)
        gameStates.menuController.WinMenu.moveUp()

    if (gameStates.currentGameState === GameState.WonStage && event.offsetY > gameStates.selectorY && event.offsetY < 600 && event.offsetX < 850 && event.offsetY < gameStates.selectorYBottom) {
        gameStates.menuController.WinMenu.selected()
        return
    }

    if (gameStates.currentGameState === GameState.Lost && gameStates.currentGameMode === GameMode.Freeplay) {
        levelTools.Restart()
        gameStates.currentGameState = GameState.Rules
    }

    // Down "Lost"
    if (gameStates.currentGameState === GameState.Lost && gameStates.currentGameMode === GameMode.StoryMode && event.offsetY > gameStates.selectorYBottom && event.offsetY < 600 && event.offsetX < 850)
        gameStates.menuController.LoseMenu.moveDown()


    // Up "Lost"
    if (gameStates.currentGameState === GameState.Lost && gameStates.currentGameMode === GameMode.StoryMode && event.offsetY < gameStates.selectorY && event.offsetY < 600 && event.offsetX < 850)
        gameStates.menuController.LoseMenu.moveUp()

    if (gameStates.currentGameState === GameState.Lost && gameStates.currentGameMode === GameMode.StoryMode && event.offsetY > gameStates.selectorY && event.offsetY < 600 && event.offsetX < 850 && event.offsetY < gameStates.selectorYBottom) {
        gameStates.menuController.LoseMenu.selected()
        return
    }

    ///
    
    if (gameStates.currentGameState !== GameState.Started || gameStates.currentGameMode === GameMode.Shop) {
        return
    }

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
