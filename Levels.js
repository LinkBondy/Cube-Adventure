"use strict";

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

var level1 = {
    players: [
        new Player(400, 0, 50, 50),
    ],
    
    enemies: [
        new Enemy(800, 400, 50, 50, false, true, false, false, 5),
        new Enemy(0, 200, 50, 50, true, false, false, false, 5),
    ],

    walls: [],

    waters: [],

    items: [],

    rocks: [],

    holes: [],

    finishAreas: [
        new FinishArea(0, 550, 850, 50), 
    ],

    changeDirectionSquares: [],
    
    unlocks: [],

    teleporters: [],
}

var level2 = {
    players: [
        new Player(400, 0, 50, 50),
    ],
    
    enemies: [
        new Enemy(400, 500, 50, 50, false, false, true, false, 3),
    ],

    walls: [
        new Wall(0, 0, 350, 600, "rgb(190, 190, 190)"),
        new Wall(500, 0, 350, 600, "rgb(190, 190, 190)"),
        ///
        new Wall(350, 100, 50, 50, "rgb(190, 190, 190)"),
        new Wall(350, 250, 50, 200, "rgb(190, 190, 190)"),
        ///
        new Wall(450, 100, 50, 200, "rgb(190, 190, 190)"),
        new Wall(450, 400, 50, 50, "rgb(190, 190, 190)")
    ],

    waters: [],

    items: [],

    rocks: [],

    holes: [],

    finishAreas: [
        new FinishArea(350, 550, 150, 50),
    ],
    changeDirectionSquares: [],
    
    unlocks: [],
    
    teleporters: [],
}

var level3 = {
    players: [
        new Player(400, 0, 50, 50),
    ],

    enemies: [
        new Enemy(200, 450, 50, 50, true, false, false, false, 4),
        new Enemy(400, 350, 50, 50, true, true, false, false, 2.5),
        new Enemy(600, 50, 50, 50, false, true, false, false, 4),
    ],

    walls: [
        new Wall(0, 0, 200, 550, "rgb(190, 190, 190)"),
        new Wall(650, 0, 200, 550, "rgb(190, 190, 190)"),
        ///
        new Wall(200, 0, 150, 50, "rgb(190, 190, 190)"),
        new Wall(500, 0, 150, 50, "rgb(190, 190, 190)"),
        ///
        new Wall(500, 100, 150, 50, "rgb(190, 190, 190)"),
        new Wall(200, 100, 150, 50, "rgb(190, 190, 190)"),
        ///
        new Wall(350, 200, 150, 150, "rgb(190, 190, 190)"),
        new Wall(550, 150, 100, 250, "rgb(190, 190, 190)"),
        new Wall(200, 150, 100, 250, "rgb(190, 190, 190)"),
        ///
        new Wall(0, 550, 350, 50, "rgb(190, 190, 190)"),
        new Wall(500, 550, 350, 50, "rgb(190, 190, 190)"),
        ///
        new Wall(200, 400, 150, 50, "rgb(190, 190, 190)"),
        new Wall(500, 400, 150, 50, "rgb(190, 190, 190)"),
        ///
        new Wall(200, 500, 150, 50, "rgb(190, 190, 190)"),
        new Wall(500, 500, 150, 50, "rgb(190, 190, 190)"),
    ],

    waters: [],

    items: [],

    rocks: [],

    holes: [],

    finishAreas: [
        new FinishArea(350, 550, 150, 50),
    ],
    
    changeDirectionSquares: [
        new ChangeDirectionSquare(300, 150, 50, 50, false, true, false, true, true),
        ///
        new ChangeDirectionSquare(500, 150, 50, 50, true, false, false, true, true),  
        ///
        new ChangeDirectionSquare(300, 350, 50, 50, true, false, true, false, true),  
        ///
        new ChangeDirectionSquare(500, 350, 50, 50, false, true, true, false, true),    
    ],
    
    unlocks: [],
    
    teleporters: [],
}

