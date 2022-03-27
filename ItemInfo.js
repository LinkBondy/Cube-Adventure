"use strict";
const {images} = require('./Images')
const {draw} = require('./Draw')
const {canvas} = require('./Canvas')
const {gameStates} = require('./GameData');

var LockedFeature = {
    infoEnemy: 1,
    infoEnemy2: 9,
    ///
    infoWall: 2,
    infoInvisibleWall: 5,
    infoWater: 7,
    ///
    infoSwitch: 4,
    infoTeleporter: 6,
    ///
    infoRock: 4,
    ///
    infoLifeJacket: 7,
    ///
    infoHole: 8,
}

export var itemInfoVaribles = {
    game: undefined
}

export class InfoController {
    constructor() {
        this.items = [
            new EnemyInfo(),
            new BarrierInfo(),
            new IntractableInfo(),
            new UnlockableInfo(),
            new CollectableInfo(),
            new TrapInfo()
        ]
        this.itemIndex = 0
        this.slideIndex = 0
        this.unlockedLevel = 0
    }

    Keydown(event) {
    // Down 
    if ((event.keyCode === 40 || event.key === "s") && this.itemIndex < (this.items.length - 1)) {
        this.itemIndex = this.itemIndex + 1
        this.slideIndex = 0
    }
       
    // Up
    if ((event.keyCode === 38 ||  event.key === "w") && this.itemIndex != 0) {
        this.itemIndex = this.itemIndex - 1
        this.slideIndex = 0
    }
        
    // Right   
    if ((event.keyCode === 39 ||  event.key === "d") && this.slideIndex < this.items[this.itemIndex].slides.length - 1)
        this.slideIndex = this.slideIndex + 1
    
    // Left  
    if ((event.keyCode === 37 ||  event.key === "a") && this.slideIndex > 0)
        this.slideIndex = this.slideIndex - 1
    }

    Mousedown(event) {
            // Forward   
            if (event.offsetY > 150 && event.offsetY < 450) {
                if ((this.items[this.itemIndex].slides.length - 1) === this.slideIndex) 
                this.slideIndex = 0
                else
                this.slideIndex++
                return
            }

            // Down 
            if (event.offsetY > 450 && event.offsetY < 600 && event.offsetX < 850 && this.itemIndex < (this.items.length - 1)) {
                this.itemIndex = this.itemIndex + 1
                this.slideIndex = 0
            }
                
            // Up
            if (event.offsetY > 0 && event.offsetY < 150 && event.offsetX < 850 && this.itemIndex != 0) {
                this.itemIndex = this.itemIndex - 1
                this.slideIndex = 0
            }
    }

    Draw() {
        this.items[this.itemIndex].slides[this.slideIndex].Draw()
    }
};

class ItemText {
    constructor(text, textSize, textColour, textX, textY) {
        this.text = text
        this.textSize = textSize
        this.textColour = textColour
        this.textX = textX
        this.textY = textY
    }

    Draw() {
        canvas.context.font = this.textSize;
        canvas.context.fillStyle = this.textColour;
        canvas.context.fillText(this.text, this.textX, this.textY);
    }
};

class ItemImage {
    constructor(fullImage, image, placementX, placementY, placementWidth, placementHeight, imageX, imageY, imageWidth, imageHeight,) {
        this.image = image
        this.imageX = imageX
        this.imageY = imageY
        this.imageWidth = imageWidth
        this.imageHeight = imageHeight
        ///
        this.placementX = placementX
        this.placementY = placementY
        this.placementWidth = placementWidth
        this.placementHeight = placementHeight
        ///
        this.fullImage = fullImage
    }

    Draw() {
        if (this.fullImage) {
            canvas.context.drawImage(this.image, this.imageX, this.imageY, this.imageWidth, this.imageHeight, this.placementX, this.placementY, this.placementWidth, this.placementHeight)
        } else if (!this.fullImage) {  
            draw.DrawImage(this.image, this.placementX, this.placementY) 
        }
    }
};

