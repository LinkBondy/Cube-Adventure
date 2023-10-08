'use strict'
const { Player, Enemy, ChangeDirectionSquare } = require('./Moveable')
const { TallGrass, FakeTallGrass, Rock, Water } = require('./Barriers')
const { Unlock, Teleporter, Hole, FinishArea } = require('./Interactable')
const { LifeJacket, ThreeBead } = require('./Collectable')
const { gameStates } = require('../data/GameData')

class Level {
  constructor (levelData, requirement1, requirement2, currentX, currentY, width, height, timeLimit) {
    this.players = levelData.players ?? []
    this.enemies = levelData.enemies ?? []
    this.walls = levelData.walls ?? []
    this.waters = levelData.waters ?? []
    this.items = levelData.items ?? []
    this.rocks = levelData.rocks ?? []
    this.holes = levelData.holes ?? []
    this.finishAreas = levelData.finishAreas ?? []
    this.changeDirectionSquares = levelData.changeDirectionSquares ?? []
    this.unlocks = levelData.unlocks ?? []
    this.teleporters = levelData.teleporters ?? []
    this.requirement1 = requirement1
    this.requirement2 = requirement2
    this.currentX = currentX
    this.startingX = this.currentX
    this.currentY = currentY
    this.startingY = this.currentY
    this.width = width
    this.height = height
    this.collectedItems = []
    this.timeLimit = timeLimit
    this.originalTimeLimit = this.timeLimit
    this.clockFrame = 0
    this.timeWaited = 0
  }

  reset () {
    this.collectedItems = []
    this.timeLimit = this.originalTimeLimit
    this.clockFrame = 0
    this.timeWaited = 0
  }
}

export class LevelController {
  constructor () {
    this.levels = []
    this.specialLevels = []
    this.currentWorld = 1
  }

