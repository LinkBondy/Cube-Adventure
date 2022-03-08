"use strict";

const {
    MainMenu, ShopMenu, LoseMenu, WinMenu, PauseMenu
} = require('./Menu')

const {
    GameState,
    GameMode,
    ShopMode,
    PlayerShop,
    BackgroundShop
} = require ('./GameData')

const { levels } = require('./Levels')
const { images } = require('./Images')

const {
    Player,
    CubeStyle
} = require('./Class')

export function Keydown(event) {
    const { game } = require('./Cube Adventure')

    //console.log(event)
    
    // Start Game "Menu"
    if ((event.key === " " || event.key === "Enter") && game.gameState === GameState.NotStarted) {
        game.SetGameState(GameState.Menu)
        return
    }

///
    // Down "Menu"
    if ((event.keyCode === 40 || event.key === "s") && game.gameState === GameState.Menu)
        MainMenu.moveDown()

    // Up "Menu"
    if ((event.keyCode === 38 || event.key === "w") && game.gameState === GameState.Menu)
        MainMenu.moveUp()
    
    if ((event.key === " " || event.key === "Enter") && game.gameState === GameState.Menu) {
        MainMenu.selected() 
        return
    }
///
    // Down "Shop"
    if ((event.keyCode === 40 || event.key === "s") && game.gameState === GameState.Rules && game.gameMode === GameMode.Shop)
        ShopMenu.moveDown()


    // Up "Shop"
    if ((event.keyCode === 38 || event.key === "w") && game.gameState === GameState.Rules && game.gameMode === GameMode.Shop)
        ShopMenu.moveUp()
///

    if ((event.key === " " || event.key === "Enter") && game.gameState === GameState.Rules && game.gameMode === GameMode.Shop) {
        ShopMenu.selected()
        return
    }
///
    // Down "Shop Backround"   
    if ((event.keyCode === 40 || event.key === "s") && game.backgroundShop < 2 && game.gameState === GameState.Started && game.shopMode === ShopMode.Backround && game.gameMode === GameMode.Shop)
        game.backgroundShop = game.backgroundShop + 1

    // Up "Shop Backround"
    if ((event.keyCode === 38 || event.key === "w") && game.backgroundShop != 1 && game.gameState === GameState.Started && game.shopMode === ShopMode.Backround && game.gameMode === GameMode.Shop)
        game.backgroundShop = game.backgroundShop - 1
    
    if ((event.key === " " || event.key === "Enter") && game.gameState === GameState.Started && game.gameMode === GameMode.Shop && game.shopMode === ShopMode.Backround) {
        
        if (game.backgroundShop === BackgroundShop.Plastic) {
            game.spriteStyle = false
            game.plasticStyle = true
        }

        if (game.backgroundShop === BackgroundShop.Sprite) {
            game.plasticStyle = false
            game.spriteStyle = true
        }
        
        return
    }
    // Down "Shop Player"   
    if ((event.keyCode === 40 || event.key === "s") && game.playerShop < 5 && game.gameState === GameState.Started && game.shopMode === ShopMode.Player && game.gameMode === GameMode.Shop)
        game.playerShop = game.playerShop + 1

    // Up "Shop Player"
    if ((event.keyCode === 38 || event.key === "w") && game.playerShop != 1 && game.gameState === GameState.Started && game.shopMode === ShopMode.Player && game.gameMode === GameMode.Shop)
        game.playerShop = game.playerShop - 1
    
    if ((event.key === " " || event.key === "Enter") && game.gameState === GameState.Started && game.gameMode === GameMode.Shop && game.shopMode === ShopMode.Player) {
        
        if (game.playerShop === PlayerShop.BlueCube) {
            Player.CubeStyle = CubeStyle.BlueCube
        }
        
        else if (game.playerShop === PlayerShop.BlueCubeAlien && images.blueCubeAlienLock === false) {
            Player.CubeStyle = CubeStyle.Alien   
        }
        
        else if (game.playerShop === PlayerShop.BlueCubeLava) {
            Player.CubeStyle = CubeStyle.Lava
        }
        
        else if (game.playerShop === PlayerShop.BlueCubeWooden && images.blueCubeWoodenLock === false) {
            Player.CubeStyle = CubeStyle.Wooden 
        } 

        else if (game.playerShop === PlayerShop.BlueCubeSad && images.blueCubeSadLock === false) {
            Player.CubeStyle = CubeStyle.Sad 
        } 
        
        return
    }
///
    // Down "Freeplay"   
    if ((event.keyCode === 40 || event.key === "s") && game.currentLevel < levels.length - 1 && game.gameState === GameState.Rules && game.gameMode === GameMode.Freeplay)
        game.currentLevel = game.currentLevel + 1

    // Up "Freeplay"
    if ((event.keyCode === 38 || event.key === "w") && game.currentLevel != 0 && game.gameState === GameState.Rules && game.gameMode === GameMode.Freeplay)
        game.currentLevel = game.currentLevel - 1

///
    if (game.gameMode === GameMode.ItemsInfo) {
        game.infoController.Keydown(event)
    }
///
    
    if (event.key === "Backspace" && (game.gameState <= 2 && game.gameState > 0 || game.gameState === 3 && game.gameMode != GameMode.StoryMode)) {           
        
        if (game.gameMode === GameMode.Freeplay) {
            game.Restart()
            game.currentLevel = game.oldLevel
            game.Restart()   
        }
        
        else if (game.shopMode > 1) {
            game.shopMode = ShopMode.ShopMenu   
        }      
        game.SetGameState(game.gameState - 1)
        return
    }

    // Rules to Game
    if ((event.key === " " || event.key === "Enter") && game.gameState === GameState.Rules && game.gameMode < 3) {
        game.SetGameState(GameState.Started)
        return
    }
    // Game to Pause Menu
    if ((event.key === " " || event.key === "Enter") && game.gameState === GameState.Started && game.gameMode === GameMode.StoryMode) {
        game.SetGameState(GameState.Paused)
        return
    }

    if (game.gameState === GameState.Lost && game.gameMode === GameMode.Freeplay) {
        game.Restart()
        game.gameState = GameState.Rules
    }

    if (game.gameMode === GameMode.StoryMode) {
        // Down "Pause Menu"
        if ((event.keyCode === 40 || event.key === "s") && game.gameState === GameState.Paused)
            PauseMenu.moveDown()


        // Up "Pause Menu"
        if ((event.keyCode === 38 || event.key === "w") && game.gameState === GameState.Paused)
            PauseMenu.moveUp()

        if ((event.key === " " || event.key === "Enter") && game.gameState === GameState.Paused) {
            PauseMenu.selected()
            return
        }

        if (!game.winStop) {    
            // Down "Win"
            if ((event.keyCode === 40 || event.key === "s") && game.gameState === GameState.WonStage)
                WinMenu.moveDown()


            // Up "Win"
            if ((event.keyCode === 38 || event.key === "w") && game.gameState === GameState.WonStage)
                WinMenu.moveUp()

            if ((event.key === " " || event.key === "Enter") && game.gameState === GameState.WonStage) {
                WinMenu.selected()
                return
            }
        }
        // Down "Lost"
        if ((event.keyCode === 40 || event.key === "s") && game.gameState === GameState.Lost)
            LoseMenu.moveDown()

        // Up "Lost"
        if ((event.keyCode === 38 || event.key === "w") && game.gameState === GameState.Lost)
            LoseMenu.moveUp()

        if ((event.key === " " || event.key === "Enter") && game.gameState === GameState.Lost && game.gameMode === GameMode.StoryMode) {
            LoseMenu.selected()
            return
        }
        
    
    }
///
    if (game.gameState !== GameState.Started || game.gameMode === GameMode.Shop) {
        return
    }

    //console.log('key pressed/')
        // "Right" Arrow || "d" Key
    levels[game.currentLevel].players.forEach(function(player) {    
        if ((event.keyCode === 39 || event.key === "d") && player.x < 800)
        player.moveRight()
        return
    })
    
        // "Down" Arrow || "s" Key
    levels[game.currentLevel].players.forEach(function(player) {    
        if ((event.keyCode === 40 || event.key === "s") && player.y < 550)
        player.moveDown()
        return
    })
    
        // "Up" Arrow || "w" Key
        levels[game.currentLevel].players.forEach(function(player) {    
        if ((event.keyCode === 38 || event.key === "w") && player.y !== 0)
        player.moveUp()
        return
    })
    
        // "Left" Arrow || "a" Key
    levels[game.currentLevel].players.forEach(function(player) {
        if ((event.keyCode === 37 || event.key === "a") && player.x !== 0)
        player.moveLeft()
        return
    })       
}

