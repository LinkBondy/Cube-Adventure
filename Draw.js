"use strict";
const {gameMode, startingMenusStates, storyModeStates, ShopMode, PlayerStyles, BackgroundStyles, cubeStyle, gameStates, levelTools} = require('./GameData');
const {canvas} = require('./Canvas')
const {images} = require('./Images');
export var draw = {
    blueCubeWoodenLock: true,
    blueCubeSadLock: true,
    blueCubeAlienLock: true,
    spriteStyle: true,
    plasticStyle: false,
    DrawImage: function(image, x, y) {
        canvas.context.drawImage(image, 0, 0, image.width, image.height, x, y, image.width, image.height)
    },
    DrawGame: function() {
        gameStates.background.DrawBackround()
        if (gameStates.currentStartingMenusState === startingMenusStates.Selected) {
            if (gameStates.currentGameMode === gameMode.StoryMode)
                this.StoryModeDraw()

            if (gameStates.currentGameMode === gameMode.Shop)
                this.ShopDraw()

            if (gameStates.currentGameMode === gameMode.ItemsInfo)
                gameStates.infoController.Draw()

            /*if (gameStates.currentGameMode === gameMode.Settings)
                this.SettingsDraw()*/
        } else {
            if (gameStates.currentStartingMenusState === startingMenusStates.NotStarted)
                this.StartingSreenDraw()
            if (gameStates.currentStartingMenusState === startingMenusStates.Menu)
                gameStates.menuController.MainMenu.Draw()
        }
        gameStates.background.DrawToolBar()
        if (gameStates.currentStoryModeState === storyModeStates.Playing || gameStates.currentStoryModeState === storyModeStates.Paused)
        draw.DrawImage(images.MenuButton, 900, 475)
        else if (gameStates.currentStoryModeState !== storyModeStates.Lost && gameStates.currentStoryModeState !== storyModeStates.WonStage && gameStates.currentStartingMenusState !== startingMenusStates.NotStarted)
        draw.DrawImage(images.BackButton, 900, 475)
    },
    StoryModeDraw: function() {
        if (gameStates.currentStoryModeState === storyModeStates.Playing || gameStates.currentStoryModeState === storyModeStates.Paused || gameStates.currentStoryModeState === storyModeStates.Selecting && gameStates.levelController.CheckLocked()) {
            this.LevelsDraw()
        }

        if (gameStates.currentStoryModeState === storyModeStates.Selecting)
            this.DrawSelectLevel()
            //this.DrawRules()

        if (gameStates.currentStoryModeState === storyModeStates.WonStage) {
            gameStates.menuController.WinMenu.Draw()
            this.DrawFinishText()
            return
        }
            
        if (gameStates.currentStoryModeState === storyModeStates.Lost) {
            if (levelTools.loseCounterStop === false) {
                levelTools.currentLosses = levelTools.currentLosses + 1
                if (levelTools.currentLosses === 50) {
                    draw.blueCubeSadLock = false
                }
                levelTools.loseCounterStop = true
            }   
            gameStates.menuController.LoseMenu.Draw()
            this.DrawLoseText()

        }

        if (gameStates.currentStoryModeState === storyModeStates.Paused) {
            canvas.context.fillStyle = "rgba(128, 128, 128, 0.6)"
            canvas.context.fillRect(0, 0, 850, 600)
            gameStates.menuController.PauseMenu.Draw()
        }
    },      
    ShopDraw: function() {
        if (gameStates.currentShopMode === ShopMode.ShopMenu)
            gameStates.menuController.ShopMenu.Draw()
        
        if (gameStates.currentShopMode === ShopMode.Backround) {
            if (gameStates.currentBackgroundStyle === BackgroundStyles.Plastic) {
                this.DrawBackroundPlasticShop()   
            }

            if (gameStates.currentBackgroundStyle === BackgroundStyles.Sprite) {
                this.DrawBackroundSpriteShop()   
            }
        }

            if (gameStates.currentShopMode === ShopMode.Player) {
                if (gameStates.currentPlayerStyle === PlayerStyles.BlueCube) {
                    this.DrawBlueCubeShop()   
                }
                    
                if (gameStates.currentPlayerStyle === PlayerStyles.BlueCubeAlien) {
                    this.DrawBlueCubeAlienShop()   
                }
                    
                if (gameStates.currentPlayerStyle === PlayerStyles.BlueCubeLava) {
                    this.DrawBlueCubeLavaShop()   
                }
                
                if (gameStates.currentPlayerStyle === PlayerStyles.BlueCubeWooden) {
                    this.DrawBlueCubeWoodenShop()   
                }
                
                if (gameStates.currentPlayerStyle === PlayerStyles.BlueCubeSad) {
                    this.DrawBlueCubeSadShop()   
                }
            }

            if (gameStates.mobile && (gameStates.currentShopMode === ShopMode.Player || gameStates.currentShopMode === ShopMode.Backround)) {
                draw.DrawImage(images.UpArrowShop, 10, 450)
                draw.DrawImage(images.DownArrowShop, 690, 450)
            }
    },
    StartingSreenDraw: function() {
        canvas.context.font = '275px Arial';
        canvas.context.fillStyle = 'black'
        canvas.context.fillText("CUB", 0, 250);
        canvas.context.font = '125px Arial';
        canvas.context.fillStyle = 'red'
        canvas.context.fillText("Adventure", 120, 400);
        canvas.context.font = '60px Arial';
        canvas.context.fillStyle = 'darkred'
        canvas.context.fillText("Press Space to Begin", 120, 550);
        ///
        canvas.context.fillStyle = "black"
        canvas.context.fillRect(600, 50, 200, 200)
        canvas.context.fillStyle = "lightgray"
        canvas.context.fillRect(600 + 20, 50 + 40, 40, 40)
        canvas.context.fillRect(600 + 140, 50 + 40, 40, 40)
        canvas.context.fillRect(600 + 20, 50 + 130, 160, 40)
    },
    LevelsDraw: function() {
        canvas.context.save()
        canvas.context.translate(0 - 850 * (gameStates.CurrentLevel().currentX - 1), 0 - 600 * (gameStates.CurrentLevel().currentY - 1))
        gameStates.CurrentLevel().waters.forEach(function(water) {
            water.Draw()
        },)

        gameStates.CurrentLevel().finishAreas.forEach(function(finishArea) {
            finishArea.Draw()
        },)

        gameStates.CurrentLevel().holes.forEach(function(hole) {  
            hole.Draw()
        },)

        gameStates.CurrentLevel().unlocks.forEach(function(unlock) {
            unlock.Draw()
        },)

        gameStates.CurrentLevel().teleporters.forEach(function(teleporter) {
            teleporter.Draw()
        })

        gameStates.CurrentLevel().items.forEach(function(item) {
            item.Draw()
        })

        gameStates.CurrentLevel().rocks.forEach(function(rock) {  
            rock.Draw()
        },)

        /*gameStates.CurrentLevel().changeDirectionSquares.forEach(function(changeDirectionSquare) {
            changeDirectionSquare.Draw()
        },)*/

        gameStates.CurrentLevel().players.forEach(function(player) {
            player.Draw()        
        },)

        gameStates.CurrentLevel().enemies.forEach(function(enemy) {
            enemy.Draw()
        },)
        
        gameStates.CurrentLevel().walls.forEach(function(wall) {
            wall.Draw()
        },)
        canvas.context.restore()
    },
    DrawRules: function() {
        canvas.context.font = "175px Arial";
        canvas.context.fillStyle = 'purple'
        canvas.context.fillText("Rules", 200, 175);
        ///
        canvas.context.font = '45px Arial';
        canvas.context.fillStyle = 'rgb(2, 0, 139)'
        canvas.context.fillText("Get to the pink to beat levels", 150, 275);
        canvas.context.fillText("Watch out for enemies", 200, 350);
        if (!gameStates.mobile) {
            canvas.context.fillText("Use A, W, S, D or Arrow Keys to move", 50, 425);
        }
        else if (gameStates.mobile) {
            canvas.context.font = '35px Arial';
            canvas.context.fillText("Tap above, below, to the left or to the right to move", 35, 415);
        }
        canvas.context.font = '75px Arial';
        canvas.context.fillStyle = 'blue'
        canvas.context.fillText("Press space to start", 80, 550);
    }, 
    DrawFinishText: function() {
        canvas.context.font = '88px Arial';
        canvas.context.fillStyle = 'red' 
        canvas.context.fillText("Level " + (gameStates.currentLevelIndex + 1) + " Complete!", 60, 100); 
    },
    DrawLoseText: function() {
        canvas.context.font = '130px Arial';
        canvas.context.fillStyle = "darkorchid";
        canvas.context.fillText("You Lose", 10, 120);
        canvas.context.font = '75px Arial';
        canvas.context.fillStyle = "darkmagenta";
        canvas.context.fillText("Losses", 575, 75);
        canvas.context.fillText((levelTools.currentLosses), 675, 150);
    },
    DrawSelectLevel: function() {
        canvas.context.font = '125px Arial';
        canvas.context.fillStyle = "rgba(255, 255, 132, 0.788)";
        canvas.context.fillText("Level " + (gameStates.currentLevelIndex + 1), 225, 575);
        if (!gameStates.levelController.CheckLocked()) {
            canvas.context.font = '175px Arial';
            canvas.context.fillStyle = "rgba(255, 255, 132)";
            canvas.context.fillText("Locked", 10, 275);
            draw.DrawImage(images.LockedIcon, 562.5, 10)
        }
        if (gameStates.mobile === true) {
            draw.DrawImage(images.UpArrow, 10, 450)
            draw.DrawImage(images.DownArrow, 690, 450)
        }
        
    },
    DrawBackroundSpriteShop: function() {
        draw.DrawImage(images.WallGrassV1_400x400, 225, 20)
        if (draw.spriteStyle) {
            if (gameStates.mobile === true) {
                canvas.context.font = '75px Arial'
                canvas.context.fillStyle = 'indianred'
                canvas.context.fillText("Sprite(Selected)", 155, 550)  
            }

            else {
                canvas.context.font = '100px Arial'
                canvas.context.fillStyle = 'indianred'
                canvas.context.fillText("Sprite(Selected)", 65, 550)  
            }
        }  
        
        else {
        canvas.context.font = '175px Arial'
        canvas.context.fillStyle = 'indianred'
        canvas.context.fillText("Sprite", 190, 550)
        }

    },
    DrawBackroundPlasticShop: function() {
        canvas.context.fillStyle = "rgb(190, 190, 190)"
        canvas.context.fillRect(225, 20, 400, 400)
        if (draw.plasticStyle) {
            if (gameStates.mobile === true) {
                canvas.context.font = '75px Arial'
                canvas.context.fillStyle = 'indianred'
                canvas.context.fillText("Plastic", 300, 500)
                canvas.context.fillText("(Selected)", 250, 575)  
            }

            else {
                canvas.context.font = '100px Arial'
                canvas.context.fillStyle = 'indianred'
                canvas.context.fillText("Plastic(Selected)", 50, 550)   
            }
                 
        }
        else {
            canvas.context.font = '175px Arial'
            canvas.context.fillStyle = 'indianred'
            canvas.context.fillText("Plastic", 165, 575)
        }    
    },
    DrawBlueCubeShop: function() {
        draw.DrawImage(images.BlueCube_400x400, 225, 25)
        if (gameStates.currentCubeStyle === cubeStyle.BlueCube) {
            if (gameStates.mobile === true) {
                canvas.context.font = '75px Arial'
                canvas.context.fillStyle = 'indianred'
                canvas.context.fillText("Classic", 300, 500)
                canvas.context.fillText("(Selected)", 250, 575)
            }

            else {
                canvas.context.font = '100px Arial'
                canvas.context.fillStyle = 'indianred'
                canvas.context.fillText("Classic(Selected)", 35, 550)  
            }
                
        }
        else {
        canvas.context.font = '150px Arial'
        canvas.context.fillStyle = 'indianred'
        canvas.context.fillText("Classic", 175, 550)
        }

    },
    DrawBlueCubeAlienShop: function() {
        if (draw.blueCubeAlienLock === false) {
            draw.DrawImage(images.BlueCubeAlien_400x400, 225, 25)
        }
        if (gameStates.currentCubeStyle === cubeStyle.Alien && draw.blueCubeAlienLock === false) {
            if (gameStates.mobile === true) {
                canvas.context.font = '75px Arial'
                canvas.context.fillStyle = 'indianred'
                canvas.context.fillText("Alien(Selected)", 175, 550)
            }

            else {
                canvas.context.font = '100px Arial'
                canvas.context.fillStyle = 'indianred'
                canvas.context.fillText("Alien(Selected)", 85, 550)
            }      
        }

        else if (draw.blueCubeAlienLock === true) {
            canvas.context.font = '90px Arial'
            canvas.context.fillStyle = 'hotpink'
            canvas.context.fillText("Get the Three Bead", 25, 100)
            canvas.context.fillText("to unlock", 245, 225)
        }

        if (gameStates.currentCubeStyle !== cubeStyle.Alien) {
            canvas.context.font = '150px Arial'
            canvas.context.fillStyle = 'indianred'
            canvas.context.fillText("Alien", 260, 550)
        }
    },
    DrawBlueCubeLavaShop: function() {
        draw.DrawImage(images.BlueCubeLava_400x400, 225, 25)
        if (gameStates.currentCubeStyle === cubeStyle.Lava) {
            if (gameStates.mobile === true) {
                canvas.context.font = '75px Arial'
                canvas.context.fillStyle = 'indianred'
                canvas.context.fillText("Lava(Selected)", 175, 550)
            }

            else {
                canvas.context.font = '100px Arial'
                canvas.context.fillStyle = 'indianred'
                canvas.context.fillText("Lava(Selected)", 87, 550)
            }      
        }
        else {
            canvas.context.font = '150px Arial'
            canvas.context.fillStyle = 'indianred'
            canvas.context.fillText("Lava", 260, 550)
        }
   
    },
    DrawBlueCubeWoodenShop: function() {
        if (draw.blueCubeWoodenLock === false) {
            draw.DrawImage(images.BlueCubeWooden_400x400, 225, 25)
        }

        if (gameStates.currentCubeStyle === cubeStyle.Wooden && draw.blueCubeWoodenLock === false) {
            if (gameStates.mobile === true) {
                canvas.context.font = '75px Arial'
                canvas.context.fillStyle = 'indianred'
                canvas.context.fillText("Wooden", 280, 500)
                canvas.context.fillText("(Selected)", 250, 575)
            }

            else {
            canvas.context.font = '100px Arial'
            canvas.context.fillStyle = 'indianred'
            canvas.context.fillText("Wooden(Selected)", 10, 550)
            }      
        }
        else if (draw.blueCubeWoodenLock === true) {
            canvas.context.font = '75px Arial'
            canvas.context.fillStyle = 'hotpink'
            canvas.context.fillText("Find the tree to unlock", 50, 100)
            
            if (gameStates.mobile === true) {
                canvas.context.font = '125px Arial'
                canvas.context.fillStyle = 'indianred'
                canvas.context.fillText("Wooden", 195, 550)
            }
            else {
                canvas.context.font = '150px Arial'
                canvas.context.fillStyle = 'indianred'
                canvas.context.fillText("Wooden", 140, 550)
            }
        }
            
        else {
            canvas.context.font = '150px Arial'
            canvas.context.fillStyle = 'indianred'
            canvas.context.fillText("Wooden", 140, 550)
        }
   
    },
    DrawBlueCubeSadShop: function() {
        if (draw.blueCubeSadLock === false) {
            draw.DrawImage(images.BlueCubeSad_400x400, 225, 25)
        }

        if (gameStates.currentCubeStyle === cubeStyle.Sad && draw.blueCubeSadLock === false) {
            if (gameStates.mobile === true) {
                canvas.context.font = '75px Arial'
                canvas.context.fillStyle = 'indianred'
                canvas.context.fillText("Sad(Selected)", 180, 550)
            }

            else {
            canvas.context.font = '100px Arial'
            canvas.context.fillStyle = 'indianred'
            canvas.context.fillText("Sad(Selected)", 120, 550)
            }      
        }
        else if (draw.blueCubeSadLock === true) {
            canvas.context.font = '300px Arial'
            canvas.context.fillStyle = 'hotpink'
            canvas.context.fillText("???", 175, 350)
        }
            
        else {
            canvas.context.font = '150px Arial'
            canvas.context.fillStyle = 'indianred'
            canvas.context.fillText("Sad", 285, 550)
        }
   
    },
    //SettingsDraw: function() {},
}