  createLevels () {
    // Level 1
    this.levels.push(new Level({
      players: [
        new Player(400, 0, 50, 50)
      ],
      enemies: [
        new Enemy(700, 400, 50, 50, [true, false, false, false], 10),
        new Enemy(100, 150, 50, 50, [false, true, false, false], 10)
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
    }, /* Requirements */0, undefined, /* Level Borders */1, 1, 1, 1, /* Time Limit */ 100))

    // Level 2
    this.levels.push(new Level({
      players: [
        new Player(400, 0, 50, 50)
      ],
      enemies: [
        new Enemy(400, 500, 50, 50, [false, false, true, false], 5.5)
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
    }, /* Requirements */1, undefined, /* Level Borders */1, 1, 1, 1, /* Time Limit */ 150))

    // Level 3
    this.levels.push(new Level({
      players: [
        new Player(400, 0, 50, 50)
      ],
      enemies: [
        new Enemy(200, 450, 50, 50, [true, false, false, false], 6),
        new Enemy(400, 350, 50, 50, [true, true, false, false], 5),
        new Enemy(600, 50, 50, 50, [false, true, false, false], 6)
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
    }, /* Requirements */2, undefined, /* Level Borders */1, 1, 1, 1, /* Time Limit */ 150))

    // Level 4
    this.levels.push(new Level({
      players: [
        new Player(400, 550, 50, 50)
      ],
      enemies: [
        new Enemy(400, 50, 50, 50, [true, true, false, false], 5.5),
        ///
        new Enemy(100, 250, 50, 50, [true, false, false, false], 5),
        new Enemy(300, 400, 50, 50, [true, false, false, false], 5),
        ///
        new Enemy(700, 250, 50, 50, [false, true, false, false], 5),
        new Enemy(500, 400, 50, 50, [false, true, false, false], 5)
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
        new Rock(600, 150, 50, 50, 'lightblue', 'aqua', '4Blue', false, 1, 1)
      ],
      finishAreas: [
        new FinishArea(600, 500, 50, 50)
      ],
      unlocks: [
        new Unlock(200, 500, 50, 50, 'rgb(180, 180, 180)', 'lightblue', 'aqua', '4Blue', 1)
      ]
    }, /* Requirements */3, undefined, /* Level Borders */1, 1, 1, 1, /* Time Limit */ 200))

    // Level 5
    this.levels.push(new Level({
      players: [
        new Player(400, 550, 50, 50)
      ],
      enemies: [
        new Enemy(250, 50, 50, 50, [false, true, false, false], 5),
        ///
        new Enemy(150 + 850, 275, 50, 50, [false, false, false, true], 6),
        new Enemy(200 + 850, 275, 50, 50, [false, false, true, false], 6)
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
        new Rock(600, 250, 50, 50, 'lightblue', 'aqua', '5Blue', false, 1, 1),
        new Rock(600, 300, 50, 50, 'lightblue', 'aqua', '5Blue', false, 1, 1),
        ///
        new Rock(50, 200, 50, 50, 'plum', 'orchid', '5Purple', false, 2, 1),
        new Rock(50, 250, 50, 50, 'plum', 'orchid', '5Purple', false, 2, 1),
        new Rock(50, 300, 50, 50, 'plum', 'orchid', '5Purple', false, 2, 1),
        new Rock(50, 350, 50, 50, 'plum', 'orchid', '5Purple', false, 2, 1)
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
      unlocks: [
        new Unlock(250, 100, 50, 50, 'rgb(180, 180, 180)', 'lightblue', 'aqua', '5Blue', 1),
        new Unlock(300 + 850, 275, 50, 50, 'rgb(180, 180, 180)', 'plum', 'orchid', '5Purple', 2)
      ]
    }, /* Requirements */4, undefined, /* Level Borders */1, 1, 2, 1, /* Time Limit */ 300))

    // Level 6
    this.levels.push(new Level({
      players: [
        new Player(800, 250, 50, 50)
      ],
      enemies: [
        new Enemy(700, 50, 50, 50, [false, false, false, true], 5),
        new Enemy(450, 500, 50, 50, [false, false, true, false], 5),
        new Enemy(250, 50, 50, 50, [false, false, false, true], 5),
        new Enemy(50, 500, 50, 50, [false, false, true, false], 5),
        new Enemy(100, 450 + 600, 50, 50, [false, true, false, false], 4)
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
        new Rock(300, 50, 50, 50, 'lightblue', 'aqua', '6Blue', false, 1, 1),
        new Rock(650, 500, 50, 50, 'lightblue', 'aqua', '6Blue', false, 1, 1)
      ],
      finishAreas: [
        new FinishArea(0, 250, 50, 100)
      ],
      changeDirectionSquares: [
        // new ChangeDirectionSquare(500, 200, 50, 50, false, true, true, true, true),
        // new ChangeDirectionSquare(600, 200, 50, 50, true, false, true, true, true)
      ],
      unlocks: [
        new Unlock(150, 350 + 600, 50, 50, 'rgb(180, 180, 180)', 'lightblue', 'aqua', '6Blue', 1)
        // new Unlock(300, 275, 50, 50, 'rgb(180, 180, 180)', 'plum', 'orchid', '6Purple', 2)
      ],
      teleporters: [
        new Teleporter(550, 450, 50, 50, '6Teleporter', 2),
        new Teleporter(350, 200, 50, 50, '6Teleporter', 2)
      ]
    }, /* Requirements */5, undefined, /* Level Borders */1, 1, 1, 2, /* Time Limit */ 350))

    // Level 7
    this.levels.push(new Level({
      players: [
        new Player(750, 100, 50, 50)
      ],
      enemies: [
        new Enemy(500, 500, 50, 50, [true, false, false, false], 3.5)
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
        new Rock(450, 500, 50, 50, 'plum', 'orchid', '7Purple', false, 2, 1),
        ///
        new Rock(700, 300, 50, 50, 'plum', 'orchid', '7Purple', false, 2, 1),
        new Rock(700, 250, 50, 50, 'plum', 'orchid', '7Purple', false, 2, 1)
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
      unlocks: [
        new Unlock(350, 500, 50, 50, 'rgb(180, 180, 180)', 'plum', 'orchid', '7Purple', 2)
      ],
      teleporters: [
        new Teleporter(750, 450, 50, 50, '7Teleporter', 1),
        new Teleporter(50, 300, 50, 50, '7Teleporter', 1)
      ]
    }, /* Requirements */6, undefined, /* Level Borders */1, 1, 1, 1, /* Time Limit */ 200))

    // Level 8
    this.levels.push(new Level({
      players: [
        new Player(150, 50 + 600, 50, 50)
      ],
      enemies: [
        new Enemy(250, 100 + 600, 50, 50, [true, false, false, false], 4),
        new Enemy(50, 250 + 600, 50, 50, [false, true, false, false], 4.5),
        new Enemy(250, 400 + 600, 50, 50, [true, false, false, false], 4)
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
        new Rock(300, 100 + 600, 50, 50, 'lightblue', 'aqua', '8Blue', false, 1, 1),
        new Rock(300, 250 + 600, 50, 50, 'lightblue', 'aqua', '8Blue', false, 1, 1),
        new Rock(300, 400 + 600, 50, 50, 'lightblue', 'aqua', '8Blue', false, 1, 1)
      ],
      finishAreas: [
        new FinishArea(800, 200 + 600, 50, 150)
      ],
      unlocks: [
        new Unlock(350, 450 + 600, 50, 50, 'rgb(180, 180, 180)', 'lightblue', 'aqua', '8Blue', 1)
      ],
      teleporters: [
        new Teleporter(150, 500 + 600, '8Teleporter', 50, 50, 2),
        new Teleporter(650, 50 + 600, '8Teleporter', 50, 50, 2)
      ]
    }, /* Requirements */7, undefined, /* Level Borders */1, 2, 1, 2, /* Time Limit */ 250))

    // Level 9
    this.levels.push(new Level({
      players: [
        new Player(0, 300, 50, 50)
      ],
      enemies: [
        new Enemy(600, 300, 50, 50, [false, false, true, true], 6),
        new Enemy(400, 350 + 600, 50, 50, [true, true, false, false], 4)
        /* new Enemy(500, 200, 50, 50, [true, false, false, false], 4),
        // Pink Switch Puzzle
        new Enemy(450, 300, 50, 50, [false, false, false, true], 3),
        new Enemy(550, 300, 50, 50, [false, false, false, true], 3),
        new Enemy(650, 300, 50, 50, [false, false, false, true], 3),
        //
        new Enemy(350, 600 + 50, 50, 50, [false, false, false, true], 4),
        new Enemy(400, 600 + 400, 50, 50, [false, false, true, false], 4),
        new Enemy(450, 600 + 50, 50, 50, [false, false, false, true], 4) */
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
        new Rock(400, 50, 50, 50, 'plum', 'orchid', '9Purple', false, 2, 1)
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
      unlocks: [
        new Unlock(600, 450 + 600, 50, 50, 'rgb(180, 180, 180)', 'plum', 'orchid', '9Purple', 2)
      ]
    }, /* Requirements */8, undefined, /* Level Borders */1, 1, 2, 2, /* Time Limit */ 200))

    // Level 10
    this.levels.push(new Level({
      players: [
        new Player(700, 550, 50, 50)
      ],
      enemies: [
        new Enemy(350, 50, 50, 50, [false, false, false, true], 3.5, 750),
        new Enemy(450, 50, 50, 50, [false, false, false, true], 3.5, 750),
        ///
        new Enemy(200 + 850, 300, 50, 50, [false, true, false, false], 5, 750)
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
        new Rock(650, 300, 50, 50, 'lightblue', 'aqua', '10Blue', true, 1, 1),
        new Rock(700, 300, 50, 50, 'lightblue', 'aqua', '10Blue', true, 1, 1),
        // Red Teleporter Puzzle Right Exit
        new Rock(550, 100, 50, 50, 'lightblue', 'aqua', '10Blue', true, 1, 1),
        // Red Teleporter Puzzle Centre Exit 2
        new Rock(400, 200, 50, 50, 'plum', 'orchid', '10Purple', false, 2, 1),
        // Exit Puzzle Entracne
        new Rock(800, 350, 50, 50, 'lightblue', 'aqua', '10Blue', false, 1, 1),
        new Rock(800, 400, 50, 50, 'lightblue', 'aqua', '10Blue', false, 1, 1),
        new Rock(800, 450, 50, 50, 'lightblue', 'aqua', '10Blue', false, 1, 1),
        new Rock(800, 500, 50, 50, 'lightblue', 'aqua', '10Blue', false, 1, 1),
        // Water Rocks
        new Rock(150, 400, 50, 50, 'plum', 'orchid', '10Purple', false, 2, 1),
        new Rock(150, 450, 50, 50, 'plum', 'orchid', '10Purple', false, 2, 1),
        new Rock(150, 500, 50, 50, 'plum', 'orchid', '10Purple', false, 2, 1),
        // Exit Puzzle
        new Rock(350 + 850, 250, 50, 50, 'plum', 'orchid', '10Purple', false, 2, 1),
        new Rock(400 + 850, 250, 50, 50, 'plum', 'orchid', '10Purple', true, 2, 1),
        new Rock(450 + 850, 250, 50, 50, 'plum', 'orchid', '10Purple', true, 2, 1),
        new Rock(500 + 850, 250, 50, 50, 'plum', 'orchid', '10Purple', true, 2, 1),
        new Rock(550 + 850, 250, 50, 50, 'plum', 'orchid', '10Purple', false, 2, 1),
        ///
        new Rock(350 + 850, 350, 50, 50, 'plum', 'orchid', '10Purple', false, 2, 1),
        new Rock(400 + 850, 350, 50, 50, 'plum', 'orchid', '10Purple', true, 2, 1),
        new Rock(450 + 850, 350, 50, 50, 'plum', 'orchid', '10Purple', true, 2, 1),
        new Rock(500 + 850, 350, 50, 50, 'plum', 'orchid', '10Purple', true, 2, 1),
        new Rock(550 + 850, 350, 50, 50, 'plum', 'orchid', '10Purple', false, 2, 1)
      ],
      holes: [
        // Exit Puzzle Entracne
        new Hole(150 + 850, 350, 50, 50, false, 1, 2)

      ],
      finishAreas: [
        new FinishArea(0, 400, 50, 150)
      ],
      unlocks: [
        new Unlock(350, 500, 50, 50, 'rgb(180, 180, 180)', 'lightblue', 'aqua', '10Blue', 1),
        new Unlock(700 + 850, 300, 50, 50, 'rgb(180, 180, 180)', 'plum', 'orchid', '10Purple', 2)
      ],
      teleporters: [
        new Teleporter(100, 300, '10Teleporter', 50, 50, 1),
        new Teleporter(550 + 850, 100, '10Teleporter', 50, 50, 1)
      ]
    }, /* Requirements */9, undefined, /* Level Borders */1, 1, 2, 1, /* Time Limit */ 300))

    // Level 1 + 2 + 3
    this.specialLevels.push(new Level({
      players: [
        new Player(400, 0, 50, 50)
      ],
      enemies: [
        new Enemy(700, 400, 50, 50, [true, false, false, false], 10),
        new Enemy(100, 150, 50, 50, [false, true, false, false], 10),
        new Enemy(400, 450 + 600, 50, 50, [false, false, true, false], 5.5),
        new Enemy(200, 450 + 1200, 50, 50, [true, false, false, false], 6),
        new Enemy(400, 350 + 1200, 50, 50, [true, true, false, false], 5),
        new Enemy(600, 50 + 1200, 50, 50, [false, true, false, false], 6)
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
    }, /* Requirements */3, undefined, /* Level Borders */1, 1, 1, 3, /* Time Limit */ 500))
  }

  CheckLocked () {
    return gameStates.infoController.unlockedLevel >= gameStates.currentLevelIndex
  }
}
