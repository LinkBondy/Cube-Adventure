"use strict";

var forward_x = true
var forward_y = true
var block_speed = 5

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
        this.color1 = "lightgray"

    }
    
    Draw(){
        if (game.gameState == GameState.Started && game.shopWorld1) {
            this.color1 = "rgb(20, 150, 20)"
        }
        else if (game.gameState == GameState.Started && game.basictheme) {
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
};

class Wall extends GameObject {
    constructor(x, y, width, height, color1, color2, allowMovement, drawLast){
        super(x, y, width, height, color1)
        this.color2 = color2
        this.allowMovement = allowMovement
        this.drawLast = drawLast
    }
};

class ChangeDirectionSquare extends GameObject {
    constructor(x, y, width, height){
        super(x, y, width, height, "red")
    }
};

class Unlock extends GameObject {
    constructor(x, y, width, height, color1, color2, unlockWall, activatedcolor){
        super(x, y, width, height, color1)
        this.color2 = color2
        this.unlockWall = unlockWall
        this.activatedcolor = activatedcolor
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
};

class Selector extends GameObject{
    constructor(x, y, width, heigh, Selected){
        super(0, 0, 850, 200, "gray")
        this.Selected = false

    } 
    Draw() {
        game.context.fillStyle = this.color1;
        game.context.fillRect(this.x, this.y, this.width, this.height) 
    }

    moveDown() {
        this.y = this.y + 200
    } 
    
    moveUp() {
        this.y = this.y - 200
    }

    update() {
    if (this.y == 0) {
        game.gameState = GameState.Rules
        game.gameMode = GameMode.StoryMode
    }

    if (this.y == 200) {
        game.gameState = GameState.Rules
        game.gameMode = GameMode.Freeplay
    }
    
    }
};
