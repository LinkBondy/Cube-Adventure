'use strict'
const { gameMode, startingMenusStates, storyModeStates, gameStates, BackgroundStyles } = require('../data/GameData')
const { canvas } = require('../drawing/Canvas')
export class GameObject {
  constructor (x, y, width, height, color1) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.color1 = color1
  }

  intersects (otherBox) {
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

    /// /////////////////////

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

  intersectsAll (offset, otherBox) {
    // Check if the left-top point is inside otherBox
    if (offset === 0) {
      if ((this.left() === otherBox.left() && this.right() === otherBox.right()) && (this.top() === otherBox.top() && this.bottom() === otherBox.bottom())) {
        return true
      }
    } else {
      // for (let checkedX = 0; checkedX < offset; checkedX++) {
      // for (let checkedY = 0; checkedY < offset; checkedY++) {
      if ((this.left() >= otherBox.left() - offset && this.right() <= otherBox.right() + offset) && (this.top() >= otherBox.top() - offset && this.bottom() <= otherBox.bottom() + offset)) {
        return true
      }
      // }
      // }
    }
    return false
  }

  left () {
    return this.x
  }

  right () {
    return this.x + this.width
  }

  top () {
    return this.y
  }

  bottom () {
    return this.y + this.height
  }

  /* above(typeArray, itemX, itemY) {
        typeArray.forEach(function(type) {
            for (var x = type.left(); x < type.right(); x = x + 50) {
                for (var y = type.top(); y < type.bottom(); y = y + 50) {
                    if (x === itemX && y - 50 === itemY) {
                        return true
                    }
                }
            }

        },)
        return false
    } */
  changeSlideVariables () {
    gameStates.CurrentLevel().players.forEach(function (player) {
      if (player.x < 850 * (gameStates.CurrentLevel().currentX - 1)) {
        if (gameStates.CurrentLevel().currentX !== 1) {
          gameStates.CurrentLevel().currentX -= 1
        } else {
          player.x += 50
        }
        return
      }

      if (player.x > 850 * gameStates.CurrentLevel().currentX - 50) {
        if (gameStates.CurrentLevel().currentX !== gameStates.CurrentLevel().width) {
          gameStates.CurrentLevel().currentX += 1
        } else {
          player.x -= 50
        }
        return
      }

      if (player.y < 600 * (gameStates.CurrentLevel().currentY - 1)) {
        if (gameStates.CurrentLevel().currentY !== 1) {
          gameStates.CurrentLevel().currentY -= 1
        } else {
          player.y += 50
        }
        return
      }

      if (player.y > 600 * gameStates.CurrentLevel().currentY - 50) {
        if (gameStates.CurrentLevel().currentY !== gameStates.CurrentLevel().height) {
          gameStates.CurrentLevel().currentY += 1
        } else {
          player.y -= 50
        }
      }
    })
  }
};

export class Background {
  constructor (color1, color2) {
    this.color1 = color1
    this.color2 = color2
  }

  DrawBackround () {
    if ((gameStates.currentStoryModeState === storyModeStates.Playing || gameStates.currentStoryModeState === storyModeStates.Paused || gameStates.currentStoryModeState === storyModeStates.Selecting) && gameStates.currentGameMode === gameMode.StoryMode && gameStates.currentStartingMenusState === startingMenusStates.Selected && gameStates.currentBackgroundStyle === BackgroundStyles.Classic) {
      if (gameStates.levelController.currentWorld === 1) {
        this.color1 = 'rgb(100, 200, 100)'
      } else if (gameStates.levelController.currentWorld === 2) {
        this.color1 = 'rgb(153, 63, 33)'
      }
    } else {
      this.color1 = 'lightgray'
    }

    canvas.context.clearRect(0, 0, canvas.width, canvas.height)
    canvas.context.fillStyle = this.color1
    canvas.context.fillRect(0, 0, canvas.width - 200, canvas.height)
  }

  DrawToolBar () {
    this.color2 = gameStates.currentThemeColour
    canvas.context.fillStyle = this.color2
    canvas.context.fillRect(850, 0, 200, canvas.height)
    canvas.context.fillStyle = 'black'
    canvas.context.fillRect(850, 0, 2, canvas.height)
  }
};
