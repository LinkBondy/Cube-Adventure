"use strict";
console.log("LoadedMain")

const { levels } = require('./Levels')

const {
    Backround,
    Player,
    CubeStyle
} = require('./Class')

const {
    InfoController
} = require ('./ItemInfo')

const {
    images
 } = require('./Images');

const {
    Keydown
} = require('./Keydown')

const {
    MouseDown
} = require ('./MouseDown')
const {
    MainMenu, ShopMenu, LoseMenu, WinMenu, PauseMenu 
} = require('./Menu')

const {
    GameMode, GameState, ShopMode, PlayerShop, BackgroundShop
} = require('./GameData')

var audio = {
    //MusicW1: new Audio(),

    SetMusic: function() {
        /*if (game.gameState === GameState.Started)
            audio.MusicW1.play();
        else
            audio.MusicW1.pause();
            */
    }
}

export var game = {
    canvas: undefined,
    context: undefined,
    startTime: new Date(),
    spriteStyle: true,
    plasticStyle: false,
    isRunning: true,
    lastTime: new Date().getTime(),
    ///
    gameState: GameState.NotStarted,
    gameMode: GameMode.StoryMode,
    shopMode: ShopMode.ShopMenu,
    backgroundShop: BackgroundShop.Sprite,
    playerShop: PlayerShop.BlueCube,
    /// 
    loseCounterStop: false,
    currentLevel: 0,
    oldLevel: undefined,
    currentLosses: 0,
    mobile: false,
    winStop: false,
    backround: new Backround(),
    SetGameState: function(gameState) {
        game.gameState = gameState
    },

    Restart: function() {
        levels[game.currentLevel].enemies.forEach(function(enemy) {
            enemy.reset() 
        })

        levels[game.currentLevel].players.forEach(function(player) {
            player.reset()
        })

        levels[game.currentLevel].unlocks.forEach(function(unlock) {
            unlock.activated = false    
        })

        levels[game.currentLevel].rocks.forEach(function(rock) {
            rock.allowMovement = false
        })

        levels[game.currentLevel].holes.forEach(function(hole) {
            hole.reset()
        })

        levels[game.currentLevel].items.forEach(function(item) {
            item.reset()
        })

        levels[game.currentLevel].changeDirectionSquares.forEach(function(changeDirectionSquare) {
            changeDirectionSquare.reset()
        })
    },

    Save: function() {
        if (game.gameMode === GameMode.StoryMode) 
            window.localStorage.setItem('level', this.currentLevel)
        if (game.infoController.unlockedLevel !== levels.length) 
            window.localStorage.setItem('isMax', true)        
        window.localStorage.setItem('stateGame', game.gameState)
        window.localStorage.setItem('PlayerAlienLock', images.blueCubeAlienLock)
        window.localStorage.setItem('PlayerWoodenLock', images.blueCubeWoodenLock)
        window.localStorage.setItem('PlayerSadLock', images.blueCubeSadLock)
        window.localStorage.setItem('StyleCube', Player.CubeStyle)
        window.localStorage.setItem('styleSprite', this.spriteStyle)
        window.localStorage.setItem('stylePlastic', this.plasticStyle)
    },

    Load: function() {
        var level = Number(window.localStorage.getItem('level'))
        var stateGame = Number(window.localStorage.getItem('stateGame'))
        if (level !== null) {
            this.currentLevel = level
            if (stateGame === GameState.WonStage) {
                this.currentLevel++
            }
        }
       
        var WoodenLock = window.localStorage.getItem('PlayerWoodenLock')
        if (WoodenLock !== null) {
            if (WoodenLock === 'true')
                WoodenLock = true

            if (WoodenLock === 'false')
                WoodenLock = false

            images.blueCubeWoodenLock = WoodenLock
        }

        var SadLock = window.localStorage.getItem('PlayerSadLock')
        if (SadLock !== null) {
            if (SadLock === 'true') 
                SadLock = true
            
            if (SadLock === 'false')
                SadLock = false
            
            images.blueCubeSadLock = SadLock
        }

        var AlienLock = window.localStorage.getItem('PlayerAlienLock')
        if (AlienLock !== null) {
            if (AlienLock === 'true') 
                AlienLock = true
            
            if (AlienLock === 'false')
                AlienLock = false
            
            images.blueCubeAlienLock = AlienLock
        }

        var styleSprite = window.localStorage.getItem('styleSprite')
        if (styleSprite !== null) {
            if (styleSprite === 'true')
                styleSprite = true

            if (styleSprite === 'false') 
                styleSprite = false

            this.spriteStyle = styleSprite
        }

        var stylePlastic = window.localStorage.getItem('stylePlastic')
        if (stylePlastic !== null) {
            if (stylePlastic === 'true')
                stylePlastic = true

            if (stylePlastic === 'false')
                stylePlastic = false

            this.plasticStyle = stylePlastic
        }

        var StyleCube = Number(window.localStorage.getItem('StyleCube'))
        if (StyleCube !== null) {
            Player.CubeStyle = StyleCube
        }
        if (window.localStorage.getItem('isMax') === null) {
        game.infoController.unlockedLevel = levels.length
        } else
        game.infoController.unlockedLevel = this.currentLevel 
    },

    NextLevel: function() {
        game.Restart()
        if (game.infoController.unlockedLevel !== levels.length)
            game.infoController.unlockedLevel++
        if (game.currentLevel === (levels.length - 1)) {
            game.currentLevel = 0
            game.Save()
            game.Restart()
            game.SetGameState(GameState.NotStarted)
        } else {
            game.winStop = true
            game.currentLevel++
            game.Save()
            game.Restart()
            game.SetGameState(GameState.Started)
            game.winStop = false
        }

    },

    mainLoop: function() {
        var timePassed = new Date().getTime() - game.lastTime
        game.lastTime = new Date().getTime()
        if (!game.isRunning)
            timePassed = 0
        //console.log('timePassed is: ', timePassed)
        var delta = 1 /*timePassed/20*/
        //console.log(delta)
        //if (delta > 1)
        //delta = 1
        game.update(delta)
        game.Draw()
        if (game.checkWin() && game.gameState !== GameState.WonStage ) {
            setTimeout(function() {
                if (game.gameMode === GameMode.StoryMode) {
                    game.SetGameState(GameState.WonStage)
                } else {
                    game.Restart()
                    game.currentLevel = game.oldLevel
                    game.SetGameState(GameState.Rules)
                    game.Restart()
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
        //window.requestAnimationFrame(game.mainLoop)
    },

    update: function(delta) {
        game.Save()
        if  (game.gameState === GameState.Started && game.gameMode === GameMode.StoryMode || game.gameState === GameState.Started && game.gameMode === GameMode.Freeplay) {
            levels[game.currentLevel].enemies.forEach(function(enemy) {
                enemy.update(delta)
            })
            levels[game.currentLevel].players.forEach(function(player) {
                player.update(delta)
            })
            levels[game.currentLevel].unlocks.forEach(function(unlock) {
                unlock.update(delta)
            })
            levels[game.currentLevel].holes.forEach(function(hole) {
                hole.update(delta)
            })
            levels[game.currentLevel].items.forEach(function(item) {
                item.update(delta)
            })
            levels[game.currentLevel].teleporters.forEach(function(teleporter) {
                teleporter.update(delta)
            })
        }
    },

    checkWin: function() {
        var win = false
        levels[game.currentLevel].players.forEach(function(player) {
            levels[game.currentLevel].finishAreas.forEach(function(finishArea) {
                if (finishArea.intersects(player)) {  
                    win = true
                } 
            })
        })
        return win 
    },

    checkLose: function() {
        var lose = false
        levels[game.currentLevel].players.forEach(function(player) {
            levels[game.currentLevel].enemies.forEach(function(enemy) {
                if (player.intersects(enemy)) {
                    lose = true
                }
            })
            levels[game.currentLevel].holes.forEach(function(hole) {
                if (player.intersectsAll(hole) && hole.fullHole) {
                    lose = true
                }
            })
        })
            
        return lose
    },

    Draw: function() {
        game.backround.Draw()
        if (game.gameState === GameState.WonStage) {
            WinMenu.Draw()
            game.DrawFinishText()
            return
        }
            
        if (game.gameState === GameState.Lost && game.gameMode === GameMode.StoryMode) {
            if (game.loseCounterStop === false) {
                game.currentLosses = game.currentLosses + 1
                if (game.currentLosses === 50) {
                    images.blueCubeSadLock = false
                }
                game.loseCounterStop = true
            }   
            LoseMenu.Draw()
            game.DrawLoseText()

        }

        if (game.gameState === GameState.Started && game.gameMode < 3 || game.gameState === GameState.Rules && game.gameMode === GameMode.Freeplay || game.gameState === GameState.Paused && game.gameMode === GameMode.StoryMode) {

            levels[game.currentLevel].waters.forEach(function(water) {
                water.Draw()
            },)

            levels[game.currentLevel].finishAreas.forEach(function(finishArea) {
                finishArea.Draw()
            },)

            levels[game.currentLevel].holes.forEach(function(hole) {  
                hole.Draw()
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

            levels[game.currentLevel].rocks.forEach(function(rock) {  
                rock.Draw()
            },)

            /*levels[game.currentLevel].changeDirectionSquares.forEach(function(changeDirectionSquare) {
                changeDirectionSquare.Draw()
            },)*/

            levels[game.currentLevel].players.forEach(function(player) {
                player.Draw()        
            },)

            levels[game.currentLevel].enemies.forEach(function(enemy) {
                enemy.Draw()
            },)
            
            levels[game.currentLevel].walls.forEach(function(wall) {
                wall.Draw()
            },)
         
        } 

        if (game.gameState === GameState.Started && game.gameMode === GameMode.Shop)  {
            if (game.shopMode === ShopMode.Backround) {
                if (game.backgroundShop === BackgroundShop.Plastic) {
                    game.DrawBackroundPlasticShop()   
                }
                if (game.backgroundShop === BackgroundShop.Sprite) {
                    game.DrawBackroundSpriteShop()   
                }

                if (game.mobile === true) {
                    images.DrawImage(images.UpArrowShop, 10, 450)
                    images.DrawImage(images.DownArrowShop, 690, 450)
                }  
            } 
            if (game.shopMode === ShopMode.Player) {
                if (game.playerShop === PlayerShop.BlueCube) {
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
                    images.DrawImage(images.UpArrowShop, 10, 450)
                    images.DrawImage(images.DownArrowShop, 690, 450)
                }
                
            }
        }
        
        if (game.gameState === GameState.Rules && game.gameMode === GameMode.StoryMode)
            game.DrawRules()
        
        if (game.gameState === GameState.Rules && game.gameMode === GameMode.Freeplay)
            game.DrawFreeplayLevel()

        if (game.gameState === GameState.Rules && game.gameMode === GameMode.ItemsInfo)
            game.infoController.Draw()

        if (game.gameState === GameState.Rules && game.gameMode === GameMode.Shop)
            ShopMenu.Draw()

        if (game.gameState === GameState.Menu)
            MainMenu.Draw()
        
        if (game.gameState === GameState.NotStarted)
            game.DrawTitleSrceen()

        if (game.gameState === GameState.Paused && game.gameMode === GameMode.StoryMode) {
            game.context.fillStyle = "rgba(128, 128, 128, 0.6)"
            game.context.fillRect(0, 0, 850, 600)
            PauseMenu.Draw()   
        }

        if (game.gameState < 3 && game.gameState > 0 && game.mobile === true) 
            images.DrawImage(images.BackButton, 750, 0) 
    },

    DrawTitleSrceen: function() {
        game.context.font = '275px Arial';
        game.context.fillStyle = 'black'
        game.context.fillText("CUB", 0, 250);
        game.context.font = '125px Arial';
        game.context.fillStyle = 'red'
        game.context.fillText("Adventure", 120, 400);
        game.context.font = '60px Arial';
        game.context.fillStyle = 'darkred'
        game.context.fillText("Press Space to Begin", 120, 550);
        ///
        game.context.fillStyle = "black"
        game.context.fillRect(600, 50, 200, 200)
        game.context.fillStyle = "lightgray"
        game.context.fillRect(600 + 20, 50 + 40, 40, 40)
        game.context.fillRect(600 + 140, 50 + 40, 40, 40)
        game.context.fillRect(600 + 20, 50 + 130, 160, 40)
    },

    DrawRules: function() {
        game.context.font = "175px Arial";
        game.context.fillStyle = 'purple'
        game.context.fillText("Rules", 200, 175);
        ///
        game.context.font = '45px Arial';
        game.context.fillStyle = 'rgb(2, 0, 139)'
        game.context.fillText("Get to the pink to beat levels", 150, 275);
        game.context.fillText("Watch out for enemies", 200, 350);
        if (!game.mobile) {
            game.context.fillText("Use A, D, S, D or Arrow Keys to move", 50, 425);
        }
        else if (game.mobile) {
            game.context.font = '35px Arial';
            game.context.fillText("Tap above, below, to the left or to the right to move", 35, 415);
        }
        game.context.font = '75px Arial';
        game.context.fillStyle = 'blue'
        game.context.fillText("Press space to start", 80, 550);
    }, 

    DrawFinishText: function() {
        game.context.font = '88px Arial';
        game.context.fillStyle = 'red' 
        game.context.fillText("Level " + (game.currentLevel + 1) + " Complete!", 60, 100); 
    },

    DrawLoseText: function() {
        game.context.font = '130px Arial';
        game.context.fillStyle = "darkorchid";
        game.context.fillText("You Lose", 10, 120);
        game.context.font = '75px Arial';
        game.context.fillStyle = "darkmagenta";
        game.context.fillText("Losses", 575, 75);
        game.context.fillText((game.currentLosses), 675, 150);
    },

    DrawFreeplayLevel: function() {
        game.context.font = '125px Arial';
        game.context.fillStyle = "rgba(255, 255, 132, 0.788)";
        game.context.fillText("Level " + (game.currentLevel + 1), 225, 575);
        if (game.mobile === true) {
            images.DrawImage(images.UpArrow, 10, 450)
            images.DrawImage(images.DownArrow, 690, 450)
        }
        
    },

    DrawBackroundSpriteShop: function() {
        images.DrawImage(images.WallGrassV1_400x400, 225, 20)
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

    DrawBackroundPlasticShop: function() {
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

    DrawBlueCubeShop: function() {
        images.DrawImage(images.BlueCube_400x400, 225, 25)
        if (Player.CubeStyle === CubeStyle.BlueCube) {
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

    DrawBlueCubeAlienShop: function() {
        if (images.blueCubeAlienLock === false) {
            images.DrawImage(images.BlueCubeAlien_400x400, 225, 25)
        }
        if (Player.CubeStyle === CubeStyle.Alien && images.blueCubeAlienLock === false) {
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

        else if (images.blueCubeAlienLock === true) {
            game.context.font = '90px Arial'
            game.context.fillStyle = 'hotpink'
            game.context.fillText("Get the Three Bead", 25, 100)
            game.context.fillText("to unlock", 245, 225)
        }

        if (Player.CubeStyle !== CubeStyle.Alien) {
            game.context.font = '150px Arial'
            game.context.fillStyle = 'indianred'
            game.context.fillText("Alien", 260, 550)
        }
    },

    DrawBlueCubeLavaShop: function() {
        images.DrawImage(images.BlueCubeLava_400x400, 225, 25)
        if (Player.CubeStyle === CubeStyle.Lava) {
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

    DrawBlueCubeWoodenShop: function() {
        if (images.blueCubeWoodenLock === false) {
            images.DrawImage(images.BlueCubeWooden_400x400, 225, 25)
        }

        if (Player.CubeStyle === CubeStyle.Wooden && images.blueCubeWoodenLock === false) {
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
        else if (images.blueCubeWoodenLock === true) {
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

    DrawBlueCubeSadShop: function() {
        if (images.blueCubeSadLock === false) {
            images.DrawImage(images.BlueCubeSad_400x400, 225, 25)
        }

        if (Player.CubeStyle === CubeStyle.Sad && images.blueCubeSadLock === false) {
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
        else if (images.blueCubeSadLock === true) {
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
}

function LoadImage(path) {
    var image = new Image()
    image.src = path
    images.stillLoading += 1
    image.onload = function() {
        images.stillLoading -= 1
    }
    return image
}

function ImageLoadingLoop() {
    if (images.stillLoading > 0) {
        window.setTimeout(ImageLoadingLoop, 1000 / 60)
    }
    else {
        game.mainLoop()
    }
}

function Loaded() {
    game.canvas = document.getElementById("mycanvas");
    game.context = game.canvas.getContext("2d")
    ///
    if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i ) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i)) {
            game.mobile = true       
    } else {
            game.mobile = false
    }
    ///
    images.WallGrassV1 = LoadImage("images/WallGrassV1.png")
    images.WallGrassV1_200x200 = LoadImage("images/WallGrassV1_200x200.png")
    images.WallGrassV1_400x400 = LoadImage("images/WallGrassV1_400x400.png")
    images.WallGrassV2 = LoadImage("images/WallGrassV2.png")
    images.WallGrassV3 = LoadImage("images/WallGrassV3.png")
    images.WallGrassTree = LoadImage("images/WallGrassTree.png")
    ///
    images.BlueCube = LoadImage("images/BlueCube.png")
    images.BlueCubeAlien = LoadImage("images/BlueCubeAlien.png")
    images.BlueCubeLava = LoadImage("images/BlueCubeLava.png")
    images.BlueCubeWooden = LoadImage("images/BlueCubeWooden.png")
    images.BlueCubeSad = LoadImage("images/BlueCubeSad.png")
    ///
    images.BlueCubePlastic = LoadImage("images/BlueCubePlastic.png")
    images.BlueCubeAlienPlastic = LoadImage("images/BlueCubeAlienPlastic.png")
    images.BlueCubeLavaPlastic = LoadImage("images/BlueCubeLavaPlastic.png")
    images.BlueCubeWoodenPlastic = LoadImage("images/BlueCubeWoodenPlastic.png")
    images.BlueCubeSadPlastic = LoadImage("images/BlueCubeSadPlastic.png")
    ///
    images.BlueCube_400x400 = LoadImage("images/BlueCube_400x400.png")
    images.BlueCubeAlien_400x400 = LoadImage("images/BlueCubeAlien_400x400.png")
    images.BlueCubeLava_400x400 = LoadImage("images/BlueCubeLava_400x400.png")
    images.BlueCubeWooden_400x400 = LoadImage("images/BlueCubeWooden_400x400.png")
    images.BlueCubeSad_400x400 = LoadImage("images/BlueCubeSad_400x400.png")
    ///
    images.RedCube = LoadImage("images/RedCube.png")
    images.RedCube_200x200 = LoadImage("images/RedCube_200x200.png")
    images.RedCubePlastic = LoadImage("images/RedCubePlastic.png")
    ///
    images.TeleporterTomato = LoadImage("images/TeleporterTomato.png")
    images.TeleporterTomatoSprite = LoadImage("images/TeleporterTomatoSprite.png")
    images.TeleporterTomatoSprite_200x200 = LoadImage("images/TeleporterTomatoSprite_200x200.png")
    images.TeleporterPurple = LoadImage("images/TeleporterPurple.png")
    images.TeleporterPurpleSprite = LoadImage("images/TeleporterPurpleSprite.png")
    ///
    images.SwitchW1Blue = LoadImage("images/SwitchW1Blue.png")
    images.SwitchW1Blue_200x200 = LoadImage("images/SwitchW1Blue_200x200.png")
    images.SwitchW1Purple = LoadImage("images/SwitchW1Purple.png")
    images.SwitchW1Purple_200x200 = LoadImage("images/SwitchW1Purple_200x200.png")
    images.SwitchW1ActivatedBlue = LoadImage("images/SwitchW1ActivatedBlue.png")
    images.SwitchW1ActivatedPurple = LoadImage("images/SwitchW1ActivatedPurple.png")
    ///
    images.InvisibleWall = LoadImage("images/InvisibleWall.png")
    images.InvisibleWallV2 = LoadImage("images/InvisibleWallV2.png")
    images.InvisibleWall_200x200 = LoadImage("images/InvisibleWall_200x200.png")
    images.InvisibleWall_200x200V2 = LoadImage("images/InvisibleWall_200x200V2.png")
    ///
    images.LifeJacket = LoadImage("images/LifeJacket.png")
    images.LifeJacket_200x200 = LoadImage("images/LifeJacket_200x200.png")
    images.LifeJacketPlastic = LoadImage("images/LifeJacketPlastic.png")
    ///
    images.Three_Bead = LoadImage("images/Three_Bead.png")
    images.Three_Bead_Plastic = LoadImage("images/Three_Bead_Plastic.png")
    ///
    images.Water_Medium2 = LoadImage("images/Water_Medium2.png")
    images.Water_Medium_200x200 = LoadImage("images/Water_Medium_200x200.png")
    ///
    images.UnlockRockPurple = LoadImage("images/UnlockRockPurple.png")
    images.UnlockRockPurple_200x200 = LoadImage("images/UnlockRockPurple_200x200.png")
    images.UnlockedRockPurple = LoadImage("images/UnlockedRockPurple.png")
    images.UnlockRockBlue = LoadImage("images/UnlockRockBlue.png")
    images.UnlockRockBlue_200x200 = LoadImage("images/UnlockRockBlue_200x200.png")
    images.UnlockedRockBlue = LoadImage("images/UnlockedRockBlue.png")
    ///
    images.Hole = LoadImage("images/Hole.png")
    images.Hole_200x200 = LoadImage("images/Hole_200x200.png")
    images.HolePlastic = LoadImage("images/HolePlastic.png")
    ///
    images.UpArrow = LoadImage("images/UpArrow.png")
    images.DownArrow = LoadImage("images/DownArrow.png")
    images.UpArrowShop = LoadImage("images/UpArrowShop.png")
    images.DownArrowShop = LoadImage("images/DownArrowShop.png")
    ///
    images.BackButton = LoadImage("images/BackButton.png")
    images.MenuButton = LoadImage("images/MenuButton.png")
    ///
    //audio.MusicW1.src = "musicName";
    ///
    game.infoController = new InfoController()
    ///
    game.Load()
    ///
    ImageLoadingLoop()
}

function handleVisibilityChange() {
    if (document.visibilityState === "hidden") {
        console.log('it is hidden')
        game.isRunning = false
    } else {
        console.log('it is showing')
        game.lastTime = new Date().getTime()
        game.isRunning = true
    }
}

document.addEventListener("visibilitychange", handleVisibilityChange, false);
document.addEventListener('DOMContentLoaded', Loaded )
document.addEventListener('keydown', Keydown)
document.addEventListener('mousedown', MouseDown)