'use strict'
const { images } = require('./Images')
const { gameMode, ShopMode, gameStates, settingStates, cubeStyle, BackgroundStyles, drawUpdate } = require('./GameData')
const { canvas } = require('./Canvas')
export class ArrayChartController {
  constructor () {
    this.arrayCharts = []
    this.arrayCharts.push(this.colours = new ArrayChart(/* title */'Theme Colour', /* currentSelection */10, /* offsetX */0, /* offsetY */300, /* sectionWidth */135.75, /* sectionHeight */135.75, /* loopWidth */6, /* loopHeight */2, [
      new ArrayChartBox(/* displayName */'Red', /* locked */false, /* value */'rgb(255, 179, 179)', /* colour */'rgb(255, 179, 179)', /* boarder */'rgb(0, 0, 0)'),
      new ArrayChartBox('Orange', false, 'rgb(255, 211, 179)', 'rgb(255, 211, 179)', 'rgb(0, 0, 0)'),
      new ArrayChartBox('Yellow', false, 'rgb(255, 243, 179)', 'rgb(255, 243, 179)', 'rgb(0, 0, 0)'),
      new ArrayChartBox('Lime', false, 'rgb(179, 255, 179)', 'rgb(179, 255, 179)', 'rgb(0, 0, 0)'),
      new ArrayChartBox('Aqua', false, 'rgb(178, 255, 210)', 'rgb(178, 255, 210)', 'rgb(0, 0, 0)'),
      new ArrayChartBox('Light Blue', false, 'rgb(179, 249, 255)', 'rgb(179, 249, 255)', 'rgb(0, 0, 0)'),
      new ArrayChartBox('Blue', false, 'rgb(179, 186, 255)', 'rgb(179, 186, 255)', 'rgb(0, 0, 0)'),
      new ArrayChartBox('Purple', false, 'rgb(211, 179, 255)', 'rgb(211, 179, 255)', 'rgb(0, 0, 0)'),
      new ArrayChartBox('Magenta', false, 'rgb(255, 179, 255)', 'rgb(255, 179, 255)', 'rgb(0, 0, 0)'),
      new ArrayChartBox('Pink', false, 'rgb(255, 179, 217)', 'rgb(255, 179, 217)', 'rgb(0, 0, 0)'),
      new ArrayChartBox('Light Gray', false, 'lightgray', 'lightgray', 'rgb(0, 0, 0)'),
      new ArrayChartBox('Dark Gray', false, 'rgb(137, 137, 137)', 'rgb(137, 137, 137)', 'rgb(0, 0, 0)')
    ], function (arrayChart, currentSelectionCheck) {
      if (!arrayChart.items[currentSelectionCheck].locked) {
        arrayChart.currentSelection = currentSelectionCheck
        gameStates.currentThemeColour = arrayChart.items[arrayChart.currentSelection].value
      }
    }))

    this.arrayCharts.push(this.backroundStyles = new ArrayChart(/* title */'Background Style', /* currentSelection */0, /* offsetX */220, /* offsetY */300, /* sectionWidth */200, /* sectionHeight */200, /* loopWidth */2, /* loopHeight */1, [
      new ArrayChartImage(/* displayName */'Classic', /* locked */false, /* value */BackgroundStyles.Classic, /* image */images.WallGrassV1_400x400, /* imageStartX */-4, /* imageStartY */0, /* imageStartWidth */images.WallGrassV1_400x400.width, /* imageStartHeight */images.WallGrassV1_400x400.height),
      new ArrayChartBox(/* displayName */'Plastic', drawUpdate.highestLevelLock, /* value */BackgroundStyles.Plastic, /* colour */'rgb(127, 127, 127)', /* boarder */'rgb(0, 0, 0)', /* checkLocked */function () { this.locked = drawUpdate.highestLevelLock })
    ], function (arrayChart, currentSelectionCheck) {
      if (!arrayChart.items[currentSelectionCheck].locked) {
        arrayChart.currentSelection = currentSelectionCheck
        gameStates.currentBackgroundStyle = arrayChart.items[arrayChart.currentSelection].value
      }
    }))

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
  }

  findCurrentArrayChart () {
    if (gameStates.currentSettingState === settingStates.ThemeColourSelection && gameStates.currentGameMode === gameMode.Settings) { return 0 }
    if (gameStates.currentGameMode === gameMode.Shop) {
      if (gameStates.currentShopMode === ShopMode.Backround) { return 1 }
      if (gameStates.currentShopMode === ShopMode.Player) { return 2 }
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
};

class ArrayChartBox {
  constructor (displayName, locked, value, colour, boarder, checkedLocked) {
    this.displayName = displayName
    this.locked = locked
    this.value = value
    this.colour = colour
    this.boarder = boarder
    this.checkedLocked = checkedLocked
    this.currentSelected = false
  }

  Draw (row, col) {
    if (!this.locked) {
      if (this.currentArrayChart.currentX === row && this.currentArrayChart.currentY === col) { canvas.context.fillStyle = 'white' } else { canvas.context.fillStyle = this.boarder }
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
