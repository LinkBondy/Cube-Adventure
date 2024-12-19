'use strict'
const { images } = require('../drawing/Images')
const { draw } = require('../drawing/Draw')
const { storyModeStates, gameStates, BackgroundStyles } = require('../data/GameData')
const { canvas } = require('../drawing/Canvas')
const { GameObject } = require('./Class')

export class Wall extends GameObject {
  constructor (x, y, width, height, color1, debugColour, type) {
    super(x, y, width, height, color1, debugColour)
    this.type = type
  }

  AllowMovement (wall, objectIntersecting) {
    // If the object calling the function is TallGrass
    if (wall.type === 'tallGrass') {
      return false
    }
    // If the object calling the function is FakeTallGrass
    if (wall.type === 'fakeTallGrass') {
      return true
    }

    if (wall.type === 'selectiveWall') {
      switch (wall.selectionType) {
        case 'player':
          if (objectIntersecting === 'player') {
            return true
          }
          if (objectIntersecting === 'enemy') {
            return false
          }
          break

        case 'enemy':
          if (objectIntersecting === 'player') {
            return false
          }
          if (objectIntersecting === 'enemy') {
            return true
          }
          break
      }
      return true
    }
  }
};

export class TallGrass extends Wall {
  constructor (x, y, width, height) {
    super(x, y, width, height, 'rgb(190, 190, 190)', /* Debug */'rgba(50, 210, 75, 0.8)', 'tallGrass')
    this.color2 = 'rgb(120, 120, 120)'
    this.original_x = this.x
    this.original_y = this.y
    this.randomList = Array(100)
    for (let i = 0; i < 100; i++) {
      this.randomList[i] = Math.floor(Math.random() * 1000)
    }
  }

  Draw () {
    if (gameStates.currentBackgroundStyle === BackgroundStyles.Classic) {
      let i = 0
      for (let x = this.left(); x < this.right(); x += 50) {
        for (let y = this.top(); y < this.bottom(); y += 50) {
          i++
          ///
          canvas.context.save()
          canvas.context.translate(x - 2, y - 2)
          switch (gameStates.CurrentLevel().currentArea) {
            case 1:
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
              break
            case 2 :
              if (this.randomList[i] % 7 === 0) {
                draw.DrawImage(images.UndergroundWallCrystalA, 0, 0)
              } else if (this.randomList[i] % 20 === 0) {
                draw.DrawImage(images.UndergroundWallCrystalB, 0, 0)
              } else {
                draw.DrawImage(images.UndergroundWallA, 0, 0)
              }
              break
            case 3 :
              if (this.randomList[i] % 9 === 0) {
                canvas.context.drawImage(images.WorldTwoLedges, 104, 10, 54, 54, 0, 0, 54, 54)
              } else {
                canvas.context.drawImage(images.WorldTwoLedges, 100, 6, 54, 54, 0, 0, 54, 54)
              }
              break
          }
          canvas.context.restore()
        }
      }
    } else if (gameStates.currentBackgroundStyle === BackgroundStyles.Plastic) {
      switch (gameStates.CurrentLevel().currentArea) {
        case 1:
          canvas.context.fillStyle = this.color1
          break

        case 2:
          canvas.context.fillStyle = this.color2
          break
      }
      canvas.context.fillRect(this.x, this.y, this.width, this.height)
    }

    /* } else if (this.x > 800) {
              for (var x = this.left(); x < this.right(); x = x + 50) {
                  for (var y = this.top(); y < this.bottom(); y = y + 50) {
              draw.DrawImage(images.WallGrassEdgeY, )
                  }
              } */
  }

  reset () {
    this.x = this.original_x
    this.y = this.original_y
  }
};

export class FakeTallGrass extends Wall {
  constructor (x, y, width, height) {
    super(x, y, width, height, 'rgba(190, 190, 190, 0.9)', /* Debug */'rgba(30, 140, 30, 0.8)', 'fakeTallGrass')
    this.original_x = this.x
    this.original_y = this.y
    this.randomList = Array(100)
    for (let i = 0; i < 100; i++) {
      this.randomList[i] = Math.floor(Math.random() * 1000)
    }
  }

