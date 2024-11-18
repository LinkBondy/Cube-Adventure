'use strict'
const { Player, Cuber, Expander, ChangeDirectionSquare } = require('./Moveable')
const { TallGrass, FakeTallGrass, Rock, Water } = require('./Barriers')
const { ReverseTile, Teleporter, Hole, FinishArea } = require('./Interactable')
const { LifeJacket, ThreeBead } = require('./Collectable')
const { gameStates } = require('../data/GameData')
const { canvas } = require('../drawing/Canvas')

class Level {
  constructor (levelData, title, requirements, currentX, currentY, width, height, collectedItems, currentArea, timeLimit) {
    this.players = levelData.players ?? []
    this.cubers = levelData.cubers ?? []
    this.expanders = levelData.expanders ?? []
    this.walls = levelData.walls ?? []
    this.waters = levelData.waters ?? []
    this.items = levelData.items ?? []
    this.rocks = levelData.rocks ?? []
    this.holes = levelData.holes ?? []
    this.finishAreas = levelData.finishAreas ?? []
    this.changeDirectionSquares = levelData.changeDirectionSquares ?? []
    this.reverseTiles = levelData.reverseTiles ?? []
    this.teleporters = levelData.teleporters ?? []
    this.title = title
    this.completed = false
    this.unlocked = false
    this.requirements = requirements
    this.currentX = currentX
    this.startingX = this.currentX
    this.currentY = currentY
    this.startingY = this.currentY
    this.width = width
    this.height = height
    this.collectedItems = collectedItems
    this.currentArea = currentArea
    this.originalCollectedItems = []
    this.originalCollectedItems.push(...this.collectedItems)
    this.timeLimit = timeLimit
    this.originalTimeLimit = this.timeLimit
    this.clockFrame = 0
    this.timeWaited = 0
    this.timeRemaining = undefined
  }

  draw () {
    canvas.context.save()
    canvas.context.translate(0 - 850 * (this.currentX - 1), 0 - 600 * (this.currentY - 1))
    this.waters.forEach(function (water) {
      water.Draw()
    })

    this.finishAreas.forEach(function (finishArea) {
      finishArea.Draw()
    })

    this.holes.forEach(function (hole) {
      hole.Draw()
    })

    this.reverseTiles.forEach(function (reverseTile) {
      reverseTile.Draw()
    })

    this.teleporters.forEach(function (teleporter) {
      teleporter.Draw()
    })

    this.items.forEach(function (item) {
      item.Draw()
    })

    this.rocks.forEach(function (rock) {
      rock.Draw()
    })

    /* this.changeDirectionSquares.forEach(function (changeDirectionSquare) {
      changeDirectionSquare.Draw()
    }) */

    this.players.forEach(function (player) {
      player.Draw()
    })

    this.cubers.forEach(function (cuber) {
      cuber.Draw()
    })

    this.expanders.forEach(function (expander) {
      expander.Draw()
    })

    this.walls.forEach(function (wall) {
      wall.Draw()
    })
    canvas.context.restore()
  }

  update () {
    this.cubers.forEach(function (cuber) {
      cuber.update()
    })
    this.expanders.forEach(function (expander) {
      expander.updateHitboxes()
      expander.update()
    })
    this.players.forEach(function (player) {
      player.update()
      player.changeSlideVariables()
    })
    this.reverseTiles.forEach(function (reverseTile) {
      reverseTile.update()
    })
    this.holes.forEach(function (hole) {
      hole.update()
    })
    this.teleporters.forEach(function (teleporter) {
      teleporter.update()
    })
  }

  restart () {
    this.reset()
    this.players.forEach(function (player) {
      player.reset()
    })

    this.finishAreas.forEach(function (finishArea) {
      finishArea.reset()
    })

    this.cubers.forEach(function (cuber) {
      cuber.reset()
    })

    this.expanders.forEach(function (expander) {
      expander.reset()
    })

    this.waters.forEach(function (water) {
      water.reset()
    })

    this.holes.forEach(function (hole) {
      hole.reset()
    })

    this.reverseTiles.forEach(function (reverseTile) {
      reverseTile.reset()
    })

    this.teleporters.forEach(function (teleporter) {
      teleporter.reset()
    })

    this.items.forEach(function (item) {
      item.reset()
    })

    this.rocks.forEach(function (rock) {
      rock.reset()
    })

    this.changeDirectionSquares.forEach(function (changeDirectionSquare) {
      changeDirectionSquare.reset()
    })

    this.walls.forEach(function (wall) {
      wall.reset()
    })
  }

  startLevelTime () {
    this.startDate = new Date()
    const self = this
    this.currentTimeout = window.setTimeout(function () { self.updateLevelTime() }, 1000 * gameStates.delta)
  }

  pauseLevelTime () {
    gameStates.pausedDate = new Date()
    const self = this
    window.clearTimeout(self.currentTimeout)
  }

  resumeLevelTime () {
    window.clearTimeout(this.currentTimeout)
    if (this.timeRemaining === undefined) {
      this.timeRemaining = 1000 - (gameStates.pausedDate - this.startDate)
      this.currentTimeout = window.setTimeout(function () { gameStates.CurrentLevel().updateLevelTime() }, this.timeRemaining * gameStates.delta)
    } else {
      const oldRemainingTime = this.timeRemaining
      this.timeRemaining = oldRemainingTime - (gameStates.pausedDate - this.startDate)
      this.currentTimeout = window.setTimeout(function () { gameStates.CurrentLevel().updateLevelTime() }, this.timeRemaining * gameStates.delta)
    }
    this.startDate = new Date()
  }

  updateLevelTime () {
    this.currentTimeout = window.setTimeout(function () { gameStates.CurrentLevel().updateLevelTime() }, 1000 * gameStates.delta)
    this.timeRemaining = undefined
    this.startDate = new Date()
    if (gameStates.isRunning) {
      this.timeLimit -= 1
    }
  }

  reset () {
    this.currentX = this.startingX
    this.currentY = this.startingY
    this.timeLimit = this.originalTimeLimit
    this.collectedItems = []
    this.collectedItems.push(...this.originalCollectedItems)
    this.clockFrame = 0
    this.timeWaited = 0
  }

  haveItem (item) {
    for (let i = 0; i < this.collectedItems.length; i++) {
      if (item === this.collectedItems[i]) {
        return true
      }
    }
    return false
  }
}

class World {
  constructor (title, textColour, backgroundColour, levels) {
    this.title = title
    this.textColour = textColour
    this.backgroundColour = backgroundColour
    this.levels = levels
  }
}

export class GameController {
  constructor () {
    this.worlds = []
    this.worldsUnlocked = []
    ///
    this.world1 = []
    this.world2 = []
    this.specialLevels = []
  }

  CreateWorlds () {
    this.worlds.push(new World('Through the Grasslands', 'rgb(0, 150, 80)', 'rgb(150, 220, 150)', this.world1))
    this.worlds.push(new World('Special Levels', 'rgb(255, 10, 100)', 'rgb(255, 175, 200)', this.specialLevels))
    gameStates.worldSelector.currentWorld = this.worlds[0]
    gameStates.worldSelector.currentSelectedWorld = this.worlds[0]
  }

