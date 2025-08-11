'use strict'
const { images } = require('../drawing/Images')
const { gameMode, shopStates, gameStates, cubeStyle, BackgroundStyles, drawUpdate, eventFunctions } = require('../data/GameData')
const { canvas } = require('../drawing/Canvas')
export class ArrayChartController {
  constructor () {
    this.arrayCharts = []
    this.arrayCharts.push(this.playerStyles = new ArrayChart(/* title */'Player Style', /* currentSelection */0, /* x */12.5, /* y */300, /* width */835, /* height */300, /* prioritize */ 'width', /* itemsWidth */4, /* itemsHeight */1, [
      new ArrayChartImage(/* displayName */'Classic', /* value */cubeStyle.Classic, /* image */images.BlueCube_400x400, /* imageStartX */0, /* imageStartY */0, /* imageStartWidth */200, /* imageStartHeight */images.BlueCube_400x400.height),
      new ArrayChartImage('Alien', cubeStyle.Alien, images.BlueCube_400x400, 200, 0, 200, images.BlueCube_400x400.height, /* checkLocked */function () { return drawUpdate.blueCubeAlienLock }),
      new ArrayChartImage('Sad', cubeStyle.Sad, images.BlueCube_400x400, 400, 0, 200, images.BlueCube_400x400.height, function () { return drawUpdate.blueCubeSadLock }),
      new ArrayChartImage('Happy', cubeStyle.Happy, images.BlueCube_400x400, 600, 0, 200, images.BlueCube_400x400.height, function () { return drawUpdate.highestLevelLock })
    ], function (arrayChart, currentSelectionCheck) {
      if (!arrayChart.items[currentSelectionCheck].checkedLocked()) {
        arrayChart.currentSelection = currentSelectionCheck
        gameStates.currentCubeStyle = arrayChart.items[arrayChart.currentSelection].value
      }
    }))

    this.arrayCharts.push(this.colours = new ArrayChart(/* title */'Theme Colour', /* currentSelection */12, /* x */0, /* y */300, /* width */850, /* height */300, /* prioritize */ 'width', /* itemsWidth */7, /* itemsHeight */2, [
      new ArrayChartBox(/* displayName */'Red', /* value */'rgb(255, 159, 159)', /* colour */'rgb(255, 159, 159)', /* border */'rgb(0, 0, 0)'),
      new ArrayChartBox('Orange', 'rgb(255, 190, 134)', 'rgb(255, 190, 134)', 'rgb(0, 0, 0)'),
      new ArrayChartBox('Yellow', 'rgb(252, 242, 169)', 'rgb(252, 242, 169)', 'rgb(0, 0, 0)'),
      new ArrayChartBox('Pistachio', 'rgb(230, 255, 180)', 'rgb(230, 255, 180)', 'rgb(0, 0, 0)'),
      new ArrayChartBox('Lime', 'rgb(179, 255, 179)', 'rgb(179, 255, 179)', 'rgb(0, 0, 0)'),
      new ArrayChartBox('Aqua', 'rgb(178, 255, 215)', 'rgb(178, 255, 215)', 'rgb(0, 0, 0)'),
      new ArrayChartBox('Light Blue', 'rgb(179, 249, 255)', 'rgb(179, 249, 255)', 'rgb(0, 0, 0)'),
      new ArrayChartBox('Blue', 'rgb(169, 186, 255)', 'rgb(169, 186, 255)', 'rgb(0, 0, 0)'),
      new ArrayChartBox('Purple', 'rgb(209, 161, 249)', 'rgb(216, 179, 255)', 'rgb(0, 0, 0)'),
      new ArrayChartBox('Magenta', 'rgb(235, 159, 230)', 'rgb(235, 169, 245)', 'rgb(0, 0, 0)'),
      new ArrayChartBox('Pink', 'rgb(255, 179, 217)', 'rgb(255, 179, 217)', 'rgb(0, 0, 0)'),
      new ArrayChartBox('Snow', 'rgb(240, 240, 240)', 'rgb(240, 240, 240)', 'rgb(0, 0, 0)'),
      new ArrayChartBox('Light Gray', 'lightgray', 'lightgray', 'rgb(0, 0, 0)'),
      new ArrayChartBox('Dark Gray', 'rgb(145, 145, 145)', 'rgb(145, 145, 145)', 'rgb(0, 0, 0)')
    ], function (arrayChart, currentSelectionCheck) {
      if (!arrayChart.items[currentSelectionCheck].checkedLocked()) {
        arrayChart.currentSelection = currentSelectionCheck
        gameStates.currentThemeColour = arrayChart.items[arrayChart.currentSelection].value
      }
    }))

    this.arrayCharts.push(this.backroundStyles = new ArrayChart(/* title */'Background Style', /* currentSelection */0, /* x */100, /* y */300, /* width */650, /* height */300, /* prioritize */'height', /* itemsWidth */2, /* itemsHeight */1, [
      new ArrayChartImage(/* displayName */'Classic', /* value */BackgroundStyles.Classic, /* image */images.WallGrassClassicA_400x400, /* imageStartX */-4, /* imageStartY */0, /* imageStartWidth */images.WallGrassClassicA_400x400.width, /* imageStartHeight */images.WallGrassClassicA_400x400.height),
      new ArrayChartBox(/* displayName */'Plastic', /* value */BackgroundStyles.Plastic, /* colour */'rgb(127, 127, 127)', /* border */'rgb(0, 0, 0)', /* checkLocked */function () { return drawUpdate.highestLevelLock })
    ], function (arrayChart, currentSelectionCheck) {
      if (!arrayChart.items[currentSelectionCheck].checkedLocked()) {
        arrayChart.currentSelection = currentSelectionCheck
        gameStates.currentBackgroundStyle = arrayChart.items[arrayChart.currentSelection].value
      }
    }))
  }

