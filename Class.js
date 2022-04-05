"use strict";
const {images} = require('./Images')
const {draw} = require('./Draw')
const {gameMode, startingMenusStates, storyModeStates, cubeStyle, gameStates} = require('./GameData')
const {canvas} = require('./Canvas')

export class GameObject {
    constructor(x, y, width, height, color1) {
       this.x = x 
       this.y = y 
       this.width = width
       this.height = height
       this.color1 = color1
    }
    intersects(otherBox) {
        // Check if the left-top point is inside otherBox
        if (this.left() >= otherBox.left() && this.left() < otherBox.right() &&
            this.top() >= otherBox.top() && this.top() < otherBox.bottom()) {
            return true
        }
        // Check if the right-top point is inside otherBox
        if (this.right() > otherBox.left() && this.right() < otherBox.right() &&
            this.top() >= otherBox.top() && this.top() < otherBox.bottom()) {
            return true
        } 
        // Check if the right-bottom point is inside otherBox
        if (this.right() > otherBox.left() && this.right() < otherBox.right() &&
            this.bottom() > otherBox.top() && this.bottom() < otherBox.bottom()) {
            return true
        }

        // Check if the left-bottom point is inside otherBox
        if (this.left() >= otherBox.left() && this.left() < otherBox.right() &&
            this.bottom() > otherBox.top() && this.bottom() < otherBox.bottom()) {
            return true
        }

        ////////////////////////

        // Check if the left-top point is inside otherBox
        if (otherBox.left() >= this.left() && otherBox.left() < this.right() &&
            otherBox.top() >= this.top() && otherBox.top() < this.bottom()) {
            return true
        }
        // Check if the right-top point is inside otherBox
        if (otherBox.right() > this.left() && otherBox.right() < this.right() &&
            otherBox.top() >= this.top() && otherBox.top() < this.bottom()) {
            return true
        }
        // Check if the right-bottom point is inside otherBox
        if (otherBox.right() > this.left() && otherBox.right() < this.right() &&
            otherBox.bottom() > this.top() && otherBox.bottom() < this.bottom()) {
            return true
        }

        // Check if the left-bottom point is inside otherBox
        if (otherBox.left() >= this.left() && otherBox.left() < this.right() &&
            otherBox.bottom() > this.top() && otherBox.bottom() < this.bottom()) {
            return true
        }
        
        return false
    }
    intersectsAll(otherBox) {
        // Check if the left-top point is inside otherBox
        if (this.left() === otherBox.left() && this.top() === otherBox.top()) { 
          return true
        }
        return false
    }
    left() {
        return this.x
    } 
    right() {
        return this.x + this.width
    } 
    top() {
        return this.y
    } 
    bottom() {
        return this.y + this.height
    }
};

export class Background {
    constructor( color1) {
        this.color1 = color1
    }
    
    Draw() {
        if ((gameStates.currentStoryModeState === storyModeStates.Playing || gameStates.currentStoryModeState === storyModeStates.Paused || gameStates.currentStoryModeState === storyModeStates.Selecting) && gameStates.currentGameMode === gameMode.StoryMode && gameStates.currentStartingMenusState === startingMenusStates.Selected && draw.spriteStyle) {
            this.color1 = "rgb(100, 200, 100)"
        }
        else {
            this.color1 = "lightgray"
        }
        canvas.context.clearRect(0, 0, canvas.width, canvas.height);
        canvas.context.fillStyle = this.color1;
        canvas.context.fillRect(0,0, canvas.width, canvas.height) 
    }

};

export class Enemy extends GameObject {
    constructor(x, y, width, height, movesLeft, movesRight, movesUp, movesDown, block_speed) {
        super(x, y, width, height)
        this.forward_x = true
        this.forward_y = false
        this.block_speed = block_speed
        this.original_x = x
        this.original_y = y
        this.movesLeft = movesLeft
        this.movesRight = movesRight
        this.movesUp = movesUp
        this.movesDown = movesDown
        this.originalMovesLeft = this.movesLeft
        this.originalMovesRight = this.movesRight
        this.originalMovesUp = this.movesUp
        this.originalMovesDown = this.movesDown
        this.original_block_speed = block_speed
        this.inWater = undefined
        this.stopHole = false
    }
   
