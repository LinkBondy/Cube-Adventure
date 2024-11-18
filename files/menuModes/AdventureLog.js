'use strict'
const { images } = require('../drawing/Images')
const { draw } = require('../drawing/Draw')
const { canvas } = require('../drawing/Canvas')
const { gameStates } = require('../data/GameData')
const { Requirement } = require('../levels/Levels')

const LockedFeature = {
  infoCuber: false,
  infoCuber2: new Requirement(0, 9 - 1),
  infoExpander: new Requirement(0, 10 - 1),
  // infoCuber3: [new Requirement(1, 1 - 1)],
  // infoRollphant1: [new Requirement(2, 1 - 1)],
  ///
  infoWall: false,
  infoInvisibleWall: new Requirement(0, 4 - 1),
  infoWater: new Requirement(0, 7 - 1),
  ///
  infoSwitch: new Requirement(0, 3 - 1),
  infoTeleporter: new Requirement(0, 5 - 1),
  ///
  infoRock: new Requirement(0, 3 - 1),
  ///
  infoLifeJacket: new Requirement(0, 7 - 1),
  // infoFinishItems: [new Requirement(1, 1 - 1)],
  // infoPryoShard: [new Requirement(1, 3 - 1)],
  ///
  infoHole: new Requirement(0, 8 - 1)
  // infoCactus: [new Requirement(0, 11 - 1)]
}

export class InfoController {
  constructor () {
    this.items = [
      new Tutorials(),
      new EnemyInfo(),
      new BarrierInfo(),
      new IntractableInfo(),
      new UnlockableInfo(),
      new CollectableInfo(),
      new TrapInfo()
    ]
    this.itemIndex = 0
    this.slideIndex = 0
  }

  Keydown (event, keybindArray) {
    // Down
    if ((keybindArray[3/* down */].keybindA === event.key || keybindArray[3/* down */].keybindB === event.key) && this.itemIndex < (this.items.length - 1)) {
      this.itemIndex = this.itemIndex + 1
      this.slideIndex = 0
    }

    // Up
    if ((keybindArray[2/* up */].keybindA === event.key || keybindArray[2/* up */].keybindB === event.key) && this.itemIndex !== 0) {
      this.itemIndex = this.itemIndex - 1
      this.slideIndex = 0
    }

    // Right
    if ((keybindArray[1/* right */].keybindA === event.key || keybindArray[1/* right */].keybindB === event.key) && this.slideIndex < this.items[this.itemIndex].slides.length - 1) { this.slideIndex = this.slideIndex + 1 }

    // Left
    if ((keybindArray[0/* left */].keybindA === event.key || keybindArray[0/* left */].keybindB === event.key) && this.slideIndex > 0) { this.slideIndex = this.slideIndex - 1 }
  }

  Mousedown (event) {
    // Forward
    if (event.offsetY > 150 && event.offsetY < 450) {
      if ((this.items[this.itemIndex].slides.length - 1) === this.slideIndex) { this.slideIndex = 0 } else { this.slideIndex++ }
      return
    }

    // Down
    if (event.offsetY > 450 && event.offsetY < 600 && event.offsetX < 850 && this.itemIndex < (this.items.length - 1)) {
      this.itemIndex = this.itemIndex + 1
      this.slideIndex = 0
    }

    // Up
    if (event.offsetY > 0 && event.offsetY < 150 && event.offsetX < 850 && this.itemIndex !== 0) {
      this.itemIndex = this.itemIndex - 1
      this.slideIndex = 0
    }
  }

  Draw () {
    this.items[this.itemIndex].slides[this.slideIndex].Draw()
  }
};

class ItemText {
  constructor (text, textSize, textColour, textX, textY) {
    this.text = text
    this.textSize = textSize
    this.textColour = textColour
    this.textX = textX
    this.textY = textY
  }

  Draw () {
    canvas.context.font = this.textSize
    canvas.context.fillStyle = this.textColour
    canvas.context.fillText(this.text, this.textX, this.textY)
  }
};

