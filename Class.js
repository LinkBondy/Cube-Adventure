"use strict";

var forward_x = true
var forward_y = true
var block_speed = 5

var CubeStyle = {
    BlueCube: 0,
    Alien: 1,
    Lava: 2,
    Wooden: 3,
    Sad: 4,
}

class GameObject {
    constructor(x, y, width, height, color1){
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
        if (this.left() == otherBox.left() && this.top() == otherBox.top()){ 
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

class Backround {
    constructor(color1) {
        this.color1 = color1
    }
    
    Draw(){
        if (game.gameState == GameState.Started && game.spriteStyle && game.gameMode != GameMode.Shop || game.gameState == GameState.Rules && game.spriteStyle && game.gameMode == GameMode.Freeplay || game.gameState == GameState.Paused) {
            this.color1 = "rgb(100, 200, 100)"
        }
        else {
            this.color1 = "lightgray"
        }
        game.context.clearRect(0, 0, game.canvas.width, game.canvas.height);
        game.context.fillStyle = this.color1;
        game.context.fillRect(0,0, game.canvas.width, game.canvas.height) 
        

        /*for (var x = 0; x < 850; x = x + 50) {
            for (var y = 0; y < 600; y = y + 50) {
                game.context.drawImage(game.grass, 0, 0, game.grass.width, game.grass.height, x, y, game.grass.width, game.grass.height) 
            }
        }*/
    }

};

class Box extends GameObject {
    constructor(x,y, width, height, movesLeftRight, movesUpDown, block_speed = 5) {
        super(x, y, width, height)
        this.forward_x = true
        this.forward_y = false
        this.block_speed = block_speed
        this.original_x = x
        this.original_y = y
        this.originalMovesLeftRight = movesLeftRight
        this.originaMovesUpDown = movesUpDown
        this.movesLeftRight = movesLeftRight
        this.movesUpDown = movesUpDown
        this.original_block_speed = block_speed
        this.inWater = undefined

    }
   
    reset() {
       this.x = this.original_x 
       this.y = this.original_y
       this.movesLeftRight = this.originalMovesLeftRight
       this.movesUpDown = this.originaMovesUpDown
       this.block_speed = this.original_block_speed
       this.inWater = undefined
    }  
    update() {
        var oldX = this.x
        var oldY = this.y
        var intersectsWall = false
        var intersectsWater = false
        var enemy = this
   
        if (this.movesLeftRight) {
            if (this.forward_x)
                this.x = this.x + this.block_speed
            else 
                this.x = this.x - this.block_speed

            if (this.x >= 850 - this.width)
                this.forward_x = false
            
            if (this.x <= 0)
                this.forward_x = true
        }

        if (this.movesUpDown) {
            if (this.forward_y)
                this.y = this.y + this.block_speed
            else 
                this.y = this.y - this.block_speed

            if (this.y >= 600 - this.height)
                this.forward_y = false
            
            if (this.y <= 0)
                this.forward_y = true
        }
             
        levels[game.currentLevel].changeDirectionSquares.forEach(function(changeDirectionSquare) {
            if (changeDirectionSquare.intersectsAll(enemy)) {
                enemy.movesLeftRight = !enemy.movesLeftRight
                enemy.movesUpDown = !enemy.movesUpDown
            }
        })

        levels[game.currentLevel].walls.forEach(function(wall) {
            if (wall.intersects(enemy) && !wall.allowMovement) {
                intersectsWall = true
            }
        })

        levels[game.currentLevel].waters.forEach(function(water) {
            if (water.intersects(enemy)) {   
                intersectsWater = true
            }
        })
        if (intersectsWater && (this.inWater === false || this.inWater === undefined)){
            this.block_speed = this.block_speed / 2    
        }

        if (!intersectsWater && this.inWater === true){
            this.block_speed = this.block_speed * 2    
        }

        this.inWater = intersectsWater

        levels[game.currentLevel].finishAreas.forEach(function(finishArea) {
            if (finishArea.intersects(enemy)) {
                intersectsWall = true
            }
        })
            
        if (intersectsWall) {
            this.x = oldX
            this.y = oldY
            if (this.movesLeftRight)
                this.forward_x = !this.forward_x 
            if (this.movesUpDown)
                this.forward_y = !this.forward_y 
        }
    }

    Draw() {
        if (game.spriteStyle) {
            game.context.drawImage(game.RedCube, 0, 0, game.RedCube.width, game.RedCube.height, this.x, this.y, game.RedCube.width, game.RedCube.height)
        }
        
        else if (game.plasticStyle) {
            game.context.drawImage(game.RedCubePlastic, 0, 0, game.RedCubePlastic.width, game.RedCubePlastic.height, this.x, this.y, game.RedCubePlastic.width, game.RedCubePlastic.height)
        }
    } 
};

class Player extends GameObject {
    constructor(x,y, width, height) {
        super(x, y, width, height)
        this.forward_x = true
        this.forward_y = false
        this.block_speed = block_speed
        this.original_x = x
        this.original_y = y
        this.allowMovementWater = false
    }
    moveRight() {
        var oldX = this.x
        this.x = this.x + 50
        var intersectsWall = false
        var self = this
        levels[game.currentLevel].walls.forEach(function(wall) {
            if (!wall.allowMovement && wall.intersects(self)) {
                intersectsWall = true
            }
        })

        levels[game.currentLevel].waters.forEach(function(water) {
            if (!self.allowMovementWater && water.intersects(self)) {
                intersectsWall = true
            }
        })

        levels[game.currentLevel].items.forEach(function(item) {
            if (item.intersects(self) && item.typeNumber === 1) {
                self.allowMovementWater = true     
            }
        })

        if (intersectsWall) {
            this.x = oldX 
        }

    }
    moveLeft() {
        var oldX = this.x
        this.x = this.x - 50
        var intersectsWall = false
        var self = this
        levels[game.currentLevel].walls.forEach(function(wall) {
            if (!wall.allowMovement && wall.intersects(self)) {
                intersectsWall = true
            }
        })

        levels[game.currentLevel].waters.forEach(function(water) {
            if (!self.allowMovementWater && water.intersects(self)) {
                intersectsWall = true
            }
        })

        levels[game.currentLevel].items.forEach(function(item) {
            if (item.intersects(self) && item.typeNumber === 1) {
                self.allowMovementWater = true    
            }
        })

        if (intersectsWall) {
            this.x = oldX 
        } 
    }
    moveDown() {
        var oldY = this.y
        this.y = this.y + 50
        var intersectsWall = false
        var self = this
        levels[game.currentLevel].walls.forEach(function(wall) {
            if (!wall.allowMovement && wall.intersects(self)) {
                intersectsWall = true
            }
        })

        levels[game.currentLevel].waters.forEach(function(water) {
            if (!self.allowMovementWater && water.intersects(self)) {
                intersectsWall = true
            }
        })

        levels[game.currentLevel].items.forEach(function(item) {
            if (item.intersects(self) && item.typeNumber === 1) {
                this.allowMovementWater = true    
            }
        })

        if (intersectsWall) {
            this.y = oldY
        } 
    }
    moveUp() {
        var oldY = this.y
        this.y = this.y - 50
        var intersectsWall = false
        var self = this
        levels[game.currentLevel].walls.forEach(function(wall) {
            if (!wall.allowMovement && wall.intersects(self)) {
                intersectsWall = true
            }
        })

        levels[game.currentLevel].waters.forEach(function(water) {
            if (!self.allowMovementWater && water.intersects(self)) {
                intersectsWall = true
            }
        })

        levels[game.currentLevel].items.forEach(function(item) {
            if (item.intersects(self) && item.typeNumber === 1) {
                self.allowMovementWater = true    
            }
        })

        if (intersectsWall) {
            this.y = oldY
        } 
    }
    reset() {
        this.x = this.original_x 
        this.y = this.original_y
        this.allowMovementWater = false
    }   
    update() {

    }   
    Draw() {
        if (Player.CubeStyle === CubeStyle.BlueCube && game.spriteStyle) {
            game.context.drawImage(game.BlueCube, 0, 0, game.BlueCube.width, game.BlueCube.height, this.x, this.y, game.BlueCube.width, game.BlueCube.height)
        }
        
        else if (Player.CubeStyle === CubeStyle.Alien && game.spriteStyle) {
            game.context.drawImage(game.BlueCubeAlien, 0, 0, game.BlueCubeAlien.width, game.BlueCubeAlien.height, this.x, this.y, game.BlueCubeAlien.width, game.BlueCubeAlien.height)
        }

        else if (Player.CubeStyle === CubeStyle.Lava && game.spriteStyle) {
            game.context.drawImage(game.BlueCubeLava, 0, 0, game.BlueCubeLava.width, game.BlueCubeLava.height, this.x, this.y, game.BlueCubeLava.width, game.BlueCubeLava.height)
        }

        else if (Player.CubeStyle === CubeStyle.Wooden && game.spriteStyle) {
            game.context.drawImage(game.BlueCubeWooden, 0, 0, game.BlueCubeWooden.width, game.BlueCubeWooden.height, this.x, this.y, game.BlueCubeWooden.width, game.BlueCubeWooden.height)
        }

        else if (Player.CubeStyle === CubeStyle.Sad && game.spriteStyle) {
            game.context.drawImage(game.BlueCubeSad, 0, 0, game.BlueCubeSad.width, game.BlueCubeSad.height, this.x, this.y, game.BlueCubeSad.width, game.BlueCubeSad.height)
        }

        else if (Player.CubeStyle === CubeStyle.BlueCube && game.plasticStyle) {
            game.context.drawImage(game.BlueCubePlastic, 0, 0, game.BlueCubePlastic.width, game.BlueCubePlastic.height, this.x, this.y, game.BlueCubePlastic.width, game.BlueCubePlastic.height)
        }
        
        else if (Player.CubeStyle === CubeStyle.Alien && game.plasticStyle) {
            game.context.drawImage(game.BlueCubeAlienPlastic, 0, 0, game.BlueCubeAlienPlastic.width, game.BlueCubeAlienPlastic.height, this.x, this.y, game.BlueCubeAlienPlastic.width, game.BlueCubeAlienPlastic.height)
        }

        else if (Player.CubeStyle === CubeStyle.Lava && game.plasticStyle) {
            game.context.drawImage(game.BlueCubeLavaPlastic, 0, 0, game.BlueCubeLavaPlastic.width, game.BlueCubeLavaPlastic.height, this.x, this.y, game.BlueCubeLavaPlastic.width, game.BlueCubeLavaPlastic.height)
        }

        else if (Player.CubeStyle === CubeStyle.Wooden && game.plasticStyle) {
            game.context.drawImage(game.BlueCubeSadPlastic, 0, 0, game.BlueCubeSadPlastic.width, game.BlueCubeSadPlastic.height, this.x, this.y, game.BlueCubeSadPlastic.width, game.BlueCubeSadPlastic.height)
        }
    }
};
Player.CubeStyle = CubeStyle.BlueCube

class Wall extends GameObject {
    constructor(x, y, width, height, color1, color2, allowMovement, invisibleWall, drawLast, colorNumber){
        super(x, y, width, height, color1)
        this.color2 = color2
        this.allowMovement = allowMovement
        this.drawLast = drawLast
        this.invisibleWall = invisibleWall
        this.colorNumber = colorNumber
        this.randomList = Array(100)
        for (var i = 0; i < 100; i++) {
            this.randomList[i] = Math.floor(Math.random() * 1000)
        }
    }

    Draw(){
        var self = this    
        if (this.allowMovement && game.plasticStyle) {
            game.context.fillStyle = this.color2
            game.context.fillRect(this.x, this.y, this.width, this.height)
         
         } else if (this.invisibleWall) {
             game.context.drawImage(game.InvisibleWall, 0, 0, game.InvisibleWall.width, game.InvisibleWall.height, this.x - 2,  this.y - 2, game.InvisibleWall.width, game.InvisibleWall.height)            
         
        } else if (game.spriteStyle && !this.allowMovement && this.colorNumber !== 1 && this.colorNumber !== 2) {
             var i = 0; 
             for (var x = this.left(); x < this.right(); x = x + 50) {
                 for (var y = this.top(); y < this.bottom(); y = y + 50) {
                     i++

                    game.context.save()

                    game.context.translate(x - 2, y - 2)
                    //if (this.randomList[i] % 2 == 0)
                        //game.context.rotate(90 * Math.PI / 180)
                        
                    
                    if (this.randomList[i] % 40 === 0)
                        game.context.drawImage(game.WallGrassV3, 0, 0, game.WallGrassV3.width, game.WallGrassV3.height, 0, 0, game.WallGrassV3.width, game.WallGrassV3.height) 
                     
                    else if (this.randomList[i] % 9 === 0)
                        game.context.drawImage(game.WallGrassV2, 0, 0, game.WallGrassV2.width, game.WallGrassV2.height, 0, 0, game.WallGrassV2.width, game.WallGrassV2.height) 
                    
                    else if (this.randomList[i] % 998 === 0 && game.gameMode === GameMode.StoryMode) {
                        game.context.drawImage(game.WallGrassTree, 0, 0, game.WallGrassTree.width, game.WallGrassTree.height, 0, 0, game.WallGrassTree.width, game.WallGrassTree.height)
                        game.blueCubeWoodenLock = false
                    }
 
                    else
                        game.context.drawImage(game.WallGrassV1, 0, 0, game.WallGrassV1.width, game.WallGrassV1.height, 0, 0, game.WallGrassV1.width, game.WallGrassV1.height) 


                    game.context.restore()
                         
                }
            }
            
            } else if (game.spriteStyle) {

            if (this.colorNumber === 1) {
                levels[game.currentLevel].unlocks.forEach(function(unlock) {
                    if (unlock.colorNumber === 1) {
                        if (unlock.activated) {
                            game.context.drawImage(game.UnlockedRockBlue, 0, 0, game.UnlockedRockBlue.width, game.UnlockedRockBlue.height, self.x, self.y, game.UnlockedRockBlue.width, game.UnlockedRockBlue.height)
                        
                        } else if (!unlock.activated) {
                            game.context.drawImage(game.UnlockRockBlue, 0, 0, game.UnlockRockBlue.width, game.UnlockRockBlue.height, self.x, self.y, game.UnlockRockBlue.width, game.UnlockRockBlue.height)    
                        }
                    }
                })
            } else if (this.colorNumber === 2) {
                levels[game.currentLevel].unlocks.forEach(function(unlock) {
                    if (unlock.colorNumber === 2) {
                        if (unlock.activated) {
                            game.context.drawImage(game.UnlockedRockPurple, 0, 0, game.UnlockedRockPurple.width, game.UnlockedRockPurple.height, self.x, self.y, game.UnlockedRockPurple.width, game.UnlockedRockPurple.height)    
                    
                        } else if (!unlock.activated) {
                            game.context.drawImage(game.UnlockRockPurple, 0, 0, game.UnlockRockPurple.width, game.UnlockRockPurple.height, self.x, self.y, game.UnlockRockPurple.width, game.UnlockRockPurple.height)    
                        }
                    }
                })
            }       
            } else if (game.plasticStyle) {
                game.context.fillStyle = this.color1
                game.context.fillRect(this.x, this.y, this.width, this.height)
             
        } 
 
    }
};

class Water extends GameObject {
    constructor(x, y, width, height, color1){
        super(x, y, width, height, color1)
        this.spriteX = 0
    }

    Draw() {
        if (game.spriteStyle === true) {
            if (game.gameState === GameState.Started) {
                var numMilliseconds = new Date().getTime()
                if (numMilliseconds % 5 === 4) {
                    this.spriteX = (this.spriteX + 54) % (54*49)
                }
            }
            

            for (var x = this.left(); x < this.right(); x = x + 50) {
                for (var y = this.top(); y < this.bottom(); y = y + 50) {
                    game.context.drawImage(game.Water_Medium2, this.spriteX, 0, 54, game.Water_Medium2.height, x, y, 54, game.Water_Medium2.height)
                }
            }
        }
        if (game.plasticStyle === true) {
            game.context.fillStyle = this.color1;
            game.context.fillRect(this.x, this.y, this.width, this.height)
        }
    }
    Update() {
        
    }
    
    reset() {  
    } 
};

class Item extends GameObject {
    constructor(x, y, width, height, typeNumber){
        super(x, y, width, height)
        this.typeNumber = typeNumber
    }

    Draw() {
    var self = this
    levels[game.currentLevel].players.forEach(function(player) {
        if (self.typeNumber === 1 && !player.allowMovementWater && game.spriteStyle) {    
            game.context.drawImage(game.LifeJacket, 0, 0, game.LifeJacket.width, game.LifeJacket.height, self.x, self.y, game.LifeJacket.width, game.LifeJacket.height)     
        }

        if (self.typeNumber === 1 && !player.allowMovementWater && game.plasticStyle) {    
            game.context.drawImage(game.LifeJacketPlastic, 0, 0, game.LifeJacketPlastic.width, game.LifeJacketPlastic.height, self.x, self.y, game.LifeJacketPlastic.width, game.LifeJacketPlastic.height)     
        }
    })
    }
    
    Update() {
        
    }  
};

class ChangeDirectionSquare extends GameObject {
    constructor(x, y, width, height){
        super(x, y, width, height, "red")
    }
    Draw() {
        game.context.fillStyle = this.color1
        game.context.fillRect(this.x, this.y, this.width, this.height)
    }
};

class Unlock extends GameObject {
    constructor(x, y, width, height, color1, color2, unlockWall, activatedcolor, colorNumber){
        super(x, y, width, height, color1)
        this.color2 = color2
        this.unlockWall = unlockWall
        this.activatedcolor = activatedcolor
        this.colorNumber = colorNumber
    }

    update() {
       var self = this
       levels[game.currentLevel].players.forEach(function(player) {
            if (self.intersectsAll(player)) {
                self.unlockWall.allowMovement = true
                self.activated = true
            }
        })

       levels[game.currentLevel].boxes.forEach(function(box) {
            if (self.intersectsAll(box)) {
                self.unlockWall.allowMovement = true
                self.activated = true
            }
        })
    }

    Draw(){
        if (game.spriteStyle == true) {
            if (this.colorNumber == 1) {
            
                if (this.activated) {
                    game.context.drawImage(game.SwitchW1ActivatedBlue, 0, 0, game.SwitchW1ActivatedBlue.width, game.SwitchW1ActivatedBlue.height, this.x, this.y, game.SwitchW1ActivatedBlue.width, game.SwitchW1ActivatedBlue.height)
                
                } else {
                    game.context.drawImage(game.SwitchW1Blue, 0, 0, game.SwitchW1Blue.width, game.SwitchW1Blue.height, this.x, this.y, game.SwitchW1Blue.width, game.SwitchW1Blue.height)    
                }
            
            } else if (this.colorNumber == 2) {
            
                if (this.activated) {
                    game.context.drawImage(game.SwitchW1ActivatedPurple, 0, 0, game.SwitchW1ActivatedPurple.width, game.SwitchW1ActivatedPurple.height, this.x, this.y, game.SwitchW1ActivatedPurple.width, game.SwitchW1ActivatedPurple.height)
                
                } else {
                    game.context.drawImage(game.SwitchW1Purple, 0, 0, game.SwitchW1Purple.width, game.SwitchW1Purple.height, this.x, this.y, game.SwitchW1Purple.width, game.SwitchW1Purple.height)    
                }
            }            
        
        } else if (game.plasticStyle == true) {
            game.context.fillStyle = this.color1
            game.context.fillRect(this.x, this.y, this.width, this.height)
            if (this.activated) {
                game.context.fillStyle = this.activatedcolor
            
            } else {
                 game.context.fillStyle = this.color2    
            }
            game.context.fillRect(this.x + 10, this.y + 10, 30, 30)
        }
    }
};

class Teleporter extends GameObject {
    constructor(x, y, otherTeleporter, width, height, colorNumber){
        super(x, y, width, height)
        this.colorNumber = colorNumber
        this.stop = false
        this.otherTeleporter = otherTeleporter
    }

    update() {
       var self = this
       levels[game.currentLevel].players.forEach(function(player) {
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

    Draw(){
        if (game.spriteStyle) {
            if (this.colorNumber == 1) {
                game.context.drawImage(game.TeleporterTomatoSprite, 0, 0, game.TeleporterTomatoSprite.width, game.TeleporterTomatoSprite.height, this.x, this.y, game.TeleporterTomatoSprite.width, game.TeleporterTomatoSprite.height)   
            }

            if (this.colorNumber == 2) {
                game.context.drawImage(game.TeleporterPurpleSprite, 0, 0, game.TeleporterPurpleSprite.width, game.TeleporterPurpleSprite.height, this.x, this.y, game.TeleporterPurpleSprite.width, game.TeleporterPurpleSprite.height)   
            }
        }

        else if (game.plasticStyle) {
            if (this.colorNumber == 1) {
                game.context.drawImage(game.TeleporterTomato, 0, 0, game.TeleporterTomato.width, game.TeleporterTomato.height, this.x, this.y, game.TeleporterTomato.width, game.TeleporterTomato.height)   
            }

            if (this.colorNumber == 2) {
                game.context.drawImage(game.TeleporterPurple, 0, 0, game.TeleporterPurple.width, game.TeleporterPurple.height, this.x, this.y, game.TeleporterPurple.width, game.TeleporterPurple.height)   
            }

        }
    }   
};

class FinishArea extends GameObject {
    constructor(x, y, width, height){
        super(x, y, width, height, "pink")
    }
    
    Draw(){
        game.context.fillStyle = this.color1;
        game.context.fillRect(this.x, this.y, this.width, this.height)
    }
};

class MenuItem {
    constructor(title, value, color, action) {
        this.title = title
        this.value = value
        this.color = color
        this.action = action
    }
}

class Menu {
    constructor(menuItems) {
        this.menuItems = menuItems;
        this.selectedIndex = 0
    }
    moveUp() {
        if (this.selectedIndex !== 0){
            this.selectedIndex = this.selectedIndex - 1
        }  
    }

    moveDown() {
        const numMenuItems = this.menuItems.length
        if (this.selectedIndex !== numMenuItems - 1){
            this.selectedIndex = this.selectedIndex + 1
        }  
    }

    selected() {
        var menuItem = this.menuItems[this.selectedIndex]
        menuItem.action()
    }

    Draw() {
        var self = this
        const numMenuItems = this.menuItems.length
        const totalHeight = 600
        const totalHeight2 = 400
        const heightPerItem = totalHeight / numMenuItems
        const heightPerItem2 = totalHeight2 / numMenuItems
        game.context.font = '115px Arial'
        this.menuItems.forEach(function(menuItem, index) {
            if (index === self.selectedIndex && game.gameState !== GameState.Lost && game.gameState !== GameState.WonStage) {
                game.context.fillStyle = "rgba(128, 128, 128, 0.8)";
                game.context.fillRect(0, heightPerItem * index, 850, heightPerItem)
                game.selectorY = heightPerItem * index
                if (game.gameState === GameState.Menu) {
                    game.selectorY2 = heightPerItem * index + heightPerItem
                }

                if (game.gameState === GameState.Paused && game.gameMode === GameMode.StoryMode) {
                    game.selectorY2 = heightPerItem * index + heightPerItem
                }
                
                if (game.gameState === GameState.Rules && game.gameMode === GameMode.Shop) {
                    game.selectorY2 = heightPerItem * index + heightPerItem
                }
            }
            else if (index === self.selectedIndex && game.gameState === GameState.Lost || index === self.selectedIndex && game.gameState === GameState.WonStage) {
                game.context.fillStyle = "rgba(128, 128, 128, 0.8)";
                game.context.fillRect(0, 200 + heightPerItem2 * index, 850, heightPerItem2)
                game.selectorY = 200 + heightPerItem2 * index
                game.selectorY2 = 350 + heightPerItem2 * index
            }
        
            ///

            if (game.gameState === GameState.Lost) {
                game.context.font = '115px Arial'
                game.context.fillStyle = menuItem.color
                game.context.fillText(menuItem.title, 10, 290 + heightPerItem2 * index)
            }

            else if (game.gameState === GameState.WonStage) {
                game.context.font = '115px Arial'
                game.context.fillStyle = menuItem.color
                game.context.fillText(menuItem.title, 10, 290 + heightPerItem2 * index)
            }
            
            else {
                game.context.font = '115px Arial'
                game.context.fillStyle = menuItem.color
                game.context.fillText(menuItem.title, 10, 90 + heightPerItem * index)
            }   
        })
    }
}

var MainMenu = new Menu([
    new MenuItem("Story Mode", 1, "rgb(0, 166, 255)", function() {
        game.gameState = GameState.Rules
        game.gameMode = GameMode.StoryMode
    }),
    new MenuItem("Freeplay", 2, "rgb(0, 132, 216)", function() {
        game.gameState = GameState.Rules
        game.gameMode = GameMode.Freeplay
        game.oldLevel = game.currentLevel
    }),
    new MenuItem("Shop", 3, "rgb(0, 67, 190)", function() {
        game.gameState = GameState.Rules
        game.gameMode = GameMode.Shop
    }),
    new MenuItem("Items Info", 4, "rgb(0, 0, 139)", function() {
        game.gameState = GameState.Rules
        game.gameMode = GameMode.ItemsInfo
     }),
    /*new MenuItem("Settings", 5, "darkblue", function() {
        game.gameState = GameState.Rules
        game.gameMode = GameMode.Settings
    })*/
])

var ShopMenu = new Menu([
    new MenuItem("Player", 1, "lightcoral", function() {
        game.gameState = GameState.Started
        game.shopMode = ShopMode.Player
    }),
    new MenuItem("Background", 2, "gold", function() {
        game.gameState = GameState.Started
        game.shopMode =  ShopMode.Backround
    }),
])
   
var LoseMenu = new Menu([
    new MenuItem("Retry", 1, "violet", function() {
        game.SetGameState(GameState.Started)
        game.Restart()
        game.loseCounterStop = false
    }),
    new MenuItem("Return to menu", 2, "hotpink", function(){
        game.Restart()
        game.gameState = GameState.Menu
        game.loseCounterStop = false
    })
])
            
var WinMenu = new Menu([
    new MenuItem("Continue", 1, "rgb(255, 0, 100)", function(){
        game.NextLevel()

    }),
    new MenuItem("Return to menu", 2, "deeppink", function(){
        game.NextLevel()
        game.gameState = GameState.Menu
    }),               
])

var PauseMenu = new Menu([
    new MenuItem("Resume", 1, "rgb(255, 0, 86)", function(){
        game.SetGameState(GameState.Started)

    }),
    new MenuItem("Retry", 2, "rgb(255, 105, 0)", function() {
        game.SetGameState(GameState.Started)
        game.Restart()
    }),
    new MenuItem("Return to menu", 3, "rgb(255, 170, 0)", function(){
        game.Restart()
        game.gameState = GameState.Menu
    }),               
])
    
var Menus = [
    MainMenu,
    ShopMenu,
    LoseMenu,
    WinMenu,
    PauseMenu    
]