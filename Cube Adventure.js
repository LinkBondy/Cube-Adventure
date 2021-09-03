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
    Shop: 3
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
    // Blue Cube Alien
    BlueCubeAlien: new Image(),
    // Blue Cube Lava
    BlueCubeLava: new Image(),
    // Blue Cube Plastic 
    BlueCubePlastic: new Image(),
    // Blue Cube Alien Plastic 
    BlueCubeAlienPlastic: new Image(),
    // Blue Cube Lava Plastic
    BlueCubeLavaPlastic: new Image(), 
    // Red Cube
    RedCube: new Image(),
    // Wall Grass
    WallGrassV1: new Image(),
    WallGrassV2: new Image(),
    WallGrassV3: new Image(),
    // Teleporter
    TeleporterTomato: new Image(),
    TeleporterTomatoSprite: new Image(),
    TeleporterPurple: new Image(),
    TeleporterPurpleSprite: new Image(),
    // Switch
    SwitchW1Blue: new Image(),
    SwitchW1Purple: new Image(),
    SwitchW1ActivatedBlue: new Image(),
    SwitchW1ActivatedPurple: new Image(),
    // Unlock Rock
    UnlockRockPurple: new Image(),
    UnlockedRockPurple: new Image(),
    UnlockRockBlue: new Image(),
    UnlockedRockBlue: new Image(),
    // Invisible Wall
    InvisibleWall: new Image(),
    // Items
    LifeJacket: new Image(),
    ///
    Music: new Audio(),
    // Other
    mainScreen: false,
    reset: false,
    difficultyScreen: false,
    currentLevel: 0,
    backround: new Backround(),
    selector: new Selector(),
    
    SetGameState: function(gameState) {
        game.gameState = gameState
        /*if (game.gameState == GameState.Started)
            game.Music.play();
        else
            game.Music.pause();
    */},

    Restart: function(){
        if (!game.reset) {
            game.SetGameState(GameState.Started)
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
    },

    NextLevel: function(){
        game.Restart()
        game.currentLevel = game.currentLevel + 1
        if (game.currentLevel == 7) {
            game.currentLevel = 0
            game.reset == true
            game.Restart()
            game.reset == false
            game.SetGameState(GameState.Menu)
        } else {
            game.Restart()
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
                game.SetGameState(GameState.Lost)
              }, 30)
        }
        window.setTimeout(game.mainLoop, 1000 / 120)
    },

    update: function(){
        if(game.gameState == GameState.Started) {
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
                if(finishArea.intersects(player)) {  
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
            game.DrawFinishText()
            return
        }
            
        if (game.gameState == GameState.Lost) {
            game.DrawLoseText()
        
        } else if (game.gameState == GameState.Started && game.gameMode != GameMode.Shop || game.gameState == GameState.Rules && game.gameMode == GameMode.Freeplay) {

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
        } else if (game.gameState == GameState.Rules && game.gameMode == GameMode.Shop) {
            game.selector.Draw()
            game.DrawShopType()
        } else if (game.gameState == GameState.Rules && game.gameMode == GameMode.StoryMode) {
            game.DrawRules() 
        
        } else if (game.gameState == GameState.Menu) {
            game.selector.Draw()
            game.DrawMenu()
        } else if (game.gameState == GameState.NotStarted){
            game.DrawTitleSrceen()
            game.DrawLogo()
            
        }
    }, 
    
    DrawMenu: function(){
        game.context.font = '150px Arial'
        game.context.fillStyle = 'lime'
        game.context.fillText("Story Mode", 30, 145)
        game.context.font = '130px Arial'
        game.context.fillStyle = 'lightgreen'
        game.context.fillText("Freeplay", 160, 350)
        game.context.font = '150px Arial'
        game.context.fillStyle = 'lightblue'
        game.context.fillText("Shop", 220, 550)

    },
   
    DrawRules: function(){
        game.context.font = "175px Arial";
        game.context.fillStyle = 'purple'
        game.context.fillText("Rules", 175, 175);
        game.context.font = '45px Arial';
        game.context.fillStyle = 'darkblue'
        game.context.fillText("Get to the pink to beat levels", 125, 275);
        game.context.fillText("Watch out for enemies", 175, 350);
        game.context.fillText("Use A, D, S, F or Arrow Keys to move", 50, 425);
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
        game.context.fillText("Level " + (game.currentLevel + 1) + " Complete!", 63, 100); 
        game.context.font = '45px Arial';
        game.context.fillStyle = 'darkpink'
        if (game.currentLevel < 6) {
        game.context.fillText("Press Space to continue", 155, 550);
        }
        else {
        game.context.font = '175px Arial';
        game.context.fillStyle = 'tomato' 
        game.context.fillText("You win!", 85, 550)   
        }
    },

    DrawLoseText: function(){
        game.context.font = '125px Arial';
        game.context.fillStyle = "darkorchid";
        game.context.fillText("You Lose", 130, 125);
        game.context.font = '60px Arial';
        game.context.fillStyle = "violet";
        game.context.fillText("Press space to retry", 145, 550);
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
        levels[game.currentLevel].players.forEach(function(player) {
        if (Player.CubeStyle == CubeStyle.BlueCube) {
            game.context.font = '100px Arial'
            game.context.fillStyle = 'indianred'
            game.context.fillText("Classic(Selected)", 35, 550)      
        }
        else {
        game.context.font = '175px Arial'
        game.context.fillStyle = 'indianred'
        game.context.fillText("Classic", 110, 550)
        }
    })

    },

    DrawBlueCubeAlienShop: function(){
        levels[game.currentLevel].players.forEach(function(player) {
        if (Player.CubeStyle == CubeStyle.Alien) {
            game.context.font = '100px Arial'
            game.context.fillStyle = 'indianred'
            game.context.fillText("Alien(Selected)", 80, 550)      
        }
        else {
        game.context.font = '175px Arial'
        game.context.fillStyle = 'indianred'
        game.context.fillText("Alien", 200, 550)
        }
    })

    },

    DrawBlueCubeLavaShop: function(){
        levels[game.currentLevel].players.forEach(function(player) {
        if (Player.CubeStyle == CubeStyle.Lava) {
            game.context.font = '100px Arial'
            game.context.fillStyle = 'indianred'
            game.context.fillText("Lava(Selected)", 80, 550)      
        }
        else {
        game.context.font = '175px Arial'
        game.context.fillStyle = 'indianred'
        game.context.fillText("Lava", 200, 550)
        }
    })

    }
}