class ItemSlide {
    constructor(items, neededFeature) {
        this.items = items
        this.neededFeature = neededFeature
    }

    ShouldShowSlide(unlockedLevel) {
        return unlockedLevel >= this.neededFeature
        
    }
    Draw() {    
        canvas.context.font = "25px Arial";
        canvas.context.fillStyle = 'black'            
        canvas.context.fillText(gameStates.infoController.slideIndex + " / " + (gameStates.infoController.items[gameStates.infoController.itemIndex].slides.length - 1), 790, 590);
        ///
        if (this.ShouldShowSlide(gameStates.infoController.unlockedLevel)) {
            this.items.forEach(function(itemInfo) {
                itemInfo.Draw()
            })
        } else {
        canvas.context.font = "125px Arial";
        canvas.context.fillStyle = 'lightcoral'
        canvas.context.fillText("Item " + gameStates.infoController.slideIndex, 200, 200);
        ///
        canvas.context.font = "150px Arial";
        canvas.context.fillStyle = 'lime'
        canvas.context.fillText("Beat Level " + this.neededFeature, 10, 550);   
      }
    }
};

class EnemyInfo {
    constructor() {
        var titleSlide = new ItemSlide([
            new ItemText("Enemies", "200px Arial", "purple", 10, 400),
            ], 0)

        var slide1 = new ItemSlide([
            new ItemImage(false, images.RedCube_200x200, 625, 10),
            ///
            new ItemText("Cubers", "150px Arial", "purple", 10, 150),
            new ItemText("Cubers move left to right or up to", "50px Arial", "rgb(2, 0, 139)", 10, 275),
            new ItemText("down at a time.", "50px Arial", "rgb(2, 0, 139)", 10, 350),
            new ItemText("Players lose when they touch a cuber.", "48px Arial", "rgb(2, 0, 139)", 10, 450),
            new ItemText("Cubers can move at different speeds.", "48px Arial", "rgb(2, 0, 139)", 10, 525),
            ], LockedFeature.infoEnemy)

        var slide2 = new ItemSlide([
            new ItemImage(false, images.RedCube_200x200, 625, 10),
            /// 
            new ItemText("Cubers", "150px Arial", "purple", 10, 150),
            new ItemText("Cubers can activate switches.", "50px Arial", "rgb(2, 0, 139)", 10, 275),
            new ItemText("Cubers move at normal speed in", "50px Arial", "rgb(2, 0, 139)", 10, 375),
            new ItemText("water when they collect life jackets.", "50px Arial", "rgb(2, 0, 139)", 15, 450)
        ], LockedFeature.infoEnemy2)

        this.slides = [titleSlide, slide1, slide2]
    }
};

class BarrierInfo {
    constructor() {
        var titleSlide = new ItemSlide([
            new ItemText("Barriers", "200px Arial", "purple", 10, 400),
            ], 0)
        
        var cuberSlide1 = new ItemSlide([
            new ItemImage(false, images.WallGrassV1_200x200, 550, 10),
            ///
            new ItemText("Walls", "200px Arial", "purple", 10, 160),
            new ItemText("Walls stop players movement.", "60px Arial", 'rgb(2, 0, 139)', 10, 300),
            new ItemText("Cubers turn the opposite way,", "60px Arial", 'rgb(2, 0, 139)', 10, 400),
            new ItemText("when they touch walls.", "60px Arial", 'rgb(2, 0, 139)', 15, 475),
            new ItemText("Walls can look different.", "60px Arial", "rgb(2, 0, 139)", 10, 575)
        ], LockedFeature.infoWall)

        var fakeWallSlide1 = new ItemSlide([
            new ItemImage(false, images.InvisibleWall_200x200V2, 625, 10),
            ///
            new ItemText("Fake Walls", "120px Arial", "purple", 10, 150),
            new ItemText("Fake walls look like walls but", "60px Arial", "rgb(2, 0, 139)", 10, 300),
            new ItemText("their different.", "60px Arial", "rgb(2, 0, 139)", 10, 375),
            new ItemText("Fake walls don't do anthing.", "60px Arial", "rgb(2, 0, 139)", 10, 475),
            new ItemText("Fake walls can look different.", "60px Arial", "rgb(2, 0, 139)", 10, 575),
        ], LockedFeature.infoInvisibleWall)

        var waterSlide1 = new ItemSlide([
            new ItemImage(false, images.Water_Medium_200x200, 600, 10),
            ///
            new ItemText("Water", "200px Arial", "purple", 10, 175),
            new ItemText("Players need life jackets to go in", "55px Arial", "rgb(2, 0, 139)", 10, 300),
            new ItemText("the water.", "55px Arial", "rgb(2, 0, 139)", 10, 375),
            new ItemText("Cubers can go into water but,", "55px Arial", "rgb(2, 0, 139)", 10, 475),
            new ItemText("they move at half the speed.", "55px Arial", "rgb(2, 0, 139)", 10, 550)
        ], LockedFeature.infoWater)

        this.slides = [titleSlide, cuberSlide1, fakeWallSlide1, waterSlide1]
    }
};

