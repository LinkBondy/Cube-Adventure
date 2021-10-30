"use strict";

function Keydown(event){
    //console.log(event)
    
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
        
        if (game.backroundShop === BackroundShop.Plastic) {
            game.spriteStyle = false
            game.plasticStyle = true
        }

        if (game.backroundShop === BackroundShop.Sprite) {
            game.plasticStyle = false
            game.spriteStyle = true
        }
        
        return
    }

    // Down "Shop Player"   
    if (event.keyCode === 40 && game.playerShop < 5 && game.gameState === GameState.Started && game.shopMode === ShopMode.Player && game.gameMode === GameMode.Shop || event.key === "s" && game.playerShop < 5 && game.gameState === GameState.Started && game.shopMode === ShopMode.Player && game.gameMode === GameMode.Shop)
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

        else if (game.playerShop === PlayerShop.BlueCubeSad && game.blueCubeSadLock === false) {
            Player.CubeStyle = CubeStyle.Sad 
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
    if (event.keyCode === 40 && game.ItemNumber < 8 && game.gameState === GameState.Rules && game.gameMode === GameMode.ItemsInfo || event.key==="s" && game.ItemNumber < 8 && game.gameState === GameState.Rules && game.gameMode === GameMode.ItemsInfo)
        game.ItemNumber = game.ItemNumber + 1

    // Up "Items Info"
    if (event.keyCode === 38 && game.ItemNumber != 1 && game.gameState === GameState.Rules && game.gameMode === GameMode.ItemsInfo || event.key==="w" && game.ItemNumber != 1 && game.gameState === GameState.Rules && game.gameMode === GameMode.ItemsInfo)
        game.ItemNumber = game.ItemNumber - 1

///
    
    if (event.key === "Backspace" && game.gameState <= 2 && game.gameState > 0 || event.key === "Backspace" && game.gameState === 3 && game.gameMode != GameMode.StoryMode) {           
        
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
    if (event.key === " " && game.gameState === GameState.Rules && game.gameMode < 3 || event.key === "Enter" && game.gameState === GameState.Rules && game.gameMode < 3) {
        game.SetGameState(GameState.Started)
        return
    }
    // Game to Pause Menu
    if (event.key === " " && game.gameState === GameState.Started && game.gameMode === GameMode.StoryMode || event.key === "Enter" && game.gameState === GameState.Started && game.gameMode === GameMode.StoryMode) {
        game.SetGameState(GameState.Paused)
        return
    }

    // Down "Pause Menu"
    if (event.keyCode === 40 && game.gameState === GameState.Paused && game.gameMode === GameMode.StoryMode || event.key==="s" && game.gameState === GameState.Paused && game.gameMode === GameMode.StoryMode)
        PauseMenu.moveDown()


    // Up "Pause Menu"
    if (event.keyCode === 38 && game.gameState === GameState.Paused && game.gameMode === GameMode.StoryMode || event.key==="w" && game.gameState === GameState.Paused && game.gameMode === GameMode.StoryMode)
        PauseMenu.moveUp()

    if (event.key === " " && game.gameState === GameState.Paused && game.gameMode === GameMode.StoryMode || event.key === "Enter" && game.gameState === GameState.Paused && game.gameMode === GameMode.StoryMode) {
        PauseMenu.selected()
        return
    }

    ///
    
    // Down "Win"
    if (event.keyCode === 40 && game.gameState === GameState.WonStage && game.gameMode === GameMode.StoryMode || event.key==="s" && game.gameState === GameState.WonStage && game.currentLevel !== 7)
        WinMenu.moveDown()


    // Up "Win"
    if (event.keyCode === 38 && game.gameState === GameState.WonStage && game.gameMode === GameMode.StoryMode || event.key==="w" && game.gameState === GameState.WonStage && game.currentLevel !== 7)
        WinMenu.moveUp()

    if (event.key === " " && game.gameState === GameState.WonStage && game.gameMode === GameMode.StoryMode || event.key === "Enter" && game.gameState === GameState.WonStage && game.currentLevel !== 7) {
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
        if (event.keyCode === 39 && player.x < 800 || event.key === "d" && player.x < 800)
        player.moveRight()
    })
    
        // "Down" Arrow / "s" Key (Down)
    levels[game.currentLevel].players.forEach(function(player) {    
        if (event.keyCode === 40 && player.y < 550 || event.key === "s" && player.y < 550)
        player.moveDown()
    })
    
        // "Up" Arrow / "w" Key (Up)
        levels[game.currentLevel].players.forEach(function(player) {    
        if (event.keyCode === 38 && player.y !== 0 || event.key === "w" && player.y !== 0)
        player.moveUp()
    })
    
        // "Left" Arrow / "a" Key (Left)
    levels[game.currentLevel].players.forEach(function(player) {
        if (event.keyCode === 37 && player.x !== 0 || event.key === "a" && player.x !== 0)
        player.moveLeft()
    })       
}