var level4 = {
    players: [
        new Player(100, 100, 50, 50),
    ],

    enemies: [
        new Enemy(400, 50, 50, 50, true, true, false, false, 3),
        ///
        new Enemy(300, 300, 50, 50, true, false, false, false, 2.5),
        new Enemy(300, 500, 50, 50, true, false, false, false, 2.5),
        ///
        new Enemy(500, 300, 50, 50, false, true, false, false, 2.5),
        new Enemy(500, 500, 50, 50, false, true, false, false, 2.5),
    ],

    walls: [
        new Wall(0, 0, 850, 50, "rgb(190, 190, 190)"),
        ///
        new Wall(0, 50, 100, 550, "rgb(190, 190, 190)"),
        new Wall(750, 50, 100, 550, "rgb(190, 190, 190)"),
        ///
        new Wall(150, 100, 250, 50, "rgb(190, 190, 190)"),
        new Wall(450, 100, 250, 50, "rgb(190, 190, 190)"),
        ///
        new Wall(0, 150, 400, 50, "rgb(190, 190, 190)"),
        new Wall(450, 150, 400, 50, "rgb(190, 190, 190)"),
        ///
        new Wall(350, 200, 50, 350, "rgb(190, 190, 190)"),
        new Wall(450, 200, 50, 350, "rgb(190, 190, 190)"),
    ],

    waters: [],

    items: [],

    rocks: [
        new Rock(400, 500, 50, 50, "lightblue", "aqua", "4Blue", false, 1, 1)
    ],

    holes: [],

    finishAreas: [
        new FinishArea(100, 200, 250, 50),
        new FinishArea(500, 200, 250, 50),
    ],

    changeDirectionSquares: [],
    
    unlocks: [
        new Unlock(700, 100, 50, 50, "rgb(180, 180, 180)", "lightblue", "aqua", "4Blue", 1)
    ],

    teleporters: [],
}

var level5 = {

    players: [
        new Player(150, 150, 50, 50),
    ],

    enemies: [
        new Enemy(50, 500, 50, 50, false, false, true, false, 2.5),
        new Enemy(500, 150, 50, 50, false, true, false, false, 2.5),
        new Enemy(500, 300, 50, 50, false, true, false, false, 2.5),
        new Enemy(500, 450, 50, 50, false, true, false, false, 2.5),
    ],

    walls: [
        // Side Walls
        new Wall(0, 550, 850, 50, "rgb(190, 190, 190)"),
        new Wall(0, 0, 850, 50, "rgb(190, 190, 190)"),
        ///
        new Wall(100, 100, 50, 50, "rgb(190, 190, 190)"),
        new Wall(100, 200, 50, 400, "rgb(190, 190, 190)"),
        /// 
        new Wall(100, 150, 50, 50, "rgba(190, 190, 190, 0.9)", true, true),
        ///
        new Wall(400, 100, 50, 100, "rgb(190, 190, 190)"),
        new Wall(400, 200, 50, 350, "rgb(190, 190, 190)"),
        ///
        new Wall(450, 100, 50, 450, "rgb(190, 190, 190)"),
        ///
        new Wall(150, 100, 300, 50, "rgb(190, 190, 190)"),
        ///
        new Wall(0, 50, 50, 500, "rgb(190, 190, 190)"),
        ///
        new Wall(700, 50, 50, 100, "rgb(190, 190, 190)"),
        new Wall(700, 200, 50, 100, "rgb(190, 190, 190)"),
        new Wall(700, 350, 50, 100, "rgb(190, 190, 190)"),
        new Wall(700, 500, 50, 50, "rgb(190, 190, 190)"),
        ///
        new Wall(700, 450, 50, 50, "rgba(190, 190, 190, 0.9)", true, true),
        new Wall(700, 300, 50, 50, "rgba(190, 190, 190, 0.9)", true, true),
        new Wall(700, 150, 50, 50, "rgba(190, 190, 190, 0.9)", true, true),
        ///
        new Wall(800, 50, 50, 500, "rgb(190, 190, 190)",),
        
    ],

    waters: [],

    items: [],

    rocks: [
        new Rock(300, 150, 50, 50, "lightblue", "aqua", "5Blue", false, 1, 1),
        new Rock(350, 200, 50, 50, "lightblue", "aqua", "5Blue", false, 1, 1),
        new Rock(450, 50, 50, 50, "plum", "orchid", "5Purple", false, 2, 1)
    ],

    holes: [],

    finishAreas: [
        new FinishArea(750, 50, 50, 500),
    ],

    changeDirectionSquares: [
        new ChangeDirectionSquare(50, 50, 50, 50, true, false, true, false, true)
    ],

    unlocks: [
        new Unlock(150, 500, 50, 50, "rgb(180, 180, 180)", "lightblue", "aqua", "5Blue", 1),
        new Unlock(350, 150, 50, 50, "rgb(180, 180, 180)", "plum", "orchid", "5Purple", 2)            
    ],

    teleporters: [],
}