    reset() {
        this.x = this.original_x 
        this.y = this.original_y
        this.movesLeft = this.originalMovesLeft  
        this.movesRight = this.originalMovesRight  
        this.movesUp = this.originalMovesUp
        this.movesDown = this.originalMovesDown 
        this.block_speed = this.original_block_speed
        this.inWater = undefined
    }  
    update(delta) {
        var oldX = this.x
        var oldY = this.y
        var intersectsWall = false
        var intersectsWater = false
        var self = this
            if (this.movesLeft && this.movesRight || this.movesUp && this.movesDown) {
                var chooseMovement = Math.floor(Math.random() * 2 + 1)
                //console.log(Math2)
                if (chooseMovement === 1) {
                    if (this.movesLeft && this.movesRight)
                    this.movesLeft = false

                    if (this.movesUp && this.movesDown)
                    this.movesUp = false
                        
                }

                if (chooseMovement === 2) {
                    if (this.movesLeft && this.movesRight)
                    this.movesRight = false
                        
                    if (this.movesUp && this.movesDown)
                    this.movesDown = false
                        
                }
            }
        if (this.movesLeft) {
            this.x = this.x - this.block_speed * delta
        }

        if (this.movesRight) { 
            this.x = this.x + this.block_speed * delta
        }

        if (this.movesUp) {
            this.y = this.y - this.block_speed * delta
        }

        if (this.movesDown) { 
            this.y = this.y + this.block_speed * delta
        }
        gameStates.CurrentLevel().changeDirectionSquares.forEach(function(changeDirectionSquare) {
            if (changeDirectionSquare.intersectsAll(self) && changeDirectionSquare.allowDirectionChange) {
                //console.log("hi")
                if (changeDirectionSquare.changeLeft && changeDirectionSquare.changeRight || changeDirectionSquare.changeUp && changeDirectionSquare.changeDown) {
                    var chooseMovementChange = Math.floor(Math.random() * 2 + 1)

                    if (chooseMovementChange === 1) {
                        if (changeDirectionSquare.changeLeft && changeDirectionSquare.changeRight)
                        changeDirectionSquare.changeLeft = false

                        if (changeDirectionSquare.changeUp && changeDirectionSquare.changeDown)
                        changeDirectionSquare.changeUp = false
                            
                    }

                    if (chooseMovementChange === 2) {
                        if (changeDirectionSquare.changeLeft && changeDirectionSquare.changeRight)
                        changeDirectionSquare.changeRight = false
                            
                        if (changeDirectionSquare.changeUp && changeDirectionSquare.changeDown)
                        changeDirectionSquare.changeDown = false
                            
                    }
                }
                if (self.movesLeft || self.movesRight) {
                    if (changeDirectionSquare.changeUp) {
                        self.movesUp = true
                    }

                    if (changeDirectionSquare.changeDown) {
                        self.movesDown = true
                    }
                    self.movesLeft = false
                    self.movesRight = false
                }
                
                else if (self.movesUp || self.movesDown) {
                    if (changeDirectionSquare.changeLeft) {
                        self.movesLeft = true
                    }

                    if (changeDirectionSquare.changeRight) {
                        self.movesRight = true
                    }
                    self.movesUp = false
                    self.movesDown = false
                }
            }
        })

        gameStates.CurrentLevel().walls.forEach(function(wall) {
            if (wall.intersects(self) && !wall.allowMovement) {
                intersectsWall = true
            }
        })

        gameStates.CurrentLevel().rocks.forEach(function(rock) {
            if (!rock.allowMovement && rock.intersects(self)) {
                intersectsWall = true
            }
        })

        gameStates.CurrentLevel().holes.forEach(function(hole) {
            if (!hole.fullHole && hole.intersectsAll(self)) {
                hole.currentIntersects = hole.currentIntersects + 1
                self.stopHole = true
                hole.stopEnemy = true
            }

            if (hole.stopEnemy && self.stopHole && !hole.intersects(self)) {
                self.stopHole = false
                hole.stopEnemy = false      
            }

            if (hole.fullHole && hole.intersects(self) && self.stopHole === false && hole.stopEnemy === false) {
                intersectsWall = true
            }
        })

        gameStates.CurrentLevel().waters.forEach(function(water) {
            if (water.intersects(self)) {   
                intersectsWater = true
            }
        })
        if (intersectsWater && (this.inWater === false || this.inWater === undefined)) {
            this.block_speed = this.block_speed / 2    
        }

        if (!intersectsWater && this.inWater === true) {
            this.block_speed = this.block_speed * 2    
        }

        this.inWater = intersectsWater

        gameStates.CurrentLevel().finishAreas.forEach(function(finishArea) {
            if (finishArea.intersects(self)) {
                intersectsWall = true
            }
        })
            
        if (this.movesRight && this.x >= 850 - this.width || this.movesLeft && this.x <= 0 || (this.movesLeft || this.movesRight) && intersectsWall) {
            this.movesLeft = !this.movesLeft
            this.movesRight = !this.movesRight
            this.x = oldX
        }

        if (this.movesDown && this.y >= 600 - this.height || this.movesUp && this.y <= 0 || (this.movesUp || this.movesDown) && intersectsWall) {
            this.movesUp = !this.movesUp
            this.movesDown = !this.movesDown
            this.y = oldY
        }
    }

