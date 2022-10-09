'use strict'
const { images } = require('../drawing/Images')
const { draw } = require('../drawing/Draw')
const { storyModeStates, gameStates, BackgroundStyles } = require('../data/GameData')
const { canvas } = require('../drawing/Canvas')
const { GameObject } = require('./Class')
export class Wall extends GameObject {
  constructor (x, y, width, height, color1, allowMovement, invisibleWall) {
    super(x, y, width, height, color1)
    this.original_x = this.x
    this.original_y = this.y
    this.allowMovement = allowMovement
    this.invisibleWall = invisibleWall
    this.randomList = Array(100)
    for (let i = 0; i < 100; i++) {
      this.randomList[i] = Math.floor(Math.random() * 1000)
    }
  }

  Draw () {
    if (this.invisibleWall && gameStates.currentBackgroundStyle === BackgroundStyles.Classic) {
      let i = 0
      for (let x = this.left(); x < this.right(); x = x + 50) {
        for (let y = this.top(); y < this.bottom(); y = y + 50) {
          i++
          canvas.context.save()
          canvas.context.translate(x - 2, y - 2)
          ///
          if (this.randomList[i] % 15 === 0) { draw.DrawImage(images.InvisibleWallV2, 0, 0) } else { draw.DrawImage(images.InvisibleWall, 0, 0) }
          canvas.context.restore()
        }
      }
      /* } else if (this.x > 800) {
              for (var x = this.left(); x < this.right(); x = x + 50) {
                  for (var y = this.top(); y < this.bottom(); y = y + 50) {
              draw.DrawImage(images.WallGrassEdgeY, )
                  }
              } */
    } else if (gameStates.currentBackgroundStyle === BackgroundStyles.Classic && !this.invisibleWall) {
      let i = 0
      for (let x = this.left(); x < this.right(); x += 50) {
        for (let y = this.top(); y < this.bottom(); y += 50) {
          i++
          ///
          canvas.context.save()
          canvas.context.translate(x - 2, y - 2)
          if (gameStates.levelController.currentWorld === 1) {
            // if (this.randomList[i] % 2 === 0)
            // canvas.context.rotate(90 * Math.PI / 180)
            if (this.randomList[i] % 40 === 0) {
              draw.DrawImage(images.WallGrassPuddleA, 0, 0)
            } else if (this.randomList[i] % 9 === 0) { draw.DrawImage(images.WallGrassRockA, 0, 0) } else if (this.randomList[i] % 507 === 0) {
              draw.DrawImage(images.WallGrassTree, 0, 0)
            } else {
              // if (Math.floor(Math.random() * 2 + 1) === 1)
              draw.DrawImage(images.WallGrassClassicA, 0, 0)
            }
          } else if (gameStates.levelController.currentWorld === 2) {
          // if (this.randomList[i] % 9 === 0) {
            // canvas.context.drawImage(images.WorldTwoLedges, 104, 10, 54, 54, 0, 0, 54, 54)
          // } else {
            canvas.context.drawImage(images.WorldTwoLedges, 100, 6, 54, 54, 0, 0, 54, 54)
            // }
          }
          canvas.context.restore()
        }
      }
    } else if (gameStates.currentBackgroundStyle === BackgroundStyles.Plastic) {
      canvas.context.fillStyle = this.color1
      canvas.context.fillRect(this.x, this.y, this.width, this.height)
    }
  }

  reset () {
    this.x = this.original_x
    this.y = this.original_y
  }
};

export class Water extends GameObject {
  constructor (x, y, width, height, color1) {
    super(x, y, width, height, color1)
    this.original_x = this.x
    this.original_y = this.y
    this.spriteX = 0
  }

  Draw () {
    if (gameStates.currentBackgroundStyle === BackgroundStyles.Classic) {
      if (gameStates.currentStoryModeState === storyModeStates.Playing) {
        const numMilliseconds = new Date().getTime()
        if (numMilliseconds % 5 === 4) {
          this.spriteX = (this.spriteX + 54) % (54 * 49)
        }
      }
      for (let x = this.left(); x < this.right(); x = x + 50) {
        for (let y = this.top(); y < this.bottom(); y = y + 50) {
          canvas.context.drawImage(images.Water_Medium2, this.spriteX, 0, 54, images.Water_Medium2.height, x, y, 54, images.Water_Medium2.height)
        }
      }
    }
    if (gameStates.currentBackgroundStyle === BackgroundStyles.Plastic) {
      canvas.context.fillStyle = this.color1
      canvas.context.fillRect(this.x, this.y, this.width, this.height)
    }
  }

  Update () {

  }

  reset () {
    this.x = this.original_x
    this.y = this.original_y
  }
};

export class Rock extends GameObject {
  constructor (x, y, width, height, color1, color2, title, allowMovement, colorNumber, typeNumber) {
    super(x, y, width, height, color1)
    this.original_x = this.x
    this.original_y = this.y
    this.color2 = color2
    this.title = title
    this.allowMovement = allowMovement
    this.originalAllowMovement = this.allowMovement
    this.colorNumber = colorNumber
    this.typeNumber = typeNumber
  }

  Draw () {
    if ((this.x >= (gameStates.CurrentLevel().currentX - 1) * 850 && this.x < gameStates.CurrentLevel().currentX * 850) && (this.y >= (gameStates.CurrentLevel().currentY - 1) * 600 && this.y < gameStates.CurrentLevel().currentY * 600)) {
      const self = this
      if (gameStates.currentBackgroundStyle === BackgroundStyles.Classic && this.typeNumber === 1) {
        if (this.colorNumber === 1) {
          gameStates.CurrentLevel().unlocks.forEach(function (unlock) {
            if (self.allowMovement && unlock.title === self.title) {
              draw.DrawImage(images.UnlockedRockBlue, self.x, self.y)
            } else if (!self.allowMovement && unlock.title === self.title) {
              draw.DrawImage(images.UnlockRockBlue, self.x, self.y)
            }
          })
        } else if (this.colorNumber === 2) {
          gameStates.CurrentLevel().unlocks.forEach(function (unlock) {
            if (self.allowMovement && unlock.title === self.title) {
              draw.DrawImage(images.UnlockedRockPurple, self.x, self.y)
            } else if (!self.allowMovement && unlock.title === self.title) {
              draw.DrawImage(images.UnlockRockPurple, self.x, self.y)
            }
          })
        }
      } else if (gameStates.currentBackgroundStyle === BackgroundStyles.Plastic && this.typeNumber === 1) {
        gameStates.CurrentLevel().unlocks.forEach(function (unlock) {
          if (!self.allowMovement && unlock.title === self.title) { canvas.context.fillStyle = self.color1 }

          if (self.allowMovement && unlock.title === self.title) { canvas.context.fillStyle = self.color2 }
        })
        canvas.context.beginPath()
        canvas.context.arc(this.x + 25, this.y + 25, 25, 0, 360)
        canvas.context.fill()
      }
    }
  }

  reset () {
    this.x = this.original_x
    this.y = this.original_y
    this.allowMovement = this.originalAllowMovement
  }
};
