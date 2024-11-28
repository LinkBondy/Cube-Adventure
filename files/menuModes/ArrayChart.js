'use strict'
const { images } = require('../drawing/Images')
const { gameMode, shopStates, gameStates, cubeStyle, BackgroundStyles, drawUpdate } = require('../data/GameData')
const { canvas } = require('../drawing/Canvas')
export class ArrayChartController {
  constructor () {
    this.arrayCharts = []
    this.arrayCharts.push(this.playerStyles = new ArrayChart(/* title */'Player Style', /* currentSelection */0, /* offsetX */12.5, /* offsetY */300, /* sectionWidth */200, /* sectionHeight */200, /* loopWidth */4, /* loopHeight */1, [
      new ArrayChartImage(/* displayName */'Classic', /* locked */false, /* value */cubeStyle.Classic, /* image */images.BlueCube_400x400, /* imageStartX */0, /* imageStartY */0, /* imageStartWidth */200, /* imageStartHeight */images.BlueCube_400x400.height),
      new ArrayChartImage('Alien', drawUpdate.blueCubeAlienLock, cubeStyle.Alien, images.BlueCube_400x400, 200, 0, 200, images.BlueCube_400x400.height, /* checkLocked */function () { this.locked = drawUpdate.blueCubeAlienLock }),
      new ArrayChartImage('Sad', drawUpdate.blueCubeSadLock, cubeStyle.Sad, images.BlueCube_400x400, 400, 0, 200, images.BlueCube_400x400.height, function () { this.locked = drawUpdate.blueCubeSadLock }),
      new ArrayChartImage('Happy', drawUpdate.highestLevelLock, cubeStyle.Happy, images.BlueCube_400x400, 600, 0, 200, images.BlueCube_400x400.height, function () { this.locked = drawUpdate.highestLevelLock })
    ], function (arrayChart, currentSelectionCheck) {
      if (!arrayChart.items[currentSelectionCheck].locked) {
        arrayChart.currentSelection = currentSelectionCheck
        gameStates.currentCubeStyle = arrayChart.items[arrayChart.currentSelection].value
      }
    }))

    this.arrayCharts.push(this.colours = new ArrayChart(/* title */'Theme Colour', /* currentSelection */10, /* offsetX */0, /* offsetY */300, /* sectionWidth */135.75, /* sectionHeight */135.75, /* loopWidth */6, /* loopHeight */2, [
      new ArrayChartBox(/* displayName */'Red', /* locked */false, /* value */'rgb(255, 159, 159)', /* colour */'rgb(255, 159, 159)', /* border */'rgb(0, 0, 0)'),
      new ArrayChartBox('Orange', false, 'rgb(255, 190, 134)', 'rgb(255, 190, 134)', 'rgb(0, 0, 0)'),
      new ArrayChartBox('Yellow', false, 'rgb(252, 242, 169)', 'rgb(252, 242, 169)', 'rgb(0, 0, 0)'),
      new ArrayChartBox('Lime', false, 'rgb(179, 255, 179)', 'rgb(179, 255, 179)', 'rgb(0, 0, 0)'),
      new ArrayChartBox('Aqua', false, 'rgb(178, 255, 215)', 'rgb(178, 255, 215)', 'rgb(0, 0, 0)'),
      new ArrayChartBox('Light Blue', false, 'rgb(179, 249, 255)', 'rgb(179, 249, 255)', 'rgb(0, 0, 0)'),
      new ArrayChartBox('Blue', false, 'rgb(169, 186, 255)', 'rgb(169, 186, 255)', 'rgb(0, 0, 0)'),
      new ArrayChartBox('Purple', false, 'rgb(209, 161, 249)', 'rgb(216, 179, 255)', 'rgb(0, 0, 0)'),
      new ArrayChartBox('Magenta', false, 'rgb(235, 159, 230)', 'rgb(235, 169, 245)', 'rgb(0, 0, 0)'),
      new ArrayChartBox('Pink', false, 'rgb(255, 179, 217)', 'rgb(255, 179, 217)', 'rgb(0, 0, 0)'),
      new ArrayChartBox('Light Gray', false, 'lightgray', 'lightgray', 'rgb(0, 0, 0)'),
      new ArrayChartBox('Dark Gray', false, 'rgb(145, 145, 145)', 'rgb(145, 145, 145)', 'rgb(0, 0, 0)')
    ], function (arrayChart, currentSelectionCheck) {
      if (!arrayChart.items[currentSelectionCheck].locked) {
        arrayChart.currentSelection = currentSelectionCheck
        gameStates.currentThemeColour = arrayChart.items[arrayChart.currentSelection].value
      }
    }))

    this.arrayCharts.push(this.backroundStyles = new ArrayChart(/* title */'Background Style', /* currentSelection */0, /* offsetX */220, /* offsetY */300, /* sectionWidth */200, /* sectionHeight */200, /* loopWidth */2, /* loopHeight */1, [
      new ArrayChartImage(/* displayName */'Classic', /* locked */false, /* value */BackgroundStyles.Classic, /* image */images.WallGrassClassicA_400x400, /* imageStartX */-4, /* imageStartY */0, /* imageStartWidth */images.WallGrassClassicA_400x400.width, /* imageStartHeight */images.WallGrassClassicA_400x400.height),
      new ArrayChartBox(/* displayName */'Plastic', drawUpdate.highestLevelLock, /* value */BackgroundStyles.Plastic, /* colour */'rgb(127, 127, 127)', /* border */'rgb(0, 0, 0)', /* checkLocked */function () { this.locked = drawUpdate.highestLevelLock })
    ], function (arrayChart, currentSelectionCheck) {
      if (!arrayChart.items[currentSelectionCheck].locked) {
        arrayChart.currentSelection = currentSelectionCheck
        gameStates.currentBackgroundStyle = arrayChart.items[arrayChart.currentSelection].value
      }
    }))
  }