function MouseMove(event) {
     //console.log(event)
}

 function MouseDown(event) {
    //console.log(event)
    // Start Game "Menu"
    if (game.gameState === GameState.NotStarted && event.offsetY > 500 && event.offsetY < 600 && event.offsetX < 850 && game.mobile === true) {
        game.SetGameState(GameState.Menu)
        return
    }

    ///

    if (event.offsetY > 0 && event.offsetY < 100 && event.offsetX < 850 && event.offsetX > 750 && game.gameState <= 3 && game.gameState > 0 && game.mobile === true) {            
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
    if (game.gameState === GameState.Menu && event.offsetY > game.selectorY2 && event.offsetY < 600 && event.offsetX < 850 && game.mobile === true)
        MainMenu.moveDown()

    // Up "Menu"
    if (game.gameState === GameState.Menu && event.offsetY < game.selectorY && event.offsetY < 600 && event.offsetX < 850 && game.mobile === true)
        MainMenu.moveUp()
    
    if (game.gameState === GameState.Menu && event.offsetY > game.selectorY && event.offsetY < 600 && event.offsetX < 850 && event.offsetY < game.selectorY2 && game.mobile === true) {
        MainMenu.selected() 
        return
    }

    ///

     // Down "Shop"
     if (game.gameState === GameState.Rules && game.gameMode === GameMode.Shop && event.offsetY > game.selectorY2 && event.offsetX < 850 && game.mobile === true)
        ShopMenu.moveDown()


    // Up "Shop"
    if (game.gameState === GameState.Rules && game.gameMode === GameMode.Shop && event.offsetY < game.selectorY && event.offsetX < 850 && game.mobile === true)
        ShopMenu.moveUp()

    if (game.gameState === GameState.Rules && game.gameMode === GameMode.Shop && event.offsetY > game.selectorY && event.offsetY < game.selectorY2 && event.offsetX < 850 && game.mobile === true) {
        ShopMenu.selected()
        return
    }

    ///

    // Down "Shop Backround"   
    if (game.backroundShop < 2 && game.gameState === GameState.Started && game.shopMode === ShopMode.Backround && game.gameMode === GameMode.Shop && event.offsetX < 850 && event.offsetX > 690 && event.offsetY > 450 && event.offsetY < 600  && game.mobile === true)
        game.backroundShop = game.backroundShop + 1

    // Up "Shop Backround"
    if (game.backroundShop != 1 && game.gameState === GameState.Started && game.shopMode === ShopMode.Backround && game.gameMode === GameMode.Shop && event.offsetX < 160 && event.offsetX > 0 && event.offsetY > 450 && event.offsetY < 600  && game.mobile === true)
        game.backroundShop = game.backroundShop - 1
    
    if (game.gameState === GameState.Started && game.gameMode === GameMode.Shop && game.shopMode === ShopMode.Backround && event.offsetY > 425 && event.offsetY < 600 && event.offsetX < 610 && event.offsetX > 225 && game.mobile === true) {
        
        if (game.backroundShop === BackroundShop.Plastic) {
            game.spriteStyle = false
            game.plasticStyle = true
        }

        if (game.backroundShop === BackroundShop.Sprite) {
            game.plasticStyle = false
            game.spriteStyle = true
        }
        
        return
    }

    // Down "Shop Player"   
    if ( game.playerShop < 5 && game.gameState === GameState.Started && game.shopMode === ShopMode.Player && game.gameMode === GameMode.Shop && event.offsetX < 850 && event.offsetX > 690 && event.offsetY > 450 && event.offsetY < 600  && game.mobile === true)
        game.playerShop = game.playerShop + 1

    // Up "Shop Player"
    if (game.playerShop != 1 && game.gameState === GameState.Started && game.shopMode === ShopMode.Player && game.gameMode === GameMode.Shop && event.offsetX < 160 && event.offsetX > 0 && event.offsetY > 450 && event.offsetY < 600  && game.mobile === true)
        game.playerShop = game.playerShop - 1
    
    if (game.gameState === GameState.Started && game.gameMode === GameMode.Shop && game.shopMode === ShopMode.Player && event.offsetY > 425 && event.offsetY < 600 && event.offsetX < 610 && event.offsetX > 225 && game.mobile === true) {
        
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
        
        else if (game.playerShop === PlayerShop.BlueCubeSad && game.blueCubeSadLock === false) {
            Player.CubeStyle = CubeStyle.Sad 
        } 
        
        return
    }

///


    // Down "Freeplay"   
    if (game.currentLevel < 6 && game.gameState === GameState.Rules && game.gameMode === GameMode.Freeplay && event.offsetX < 850 && event.offsetX > 690 && event.offsetY > 450 && event.offsetY < 600  && game.mobile === true)
        game.currentLevel = game.currentLevel + 1

    // Up "Freeplay"
    if (game.currentLevel != 0 && game.gameState === GameState.Rules && game.gameMode === GameMode.Freeplay && event.offsetX < 160 && event.offsetX > 0 && event.offsetY > 450 && event.offsetY < 600  && game.mobile === true)
        game.currentLevel = game.currentLevel - 1

///


    // Down "Items Info"   
    if (game.ItemNumber < 8 && game.gameState === GameState.Rules && game.gameMode === GameMode.ItemsInfo && event.offsetY > 300 && event.offsetY < 600 && event.offsetX < 850 && game.mobile === true)
        game.ItemNumber = game.ItemNumber + 1

    // Up "Items Info"
    if (game.ItemNumber != 1 && game.gameState === GameState.Rules && game.gameMode === GameMode.ItemsInfo && event.offsetY > 0 && event.offsetY < 300 && event.offsetX < 850 && game.mobile === true)
        game.ItemNumber = game.ItemNumber - 1

/// 

    // Rules to Game "Story Mode"
    if (game.gameState === GameState.Rules && game.gameMode === GameMode.StoryMode && event.offsetY > 500 && event.offsetY < 600 && event.offsetX < 850 && game.mobile === true) {
        game.SetGameState(GameState.Started)
        return
    }

    // Rules to Game "Freeplay"
    if (game.gameState === GameState.Rules && game.gameMode === GameMode.Freeplay && event.offsetY > 500 && event.offsetY < 600 && event.offsetX < 610 && event.offsetX > 225 && game.mobile === true) {
        game.SetGameState(GameState.Started)
        return
    }

    // Down "Pause Menu"
    if (game.gameState === GameState.Paused && game.gameMode === GameMode.StoryMode && event.offsetY > game.selectorY2 && event.offsetY < 600 && event.offsetX < 850 && game.mobile === true)
        PauseMenu.moveDown()


    // Up "Pause Menu"
    if (game.gameState === GameState.Paused && game.gameMode === GameMode.StoryMode && event.offsetY < game.selectorY && event.offsetY < 600 && event.offsetX < 850 && game.mobile === true)
        PauseMenu.moveUp()

    if (game.gameState === GameState.Paused && game.gameMode === GameMode.StoryMode && event.offsetY > game.selectorY && event.offsetY < game.selectorY2 && event.offsetX < 850 && game.mobile === true) {
        PauseMenu.selected()
        return
    }
    
    // Down "Win"
    if (game.gameState === GameState.WonStage && game.currentLevel !== 7 && event.offsetY > game.selectorY2 && event.offsetY < 600 && event.offsetX < 850 && game.mobile === true)
        WinMenu.moveDown()


    // Up "Win"
    if (game.gameState === GameState.WonStage && game.currentLevel !== 7 && event.offsetY < game.selectorY && event.offsetY < 600 && event.offsetX < 850 && game.mobile === true)
        WinMenu.moveUp()

    if (game.gameState === GameState.WonStage && game.currentLevel !== 7 && event.offsetY > game.selectorY && event.offsetY < 600 && event.offsetX < 850 && event.offsetY < game.selectorY2 && game.mobile === true) {
        WinMenu.selected()
        return
    }

    if (game.gameState === GameState.Lost && game.gameMode === GameMode.Freeplay) {
        game.Restart()
        game.gameState = GameState.Rules
    }

    // Down "Lost"
    if (game.gameState === GameState.Lost && game.currentLevel !== 7 && game.gameMode === GameMode.StoryMode && event.offsetY > game.selectorY2 && event.offsetY < 600 && event.offsetX < 850 && game.mobile === true)
        LoseMenu.moveDown()


    // Up "Lost"
    if (game.gameState === GameState.Lost && game.currentLevel !== 7 && game.gameMode === GameMode.StoryMode && event.offsetY < game.selectorY && event.offsetY < 600 && event.offsetX < 850 && game.mobile === true)
        LoseMenu.moveUp()

    if (game.gameState === GameState.Lost && game.currentLevel !== 7 && game.gameMode === GameMode.StoryMode && event.offsetY > game.selectorY && event.offsetY < 600 && event.offsetX < 850 && event.offsetY < game.selectorY2 && game.mobile === true) {
        LoseMenu.selected()
        return
    }

///
    
    if (game.gameState !== GameState.Started || game.gameMode === GameMode.Shop) {
        return
    }

        // "Right" Arrow /// "d" Key (Right)
    levels[game.currentLevel].players.forEach(function(player) {    
        if (event.offsetX > player.x + 50 && event.offsetY > player.y && event.offsetY < player.y + 50 && player.x < 800 && event.offsetY < 600 && event.offsetX < 850 && game.mobile === true)
        player.moveRight()
    })

   
        // "Down" Arrow / "s" Key (Down)
    levels[game.currentLevel].players.forEach(function(player) {    
        if (event.offsetY > player.y + 50 && event.offsetX > player.x && event.offsetX < player.x + 50 && player.y < 550 && event.offsetY < 600 && event.offsetX < 850 && game.mobile === true)
        player.moveDown()
    })
  
        // "Up" Arrow / "w" Key (Up)
        levels[game.currentLevel].players.forEach(function(player) {    
        if (event.offsetY < player.y && event.offsetX > player.x && event.offsetX < player.x + 50 && player.y !== 0 && event.offsetY < 600 && event.offsetX < 850 && game.mobile === true)
        player.moveUp()
    })

        // "Left" Arrow / "a" Key (Left)
    levels[game.currentLevel].players.forEach(function(player) {
        if (event.offsetX < player.x && event.offsetY > player.y && event.offsetY < player.y + 50 && player.x !== 0 && event.offsetY < 600 && event.offsetX < 850 && game.mobile === true)
        player.moveLeft()
    })
    
}

document.addEventListener('keydown', Keydown )
document.addEventListener('mousemove', MouseMove )
document.addEventListener('mousedown', MouseDown)