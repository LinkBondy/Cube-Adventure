"use strict";

var GameState = {
    NotStarted: 0,
    Menu: 1,
    Rules: 2,
    Started: 3,
    Lost: 4,
    WonStage: 5,
    Paused: 6
}

var GameMode = {
    StoryMode: 1,
    Freeplay: 2,
    Shop: 3,
    ItemsInfo: 4,
    Setting: 5
}

var ShopMode = {
    ShopMenu: 1,
    Backround: 2,
    Player: 3
}

var PlayerShop = {
    BlueCube: 1,
    BlueCubeAlien: 2,
    BlueCubeLava: 3,
    BlueCubeWooden: 4,
    BlueCubeSad: 5,
}

var BackroundShop = {
    Sprite: 1,
    Plastic: 2
}

var game = {
    canvas: undefined,
    context: undefined,
    startTime: new Date(),
    spriteStyle: true,
    plasticStyle: false,
    ///
    gameState: GameState.NotStarted,
    gameMode: GameMode.StoryMode,
    shopMode: ShopMode.ShopMenu,
    backroundShop: BackroundShop.Sprite,
    playerShop: PlayerShop.BlueCube,
    ///
    // Blue Cube
    BlueCube: new Image(),
    BlueCubeAlien: new Image(),
    BlueCubeLava: new Image(),
    BlueCubeWooden: new Image(),
    BlueCubeSad: new Image(),
    // Blue Cube Plastic 
    BlueCubePlastic: new Image(),
    BlueCubeAlienPlastic: new Image(),
    BlueCubeLavaPlastic: new Image(),
    BlueCubeWoodenPlastic: new Image(),
    BlueCubeSadPlastic: new Image(),
    // Blue Cube 200 x 200
    BlueCube_400x400: new Image(),
    BlueCubeAlien_400x400: new Image(),
    BlueCubeLava_400x400: new Image(),
    BlueCubeWooden_400x400: new Image(), 
    BlueCubeSad_400x400: new Image(),
    // Red Cube
    RedCube: new Image(),
    RedCube_200x200: new Image(),
    RedCubePlastic: new Image(),
    // Wall Grass
    WallGrassV1: new Image(),
    WallGrassV1_200x200: new Image(),
    WallGrassV1_400x400: new Image(),
    WallGrassV2: new Image(),
    WallGrassV3: new Image(),
    WallGrassTree: new Image(),
    // Teleporter
    TeleporterTomato: new Image(),
    TeleporterTomatoSprite: new Image(),
    TeleporterTomatoSprite_200x200: new Image(),
    TeleporterPurple: new Image(),
    TeleporterPurpleSprite: new Image(),
    // Switch
    SwitchW1Blue: new Image(),
    SwitchW1Blue_200x200: new Image(),
    SwitchW1Purple: new Image(),
    SwitchW1ActivatedBlue: new Image(),
    SwitchW1ActivatedBlue: new Image(),
    SwitchW1ActivatedPurple: new Image(),
    // Unlock Rock
    UnlockRockPurple: new Image(),
    UnlockedRockPurple: new Image(),
    UnlockRockBlue: new Image(),
    UnlockRockBlue_200x200: new Image(),
    UnlockedRockBlue: new Image(),
    // Invisible Wall
    InvisibleWall: new Image(),
    InvisibleWall_200x200: new Image(),
    InvisibleWall_200x200V2: new Image(),
    // Water
    Water_Medium2: new Image(),
    Water_Medium_200x200: new Image(),
    // Items
    LifeJacket: new Image(),
    LifeJacketPlastic: new Image(),
    LifeJacket_200x200: new Image(),
    // Other Images
    UpArrow: new Image(),
    UpArrowShop: new Image(),
    DownArrow: new Image(),
    DownArrowShop: new Image(),
    BackButton: new Image (),
    MenuButton: new Image (),
    ///
    Music: new Audio(),
    // Other
    blueCubeWoodenLock: true,
    blueCubeSadLock: true,
    loseCounterStop: false,
    currentLevel: 0,
    oldLevel: undefined,
    currentLosses: 0,
    unlockedLevel: 1,
    ItemNumber: 1,
    mobile: false,
    selectorX: undefined,
    selectorY: undefined,
    selectorY2: undefined,
    backround: new Backround(),

    SetGameState: function(gameState) {
        game.gameState = gameState
        /*if (game.gameState == GameState.Started)
            game.Music.play();
        else
            game.Music.pause();
    */},

    Restart: function(){
        levels[game.currentLevel].boxes.forEach(function(box) {
            box.reset() 
        })

        levels[game.currentLevel].players.forEach(function(player) {
            player.reset()
        })

        levels[game.currentLevel].unlocks.forEach(function(unlock) {
            unlock.unlockWall.allowMovement = false
            unlock.activated = false    
        })
    },

    Save: function() {
        window.localStorage.setItem('level', this.currentLevel)
        window.localStorage.setItem('PlayerWoodenLock', this.blueCubeWoodenLock)
        window.localStorage.setItem('PlayerSadLock', this.blueCubeSadLock)
        window.localStorage.setItem('UnlockedItemInfo', this.unlockedLevel)
        window.localStorage.setItem('StyleCube', Player.CubeStyle)
        window.localStorage.setItem('styleSprite', this.spriteStyle)
        window.localStorage.setItem('stylePlastic', this.plasticStyle)
    },

    Load: function() {
        //console.log('Loading, current level is: ', this.currentLevel)
        var level = Number(window.localStorage.getItem('level'))
        if (level !== null) {
            this.currentLevel = level
        }
       
        var WoodenLock = window.localStorage.getItem('PlayerWoodenLock')
        if (WoodenLock !== null) {
            if (WoodenLock === 'true') {
                WoodenLock = true
            }

            if (WoodenLock === 'false') {
                WoodenLock = false
            }
            this.blueCubeWoodenLock = WoodenLock
        }

        var SadLock = window.localStorage.getItem('PlayerSadLock')
        if (SadLock !== null) {
            if (SadLock === 'true') {
                SadLock = true
            }

            if (SadLock === 'false') {
                SadLock = false
            }
            this.blueCubeSadLock = SadLock
        }

        var UnlockedItemInfo = Number(window.localStorage.getItem('UnlockedItemInfo'))
        if (UnlockedItemInfo !== null) {
            this.unlockedLevel = UnlockedItemInfo
        }

        var styleSprite = window.localStorage.getItem('styleSprite')
        if (styleSprite !== null) {
            if (styleSprite === 'true') {
                styleSprite = true
            }

            if (styleSprite === 'false') {
                styleSprite = false
            }
            this.spriteStyle = styleSprite
        }

        var stylePlastic = window.localStorage.getItem('stylePlastic')
        if (stylePlastic !== null) {
            if (stylePlastic === 'true') {
                stylePlastic = true
            }

            if (stylePlastic === 'false') {
                stylePlastic = false
            }
            this.plasticStyle = stylePlastic
        }

        var StyleCube = Number(window.localStorage.getItem('StyleCube'))
        if (StyleCube !== null) {
            Player.CubeStyle = StyleCube
        }

        //console.log('Loaded, current level is: ', this.currentLevel)
        //console.log('The lock is', this.blueCubeWoodenLock)
        //console.log('Loaded, current level is: ', WoodenLock)
    },

    NextLevel: function(){
        game.Restart()
        game.currentLevel = game.currentLevel + 1
        game.Save()
        if (game.unlockedLevel < 9) {
            game.unlockedLevel = game.unlockedLevel + 1
        }
        if (game.currentLevel == 7) {
            game.currentLevel = 0
            game.Save()
            game.Restart()
            game.SetGameState(GameState.Menu)
        } else {
            game.Restart()
            game.SetGameState(GameState.Started)
        }

    },

    mainLoop: function(){
        game.update()
        game.Draw()
        if(game.checkWin() && game.gameState != GameState.WonStage ) {
            setTimeout(function() {
                if (game.gameMode == GameMode.StoryMode) {
                    game.SetGameState(GameState.WonStage)
                } else {
                    game.SetGameState(GameState.Rules)
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
                }

            }, 300)

        } else if(game.checkLose() &&  game.gameState != GameState.Lost) {
            setTimeout(function() {
                if (game.gameMode === GameMode.StoryMode) {
                    game.SetGameState(GameState.Lost)
                }

                if (game.gameMode === GameMode.Freeplay) {
                    game.Restart()
                    game.SetGameState(GameState.Rules)
                }
              }, 30)
        }
        window.setTimeout(game.mainLoop, 1000 / 120)
    },

    update: function(){
        game.Save()
        if  (game.gameState === GameState.Started && game.gameMode === GameMode.StoryMode || game.gameState === GameState.Started && game.gameMode === GameMode.Freeplay) {
            levels[game.currentLevel].boxes.forEach(function(box) {
                box.update()
            })
            levels[game.currentLevel].players.forEach(function(player) {
                player.update()
            })
            levels[game.currentLevel].unlocks.forEach(function(unlock) {
                unlock.update()
            })
            levels[game.currentLevel].teleporters.forEach(function(teleporter) {
                teleporter.update()
            })

        }
    },

    checkWin: function(){
        var win = false
        levels[game.currentLevel].players.forEach(function(player) {
            levels[game.currentLevel].finishAreas.forEach(function(finishArea){
                if (finishArea.intersects(player)) {  
                    win = true
                } 
            })
        })
        
        return win 
    },

    checkLose: function(){
        var lose = false
        levels[game.currentLevel].players.forEach(function(player) {
            levels[game.currentLevel].boxes.forEach(function(box) {
                if (player.intersects(box)) {
                    lose = true
                }
            })
        })
        return lose
    },

    Draw: function(){
        game.backround.Draw() 

        if (game.gameState == GameState.WonStage) {
            WinMenu.Draw()
            game.DrawFinishText()
            return
        }
            
        if (game.gameState === GameState.Lost && game.gameMode === GameMode.StoryMode) {
            if (game.loseCounterStop === false) {
                game.currentLosses = game.currentLosses + 1
                if (game.currentLosses === 50) {
                    game.blueCubeSadLock = false
                }
                game.loseCounterStop = true
            }   
            LoseMenu.Draw()
            game.DrawLoseText()

        } else if (game.gameState === GameState.Started && game.gameMode < 3 || game.gameState === GameState.Rules && game.gameMode === GameMode.Freeplay || game.gameState === GameState.Paused && game.gameMode === GameMode.StoryMode) {

            levels[game.currentLevel].waters.forEach(function(water) {
                water.Draw()
            },)

            levels[game.currentLevel].finishAreas.forEach(function(finishArea) {
                finishArea.Draw()
            },)

            levels[game.currentLevel].unlocks.forEach(function(unlock) {
                unlock.Draw()
            },)

            levels[game.currentLevel].teleporters.forEach(function(teleporter) {
                teleporter.Draw()
            })

            levels[game.currentLevel].items.forEach(function(item) {
                item.Draw()
            })

            /*levels[game.currentLevel].changeDirectionSquares.forEach(function(changeDirectionSquare) {
                changeDirectionSquare.Draw()
            },)*/
            
            levels[game.currentLevel].walls.forEach(function(wall){
                if (wall.drawLast || wall.invisibleWall){
                wall.Draw()
                }
            },)

            levels[game.currentLevel].players.forEach(function(player) {
                player.Draw()        
            },)

            levels[game.currentLevel].boxes.forEach(function(box){
                box.Draw()
            },)
            
            levels[game.currentLevel].walls.forEach(function(wall){
                if (!wall.drawLast){
                wall.Draw()
                }
            },)
        
        } if (game.gameState == GameState.Rules && game.gameMode == GameMode.Freeplay) {
            game.DrawFreeplayLevel()
        } 
        if (game.gameState == GameState.Started && game.gameMode == GameMode.Shop && game.shopMode == ShopMode.Backround) {
            if (game.backroundShop == BackroundShop.Plastic) {
                game.DrawBackroundPlasticShop()   
            }
            if (game.backroundShop == BackroundShop.Sprite) {
                game.DrawBackroundSpriteShop()   
            }

            if (game.mobile === true) {
                game.context.drawImage(game.UpArrowShop, 0, 0, game.UpArrowShop.width, game.UpArrowShop.height, 10, 450, game.UpArrowShop.width, game.UpArrowShop.height)
                game.context.drawImage(game.DownArrowShop, 0, 0, game.DownArrowShop.width, game.DownArrowShop.height, 690, 450, game.DownArrowShop.width, game.DownArrowShop.height)
            }  

        } if (game.gameState == GameState.Started && game.gameMode == GameMode.Shop && game.shopMode == ShopMode.Player) {
            if (game.playerShop == PlayerShop.BlueCube) {
                game.DrawBlueCubeShop()   
            }
            
            if (game.playerShop === PlayerShop.BlueCubeAlien) {
                game.DrawBlueCubeAlienShop()   
            }
            
            if (game.playerShop === PlayerShop.BlueCubeLava) {
                game.DrawBlueCubeLavaShop()   
            }

            if (game.playerShop === PlayerShop.BlueCubeWooden) {
                game.DrawBlueCubeWoodenShop()   
            }

            if (game.playerShop === PlayerShop.BlueCubeSad) {
                game.DrawBlueCubeSadShop()   
            }
            
            if (game.mobile === true) {
                game.context.drawImage(game.UpArrowShop, 0, 0, game.UpArrowShop.width, game.UpArrowShop.height, 10, 450, game.UpArrowShop.width, game.UpArrowShop.height)
                game.context.drawImage(game.DownArrowShop, 0, 0, game.DownArrowShop.width, game.DownArrowShop.height, 690, 450, game.DownArrowShop.width, game.DownArrowShop.height)
            }
            
        } if (game.gameState === GameState.Rules && game.gameMode == GameMode.ItemsInfo) {
            game.DrawItemsInfo()
        } else if (game.gameState === GameState.Rules && game.gameMode == GameMode.Shop) {
            ShopMenu.Draw()
        } else if (game.gameState === GameState.Rules && game.gameMode == GameMode.StoryMode) {
            game.DrawRules()    
        } else if (game.gameState === GameState.Menu) {
            MainMenu.Draw()
        } else if (game.gameState === GameState.NotStarted){
            game.DrawTitleSrceen()
            game.DrawLogo()   
        }
        if (game.gameState === GameState.Paused && game.gameMode === GameMode.StoryMode) {
            game.context.fillStyle = "rgba(128, 128, 128, 0.6)"
            game.context.fillRect(0, 0, 850, 600)
            PauseMenu.Draw()   
        }
        if (game.gameState < 3 && game.gameState > 0 && game.mobile === true || game.gameState === GameState.Started && game.gameMode !== GameMode.StoryMode && game.mobile === true) {
            game.context.drawImage(game.BackButton, 0, 0, game.BackButton.width, game.BackButton.height, 750, 0, game.BackButton.width, game.BackButton.height) 
        }

        if (game.gameMode === GameMode.StoryMode && game.gameState === GameState.Started && game.mobile === true) {
            game.context.drawImage(game.MenuButton, 0, 0, game.MenuButton.width, game.MenuButton.height, 750, 0, game.MenuButton.width, game.MenuButton.height) 
        }
    }, 
    
    DrawMenu: function(){
        game.context.font = '115px Arial'
        game.context.fillStyle = 'lime'
        game.context.fillText("Story Mode", 100, 90)
        game.context.font = '115px Arial'
        game.context.fillStyle = 'lightgreen'
        game.context.fillText("Freeplay", 160, 210)
        game.context.font = '115px Arial'
        game.context.fillStyle = 'aquamarine'
        game.context.fillText("Shop", 250, 330)
        game.context.font = '115px Arial'
        game.context.fillStyle = 'lightskyblue'
        game.context.fillText("Items Info", 145, 460)
        game.context.font = '75px Arial'
        game.context.fillStyle = 'rgb(0, 157, 255)'
        game.context.fillText("Setting(Coming Soon)", 50, 560)

    },
   
    DrawRules: function(){
            game.context.font = "175px Arial";
            game.context.fillStyle = 'purple'
            game.context.fillText("Rules", 200, 175);
            ///
            game.context.font = '45px Arial';
            game.context.fillStyle = 'rgb(2, 0, 139)'
            game.context.fillText("Get to the pink to beat levels", 150, 275);
            game.context.fillText("Watch out for enemies", 200, 350);
            if (game.mobile === false) {
            game.context.fillText("Use A, D, S, D or Arrow Keys to move", 50, 425);
            }
            else if (game.mobile === true) {
                game.context.font = '35px Arial';
                game.context.fillText("Tap above, below, to the left or to the right to move", 35, 415);
            }
            game.context.font = '75px Arial';
            game.context.fillStyle = 'blue'
            game.context.fillText("Press space to start", 80, 550);
    }, 

    DrawTitleSrceen: function(){
        game.context.font = '275px Arial';
        game.context.fillStyle = 'black'
        game.context.fillText("CUB", 0, 250);
        game.context.font = '125px Arial';
        game.context.fillStyle = 'red'
        game.context.fillText("Adventure", 120, 400);
        game.context.font = '60px Arial';
        game.context.fillStyle = 'darkred'
        game.context.fillText("Press Space to Begin", 120, 550);
    },

    DrawLogo: function(){
        game.context.fillStyle = "black"
        game.context.fillRect(600, 50, 200, 200)
        game.context.fillStyle = "lightgray"
        game.context.fillRect(600 + 20, 50 + 40, 40, 40)
        game.context.fillRect(600 + 140, 50 + 40, 40, 40)
        game.context.fillRect(600 + 20, 50 + 130, 160, 40)
    },

    DrawFinishText: function(){
        game.context.font = '88px Arial';
        game.context.fillStyle = 'red' 
        game.context.fillText("Level " + (game.currentLevel + 1) + " Complete!", 60, 100); 
        game.context.font = '45px Arial';
        if (game.currentLevel === 7) {
        game.context.font = '175px Arial';
        game.context.fillStyle = 'tomato' 
        game.context.fillText("You win!", 85, 200)   
        }
    },

    DrawLoseText: function(){
        game.context.font = '130px Arial';
        game.context.fillStyle = "darkorchid";
        game.context.fillText("You Lose", 10, 120);
        game.context.font = '75px Arial';
        game.context.fillStyle = "darkmagenta";
        game.context.fillText("Losses", 575, 75);
        game.context.fillText((game.currentLosses), 675, 150);
    },

    DrawFreeplayLevel: function(){
        game.context.font = '125px Arial';
        game.context.fillStyle = "rgba(255, 255, 132, 0.788)";
        game.context.fillText("Level " + (game.currentLevel + 1), 225, 575);
        if (game.mobile === true) {
            game.context.drawImage(game.UpArrow, 0, 0, game.UpArrow.width, game.UpArrow.height, 10, 450, game.UpArrow.width, game.UpArrow.height)
            game.context.drawImage(game.DownArrow, 0, 0, game.DownArrow.width, game.DownArrow.height, 690, 450, game.DownArrow.width, game.DownArrow.height)
        }
        
    },

    DrawShopType: function(){
        game.context.font = '175px Arial'
        game.context.fillStyle = 'black'
        game.context.fillText("Backround", 0, 200)
        game.context.font = '175px Arial'
        game.context.fillStyle = 'red'
        game.context.fillText("Player", 0, 500)    
    },

    DrawBackroundSpriteShop: function(){
        game.context.drawImage(game.WallGrassV1_400x400, 0, 0, game.WallGrassV1_400x400.width, game.WallGrassV1_400x400.height, 225, 20, game.WallGrassV1_400x400.width, game.WallGrassV1_400x400.height)
        if (game.spriteStyle) {
            if (game.mobile === true) {
                game.context.font = '75px Arial'
                game.context.fillStyle = 'indianred'
                game.context.fillText("Sprite(Selected)", 155, 550)  
            }

            else {
                game.context.font = '100px Arial'
                game.context.fillStyle = 'indianred'
                game.context.fillText("Sprite(Selected)", 65, 550)  
            }
        }  
        
        else {
        game.context.font = '175px Arial'
        game.context.fillStyle = 'indianred'
        game.context.fillText("Sprite", 190, 550)
        }

    },

    DrawBackroundPlasticShop: function(){
        game.context.fillStyle = "rgb(190, 190, 190)"
        game.context.fillRect(225, 20, 400, 400)
        if (game.plasticStyle) {
            if (game.mobile === true) {
                game.context.font = '75px Arial'
                game.context.fillStyle = 'indianred'
                game.context.fillText("Plastic", 300, 500)
                game.context.fillText("(Selected)", 250, 575)  
            }

            else {
                game.context.font = '100px Arial'
                game.context.fillStyle = 'indianred'
                game.context.fillText("Plastic(Selected)", 50, 550)   
            }
                 
        }
        else {
        game.context.font = '175px Arial'
        game.context.fillStyle = 'indianred'
        game.context.fillText("Plastic", 165, 575)
        }    
    },

    DrawBlueCubeShop: function(){
        game.context.drawImage(game.BlueCube_400x400, 0, 0, game.BlueCube_400x400.width, game.BlueCube_400x400.height, 225, 25, game.BlueCube_400x400.width, game.BlueCube_400x400.height)
        if (Player.CubeStyle == CubeStyle.BlueCube) {
            if (game.mobile === true) {
                game.context.font = '75px Arial'
                game.context.fillStyle = 'indianred'
                game.context.fillText("Classic", 300, 500)
                game.context.fillText("(Selected)", 250, 575)
            }

            else {
                game.context.font = '100px Arial'
                game.context.fillStyle = 'indianred'
                game.context.fillText("Classic(Selected)", 35, 550)  
            }
                
        }
        else {
        game.context.font = '150px Arial'
        game.context.fillStyle = 'indianred'
        game.context.fillText("Classic", 175, 550)
        }

    },

    DrawBlueCubeAlienShop: function(){
        game.context.drawImage(game.BlueCubeAlien_400x400, 0, 0, game.BlueCubeAlien_400x400.width, game.BlueCubeAlien_400x400.height, 225, 25, game.BlueCubeAlien_400x400.width, game.BlueCubeAlien_400x400.height)
        if (Player.CubeStyle == CubeStyle.Alien) {
            if (game.mobile === true) {
                game.context.font = '75px Arial'
                game.context.fillStyle = 'indianred'
                game.context.fillText("Alien(Selected)", 175, 550)
            }

            else {
                game.context.font = '100px Arial'
                game.context.fillStyle = 'indianred'
                game.context.fillText("Alien(Selected)", 85, 550)
            }      
        }
        else {
            game.context.font = '150px Arial'
            game.context.fillStyle = 'indianred'
            game.context.fillText("Alien", 260, 550)
        }
    },

    DrawBlueCubeLavaShop: function(){
        game.context.drawImage(game.BlueCubeLava_400x400, 0, 0, game.BlueCubeLava_400x400.width, game.BlueCubeLava_400x400.height, 225, 25, game.BlueCubeLava_400x400.width, game.BlueCubeLava_400x400.height)
        if (Player.CubeStyle == CubeStyle.Lava) {
            if (game.mobile === true) {
                game.context.font = '75px Arial'
                game.context.fillStyle = 'indianred'
                game.context.fillText("Lava(Selected)", 175, 550)
            }

            else {
                game.context.font = '100px Arial'
                game.context.fillStyle = 'indianred'
                game.context.fillText("Lava(Selected)", 87, 550)
            }      
        }
        else {
            game.context.font = '150px Arial'
            game.context.fillStyle = 'indianred'
            game.context.fillText("Lava", 260, 550)
        }
   
    },

    DrawBlueCubeWoodenShop: function(){
        if (game.blueCubeWoodenLock === false) {
            game.context.drawImage(game.BlueCubeWooden_400x400, 0, 0, game.BlueCubeWooden_400x400.width, game.BlueCubeWooden_400x400.height, 225, 25, game.BlueCubeWooden_400x400.width, game.BlueCubeWooden_400x400.height)
        }

        if (Player.CubeStyle === CubeStyle.Wooden && game.blueCubeWoodenLock === false) {
            if (game.mobile === true) {
                game.context.font = '75px Arial'
                game.context.fillStyle = 'indianred'
                game.context.fillText("Wooden(Selected)", 100, 550)
            }

            else {
            game.context.font = '100px Arial'
            game.context.fillStyle = 'indianred'
            game.context.fillText("Wooden(Selected)", 10, 550)
            }      
        }
        else if (game.blueCubeWoodenLock === true) {
            game.context.font = '75px Arial'
            game.context.fillStyle = 'hotpink'
            game.context.fillText("Find the tree to unlock", 50, 100)
            
            if (game.mobile === true) {
                game.context.font = '125px Arial'
                game.context.fillStyle = 'indianred'
                game.context.fillText("Wooden", 195, 550)
            }
            else {
                game.context.font = '150px Arial'
                game.context.fillStyle = 'indianred'
                game.context.fillText("Wooden", 140, 550)
            }
        }
            
        else {
            game.context.font = '150px Arial'
            game.context.fillStyle = 'indianred'
            game.context.fillText("Wooden", 140, 550)
        }
   
    },

    DrawBlueCubeSadShop: function(){
        if (game.blueCubeSadLock === false) {
            game.context.drawImage(game.BlueCubeSad_400x400, 0, 0, game.BlueCubeSad_400x400.width, game.BlueCubeSad_400x400.height, 225, 25, game.BlueCubeSad_400x400.width, game.BlueCubeSad_400x400.height)
        }

        if (Player.CubeStyle === CubeStyle.Sad && game.blueCubeSadLock === false) {
            if (game.mobile === true) {
                game.context.font = '75px Arial'
                game.context.fillStyle = 'indianred'
                game.context.fillText("Sad(Selected)", 180, 550)
            }

            else {
            game.context.font = '100px Arial'
            game.context.fillStyle = 'indianred'
            game.context.fillText("Sad(Selected)", 120, 550)
            }      
        }
        else if (game.blueCubeSadLock === true) {
            game.context.font = '300px Arial'
            game.context.fillStyle = 'hotpink'
            game.context.fillText("???", 175, 350)
        }
            
        else {
            game.context.font = '150px Arial'
            game.context.fillStyle = 'indianred'
            game.context.fillText("Sad", 285, 550)
        }
   
    },

    DrawItemsInfo: function(){
        if (game.ItemNumber === 1) {
            if (game.unlockedLevel > 0) {
                game.context.font = "150px Arial";
                game.context.fillStyle = 'purple'
                game.context.fillText("Enemies", 10, 150);
                ///  
                game.context.drawImage(game.RedCube_200x200, 0, 0, game.RedCube_200x200.width, game.RedCube_200x200.height, 625, 10, game.RedCube_200x200.width, game.RedCube_200x200.height)
                ///
                game.context.font = "55px Arial";
                game.context.fillStyle = 'rgb(2, 0, 139)'
                game.context.fillText("Moves left to right or up to down", 10, 300);
                game.context.fillText("at a time.", 10, 375);
                game.context.fillText("Players lose when they touch", 10, 475);
                game.context.fillText("enemys.", 10, 550);
            }
    
            else {
                game.context.font = "125px Arial";
                game.context.fillStyle = 'lightcoral'
                game.context.fillText("Item 1", 200, 200);
                ///
                game.context.font = "150px Arial";
                game.context.fillStyle = 'lime'
                game.context.fillText("Beat Level 1", 10, 550);    
            }
        }

        else if (game.ItemNumber === 2) {
            if (game.unlockedLevel > 1) {
                game.context.font = "200px Arial";
                game.context.fillStyle = 'purple'
                game.context.fillText("Walls", 10, 160);
                ///  
                game.context.drawImage(game.WallGrassV1_200x200, 0, 0, game.WallGrassV1_200x200.width, game.WallGrassV1_200x200.height, 550, 10, game.WallGrassV1_200x200.width, game.WallGrassV1_200x200.height)
                ///
                game.context.font = "55px Arial";
                game.context.fillStyle = 'rgb(2, 0, 139)'
                game.context.fillText("Stops players from going through", 10, 300);
                game.context.fillText("walls.", 10, 375);

                game.context.fillText("Bounces enemies off of walls.", 10, 475);
            }

            else {
                game.context.font = "125px Arial";
                game.context.fillStyle = 'lightcoral'
                game.context.fillText("Item 2", 200, 200);
                ///
                game.context.font = "150px Arial";
                game.context.fillStyle = 'lime'
                game.context.fillText("Beat Level 2", 10, 550);    
            }
        }

        else if (game.ItemNumber === 3) {
            if (game.unlockedLevel > 3) {
                game.context.font = "145px Arial";
                game.context.fillStyle = 'purple'
                game.context.fillText("Switches", 10, 150);
                ///
                game.context.drawImage(game.SwitchW1Blue_200x200, 0, 0, game.SwitchW1Blue_200x200.width, game.SwitchW1Blue_200x200.height, 630, 10, game.SwitchW1Blue_200x200.width, game.SwitchW1Blue_200x200.height)
                ///
                game.context.font = "45px Arial";
                game.context.fillStyle = 'rgb(2, 0, 139)'
                game.context.fillText("Players and ememies can go on switches.", 10, 275);
                game.context.fillText("When they go on switches they activated.", 10, 400);
                game.context.fillText("Once switches have been activated they", 10, 525);
                game.context.fillText("break unlockable rocks.", 150, 575);
            }

            else {
                game.context.font = "125px Arial";
                game.context.fillStyle = 'lightcoral'
                game.context.fillText("Item 3", 200, 200);
                ///
                game.context.font = "150px Arial";
                game.context.fillStyle = 'lime'
                game.context.fillText("Beat Level 4", 10, 550);    
            }   
        }

        else if (game.ItemNumber === 4) {
            if (game.unlockedLevel > 3) {
                game.context.font = "120px Arial";
                game.context.fillStyle = 'purple'
                game.context.fillText("Unlockable", 10, 100);
                game.context.fillText("Rocks", 10, 200);
                ///
                game.context.drawImage(game.UnlockRockBlue_200x200, 0, 0, game.UnlockRockBlue_200x200.width, game.UnlockRockBlue_200x200.height, 625, 10, game.UnlockRockBlue_200x200.width, game.UnlockRockBlue_200x200.height)
                ///
                game.context.font = "45px Arial";
                game.context.fillStyle = 'rgb(2, 0, 139)'
                game.context.fillText("Unlockable rocks are like walls when", 10, 300);
                game.context.fillText("unbroken.", 10, 350);
                game.context.fillText("When switches are activated they break", 10, 425);
                game.context.fillText("unlockable rock.", 10, 475);
                game.context.fillText("Once broken you can go through them. ", 10, 575);

            }

            else {
                game.context.font = "125px Arial";
                game.context.fillStyle = 'lightcoral'
                game.context.fillText("Item 4", 200, 200);
                ///
                game.context.font = "150px Arial";
                game.context.fillStyle = 'lime'
                game.context.fillText("Beat Level 4", 10, 550);    
            }   
        }

        else if (game.ItemNumber === 5) {
            if (game.unlockedLevel > 4) {
                game.context.font = "120px Arial";
                game.context.fillStyle = 'purple'
                game.context.fillText("Invisible", 10, 100);
                game.context.fillText("Walls", 10, 200);
                ///
                game.context.drawImage(game.InvisibleWall_200x200V2, 0, 0, game.InvisibleWall_200x200V2.width, game.InvisibleWall_200x200V2.height, 505 , 10, game.InvisibleWall_200x200V2.width, game.InvisibleWall_200x200V2.height)
                ///
                game.context.font = "55px Arial";
                game.context.fillStyle = 'rgb(2, 0, 139)'
                game.context.fillText("Invisible walls look like walls.", 10, 325)
                game.context.fillText("Players and enemies can go", 10, 450)
                game.context.fillText("through walls.", 10, 525)
            }

            else {
                game.context.font = "125px Arial";
                game.context.fillStyle = 'lightcoral'
                game.context.fillText("Item 5", 200, 200);
                ///
                game.context.font = "150px Arial";
                game.context.fillStyle = 'lime'
                game.context.fillText("Beat Level 5", 10, 550);    
            }   
        }

        else if (game.ItemNumber === 6) {
            if (game.unlockedLevel > 5) {
                game.context.font = "120px Arial";
                game.context.fillStyle = 'purple'
                game.context.fillText("Teleporters", 10, 150);
                ///
                game.context.drawImage(game.TeleporterTomatoSprite_200x200, 0, 0, game.TeleporterTomatoSprite_200x200.width, game.TeleporterTomatoSprite_200x200.height, 625, 10, game.TeleporterTomatoSprite_200x200.width, game.TeleporterTomatoSprite_200x200.height)
                ///
                game.context.font = "55px Arial";
                game.context.fillStyle = 'rgb(2, 0, 139)'
                game.context.fillText("When players go on teleporters", 10, 300)
                game.context.fillText("they teleport to the matching", 10, 375)
                game.context.fillText("teleporter.", 10, 450)
                game.context.fillText("Enemies can't use teleporters.", 10, 550)
            }

            else {
                game.context.font = "125px Arial";
                game.context.fillStyle = 'lightcoral'
                game.context.fillText("Item 6", 200, 200);
                ///
                game.context.font = "150px Arial";
                game.context.fillStyle = 'lime'
                game.context.fillText("Beat Level 6", 10, 550);    
            }   
        }

        else if (game.ItemNumber === 7) {
            if (game.unlockedLevel > 6) {
                game.context.font = "200px Arial";
                game.context.fillStyle = 'purple'
                game.context.fillText("Water", 10, 175);
                ///
                game.context.drawImage(game.Water_Medium_200x200, 0, 0, game.Water_Medium_200x200.width, game.Water_Medium_200x200.height, 600, 10, game.Water_Medium_200x200.width, game.Water_Medium_200x200.height)
                ///
                game.context.font = "55px Arial";
                game.context.fillStyle = 'rgb(2, 0, 139)'
                game.context.fillText("Players need life jackets to go in", 10, 300)
                game.context.fillText("the water.", 10, 375)
                game.context.fillText("Enemies can go into water but", 10, 475)
                game.context.fillText("they move at half the speed.", 10, 550)
            }

            else {
                game.context.font = "125px Arial";
                game.context.fillStyle = 'lightcoral'
                game.context.fillText("Item 7", 200, 200);
                ///
                game.context.font = "150px Arial";
                game.context.fillStyle = 'lime'
                game.context.fillText("Beat Level 7", 10, 550);    
            }   
        }

        else if (game.ItemNumber === 8) {
            if (game.unlockedLevel > 6) {
                game.context.font = "125px Arial";
                game.context.fillStyle = 'purple'
                game.context.fillText("Life Jacket", 10, 150);
                ///
                game.context.drawImage(game.LifeJacket_200x200, 0, 0, game.LifeJacket_200x200.width, game.LifeJacket_200x200.height, 625, 10, game.LifeJacket_200x200.width, game.LifeJacket_200x200.height)
                ///
                game.context.font = "50px Arial";
                game.context.fillStyle = 'rgb(2, 0, 139)'
                game.context.fillText("When players pick up life jackets they", 10, 262.5)
                game.context.fillText("can go in water.", 10, 337.5)
                game.context.fillText("When enemies pick up life jackets", 10, 437.5)
                game.context.fillText("they can move at nomral speed in", 10, 500)
                game.context.fillText("water.", 10, 562.5)
            }

            else {
                game.context.font = "125px Arial";
                game.context.fillStyle = 'lightcoral'
                game.context.fillText("Item 8", 200, 200);
                ///
                game.context.font = "150px Arial";
                game.context.fillStyle = 'lime'
                game.context.fillText("Beat Level 7", 10, 550);    
            }   
        }

        /*else if (game.ItemNumber < 10) {
            game.context.font = "150px Arial";
            game.context.fillStyle = 'lightcoral'
            game.context.fillText("Coming", 140, 250);
            game.context.fillText("Soon", 225, 375);      
        }*/

        
    }
}