function Loaded(){
    game.canvas = document.getElementById("mycanvas");
    game.context = game.canvas.getContext("2d")
    ///
    game.WallGrassV1.src = "images/WallGrassV1.png";
    game.WallGrassV2.src = "images/WallGrassV2.png";
    game.WallGrassV3.src = "images/WallGrassV3.png";
    ///
    game.BlueCube.src = "images/BlueCube.png";
    game.BlueCubeAlien.src = "images/BlueCubeAlien.png";
    game.BlueCubeLava.src = "images/BlueCubeLava.png";
    game.BlueCubePlastic.src = "images/BlueCubePlastic.png";
    game.BlueCubeAlienPlastic.src = "images/BlueCubeAlienPlastic.png";
    game.BlueCubeLavaPlastic.src = "images/BlueCubeLavaPlastic.png";
    ///
    game.RedCube.src = "images/RedCube.png";
    ///
    game.TeleporterTomato.src = "images/TeleporterTomato.png";
    game.TeleporterTomatoSprite.src = "images/TeleporterTomatoSprite.png";
    game.TeleporterPurple.src = "images/TeleporterPurple.png";
    game.TeleporterPurpleSprite.src = "images/TeleporterPurpleSprite.png";
    ///
    game.SwitchW1Blue.src = "images/SwitchW1Blue.png";
    game.SwitchW1Purple.src = "images/SwitchW1Purple.png";
    game.SwitchW1ActivatedBlue.src = "images/SwitchW1ActivatedBlue.png";
    game.SwitchW1ActivatedPurple.src = "images/SwitchW1ActivatedPurple.png";
    ///
    game.InvisibleWall.src = "images/InvisibleWall.png";
    ///
    game.LifeJacket.src = "images/LifeJacket.png"
    ///
    game.UnlockRockPurple.src = "images/UnlockRockPurple.png";
    game.UnlockedRockPurple.src = "images/UnlockedRockPurple.png";
    game.UnlockRockBlue.src = "images/UnlockRockBlue.png";
    game.UnlockedRockBlue.src = "images/UnlockedRockBlue.png";
    ///
    game.Music.src = "Music.mp3"
    ///
    window.setTimeout(game.mainLoop, 100)    
}

document.addEventListener('DOMContentLoaded', Loaded )