"use strict";

var forward_x = true
var forward_y = true
var block_speed = 5

var CubeStyle = {
    BlueCube: 0,
    Alien: 1,
    Lava: 2,
}

/*var StoryMode = {
    x = 0,
    y = 0,
    width = 850,
    height = 200        
}

var Freeplay = {
    x = 0,
    y = 200,
    width = 850,
    height = 200        
}

var Shop = {
    x = 0,
    y = 400,
    width = 850,
    height = 200        
}

var Player = {
    x = 0,
    y = 0,
    width = 850,
    height = 300        
}

var Backround = {
    x = 0,
    y = 300,
    width = 850,
    height = 300        
}*/

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
        if (game.gameState == GameState.Started && game.spriteStyle && game.gameMode != GameMode.Shop || game.gameState == GameState.Rules && game.spriteStyle && game.gameMode == GameMode.Freeplay) {
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
    constructor(x,y, width, height, color1, color2, color3, movesLeftRight, movesUpDown, block_speed = 5) {
        super(x, y, width, height, color1)
        this.color2 = color2
        this.color3 = color3
        this.forward_x = true
        this.forward_y = false
        this.block_speed = block_speed
        this.original_x = x
        this.original_y = y
        this.originalMovesLeftRight = movesLeftRight
        this.originaMovesUpDown = movesUpDown
        this.movesLeftRight = movesLeftRight
        this.movesUpDown = movesUpDown

    }
   
    resetPosition() {
       this.x = this.original_x 
       this.y = this.original_y
       this.movesLeftRight = this.originalMovesLeftRight
       this.movesUpDown = this.originaMovesUpDown
    }   
    update() {
        var oldX = this.x
        var oldY = this.y
        var intersectsWall = false
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
        game.context.drawImage(game.RedCube, 0, 0, game.RedCube.width, game.RedCube.height, this.x, this.y, this.width, this.height)
    } 
};

