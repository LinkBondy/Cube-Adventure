"use strict";
var exitNumber = 0

const { levels } = require('./Levels')

const {
    Player,
    CubeStyle
} = require('./Class')

const {
    MainMenu, ShopMenu, LoseMenu, WinMenu, PauseMenu
} = require('./Menu')
const { images } = require('./Images')

const {
    GameState,
    GameMode,
    ShopMode,
    PlayerShop,
    BackgroundShop
} = require ('./GameData')

export function MouseDown(event) {
    const { game } = require('./Cube Adventure')

    // Start Game "Menu"
    if (game.gameState === GameState.NotStarted && event.offsetY > 500 && event.offsetY < 600 && event.offsetX < 850) {
        game.SetGameState(GameState.Menu)
        return
    }
    ///
        function CheckExit() {
                console.log(exitNumber + "before") 
            levels[game.currentLevel].players.forEach(function(player) { 
                if (event.offsetX < player.x + 50 && event.offsetX > player.x && event.offsetY < player.y + 50 && event.offsetY > player.y) {
                    exitNumber = exitNumber + 1
                
                }
            })
            console.log(exitNumber + "after") 
            if (exitNumber === 2) {
                exitNumber = 0
                return true
            } else {
                return false
            }
        }
        ///  
        if (event.offsetY > 0 && event.offsetY < 100 && event.offsetX < 850 && event.offsetX > 750 && game.gameState <= 2 && game.gameState > 0 && game.mobile || CheckExit() && game.gameMode < 3) {
            if (game.gameMode === GameMode.StoryMode && game.gameState === GameState.Started) {
                game.SetGameState(GameState.Paused)
                return 
            }

            else if (game.gameState <= 3 && game.gameState > 0) {
                game.SetGameState(game.gameState - 1)
            }

            if (game.gameMode === GameMode.Freeplay) {
                game.Restart()
                game.currentLevel = game.oldLevel
                game.Restart()   
            }
        
            else if (game.shopMode > 1) {
                game.shopMode = ShopMode.ShopMenu   
            }
            return
        }
    ///
    // Down "Menu"
    if (game.gameState === GameState.Menu && event.offsetY > game.selectorY2 && event.offsetY < 600 && event.offsetX < 850)
        MainMenu.moveDown()

    // Up "Menu"
    if (game.gameState === GameState.Menu && event.offsetY < game.selectorY && event.offsetY < 600 && event.offsetX < 850)
        MainMenu.moveUp()
    
    if (game.gameState === GameState.Menu && event.offsetY > game.selectorY && event.offsetY < 600 && event.offsetX < 850 && event.offsetY < game.selectorY2) {
        MainMenu.selected() 
        return
    }

    ///

        // Down "Shop"
        if (game.gameState === GameState.Rules && game.gameMode === GameMode.Shop && event.offsetY > game.selectorY2 && event.offsetX < 850)
        ShopMenu.moveDown()

    // Up "Shop"
    if (game.gameState === GameState.Rules && game.gameMode === GameMode.Shop && event.offsetY < game.selectorY && event.offsetX < 850)
        ShopMenu.moveUp()

    if (game.gameState === GameState.Rules && game.gameMode === GameMode.Shop && event.offsetY > game.selectorY && event.offsetY < game.selectorY2 && event.offsetX < 850) {
        ShopMenu.selected()
        return
    }

    ///

    // Down "Shop Backround"   
    if (game.backgroundShop < 2 && game.gameState === GameState.Started && game.shopMode === ShopMode.Backround && game.gameMode === GameMode.Shop && event.offsetX < 850 && event.offsetX > 690 && event.offsetY > 450 && event.offsetY < 600)
        game.backgroundShop = game.backgroundShop + 1

    // Up "Shop Backround"
    if (game.backgroundShop != 1 && game.gameState === GameState.Started && game.shopMode === ShopMode.Backround && game.gameMode === GameMode.Shop && event.offsetX < 160 && event.offsetX > 0 && event.offsetY > 450 && event.offsetY < 600)
        game.backgroundShop = game.backgroundShop - 1
    
    if (game.gameState === GameState.Started && game.gameMode === GameMode.Shop && game.shopMode === ShopMode.Backround && event.offsetY > 425 && event.offsetY < 600 && event.offsetX < 610 && event.offsetX > 225) {
        
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
    if ( game.playerShop < 5 && game.gameState === GameState.Started && game.shopMode === ShopMode.Player && game.gameMode === GameMode.Shop && event.offsetX < 850 && event.offsetX > 690 && event.offsetY > 450 && event.offsetY < 600)
        game.playerShop = game.playerShop + 1

    // Up "Shop Player"
    if (game.playerShop != 1 && game.gameState === GameState.Started && game.shopMode === ShopMode.Player && game.gameMode === GameMode.Shop && event.offsetX < 160 && event.offsetX > 0 && event.offsetY > 450 && event.offsetY < 600)
        game.playerShop = game.playerShop - 1
    
    if (game.gameState === GameState.Started && game.gameMode === GameMode.Shop && game.shopMode === ShopMode.Player && event.offsetY > 425 && event.offsetY < 600 && event.offsetX < 610 && event.offsetX > 225) {
        
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
    if (game.currentLevel < 7 && game.gameState === GameState.Rules && game.gameMode === GameMode.Freeplay && event.offsetX < 850 && event.offsetX > 690 && event.offsetY > 450 && event.offsetY < 600 && game.mobile === true)
        game.currentLevel = game.currentLevel + 1

    // Up "Freeplay"
    if (game.currentLevel != 0 && game.gameState === GameState.Rules && game.gameMode === GameMode.Freeplay && event.offsetX < 160 && event.offsetX > 0 && event.offsetY > 450 && event.offsetY < 600 && game.mobile === true)
        game.currentLevel = game.currentLevel - 1

    if (game.gameMode === GameMode.ItemsInfo) {
        game.infoController.Mousedown(event)
    }

    // Rules to Game "Story Mode"
    if (game.gameState === GameState.Rules && game.gameMode === GameMode.StoryMode && event.offsetY > 500 && event.offsetY < 600 && event.offsetX < 850) {
        game.SetGameState(GameState.Started)
        return
    }

    // Rules to Game "Freeplay"
    if (game.gameState === GameState.Rules && game.gameMode === GameMode.Freeplay && event.offsetY > 500 && event.offsetY < 600 && event.offsetX < 610 && event.offsetX > 225) {
        game.SetGameState(GameState.Started)
        return
    }

    // Down "Pause Menu"
    if (game.gameState === GameState.Paused && game.gameMode === GameMode.StoryMode && event.offsetY > game.selectorY2 && event.offsetY < 600 && event.offsetX < 850)
        PauseMenu.moveDown()


    // Up "Pause Menu"
    if (game.gameState === GameState.Paused && game.gameMode === GameMode.StoryMode && event.offsetY < game.selectorY && event.offsetY < 600 && event.offsetX < 850)
        PauseMenu.moveUp()

    if (game.gameState === GameState.Paused && game.gameMode === GameMode.StoryMode && event.offsetY > game.selectorY && event.offsetY < game.selectorY2 && event.offsetX < 850) {
        PauseMenu.selected()
        return
    }
    
    // Down "Win"
    if (game.gameState === GameState.WonStage && event.offsetY > game.selectorY2 && event.offsetY < 600 && event.offsetX < 850)
        WinMenu.moveDown()


    // Up "Win"
    if (game.gameState === GameState.WonStage && event.offsetY < game.selectorY && event.offsetY < 600 && event.offsetX < 850)
        WinMenu.moveUp()

    if (game.gameState === GameState.WonStage && event.offsetY > game.selectorY && event.offsetY < 600 && event.offsetX < 850 && event.offsetY < game.selectorY2) {
        WinMenu.selected()
        return
    }

    if (game.gameState === GameState.Lost && game.gameMode === GameMode.Freeplay) {
        game.Restart()
        game.gameState = GameState.Rules
    }

    // Down "Lost"
    if (game.gameState === GameState.Lost && game.gameMode === GameMode.StoryMode && event.offsetY > game.selectorY2 && event.offsetY < 600 && event.offsetX < 850)
        LoseMenu.moveDown()


    // Up "Lost"
    if (game.gameState === GameState.Lost && game.gameMode === GameMode.StoryMode && event.offsetY < game.selectorY && event.offsetY < 600 && event.offsetX < 850)
        LoseMenu.moveUp()

    if (game.gameState === GameState.Lost && game.gameMode === GameMode.StoryMode && event.offsetY > game.selectorY && event.offsetY < 600 && event.offsetX < 850 && event.offsetY < game.selectorY2) {
        LoseMenu.selected()
        return
    }

    ///
    
    if (game.gameState !== GameState.Started || game.gameMode === GameMode.Shop) {
        return
    }

        // "Right" Arrow /// "d" Key (Right)
    levels[game.currentLevel].players.forEach(function(player) {    
        if (event.offsetX > player.x + 50 && event.offsetY > player.y - 50 && event.offsetY < player.y + 100 && player.x < 800 && event.offsetY < 600 && event.offsetX < 850)
        player.moveRight()
        return
    })

    
        // "Down" Arrow / "s" Key (Down)
    levels[game.currentLevel].players.forEach(function(player) {    
        if (event.offsetY > player.y + 50 && event.offsetX > player.x - 50 && event.offsetX < player.x + 100 && player.y < 550 && event.offsetY < 600 && event.offsetX < 850)
        player.moveDown()
        return
    })
    
        // "Up" Arrow / "w" Key (Up)
        levels[game.currentLevel].players.forEach(function(player) {    
        if (event.offsetY < player.y && event.offsetX > player.x - 50 && event.offsetX < player.x + 100 && player.y !== 0 && event.offsetY < 600 && event.offsetX < 850)
        player.moveUp()
        return
    })

        // "Left" Arrow / "a" Key (Left)
    levels[game.currentLevel].players.forEach(function(player) {
        if (event.offsetX < player.x && event.offsetY > player.y - 50 && event.offsetY < player.y + 100 && player.x !== 0 && event.offsetY < 600 && event.offsetX < 850)
        player.moveLeft()
        return
    })
   
}