  Draw () {
    if (gameStates.currentBackgroundStyle === BackgroundStyles.Classic) {
      let i = 0
      for (let x = this.left(); x < this.right(); x += 50) {
        for (let y = this.top(); y < this.bottom(); y += 50) {
          i++
          canvas.context.save()
          canvas.context.translate(x - 2, y - 2)
          ///
          if (this.randomList[i] % 15 === 0) { draw.DrawImage(images.InvisibleWallV2, 0, 0) } else { draw.DrawImage(images.InvisibleWall, 0, 0) }
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

export class SelectiveWall extends Wall {
  constructor (x, y, width, height, selectionType) {
    super(x, y, width, height, 'rgb(255, 120, 120)', /* Debug */'rgba(30, 140, 30, 0.8)', 'selectiveWall')
    this.original_x = this.x
    this.original_y = this.y
    this.color2 = 'rgb(120, 120, 255)'
    this.selectionType = selectionType
  }

  Draw () {
    /* if (gameStates.currentBackgroundStyle === BackgroundStyles.Classic) {
      for (let x = this.left(); x < this.right(); x += 50) {
        for (let y = this.top(); y < this.bottom(); y += 50) {
          canvas.context.save()
          canvas.context.translate(x - 2, y - 2)
          canvas.context.restore()
        }
      }
    } else if (gameStates.currentBackgroundStyle === BackgroundStyles.Plastic) { */
    if (this.selectionType === 'enemy') { canvas.context.fillStyle = this.color1 }
    if (this.selectionType === 'player') { canvas.context.fillStyle = this.color2 }
    canvas.context.fillRect(this.x + 5, this.y + 5, this.width - 10, this.height - 10)
    // }
  }

  reset () {
    this.x = this.original_x
    this.y = this.original_y
  }
};

export class Water extends GameObject {
  constructor (x, y, width, height) {
    super(x, y, width, height, 'rgb(0, 175, 235)', /* Debug */'rgb(0, 175, 235, 0.8)')
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
  constructor (x, y, width, height, colorType, allowMovement) {
    super(x, y, width, height)
    this.original_x = this.x
    this.original_y = this.y
    this.soildColorA = 'rgb(49, 141, 165)'
    this.brokenColorA = 'rgb(0, 241, 254)'
    this.soildColorB = 'rgb(204, 153, 204)'
    this.brokenColorB = 'rgb(242, 124, 238)'
    this.allowMovement = allowMovement
    this.originalAllowMovement = this.allowMovement
    this.colorType = colorType
  }

  Draw () {
    if ((this.x >= (gameStates.CurrentLevel().currentX - 1) * 850 && this.x < gameStates.CurrentLevel().currentX * 850) && (this.y >= (gameStates.CurrentLevel().currentY - 1) * 600 && this.y < gameStates.CurrentLevel().currentY * 600)) {
      let image
      let size
      if (gameStates.currentBackgroundStyle === BackgroundStyles.Classic) {
        if (!this.allowMovement) {
          switch (this.colorType) {
            case 'blue':
              image = images.UnlockRockBlue
              break

            case 'pink':
              image = images.UnlockRockPurple
              break
          }
        } else if (this.allowMovement) {
          switch (this.colorType) {
            case 'blue':
              image = images.UnlockedRockBlue
              break

            case 'pink':
              image = images.UnlockedRockPurple
              break
          }
        }
        draw.DrawImage(image, this.x, this.y)
      } else if (gameStates.currentBackgroundStyle === BackgroundStyles.Plastic) {
        if (!this.allowMovement) {
          size = 25
          switch (this.colorType) {
            case 'blue':
              canvas.context.fillStyle = this.soildColorA
              break

            case 'pink':
              canvas.context.fillStyle = this.soildColorB
              break
          }
        } else if (this.allowMovement) {
          size = 17.5
          switch (this.colorType) {
            case 'blue':
              canvas.context.fillStyle = this.brokenColorA
              break

            case 'pink':
              canvas.context.fillStyle = this.brokenColorB
              break
          }
        }
        canvas.context.beginPath()
        canvas.context.arc(this.x + 25, this.y + 25, size, 0, 360)
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

export class CrackedRock extends GameObject {
  constructor (x, y, width, height, cracks) {
    super(x, y, width, height)
    this.originalX = this.x
    this.originalY = this.y
    this.cracks = cracks
    this.originalCracks = this.cracks
    if (this.cracks >= 4) {
      this.allowMovement = true
    } else {
      this.allowMovement = false
    }
    this.originalAllowMovement = this.allowMovement
  }

  Draw () {
    const drawingX = this.cracks * 50
    if ((this.x >= (gameStates.CurrentLevel().currentX - 1) * 850 && this.x < gameStates.CurrentLevel().currentX * 850) && (this.y >= (gameStates.CurrentLevel().currentY - 1) * 600 && this.y < gameStates.CurrentLevel().currentY * 600)) {
      switch (gameStates.currentBackgroundStyle) {
        case BackgroundStyles.Classic:
          canvas.context.drawImage(images.CrackedRock, drawingX, 0, 50, 50, this.x, this.y, this.width, this.height)
          break
        case BackgroundStyles.Plastic:
          canvas.context.drawImage(images.CrackedRockPlastic, drawingX, 0, 50, 50, this.x, this.y, this.width, this.height)
          break
      }
    }
  }

  reset () {
    this.x = this.originalX
    this.y = this.originalY
    this.cracks = this.originalCracks
    this.allowMovement = this.originalAllowMovement
  }
}