    Draw() {
        if (draw.spriteStyle) {
            draw.DrawImage(images.RedCube, this.x, this.y)
        }
        
        else if (draw.plasticStyle) {
            draw.DrawImage(images.RedCubePlastic, this.x, this.y)
        }
    } 
};

export class Player extends GameObject {
    constructor(x, y, width, height) {
        super(x, y, width, height)
        this.original_x = x
        this.original_y = y
        this.previousIntersectsHole = false
    }
    moveRight() {
        var oldX = this.x
        this.x = this.x + 50
        var intersectsWall = false
        var self = this
        gameStates.CurrentLevel().walls.forEach(function(wall) {
            if (!wall.allowMovement && wall.intersects(self)) {
                intersectsWall = true
                gameStates.CurrentLevel().holes.forEach(function(hole) {
                    hole.stopPlayer = true
                })
            }
        })

        gameStates.CurrentLevel().rocks.forEach(function(rock) {
            if (!rock.allowMovement && rock.intersects(self)) {
                intersectsWall = true
                gameStates.CurrentLevel().holes.forEach(function(hole) {
                    hole.stopPlayer = true
                })
            }
        })

        gameStates.CurrentLevel().waters.forEach(function(water) {
            gameStates.CurrentLevel().items.forEach(function(item) {
                if (!item.allowMovementWater && item.typeNumber === 1 && water.intersects(self)) {
                    intersectsWall = true
                    gameStates.CurrentLevel().holes.forEach(function(hole) {
                        hole.stopPlayer = true
                    })
                }
            })
            
        })

        gameStates.CurrentLevel().holes.forEach(function(hole) {
            if (hole.intersects(self) && !hole.fullHole && !hole.stopPlayer) {
                hole.currentIntersects = hole.currentIntersects + 0.5
                hole.previousIntersectsHole = true
            }
            if (!hole.intersects(self) && hole.previousIntersectsHole && !hole.stopPlayer) {
                hole.currentIntersects = hole.currentIntersects + 0.5
                hole.previousIntersectsHole = false
            }
        })

        gameStates.CurrentLevel().items.forEach(function(item) {
            if (item.intersects(self)) {
                if (item.typeNumber === 1) {
                    item.allowMovementWater = true
                }
                item.collected = true   
            }
        })

        if (intersectsWall) {
            this.x = oldX 
        }
        gameStates.CurrentLevel().holes.forEach(function(hole) {
            if (hole.stopPlayer)
                hole.stopPlayer = false
        })
    }
    moveLeft() {
        var oldX = this.x
        this.x = this.x - 50
        var intersectsWall = false
        var self = this
        gameStates.CurrentLevel().walls.forEach(function(wall) {
            if (!wall.allowMovement && wall.intersects(self)) {
                intersectsWall = true
                gameStates.CurrentLevel().holes.forEach(function(hole) {
                    hole.stopPlayer = true
                })
            }
        })

        gameStates.CurrentLevel().rocks.forEach(function(rock) {
            if (!rock.allowMovement && rock.intersects(self)) {
                intersectsWall = true
                gameStates.CurrentLevel().holes.forEach(function(hole) {
                    hole.stopPlayer = true
                })
            }
        })

        gameStates.CurrentLevel().waters.forEach(function(water) {
            gameStates.CurrentLevel().items.forEach(function(item) {
                if (!item.allowMovementWater && item.typeNumber === 1 && water.intersects(self)) {
                    intersectsWall = true
                    gameStates.CurrentLevel().holes.forEach(function(hole) {
                        hole.stopPlayer = true
                    })
                }
            })
            
        })

        gameStates.CurrentLevel().holes.forEach(function(hole) {
            if (hole.intersects(self) && !hole.fullHole && !hole.stopPlayer) {
                hole.currentIntersects = hole.currentIntersects + 0.5
                hole.previousIntersectsHole = true
            }
            if (!hole.intersects(self) && hole.previousIntersectsHole && !hole.stopPlayer) {
                hole.currentIntersects = hole.currentIntersects + 0.5
                hole.previousIntersectsHole = false
            }
        })

        gameStates.CurrentLevel().items.forEach(function(item) {
            if (item.intersects(self)) {
                if (item.typeNumber === 1) {
                    item.allowMovementWater = true
                }
                item.collected = true   
            }
        })

        if (intersectsWall) {
            this.x = oldX 
        }
        gameStates.CurrentLevel().holes.forEach(function(hole) {
            if (hole.stopPlayer)
                hole.stopPlayer = false
        })
    }
    moveDown() {
        var oldY = this.y
        this.y = this.y + 50
        var intersectsWall = false
        var self = this
        gameStates.CurrentLevel().walls.forEach(function(wall) {
            if (!wall.allowMovement && wall.intersects(self)) {
                intersectsWall = true
                gameStates.CurrentLevel().holes.forEach(function(hole) {
                    hole.stopPlayer = true
                })
            }
        })

        gameStates.CurrentLevel().rocks.forEach(function(rock) {
            if (!rock.allowMovement && rock.intersects(self)) {
                intersectsWall = true
                gameStates.CurrentLevel().holes.forEach(function(hole) {
                    hole.stopPlayer = true
                })
            }
        })

        gameStates.CurrentLevel().waters.forEach(function(water) {
            gameStates.CurrentLevel().items.forEach(function(item) {
                if (!item.allowMovementWater && item.typeNumber === 1 && water.intersects(self)) {
                    intersectsWall = true
                    gameStates.CurrentLevel().holes.forEach(function(hole) {
                        hole.stopPlayer = true
                    })
                }
            })
            
        })

        gameStates.CurrentLevel().holes.forEach(function(hole) {
            if (hole.intersects(self) && !hole.fullHole && !hole.stopPlayer) {
                hole.currentIntersects = hole.currentIntersects + 0.5
                hole.previousIntersectsHole = true
            }
            if (!hole.intersects(self) && hole.previousIntersectsHole && !hole.stopPlayer) {
                hole.currentIntersects = hole.currentIntersects + 0.5
                hole.previousIntersectsHole = false
            }
        })

        gameStates.CurrentLevel().items.forEach(function(item) {
            if (item.intersects(self)) {
                if (item.typeNumber === 1) {
                    item.allowMovementWater = true
                }
                item.collected = true   
            }
        })

        if (intersectsWall) {
            this.y = oldY
        }
        gameStates.CurrentLevel().holes.forEach(function(hole) {
            if (hole.stopPlayer)
                hole.stopPlayer = false
        })
    }
    moveUp() {
        var oldY = this.y
        this.y = this.y - 50
        var intersectsWall = false
        var self = this
        gameStates.CurrentLevel().walls.forEach(function(wall) {
            if (!wall.allowMovement && wall.intersects(self)) {
                intersectsWall = true
                gameStates.CurrentLevel().holes.forEach(function(hole) {
                    hole.stopPlayer = true
                })
            }
        })

        gameStates.CurrentLevel().rocks.forEach(function(rock) {
            if (!rock.allowMovement && rock.intersects(self)) {
                intersectsWall = true
                gameStates.CurrentLevel().holes.forEach(function(hole) {
                    hole.stopPlayer = true
                })
            }
        })

        gameStates.CurrentLevel().waters.forEach(function(water) {
            gameStates.CurrentLevel().items.forEach(function(item) {
                if (!item.allowMovementWater && item.typeNumber === 1 && water.intersects(self)) {
                    intersectsWall = true
                    gameStates.CurrentLevel().holes.forEach(function(hole) {
                        hole.stopPlayer = true
                    })
                }
            })
            
        })

        gameStates.CurrentLevel().holes.forEach(function(hole) {
            if (hole.intersects(self) && !hole.fullHole && !hole.stopPlayer) {
                hole.currentIntersects = hole.currentIntersects + 0.5
                hole.previousIntersectsHole = true
            }
            if (!hole.intersects(self) && hole.previousIntersectsHole && !hole.stopPlayer) {
                hole.currentIntersects = hole.currentIntersects + 0.5
                hole.previousIntersectsHole = false
            }
        })

        gameStates.CurrentLevel().items.forEach(function(item) {
            if (item.intersects(self)) {
                if (item.typeNumber === 1) {
                    item.allowMovementWater = true
                }
                item.collected = true   
            }
        })

        if (intersectsWall) {
            this.y = oldY 
        }
        gameStates.CurrentLevel().holes.forEach(function(hole) {
            if (hole.stopPlayer)
                hole.stopPlayer = false
        })
    }
    reset() {
        this.x = this.original_x 
        this.y = this.original_y
    }   
    update() {

    }   
    Draw() {
        if (gameStates.currentCubeStyle === cubeStyle.BlueCube && draw.spriteStyle) {
            draw.DrawImage(images.BlueCube, this.x, this.y)
        }
        
        else if (gameStates.currentCubeStyle === cubeStyle.Alien && draw.spriteStyle) {
            draw.DrawImage(images.BlueCubeAlien, this.x, this.y)
        }

        else if (gameStates.currentCubeStyle === cubeStyle.Lava && draw.spriteStyle) {
            draw.DrawImage(images.BlueCubeLava, this.x, this.y)
        }

        else if (gameStates.currentCubeStyle === cubeStyle.Wooden && draw.spriteStyle) {
            draw.DrawImage(images.BlueCubeWooden, this.x, this.y)
        }

        else if (gameStates.currentCubeStyle === cubeStyle.Sad && draw.spriteStyle) {
            draw.DrawImage(images.BlueCubeSad, this.x, this.y)
        }

        else if (gameStates.currentCubeStyle === cubeStyle.BlueCube && draw.plasticStyle) {
            draw.DrawImage(images.BlueCubePlastic, this.x, this.y)
        }
        
        else if (gameStates.currentCubeStyle === cubeStyle.Alien && draw.plasticStyle) {
            draw.DrawImage(images.BlueCubeAlienPlastic, this.x, this.y)        
        }

        else if (gameStates.currentCubeStyle === cubeStyle.Lava && draw.plasticStyle) {
            draw.DrawImage(images.BlueCubeLavaPlastic, this.x, this.y)        
        }

        else if (gameStates.currentCubeStyle === cubeStyle.Wooden && draw.plasticStyle) {
            draw.DrawImage(images.BlueCubeWoodenPlastic, this.x, this.y)        
        }

        else if (gameStates.currentCubeStyle === cubeStyle.Sad && draw.plasticStyle) {
            draw.DrawImage(images.BlueCubeSadPlastic, this.x, this.y)        
        }
    }
};
gameStates.currentCubeStyle = cubeStyle.BlueCube