var level6_teleporter1 = new Teleporter(50, 500, undefined, 50, 50, 1)
var level6_teleporter2 = new Teleporter(250, 300, level6_teleporter1, 50, 50, 1)
level6_teleporter1.otherTeleporter = level6_teleporter2
var level6 = {
    players: [ 
        new Player(50, 50, 50, 50),
    ],

    enemies: [
        new Enemy(700, 500, 50, 50, true, false, false, false, 2),    
    ],

    walls: [
        new Wall(0, 0, 850, 50, "rgb(190, 190, 190)"),
        new Wall(0, 550, 850, 50, "rgb(190, 190, 190)"),
        new Wall(800, 50, 50, 500, "rgb(190, 190, 190)"),
        ///
        new Wall(0, 50, 50, 550, "rgb(190, 190, 190)"),
        ///
        new Wall(100, 50, 50, 250, "rgb(190, 190, 190)"),
        new Wall(100, 350, 50, 250, "rgb(190, 190, 190)"),
        ///
        new Wall(200, 50, 50, 550, "rgb(190, 190, 190)"),
        ///
        new Wall(250, 50, 50, 250, "rgb(190, 190, 190)"),
        new Wall(250, 350, 50, 200, "rgb(190, 190, 190)"),
        ///
        new Wall(300, 50, 50, 250, "rgb(190, 190, 190)"),
        ///
        new Wall(350, 50, 50, 450, "rgb(190, 190, 190)"),
        ///
        new Wall(400, 50, 50, 250, "rgb(190, 190, 190)"),
        new Wall(450, 350, 50, 200, "rgb(190, 190, 190)"),
        ///
        new Wall(500, 150, 50, 400, "rgb(190, 190, 190)"),
        ///
        new Wall(550, 150, 200, 50, "rgb(190, 190, 190)"),
        new Wall(500, 100, 250, 50, "rgb(190, 190, 190)"),
        ///
        new Wall(600, 250, 200, 250, "rgb(190, 190, 190)"),
        ///
        new Wall(750, 500, 50, 50, "rgb(190, 190, 190)"),
    ],

    waters: [],

    items: [],

    rocks: [
        new Rock(100, 300, 50, 50, "plum", "orchid", "6Purple", false, 2, 1),
        new Rock(650, 500, 50, 50, "plum", "orchid", "6Purple", false, 2, 1)
    ],

    holes: [],

    finishAreas: [
        new FinishArea(150, 50, 50, 500),
    ],
    changeDirectionSquares: [
        // Right Side
        new ChangeDirectionSquare(550, 500, 50, 50, false, true, true, false, true /*'left right up down'*/),
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
        new Unlock(550, 500, 50, 50, "rgb(180, 180, 180)", "plum", "orchid", "6Purple", 2)
    ],

    teleporters: [
        level6_teleporter1,
        level6_teleporter2
    ],
}

