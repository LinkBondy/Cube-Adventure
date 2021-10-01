"use strict";

var GameState = {
    NotStarted: 0,
    Menu: 1,
    Rules: 2,
    Started: 3,
    Lost: 4,
    WonStage: 5,
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
}

var BackroundShop = {
    Classic: 1,
    Sprite: 2
}

var game = {
    canvas: undefined,
    context: undefined,
    startTime: new Date(),
    classicStyle: false,
    spriteStyle: true,
    ///
    gameState: GameState.NotStarted,
    gameMode: GameMode.StoryMode,
    shopMode: ShopMode.ShopMenu,
    backroundShop: BackroundShop.Classic,
    playerShop: PlayerShop.BlueCube,
    ///
    // Blue Cube
    BlueCube: new Image(),
    BlueCubeAlien: new Image(),
    BlueCubeLava: new Image(),
    BlueCubeWooden: new Image(),
    // Blue Cube Plastic 
    BlueCubePlastic: new Image(),
    BlueCubeAlienPlastic: new Image(),
    BlueCubeLavaPlastic: new Image(),
    BlueCubeWoodenPlastic: new Image(),
    // Blue Cube 200 x 200
    BlueCube_400x400: new Image(),
    BlueCubeAlien_400x400: new Image(),
    BlueCubeLava_400x400: new Image(),
    BlueCubeWooden_400x400: new Image(), 
    // Red Cube
    RedCube: new Image(),
    RedCube_200x200: new Image(),
    RedCubePlastic: new Image(),
    // Wall Grass
    WallGrassV1: new Image(),
    WallGrassV1_200x200: new Image(),
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
    // Items
    LifeJacket: new Image(),
    LifeJacketPlastic: new Image(),
    LifeJacket_200x200: new Image(),
    ///
    Music: new Audio(),
    // Other
    mainScreen: false,
    reset: false,
    blueCubeWoodenLock: true,
    loseCounterStop: false,
    currentLevel: 0,
    oldLevel: undefined,
    currentLosses: 0,
    unlockedLevel: 5,
    ItemNumber: 1,
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
        game.reset = false
    },

    NextLevel: function(){
        game.Restart()
        game.currentLevel = game.currentLevel + 1
        if (game.unlockedLevel < 9) {
        game.unlockedLevel = game.unlockedLevel + 1
        }
        if (game.currentLevel == 7) {
            game.currentLevel = 0
            game.reset == true
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
                game.loseCounterStop = true
            }   
            LoseMenu.Draw()
            game.DrawLoseText()
        } else if (game.gameState === GameState.Started && game.gameMode < 3 || game.gameState === GameState.Rules && game.gameMode === GameMode.Freeplay) {

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
            if (game.backroundShop == BackroundShop.Classic) {
                game.DrawBackroundClassicShop()   
            }
            
            if (game.backroundShop == BackroundShop.Sprite) {
                game.DrawBackroundSpriteShop()   
            }  
        } if (game.gameState == GameState.Started && game.gameMode == GameMode.Shop && game.shopMode == ShopMode.Player) {
            if (game.playerShop == PlayerShop.BlueCube) {
                game.DrawBlueCubeShop()   
            }
            
            if (game.playerShop == PlayerShop.BlueCubeAlien) {
                game.DrawBlueCubeAlienShop()   
            }
            
            if (game.playerShop == PlayerShop.BlueCubeLava) {
                game.DrawBlueCubeLavaShop()   
            }

            if (game.playerShop == PlayerShop.BlueCubeWooden) {
                game.DrawBlueCubeWoodenShop()   
            }
            
        } if (game.gameState == GameState.Rules && game.gameMode == GameMode.ItemsInfo) {
            game.DrawItemsInfo()
        } else if (game.gameState == GameState.Rules && game.gameMode == GameMode.Shop) {
            ShopMenu.Draw()
        } else if (game.gameState == GameState.Rules && game.gameMode == GameMode.StoryMode) {
            game.DrawRules()    
        } else if (game.gameState == GameState.Menu) {
            MainMenu.Draw()
        } else if (game.gameState == GameState.NotStarted){
            game.DrawTitleSrceen()
            game.DrawLogo()   
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
            game.context.fillText("Rules", 175, 175);
            ///
            game.context.font = '45px Arial';
            game.context.fillStyle = 'rgb(2, 0, 139)'
            game.context.fillText("Get to the pink to beat levels", 125, 275);
            game.context.fillText("Watch out for enemies", 175, 350);
            game.context.fillText("Use A, D, S, D or Arrow Keys to move", 50, 425);
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
        
    },

    DrawShopType: function(){
        game.context.font = '175px Arial'
        game.context.fillStyle = 'black'
        game.context.fillText("Backround", 0, 200)
        game.context.font = '175px Arial'
        game.context.fillStyle = 'red'
        game.context.fillText("Player", 0, 500)    
    },

    DrawBackroundClassicShop: function(){
        if (game.classicStyle) {
            game.context.font = '100px Arial'
            game.context.fillStyle = 'indianred'
            game.context.fillText("Classic(Selected)", 30, 550)      
        }
        else {
        game.context.font = '175px Arial'
        game.context.fillStyle = 'indianred'
        game.context.fillText("Classic", 95, 550)
        }    
    },

    DrawBackroundSpriteShop: function(){
        if (game.spriteStyle) {
            game.context.font = '100px Arial'
            game.context.fillStyle = 'indianred'
            game.context.fillText("Sprite(Selected)", 60, 550)      
        }
        else {
        game.context.font = '175px Arial'
        game.context.fillStyle = 'indianred'
        game.context.fillText("Sprite", 160, 550)
        }

    },

    DrawBlueCubeShop: function(){
        game.context.drawImage(game.BlueCube_400x400, 0, 0, game.BlueCube_400x400.width, game.BlueCube_400x400.height, 200, 25, game.BlueCube_400x400.width, game.BlueCube_400x400.height)
        if (Player.CubeStyle == CubeStyle.BlueCube) {
            game.context.font = '100px Arial'
            game.context.fillStyle = 'indianred'
            game.context.fillText("Classic(Selected)", 35, 550)      
        }
        else {
        game.context.font = '150px Arial'
        game.context.fillStyle = 'indianred'
        game.context.fillText("Classic", 150, 550)
        }

    },

    DrawBlueCubeAlienShop: function(){
        game.context.drawImage(game.BlueCubeAlien_400x400, 0, 0, game.BlueCubeAlien_400x400.width, game.BlueCubeAlien_400x400.height, 200, 25, game.BlueCubeAlien_400x400.width, game.BlueCubeAlien_400x400.height)
        if (Player.CubeStyle == CubeStyle.Alien) {
            game.context.font = '100px Arial'
            game.context.fillStyle = 'indianred'
            game.context.fillText("Alien(Selected)", 80, 550)      
        }
        else {
        game.context.font = '150px Arial'
        game.context.fillStyle = 'indianred'
        game.context.fillText("Alien", 225, 550)
        }
    },

    DrawBlueCubeLavaShop: function(){
        game.context.drawImage(game.BlueCubeLava_400x400, 0, 0, game.BlueCubeLava_400x400.width, game.BlueCubeLava_400x400.height, 200, 25, game.BlueCubeLava_400x400.width, game.BlueCubeLava_400x400.height)
        if (Player.CubeStyle == CubeStyle.Lava) {
            game.context.font = '100px Arial'
            game.context.fillStyle = 'indianred'
            game.context.fillText("Lava(Selected)", 80, 550)      
        }
        else {
        game.context.font = '150px Arial'
        game.context.fillStyle = 'indianred'
        game.context.fillText("Lava", 225, 550)
        }
   
    },

    DrawBlueCubeWoodenShop: function(){
        if (game.blueCubeWoodenLock == false) {
            game.context.drawImage(game.BlueCubeWooden_400x400, 0, 0, game.BlueCubeWooden_400x400.width, game.BlueCubeWooden_400x400.height, 200, 25, game.BlueCubeWooden_400x400.width, game.BlueCubeWooden_400x400.height)
        }

        if (Player.CubeStyle == CubeStyle.Wooden && game.blueCubeWoodenLock == false) {
            game.context.font = '100px Arial'
            game.context.fillStyle = 'indianred'
            game.context.fillText("Wooden(Selected)", 15, 550)      
        }
        else if (game.blueCubeWoodenLock == true) {
            game.context.font = '75px Arial'
            game.context.fillStyle = 'hotpink'
            game.context.fillText("Find the tree to unlock", 50, 100)
            game.context.font = '150px Arial'
            game.context.fillStyle = 'indianred'
            game.context.fillText("Wooden", 130, 550)
        }
            
        else {
            game.context.font = '150px Arial'
            game.context.fillStyle = 'indianred'
            game.context.fillText("Wooden", 130, 550)
        }
   
    },

    DrawItemsInfo: function(){
        if (game.ItemNumber === 1) {
            if (game.unlockedLevel > 1) {
                game.context.font = "150px Arial";
                game.context.fillStyle = 'purple'
                game.context.fillText("Enemies", 10, 150);
                ///  
                game.context.drawImage(game.RedCube_200x200, 0, 0, game.RedCube_200x200.width, game.RedCube_200x200.height, 625, 10, game.RedCube_200x200.width, game.RedCube_200x200.height)
                ///
                game.context.font = "45px Arial";
                game.context.fillStyle = 'rgb(2, 0, 139)'
                game.context.fillText("Moves left to right or up to down at a time.", 10, 325);
                game.context.fillText("Players lose when they touch enemys.", 10, 475);
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
            if (game.unlockedLevel > 2) {
                game.context.font = "175px Arial";
                game.context.fillStyle = 'purple'
                game.context.fillText("Walls", 10, 150);
                ///  
                game.context.drawImage(game.WallGrassV1_200x200, 0, 0, game.WallGrassV1_200x200.width, game.WallGrassV1_200x200.height, 500, 10, game.WallGrassV1_200x200.width, game.WallGrassV1_200x200.height)
                ///
                game.context.font = "50px Arial";
                game.context.fillStyle = 'rgb(2, 0, 139)'
                game.context.fillText("Stops players from going through", 10, 300);
                game.context.fillText("walls.", 10, 350);

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
            if (game.unlockedLevel > 4) {
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
            if (game.unlockedLevel > 4) {
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
                game.context.fillText("Once broken you can go thought them. ", 10, 575);

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
            /*if (game.unlockedLevel > 5) {
                game.context.font = "100px Arial";
                game.context.fillStyle = 'purple'
                game.context.drawImage(game.InvisibleWall_200x200V2, 0, 0, game.InvisibleWall_200x200V2.width, game.InvisibleWall_200x200V2.height, 625, 10, game.InvisibleWall_200x200V2.width, game.InvisibleWall_200x200V2.height)
                ///
                game.context.font = "55px Arial";
                game.context.fillStyle = 'rgb(2, 0, 139)'
            }

            else {
                game.context.font = "125px Arial";
                game.context.fillStyle = 'lightcoral'
                game.context.fillText("Item 5", 200, 200);
                ///
                game.context.font = "150px Arial";
                game.context.fillStyle = 'lime'
                game.context.fillText("Beat Level 5", 10, 550);
                    
            }*/
                game.context.font = "150px Arial";
                game.context.fillStyle = 'lightcoral'
                game.context.fillText("Comming", 75, 250);
                game.context.fillText("Soon", 225, 375);      
        }

        /*else if (game.ItemNumber === 5) {
            if (game.unlockedLevel > 5) {
                game.context.font = "100px Arial";
                game.context.fillStyle = 'purple'
                game.context.drawImage(game.InvisibleWall_200x200V2, 0, 0, game.InvisibleWall_200x200V2.width, game.InvisibleWall_200x200V2.height, 625, 10, game.InvisibleWall_200x200V2.width, game.InvisibleWall_200x200V2.height)
                ///
                game.context.font = "55px Arial";
                game.context.fillStyle = 'rgb(2, 0, 139)'
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
        }*/

        else if (game.ItemNumber === 6) {
            if (game.unlockedLevel > 6) {
                game.context.font = "100px Arial";
                game.context.fillStyle = 'purple'
                game.context.drawImage(game.TeleporterTomatoSprite_200x200, 0, 0, game.TeleporterTomatoSprite_200x200.width, game.TeleporterTomatoSprite_200x200.height, 625, 10, game.TeleporterTomatoSprite_200x200.width, game.TeleporterTomatoSprite_200x200.height)
                ///
                game.context.font = "55px Arial";
                game.context.fillStyle = 'rgb(2, 0, 139)'
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
            if (game.unlockedLevel > 7) {
                game.context.font = "100px Arial";
                game.context.fillStyle = 'purple'
                ///
                game.context.font = "55px Arial";
                game.context.fillStyle = 'rgb(2, 0, 139)'
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
            if (game.unlockedLevel > 7) {
                game.context.font = "100px Arial";
                game.context.fillStyle = 'purple'
                ///
                game.context.font = "55px Arial";
                game.context.fillStyle = 'rgb(2, 0, 139)'
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

        
    }
}

function Loaded(){
    game.canvas = document.getElementById("mycanvas");
    game.context = game.canvas.getContext("2d")
    ///
    game.WallGrassV1.src = "images/WallGrassV1.png";
    game.WallGrassV1_200x200.src = "images/WallGrassV1_200x200.png";
    game.WallGrassV2.src = "images/WallGrassV2.png";
    game.WallGrassV3.src = "images/WallGrassV3.png";
    game.WallGrassTree.src = "images/WallGrassTree.png";
    ///
    game.BlueCube.src = "images/BlueCube.png";
    game.BlueCubeAlien.src = "images/BlueCubeAlien.png";
    game.BlueCubeLava.src = "images/BlueCubeLava.png";
    game.BlueCubeWooden.src = "images/BlueCubeWooden.png";
    ///
    game.BlueCubePlastic.src = "images/BlueCubePlastic.png";
    game.BlueCubeAlienPlastic.src = "images/BlueCubeAlienPlastic.png";
    game.BlueCubeLavaPlastic.src = "images/BlueCubeLavaPlastic.png";
    game.BlueCubeWoodenPlastic.src = "images/BlueCubeWoodenPlastic.png";
    ///
    game.BlueCube_400x400.src = "images/BlueCube_400x400.png";
    game.BlueCubeAlien_400x400.src = "images/BlueCubeAlien_400x400.png";
    game.BlueCubeLava_400x400.src = "images/BlueCubeLava_400x400.png";
    game.BlueCubeWooden_400x400.src = "images/BlueCubeWooden_400x400.png";
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
    game.LifeJacketPlastic.src = "images/LifeJacketPlastic.png"
    ///
    game.UnlockRockPurple.src = "images/UnlockRockPurple.png";
    game.UnlockedRockPurple.src = "images/UnlockedRockPurple.png";
    game.UnlockRockBlue.src = "images/UnlockRockBlue.png";
    game.UnlockRockBlue_200x200.src = "images/UnlockRockBlue_200x200.png";
    game.UnlockedRockBlue.src = "images/UnlockedRockBlue.png";
    ///
    game.Music.src = "Music.mp3"
    ///
    window.setTimeout(game.mainLoop, 100)    
}

document.addEventListener('DOMContentLoaded', Loaded )