export class Wall extends GameObject {
    constructor(x, y, width, height, color1, allowMovement, invisibleWall) {
        super(x, y, width, height, color1)
        this.allowMovement = allowMovement
        this.invisibleWall = invisibleWall
        this.randomList = Array(100)
        for (var i = 0; i < 100; i++) {
            this.randomList[i] = Math.floor(Math.random() * 1000)
        }
    }

    Draw() {
        if (this.invisibleWall && draw.spriteStyle) {
            var i = 0; 
            for (var x = this.left(); x < this.right(); x = x + 50) {
                for (var y = this.top(); y < this.bottom(); y = y + 50) {
                    i++
                    canvas.context.save()
                    canvas.context.translate(x - 2, y - 2)
                    ///
                    if (this.randomList[i] % 15 === 0)
                    draw.DrawImage(images.InvisibleWallV2, 0,  0)
                    else 
                    draw.DrawImage(images.InvisibleWall, 0,  0)
                    canvas.context.restore()
                }
            }            
        /*} else if (this.x > 800) {
            for (var x = this.left(); x < this.right(); x = x + 50) {
                for (var y = this.top(); y < this.bottom(); y = y + 50) {
            draw.DrawImage(images.WallGrassEdgeY, )
                }
            }*/
        
        } else if (draw.spriteStyle && !this.invisibleWall) {
             var i = 0; 
             for (var x = this.left(); x < this.right(); x = x + 50) {
                 for (var y = this.top(); y < this.bottom(); y = y + 50) {
                    i++
                    ///
                    canvas.context.save()
                    canvas.context.translate(x - 2, y - 2)
                    //if (this.randomList[i] % 2 === 0)
                        //canvas.context.rotate(90 * Math.PI / 180)
                    if (this.randomList[i] % 40 === 0)
                       draw.DrawImage(images.WallGrassV3, 0, 0) 
                     
                    else if (this.randomList[i] % 9 === 0)
                       draw.DrawImage(images.WallGrassV2, 0, 0) 
                    
                    else if (this.randomList[i] % 998 === 0 && gameStates.currentGameMode === gameMode.StoryMode) {
                       draw.DrawImage(images.WallGrassTree, 0, 0)
                        draw.blueCubeWoodenLock = false
                    }
 
                    else
                       draw.DrawImage(images.WallGrassV1, 0, 0) 


                    canvas.context.restore()
                         
                }
            }
            
            } else if (draw.plasticStyle) {
                canvas.context.fillStyle = this.color1
                canvas.context.fillRect(this.x, this.y, this.width, this.height)
            } 
 
    }
};