var level7_teleporter1 = new Teleporter(150, 500, undefined, 50, 50, 2)
var level7_teleporter2 = new Teleporter(650, 50, level7_teleporter1, 50, 50, 2)
level7_teleporter1.otherTeleporter = level7_teleporter2
var level7 = {
    players: [ 
        new Player(150, 50, 50, 50),
    ],

    enemies: [
        new Enemy(250, 100, 50, 50, true, false, false, false, 2.5),
        new Enemy(50, 250, 50, 50, false, true, false, false, 3),
        new Enemy(250, 400, 50, 50, true, false, false, false, 2.5),
    ],

    walls: [
        new Wall(0, 0, 50, 600, "rgb(190, 190, 190)"),
        new Wall(50, 0, 250, 50, "rgb(190, 190, 190)"),
        new Wall(50, 550, 250, 50, "rgb(190, 190, 190)"),
        ///
        new Wall(50, 50, 50, 50, "rgb(190, 190, 190)"),
        new Wall(50, 150, 50, 100, "rgb(190, 190, 190)"),
        new Wall(50, 300, 50, 100, "rgb(190, 190, 190)"),
        new Wall(50, 450, 50, 100, "rgb(190, 190, 190)"),
        ///
        new Wall(250, 50, 50, 50, "rgb(190, 190, 190)"),
        new Wall(250, 150, 50, 100, "rgb(190, 190, 190)"),
        new Wall(250, 300, 50, 100, "rgb(190, 190, 190)"),
        new Wall(250, 450, 50, 100, "rgb(190, 190, 190)"),
        ///
        new Wall(300, 0, 50, 100, "rgb(190, 190, 190)"),
        new Wall(300, 150, 50, 100, "rgb(190, 190, 190)"),
        new Wall(300, 300, 50, 100, "rgb(190, 190, 190)"),
        new Wall(300, 450, 50, 150, "rgb(190, 190, 190)"),
        ///
        new Wall(800, 50, 50, 150, "rgb(190, 190, 190)"),
        new Wall(800, 350, 50, 250, "rgb(190, 190, 190)"),
        ///
        new Wall(700, 50, 100, 50, "rgb(190, 190, 190)"),
        new Wall(650, 100, 50, 50, "rgb(190, 190, 190)"),
        new Wall(600, 150, 50, 100, "rgb(190, 190, 190)"),
        new Wall(450, 350, 50, 100, "rgb(190, 190, 190)"),
        new Wall(400, 400, 50, 150, "rgb(190, 190, 190)"),
        new Wall(350, 500, 50, 100, "rgb(190, 190, 190)"),
        ///
        new Wall(500, 500, 50, 100, "rgb(190, 190, 190)"),
        new Wall(550, 450, 50, 150, "rgb(190, 190, 190)"),
        new Wall(600, 400, 50, 200, "rgb(190, 190, 190)"),
        new Wall(650, 400, 50, 50, "rgb(190, 190, 190)"),
        new Wall(700, 500, 50, 100, "rgb(190, 190, 190)"),
        new Wall(750, 450, 50, 150, "rgb(190, 190, 190)"),
        ///
        new Wall(700, 100, 50, 50, "rgb(190, 190, 190)"),
        new Wall(650, 150, 50, 50, "rgb(190, 190, 190)"),
        ///
        new Wall(450, 50, 150, 50, "rgb(190, 190, 190)"),
        new Wall(550, 0, 300, 50, "rgb(190, 190, 190)"),
        new Wall(450, 100, 100, 50, "rgb(190, 190, 190)"),
        new Wall(400, 100, 100, 50, "rgb(190, 190, 190)"),
        new Wall(350, 0, 50, 50, "rgb(190, 190, 190)"),
        new Wall(350, 150, 100, 50, "rgb(190, 190, 190)"),
    ],

    waters: [
        new Water(700, 100, 100, 500, "rgb(0, 175, 235)"),
        new Water(650, 150, 50, 450, "rgb(0, 175, 235)"),
        new Water(600, 250, 50, 350, "rgb(0, 175, 235)"),
        ///
        new Water(550, 300, 50, 300, "rgb(0, 175, 235)"),
        new Water(500, 350, 50, 250, "rgb(0, 175, 235)"),
        new Water(450, 450, 50, 150, "rgb(0, 175, 235)"),
        new Water(400, 550, 50, 50, "rgb(0, 175, 235)"),      
    ],

    items: [
        new Item(500, 0, 50, 50, 1), 
    ],

    rocks: [
        new Rock(300, 100, 50, 50, "lightblue", "aqua", "7Blue", false, 1, 1),
        new Rock(300, 250, 50, 50, "lightblue", "aqua", "7Blue", false, 1, 1),
        new Rock(300, 400, 50, 50, "lightblue", "aqua", "7Blue", false, 1, 1),
    ],

    holes: [],

    finishAreas: [
        new FinishArea(800, 200, 50, 150),
    ],

    changeDirectionSquares: [],

    unlocks: [
        new Unlock(350, 450, 50, 50, "rgb(180, 180, 180)", "lightblue", "aqua", "7Blue", 1),
    ],

    teleporters: [
    level7_teleporter1,
    level7_teleporter2
    ],
}