class Player extends GameObject {
    constructor(x,y, width, height, color1, color2, color3) {
        super(x, y, width, height, color1)
        this.color2 = color2
        this.color3 = color3
        this.forward_x = true
        this.forward_y = false
        this.block_speed = block_speed
        this.original_x = x
        this.original_y = y

        this.BlueCubeAlienStyle = false
        this.BlueCubeLavaStyle = false
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

        if (intersectsWall) {
            this.y = oldY
        } 
    }
    resetPosition() {
        this.x = this.original_x 
        this.y = this.original_y
    }   
    update() {

    }   
    Draw() {
        if (Player.CubeStyle == CubeStyle.BlueCube) {
            game.context.drawImage(game.BlueCube, 0, 0, game.BlueCube.width, game.BlueCube.height, this.x, this.y, game.BlueCube.width, game.BlueCube.height)
        }
        
        else if (Player.CubeStyle == CubeStyle.Alien) {
            game.context.drawImage(game.BlueCubeAlien, 0, 0, game.BlueCubeAlien.width, game.BlueCubeAlien.height, this.x, this.y, game.BlueCubeAlien.width, game.BlueCubeAlien.height)
        }

        else if (Player.CubeStyle == CubeStyle.Lava) {
            game.context.drawImage(game.BlueCubeLava, 0, 0, game.BlueCubeLava.width, game.BlueCubeLava.height, this.x, this.y, game.BlueCubeLava.width, game.BlueCubeLava.height)
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
        if (this.allowMovement && game.classicStyle) {
            game.context.fillStyle = this.color2
            game.context.fillRect(this.x, this.y, this.width, this.height)
         
         } else if (this.invisibleWall) {
             game.context.drawImage(game.InvisibleWall, 0, 0, game.InvisibleWall.width, game.InvisibleWall.height, this.x - 2,  this.y - 2, game.InvisibleWall.width, game.InvisibleWall.height)            
         
        } else if (game.spriteStyle && !this.allowMovement && this.colorNumber != 1 && this.colorNumber != 2) {
             var i = 0; 
             for (var x = this.left(); x < this.right(); x = x + 50) {
                 for (var y = this.top(); y < this.bottom(); y = y + 50) {
                     i++

                    game.context.save()

                    game.context.translate(x - 2, y - 2)
                    //if (this.randomList[i] % 2 == 0)
                        //game.context.rotate(90 * Math.PI / 180)
                        

                    if (this.randomList[i]  % 40 == 0)
                        game.context.drawImage(game.WallGrassV3, 0, 0, game.WallGrassV3.width, game.WallGrassV3.height, 0, 0, game.WallGrassV3.width, game.WallGrassV3.height) 
                     
                    else if (this.randomList[i]  % 9 == 0)
                        game.context.drawImage(game.WallGrassV2, 0, 0, game.WallGrassV2.width, game.WallGrassV2.height, 0, 0, game.WallGrassV2.width, game.WallGrassV2.height) 
                     
                    else
                        game.context.drawImage(game.WallGrassV1, 0, 0, game.WallGrassV1.width, game.WallGrassV1.height, 0, 0, game.WallGrassV1.width, game.WallGrassV1.height) 


                    game.context.restore()
                         
                 }
            }
            
            } else if (game.spriteStyle) {

            if (this.colorNumber == 1) {
                levels[game.currentLevel].unlocks.forEach(function(unlock) {
                    if (unlock.colorNumber == 1) {
                        if (unlock.activated) {
                            game.context.drawImage(game.UnlockedRockBlue, 0, 0, game.UnlockedRockBlue.width, game.UnlockedRockBlue.height, self.x, self.y, game.UnlockedRockBlue.width, game.UnlockedRockBlue.height)
                        
                        } else if (!unlock.activated) {
                            game.context.drawImage(game.UnlockRockBlue, 0, 0, game.UnlockRockBlue.width, game.UnlockRockBlue.height, self.x, self.y, game.UnlockRockBlue.width, game.UnlockRockBlue.height)    
                        }
                    }
                })
            } else if (this.colorNumber == 2) {
                levels[game.currentLevel].unlocks.forEach(function(unlock) {
                    if (unlock.colorNumber == 2) {
                        if (unlock.activated) {
                            game.context.drawImage(game.UnlockedRockPurple, 0, 0, game.UnlockedRockPurple.width, game.UnlockedRockPurple.height, self.x, self.y, game.UnlockedRockPurple.width, game.UnlockedRockPurple.height)    
                    
                        } else if (!unlock.activated) {
                            game.context.drawImage(game.UnlockRockPurple, 0, 0, game.UnlockRockPurple.width, game.UnlockRockPurple.height, self.x, self.y, game.UnlockRockPurple.width, game.UnlockRockPurple.height)    
                        }
                    }
                })
            }       
            } else if (game.classicStyle) {
                game.context.fillStyle = this.color1
                game.context.fillRect(this.x, this.y, this.width, this.height)
             
        } 
 
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
        
        } else if (game.classicStyle == true) {
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
    constructor(x, y, otherTeleporter, width, height, color1, color2, Id){
        super(x, y, width, height, color1)
        this.color2 = color2
        this.Id = Id
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
    game.context.drawImage(game.Teleporter, 0, 0, game.Teleporter.width, game.Teleporter.height, this.x, this.y, game.Teleporter.width, game.Teleporter.height)   
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

class Selector extends GameObject{
    constructor(x, y, width, heigh, Selected, OldY){
        super(x, y, width, heigh, "gray")
        this.Selected = false
        this.x = 0
        this.OldY = OldY
        this.y = 0
        this.width = 850
        this.height = 200

    } 
    Draw() {
        game.context.fillStyle = this.color1;
        if (game.gameMode == GameMode.Shop && game.shopMode == ShopMode.ShopMenu && game.gameState == GameState.Rules) {
            this.height = 300
            game.context.fillRect(this.x, this.y, this.width, this.height)      
        } else {
        //if (game.gameState == GameState.Menu) 
            this.height = 200
            game.context.fillRect(this.x, this.y, this.width, this.height)
        }
         
    }

    moveDown() {
        if (game.gameState == GameState.Menu) {
            this.y = this.y + 200
        
        } else if (game.gameState == GameState.Rules && game.gameMode == GameMode.Shop) {
            this.y = this.y + 300
        }
    } 
    
    moveUp() {
        if (game.gameState == GameState.Menu) {
            this.y = this.y - 200
            
        } else if (game.gameState == GameState.Rules && game.gameMode == GameMode.Shop) {
            this.y = this.y - 300    
        }
    }

    updateMenu() {

        if (this.y == 0 && game.gameState == GameState.Menu) {
            game.gameState = GameState.Rules
            game.gameMode = GameMode.StoryMode
            this.OldY = this.y
            
        }

        if (this.y == 200 && game.gameState == GameState.Menu) {
            game.gameState = GameState.Rules
            game.gameMode = GameMode.Freeplay
            this.oldY = this.y
        }

        if (this.y == 400 && game.gameState == GameState.Menu) {
            game.gameState = GameState.Rules
            game.gameMode = GameMode.Shop
            this.oldY = this.y
            this.y = 0
        }
        
    }
    
    updateShop() {
        if (this.y == 0 && game.gameState == GameState.Rules && game.gameMode == GameMode.Shop) {
            game.gameState = GameState.Started
            game.shopMode = ShopMode.Backround
            this.oldY = this.y
        }
        
        if (this.y == 300 && game.gameState == GameState.Rules && game.gameMode == GameMode.Shop) {
            game.gameState = GameState.Started
            game.shopMode = ShopMode.Player
            this.oldY = this.y
        }
    }
};
