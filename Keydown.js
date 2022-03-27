"use strict";
const {GameState, GameMode, ShopMode, PlayerStyles, BackgroundStyles, cubeStyle, gameStates, levelTools} = require ('./GameData')
const {draw} = require('./Draw')

export function Keydown(event) {
    //console.log(event)
    // Start Game "Menu"
    if ((event.key === " " || event.key === "Enter") && gameStates.currentGameState === GameState.NotStarted) {
        gameStates.SetGameState(GameState.Menu)
        return
    }

///
    // Down "Menu"
    if ((event.keyCode === 40 || event.key === "s") && gameStates.currentGameState === GameState.Menu)
        gameStates.menuController.MainMenu.moveDown()

    // Up "Menu"
    if ((event.keyCode === 38 || event.key === "w") && gameStates.currentGameState === GameState.Menu)
        gameStates.menuController.MainMenu.moveUp()
    
    if ((event.key === " " || event.key === "Enter") && gameStates.currentGameState === GameState.Menu) {
        gameStates.menuController.MainMenu.selected() 
        return
    }
///
    // Down "Shop"
    if ((event.keyCode === 40 || event.key === "s") && gameStates.currentGameState === GameState.Rules && gameStates.currentGameMode === GameMode.Shop)
        gameStates.menuController.ShopMenu.moveDown()


    // Up "Shop"
    if ((event.keyCode === 38 || event.key === "w") && gameStates.currentGameState === GameState.Rules && gameStates.currentGameMode === GameMode.Shop)
        gameStates.menuController.ShopMenu.moveUp()
///

    if ((event.key === " " || event.key === "Enter") && gameStates.currentGameState === GameState.Rules && gameStates.currentGameMode === GameMode.Shop) {
        gameStates.menuController.ShopMenu.selected()
        return
    }
///
    // Down "Shop Backround"   
    if ((event.keyCode === 40 || event.key === "s") && gameStates.currentBackgroundStyle < 2 && gameStates.currentGameState === GameState.Started && gameStates.currentShopMode === ShopMode.Backround && gameStates.currentGameMode === GameMode.Shop)
        gameStates.currentBackgroundStyle = gameStates.currentBackgroundStyle + 1

    // Up "Shop Backround"
    if ((event.keyCode === 38 || event.key === "w") && gameStates.currentBackgroundStyle != 1 && gameStates.currentGameState === GameState.Started && gameStates.currentShopMode === ShopMode.Backround && gameStates.currentGameMode === GameMode.Shop)
        gameStates.currentBackgroundStyle = gameStates.currentBackgroundStyle - 1
    
    if ((event.key === " " || event.key === "Enter") && gameStates.currentGameState === GameState.Started && gameStates.currentGameMode === GameMode.Shop && gameStates.currentShopMode === ShopMode.Backround) {
        
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
    if ((event.keyCode === 40 || event.key === "s") && gameStates.currentPlayerStyle < 5 && gameStates.currentGameState === GameState.Started && gameStates.currentShopMode === ShopMode.Player && gameStates.currentGameMode === GameMode.Shop)
        gameStates.currentPlayerStyle = gameStates.currentPlayerStyle + 1

    // Up "Shop Player"
    if ((event.keyCode === 38 || event.key === "w") && gameStates.currentPlayerStyle != 1 && gameStates.currentGameState === GameState.Started && gameStates.currentShopMode === ShopMode.Player && gameStates.currentGameMode === GameMode.Shop)
        gameStates.currentPlayerStyle = gameStates.currentPlayerStyle - 1
    
    if ((event.key === " " || event.key === "Enter") && gameStates.currentGameState === GameState.Started && gameStates.currentGameMode === GameMode.Shop && gameStates.currentShopMode === ShopMode.Player) {
        
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
    if ((event.keyCode === 40 || event.key === "s") && gameStates.currentLevelIndex < gameStates.levelController.levels.length - 1 && gameStates.currentGameState === GameState.Rules && gameStates.currentGameMode === GameMode.Freeplay)
        gameStates.currentLevelIndex = gameStates.currentLevelIndex + 1

    // Up "Freeplay"
    if ((event.keyCode === 38 || event.key === "w") && gameStates.currentLevelIndex != 0 && gameStates.currentGameState === GameState.Rules && gameStates.currentGameMode === GameMode.Freeplay)
        gameStates.currentLevelIndex = gameStates.currentLevelIndex - 1

///
    if (gameStates.currentGameMode === GameMode.ItemsInfo) {
        gameStates.infoController.Keydown(event)
    }
///
    
    if (event.key === "Backspace" && (gameStates.currentGameState <= 2 && gameStates.currentGameState > 0 || gameStates.currentGameState === 3 && gameStates.currentGameMode != GameMode.StoryMode)) {           
        
        if (gameStates.currentGameMode === GameMode.Freeplay) {
            levelTools.Restart()
            gameStates.currentLevelIndex = gameStates.infoController.unlockedLevel
            levelTools.Restart()   
        }
        
        else if (gameStates.currentShopMode > 1) {
            gameStates.currentShopMode = ShopMode.ShopMenu   
        }      
        gameStates.SetGameState(gameStates.currentGameState - 1)
        return
    }

    // Rules to Game
    if ((event.key === " " || event.key === "Enter") && gameStates.currentGameState === GameState.Rules && gameStates.currentGameMode < 3) {
        gameStates.SetGameState(GameState.Started)
        return
    }
    // Game to Pause Menu
    if ((event.key === " " || event.key === "Enter") && gameStates.currentGameState === GameState.Started && gameStates.currentGameMode === GameMode.StoryMode) {
        gameStates.SetGameState(GameState.Paused)
        return
    }

    if (gameStates.currentGameState === GameState.Lost && gameStates.currentGameMode === GameMode.Freeplay) {
        levelTools.Restart()
        gameStates.currentGameState = GameState.Rules
    }

    if (gameStates.currentGameMode === GameMode.StoryMode) {
        // Down "Pause Menu"
        if ((event.keyCode === 40 || event.key === "s") && gameStates.currentGameState === GameState.Paused)
            gameStates.menuController.PauseMenu.moveDown()


        // Up "Pause Menu"
        if ((event.keyCode === 38 || event.key === "w") && gameStates.currentGameState === GameState.Paused)
            gameStates.menuController.PauseMenu.moveUp()

        if ((event.key === " " || event.key === "Enter") && gameStates.currentGameState === GameState.Paused) {
            gameStates.menuController.PauseMenu.selected()
            return
        }

        // Down "Win"
        if ((event.keyCode === 40 || event.key === "s") && gameStates.currentGameState === GameState.WonStage)
            gameStates.menuController.WinMenu.moveDown()


        // Up "Win"
        if ((event.keyCode === 38 || event.key === "w") && gameStates.currentGameState === GameState.WonStage)
            gameStates.menuController.WinMenu.moveUp()

        if ((event.key === " " || event.key === "Enter") && gameStates.currentGameState === GameState.WonStage) {
            gameStates.menuController.WinMenu.selected()
            return
        }

        // Down "Lost"
        if ((event.keyCode === 40 || event.key === "s") && gameStates.currentGameState === GameState.Lost)
            gameStates.menuController.LoseMenu.moveDown()

        // Up "Lost"
        if ((event.keyCode === 38 || event.key === "w") && gameStates.currentGameState === GameState.Lost)
            gameStates.menuController.LoseMenu.moveUp()

        if ((event.key === " " || event.key === "Enter") && gameStates.currentGameState === GameState.Lost && gameStates.currentGameMode === GameMode.StoryMode) {
            gameStates.menuController.LoseMenu.selected()
            return
        }
        
    
    }
///
    if (gameStates.currentGameState !== GameState.Started || gameStates.currentGameMode === GameMode.Shop) {
        return
    }

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