export class Water extends GameObject {
    constructor(x, y, width, height, color1) {
        super(x, y, width, height, color1)
        this.spriteX = 0
    }

    Draw() {
        if (draw.spriteStyle === true) {
            if (gameStates.currentStoryModeState === storyModeStates.Playing) {
                var numMilliseconds = new Date().getTime()
                if (numMilliseconds % 5 === 4) {
                    this.spriteX = (this.spriteX + 54) % (54*49)
                }
            }
            for (var x = this.left(); x < this.right(); x = x + 50) {
                for (var y = this.top(); y < this.bottom(); y = y + 50) {
                    canvas.context.drawImage(images.Water_Medium2, this.spriteX, 0, 54, images.Water_Medium2.height, x, y, 54, images.Water_Medium2.height)
                }
            }
        }
        if (draw.plasticStyle === true) {
            canvas.context.fillStyle = this.color1;
            canvas.context.fillRect(this.x, this.y, this.width, this.height)
        }
    }
    Update() {
        
    }
    
    reset() {  
    } 
};

export class Item extends GameObject {
    constructor(x, y, width, height, typeNumber) {
        super(x, y, width, height)
        this.typeNumber = typeNumber
        this.allowMovementWater = false
        this.collected = false
    }

    Draw() {
        if (this.typeNumber === 1 && !this.collected && draw.spriteStyle) {    
           draw.DrawImage(images.LifeJacket, this.x, this.y)     
        }

        if (this.typeNumber === 1 && !this.collected && draw.plasticStyle) {    
           draw.DrawImage(images.LifeJacketPlastic, this.x, this.y)     
        }

        if (this.typeNumber === 2 && !this.collected && draw.spriteStyle && gameStates.currentGameMode === gameMode.StoryMode && draw.blueCubeAlienLock) {    
           draw.DrawImage(images.Three_Bead, this.x, this.y)     
        }

        if (this.typeNumber === 2 && !this.collected && draw.plasticStyle && gameStates.currentGameMode === gameMode.StoryMode && draw.blueCubeAlienLock) {    
           draw.DrawImage(images.Three_Bead_Plastic, this.x, this.y)     
        }
    }
    