function Loaded(){
    game.canvas = document.getElementById("mycanvas");
    game.context = game.canvas.getContext("2d")
    ///
    if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i ) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i)){
            game.mobile = true       
    } else {
            game.mobile = false
    }
    ///
    game.WallGrassV1.src = "images/WallGrassV1.png";
    game.WallGrassV1_200x200.src = "images/WallGrassV1_200x200.png";
    game.WallGrassV1_400x400.src = "images/WallGrassV1_400x400.png";
    game.WallGrassV2.src = "images/WallGrassV2.png";
    game.WallGrassV3.src = "images/WallGrassV3.png";
    game.WallGrassTree.src = "images/WallGrassTree.png";
    ///
    game.BlueCube.src = "images/BlueCube.png";
    game.BlueCubeAlien.src = "images/BlueCubeAlien.png";
    game.BlueCubeLava.src = "images/BlueCubeLava.png";
    game.BlueCubeWooden.src = "images/BlueCubeWooden.png";
    game.BlueCubeSad.src = "images/BlueCubeSad.png";
    ///
    game.BlueCubePlastic.src = "images/BlueCubePlastic.png";
    game.BlueCubeAlienPlastic.src = "images/BlueCubeAlienPlastic.png";
    game.BlueCubeLavaPlastic.src = "images/BlueCubeLavaPlastic.png";
    game.BlueCubeWoodenPlastic.src = "images/BlueCubeWoodenPlastic.png";
    game.BlueCubeSadPlastic.src = "images/BlueCubeSadPlastic.png";
    ///
    game.BlueCube_400x400.src = "images/BlueCube_400x400.png";
    game.BlueCubeAlien_400x400.src = "images/BlueCubeAlien_400x400.png";
    game.BlueCubeLava_400x400.src = "images/BlueCubeLava_400x400.png";
    game.BlueCubeWooden_400x400.src = "images/BlueCubeWooden_400x400.png";
    game.BlueCubeSad_400x400.src = "images/BlueCubeSad_400x400.png";
    ///
    game.RedCube.src = "images/RedCube.png";
    game.RedCube_200x200.src = "images/RedCube_200x200.png";
    game.RedCubePlastic.src = "images/RedCubePlastic.png";
    ///
    game.TeleporterTomato.src = "images/TeleporterTomato.png";
    game.TeleporterTomatoSprite.src = "images/TeleporterTomatoSprite.png";
    game.TeleporterTomatoSprite_200x200.src = "images/TeleporterTomatoSprite_200x200.png";
    game.TeleporterPurple.src = "images/TeleporterPurple.png";
    game.TeleporterPurpleSprite.src = "images/TeleporterPurpleSprite.png";
    ///
    game.SwitchW1Blue.src = "images/SwitchW1Blue.png";
    game.SwitchW1Blue_200x200.src = "images/SwitchW1Blue_200x200.png";
    game.SwitchW1Purple.src = "images/SwitchW1Purple.png";
    game.SwitchW1ActivatedBlue.src = "images/SwitchW1ActivatedBlue.png";
    game.SwitchW1ActivatedPurple.src = "images/SwitchW1ActivatedPurple.png";
    ///
    game.InvisibleWall.src = "images/InvisibleWall.png";
    game.InvisibleWall_200x200.src = "images/InvisibleWall_200x200.png";
    game.InvisibleWall_200x200V2.src = "images/InvisibleWall_200x200V2.png";
    ///
    game.LifeJacket.src = "images/LifeJacket.png"
    game.LifeJacket_200x200.src = "images/LifeJacket_200x200.png"
    game.LifeJacketPlastic.src = "images/LifeJacketPlastic.png"
    ///
    game.Water_Medium2.src = "images/Water_Medium2.png"
    game.Water_Medium_200x200.src = "images/Water_Medium_200x200.png"
    ///
    game.UnlockRockPurple.src = "images/UnlockRockPurple.png";
    game.UnlockedRockPurple.src = "images/UnlockedRockPurple.png";
    game.UnlockRockBlue.src = "images/UnlockRockBlue.png";
    game.UnlockRockBlue_200x200.src = "images/UnlockRockBlue_200x200.png";
    game.UnlockedRockBlue.src = "images/UnlockedRockBlue.png";
    ///
    game.UpArrow.src = "images/UpArrow.png"
    game.DownArrow.src = "images/DownArrow.png"
    game.UpArrowShop.src = "images/UpArrowShop.png"
    game.DownArrowShop.src = "images/DownArrowShop.png"
    ///
    game.BackButton.src = "images/BackButton.png"
    game.MenuButton.src = "images/MenuButton.png"
    ///
    game.Music.src = "Music.mp3"

    game.Load()

    ///
    window.setTimeout(game.mainLoop, 100)    
}

document.addEventListener('DOMContentLoaded', Loaded )