  start () {
    for (let i = 0; i < this.arrayCharts.length; i++) {
      const currentArrayChart = this.arrayCharts[i]
      let width = 0
      let height = 0
      if (currentArrayChart.prioritize === 'width') {
        width = (currentArrayChart.width - (currentArrayChart.itemsWidth + 2) * 5) / currentArrayChart.itemsWidth
        height = width
      } else if (currentArrayChart.prioritize === 'height') {
        height = (currentArrayChart.height - (currentArrayChart.itemsHeight + 2) * 5) / currentArrayChart.itemsHeight
        width = height
      } else {
        console.log('Prioritze Not Found')
      }
      for (let r = 0; r < currentArrayChart.itemsWidth; r++) {
        for (let c = 0; c < currentArrayChart.itemsHeight; c++) {
          const currentArrayChartItem = currentArrayChart.items[r + c * currentArrayChart.itemsWidth]
          currentArrayChartItem.width = width
          currentArrayChartItem.height = height
          currentArrayChartItem.x = (currentArrayChartItem.width + 5) * r + 5 + currentArrayChart.x
          currentArrayChartItem.y = (currentArrayChartItem.height + 5) * c + 5 + currentArrayChart.y
        }
      }
    }
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
  constructor (title, currentSelection, x, y, width, height, prioritize, itemsWidth, itemsHeight, items, action) {
    this.title = title
    this.currentSelection = currentSelection
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.prioritize = prioritize
    this.itemsWidth = itemsWidth
    this.itemsHeight = itemsHeight
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
    for (let col = 0; col < this.itemsHeight; col++) {
      for (let row = 0; row < this.itemsWidth; row++) {
        const itemDrew = row + col * this.itemsWidth
        this.items[itemDrew].currentArrayChart = gameStates.arrayChartController.arrayCharts[gameStates.arrayChartController.findCurrentArrayChart()]
        // this.items[numberDrew].x = 5 * (row + 1) + this.offsetX + row * this.sectionWidth
        // this.items[numberDrew].y = 5 * (col + 1) + this.offsetY + col * this.sectionHeight
        if (itemDrew === this.currentSelection) { this.items[itemDrew].currentSelected = true } else { this.items[itemDrew].currentSelected = false }
      }
    }
  }

  Keydown (event, keybindArray) {
    // "Left"
    if ((keybindArray[0/* left */].keybindA === event.key || keybindArray[0/* left */].keybindB === event.key) && this.currentX !== 0) { this.currentX-- }

    // "Right"
    if ((keybindArray[1/* right */].keybindA === event.key || keybindArray[1/* right */].keybindB === event.key) && this.currentX !== this.itemsWidth - 1) { this.currentX++ }

    // "Up"
    if ((keybindArray[2/* up */].keybindA === event.key || keybindArray[2/* up */].keybindB === event.key) && this.currentY !== 0) { this.currentY-- }

    // "Down"
    if ((keybindArray[3/* down */].keybindA === event.key || keybindArray[3/* down */].keybindB === event.key) && this.currentY !== this.itemsHeight - 1) { this.currentY++ }

    // "Select"
    if ((keybindArray[4/* select */].keybindA === event.key || keybindArray[4/* select */].keybindB === event.key)) { this.action(this, this.currentY * this.itemsWidth + this.currentX) }
  }

  MouseDown (event) {
    for (let numberChecked = 0; numberChecked < this.items.length; numberChecked++) {
      const item = this.items[numberChecked]
      if (eventFunctions.isTouching(item.x, item.y, item.width, item.height, event)) {
        this.action(this, numberChecked)
      }
    }
  }
};

class ArrayChartBox {
  constructor (displayName, value, colour, border, checkedLocked) {
    this.displayName = displayName
    this.value = value
    this.colour = colour
    this.border = border
    if (checkedLocked === undefined) {
      this.checkedLocked = function () { return false }
    } else {
      this.checkedLocked = checkedLocked
    }
    this.currentSelected = false
  }

