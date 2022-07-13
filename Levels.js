'use strict'
const {
  Player,
  Enemy,
  Wall,
  Item,
  Rock,
  Water,
  Hole,
  ChangeDirectionSquare,
  FinishArea,
  Unlock,
  Teleporter
} = require('./Class')
const { gameStates } = require('./GameData')

class Level {
  constructor (levelData, requirement1, requirement2, currentX, currentY, width, height) {
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
  }
}

export class LevelController {
  constructor () {
    this.levels = []
  }

  createLevels () {
    // Level 1
    this.levels.push(new Level({
      players: [
        new Player(400, 0, 50, 50)
      ],
      enemies: [
        new Enemy(800, 400, 50, 50, false, true, false, false, 5),
        new Enemy(0, 200, 50, 50, true, false, false, false, 5)
      ],
      finishAreas: [
        new FinishArea(0, 550, 850, 50)
      ]
    }, /* Requirements */0, undefined, /* Level Borders */1, 1, 1, 1))

    // Level 2
    this.levels.push(new Level({
      players: [
        new Player(400, 0, 50, 50)
      ],
      enemies: [
        new Enemy(400, 500, 50, 50, false, false, true, false, 3)
      ],
      walls: [
        new Wall(0, 0, 350, 600, 'rgb(190, 190, 190)'),
        new Wall(500, 0, 350, 600, 'rgb(190, 190, 190)'),
        ///
        new Wall(350, 100, 50, 50, 'rgb(190, 190, 190)'),
        new Wall(350, 250, 50, 200, 'rgb(190, 190, 190)'),
        ///
        new Wall(450, 100, 50, 200, 'rgb(190, 190, 190)'),
        new Wall(450, 400, 50, 50, 'rgb(190, 190, 190)')
      ],
      finishAreas: [
        new FinishArea(350, 550, 150, 50)
      ]
    }, /* Requirements */1, undefined, /* Level Borders */1, 1, 1, 1))

    // Level 3
    this.levels.push(new Level({
      players: [
        new Player(400, 0, 50, 50)
      ],
      enemies: [
        new Enemy(200, 450, 50, 50, true, false, false, false, 4),
        new Enemy(400, 350, 50, 50, true, true, false, false, 2.5),
        new Enemy(600, 50, 50, 50, false, true, false, false, 4)
      ],
      walls: [
        new Wall(0, 0, 200, 550, 'rgb(190, 190, 190)'),
        new Wall(650, 0, 200, 550, 'rgb(190, 190, 190)'),
        ///
        new Wall(200, 0, 150, 50, 'rgb(190, 190, 190)'),
        new Wall(500, 0, 150, 50, 'rgb(190, 190, 190)'),
        ///
        new Wall(500, 100, 150, 50, 'rgb(190, 190, 190)'),
        new Wall(200, 100, 150, 50, 'rgb(190, 190, 190)'),
        ///
        new Wall(350, 200, 150, 150, 'rgb(190, 190, 190)'),
        new Wall(550, 150, 100, 250, 'rgb(190, 190, 190)'),
        new Wall(200, 150, 100, 250, 'rgb(190, 190, 190)'),
        ///
        new Wall(0, 550, 350, 50, 'rgb(190, 190, 190)'),
        new Wall(500, 550, 350, 50, 'rgb(190, 190, 190)'),
        ///
        new Wall(200, 400, 150, 50, 'rgb(190, 190, 190)'),
        new Wall(500, 400, 150, 50, 'rgb(190, 190, 190)'),
        ///
        new Wall(200, 500, 150, 50, 'rgb(190, 190, 190)'),
        new Wall(500, 500, 150, 50, 'rgb(190, 190, 190)')
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
    }, /* Requirements */2, undefined, /* Level Borders */1, 1, 1, 1))

    // Level 4
    this.levels.push(new Level({
      players: [
        new Player(100, 100, 50, 50)
      ],
      enemies: [
        new Enemy(400, 50, 50, 50, true, true, false, false, 3),
        ///
        new Enemy(300, 300, 50, 50, true, false, false, false, 2.5),
        new Enemy(300, 500, 50, 50, true, false, false, false, 2.5),
        ///
        new Enemy(500, 300, 50, 50, false, true, false, false, 2.5),
        new Enemy(500, 500, 50, 50, false, true, false, false, 2.5)
      ],
      walls: [
        new Wall(0, 0, 850, 50, 'rgb(190, 190, 190)'),
        ///
        new Wall(0, 50, 100, 550, 'rgb(190, 190, 190)'),
        new Wall(750, 50, 100, 550, 'rgb(190, 190, 190)'),
        ///
        new Wall(150, 100, 250, 50, 'rgb(190, 190, 190)'),
        new Wall(450, 100, 250, 50, 'rgb(190, 190, 190)'),
        ///
        new Wall(0, 150, 400, 50, 'rgb(190, 190, 190)'),
        new Wall(450, 150, 400, 50, 'rgb(190, 190, 190)'),
        ///
        new Wall(350, 200, 50, 350, 'rgb(190, 190, 190)'),
        new Wall(450, 200, 50, 350, 'rgb(190, 190, 190)')
      ],
      rocks: [
        new Rock(400, 500, 50, 50, 'lightblue', 'aqua', '4Blue', false, 1, 1)
      ],
      finishAreas: [
        new FinishArea(100, 200, 250, 50),
        new FinishArea(500, 200, 250, 50)
      ],
      unlocks: [
        new Unlock(700, 100, 50, 50, 'rgb(180, 180, 180)', 'lightblue', 'aqua', '4Blue', 1)
      ]
    }, /* Requirements */3, undefined, /* Level Borders */1, 1, 1, 1))

    // Level 5
    this.levels.push(new Level({
      players: [
        new Player(150, 150, 50, 50)
      ],
      enemies: [
        new Enemy(50, 500, 50, 50, false, false, true, false, 2.5),
        new Enemy(500, 150, 50, 50, false, true, false, false, 2.5),
        new Enemy(500, 300, 50, 50, false, true, false, false, 2.5),
        new Enemy(500, 450, 50, 50, false, true, false, false, 2.5)
      ],
      walls: [
        // Side Walls
        new Wall(0, 550, 850, 50, 'rgb(190, 190, 190)'),
        new Wall(0, 0, 850, 50, 'rgb(190, 190, 190)'),
        ///
        new Wall(100, 100, 50, 50, 'rgb(190, 190, 190)'),
        new Wall(100, 200, 50, 400, 'rgb(190, 190, 190)'),
        ///
        new Wall(100, 150, 50, 50, 'rgba(190, 190, 190, 0.9)', true, true),
        ///
        new Wall(400, 100, 50, 100, 'rgb(190, 190, 190)'),
        new Wall(400, 200, 50, 350, 'rgb(190, 190, 190)'),
        ///
        new Wall(450, 100, 50, 450, 'rgb(190, 190, 190)'),
        ///
        new Wall(150, 100, 300, 50, 'rgb(190, 190, 190)'),
        ///
        new Wall(0, 50, 50, 500, 'rgb(190, 190, 190)'),
        ///
        new Wall(700, 50, 50, 100, 'rgb(190, 190, 190)'),
        new Wall(700, 200, 50, 100, 'rgb(190, 190, 190)'),
        new Wall(700, 350, 50, 100, 'rgb(190, 190, 190)'),
        new Wall(700, 500, 50, 50, 'rgb(190, 190, 190)'),
        ///
        new Wall(700, 450, 50, 50, 'rgba(190, 190, 190, 0.9)', true, true),
        new Wall(700, 300, 50, 50, 'rgba(190, 190, 190, 0.9)', true, true),
        new Wall(700, 150, 50, 50, 'rgba(190, 190, 190, 0.9)', true, true),
        ///
        new Wall(800, 50, 50, 500, 'rgb(190, 190, 190)')
      ],
      rocks: [
        new Rock(300, 150, 50, 50, 'lightblue', 'aqua', '5Blue', false, 1, 1),
        new Rock(350, 200, 50, 50, 'lightblue', 'aqua', '5Blue', false, 1, 1),
        new Rock(450, 50, 50, 50, 'plum', 'orchid', '5Purple', false, 2, 1)
      ],
      finishAreas: [
        new FinishArea(750, 50, 50, 500)
      ],
      changeDirectionSquares: [
        new ChangeDirectionSquare(50, 50, 50, 50, true, false, true, false, true)
      ],
      unlocks: [
        new Unlock(150, 500, 50, 50, 'rgb(180, 180, 180)', 'lightblue', 'aqua', '5Blue', 1),
        new Unlock(350, 150, 50, 50, 'rgb(180, 180, 180)', 'plum', 'orchid', '5Purple', 2)
      ]
    }, /* Requirements */4, undefined, /* Level Borders */1, 1, 1, 1))

    // Level 6
    this.levels.push(new Level({
      players: [
        new Player(50, 50, 50, 50)
      ],
      enemies: [
        new Enemy(700, 500, 50, 50, true, false, false, false, 2)
      ],
      walls: [
        new Wall(0, 0, 850, 50, 'rgb(190, 190, 190)'),
        new Wall(0, 550, 850, 50, 'rgb(190, 190, 190)'),
        new Wall(800, 50, 50, 500, 'rgb(190, 190, 190)'),
        ///
        new Wall(0, 50, 50, 550, 'rgb(190, 190, 190)'),
        ///
        new Wall(100, 50, 50, 250, 'rgb(190, 190, 190)'),
        new Wall(100, 350, 50, 250, 'rgb(190, 190, 190)'),
        ///
        new Wall(200, 50, 50, 550, 'rgb(190, 190, 190)'),
        ///
        new Wall(250, 50, 50, 250, 'rgb(190, 190, 190)'),
        new Wall(250, 350, 50, 200, 'rgb(190, 190, 190)'),
        ///
        new Wall(300, 50, 50, 250, 'rgb(190, 190, 190)'),
        ///
        new Wall(350, 50, 50, 450, 'rgb(190, 190, 190)'),
        ///
        new Wall(400, 50, 50, 250, 'rgb(190, 190, 190)'),
        new Wall(450, 350, 50, 200, 'rgb(190, 190, 190)'),
        ///
        new Wall(500, 150, 50, 400, 'rgb(190, 190, 190)'),
        ///
        new Wall(550, 150, 200, 50, 'rgb(190, 190, 190)'),
        new Wall(500, 100, 250, 50, 'rgb(190, 190, 190)'),
        ///
        new Wall(600, 250, 200, 250, 'rgb(190, 190, 190)'),
        ///
        new Wall(750, 500, 50, 50, 'rgb(190, 190, 190)')
      ],
      rocks: [
        new Rock(100, 300, 50, 50, 'plum', 'orchid', '6Purple', false, 2, 1),
        new Rock(650, 500, 50, 50, 'plum', 'orchid', '6Purple', false, 2, 1)
      ],
      finishAreas: [
        new FinishArea(150, 50, 50, 500)
      ],
      changeDirectionSquares: [
        // Right Side
        new ChangeDirectionSquare(550, 500, 50, 50, false, true, true, false, true),
        ///
        new ChangeDirectionSquare(550, 200, 50, 50, false, true, false, true, true),
        ///
        new ChangeDirectionSquare(750, 200, 50, 50, true, false, true, false, true),
        ///
        new ChangeDirectionSquare(750, 50, 50, 50, true, false, false, true, true),
        // Left Side
        new ChangeDirectionSquare(450, 50, 50, 50, false, true, false, true, true),
        ///
        new ChangeDirectionSquare(450, 300, 50, 50, true, false, true, false, true),
        ///
        new ChangeDirectionSquare(400, 300, 50, 50, false, true, false, true, true),
        ///
        new ChangeDirectionSquare(400, 500, 50, 50, true, false, true, false, true),
        ///
        new ChangeDirectionSquare(300, 500, 50, 50, false, true, true, false, true)
      ],
      unlocks: [
        new Unlock(550, 500, 50, 50, 'rgb(180, 180, 180)', 'plum', 'orchid', '6Purple', 2)
      ],
      teleporters: [
        new Teleporter(50, 500, 50, 50, '6Teleporter', 1),
        new Teleporter(250, 300, 50, 50, '6Teleporter', 1)
      ]
    }, /* Requirements */4, undefined, /* Level Borders */1, 1, 1, 1))

    // Level 7
    this.levels.push(new Level({
      players: [
        new Player(150, 50, 50, 50)
      ],
      enemies: [
        new Enemy(250, 100, 50, 50, true, false, false, false, 2.5),
        new Enemy(50, 250, 50, 50, false, true, false, false, 3),
        new Enemy(250, 400, 50, 50, true, false, false, false, 2.5)
      ],
      walls: [
        new Wall(0, 0, 50, 600, 'rgb(190, 190, 190)'),
        new Wall(50, 0, 250, 50, 'rgb(190, 190, 190)'),
        new Wall(50, 550, 250, 50, 'rgb(190, 190, 190)'),
        ///
        new Wall(50, 50, 50, 50, 'rgb(190, 190, 190)'),
        new Wall(50, 150, 50, 100, 'rgb(190, 190, 190)'),
        new Wall(50, 300, 50, 100, 'rgb(190, 190, 190)'),
        new Wall(50, 450, 50, 100, 'rgb(190, 190, 190)'),
        ///
        new Wall(250, 50, 50, 50, 'rgb(190, 190, 190)'),
        new Wall(250, 150, 50, 100, 'rgb(190, 190, 190)'),
        new Wall(250, 300, 50, 100, 'rgb(190, 190, 190)'),
        new Wall(250, 450, 50, 100, 'rgb(190, 190, 190)'),
        ///
        new Wall(300, 0, 50, 100, 'rgb(190, 190, 190)'),
        new Wall(300, 150, 50, 100, 'rgb(190, 190, 190)'),
        new Wall(300, 300, 50, 100, 'rgb(190, 190, 190)'),
        new Wall(300, 450, 50, 150, 'rgb(190, 190, 190)'),
        ///
        new Wall(800, 50, 50, 150, 'rgb(190, 190, 190)'),
        new Wall(800, 350, 50, 250, 'rgb(190, 190, 190)'),
        ///
        new Wall(700, 50, 100, 50, 'rgb(190, 190, 190)'),
        new Wall(650, 100, 50, 50, 'rgb(190, 190, 190)'),
        new Wall(600, 150, 50, 100, 'rgb(190, 190, 190)'),
        new Wall(450, 350, 50, 100, 'rgb(190, 190, 190)'),
        new Wall(400, 400, 50, 150, 'rgb(190, 190, 190)'),
        new Wall(350, 500, 50, 100, 'rgb(190, 190, 190)'),
        ///
        new Wall(500, 500, 50, 100, 'rgb(190, 190, 190)'),
        new Wall(550, 450, 50, 150, 'rgb(190, 190, 190)'),
        new Wall(600, 400, 50, 200, 'rgb(190, 190, 190)'),
        new Wall(650, 400, 50, 50, 'rgb(190, 190, 190)'),
        new Wall(700, 500, 50, 100, 'rgb(190, 190, 190)'),
        new Wall(750, 450, 50, 150, 'rgb(190, 190, 190)'),
        ///
        new Wall(700, 100, 50, 50, 'rgb(190, 190, 190)'),
        new Wall(650, 150, 50, 50, 'rgb(190, 190, 190)'),
        ///
        new Wall(450, 50, 150, 50, 'rgb(190, 190, 190)'),
        new Wall(550, 0, 300, 50, 'rgb(190, 190, 190)'),
        new Wall(450, 100, 100, 50, 'rgb(190, 190, 190)'),
        new Wall(400, 100, 100, 50, 'rgb(190, 190, 190)'),
        new Wall(350, 0, 50, 50, 'rgb(190, 190, 190)'),
        new Wall(350, 150, 100, 50, 'rgb(190, 190, 190)')
      ],
      waters: [
        new Water(700, 100, 100, 500, 'rgb(0, 175, 235)'),
        new Water(650, 150, 50, 450, 'rgb(0, 175, 235)'),
        new Water(600, 250, 50, 350, 'rgb(0, 175, 235)'),
        ///
        new Water(550, 300, 50, 300, 'rgb(0, 175, 235)'),
        new Water(500, 350, 50, 250, 'rgb(0, 175, 235)'),
        new Water(450, 450, 50, 150, 'rgb(0, 175, 235)'),
        new Water(400, 550, 50, 50, 'rgb(0, 175, 235)')
      ],
      items: [
        new Item(500, 0, 50, 50, 1)
      ],
      rocks: [
        new Rock(300, 100, 50, 50, 'lightblue', 'aqua', '7Blue', false, 1, 1),
        new Rock(300, 250, 50, 50, 'lightblue', 'aqua', '7Blue', false, 1, 1),
        new Rock(300, 400, 50, 50, 'lightblue', 'aqua', '7Blue', false, 1, 1)
      ],
      finishAreas: [
        new FinishArea(800, 200, 50, 150)
      ],
      unlocks: [
        new Unlock(350, 450, 50, 50, 'rgb(180, 180, 180)', 'lightblue', 'aqua', '7Blue', 1)
      ],
      teleporters: [
        new Teleporter(150, 500, '7Teleporter', 50, 50, 2),
        new Teleporter(650, 50, '7Teleporter', 50, 50, 2)
      ]
    }, /* Requirements */5, 6, /* Level Borders */1, 1, 1, 1))

    // Level 8
    this.levels.push(new Level({
      players: [
        new Player(100, 250, 50, 50)
      ],
      enemies: [
        new Enemy(500, 200, 50, 50, true, false, false, false, 2.5),
        /// Pink Switch Puzzle
        new Enemy(450, 300, 50, 50, false, false, false, true, 2),
        new Enemy(550, 300, 50, 50, false, false, false, true, 2),
        new Enemy(650, 300, 50, 50, false, false, false, true, 2),
        /// Blue Switch Puzzle
        new Enemy(750, 0, 50, 50, true, false, false, false, 2)
      ],
      walls: [
        new Wall(0, 550, 800, 50, 'rgb(190, 190, 190)'),
        new Wall(800, 0, 50, 600, 'rgb(190, 190, 190)'),
        // Water Walls
        new Wall(50, 150, 100, 50, 'rgb(190, 190, 190)'),
        new Wall(100, 100, 100, 50, 'rgb(190, 190, 190)'),
        new Wall(150, 50, 50, 50, 'rgb(190, 190, 190)'),
        new Wall(200, 50, 50, 50, 'rgba(190, 190, 190, 0.9)', true, true),
        new Wall(250, 0, 50, 100, 'rgb(190, 190, 190)'),
        /// Middle
        new Wall(0, 200, 350, 50, 'rgb(190, 190, 190)'),
        new Wall(550, 150, 200, 50, 'rgb(190, 190, 190)'),
        /// Bottom
        new Wall(0, 300, 300, 50, 'rgb(190, 190, 190)'),
        new Wall(400, 250, 400, 50, 'rgb(190, 190, 190)'),
        /// Pink Switch Puzzle Entrance
        new Wall(200, 350, 100, 100, 'rgb(190, 190, 190)'),
        new Wall(350, 300, 100, 100, 'rgb(190, 190, 190)'),
        new Wall(350, 400, 100, 50, 'rgba(190, 190, 190, 0.9)', true, true),
        new Wall(350, 450, 100, 100, 'rgb(190, 190, 190)'),
        /// Life Jacket Puzzle
        new Wall(50, 550, 250, 50, 'rgb(190, 190, 190)'),
        new Wall(100, 500, 250, 50, 'rgb(190, 190, 190)'),
        new Wall(0, 350, 50, 200, 'rgb(190, 190, 190)'),
        new Wall(100, 400, 50, 50, 'rgb(190, 190, 190)'),
        ///
        new Wall(150, 400, 50, 50, 'rgba(190, 190, 190, 0.9)', true, true),
        new Wall(50, 350, 150, 50, 'rgba(190, 190, 190, 0.9)', true, true),
        new Wall(50, 400, 50, 50, 'rgba(190, 190, 190, 0.9)', true, true),
        /// Pink Switch Puzzle
        // Row 1
        new Wall(500, 450, 50, 50, 'rgb(190, 190, 190)'),
        new Wall(600, 450, 50, 50, 'rgb(190, 190, 190)'),
        // Row 2
        new Wall(500, 350, 50, 50, 'rgb(190, 190, 190)'),
        new Wall(600, 350, 50, 50, 'rgb(190, 190, 190)'),
        // Pathway Walls
        new Wall(700, 350, 50, 150, 'rgb(190, 190, 190)'),
        /// Blue Switch Puzzle
        new Wall(350, 50, 200, 50, 'rgb(190, 190, 190)'),
        new Wall(350, 100, 150, 50, 'rgb(190, 190, 190)'),
        new Wall(300, 150, 200, 50, 'rgb(190, 190, 190)'),
        new Wall(550, 50, 50, 50, 'rgba(190, 190, 190, 0.9)', true, true),
        new Wall(600, 50, 200, 50, 'rgb(190, 190, 190)'),
        //
        new Wall(300, 50, 50, 50, 'rgba(190, 190, 190, 0.9)', true, true)
      ],
      waters: [
        new Water(-50, -50, 150, 200, 'rgb(0, 175, 235)'),
        new Water(100, -50, 50, 150, 'rgb(0, 175, 235)'),
        new Water(150, -50, 100, 100, 'rgb(0, 175, 235)')
      ],
      items: [
        new Item(50, 500, 50, 50, 1),
        new Item(0, 150, 50, 50, 2)
      ],
      rocks: [
        new Rock(550, 100, 50, 50, 'plum', 'orchid', '8Purple', false, 2, 1),
        new Rock(50, 250, 50, 50, 'lightblue', 'aqua', '8Blue', false, 1, 1)
      ],
      holes: [
        new Hole(550, 200, 50, 50, false, 0, 1),
        /// Life Jacket Puzzle
        new Hole(200, 450, 50, 50, false, 0, 2),
        new Hole(150, 450, 50, 50, false, 0, 2),
        new Hole(100, 450, 50, 50, false, 0, 1),
        ///
        new Hole(150, 400, 50, 50, false, 0, 1),
        new Hole(150, 350, 50, 50, false, 0, 1),
        new Hole(100, 350, 50, 50, false, 0, 1),
        new Hole(50, 350, 50, 50, false, 0, 1),
        new Hole(50, 400, 50, 50, false, 0, 1),
        /// Pink Switch Puzzle
        new Hole(700, 500, 50, 50, false, 0, 1),
        new Hole(700, 300, 50, 50, false, 0, 1)
      ],
      finishAreas: [
        new FinishArea(0, 250, 50, 50)
      ],
      changeDirectionSquares: [
        new ChangeDirectionSquare(750, 200, 50, 50, true, false, true, false, true),
        new ChangeDirectionSquare(750, 100, 50, 50, true, false, false, true, true),
        new ChangeDirectionSquare(500, 100, 50, 50, false, true, false, true, true),
        new ChangeDirectionSquare(500, 200, 50, 50, true, false, true, false, false, '8Purple')
      ],
      unlocks: [
        new Unlock(750, 400, 50, 50, 'rgb(180, 180, 180)', 'plum', 'orchid', '8Purple', 2),
        new Unlock(150, 150, 50, 50, 'rgb(180, 180, 180)', 'lightblue', 'aqua', '8Blue', 1)
      ]
    }, /* Requirements */7, undefined, /* Level Borders */1, 1, 1, 1))

    // Level 9
    this.levels.push(new Level({
      players: [
        new Player(700, 500, 50, 50)
      ],
      enemies: [
        new Enemy(350, 50, 50, 50, false, false, false, true, 2, 1000),
        new Enemy(450, 50, 50, 50, false, false, false, true, 2, 1000),
        ///
        new Enemy(200 + 850, 300, 50, 50, false, true, false, false, 2, 1000)
      ],
      walls: [
        new Wall(0, 0, 850, 50, 'rgb(190, 190, 190)'),
        // Bottom Water Walls
        new Wall(400, 500, 250, 50, 'rgb(190, 190, 190)'),
        new Wall(0, 550, 850, 50, 'rgb(190, 190, 190)'),
        // Centre Water Walls
        new Wall(300, 200, 100, 50, 'rgb(190, 190, 190)'),
        new Wall(450, 200, 100, 50, 'rgb(190, 190, 190)'),
        // Left Water Walls
        new Wall(250, 250, 100, 50, 'rgb(190, 190, 190)'),
        new Wall(0, 300, 100, 50, 'rgb(190, 190, 190)'),
        new Wall(150, 300, 150, 50, 'rgb(190, 190, 190)'),
        new Wall(0, 350, 200, 50, 'rgb(190, 190, 190)'),
        // Right Water Walls
        new Wall(500, 250, 100, 50, 'rgb(190, 190, 190)'),
        new Wall(550, 300, 100, 50, 'rgb(190, 190, 190)'),
        new Wall(750, 300, 100, 50, 'rgb(190, 190, 190)'),
        new Wall(800, 50, 50, 250, 'rgb(190, 190, 190)'),
        // Red Teleporter Puzzle Centre
        new Wall(250, 50, 50, 50, 'rgb(190, 190, 190)'),
        new Wall(250, 150, 50, 100, 'rgb(190, 190, 190)'),
        new Wall(550, 50, 50, 50, 'rgb(190, 190, 190)'),
        new Wall(550, 150, 50, 100, 'rgb(190, 190, 190)'),
        // Red Teleporter Puzzle Right
        new Wall(0, 50, 50, 250, 'rgb(190, 190, 190)'),
        // Screen + 850
        // Exit Puzzle Entracne
        new Wall(0 + 850, 550, 850, 50, 'rgb(190, 190, 190)'),
        new Wall(50 + 850, 500, 800, 50, 'rgb(190, 190, 190)'),
        new Wall(100 + 850, 450, 750, 50, 'rgb(190, 190, 190)'),
        new Wall(150 + 850, 400, 700, 50, 'rgb(190, 190, 190)'),
        ///
        new Wall(0 + 850, 0, 200, 350, 'rgb(190, 190, 190)'),
        // Red Teleporter Puzzle
        new Wall(200 + 850, 0, 150, 200, 'rgb(190, 190, 190)'),
        new Wall(350 + 850, 0, 250, 50, 'rgb(190, 190, 190)'),
        new Wall(600 + 850, 0, 250, 200, 'rgb(190, 190, 190)'),
        // Exit Puzzle
        new Wall(750 + 850, 250, 100, 150, 'rgb(190, 190, 190)'),
        new Wall(650 + 850, 300, 50, 50, 'rgb(190, 190, 190)'),
        // Red Teleporter Puzzle and Exit Puzzle Split
        new Wall(500 + 850, 200, 350, 50, 'rgb(190, 190, 190)'),
        new Wall(200 + 850, 200, 250, 50, 'rgb(190, 190, 190)'),
        new Wall(450 + 850, 200, 50, 50, 'rgba(190, 190, 190, 0.9)', true, true)

      ],
      waters: [
        new Water(350, 250, 150, 50, 'rgb(0, 175, 235)'),
        ///
        new Water(300, 300, 250, 50, 'rgb(0, 175, 235)'),
        ///
        new Water(200, 350, 450, 50, 'rgb(0, 175, 235)'),
        ///
        new Water(50, 400, 600, 50, 'rgb(0, 175, 235)'),
        ///
        new Water(50, 450, 550, 50, 'rgb(0, 175, 235)'),
        ///
        new Water(50, 500, 350, 50, 'rgb(0, 175, 235)')
      ],
      items: [
        new Item(550 + 850, 100, 50, 50, 1)
      ],
      rocks: [
        // Red Teleporter Puzzle Right Entracne
        new Rock(650, 300, 50, 50, 'lightblue', 'aqua', '9Blue', true, 1, 1),
        new Rock(700, 300, 50, 50, 'lightblue', 'aqua', '9Blue', true, 1, 1),
        // Red Teleporter Puzzle Right Exit
        new Rock(550, 100, 50, 50, 'lightblue', 'aqua', '9Blue', true, 1, 1),
        // Red Teleporter Puzzle Centre Exit 2
        new Rock(400, 200, 50, 50, 'plum', 'orchid', '9Purple', false, 2, 1),
        // Exit Puzzle Entracne
        new Rock(800, 350, 50, 50, 'lightblue', 'aqua', '9Blue', false, 1, 1),
        new Rock(800, 400, 50, 50, 'lightblue', 'aqua', '9Blue', false, 1, 1),
        new Rock(800, 450, 50, 50, 'lightblue', 'aqua', '9Blue', false, 1, 1),
        new Rock(800, 500, 50, 50, 'lightblue', 'aqua', '9Blue', false, 1, 1),
        // Water Rocks
        new Rock(150, 400, 50, 50, 'plum', 'orchid', '9Purple', false, 2, 1),
        new Rock(150, 450, 50, 50, 'plum', 'orchid', '9Purple', false, 2, 1),
        new Rock(150, 500, 50, 50, 'plum', 'orchid', '9Purple', false, 2, 1),
        // Exit Puzzle
        new Rock(400 + 850, 250, 50, 50, 'plum', 'orchid', '9Purple', false, 2, 1),
        new Rock(450 + 850, 250, 50, 50, 'plum', 'orchid', '9Purple', false, 2, 1),
        new Rock(500 + 850, 250, 50, 50, 'plum', 'orchid', '9Purple', false, 2, 1),
        ///
        new Rock(400 + 850, 350, 50, 50, 'plum', 'orchid', '9Purple', false, 2, 1),
        new Rock(450 + 850, 350, 50, 50, 'plum', 'orchid', '9Purple', false, 2, 1),
        new Rock(500 + 850, 350, 50, 50, 'plum', 'orchid', '9Purple', false, 2, 1)
      ],
      holes: [
        // Exit Puzzle Entracne
        new Hole(150 + 850, 350, 50, 50, false, 1, 2)

      ],
      finishAreas: [
        new FinishArea(0, 400, 50, 150)
      ],
      changeDirectionSquares: [
      ],
      unlocks: [
        new Unlock(350, 500, 50, 50, 'rgb(180, 180, 180)', 'lightblue', 'aqua', '9Blue', 1),
        new Unlock(700 + 850, 300, 50, 50, 'rgb(180, 180, 180)', 'plum', 'orchid', '9Purple', 2)
      ],
      teleporters: [
        new Teleporter(100, 300, '8Teleporter', 50, 50, 1),
        new Teleporter(350 + 850, 100, '8Teleporter', 50, 50, 1)
      ]
    }, /* Requirements */8, undefined, /* Level Borders */1, 1, 2, 1))
  }

  CheckLocked () {
    return gameStates.infoController.unlockedLevel >= gameStates.currentLevelIndex
  }
}