class ItemImage {
  constructor (fullImage, image, placementX, placementY, placementWidth, placementHeight, imageX, imageY, imageWidth, imageHeight) {
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

  Draw () {
    if (this.fullImage) {
      canvas.context.drawImage(this.image, this.imageX, this.imageY, this.imageWidth, this.imageHeight, this.placementX, this.placementY, this.placementWidth, this.placementHeight)
    } else if (!this.fullImage) {
      draw.DrawImage(this.image, this.placementX, this.placementY)
    }
  }
};

class ItemSlide {
  constructor (items, neededFeature) {
    this.items = items
    this.neededFeature = neededFeature
  }

  ShouldShowSlide () {
    if (this.neededFeature === false) {
      return true
    } else {
      const levelRequired = gameStates.gameController.worlds[this.neededFeature.worldRequired].levels[this.neededFeature.levelRequired]
      if ((levelRequired.completed)) {
        return true
      }
    }
    return false
  }

  Draw () {
    canvas.context.font = '25px Arial'
    canvas.context.fillStyle = 'black'
    canvas.context.fillText(gameStates.infoController.slideIndex + ' / ' + (gameStates.infoController.items[gameStates.infoController.itemIndex].slides.length - 1), 790, 590)
    ///
    if (this.ShouldShowSlide()) {
      this.items.forEach(function (itemInfo) {
        itemInfo.Draw()
      })
    } else {
      canvas.context.textAlign = 'center'
      canvas.context.font = '125px Arial'
      const gradientA = canvas.context.createLinearGradient(350, 0, 500, 0)
      gradientA.addColorStop(0, 'rgb(235, 110, 160)')
      gradientA.addColorStop(1, 'rgb(245, 130, 180)')
      canvas.context.fillStyle = gradientA
      canvas.context.fillText('Item ' + gameStates.infoController.slideIndex, 425, 200)
      ///
      canvas.context.font = '55px Arial'
      const gradientB = canvas.context.createLinearGradient(125, 0, 600, 0)
      gradientB.addColorStop(0, 'rgb(0, 205, 0)')
      gradientB.addColorStop(1, 'rgb(0, 195, 150)')
      canvas.context.fillStyle = gradientB
      canvas.context.fillText('Beat ' + gameStates.gameController.worlds[this.neededFeature.worldRequired].title + ',', 425, 450)
      canvas.context.fillText(gameStates.gameController.worlds[this.neededFeature.worldRequired].levels[this.neededFeature.levelRequired].title, 425, 550)
      canvas.context.textAlign = 'left'
    }
  }
};

class Tutorials {
  constructor () {
    const titleSlide = new ItemSlide([
      new ItemText('Tutorials', '200px Arial', 'purple', 10, 400)
    ], false)

    const slide1 = new ItemSlide([
      new ItemText('Basics', '125px Arial', 'purple', 200, 125),
      ///
      new ItemText('Get to the finish line to beat levels.', '48px Arial', 'rgb(2, 0, 139)', 10, 225),
      new ItemText('Watch out for enemies.', '48px Arial', 'rgb(2, 0, 139)', 10, 315),
      new ItemText('Use A, W, S, D or Arrow Keys to move.', '48px Arial', 'rgb(2, 0, 139)', 10, 415),
      new ItemText('Tap above, below, to the left or to the', '48px Arial', 'rgb(2, 0, 139)', 10, 515),
      new ItemText('right of the player to move.', '48px Arial', 'rgb(2, 0, 139)', 10, 575)
    ], false)

    this.slides = [titleSlide, slide1]
  }
};

class EnemyInfo {
  constructor () {
    const titleSlide = new ItemSlide([
      new ItemText('Enemies', '200px Arial', 'purple', 10, 400)
    ], false)

    const slide1 = new ItemSlide([
      new ItemImage(false, images.RedCube_200x200, 562.5, 10),
      ///
      new ItemText('Cubers', '150px Arial', 'purple', 10, 150),
      new ItemText('Cubers move left to right or up to', '50px Arial', 'rgb(2, 0, 139)', 10, 275),
      new ItemText('down at a time.', '50px Arial', 'rgb(2, 0, 139)', 10, 350),
      new ItemText('Players lose when they touch a cuber.', '48px Arial', 'rgb(2, 0, 139)', 10, 450),
      new ItemText('Cubers can move at different speeds.', '48px Arial', 'rgb(2, 0, 139)', 10, 550)
    ], LockedFeature.infoCuber)

    const slide2 = new ItemSlide([
      new ItemImage(false, images.RedCube_200x200, 562.5, 10),
      ///
      new ItemText('Cubers', '150px Arial', 'purple', 10, 150),
      new ItemText('Cubers may wait when they touch', '50px Arial', 'rgb(2, 0, 139)', 10, 262.5),
      new ItemText('walls or change direction.', '50px Arial', 'rgb(2, 0, 139)', 15, 337.5),
      new ItemText('Cuber may only wait when moving', '50px Arial', 'rgb(2, 0, 139)', 10, 425),
      new ItemText('certain directions.', '50px Arial', 'rgb(2, 0, 139)', 10, 500),
      new ItemText('Cubers can wait different times.', '50px Arial', 'rgb(2, 0, 139)', 10, 587.5)
    ], LockedFeature.infoCuber2)

    const slide3 = new ItemSlide([
      new ItemImage(false, images.Expander_200x200, 610, 10),
      ///
      new ItemText('Expanders', '120px Arial', 'purple', 10, 150),
      new ItemText('Expanders can expand and shrink.', '50px Arial', 'rgb(2, 0, 139)', 10, 250),
      new ItemText('Expanders can be different size and', '50px Arial', 'rgb(2, 0, 139)', 10, 340),
      new ItemText('grow to be different sizes', '50px Arial', 'rgb(2, 0, 139)', 10, 410),
      new ItemText('Expanders may wait when they', '50px Arial', 'rgb(2, 0, 139)', 10, 500),
      new ItemText('expand or shink to a certain size.', '50px Arial', 'rgb(2, 0, 139)', 10, 570)
    ], LockedFeature.infoExpander)

    /* const slide4 = new ItemSlide([
      new ItemImage(false, images.RedCube_200x200, 562.5, 10),
      ///
      new ItemText('Cubers', '150px Arial', 'purple', 10, 150),
      new ItemText('Cubers can activate switches.', '60px Arial', 'rgb(2, 0, 139)', 10, 275),
      new ItemText('Cubers can be defeated.', '60px Arial', 'rgb(2, 0, 139)', 10, 375),
      new ItemText('Cubers may drop items when', '60px Arial', 'rgb(2, 0, 139)', 10, 475),
      new ItemText('defeated.', '60px Arial', 'rgb(2, 0, 139)', 10, 550)
    ], LockedFeature.infoCuber3) */

    /* const slide4 = new ItemSlide([
      new ItemImage(false, images.Rollphant_200x200, 600, 10),
      ///
      new ItemText('Rollphant', '125px Arial', 'purple', 10, 150)
    ], LockedFeature.infoRollphant1) */

    this.slides = [titleSlide, slide1, slide2, slide3]
  }
};

class BarrierInfo {
  constructor () {
    const titleSlide = new ItemSlide([
      new ItemText('Barriers', '200px Arial', 'purple', 10, 400)
    ], false)

    const cuberSlide1 = new ItemSlide([
      new ItemImage(false, images.WallGrassClassicA_200x200, 550, 10),
      ///
      new ItemText('Walls', '200px Arial', 'purple', 10, 160),
      new ItemText("Walls stop players' movement.", '60px Arial', 'rgb(2, 0, 139)', 10, 300),
      new ItemText('Cubers turn the opposite way,', '60px Arial', 'rgb(2, 0, 139)', 10, 400),
      new ItemText('when they touch walls.', '60px Arial', 'rgb(2, 0, 139)', 15, 475),
      new ItemText('Walls can look different.', '60px Arial', 'rgb(2, 0, 139)', 10, 575)
    ], LockedFeature.infoWall)

    const fakeWallSlide1 = new ItemSlide([
      new ItemImage(false, images.InvisibleWall_200x200, 625, 10),
      ///
      new ItemText('Fake Walls', '120px Arial', 'purple', 10, 150),
      new ItemText('Fake walls look like walls but', '60px Arial', 'rgb(2, 0, 139)', 10, 300),
      new ItemText('their different.', '60px Arial', 'rgb(2, 0, 139)', 10, 375),
      new ItemText("Fake walls don't do anthing.", '60px Arial', 'rgb(2, 0, 139)', 10, 475),
      new ItemText('Fake walls can look different.', '60px Arial', 'rgb(2, 0, 139)', 10, 575)
    ], LockedFeature.infoInvisibleWall)

    const waterSlide1 = new ItemSlide([
      new ItemImage(false, images.Water_Medium_200x200, 600, 10),
      ///
      new ItemText('Water', '200px Arial', 'purple', 10, 175),
      new ItemText('Players need life jackets to go in', '55px Arial', 'rgb(2, 0, 139)', 10, 300),
      new ItemText('water.', '55px Arial', 'rgb(2, 0, 139)', 10, 375),
      new ItemText('Cubers can go into water but,', '55px Arial', 'rgb(2, 0, 139)', 10, 475),
      new ItemText('they move at half the speed.', '55px Arial', 'rgb(2, 0, 139)', 10, 550)
    ], LockedFeature.infoWater)

    this.slides = [titleSlide, cuberSlide1, fakeWallSlide1, waterSlide1]
  }
};

class IntractableInfo {
  constructor () {
    const titleSlide = new ItemSlide([
      new ItemText('Intractables', '150px Arial', 'purple', 10, 400)
    ], false)

    const switchSlide1 = new ItemSlide([
      new ItemImage(false, images.BlueSwitch_200x200, 550, 10),
      ///
      new ItemText('Reverse', '125px Arial', 'purple', 10, 100),
      new ItemText('Tiles', '125px Arial', 'purple', 75, 220),
      new ItemText('Players can only go on reverse tiles.', '50px Arial', 'rgb(2, 0, 139)', 10, 275),
      new ItemText('When players go on a reverse tile, it ', '50px Arial', 'rgb(2, 0, 139)', 10, 375),
      new ItemText('activates.', '50px Arial', 'rgb(2, 0, 139)', 10, 425),
      new ItemText('Different reverse tiles can have', '50px Arial', 'rgb(2, 0, 139)', 10, 525),
      new ItemText('different colours.', '50px Arial', 'rgb(2, 0, 139)', 10, 575)
    ], LockedFeature.infoSwitch)

    const switchSlide2 = new ItemSlide([
      new ItemImage(false, images.PinkSwitch_200x200, 550, 10),
      ///
      new ItemText('Reverse', '125px Arial', 'purple', 10, 100),
      new ItemText('Tiles', '125px Arial', 'purple', 75, 220),
      new ItemText('When a reverse tile is activated,', '55px Arial', 'rgb(2, 0, 139)', 10, 300),
      new ItemText('rocks with the same colour', '55px Arial', 'rgb(2, 0, 139)', 10, 375),
      new ItemText("break if they're altogether and", '55px Arial', 'rgb(2, 0, 139)', 10, 450),
      new ItemText("become altogether if they're apart.", '55px Arial', 'rgb(2, 0, 139)', 10, 525)
    ], LockedFeature.infoSwitch)

    const teleporterSlide1 = new ItemSlide([
      new ItemImage(false, images.TeleporterTomatoSprite_200x200, 625, 10),
      ///
      new ItemText('Teleporters', '120px Arial', 'purple', 10, 150),
      new ItemText('When players go on teleporters', '55px Arial', 'rgb(2, 0, 139)', 10, 275),
      new ItemText('they teleport to the matching', '55px Arial', 'rgb(2, 0, 139)', 10, 350),
      new ItemText('teleporter.', '55px Arial', 'rgb(2, 0, 139)', 10, 425),
      new ItemText('Only players can use teleporters.', '55px Arial', 'rgb(2, 0, 139)', 10, 525)
    ], LockedFeature.infoTeleporter)

    this.slides = [titleSlide, switchSlide1, switchSlide2, teleporterSlide1]
  }
};

class UnlockableInfo {
  constructor () {
    const titleSlide = new ItemSlide([
      new ItemText('Unlockables', '150px Arial', 'purple', 10, 400)
    ], false)

    const slide1 = new ItemSlide([
      new ItemImage(false, images.UnlockRockBlue_200x200, 625, 10),
      ///
      new ItemText('Rocks', '200px Arial', 'purple', 10, 175),
      new ItemText('Rocks act as barriers when altogether.', '49px Arial', 'rgb(2, 0, 139)', 10, 275),
      new ItemText('When rocks are broken, anything can', '50px Arial', 'rgb(2, 0, 139)', 10, 375),
      new ItemText('go through them.', '50px Arial', 'rgb(2, 0, 139)', 10, 425),
      new ItemText('Different rocks can have different', '50px Arial', 'rgb(2, 0, 139)', 10, 525),
      new ItemText('colours.', '50px Arial', 'rgb(2, 0, 139)', 10, 575)

    ], LockedFeature.infoRock)
    this.slides = [titleSlide, slide1]
  }
};

class CollectableInfo {
  constructor () {
    const titleSlide = new ItemSlide([
      new ItemText('Collectables', '150px Arial', 'purple', 10, 400)
    ], false)

    const slide1 = new ItemSlide([
      new ItemImage(false, images.LifeJacket_200x200, 625, 10),
      //
      new ItemText('Life Jackets', '115px Arial', 'purple', 10, 150),
      new ItemText('When players pick up life jackets,', '50px Arial', 'rgb(2, 0, 139)', 10, 262.5),
      new ItemText('they can go in water.', '50px Arial', 'rgb(2, 0, 139)', 10, 337.5),
      new ItemText('When cubers pick up life jackets,', '50px Arial', 'rgb(2, 0, 139)', 10, 425),
      new ItemText('they can move at a nomral speed in', '50px Arial', 'rgb(2, 0, 139)', 10, 500),
      new ItemText('water.', '50px Arial', 'rgb(2, 0, 139)', 10, 575)
    ], LockedFeature.infoLifeJacket)
    /* const slide2 = new ItemSlide([
      new ItemImage(false, images.YellowKey_200x200, 625, 10),
      //
      new ItemText(' ', '120px Arial', 'purple', 10, 150)
    ], LockedFeature.infoFinishItems)
    const slide3 = new ItemSlide([
      new ItemImage(false, images.PryoShard_200x200, 625, 10),
      //
      new ItemText('', '120px Arial', 'purple', 10, 150)
    ], LockedFeature.infoPryoShard) */
    this.slides = [titleSlide, slide1/*, slide2, slide3 */]
  }
};

class TrapInfo {
  constructor () {
    const titleSlide = new ItemSlide([
      new ItemText('Traps', '300px Arial', 'purple', 10, 400)
    ], false)

    const slide1 = new ItemSlide([
      new ItemImage(true, images.Hole_200x200, 550, 10, 200, 200, 0, 0, 200, 200),
      ///
      new ItemText('Holes', '200px Arial', 'purple', 10, 160),
      new ItemText('When a player or enemy go over a hole,', '45px Arial', 'rgb(2, 0, 139)', 10, 275),
      new ItemText('its cover starts to fall.', '45px Arial', 'rgb(2, 0, 139)', 10, 325),
      new ItemText('Different holes have different amounts of', '45px Arial', 'rgb(2, 0, 139)', 10, 400),
      new ItemText('times a player can go over it.', '45px Arial', 'rgb(2, 0, 139)', 10, 450),
      new ItemText('When a player goes over an uncovered', '45px Arial', 'rgb(2, 0, 139)', 10, 525),
      new ItemText('hole, you lose.', '45px Arial', 'rgb(2, 0, 139)', 10, 575)
    ], LockedFeature.infoHole)

    const slide2 = new ItemSlide([
      new ItemImage(true, images.Hole_200x200, 550, 10, 200, 200, 200, 0, 200, 200),
      ///
      new ItemText('Holes', '200px Arial', 'purple', 10, 160),
      new ItemText('When an enemy approaches', '60px Arial', 'rgb(2, 0, 139)', 10, 300),
      new ItemText('an uncovered hole, they turn', '60px Arial', 'rgb(2, 0, 139)', 10, 375),
      new ItemText('back the other way.', '60px Arial', 'rgb(2, 0, 139)', 10, 450)
    ], LockedFeature.infoHole)
    this.slides = [titleSlide, slide1, slide2]
  }
};