    update() {
        if (this.typeNumber === 2 && this.collected && gameStates.currentGameMode === gameMode.StoryMode) {    
            draw.blueCubeAlienLock = false     
        }
    }
    
    reset() {
        this.allowMovementWater = false
        this.collected = false
    }
};

export class ChangeDirectionSquare extends GameObject {
    constructor(x, y, width, height, changeLeft, changeRight, changeUp, changeDown, allowDirectionChange, title) {
        super(x, y, width, height, "red")
        this.color2 = "orange"
        this.allowDirectionChangeOld = allowDirectionChange
        this.allowDirectionChange = allowDirectionChange
        this.changeLeft = changeLeft
        this.changeRight = changeRight
        this.changeUp = changeUp
        this.changeDown = changeDown
        this.title = title
    }
    Draw() {
        if (!this.allowDirectionChange)
        canvas.context.fillStyle = this.color2

        else 
        canvas.context.fillStyle = this.color1
        canvas.context.fillRect(this.x, this.y, this.width, this.height)
    }
    reset() {
        this.allowDirectionChange = this.allowDirectionChangeOld
    }
};

export class Rock extends GameObject {
    constructor(x, y, width, height, color1, color2, title, allowMovement, colorNumber, typeNumber) {
        super(x, y, width, height, color1)
        this.color2 = color2
        this.title = title
        this.allowMovement = allowMovement
        this.colorNumber = colorNumber
        this.typeNumber = typeNumber
    }