var level8 = {
    players: [ 
        new Player(100, 250, 50, 50),
    ],
    enemies: [
        new Enemy(500, 250, 50, 50, true, false, false, false, 2),
        /// Pink Switch Puzzle
        new Enemy(450, 350, 50, 50, false, false, false, true, 2),
        new Enemy(550, 350, 50, 50, false, false, false, true, 2),
        new Enemy(650, 350, 50, 50, false, false, false, true, 2),
        /// Blue Switch Puzzle
        new Enemy(750, 0, 50, 50, true, false, false, false, 2.25)
    ],
    walls: [
        // Water Walls
        new Wall(50, 150, 100, 50, "rgb(190, 190, 190)"),
        new Wall(100, 100, 100, 50, "rgb(190, 190, 190)"),
        new Wall(150, 50, 50, 50, "rgb(190, 190, 190)"),
        new Wall(200, 50, 50, 50, "rgba(190, 190, 190, 0.9)", true, true),
        new Wall(250, 0, 50, 100, "rgb(190, 190, 190)"),
        /// Middle
        new Wall(0, 200, 450, 50, "rgb(190, 190, 190)"),
        new Wall(550, 200, 200, 50, "rgb(190, 190, 190)"),
        ///
        new Wall(800, 150, 50, 150, "rgb(190, 190, 190)"),
        /// Top
        new Wall(400, 150, 100, 50, "rgb(190, 190, 190)"),
        new Wall(450, 100, 100, 50, "rgb(190, 190, 190)"),
        new Wall(600, 100, 250, 50, "rgb(190, 190, 190)"),
        /// Bottom
        new Wall(0, 300, 250, 50, "rgb(190, 190, 190)"),
        new Wall(400, 300, 450, 50, "rgb(190, 190, 190)"),
        /// Pink Switch Puzzle Entrance
        new Wall(200, 350, 100, 50, "rgb(190, 190, 190)"),
        new Wall(250, 400, 50, 100, "rgb(190, 190, 190)"),
        new Wall(300, 400, 50, 100, "rgba(190, 190, 190, 0.9)", true, true),
        new Wall(350, 400, 100, 150, "rgb(190, 190, 190)"),
        new Wall(350, 350, 100, 50, "rgb(190, 190, 190)"),
        /// Life Jacket Puzzle
        new Wall(50, 550, 250, 50, "rgb(190, 190, 190)"),
        new Wall(50, 500, 150, 50, "rgb(190, 190, 190)"),
        new Wall(200, 400, 50, 50, "rgb(190, 190, 190)"),
        new Wall(150, 350, 50, 100, "rgb(190, 190, 190)"),
        new Wall(50, 400, 50, 50, "rgb(190, 190, 190)"),
        ///
        new Wall(100, 400, 50, 50, "rgba(190, 190, 190, 0.9)", true, true),
        new Wall(100, 350, 50, 50, "rgba(190, 190, 190, 0.9)", true, true),
        new Wall(50, 350, 50, 50, "rgba(190, 190, 190, 0.9)", true, true),
        new Wall(0, 350, 50, 50, "rgba(190, 190, 190, 0.9)", true, true),
        new Wall(0, 400, 50, 50, "rgba(190, 190, 190, 0.9)", true, true),
        /// Pink Switch Puzzle
        /// Row 1
        new Wall(450, 500, 50, 50, "rgba(190, 190, 190, 0.9)", true, true),
        new Wall(500, 500, 50, 50, "rgb(190, 190, 190)"),
        new Wall(550, 500, 50, 50, "rgba(190, 190, 190, 0.9)", true, true),
        new Wall(600, 500, 50, 50, "rgb(190, 190, 190)"),
        new Wall(650, 500, 50, 50, "rgba(190, 190, 190, 0.9)", true, true),
        /// Row 2
        new Wall(450, 400, 50, 50, "rgba(190, 190, 190, 0.9)", true, true),
        new Wall(500, 400, 50, 50, "rgb(190, 190, 190)"),
        new Wall(550, 400, 50, 50, "rgba(190, 190, 190, 0.9)", true, true),
        new Wall(600, 400, 50, 50, "rgb(190, 190, 190)"),
        new Wall(650, 400, 50, 50, "rgba(190, 190, 190, 0.9)", true, true),
        /// Pathway Walls
        new Wall(700, 400, 50, 200, "rgb(190, 190, 190)"),
        new Wall(800, 350, 50, 250, "rgb(190, 190, 190)"),
        new Wall(750, 550, 50, 50, "rgb(190, 190, 190)"),
        /// Invisble Walls
        // Row 2.5
        new Wall(450, 350, 300, 50, "rgba(190, 190, 190, 0.9)", true, true),
        // Row 1.5
        new Wall(450, 450, 250, 50, "rgba(190, 190, 190, 0.9)", true, true),
        // Row 0.5
        new Wall(350, 550, 350, 50, "rgba(190, 190, 190, 0.9)", true, true),
        ///
        new Wall(750, 350, 50, 200, "rgba(190, 190, 190, 0.9)", true, true),
        /// Blue Switch Puzzle
        new Wall(550, 100, 50, 50, "rgba(190, 190, 190, 0.9)", true, true),
        new Wall(550, 50, 50, 50, "rgba(190, 190, 190, 0.9)", true, true),
        ///
        new Wall(350, 50, 200, 50, "rgb(190, 190, 190)"),
        new Wall(600, 50, 300, 50, "rgb(190, 190, 190)"),
        new Wall(800, 0, 50, 50, "rgb(190, 190, 190)"),
        ///
        new Wall(300, 50, 50, 50, "rgba(190, 190, 190, 0.9)", true, true),
        
    ],

    waters: [
        new Water(-50, -50, 150, 200, "rgb(0, 175, 235)"),
        new Water(100, -50, 50, 150, "rgb(0, 175, 235)"),
        new Water(150, -50, 100, 100, "rgb(0, 175, 235)"),
    ],

    items: [
        new Item(0, 550, 50, 50, 1),
        new Item(0, 150, 50, 50, 2)      
    ],

    rocks: [
        new Rock(550, 150, 50, 50, "plum", "orchid", "8Purple", false, 2, 1),
        new Rock(550, 100, 50, 50, "plum", "orchid", "8Purple", false, 2, 1),
        new Rock(550, 50, 50, 50, "plum", "orchid", "8Purple", false, 2, 1),
        new Rock(50, 250, 50, 50, "lightblue", "aqua", "8Blue", false, 1, 1),
    ],

    holes: [
        new Hole(550, 250, 50, 50, false, 0, 1),
        ///
        new Hole(250, 500, 50, 50, false, 0, 2),
        new Hole(200, 500, 50, 50, false, 0, 2),
        new Hole(200, 450, 50, 50, false, 0, 2),
        new Hole(150, 450, 50, 50, false, 0, 2),
        new Hole(100, 450, 50, 50, false, 0, 2),
        new Hole(50, 450, 50, 50, false, 0, 1),
        ///
        new Hole(100, 400, 50, 50, false, 0, 1),
        new Hole(100, 350, 50, 50, false, 0, 1),
        new Hole(50, 350, 50, 50, false, 0, 1),
        new Hole(0, 350, 50, 50, false, 0, 1),
        new Hole(0, 400, 50, 50, false, 0, 1),
        //
    ],

    finishAreas: [
        new FinishArea(0, 250, 50, 50),
    ],

   

    changeDirectionSquares: [
        new ChangeDirectionSquare(750, 250, 50, 50, true, false, true, false, true),
        new ChangeDirectionSquare(750, 150, 50, 50, true, false, false, true, true),
        new ChangeDirectionSquare(500, 150, 50, 50, false, true, false, true, true),
        new ChangeDirectionSquare(500, 250, 50, 50, true, false, true, false, false, "8Purple"),
    ],

    unlocks: [
        new Unlock(750, 500, 50, 50, "rgb(180, 180, 180)", "plum", "orchid", "8Purple", 2),
        new Unlock(150, 150, 50, 50, "rgb(180, 180, 180)", "lightblue", "aqua", "8Blue", 1)
    ],
    teleporters: [],
}

export var levels = [
    level1,
    level2,
    level3,
    level4,
    level5,
    level6,
    level7,
    level8
]