  findCurrentArrayChart () {
    if (gameStates.currentGameMode === gameMode.Shop) {
      if (gameStates.currentShopState === shopStates.Player) { return 0 }
      if (gameStates.currentShopState === shopStates.ThemeColour) { return 1 }
      if (gameStates.currentShopState === shopStates.Background) { return 2 }
    }
    return false
  }
};

class ArrayChart {
  constructor (title, currentSelection, offsetX, offsetY, sectionWidth, sectionHeight, loopWidth, loopHeight, items, action) {
    this.title = title
    this.currentSelection = currentSelection
    this.offsetX = offsetX
    this.offsetY = offsetY
    this.sectionWidth = sectionWidth
    this.sectionHeight = sectionHeight
    this.loopWidth = loopWidth
    this.loopHeight = loopHeight
    this.items = items
    this.action = action
    this.currentX = 0
    this.currentY = 0
  }

  Draw () {
    canvas.context.font = '95px Arial'
    canvas.context.fillStyle = 'darkGray'
    canvas.context.fillText(this.title, 10, 80)
    canvas.context.fillStyle = 'black'
    canvas.context.fillText(this.items[this.currentSelection].displayName, 10, 200)
  }

  update () {
    let numberDrew = 0
    for (let col = 0; col < this.loopHeight; col++) {
      for (let row = 0; row < this.loopWidth; row++) {
        this.items[numberDrew].currentArrayChart = gameStates.arrayChartController.arrayCharts[gameStates.arrayChartController.findCurrentArrayChart()]
        this.items[numberDrew].x = 5 * (row + 1) + this.offsetX + row * this.sectionWidth
        this.items[numberDrew].y = 5 * (col + 1) + this.offsetY + col * this.sectionHeight
        if (numberDrew === this.currentSelection) { this.items[numberDrew].currentSelected = true } else { this.items[numberDrew].currentSelected = false }
        numberDrew++
      }
    }
  }