        Draw() {
            var self = this
            if (draw.spriteStyle && this.typeNumber === 1) {
                if (this.colorNumber === 1) {
                    gameStates.CurrentLevel().unlocks.forEach(function(unlock) {
                        if (unlock.activated && unlock.title === self.title) {
                           draw.DrawImage(images.UnlockedRockBlue, self.x, self.y)
                            
                        } else if (!unlock.activated && unlock.title === self.title) {
                           draw.DrawImage(images.UnlockRockBlue, self.x, self.y)    
                        }
                    })
                } else if (this.colorNumber === 2) {
                    gameStates.CurrentLevel().unlocks.forEach(function(unlock) {
                        if (unlock.activated && unlock.title === self.title) {
                           draw.DrawImage(images.UnlockedRockPurple, self.x, self.y)    
                        
                        } else if (!unlock.activated && unlock.title === self.title) {
                           draw.DrawImage(images.UnlockRockPurple, self.x, self.y)    
                        }
                    })
            }       
            } else if (draw.plasticStyle && this.typeNumber === 1) {
                gameStates.CurrentLevel().unlocks.forEach(function(unlock) { 
                    if (!unlock.activated && unlock.title === self.title)
                        canvas.context.fillStyle = self.color1

                    if (unlock.activated && unlock.title === self.title)
                        canvas.context.fillStyle = self.color2
                })
                canvas.context.fillRect(this.x, this.y, this.width, this.height)
                 
            }
     
        }
        
    
};

export class Unlock extends GameObject {
    constructor(x, y, width, height, color1, color2, activatedcolor, title, colorNumber) {
        super(x, y, width, height, color1)
        this.color2 = color2
        this.activatedcolor = activatedcolor
        this.title = title
        this.colorNumber = colorNumber
    }

    update() {
       var self = this
       gameStates.CurrentLevel().players.forEach(function(player) {
            if (self.intersectsAll(player)) {
                gameStates.CurrentLevel().rocks.forEach(function(rock) {
                    if (self.title === rock.title) {
                        rock.allowMovement = true
                    }
                })
                gameStates.CurrentLevel().changeDirectionSquares.forEach(function(changeDirectionSquare) {
                    if (self.title === changeDirectionSquare.title) {
                        changeDirectionSquare.allowDirectionChange = true
                    }
                })
                self.activated = true
            }
        })

       gameStates.CurrentLevel().enemies.forEach(function(enemy) {
            if (self.intersectsAll(enemy)) {
                gameStates.CurrentLevel().rocks.forEach(function(rock) {
                    if (self.title === rock.title) {
                        rock.allowMovement = true
                    }
                })
                gameStates.CurrentLevel().changeDirectionSquares.forEach(function(changeDirectionSquare) {
                    if (self.title === changeDirectionSquare.title) {
                        changeDirectionSquare.allowDirectionChange = true
                    }
                })
                self.activated = true
            }
        })
    }