  CreateLevels () {
    // Level 1
    this.world1.push(new Level({
      players: [
        new Player(400, 0, 50, 50)
      ],
      cubers: [
        new Cuber(700, 400, 50, 50, [true, false, false, false], 10),
        new Cuber(100, 150, 50, 50, [false, true, false, false], 10)
      ],
      walls: [
        /// Left Wall
        new TallGrass(0, 0, 50, 200),
        new TallGrass(0, 400, 50, 200),
        //
        new TallGrass(50, 100, 50, 150),
        new TallGrass(50, 350, 50, 150),
        //
        new TallGrass(50, 250, 50, 100),
        new TallGrass(0, 200, 50, 200),
        /// Right Wall
        new TallGrass(800, 0, 50, 200),
        new TallGrass(800, 400, 50, 200),
        //
        new TallGrass(750, 100, 50, 150),
        new TallGrass(750, 350, 50, 150),
        ///
        new TallGrass(750, 250, 50, 100),
        new TallGrass(800, 200, 50, 200),
        /// Top Wall
        new TallGrass(50, 0, 300, 50),
        new TallGrass(500, 0, 300, 50),
        //
        new TallGrass(50, 50, 350, 50),
        new TallGrass(450, 50, 350, 50),
        /// Bottom Wall
        new TallGrass(50, 550, 300, 50),
        new TallGrass(500, 550, 300, 50),
        //
        new TallGrass(50, 500, 350, 50),
        new TallGrass(450, 500, 350, 50)
      ],
      finishAreas: [
        new FinishArea(350, 550, 150, 50)
      ]
    }, 'Level 1', /* Requirements */ [], /* Level Borders */1, 1, 1, 1, [], /* Area */ 1, /* Time Limit */ 75))

    // Level 2
    this.world1.push(new Level({
      players: [
        new Player(400, 0, 50, 50)
      ],
      cubers: [
        new Cuber(400, 500, 50, 50, [false, false, true, false], 5.5)
      ],
      walls: [
        new TallGrass(0, 0, 350, 600),
        new TallGrass(500, 0, 350, 600),
        ///
        new TallGrass(350, 100, 50, 50),
        new TallGrass(350, 250, 50, 200),
        ///
        new TallGrass(450, 100, 50, 200),
        new TallGrass(450, 400, 50, 50)
      ],
      finishAreas: [
        new FinishArea(350, 550, 150, 50)
      ]
    }, 'Level 2', /* Requirements */ [new Requirement(0, 1 - 1)], /* Level Borders */1, 1, 1, 1, [], /* Area */ 1, /* Time Limit */ 100))

    // Level 3
    this.world1.push(new Level({
      players: [
        new Player(400, 0, 50, 50)
      ],
      cubers: [
        new Cuber(200, 450, 50, 50, [true, false, false, false], 6),
        new Cuber(400, 350, 50, 50, [true, true, false, false], 5),
        new Cuber(600, 50, 50, 50, [false, true, false, false], 6)
      ],
      walls: [
        new TallGrass(0, 0, 200, 550),
        new TallGrass(650, 0, 200, 550),
        ///
        new TallGrass(200, 0, 150, 50),
        new TallGrass(500, 0, 150, 50),
        ///
        new TallGrass(500, 100, 150, 50),
        new TallGrass(200, 100, 150, 50),
        ///
        new TallGrass(350, 200, 150, 150),
        new TallGrass(550, 150, 100, 250),
        new TallGrass(200, 150, 100, 250),
        ///
        new TallGrass(0, 550, 350, 50),
        new TallGrass(500, 550, 350, 50),
        ///
        new TallGrass(200, 400, 150, 50),
        new TallGrass(500, 400, 150, 50),
        ///
        new TallGrass(200, 500, 150, 50),
        new TallGrass(500, 500, 150, 50)
      ],
      finishAreas: [
        new FinishArea(350, 550, 150, 50)
      ],
      changeDirectionSquares: [
        new ChangeDirectionSquare(300, 150, 50, 50, false, true, false, true, true),
        ///
        new ChangeDirectionSquare(500, 150, 50, 50, true, false, false, true, true),
        ///
        new ChangeDirectionSquare(300, 350, 50, 50, true, false, true, false, true),
        ///
        new ChangeDirectionSquare(500, 350, 50, 50, false, true, true, false, true)
      ]
    }, 'Level 3', /* Requirements */ [new Requirement(0, 2 - 1)], /* Level Borders */1, 1, 1, 1, [], /* Area */ 1, /* Time Limit */ 100))

    // Level 4
    this.world1.push(new Level({
      players: [
        new Player(400, 550, 50, 50)
      ],
      cubers: [
        new Cuber(400, 50, 50, 50, [true, true, false, false], 5.5),
        ///
        new Cuber(100, 250, 50, 50, [true, false, false, false], 5),
        new Cuber(300, 400, 50, 50, [true, false, false, false], 5),
        ///
        new Cuber(700, 250, 50, 50, [false, true, false, false], 5),
        new Cuber(500, 400, 50, 50, [false, true, false, false], 5)
      ],
      walls: [
        /// Borders
        // Top
        new TallGrass(0, 0, 850, 50),
        // Left
        new TallGrass(0, 50, 100, 550),
        // Right
        new TallGrass(750, 50, 100, 550),
        // Bottom
        new TallGrass(100, 550, 250, 50),
        new TallGrass(500, 550, 250, 50),
        ///
        /// Bottom of Boxes
        new TallGrass(100, 500, 100, 50),
        new TallGrass(250, 500, 100, 50),
        //
        new TallGrass(500, 500, 100, 50),
        new TallGrass(650, 500, 100, 50),
        // Left Side
        new TallGrass(100, 100, 50, 50),
        new TallGrass(300, 100, 50, 50),
        //
        new TallGrass(100, 150, 100, 50),
        new TallGrass(250, 150, 100, 50),
        // Right Side
        new TallGrass(500, 100, 50, 50),
        new TallGrass(700, 100, 50, 50),
        //
        new TallGrass(500, 150, 100, 50),
        new TallGrass(650, 150, 100, 50),
        // Middle Walls
        new TallGrass(350, 100, 50, 500),
        new TallGrass(450, 100, 50, 500)
      ],
      rocks: [
        new Rock(600, 150, 50, 50, 'blue', false)
      ],
      finishAreas: [
        new FinishArea(600, 500, 50, 50)
      ],
      reverseTiles: [
        new ReverseTile(200, 500, 50, 50, 'blue')
      ]
    }, 'Level 4', /* Requirements */ [new Requirement(0, 3 - 1)], /* Level Borders */1, 1, 1, 1, [], /* Area */ 1, /* Time Limit */ 150))

    // Level 5
    this.world1.push(new Level({
      players: [
        new Player(400, 550, 50, 50)
      ],
      cubers: [
        new Cuber(250, 50, 50, 50, [false, true, false, false], 5),
        ///
        new Cuber(150 + 850, 275, 50, 50, [false, false, false, true], 6),
        new Cuber(200 + 850, 275, 50, 50, [false, false, true, false], 6)
      ],
      walls: [
        // Top Borders
        new TallGrass(0, 0, 700, 50),
        // Bottom Borders
        new TallGrass(0, 550, 350, 50),
        new TallGrass(500, 550, 200, 50),
        // Left Borders
        new TallGrass(0, 50, 100, 150),
        new TallGrass(0, 200, 50, 50),
        new TallGrass(0, 350, 50, 50),
        new TallGrass(0, 400, 100, 150),
        // Left Box Area
        new TallGrass(150, 100, 50, 150),
        new TallGrass(200, 100, 50, 400),
        new TallGrass(150, 350, 50, 150),
        ///
        new TallGrass(250, 150, 50, 50),
        new FakeTallGrass(250, 400, 50, 50),
        new TallGrass(300, 400, 100, 150),
        // Middle Box Area
        new TallGrass(300, 50, 400, 150),
        ///
        new TallGrass(600, 200, 100, 50),
        new TallGrass(600, 350, 100, 50),
        ///
        new TallGrass(450, 400, 250, 150),
        // Right Borders
        new TallGrass(700, 0, 400, 100),
        new TallGrass(800, 200, 200, 200),
        new TallGrass(700, 500, 400, 100),
        new TallGrass(250 + 850, 0, 100, 250),
        new TallGrass(250 + 850, 350, 100, 250),
        new TallGrass(350 + 850, 0, 50, 600),
        ///
        new TallGrass(400 + 850, 350, 450, 50),
        new TallGrass(400 + 850, 400, 50, 50),
        new TallGrass(500 + 850, 400, 50, 50),
        new TallGrass(550 + 850, 400, 300, 200),
        ///
        new TallGrass(400 + 850, 0, 450, 400)
      ],
      rocks: [
        new Rock(600, 250, 50, 50, 'blue', false),
        new Rock(600, 300, 50, 50, 'blue', false),
        ///
        new Rock(50, 200, 50, 50, 'pink', false),
        new Rock(50, 250, 50, 50, 'pink', false),
        new Rock(50, 300, 50, 50, 'pink', false),
        new Rock(50, 350, 50, 50, 'pink', false)
      ],
      finishAreas: [
        new FinishArea(0, 250, 50, 100)
      ],
      changeDirectionSquares: [
        new ChangeDirectionSquare(100, 50, 50, 50, false, true, false, true, true),
        new ChangeDirectionSquare(100, 500, 50, 50, false, true, true, false, true),
        new ChangeDirectionSquare(250, 500, 50, 50, true, false, true, false, true),
        ///
        new ChangeDirectionSquare(750, 400, 50, 50, false, true, true, false, true),
        new ChangeDirectionSquare(700, 450, 50, 50, false, true, true, false, true),
        //
        new ChangeDirectionSquare(750, 150, 50, 50, false, true, false, true, true),
        new ChangeDirectionSquare(700, 100, 50, 50, false, true, false, true, true),
        //
        new ChangeDirectionSquare(150 + 850, 400, 50, 50, true, false, true, false, true),
        new ChangeDirectionSquare(200 + 850, 450, 50, 50, true, false, true, false, true),
        //
        new ChangeDirectionSquare(200 + 850, 100, 50, 50, true, false, false, true, true),
        new ChangeDirectionSquare(150 + 850, 150, 50, 50, true, false, false, true, true)
      ],
      reverseTiles: [
        new ReverseTile(250, 100, 50, 50, 'blue'),
        new ReverseTile(300 + 850, 275, 50, 50, 'pink')
      ]
    }, 'Level 5', /* Requirements */ [new Requirement(0, 4 - 1)], /* Level Borders */1, 1, 2, 1, [], /* Area */ 1, /* Time Limit */ 200))

    // Level 6
    this.world1.push(new Level({
      players: [
        new Player(800, 250, 50, 50)
      ],
      cubers: [
        new Cuber(700, 50, 50, 50, [false, false, false, true], 5),
        new Cuber(450, 500, 50, 50, [false, false, true, false], 5),
        new Cuber(250, 50, 50, 50, [false, false, false, true], 5),
        new Cuber(50, 500, 50, 50, [false, false, true, false], 5),
        new Cuber(100, 450 + 600, 50, 50, [false, true, false, false], 4)
      ],
      walls: [
        // Top Border
        new TallGrass(0, 0, 850, 50),
        // Bottom Border
        new TallGrass(0, 550, 350, 150),
        new TallGrass(400, 550, 450, 100),
        // Left Border
        new TallGrass(750, 50, 100, 200),
        new TallGrass(750, 350, 100, 200),
        // Left Border
        new TallGrass(0, 50, 50, 200),
        new TallGrass(0, 350, 50, 200),
        // First Segment
        new TallGrass(650, 50, 50, 100),
        new TallGrass(650, 200, 50, 300),
        // Second Segment
        new TallGrass(550, 350, 50, 100),
        new TallGrass(550, 500, 50, 50),
        new TallGrass(550, 100, 50, 250),
        new TallGrass(600, 300, 50, 50),
        new TallGrass(500, 100, 50, 450),
        // Third Segment
        new TallGrass(400, 50, 50, 250),
        new TallGrass(400, 350, 50, 200),
        // Fourth Segment
        new TallGrass(300, 100, 50, 450),
        new TallGrass(350, 250, 50, 50),
        // Upper Fifth Segment
        new TallGrass(200, 50, 50, 150),
        new TallGrass(100, 100, 50, 150),
        // Lower Fifth Segment
        new TallGrass(100, 250, 150, 150),
        new TallGrass(100, 450, 150, 100),
        /// Second Screen
        new TallGrass(500, 50 + 600, 350, 50),
        // Begining
        new TallGrass(0, 100 + 600, 400, 50),
        new TallGrass(550, 100 + 600, 300, 50),
        //
        new TallGrass(0, 150 + 600, 450, 50),
        new TallGrass(600, 150 + 600, 250, 50),
        //
        new TallGrass(0, 200 + 600, 500, 50),
        new TallGrass(700, 200 + 600, 150, 50),
        // Middle
        new TallGrass(0, 250 + 600, 600, 50),
        new TallGrass(800, 250 + 600, 50, 50),
        //
        new TallGrass(0, 300 + 600, 550, 50),
        new TallGrass(800, 300 + 600, 50, 50),
        // End
        new TallGrass(0, 300 + 600, 550, 50),
        new TallGrass(800, 300 + 600, 50, 50),
        //
        new TallGrass(0, 350 + 600, 150, 50),
        new TallGrass(200, 350 + 600, 250, 50),
        new TallGrass(650, 350 + 600, 200, 50),
        //
        new TallGrass(250, 400 + 600, 150, 50),
        //
        new TallGrass(550, 400 + 600, 300, 50),
        new TallGrass(500, 450 + 600, 350, 50),
        //
        new TallGrass(0, 500 + 600, 250, 50),
        new TallGrass(400, 500 + 600, 450, 50),
        new TallGrass(0, 550 + 600, 850, 50),
        //
        new TallGrass(0, 400 + 600, 100, 100)
      ],
      rocks: [
        new Rock(300, 50, 50, 50, 'blue', false),
        new Rock(650, 500, 50, 50, 'blue', false)
      ],
      finishAreas: [
        new FinishArea(0, 250, 50, 100)
      ],
      changeDirectionSquares: [
        // new ChangeDirectionSquare(500, 200, 50, 50, false, true, true, true, true),
        // new ChangeDirectionSquare(600, 200, 50, 50, true, false, true, true, true)
      ],
      reverseTiles: [
        new ReverseTile(150, 350 + 600, 50, 50, 'blue')
      ],
      teleporters: [
        new Teleporter(550, 450, 50, 50, '6Teleporter', 2),
        new Teleporter(350, 200, 50, 50, '6Teleporter', 2)
      ]
    }, 'Level 6', /* Requirements */ [new Requirement(0, 5 - 1)], /* Level Borders */1, 1, 1, 2, [], /* Area */ 1, /* Time Limit */ 200))

    // Level 7
    this.world1.push(new Level({
      players: [
        new Player(750, 100, 50, 50)
      ],
      cubers: [
        new Cuber(500, 500, 50, 50, [true, false, false, false], 3.5)
      ],
      walls: [
        // Top and Bottom
        new TallGrass(0, 0, 850, 50),
        new TallGrass(0, 550, 850, 50),
        // Left and Right
        new TallGrass(0, 50, 50, 550),
        new TallGrass(800, 50, 50, 200),
        new TallGrass(800, 350, 50, 200),
        ///
        new TallGrass(750, 50, 50, 50),
        new TallGrass(750, 500, 50, 50),
        ///
        new TallGrass(650, 50, 50, 100),
        new TallGrass(650, 450, 50, 100),
        ///
        new TallGrass(700, 50, 50, 200),
        new TallGrass(700, 350, 50, 200),
        ///
        new TallGrass(600, 50, 50, 550),
        ///
        new TallGrass(50, 50, 50, 250),
        new TallGrass(50, 350, 50, 200),
        ///
        new TallGrass(100, 50, 50, 250),
        ///
        new TallGrass(150, 50, 50, 450),
        ///
        new TallGrass(200, 50, 50, 250),
        new TallGrass(250, 350, 50, 200),
        ///
        new TallGrass(300, 150, 50, 400),
        ///
        new TallGrass(350, 150, 200, 50),
        new TallGrass(300, 100, 250, 50),
        ///
        new TallGrass(400, 250, 200, 250),
        ///
        new TallGrass(550, 500, 50, 50)
      ],
      rocks: [
        new Rock(450, 500, 50, 50, 'pink', false),
        ///
        new Rock(700, 300, 50, 50, 'pink', false),
        new Rock(700, 250, 50, 50, 'pink', false)
      ],
      finishAreas: [
        new FinishArea(650, 150, 50, 300)
      ],
      changeDirectionSquares: [
        // Right Side
        new ChangeDirectionSquare(350, 500, 50, 50, false, true, true, false, true),
        ///
        new ChangeDirectionSquare(350, 200, 50, 50, false, true, false, true, true),
        ///
        new ChangeDirectionSquare(550, 200, 50, 50, true, false, true, false, true),
        ///
        new ChangeDirectionSquare(550, 50, 50, 50, true, false, false, true, true),
        // Left Side
        new ChangeDirectionSquare(250, 50, 50, 50, false, true, false, true, true),
        ///
        new ChangeDirectionSquare(250, 300, 50, 50, true, false, true, false, true),
        ///
        new ChangeDirectionSquare(200, 300, 50, 50, false, true, false, true, true),
        ///
        new ChangeDirectionSquare(200, 500, 50, 50, true, false, true, false, true),
        ///
        new ChangeDirectionSquare(100, 500, 50, 50, false, true, true, false, true)
      ],
      reverseTiles: [
        new ReverseTile(350, 500, 50, 50, 'pink')
      ],
      teleporters: [
        new Teleporter(750, 450, 50, 50, '7Teleporter', 1),
        new Teleporter(50, 300, 50, 50, '7Teleporter', 1)
      ]
    }, 'Level 7', /* Requirements */ [new Requirement(0, 6 - 1)], /* Level Borders */1, 1, 1, 1, [], /* Area */ 1, /* Time Limit */ 200))

    // Level 8
    this.world1.push(new Level({
      players: [
        new Player(150, 50 + 600, 50, 50)
      ],
      cubers: [
        new Cuber(250, 100 + 600, 50, 50, [true, false, false, false], 4),
        new Cuber(50, 250 + 600, 50, 50, [false, true, false, false], 4.5),
        new Cuber(250, 400 + 600, 50, 50, [true, false, false, false], 4)
      ],
      walls: [
        new TallGrass(0, 0, 250, 100),
        new TallGrass(0, 200, 150, 200),
        new TallGrass(0, 500, 250, 100),
        new TallGrass(250, 0, 100, 250),
        new TallGrass(250, 350, 100, 250),
        new TallGrass(350, 0, 50, 600),
        ///
        new TallGrass(400, 350, 450, 50),
        new TallGrass(400, 400, 50, 50),
        new TallGrass(500, 400, 50, 50),
        new TallGrass(550, 400, 300, 200),
        ///
        new TallGrass(400, 0, 450, 400),
        ///
        new TallGrass(0, 0 + 600, 50, 600),
        new TallGrass(50, 0 + 600, 250, 50),
        new TallGrass(50, 550 + 600, 250, 50),
        ///
        new TallGrass(50, 50 + 600, 50, 50),
        new TallGrass(50, 150 + 600, 50, 100),
        new TallGrass(50, 300 + 600, 50, 100),
        new TallGrass(50, 450 + 600, 50, 100),
        ///
        new TallGrass(250, 50 + 600, 50, 50),
        new TallGrass(250, 150 + 600, 50, 100),
        new TallGrass(250, 300 + 600, 50, 100),
        new TallGrass(250, 450 + 600, 50, 100),
        ///
        new TallGrass(300, 0 + 600, 50, 100),
        new TallGrass(300, 150 + 600, 50, 100),
        new TallGrass(300, 300 + 600, 50, 100),
        new TallGrass(300, 450 + 600, 50, 150),
        ///
        new TallGrass(800, 50 + 600, 50, 150),
        new TallGrass(800, 350 + 600, 50, 250),
        ///
        new TallGrass(700, 50 + 600, 100, 50),
        new TallGrass(650, 100 + 600, 50, 50),
        new TallGrass(600, 150 + 600, 50, 100),
        new TallGrass(450, 350 + 600, 50, 100),
        new TallGrass(400, 400 + 600, 50, 150),
        new TallGrass(350, 500 + 600, 50, 100),
        ///
        new TallGrass(500, 500 + 600, 50, 100),
        new TallGrass(550, 450 + 600, 50, 150),
        new TallGrass(600, 400 + 600, 50, 200),
        new TallGrass(650, 400 + 600, 50, 50),
        new TallGrass(700, 500 + 600, 50, 100),
        new TallGrass(750, 450 + 600, 50, 150),
        ///
        new TallGrass(700, 100 + 600, 50, 50),
        new TallGrass(650, 150 + 600, 50, 50),
        ///
        new TallGrass(450, 50 + 600, 150, 50),
        new TallGrass(550, 0 + 600, 300, 50),
        new TallGrass(450, 100 + 600, 100, 50),
        new TallGrass(400, 100 + 600, 100, 50),
        new TallGrass(350, 0 + 600, 50, 50),
        new TallGrass(350, 150 + 600, 100, 50)
      ],
      waters: [
        new Water(700, 100 + 600, 100, 500),
        new Water(650, 150 + 600, 50, 450),
        new Water(600, 250 + 600, 50, 350),
        ///
        new Water(550, 300 + 600, 50, 300),
        new Water(500, 350 + 600, 50, 250),
        new Water(450, 450 + 600, 50, 150),
        new Water(400, 550 + 600, 50, 50)
      ],
      items: [
        new LifeJacket(450, 400, 50, 50)
      ],
      rocks: [
        new Rock(300, 100 + 600, 50, 50, 'blue', false),
        new Rock(300, 250 + 600, 50, 50, 'blue', false),
        new Rock(300, 400 + 600, 50, 50, 'blue', false)
      ],
      finishAreas: [
        new FinishArea(800, 200 + 600, 50, 150)
      ],
      reverseTiles: [
        new ReverseTile(350, 450 + 600, 50, 50, 'blue')
      ],
      teleporters: [
        new Teleporter(150, 500 + 600, '8Teleporter', 50, 50, 2),
        new Teleporter(650, 50 + 600, '8Teleporter', 50, 50, 2)
      ]
    }, 'Level 8', /* Requirements */ [new Requirement(0, 7 - 1)], /* Level Borders */1, 2, 1, 2, [], /* Area */ 1, /* Time Limit */ 200))

    // Level 9
    this.world1.push(new Level({
      players: [
        new Player(0, 300, 50, 50)
      ],
      cubers: [
        new Cuber(600, 300, 50, 50, [false, false, true, true], 6),
        new Cuber(400, 350 + 600, 50, 50, [true, true, false, false], 4)
      ],
      walls: [
        /// A
        // Top-Left
        new TallGrass(0, 0, 400, 200),
        new TallGrass(0, 200, 250, 50),
        new TallGrass(0, 250, 200, 50),
        // Top-Right
        new TallGrass(450, 0, 400, 200),
        new TallGrass(600, 200, 250, 50),
        new TallGrass(650, 250, 200, 50),
        // Bottom-Left
        new TallGrass(0, 450, 400, 150),
        new TallGrass(0, 400, 250, 50),
        new TallGrass(0, 350, 200, 50),
        // Bottom-Right
        new TallGrass(450, 450, 400, 150),
        new TallGrass(600, 400, 250, 50),
        new TallGrass(650, 350, 200, 50),
        // Centre
        new TallGrass(250, 300, 50, 50),
        new TallGrass(300, 250, 250, 150),
        new TallGrass(550, 300, 50, 50),
        // Middle-Right
        new FakeTallGrass(700, 300, 150, 50),
        /// B
        // Top
        new TallGrass(0, 0 + 600, 400, 150),
        new TallGrass(450, 0 + 600, 400, 150),
        //
        new TallGrass(0, 150 + 600, 350, 50),
        new TallGrass(500, 150 + 600, 350, 50),
        //
        new TallGrass(100, 250 + 600, 250, 50),
        new TallGrass(500, 250 + 600, 250, 50),
        // Middle
        new TallGrass(0, 200 + 600, 50, 250),
        new TallGrass(800, 200 + 600, 50, 350),
        //
        new TallGrass(100, 300 + 600, 650, 50),
        new TallGrass(200, 400 + 600, 150, 50),
        // Bottom
        new TallGrass(50, 400 + 600, 300, 50),
        new TallGrass(300, 450 + 600, 200, 50),
        //
        new TallGrass(500, 400 + 600, 100, 150),
        new TallGrass(650, 400 + 600, 100, 100),
        ///
        new FakeTallGrass(750, 400 + 600, 50, 100),
        new FakeTallGrass(600, 500 + 600, 200, 50),
        ///
        new TallGrass(0, 550 + 600, 300, 50),
        new TallGrass(550, 550 + 600, 300, 50),
        ///
        /// Secret Puzzle
        ///
        // Entrance
        new TallGrass(850 + 0, 0, 850, 50),
        new TallGrass(850 + 50, 550, 450, 50),
        // Left Wall
        new TallGrass(850 + 0, 50, 50, 250),
        new FakeTallGrass(850 + 0, 300, 50, 50),
        new TallGrass(850 + 0, 350, 50, 250),
        // Left Side
        new TallGrass(850 + 100, 100, 150, 50),
        new TallGrass(850 + 50, 200, 150, 100),
        // Water End
        new TallGrass(850 + 50, 350, 200, 50),
        new TallGrass(850 + 50, 400, 100, 50),
        new TallGrass(850 + 200, 400, 50, 50),
        new TallGrass(850 + 50, 450, 50, 50),
        // Water Enterance
        new TallGrass(850 + 350, 400, 50, 50),
        // First Wall
        new TallGrass(850 + 250, 100, 100, 350),
        // Right Side
        new TallGrass(850 + 500, 50, 50, 100),
        new TallGrass(850 + 700, 50, 100, 50),
        new TallGrass(850 + 700, 150, 50, 150),
        // Life Jacket Puzzle
        new TallGrass(850 + 500, 200, 50, 350),
        new TallGrass(850 + 500, 550, 350, 50),
        new TallGrass(850 + 550, 300, 200, 50),
        new TallGrass(850 + 600, 500, 250, 50),
        new TallGrass(850 + 600, 400, 50, 50),
        new FakeTallGrass(850 + 650, 400, 50, 50),
        new FakeTallGrass(850 + 550, 350, 150, 50),
        new FakeTallGrass(850 + 550, 400, 50, 50),
        new TallGrass(850 + 800, 50, 50, 450),
        new TallGrass(850 + 700, 350, 50, 100)
      ],
      waters: [
        new Water(0, 600 + 450, 300, 100),
        new Water(300, 600 + 500, 200, 100),
        new Water(500, 600 + 550, 50, 50),

        /// Secret Puzzle
        // new Water(850 + 0, 400, 100, 150),
        new Water(850 + 50, 450, 450, 100),
        new Water(850 + 400, 400, 100, 50)
        // new Water(850 + 150, 500, 100, 100)
      ],
      items: [
        new LifeJacket(850 + 550, 500, 50, 50),
        new ThreeBead(850 + 150, 400, 50, 50)
      ],
      rocks: [
        new Rock(400, 50, 50, 50, 'pink', false)
      ],
      holes: [
        new Hole(300, 200 + 600, 50, 50, false, 0, 1),
        new Hole(500, 200 + 600, 50, 50, false, 0, 1),
        new Hole(600, 400 + 600, 50, 50, true, 0, 0),
        /// Secret Puzzle
        // Access Puzzle
        // Col 1
        new Hole(850 + 350, 50, 50, 50, false, 0, 2),
        new Hole(850 + 350, 100, 50, 50, false, 1, 2),
        new Hole(850 + 350, 150, 50, 50, false, 1, 2),
        new Hole(850 + 350, 200, 50, 50, false, 1, 2),
        new Hole(850 + 350, 250, 50, 50, false, 1, 2),
        new Hole(850 + 350, 300, 50, 50, false, 1, 2),
        new Hole(850 + 350, 350, 50, 50, false, 1, 2),
        // Col 2
        new Hole(850 + 400, 50, 50, 50, false, 1, 2),
        new Hole(850 + 400, 100, 50, 50, false, 1, 2),
        new Hole(850 + 400, 150, 50, 50, false, 1, 2),
        new Hole(850 + 400, 200, 50, 50, false, 1, 2),
        new Hole(850 + 400, 250, 50, 50, false, 1, 2),
        new Hole(850 + 400, 300, 50, 50, false, 1, 2),
        new Hole(850 + 400, 350, 50, 50, false, 1, 2),
        // Col 3
        new Hole(850 + 450, 50, 50, 50, false, 1, 2),
        new Hole(850 + 450, 100, 50, 50, false, 1, 2),
        new Hole(850 + 450, 150, 50, 50, false, 0, 2),
        new Hole(850 + 450, 200, 50, 50, false, 1, 2),
        new Hole(850 + 450, 250, 50, 50, false, 1, 2),
        new Hole(850 + 450, 300, 50, 50, false, 1, 2),
        new Hole(850 + 450, 350, 50, 50, false, 1, 2),
        // Life Jacket Puzzle
        new Hole(850 + 700, 450, 50, 50, false, 0, 2),
        new Hole(850 + 650, 450, 50, 50, false, 0, 2),
        new Hole(850 + 600, 450, 50, 50, false, 0, 1),
        ///
        new Hole(850 + 650, 400, 50, 50, false, 0, 1),
        new Hole(850 + 650, 350, 50, 50, false, 0, 1),
        new Hole(850 + 600, 350, 50, 50, false, 0, 1),
        new Hole(850 + 550, 350, 50, 50, false, 0, 1),
        new Hole(850 + 550, 400, 50, 50, false, 0, 1),
        // Right
        new Hole(850 + 600, 50, 50, 50, true, 0, 0),
        new Hole(850 + 600, 100, 50, 50, true, 0, 0),
        new Hole(850 + 600, 150, 50, 50, true, 0, 0),
        new Hole(850 + 600, 200, 50, 50, true, 0, 0)
      ],
      finishAreas: [
        new FinishArea(400, 0, 50, 50)
      ],
      changeDirectionSquares: [
        new ChangeDirectionSquare(600, 250, 50, 50, true, false, false, true, true),
        new ChangeDirectionSquare(600, 350, 50, 50, true, false, true, false, true),
        //
        new ChangeDirectionSquare(550, 250, 50, 50, false, true, true, false, true),
        new ChangeDirectionSquare(550, 350, 50, 50, false, true, false, true, true),
        //
        new ChangeDirectionSquare(550, 200, 50, 50, true, false, false, true, true),
        new ChangeDirectionSquare(550, 400, 50, 50, true, false, true, false, true),
        ///
        new ChangeDirectionSquare(250, 200, 50, 50, false, true, false, true, true),
        new ChangeDirectionSquare(250, 400, 50, 50, false, true, true, false, true),
        //
        new ChangeDirectionSquare(250, 250, 50, 50, true, false, true, false, true),
        new ChangeDirectionSquare(250, 350, 50, 50, true, false, false, true, true),
        //
        new ChangeDirectionSquare(200, 250, 50, 50, false, true, false, true, true),
        new ChangeDirectionSquare(200, 350, 50, 50, false, true, true, false, true)
      ],
      reverseTiles: [
        new ReverseTile(600, 450 + 600, 50, 50, 'pink')
      ]
    }, 'Level 9', /* Requirements */ [new Requirement(0, 8 - 1)], /* Level Borders */1, 1, 2, 2, [], /* Area */ 1, /* Time Limit */ 300))

    // Level 10
    this.world1.push(new Level({
      players: [
        new Player(700, 550, 50, 50)
      ],
      cubers: [
        new Cuber(350, 50, 50, 50, [false, false, false, true], 3.5, 750),
        new Cuber(450, 50, 50, 50, [false, false, false, true], 3.5, 750),
        ///
        new Cuber(200 + 850, 300, 50, 50, [false, true, false, false], 5, 750)
      ],
      walls: [
        new TallGrass(0, 0, 850, 50),
        // Bottom Water Walls
        new TallGrass(400, 500, 250, 50),
        new TallGrass(0, 550, 700, 50),
        new TallGrass(750, 550, 100, 50),
        // Centre Water Walls
        new TallGrass(300, 200, 100, 50),
        new TallGrass(450, 200, 100, 50),
        // Left Water Walls
        new TallGrass(250, 250, 100, 50),
        new TallGrass(0, 300, 100, 50),
        new TallGrass(150, 300, 150, 50),
        new TallGrass(0, 350, 200, 50),
        // Right Water Walls
        new TallGrass(500, 250, 100, 50),
        new TallGrass(550, 300, 100, 50),
        new TallGrass(750, 300, 100, 50),
        new TallGrass(800, 50, 50, 250),
        // Red Teleporter Puzzle Centre
        new TallGrass(250, 50, 50, 50),
        new TallGrass(250, 150, 50, 100),
        new TallGrass(550, 50, 50, 50),
        new TallGrass(550, 150, 50, 100),
        // Red Teleporter Puzzle Right
        new TallGrass(0, 50, 50, 250),
        // Screen + 850
        // Exit Puzzle Entracne
        new TallGrass(0 + 850, 550, 850, 50),
        new TallGrass(50 + 850, 500, 800, 50),
        new TallGrass(100 + 850, 450, 750, 50),
        new TallGrass(150 + 850, 400, 700, 50),
        ///
        new TallGrass(0 + 850, 0, 200, 350),
        // Red Teleporter Puzzle
        new TallGrass(200 + 850, 0, 150, 200),
        new TallGrass(350 + 850, 0, 250, 50),
        new TallGrass(600 + 850, 0, 250, 200),
        // Exit Puzzle
        new TallGrass(400 + 850, 200, 150, 50),
        new FakeTallGrass(350 + 850, 200, 50, 50),
        new TallGrass(750 + 850, 250, 100, 150),
        new TallGrass(650 + 850, 300, 50, 50),
        // Red Teleporter Puzzle and Exit Puzzle Split
        new TallGrass(200 + 850, 200, 150, 50),
        new TallGrass(450 + 850, 200, 400, 50)
      ],
      waters: [
        new Water(350, 250, 150, 50),
        ///
        new Water(300, 300, 250, 50),
        ///
        new Water(200, 350, 450, 50),
        ///
        new Water(50, 400, 600, 50),
        ///
        new Water(50, 450, 550, 50),
        ///
        new Water(50, 500, 350, 50)
      ],
      items: [
        new LifeJacket(350 + 850, 100, 50, 50)
      ],
      rocks: [
        // Red Teleporter Puzzle Right Entracne
        new Rock(650, 300, 50, 50, 'blue', true),
        new Rock(700, 300, 50, 50, 'blue', true),
        // Red Teleporter Puzzle Right Exit
        new Rock(550, 100, 50, 50, 'blue', true),
        // Red Teleporter Puzzle Centre Exit 2
        new Rock(400, 200, 50, 50, 'pink', false),
        // Exit Puzzle Entracne
        new Rock(800, 350, 50, 50, 'blue', false),
        new Rock(800, 400, 50, 50, 'blue', false),
        new Rock(800, 450, 50, 50, 'blue', false),
        new Rock(800, 500, 50, 50, 'blue', false),
        // Water Rocks
        new Rock(150, 400, 50, 50, 'pink', false),
        new Rock(150, 450, 50, 50, 'pink', false),
        new Rock(150, 500, 50, 50, 'pink', false),
        // Exit Puzzle
        new Rock(350 + 850, 250, 50, 50, 'pink', false),
        new Rock(400 + 850, 250, 50, 50, 'pink', true),
        new Rock(450 + 850, 250, 50, 50, 'pink', true),
        new Rock(500 + 850, 250, 50, 50, 'pink', true),
        new Rock(550 + 850, 250, 50, 50, 'pink', false),
        ///
        new Rock(350 + 850, 350, 50, 50, 'pink', false),
        new Rock(400 + 850, 350, 50, 50, 'pink', true),
        new Rock(450 + 850, 350, 50, 50, 'pink', true),
        new Rock(500 + 850, 350, 50, 50, 'pink', true),
        new Rock(550 + 850, 350, 50, 50, 'pink', false)
      ],
      holes: [
        // Exit Puzzle Entracne
        new Hole(150 + 850, 350, 50, 50, false, 1, 2)

      ],
      finishAreas: [
        new FinishArea(0, 400, 50, 150)
      ],
      reverseTiles: [
        new ReverseTile(350, 500, 50, 50, 'blue'),
        new ReverseTile(700 + 850, 300, 50, 50, 'pink')
      ],
      teleporters: [
        new Teleporter(100, 300, '10Teleporter', 50, 50, 1),
        new Teleporter(550 + 850, 100, '10Teleporter', 50, 50, 1)
      ]
    }, 'Level 10', /* Requirements */ [new Requirement(0, 9 - 1)], /* Level Borders */1, 1, 2, 1, [], /* Area */ 1, /* Time Limit */ 200))

    // Level 11
    this.world1.push(new Level({
      players: [
        new Player(800 + 850, 450 + 600, 50, 50)
      ],
      expanders: [
        new Expander(205 + 850, 255 + 600, /* startLength */40, 40, /* endLength */140, 140, /* speed */ 1, 1, /* waitTime */1000),
        new Expander(505, 405 + 600, /* startLength */90, 40, /* endLength */180, 140, /* speed */ 1, 1, /* waitTime */1000),
        new Expander(305, 55 + 600, /* startLength */40, 40, /* endLength */140, 140, /* speed */ 2, 2, /* waitTime */1250)
      ],
      walls: [
        // First Screen
        // Top
        new TallGrass(700 + 850, 0 + 600, 150, 400),
        new TallGrass(650 + 850, 300 + 600, 50, 50),
        new TallGrass(550 + 850, 0 + 600, 150, 300),
        new TallGrass(350 + 850, 0 + 600, 200, 250),
        new TallGrass(0 + 850, 0 + 600, 350, 200),
        new TallGrass(0 + 850, 200 + 600, 100, 50),

        // Bottom
        new TallGrass(0 + 850, 550 + 600, 850, 50),
        new TallGrass(0 + 850, 500 + 600, 650, 50),
        new TallGrass(0 + 850, 450 + 600, 550, 50),
        new TallGrass(0 + 850, 400 + 600, 400, 50),
        new TallGrass(150 + 850, 350 + 600, 150, 50),

        // Second Screen
        // Top
        new TallGrass(700, 0 + 600, 150, 250),
        new TallGrass(600, 0 + 600, 100, 300),
        new TallGrass(500, 0 + 600, 100, 350),
        // Bottom
        new TallGrass(750, 400 + 600, 100, 50),
        new TallGrass(650, 450 + 600, 250, 50),
        new TallGrass(0, 500 + 600, 850, 100),
        // Tunnle Right Side
        new TallGrass(450, 0 + 600, 50, 300),
        new TallGrass(400, 0 + 600, 50, 150),
        // Tunnle Left Side
        new TallGrass(0, 0 + 600, 250, 500),
        new TallGrass(250, 150 + 600, 50, 350),
        new TallGrass(300, 250 + 600, 50, 250),
        // Tunnle Bottom
        new TallGrass(400, 450 + 600, 50, 50),
        new TallGrass(350, 400 + 600, 50, 100),

        // Third Screen
        // Enterance
        new TallGrass(0, 550, 250, 50),
        new TallGrass(0, 500, 300, 50),
        new TallGrass(0, 450, 350, 50),
        new TallGrass(400, 550, 450, 50),
        new TallGrass(450, 500, 400, 50),
        new TallGrass(500, 450, 350, 50),

        // Top
        new TallGrass(0, 0, 100, 450),

        // Left
        new TallGrass(100, 0, 650, 100),
        new TallGrass(100, 100, 50, 100),
        new TallGrass(100, 350, 50, 100),

        // Right
        new TallGrass(700, 350, 50, 100),
        new TallGrass(700, 100, 50, 100),
        new TallGrass(750, 0, 100, 450)

      ],
      waters: [
        // Screen One
        new Water(700 + 850, 400 + 600, 150, 150),
        new Water(650 + 850, 350 + 600, 50, 200),
        new Water(550 + 850, 300 + 600, 100, 200),
        new Water(400 + 850, 250 + 600, 150, 200),
        new Water(350 + 850, 250 + 600, 50, 150),
        new Water(300 + 850, 200 + 600, 50, 200),
        new Water(150 + 850, 200 + 600, 150, 150),
        new Water(100 + 850, 200 + 600, 50, 200),
        new Water(0 + 850, 250 + 600, 100, 150),

        // Screen Two
        new Water(750, 250 + 600, 100, 150),
        new Water(700, 250 + 600, 50, 200),
        new Water(650, 300 + 600, 50, 150),
        new Water(600, 300 + 600, 50, 200),
        new Water(500, 350 + 600, 100, 150),
        new Water(450, 300 + 600, 50, 200),
        new Water(400, 250 + 600, 50, 200),
        new Water(350, 250 + 600, 50, 150),
        new Water(300, 150 + 600, 150, 100),
        new Water(250, 0 + 600, 150, 150),

        // Screen Three
        new Water(250, 550, 150, 50),
        new Water(300, 500, 150, 50)
      ],
      finishAreas: [
        new FinishArea(400, 200, 50, 50),
        new FinishArea(350, 250, 150, 50),
        new FinishArea(400, 300, 50, 50)
      ]
    }, 'Level 11', /* Requirements */ [new Requirement(0, 10 - 1)], /* Level Borders */2, 2, 2, 2, ['lifeJacket'], /* Area */ 1, /* Time Limit */ 50))

    // Level 1 + 2 + 3
    this.specialLevels.push(new Level({
      players: [
        new Player(400, 0, 50, 50)
      ],
      cubers: [
        new Cuber(700, 400, 50, 50, [true, false, false, false], 10),
        new Cuber(100, 150, 50, 50, [false, true, false, false], 10),
        new Cuber(400, 450 + 600, 50, 50, [false, false, true, false], 5.5),
        new Cuber(200, 450 + 1200, 50, 50, [true, false, false, false], 6),
        new Cuber(400, 350 + 1200, 50, 50, [true, true, false, false], 5),
        new Cuber(600, 50 + 1200, 50, 50, [false, true, false, false], 6)
      ],
      walls: [
        /// Level 1
        ///
        /// Left Wall
        new TallGrass(0, 0, 50, 200),
        new TallGrass(0, 400, 50, 200),
        //
        new TallGrass(50, 100, 50, 150),
        new TallGrass(50, 350, 50, 150),
        //
        new TallGrass(50, 250, 50, 100),
        new TallGrass(0, 200, 50, 200),
        /// Right Wall
        new TallGrass(800, 0, 50, 200),
        new TallGrass(800, 400, 50, 200),
        //
        new TallGrass(750, 100, 50, 150),
        new TallGrass(750, 350, 50, 150),
        ///
        new TallGrass(750, 250, 50, 100),
        new TallGrass(800, 200, 50, 200),
        /// Top Wall
        new TallGrass(50, 0, 300, 50),
        new TallGrass(500, 0, 300, 50),
        //
        new TallGrass(50, 50, 350, 50),
        new TallGrass(450, 50, 350, 50),
        /// Bottom Wall
        new TallGrass(50, 550, 300, 50),
        new TallGrass(500, 550, 300, 50),
        //
        new TallGrass(50, 500, 350, 50),
        new TallGrass(450, 500, 350, 50),
        /// Level 2
        ///
        new TallGrass(400, 0 + 600, 50, 50),
        new TallGrass(0, 0 + 600, 350, 600),
        new TallGrass(500, 0 + 600, 350, 600),
        ///
        new TallGrass(350, 100 + 600, 50, 50),
        new TallGrass(350, 250 + 600, 50, 250),
        ///
        new TallGrass(450, 100 + 600, 50, 200),
        new TallGrass(450, 400 + 600, 50, 100),
        new TallGrass(400, 550 + 600, 50, 50),
        /// Level 3
        ///
        new TallGrass(0, 0 + 1200, 200, 550),
        new TallGrass(650, 0 + 1200, 200, 550),
        ///
        new TallGrass(200, 0 + 1200, 150, 50),
        new TallGrass(500, 0 + 1200, 150, 50),
        ///
        new TallGrass(500, 100 + 1200, 150, 50),
        new TallGrass(200, 100 + 1200, 150, 50),
        ///
        new TallGrass(350, 200 + 1200, 150, 150),
        new TallGrass(550, 150 + 1200, 100, 250),
        new TallGrass(200, 150 + 1200, 100, 250),
        ///
        new TallGrass(0, 550 + 1200, 350, 50),
        new TallGrass(500, 550 + 1200, 350, 50),
        ///
        new TallGrass(200, 400 + 1200, 150, 50),
        new TallGrass(500, 400 + 1200, 150, 50),
        ///
        new TallGrass(200, 500 + 1200, 150, 50),
        new TallGrass(500, 500 + 1200, 150, 50)
      ],
      finishAreas: [
        new FinishArea(350, 550 + 1200, 150, 50)
      ],
      changeDirectionSquares: [
        new ChangeDirectionSquare(300, 150 + 1200, 50, 50, false, true, false, true, true),
        ///
        new ChangeDirectionSquare(500, 150 + 1200, 50, 50, true, false, false, true, true),
        ///
        new ChangeDirectionSquare(300, 350 + 1200, 50, 50, true, false, true, false, true),
        ///
        new ChangeDirectionSquare(500, 350 + 1200, 50, 50, false, true, true, false, true)
      ]
    }, 'Special 1', /* Requirements */ [new Requirement(0, 3 - 1)], /* Level Borders */1, 1, 1, 3, [], /* Area */ 1, /* Time Limit */ 200))

    // Level 10 + 11
    this.specialLevels.push(new Level({
      players: [
        new Player(700 + 1700, 550 + 600, 50, 50)
      ],
      cubers: [
        new Cuber(300 + 1700, 50 + 600, 50, 50, [false, false, false, true], 5, 1250),
        new Cuber(400 + 1700, 450 + 600, 50, 50, [false, false, true, false], 5),
        new Cuber(500 + 1700, 50 + 600, 50, 50, [false, false, false, true], 5, 1250),
        ///
        new Cuber(200 + 2550, 300 + 600, 50, 50, [false, true, false, false], 8, 1000)
      ],
      expanders: [
        new Expander(455 + 850, 305 + 600, /* startLength */40, 90, /* endLength */140, 190, /* speed */ 1, 1, /* waitTime */750),
        new Expander(205 + 850, 255 + 600, /* startLength */40, 40, /* endLength */140, 140, /* speed */ 1, 1, /* waitTime */1000),
        new Expander(505, 405 + 600, /* startLength */90, 40, /* endLength */180, 140, /* speed */ 1, 1, /* waitTime */1000),
        new Expander(305, 55 + 600, /* startLength */40, 40, /* endLength */140, 140, /* speed */ 4, 4, /* waitTime */1500)
      ],
      walls: [
        /// Level 10
        new TallGrass(0 + 1700, 0 + 600, 850, 50),
        // Bottom Water Walls
        new TallGrass(400 + 1700, 500 + 600, 250, 50),
        new TallGrass(0 + 1700, 550 + 600, 700, 50),
        new TallGrass(750 + 1700, 550 + 600, 100, 50),
        // Centre Water Walls
        new TallGrass(300 + 1700, 200 + 600, 100, 50),
        new TallGrass(450 + 1700, 200 + 600, 100, 50),
        // Left Water Walls
        new TallGrass(250 + 1700, 250 + 600, 100, 50),
        new TallGrass(0 + 1700, 300 + 600, 100, 50),
        new TallGrass(150 + 1700, 300 + 600, 150, 50),
        new TallGrass(0 + 1700, 350 + 600, 200, 50),
        // Right Water Walls
        new TallGrass(500 + 1700, 250 + 600, 100, 50),
        new TallGrass(550 + 1700, 300 + 600, 100, 50),
        new TallGrass(750 + 1700, 300 + 600, 100, 50),
        new TallGrass(800 + 1700, 50 + 600, 50, 250),
        // Red Teleporter Puzzle Centre
        new TallGrass(250 + 1700, 50 + 600, 50, 50),
        new TallGrass(250 + 1700, 150 + 600, 50, 100),
        new TallGrass(550 + 1700, 50 + 600, 50, 50),
        new TallGrass(550 + 1700, 150 + 600, 50, 100),
        // Red Teleporter Puzzle Right
        new TallGrass(0 + 1700, 50 + 600, 50, 250),
        // Screen + 850
        // Exit Puzzle Entracne
        new TallGrass(0 + 2550, 550 + 600, 850, 50),
        new TallGrass(50 + 2550, 500 + 600, 800, 50),
        new TallGrass(100 + 2550, 450 + 600, 750, 50),
        new TallGrass(150 + 2550, 400 + 600, 700, 50),
        ///
        new TallGrass(0 + 2550, 0 + 600, 200, 350),
        // Red Teleporter Puzzle
        new TallGrass(200 + 2550, 0 + 600, 150, 200),
        new TallGrass(350 + 2550, 0 + 600, 250, 50),
        new TallGrass(600 + 2550, 0 + 600, 250, 200),
        // Exit Puzzle
        new TallGrass(200 + 2550, 200 + 600, 350, 50),
        new FakeTallGrass(550 + 2550, 200 + 600, 50, 50),
        new TallGrass(750 + 2550, 250 + 600, 100, 150),
        new TallGrass(650 + 2550, 300 + 600, 50, 50),
        new TallGrass(600 + 2550, 200 + 600, 250, 50),

        /// Level 11
        // First Screen
        // Top
        new TallGrass(700 + 850, 0 + 600, 150, 400),
        new TallGrass(650 + 850, 300 + 600, 50, 50),
        new TallGrass(550 + 850, 0 + 600, 150, 300),
        new TallGrass(350 + 850, 0 + 600, 200, 250),
        new TallGrass(0 + 850, 0 + 600, 350, 200),
        new TallGrass(0 + 850, 200 + 600, 100, 50),

        // Bottom
        new TallGrass(0 + 850, 550 + 600, 850, 50),
        new TallGrass(0 + 850, 500 + 600, 650, 50),
        new TallGrass(0 + 850, 450 + 600, 550, 50),
        new TallGrass(0 + 850, 400 + 600, 400, 50),
        new TallGrass(150 + 850, 350 + 600, 150, 50),

        // Second Screen
        // Top
        new TallGrass(700, 0 + 600, 150, 250),
        new TallGrass(600, 0 + 600, 100, 300),
        new TallGrass(500, 0 + 600, 100, 350),
        // Bottom
        new TallGrass(750, 400 + 600, 100, 50),
        new TallGrass(650, 450 + 600, 250, 50),
        new TallGrass(0, 500 + 600, 850, 100),
        // Tunnle Right Side
        new TallGrass(450, 0 + 600, 50, 300),
        new TallGrass(400, 0 + 600, 50, 150),
        // Tunnle Left Side
        new TallGrass(0, 0 + 600, 250, 500),
        new TallGrass(250, 150 + 600, 50, 350),
        new TallGrass(300, 250 + 600, 50, 250),
        // Tunnle Bottom
        new TallGrass(400, 450 + 600, 50, 50),
        new TallGrass(350, 400 + 600, 50, 100),

        // Third Screen
        // Enterance
        new TallGrass(0, 550, 250, 50),
        new TallGrass(0, 500, 300, 50),
        new TallGrass(0, 450, 350, 50),
        new TallGrass(400, 550, 450, 50),
        new TallGrass(450, 500, 400, 50),
        new TallGrass(500, 450, 350, 50),

        // Top
        new TallGrass(0, 0, 100, 450),

        // Left
        new TallGrass(100, 0, 650, 100),
        new TallGrass(100, 100, 50, 100),
        new TallGrass(100, 350, 50, 100),

        // Right
        new TallGrass(700, 350, 50, 100),
        new TallGrass(700, 100, 50, 100),
        new TallGrass(750, 0, 100, 450)
      ],
      waters: [
        // Level 10
        new Water(350 + 1700, 250 + 600, 150, 50),
        ///
        new Water(300 + 1700, 300 + 600, 250, 50),
        ///
        new Water(200 + 1700, 350 + 600, 450, 50),
        ///
        new Water(0 + 1700, 400 + 600, 650, 50),
        ///
        new Water(0 + 1700, 450 + 600, 600, 50),
        ///
        new Water(0 + 1700, 500 + 600, 400, 50),

        // Level 11
        // Screen One
        new Water(700 + 850, 400 + 600, 150, 150),
        new Water(650 + 850, 350 + 600, 50, 200),
        new Water(550 + 850, 300 + 600, 100, 200),
        new Water(400 + 850, 250 + 600, 150, 200),
        new Water(350 + 850, 250 + 600, 50, 150),
        new Water(300 + 850, 200 + 600, 50, 200),
        new Water(150 + 850, 200 + 600, 150, 150),
        new Water(100 + 850, 200 + 600, 50, 200),
        new Water(0 + 850, 250 + 600, 100, 150),

        // Screen Two
        new Water(750, 250 + 600, 100, 150),
        new Water(700, 250 + 600, 50, 200),
        new Water(650, 300 + 600, 50, 150),
        new Water(600, 300 + 600, 50, 200),
        new Water(500, 350 + 600, 100, 150),
        new Water(450, 300 + 600, 50, 200),
        new Water(400, 250 + 600, 50, 200),
        new Water(350, 250 + 600, 50, 150),
        new Water(300, 150 + 600, 150, 100),
        new Water(250, 0 + 600, 150, 150),

        // Screen Three
        new Water(250, 550, 150, 50),
        new Water(300, 500, 150, 50)
      ],
      items: [
        new LifeJacket(350 + 2550, 100 + 600, 50, 50)
      ],
      rocks: [
        // Red Teleporter Puzzle Right Entracne
        new Rock(650 + 1700, 300 + 600, 50, 50, 'blue', true),
        new Rock(700 + 1700, 300 + 600, 50, 50, 'blue', true),
        // Red Teleporter Puzzle Right Exit
        new Rock(550 + 1700, 100 + 600, 50, 50, 'blue', true),
        // Red Teleporter Puzzle Centre Exit 2
        new Rock(400 + 1700, 200 + 600, 50, 50, 'pink', false),
        // Exit Puzzle Entracne
        new Rock(800 + 1700, 350 + 600, 50, 50, 'blue', false),
        new Rock(800 + 1700, 400 + 600, 50, 50, 'blue', false),
        new Rock(800 + 1700, 450 + 600, 50, 50, 'blue', false),
        new Rock(800 + 1700, 500 + 600, 50, 50, 'blue', false),
        // Water Rocks
        new Rock(150 + 1700, 400 + 600, 50, 50, 'pink', false),
        new Rock(150 + 1700, 450 + 600, 50, 50, 'pink', false),
        new Rock(150 + 1700, 500 + 600, 50, 50, 'pink', false),
        // Exit Puzzle
        new Rock(350 + 2550, 250 + 600, 50, 50, 'pink', false),
        new Rock(400 + 2550, 250 + 600, 50, 50, 'pink', true),
        new Rock(450 + 2550, 250 + 600, 50, 50, 'pink', true),
        new Rock(500 + 2550, 250 + 600, 50, 50, 'pink', true),
        new Rock(550 + 2550, 250 + 600, 50, 50, 'pink', false),
        ///
        new Rock(350 + 2550, 350 + 600, 50, 50, 'pink', false),
        new Rock(400 + 2550, 350 + 600, 50, 50, 'pink', true),
        new Rock(450 + 2550, 350 + 600, 50, 50, 'pink', true),
        new Rock(500 + 2550, 350 + 600, 50, 50, 'pink', true),
        new Rock(550 + 2550, 350 + 600, 50, 50, 'pink', false)
      ],
      holes: [
        // Exit Puzzle Entracne
        new Hole(150 + 2550, 350 + 600, 50, 50, false, 1, 2)

      ],
      finishAreas: [
        new FinishArea(400, 200, 50, 50),
        new FinishArea(350, 250, 150, 50),
        new FinishArea(400, 300, 50, 50)
      ],
      reverseTiles: [
        new ReverseTile(350 + 1700, 500 + 600, 50, 50, 'blue'),
        new ReverseTile(700 + 2550, 300 + 600, 50, 50, 'pink')
      ],
      teleporters: [
        new Teleporter(100 + 1700, 300 + 600, 'Special2Teleporter', 50, 50, 1),
        new Teleporter(550 + 2550, 100 + 600, 'Special2Teleporter', 50, 50, 1)
      ]
    }, 'Special 2', /* Requirements */ [new Requirement(0, 11 - 1)], /* Level Borders */3, 2, 4, 2, [], /* Area */ 1, /* Time Limit */ 250))
  }

  CheckUnlocked () {
    // for (let r = 0; r < this.worlds[w].levels[l].requirements.length; r++) { }
    for (let w = 0; w < this.worlds.length; w++) {
      for (let l = 0; l < this.worlds[w].levels.length; l++) {
        const currentLevel = this.worlds[w].levels[l]
        if (currentLevel.requirements.length === 0) {
          currentLevel.unlocked = true
        } else {
          const currentReqiurement = currentLevel.requirements[0]
          const levelRequired = this.worlds[currentReqiurement.worldRequired].levels[currentReqiurement.levelRequired]
          if ((currentLevel.requirements.length === 0 || levelRequired.completed)) {
            currentLevel.unlocked = true
          }
        }
      }
    }
  }
}

export class Requirement {
  constructor (world, level) {
    this.worldRequired = world
    this.levelRequired = level
  }
}