  Keydown (event, keybindArray) {
    // "Left"
    if ((keybindArray[0/* left */].keybindA === event.key || keybindArray[0/* left */].keybindB === event.key) && this.currentX !== 0) { this.currentX-- }

    // "Right"
    if ((keybindArray[1/* right */].keybindA === event.key || keybindArray[1/* right */].keybindB === event.key) && this.currentX !== this.loopWidth - 1) { this.currentX++ }

    // "Up"
    if ((keybindArray[2/* up */].keybindA === event.key || keybindArray[2/* up */].keybindB === event.key) && this.currentY !== 0) { this.currentY-- }

    // "Down"
    if ((keybindArray[3/* down */].keybindA === event.key || keybindArray[3/* down */].keybindB === event.key) && this.currentY !== this.loopHeight - 1) { this.currentY++ }

    // "Select"
    if ((keybindArray[4/* select */].keybindA === event.key || keybindArray[4/* select */].keybindB === event.key)) { this.action(this, this.currentY * this.loopWidth + this.currentX) }
  }
};

class ArrayChartBox {
  constructor (displayName, locked, value, colour, border, checkedLocked) {
    this.displayName = displayName
    this.locked = locked
    this.value = value
    this.colour = colour
    this.border = border
    this.checkedLocked = checkedLocked
    this.currentSelected = false
  }

  Draw (row, col) {
    if (!this.locked) {
      if (this.currentArrayChart.currentX === row && this.currentArrayChart.currentY === col) { canvas.context.fillStyle = 'white' } else { canvas.context.fillStyle = this.border }
      canvas.context.fillRect(this.x, this.y, this.currentArrayChart.sectionWidth, this.currentArrayChart.sectionHeight)
      // darwBoxStart
      canvas.context.fillStyle = this.colour
      canvas.context.fillRect(this.x + 5, this.y + 5, this.currentArrayChart.sectionWidth - 10, this.currentArrayChart.sectionHeight - 10)
    } else {
      if (this.currentArrayChart.currentX === row && this.currentArrayChart.currentY === col) {
        canvas.context.fillStyle = 'white'
        canvas.context.fillRect(this.x, this.y, this.currentArrayChart.sectionWidth, this.currentArrayChart.sectionHeight)
      }
      canvas.context.drawImage(images.LockedIcon, 0, 0, images.LockedIcon.width, images.LockedIcon.height, this.x + 5, this.y + 5, this.currentArrayChart.sectionWidth - 10, this.currentArrayChart.sectionHeight - 10)
    }
  }

  Update () {
    if (this.checkedLocked !== undefined && this.checkedLocked !== null) { this.checkedLocked() }
  }
};

class ArrayChartImage {
  constructor (displayName, locked, value, image, imageStartX, imageStartY, imageStartWidth, imageStartHeight, checkedLocked) {
    this.displayName = displayName
    this.locked = locked
    this.value = value
    this.image = image
    this.imageStartX = imageStartX
    this.imageStartY = imageStartY
    this.imageStartWidth = imageStartWidth
    this.imageStartHeight = imageStartHeight
    this.checkedLocked = checkedLocked
    this.currentSelected = false
  }

  Draw (row, col) {
    if (this.currentArrayChart.currentX === row && this.currentArrayChart.currentY === col) {
      canvas.context.fillStyle = 'white'
      canvas.context.fillRect(this.x, this.y, this.currentArrayChart.sectionWidth, this.currentArrayChart.sectionHeight)
    }
    if (!this.locked) { canvas.context.drawImage(this.image, this.imageStartX, this.imageStartY, this.imageStartWidth, this.imageStartHeight, this.x + 5, this.y + 5, this.currentArrayChart.sectionWidth - 10, this.currentArrayChart.sectionHeight - 10) } else { canvas.context.drawImage(images.LockedIcon, 0, 0, images.LockedIcon.width, images.LockedIcon.height, this.x + 5, this.y + 5, this.currentArrayChart.sectionWidth - 10, this.currentArrayChart.sectionHeight - 10) }
  }

  Update () {
    if (this.checkedLocked !== undefined && this.checkedLocked !== null) { this.checkedLocked() }
  }
};
