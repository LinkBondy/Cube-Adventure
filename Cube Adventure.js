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

var game = {
    canvas: undefined,
    context: undefined,
    startTime: new Date(),
    basictheme: true,
    shopWorld1: false,
    gameState: GameState.NotStarted,
    gameMode: GameMode.StoryMode,
    // Blue Cube
    BlueCube: new Image(),
    BlueCubeStyle: true,
    // BlueCubeAlien
    BlueCubeAlien: new Image(),
    BlueCubeAlienStyle: false,
    // Red Cube
    RedCube: new Image(),
    ///
    WallGrassV1: new Image(),
    WallGrassV2: new Image(),
    WallGrassV3: new Image(),
    ///
    Teleporter: new Image(),
    ///
    SwitchW1: new Image(),
    ///
    mainScreen: false,
    difficultyScreen: false,
    currentLevel: 0,
    backround: new Backround(),
    selector: new Selector(),
    teleporter: new Teleporter(),
     
    Restart: function(){
            game.gameState = GameState.Started
            levels[game.currentLevel].boxes.forEach(function(box) {
                box.resetPosition() 
            })
            levels[game.currentLevel].players.forEach(function(player) {
                player.resetPosition()
            })
            levels[game.currentLevel].unlocks.forEach(function(unlock) {
                unlock.unlockWall.allowMovement = false
                unlock.activated = false    
            })
    },

    NextLevel: function(){
            levels[game.currentLevel].players.forEach(function(player) {
                player.x = 400
                player.y = 0
            })
            game.gameState = GameState.Started
            game.currentLevel = game.currentLevel + 1

    },

    mainLoop: function(){
        game.update()
        game.Draw()
        if(game.checkWin() && game.gameState != GameState.WonStage ) {
            setTimeout(function() {
                if (game.gameMode == GameMode.StoryMode) {
                    game.gameState = GameState.WonStage
                } else {
                    game.gameState = GameState.Rules
                    levels[game.currentLevel].boxes.forEach(function(box) {
                        box.resetPosition() 
                    })
                    levels[game.currentLevel].players.forEach(function(player) {
                        player.resetPosition()
                    })
                    levels[game.currentLevel].unlocks.forEach(function(unlock) {
                        unlock.unlockWall.allowMovement = false
                        unlock.activated = false    
                    })
                }

            }, 300)

        } else if(game.checkLose() &&  game.gameState != GameState.Lost) {
            setTimeout(function() {
                game.gameState = GameState.Lost
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
        var currentTime = new Date()
        if(game.gameState == GameState.WonStage) {
            game.DrawFinishText()
        } else {
            if(game.gameState == GameState.Lost) {
                game.DrawLoseText()
            
            } else if(game.gameState == GameState.Started || game.gameState == GameState.Rules && game.gameMode == GameMode.Freeplay) {
                
                levels[game.currentLevel].unlocks.forEach(function(unlock) {
                    if (game.shopWorld1 == true) {
                        game.context.drawImage(game.SwitchW1, 0, 0, game.SwitchW1.width, game.SwitchW1.height, unlock.x - 2, unlock.y - 2, game.SwitchW1.width, game.SwitchW1.height)
                    
                    } else if (game.basictheme == true) {
                        game.DrawSwitch(unlock)
                    }
                },)

                levels[game.currentLevel].finishAreas.forEach(function(finishArea) {
                    game.DrawFinish(finishArea)
                },)

                /*levels[game.currentLevel].changeDirectionSquares.forEach(function(changeDirectionSquare) {
                    game.DrawChangeDirectionSquare(changeDirectionSquare)
                },)*/
                
                levels[game.currentLevel].walls.forEach(function(wall){
                    if (wall.drawLast && game.shopWorld1 == false){
                    game.DrawWall(wall)
                    }
                },)

                levels[game.currentLevel].teleporters.forEach(function(teleporter) {
                    teleporter.Draw()
                })

                levels[game.currentLevel].players.forEach(function(player) {
                    if (game.BlueCubeStyle == true) {
                    game.context.drawImage(game.BlueCube, 0, 0, game.BlueCube.width, game.BlueCube.height, player.x, player.y, player.width, player.height)
                    }
                    else if (game.BlueCubeAlienStyle == true) {
                    game.context.drawImage(game.BlueCubeAlien, 0, 0, game.BlueCubeAlien.width, game.BlueCubeAlien.height, player.x, player.y, game.BlueCubeAlien.width, game.BlueCubeAlien.height)
                    }    
                },)

                levels[game.currentLevel].boxes.forEach(function(box){
                    game.context.drawImage(game.RedCube, 0, 0, game.RedCube.width, game.RedCube.height, box.x, box.y, box.width, box.height)
                },)
                
                levels[game.currentLevel].walls.forEach(function(wall){
                    if (!wall.drawLast || wall.drawLast && game.shopWorld1 == true){
                    game.DrawWall(wall)
                    }
                },)

                game.DrawFreeplayLevel()

            } else if (game.gameState == GameState.Rules && game.gameMode == GameMode.StoryMode) {
                game.DrawRules() 
            
            } else if (game.gameState == GameState.Menu) {
                game.selector.Draw()
                game.DrawMenu()
            
            } else if (game.gameState == GameState.NotStarted){
                game.DrawTitleSrceen()
                game.DrawLogo()
                
           }
        }
    }, 
    
    DrawMenu: function(){
        game.context.font = '150px Arial'
        game.context.fillStyle = 'lime'
        game.context.fillText("Story Mode", 30, 145)
        game.context.font = '130px Arial'
        game.context.fillStyle = 'yellowgreen'
        game.context.fillText("Freeplay", 160, 350)
        game.context.font = '80px Arial'
        game.context.fillStyle = 'yellow'
        game.context.fillText("Shop (Coming Soon)", 50, 530)

    },
   
    DrawRules: function(){
        game.context.font = "175px Arial";
        game.context.fillStyle = 'purple'
        game.context.fillText("Rules", 175, 175);
        game.context.font = '45px Arial';
        game.context.fillStyle = 'darkblue'
        game.context.fillText("Get to the pink to beat levels", 125, 275);
        game.context.fillText("Watch out for enemies", 175, 375);
        game.context.font = '60px Arial';
        game.context.fillStyle = 'blue'
        game.context.fillText("Press Space to Continue", 85, 550);
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
        if (game.currentLevel < 5) {
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
        if (game.gameState == GameState.Rules && game.gameMode == GameMode.Freeplay){
        game.context.font = '125px Arial';
        game.context.fillStyle = "rgba(255, 255, 132, 0.788)";
        game.context.fillText("Level " + (game.currentLevel + 1), 225, 575);
        }
    },

    DrawWall: function(wall){
        if (wall.allowMovement && game.basictheme) {
           game.context.fillStyle = wall.color2
           game.context.fillRect(wall.x, wall.y, wall.width, wall.height)
        
        } else if (game.shopWorld1) {
            var i = 0; 
            for (var x = wall.left(); x < wall.right(); x = x + 50) {
                for (var y = wall.top(); y < wall.bottom(); y = y + 50) {
                    i++
                    if (wall.randomList[i]  % 30 == 0)
                        game.context.drawImage(game.WallGrassV3, 0, 0, game.WallGrassV3.width, game.WallGrassV3.height, x - 2, y - 2, game.WallGrassV3.width, game.WallGrassV3.height) 
                    else if (wall.randomList[i]  % 10 == 0)
                        game.context.drawImage(game.WallGrassV2, 0, 0, game.WallGrassV2.width, game.WallGrassV2.height, x - 2, y - 2, game.WallGrassV2.width, game.WallGrassV2.height) 
                    else
                        game.context.drawImage(game.WallGrassV1, 0, 0, game.WallGrassV1.width, game.WallGrassV1.height, x - 2, y - 2, game.WallGrassV1.width, game.WallGrassV1.height) 
                        
                }
                }
        } else if (game.basictheme) {
            game.context.fillStyle = wall.color1
            game.context.fillRect(wall.x, wall.y, wall.width, wall.height)
            
        }
    },

    DrawChangeDirectionSquare: function(changeDirectionSquare){
        game.context.fillStyle = changeDirectionSquare.color1
        game.context.fillRect(changeDirectionSquare.x, changeDirectionSquare.y, changeDirectionSquare.width, changeDirectionSquare.height)
    },

    DrawSwitch: function(unlock){
        game.context.fillStyle = unlock.color1
        game.context.fillRect(unlock.x, unlock.y, unlock.width, unlock.height)
        if (unlock.activated) {
            game.context.fillStyle = unlock.activatedcolor
         } else {
             game.context.fillStyle = unlock.color2    
         }
        game.context.fillRect(unlock.x + 10, unlock.y + 10, 30, 30)
    },

    DrawFinish: function(finishArea){
        // Finish
        game.context.fillStyle = finishArea.color1;
        game.context.fillRect(finishArea.x, finishArea.y, finishArea.width, finishArea.height)
    }
}

function Loaded(){
    game.canvas = document.getElementById("mycanvas");
    game.context = game.canvas.getContext("2d")
    ///
    game.WallGrassV1.src = "WallGrassV1.png";
    game.WallGrassV2.src = "WallGrassV2.png";
    game.WallGrassV3.src = "WallGrassV3.png";
    ///
    game.BlueCube.src = "BlueCube.png";
    game.BlueCubeAlien.src = "BlueCubeAlien.png";
    ///
    game.RedCube.src = "RedCube.png";
    //game.RedCube.src = "RedCubeW1.png";
    ///
    game.Teleporter.src = "Teleporter.png";
    ///
    game.SwitchW1.src = "SwitchW1.png";
    ///
    window.setTimeout(game.mainLoop, 100)    
}

function Keydown(event){
    
    // Start Game "Menu"
    if(event.key == " " && game.gameState == GameState.NotStarted || event.key == "Enter" && game.gameState == GameState.NotStarted) {
        game.gameState = GameState.Menu
        return
    }

    // Down "Menu"
    if(event.keyCode==40 && game.selector.y<400 && game.gameState == GameState.Menu || event.key=="s" && game.selector.y<400 && game.gameState == GameState.Menu)
        game.selector.moveDown()


    // Up "Menu"
    if(event.keyCode==38 && game.selector.y !=0 && game.gameState == GameState.Menu || event.key=="w" &&  game.selector.y !=0 && game.gameState == GameState.Menu)
        game.selector.moveUp()

    if(event.key == " " && game.gameState == GameState.Menu || event.key == "Enter"  && game.gameState == GameState.Menu) {
        game.selector.update()
        return
    }
    // Down "Freeplay"   
    if(event.keyCode==40 && game.currentLevel <5 && game.gameState == GameState.Rules && game.gameMode == GameMode.Freeplay || event.key=="s" && game.currentLevel <5 && game.gameState == game.gameState == GameState.Rules && game.gameMode == GameMode.Freeplay)
        game.currentLevel = game.currentLevel + 1

    // Up "Freeplay"
    if(event.keyCode==38 && game.currentLevel !=0 && game.gameState == GameState.Rules && game.gameMode == GameMode.Freeplay || event.key=="w" &&  game.currentLevel !=0 && game.gameState == GameState.Rules && game.gameMode == GameMode.Freeplay)
        game.currentLevel = game.currentLevel - 1
    
    if(event.key == "Backspace" && game.gameState <= 2 && game.gameState > 0 || event.key == "Backspace" && game.gameState == 3 && game.gameMode == GameMode.Freeplay) {
    game.gameState = game.gameState - 1
    game.currentLevel = 0,
    
    levels[game.currentLevel].boxes.forEach(function(box) {
        box.resetPosition() 
    })
    levels[game.currentLevel].players.forEach(function(player) {
        player.resetPosition()
    })
    levels[game.currentLevel].unlocks.forEach(function(unlock) {
        unlock.unlockWall.allowMovement = false
        unlock.activated = false    
    })

    return
    }

    // Rules to Game
    if(event.key == " " && game.gameState == GameState.Rules || event.key == "Enter" && game.gameState == GameState.Rules) {
        game.gameState = GameState.Started
        return
    }
    
    // Next Level
    if(event.key == " " && game.gameState == GameState.WonStage || event.key == "Enter" && game.gameState == GameState.WonStage) {
        game.NextLevel()
    }
    
    // Restart Game
    if(event.key==" " && game.gameState == GameState.Lost || event.key == "Enter" && game.gameState == GameState.Lost)
        game.Restart()
    
    if(game.gameState != GameState.Started){
        return
    }

    //console.log('key pressed/')
        // "Right" Arrow /// "d" Key (Right)
    levels[game.currentLevel].players.forEach(function(player) {    
        if(event.keyCode==39 && player.x<800 || event.key=="d" && player.x<800)
        player.moveRight()
    })
    
        // "Down" Arrow / "s" Key (Down)
    levels[game.currentLevel].players.forEach(function(player) {    
        if(event.keyCode==40 && player.y<550 || event.key=="s" && player.y<550)
        player.moveDown()
    })
    
        // "Up" Arrow / "w" Key (Up)
        levels[game.currentLevel].players.forEach(function(player) {    
        if(event.keyCode==38 && player.y != 0 || event.key=="w" && player.y !=0)
        player.moveUp()
    })
    
        // "Left" Arrow / "a" Key (Left)
    levels[game.currentLevel].players.forEach(function(player) {
        if(event.keyCode==37 && player.x != 0 || event.key=="a" && player.x != 0)
        player.moveLeft()
    })
        
}

document.addEventListener('DOMContentLoaded', Loaded )
document.addEventListener('keydown', Keydown )