  Draw (row, col) {
    if (!this.checkedLocked()) {
      if (this.currentArrayChart.currentX === row && this.currentArrayChart.currentY === col) { canvas.context.fillStyle = 'white' } else { canvas.context.fillStyle = this.border }
      canvas.context.fillRect(this.x, this.y, this.width, this.height)
      // darwBoxStart
      canvas.context.fillStyle = this.colour
      canvas.context.fillRect(this.x + 5, this.y + 5, this.width - 10, this.height - 10)
    } else {
      if (this.currentArrayChart.currentX === row && this.currentArrayChart.currentY === col) {
        canvas.context.fillStyle = 'white'
        canvas.context.fillRect(this.x, this.y, this.width, this.height)
      }
      canvas.context.drawImage(images.LockedIcon, 0, 0, images.LockedIcon.width, images.LockedIcon.height, this.x + 5, this.y + 5, this.width - 10, this.height - 10)
    }
  }
};

class ArrayChartImage {
  constructor (displayName, value, image, imageStartX, imageStartY, imageStartWidth, imageStartHeight, checkedLocked) {
    this.displayName = displayName
    this.value = value
    this.image = image
    this.imageStartX = imageStartX
    this.imageStartY = imageStartY
    this.imageStartWidth = imageStartWidth
    this.imageStartHeight = imageStartHeight
    if (checkedLocked === undefined) {
      this.checkedLocked = function () { return false }
    } else {
      this.checkedLocked = checkedLocked
    }
    this.currentSelected = false
  }

  Draw (row, col) {
    if (this.currentArrayChart.currentX === row && this.currentArrayChart.currentY === col) {
      canvas.context.fillStyle = 'white'
      canvas.context.fillRect(this.x, this.y, this.width, this.height)
    }
    if (!this.checkedLocked()) { canvas.context.drawImage(this.image, this.imageStartX, this.imageStartY, this.imageStartWidth, this.imageStartHeight, this.x + 5, this.y + 5, this.width - 10, this.height - 10) } else { canvas.context.drawImage(images.LockedIcon, 0, 0, images.LockedIcon.width, images.LockedIcon.height, this.x + 5, this.y + 5, this.width - 10, this.height - 10) }
  }
}