class IntractableInfo {
    constructor() {
        var titleSlide = new ItemSlide([
            new ItemText("Intractables", "150px Arial", "purple", 10, 400),
            ], 0)

        var switchSlide1 = new ItemSlide([
            new ItemImage(false, images.SwitchW1Blue_200x200, 630, 10),
            ///
            new ItemText("Switches", "145px Arial", "purple", 10, 150),
            new ItemText("Players and ememies can go on switches.", "45px Arial", "rgb(2, 0, 139)", 10, 275),
            new ItemText("When players and ememies go on a", "45px Arial", "rgb(2, 0, 139)", 10, 375),
            new ItemText("switch it activates.", "45px Arial", "rgb(2, 0, 139)", 10, 425),
            new ItemText("Different switches can have different", "45px Arial", "rgb(2, 0, 139)", 10, 525),
            new ItemText("colours.", "45px Arial", "rgb(2, 0, 139)", 10, 575),
        ], LockedFeature.infoSwitch)

        var switchSlide2 = new ItemSlide([
            new ItemImage(false, images.SwitchW1Purple_200x200, 630, 10),
            /// 
            new ItemText("Switches", "145px Arial", "purple", 10, 150),
            new ItemText("When a switch gets activated,", "55px Arial", "rgb(2, 0, 139)", 10, 275),
            new ItemText("unlockable rocks with the same", "55px Arial", "rgb(2, 0, 139)", 10, 350),
            new ItemText("colour breaks apart.", "55px Arial", "rgb(2, 0, 139)", 10, 425)
        ], LockedFeature.infoSwitch)

        var teleporterSlide1 = new ItemSlide([
            new ItemImage(false, images.TeleporterTomatoSprite_200x200, 625, 10),
            ///
            new ItemText("Teleporters", "120px Arial", "purple", 10, 150),
            new ItemText("When players go on teleporters", "55px Arial", "rgb(2, 0, 139)", 10, 275),
            new ItemText("they teleport to the matching", "55px Arial", "rgb(2, 0, 139)", 10, 350),
            new ItemText("teleporter.", "55px Arial", "rgb(2, 0, 139)", 10, 425),
            new ItemText("Only players can use teleporters.", "55px Arial", "rgb(2, 0, 139)", 10, 525)
        ], LockedFeature.infoTeleporter)

        this.slides = [titleSlide, switchSlide1, switchSlide2, teleporterSlide1]


    }
};

