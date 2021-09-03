"use strict";
function Keydown(event){
    
    // Start Game "Menu"
    if (event.key == " " && game.gameState == GameState.NotStarted || event.key == "Enter" && game.gameState == GameState.NotStarted) {
        game.SetGameState(GameState.Menu)
        return
    }

///

    // Down "Menu"
    if (event.keyCode==40 && game.selector.y < 400 && game.gameState == GameState.Menu || event.key=="s" && game.selector.y < 400 && game.gameState == GameState.Menu)
        game.selector.moveDown()

    // Up "Menu"
    if (event.keyCode==38 && game.selector.y > 0 && game.gameState == GameState.Menu || event.key=="w" &&  game.selector.y > 0 && game.gameState == GameState.Menu)
        game.selector.moveUp()
    
    if (event.key == " " && game.gameState == GameState.Menu || event.key == "Enter"  && game.gameState == GameState.Menu) {
        game.selector.updateMenu()
        return
    }

///

    // Down "Shop"
    if (event.keyCode == 40 && game.selector.y < 300 && game.gameState == GameState.Rules && game.gameMode == GameMode.Shop || event.key=="s" && game.selector.y < 300 && game.gameState == GameState.Rules && game.gameMode == GameMode.Shop)
        game.selector.moveDown()


    // Up "Shop"
    if (event.keyCode == 38 && game.selector.y > 0 && game.gameState == GameState.Rules && game.gameMode == GameMode.Shop || event.key=="w" &&  game.selector.y > 0 && game.gameState == GameState.Rules && game.gameMode == GameMode.Shop)
        game.selector.moveUp()
///

    if (event.key == " " && game.gameState == GameState.Rules && game.gameMode == GameMode.Shop || event.key == "Enter" && game.gameState == GameState.Rules && game.gameMode == GameMode.Shop) {
        game.selector.updateShop()
        return
    }

///

    // Down "Shop Backround"   
    if (event.keyCode == 40 && game.backroundShop < 2 && game.gameState == GameState.Started && game.shopMode == ShopMode.Backround && game.gameMode == GameMode.Shop || event.key == "s" && game.backroundShop < 2 && game.gameState == GameState.Started && game.shopMode == ShopMode.Backround && game.gameMode == GameMode.Shop)
        game.backroundShop = game.backroundShop + 1

    // Up "Shop Backround"
    if (event.keyCode == 38 && game.backroundShop != 1 && game.gameState == GameState.Started && game.shopMode == ShopMode.Backround && game.gameMode == GameMode.Shop || event.key == "w" && game.backroundShop != 1 && game.gameState == GameState.Started && game.shopMode == ShopMode.Backround && game.gameMode == GameMode.Shop)
        game.backroundShop = game.backroundShop - 1
    
    if (event.key == " " && game.gameState == GameState.Started && game.gameMode == GameMode.Shop && game.shopMode == ShopMode.Backround || event.key == "Enter" && game.gameState == GameState.Started && game.gameMode == GameMode.Shop && game.shopMode == ShopMode.Backround) {
        
        if (game.backroundShop == BackroundShop.Classic) {
            game.spriteStyle = false
            game.classicStyle = true
        }

        if (game.backroundShop == BackroundShop.Sprite) {
            game.classicStyle = false
            game.spriteStyle = true
        }
        
        return
    }

    // Down "Shop Player"   
    if (event.keyCode == 40 && game.playerShop < 3 && game.gameState == GameState.Started && game.shopMode == ShopMode.Player && game.gameMode == GameMode.Shop || event.key == "s" && game.playerShop < 3 && game.gameState == GameState.Started && game.shopMode == ShopMode.Player && game.gameMode == GameMode.Shop)
        game.playerShop = game.playerShop + 1

    // Up "Shop Player"
    if (event.keyCode == 38 && game.playerShop != 1 && game.gameState == GameState.Started && game.shopMode == ShopMode.Player && game.gameMode == GameMode.Shop || event.key == "w" && game.playerShop != 1 && game.gameState == GameState.Started && game.shopMode == ShopMode.Player && game.gameMode == GameMode.Shop)
        game.playerShop = game.playerShop - 1
    
    if (event.key == " " && game.gameState == GameState.Started && game.gameMode == GameMode.Shop && game.shopMode == ShopMode.Player || event.key == "Enter" && game.gameState == GameState.Started && game.gameMode == GameMode.Shop && game.shopMode == ShopMode.Player) {
        
        if (game.playerShop == PlayerShop.BlueCube) {
            levels[game.currentLevel].players.forEach(function(player) {
                Player.CubeStyle = CubeStyle.BlueCube
            }) 
        }
        
        else if (game.playerShop == PlayerShop.BlueCubeAlien) {
            levels[game.currentLevel].players.forEach(function(player) {
                Player.CubeStyle = CubeStyle.Alien
            })    
        }
        
        else if (game.playerShop == PlayerShop.BlueCubeLava) {
            levels[game.currentLevel].players.forEach(function(player) {
                Player.CubeStyle = CubeStyle.Lava
            }) 
        }  
        
        return
    }

///

    // Down "Freeplay"   
    if (event.keyCode == 40 && game.currentLevel < 6 && game.gameState == GameState.Rules && game.gameMode == GameMode.Freeplay || event.key=="s" && game.currentLevel < 6 && game.gameState == GameState.Rules && game.gameMode == GameMode.Freeplay)
        game.currentLevel = game.currentLevel + 1

    // Up "Freeplay"
    if (event.keyCode == 38 && game.currentLevel != 0 && game.gameState == GameState.Rules && game.gameMode == GameMode.Freeplay || event.key=="w" && game.currentLevel != 0 && game.gameState == GameState.Rules && game.gameMode == GameMode.Freeplay)
        game.currentLevel = game.currentLevel - 1
    
    if (event.key == "Backspace" && game.gameState <= 2 && game.gameState > 0 || event.key == "Backspace" && game.gameState == 3 && game.gameMode != GameMode.StoryMode) {    
        if (game.gameMode == GameMode.Freeplay && game.gameState == GameState.Started) {
            game.SetGameState(game.gameState - 1)
        
        } else {
            game.currentLevel = 0
            game.SetGameState(game.gameState - 1)
            game.selector.y = 0

            if (game.shopMode > 1) {
                game.shopMode = ShopMode.ShopMenu   
            }
        }
        
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
    if (event.key == " " && game.gameState == GameState.Rules || event.key == "Enter" && game.gameState == GameState.Rules) {
        game.SetGameState(GameState.Started)
        return
    }
    
    // Next Level
    if (event.key == " " && game.gameState == GameState.WonStage || event.key == "Enter" && game.gameState == GameState.WonStage) {
        game.NextLevel()
    }
    
    // Restart Game
    if (event.key == " " && game.gameState == GameState.Lost || event.key == "Enter" && game.gameState == GameState.Lost)
        game.Restart()
    
    if (game.gameState != GameState.Started || game.gameMode == GameMode.Shop){
        return
    }

    //console.log('key pressed/')
        // "Right" Arrow /// "d" Key (Right)
    levels[game.currentLevel].players.forEach(function(player) {    
        if (event.keyCode==39 && player.x<800 || event.key == "d" && player.x<800)
        player.moveRight()
    })
    
        // "Down" Arrow / "s" Key (Down)
    levels[game.currentLevel].players.forEach(function(player) {    
        if (event.keyCode==40 && player.y<550 || event.key == "s" && player.y<550)
        player.moveDown()
    })
    
        // "Up" Arrow / "w" Key (Up)
        levels[game.currentLevel].players.forEach(function(player) {    
        if (event.keyCode==38 && player.y != 0 || event.key == "w" && player.y !=0)
        player.moveUp()
    })
    
        // "Left" Arrow / "a" Key (Left)
    levels[game.currentLevel].players.forEach(function(player) {
        if (event.keyCode==37 && player.x != 0 || event.key == "a" && player.x != 0)
        player.moveLeft()
    })
        
}

document.addEventListener('keydown', Keydown )