    Draw() {
        if (draw.spriteStyle === true) {
            if (this.colorNumber === 1) {
            
                if (this.activated) {
                   draw.DrawImage(images.SwitchW1ActivatedBlue, this.x, this.y) 
                
                } else {
                   draw.DrawImage(images.SwitchW1Blue, this.x, this.y) 
                }
            
            } else if (this.colorNumber === 2) {
            
                if (this.activated) {
                   draw.DrawImage(images.SwitchW1ActivatedPurple, this.x, this.y) 
                } else {
                   draw.DrawImage(images.SwitchW1Purple, this.x, this.y)  
                }
            }            
        
        } else if (draw.plasticStyle === true) {
            canvas.context.fillStyle = this.color1
            canvas.context.fillRect(this.x, this.y, this.width, this.height)
            if (this.activated) {
                canvas.context.fillStyle = this.activatedcolor
            
            } else {
                 canvas.context.fillStyle = this.color2    
            }
            canvas.context.fillRect(this.x + 10, this.y + 10, 30, 30)
        }
    }
};

export class Teleporter extends GameObject {
    constructor(x, y, otherTeleporter, width, height, colorNumber) {
        super(x, y, width, height)
        this.colorNumber = colorNumber
        this.stop = false
        this.otherTeleporter = otherTeleporter
    }

    update() {
       var self = this
       gameStates.CurrentLevel().players.forEach(function(player) {
            if (self.intersectsAll(player) && !self.stop) {   
                self.otherTeleporter.stop = true
                player.y = self.otherTeleporter.y
                player.x = self.otherTeleporter.x
            
            }
            if (!self.intersects(player) && self.stop) {
                self.stop = false        
            }
        })
    }

    Draw() {
        if (draw.spriteStyle) {
            if (this.colorNumber === 1) {
               draw.DrawImage(images.TeleporterTomatoSprite, this.x, this.y)   
            }

            if (this.colorNumber === 2) {
               draw.DrawImage(images.TeleporterPurpleSprite, this.x, this.y)  
            }
        }

        else if (draw.plasticStyle) {
            if (this.colorNumber === 1) {
               draw.DrawImage(images.TeleporterTomato, this.x, this.y) 
            }

            if (this.colorNumber === 2) {
               draw.DrawImage(images.TeleporterPurple, this.x, this.y) 
            }

        }
    }   
};

export class Hole extends GameObject {
    constructor(x, y, width, height, fullHole, currentIntersects, maxIntersects) {
        super(x, y, width, height)
        this.fullHole = fullHole
        this.currentIntersects = currentIntersects
        this.maxIntersects = maxIntersects
        this.previousIntersectsHole = false
        this.stopPlayer = false
        this.stopEnemy = false
        this.DrawingX = undefined
    }

    Draw() {
        if (this.fullHole)
            this.DrawingX = 100  

        else if (this.currentIntersects < this.maxIntersects && this.currentIntersects !== 0)
            this.DrawingX = 50 
        
        else
            this.DrawingX = 0

        if (draw.spriteStyle) {
            canvas.context.drawImage(images.Hole, this.DrawingX, 0, 50, 50, this.x, this.y, this.width, this.height)
        }

        if (draw.plasticStyle) {
            canvas.context.drawImage(images.HolePlastic, this.DrawingX, 0, 50, 50, this.x, this.y, this.width, this.height)
     
        }

    }

    update() {
        if (this.currentIntersects >= this.maxIntersects) {
            this.fullHole = true
        }
    }

    reset() {
        this.fullHole = false
        this.currentIntersects = 0
    }
}

export class FinishArea extends GameObject {
    constructor(x, y, width, height) {
        super(x, y, width, height, "pink")
    }
    
    Draw() {
        canvas.context.fillStyle = this.color1;
        canvas.context.fillRect(this.x, this.y, this.width, this.height)
    }
};