class UnlockableInfo {
    constructor() {
        var titleSlide = new ItemSlide([
            new ItemText("Unlockables", "150px Arial", "purple", 10, 400),
            ], 0)

        var slide1 = new ItemSlide([
            new ItemImage(false, images.UnlockRockBlue_200x200, 625, 10),
            ///
            new ItemText("Rocks", "200px Arial", "purple", 10, 175),
            new ItemText("Rocks act as barriers when altogether.", "45px Arial", "rgb(2, 0, 139)", 10, 300),
            new ItemText("Different rocks can have different colours.", "45px Arial", "rgb(2, 0, 139)", 10, 400),
            new ItemText("When switches activate they break rocks", "45px Arial", "rgb(2, 0, 139)", 10, 500),
            new ItemText("with the same colour.", "45px Arial", "rgb(2, 0, 139)", 10, 550),
        ], LockedFeature.infoRock)

        var slide2 = new ItemSlide([
            new ItemImage(false, images.UnlockRockPurple_200x200, 625, 10),
            ///
            new ItemText("Rocks", "200px Arial", "purple", 10, 175),
            new ItemText("Once broken players and", "65px Arial", "rgb(2, 0, 139)", 10, 300),
            new ItemText("cubers can go through", "65px Arial", "rgb(2, 0, 139)", 10, 375),
            new ItemText("them.", "65px Arial", "rgb(2, 0, 139)", 10, 450),

        ], LockedFeature.infoRock)
        this.slides = [titleSlide, slide1, slide2]
    }
};

class CollectableInfo {
    constructor() {
        var titleSlide = new ItemSlide([
            new ItemText("Collectables", "150px Arial", "purple", 10, 400),
            ], 0)

        var slide1 = new ItemSlide([
            new ItemImage(false, images.LifeJacket_200x200, 625, 10),
            //
            new ItemText("Life Jacket", "120px Arial", "purple", 10, 150),
            new ItemText("When players pick up life jackets they", "50px Arial", "rgb(2, 0, 139)", 10, 262.5),
            new ItemText("can go in water.", "50px Arial", "rgb(2, 0, 139)", 10, 337.5),
            new ItemText("When cubers pick up life jackets", "50px Arial", "rgb(2, 0, 139)", 10, 437.5),
            new ItemText("they can move at nomral speed in", "50px Arial", "rgb(2, 0, 139)", 10, 500),
            new ItemText("water.", "50px Arial", "rgb(2, 0, 139)", 10, 562.5)
        ], LockedFeature.infoLifeJacket)
        this.slides = [titleSlide, slide1]
    }
};

class TrapInfo {
    constructor() {
        var titleSlide = new ItemSlide([
            new ItemText("Traps", "300px Arial", "purple", 10, 400),
        ], 0)

        var slide1 = new ItemSlide([
            new ItemImage(true, images.Hole_200x200, 550, 10, 200, 200, 0, 0, 200, 200),
            ///
            new ItemText("Holes", "200px Arial", "purple", 10, 160),
            new ItemText("When a player or enemy go over a hole,", "45px Arial", "rgb(2, 0, 139)", 10, 275),
            new ItemText("its cover starts to fall.", "45px Arial", "rgb(2, 0, 139)", 10, 325),
            new ItemText("Different holes have different amounts of", "45px Arial", "rgb(2, 0, 139)", 10, 400),
            new ItemText("times a player can go over it.", "45px Arial", "rgb(2, 0, 139)", 10, 450),
            new ItemText("When a player goes over a uncovered", "45px Arial", "rgb(2, 0, 139)", 10, 525),
            new ItemText("hole you lose.", "45px Arial", "rgb(2, 0, 139)", 10, 575),
        ], LockedFeature.infoHole)    

        var slide2 = new ItemSlide([
            new ItemImage(true, images.Hole_200x200, 550, 10, 200, 200, 200, 0, 200, 200),
            ///
            new ItemText("Holes", "200px Arial", "purple", 10, 160),
            new ItemText("When a enemy goes over a", "60px Arial", "rgb(2, 0, 139)", 10, 300),
            new ItemText("uncovered hole they go the", "60px Arial", "rgb(2, 0, 139)", 10, 375),
            new ItemText("opposite way.", "60px Arial", "rgb(2, 0, 139)", 10, 450)
        ], LockedFeature.infoHole)
        this.slides = [titleSlide, slide1, slide2]

    }
};