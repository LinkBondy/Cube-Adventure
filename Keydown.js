"use strict";

function Keydown(event){
    
    // Start Game "Menu"
    if (event.key === " " && game.gameState === GameState.NotStarted || event.key === "Enter" && game.gameState === GameState.NotStarted) {
        game.SetGameState(GameState.Menu)
        return
    }

///
    // Down "Menu"
    if (event.keyCode===40 && game.gameState === GameState.Menu || event.key==="s" && game.gameState === GameState.Menu)
        MainMenu.moveDown()

    // Up "Menu"
    if (event.keyCode===38 && game.gameState === GameState.Menu || event.key==="w" && game.gameState === GameState.Menu)
        MainMenu.moveUp()
    
    if (event.key === " " && game.gameState === GameState.Menu || event.key === "Enter" && game.gameState === GameState.Menu) {
        MainMenu.selected() 
        return
    }
///
    // Down "Shop"
    if (event.keyCode === 40 && game.gameState === GameState.Rules && game.gameMode === GameMode.Shop || event.key==="s" && game.gameState === GameState.Rules && game.gameMode === GameMode.Shop)
        ShopMenu.moveDown()


    // Up "Shop"
    if (event.keyCode === 38 && game.gameState === GameState.Rules && game.gameMode === GameMode.Shop || event.key==="w" && game.gameState === GameState.Rules && game.gameMode === GameMode.Shop)
        ShopMenu.moveUp()
///

    if (event.key === " " && game.gameState === GameState.Rules && game.gameMode === GameMode.Shop || event.key === "Enter" && game.gameState === GameState.Rules && game.gameMode === GameMode.Shop) {
        ShopMenu.selected()
        return
    }
///
    // Down "Shop Backround"   
    if (event.keyCode === 40 && game.backroundShop < 2 && game.gameState === GameState.Started && game.shopMode === ShopMode.Backround && game.gameMode === GameMode.Shop || event.key === "s" && game.backroundShop < 2 && game.gameState === GameState.Started && game.shopMode === ShopMode.Backround && game.gameMode === GameMode.Shop)
        game.backroundShop = game.backroundShop + 1

    // Up "Shop Backround"
    if (event.keyCode === 38 && game.backroundShop != 1 && game.gameState === GameState.Started && game.shopMode === ShopMode.Backround && game.gameMode === GameMode.Shop || event.key === "w" && game.backroundShop != 1 && game.gameState === GameState.Started && game.shopMode === ShopMode.Backround && game.gameMode === GameMode.Shop)
        game.backroundShop = game.backroundShop - 1
    
    if (event.key === " " && game.gameState === GameState.Started && game.gameMode === GameMode.Shop && game.shopMode === ShopMode.Backround || event.key === "Enter" && game.gameState === GameState.Started && game.gameMode === GameMode.Shop && game.shopMode === ShopMode.Backround) {
        
        if (game.backroundShop === BackroundShop.Classic) {
            game.spriteStyle = false
            game.classicStyle = true
        }

        if (game.backroundShop === BackroundShop.Sprite) {
            game.classicStyle = false
            game.spriteStyle = true
        }
        
        return
    }

    // Down "Shop Player"   
    if (event.keyCode === 40 && game.playerShop < 4 && game.gameState === GameState.Started && game.shopMode === ShopMode.Player && game.gameMode === GameMode.Shop || event.key === "s" && game.playerShop < 4 && game.gameState === GameState.Started && game.shopMode === ShopMode.Player && game.gameMode === GameMode.Shop)
        game.playerShop = game.playerShop + 1

    // Up "Shop Player"
    if (event.keyCode === 38 && game.playerShop != 1 && game.gameState === GameState.Started && game.shopMode === ShopMode.Player && game.gameMode === GameMode.Shop || event.key === "w" && game.playerShop != 1 && game.gameState === GameState.Started && game.shopMode === ShopMode.Player && game.gameMode === GameMode.Shop)
        game.playerShop = game.playerShop - 1
    
    if (event.key === " " && game.gameState === GameState.Started && game.gameMode === GameMode.Shop && game.shopMode === ShopMode.Player || event.key === "Enter" && game.gameState === GameState.Started && game.gameMode === GameMode.Shop && game.shopMode === ShopMode.Player) {
        
        if (game.playerShop === PlayerShop.BlueCube) {
                Player.CubeStyle = CubeStyle.BlueCube
        }
        
        else if (game.playerShop === PlayerShop.BlueCubeAlien) {
                Player.CubeStyle = CubeStyle.Alien   
        }
        
        else if (game.playerShop === PlayerShop.BlueCubeLava) {
                Player.CubeStyle = CubeStyle.Lava
        }
        
        else if (game.playerShop === PlayerShop.BlueCubeWooden && game.blueCubeWoodenLock === false) {
                Player.CubeStyle = CubeStyle.Wooden 
        } 
        
        return
    }

///

    // Down "Freeplay"   
    if (event.keyCode === 40 && game.currentLevel < 6 && game.gameState === GameState.Rules && game.gameMode === GameMode.Freeplay || event.key==="s" && game.currentLevel < 6 && game.gameState === GameState.Rules && game.gameMode === GameMode.Freeplay)
        game.currentLevel = game.currentLevel + 1

    // Up "Freeplay"
    if (event.keyCode === 38 && game.currentLevel != 0 && game.gameState === GameState.Rules && game.gameMode === GameMode.Freeplay || event.key==="w" && game.currentLevel != 0 && game.gameState === GameState.Rules && game.gameMode === GameMode.Freeplay)
        game.currentLevel = game.currentLevel - 1

///

    // Down "Items Info"   
    if (event.keyCode === 40 && game.ItemNumber < 5 && game.gameState === GameState.Rules && game.gameMode === GameMode.ItemsInfo || event.key==="s" && game.ItemNumber < 5 && game.gameState === GameState.Rules && game.gameMode === GameMode.ItemsInfo)
        game.ItemNumber = game.ItemNumber + 1

    // Up "Items Info"
    if (event.keyCode === 38 && game.ItemNumber != 1 && game.gameState === GameState.Rules && game.gameMode === GameMode.ItemsInfo || event.key==="w" && game.ItemNumber != 1 && game.gameState === GameState.Rules && game.gameMode === GameMode.ItemsInfo)
        game.ItemNumber = game.ItemNumber - 1

///
    
    if (event.key === "Backspace" && game.gameState <= 2 && game.gameState > 0 || event.key === "Backspace" && game.gameState === 3 && game.gameMode != GameMode.StoryMode) {           

        if (game.gameMode === GameMode.Freeplay) {
            game.currentLevel = game.oldLevel   
        }
        
        else if (game.shopMode > 1) {
            game.shopMode = ShopMode.ShopMenu   
        }

        game.SetGameState(game.gameState - 1)
        levels[game.currentLevel].boxes.forEach(function(box) {
            box.reset() 
        })
        levels[game.currentLevel].players.forEach(function(player) {
            player.reset()
        })
        levels[game.currentLevel].waters.forEach(function(water) {
            water.reset()
        })
        levels[game.currentLevel].unlocks.forEach(function(unlock) {
            unlock.unlockWall.allowMovement = false
            unlock.activated = false    
        })
        return
    }

    // Rules to Game
    if (event.key === " " && game.gameState === GameState.Rules && game.gameMode < 4 || event.key === "Enter" && game.gameState === GameState.Rules && game.gameMode < 4) {
        game.SetGameState(GameState.Started)
        return
    }
    
    // Down "Win"
    if (event.keyCode === 40 && game.gameState === GameState.WonStage && game.currentLevel !== 7 || event.key==="s" && game.gameState === GameState.WonStage && game.currentLevel !== 7)
        WinMenu.moveDown()


    // Up "Win"
    if (event.keyCode === 38 && game.gameState === GameState.WonStage && game.currentLevel !== 7 || event.key==="w" && game.gameState === GameState.WonStage && game.currentLevel !== 7)
        WinMenu.moveUp()

    if (event.key === " " && game.gameState === GameState.WonStage && game.currentLevel !== 7 || event.key === "Enter" && game.gameState === GameState.WonStage && game.currentLevel !== 7) {
        WinMenu.selected()
        return
    }

    if (game.gameState === GameState.Lost && game.gameMode === GameMode.Freeplay) {
        game.Restart()
        game.gameState = GameState.Rules
    }

    // Down "Lost"
    if (event.keyCode === 40 && game.gameState === GameState.Lost && game.currentLevel !== 7 && game.gameMode === GameMode.StoryMode || event.key=== "s" && game.gameState === GameState.Lost && game.currentLevel !== 7 && game.gameMode === GameMode.StoryMode)
        LoseMenu.moveDown()


    // Up "Lost"
    if (event.keyCode === 38 && game.gameState === GameState.Lost && game.gameMode === GameMode.StoryMode || event.key=== "w" && game.gameState === GameState.Lost && game.gameMode === GameMode.StoryMode)
        LoseMenu.moveUp()

    if (event.key === " " && game.gameState === GameState.Lost && game.gameMode === GameMode.StoryMode || event.key === "Enter" && game.gameState === GameState.Lost && game.gameMode === GameMode.StoryMode) {
        LoseMenu.selected()
        return
    }

///
    
    if (game.gameState !== GameState.Started || game.gameMode === GameMode.Shop) {
        return
    }

    //console.log('key pressed/')
        // "Right" Arrow /// "d" Key (Right)
    levels[game.currentLevel].players.forEach(function(player) {    
        if (event.keyCode === 39 && player.x<800 || event.key === "d" && player.x<800)
        player.moveRight()
    })
    
        // "Down" Arrow / "s" Key (Down)
    levels[game.currentLevel].players.forEach(function(player) {    
        if (event.keyCode === 40 && player.y<550 || event.key === "s" && player.y<550)
        player.moveDown()
    })
    
        // "Up" Arrow / "w" Key (Up)
        levels[game.currentLevel].players.forEach(function(player) {    
        if (event.keyCode === 38 && player.y != 0 || event.key === "w" && player.y !=0)
        player.moveUp()
    })
    
        // "Left" Arrow / "a" Key (Left)
    levels[game.currentLevel].players.forEach(function(player) {
        if (event.keyCode === 37 && player.x != 0 || event.key === "a" && player.x != 0)
        player.moveLeft()
    })       
}

function MouseMove(event) {
     //console.log(event)
 }
document.addEventListener('keydown', Keydown )
document.addEventListener('mousemove', MouseMove )