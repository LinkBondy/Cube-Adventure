"use strict";
var level1 = {
    players: [
        new Player(400, 0, 50, 50, "lightgreen", "green", "aqua"),
    ],
    boxes: [
        new Box(800, 400, 50, 50, "rgb(255, 255, 132)", "coral", "rgb(255, 81, 73)", true, false, 5),
        new Box(0, 200, 50, 50, "rgb(255, 255, 132)", "coral", "rgb(255, 81, 73)", true, false, 5),
    ],
    walls: [],
    finishAreas: [
        new FinishArea(0, 550, 850, 50), 
    ],
    changeDirectionSquares: [],
    
    unlocks: [],

    teleporters: [],
}

var level2 = {
    players: [
        new Player(400, 0, 50, 50, "lightgreen", "green", "aqua"),
    ],
    
    boxes: [
        new Box(400, 500, 50, 50, "rgb(255, 255, 132)", "coral", "rgb(255, 81, 73)", false, true, 3),
    ],
    walls: [
        new Wall(0, 0, 350, 550, "rgb(190, 190, 190)"),
        new Wall(500, 0, 350, 550, "rgb(190, 190, 190)"),
        ///
        new Wall(350, 100, 50, 50, "rgb(190, 190, 190)"),
        new Wall(350, 250, 50, 200, "rgb(190, 190, 190)"),
        ///
        new Wall(450, 100, 50, 200, "rgb(190, 190, 190)"),
        new Wall(450, 400, 50, 50, "rgb(190, 190, 190)")
    ],
    finishAreas: [
        new FinishArea(0, 550, 850, 50),
    ],
    changeDirectionSquares: [],
    
    unlocks: [],
    
    teleporters: [],
}

var level3 = {
    players: [
        new Player(400, 0, 50, 50, "lightgreen", "green", "aqua"),
    ],
    boxes: [
        new Box(200, 450, 50, 50, "rgb(255, 255, 132)", "coral", "rgb(255, 81, 73)", true, false, 4),
        new Box(400, 350, 50, 50, "rgb(255, 255, 132)", "coral", "rgb(255, 81, 73)", true, false, 2.5),
        new Box(600, 50, 50, 50, "rgb(255, 255, 132)", "coral", "rgb(255, 81, 73)", true, false, 4),
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
        new Wall(0, 400, 200, 550, "rgb(190, 190, 190)"),
        new Wall(650, 400, 200, 550, "rgb(190, 190, 190)"),
        ///
        new Wall(200, 400, 150, 50, "rgb(190, 190, 190)"),
        new Wall(500, 400, 150, 50, "rgb(190, 190, 190)"),
        ///
        new Wall(200, 500, 150, 100, "rgb(190, 190, 190)"),
        new Wall(500, 500, 150, 100, "rgb(190, 190, 190)"),
    ],
    finishAreas: [
        new FinishArea(0, 550, 850, 50),
    ],
    
    changeDirectionSquares: [
        new ChangeDirectionSquare(300, 150, 50, 50),
        ///
        new ChangeDirectionSquare(500, 150, 50, 50),  
        ///
        new ChangeDirectionSquare(300, 350, 50, 50),  
        ///
        new ChangeDirectionSquare(500, 350, 50, 50),    
    ],
    
    unlocks: [],
    
    teleporters: [],
}

var level4UnlockWall = new Wall(400, 500, 50, 50, "lightblue", "aqua", false, false, true)
var level4 = {
    players: [
        new Player(100, 100, 50, 50, "lightgreen", "green", "aqua"),
    ],
    boxes: [
        new Box(400, 50, 50, 50, "rgb(255, 255, 132)", "coral", "rgb(255, 81, 73)", true, false, 3),
        ///
        new Box(300, 300, 50, 50, "rgb(255, 255, 132)", "coral", "rgb(255, 81, 73)", true, false, 2.5),
        new Box(300, 500, 50, 50, "rgb(255, 255, 132)", "coral", "rgb(255, 81, 73)", true, false, 2.5),
        ///
        new Box(500, 300, 50, 50, "rgb(255, 255, 132)", "coral", "rgb(255, 81, 73)", true, false, 2.5),
        new Box(500, 500, 50, 50, "rgb(255, 255, 132)", "coral", "rgb(255, 81, 73)", true, false, 2.5),
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
        ///
        level4UnlockWall
    ],
    finishAreas: [
        new FinishArea(100, 200, 250, 50),
        new FinishArea(500, 200, 250, 50),
    ],
    changeDirectionSquares: [],
    
    unlocks: [
        new Unlock(700, 100, 50, 50, "rgb(180, 180, 180)", "lightblue", level4UnlockWall, "aqua")
    ],

    teleporters: [],
}

var level5_1UnlockWall = new Wall(300, 150, 50, 50, "lightblue", "aqua", false, false, true)
var level5_2UnlockWall = new Wall(350, 200, 50, 50, "lightblue", "auqa", false, false, true)
var level5_3UnlockWall = new Wall(450, 50, 50, 50, "plum", "orchid", false, false, true)
var level5 = {
    players: [
        new Player(150, 150, 50, 50, "lightgreen", "green", "aqua"),
    ],
    boxes: [
        new Box(50, 500, 50, 50, "rgb(255, 255, 132)", "coral", "rgb(255, 81, 73)", false, true, 2.5),
        new Box(500, 150, 50, 50, "rgb(255, 255, 132)", "coral", "rgb(255, 81, 73)", true, false, 2.5),
        new Box(500, 300, 50, 50, "rgb(255, 255, 132)", "coral", "rgb(255, 81, 73)", true, false, 2.5),
        new Box(500, 450, 50, 50, "rgb(255, 255, 132)", "coral", "rgb(255, 81, 73)", true, false, 2.5),
    ],
    walls: [
        // Side Walls
        new Wall(0, 550, 850, 50, "rgb(190, 190, 190)"),
        new Wall(0, 0, 850, 50, "rgb(190, 190, 190)"),
        ///
        new Wall(100, 100, 50, 50, "rgb(190, 190, 190)"),
        new Wall(100, 200, 50, 450, "rgb(190, 190, 190)"),
        /// 
        new Wall(100, 150, 50, 50, "rgb(190, 190, 190)", "rgba(190, 190, 190, 0.9)", true, true),
        // Unlock Wall
        level5_1UnlockWall,
        level5_2UnlockWall,
        level5_3UnlockWall,
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
        new Wall(700, 450, 50, 50, "rgb(190, 190, 190)", "rgba(191, 191, 191, 0.9)", true, true),
        new Wall(700, 300, 50, 50, "rgb(190, 190, 190)", "rgba(191, 191, 191, 0.9)", true, true),
        new Wall(700, 150, 50, 50, "rgb(190, 190, 190)", "rgba(191, 191, 191, 0.9)", true, true),
        ///
        new Wall(800, 50, 50, 500, "rgb(190, 190, 190)", "rgb(195, 195, 195)"),
        
    ],
    finishAreas: [
        new FinishArea(750, 50, 50, 500),
    ],
    changeDirectionSquares: [
        new ChangeDirectionSquare(50, 50, 50, 50)
    ],
    unlocks: [
        new Unlock(150, 500, 50, 50, "rgb(180, 180, 180)", "lightblue", level5_1UnlockWall, "aqua"),
        new Unlock(150, 500, 50, 50, "rgb(180, 180, 180)", "lightblue", level5_2UnlockWall, "aqua"),
        new Unlock(350, 150, 50, 50, "rgb(180, 180, 180)", "plum", level5_3UnlockWall,"orchid")            
    ],

    teleporters: [],
}

var level6_1UnlockWall = new Wall(100, 300, 50, 50, "plum", "orchid", false, false, true)
var level6_2UnlockWall = new Wall(650, 500, 50, 50, "plum", "orchid", false, false, true)
var teleporter1 = new Teleporter(50, 500, undefined, 50, 50, "rgb(180, 180, 180)", "tomato", 1)
var teleporter2 = new Teleporter(250, 300, teleporter1, 50, 50, "rgb(180, 180, 180)", "tomato", 2)
teleporter1.otherTeleporter = teleporter2
var level6 = {
    players: [ 
        new Player(50, 50, 50, 50, "lightgreen", "green", "aqua"),
],
    boxes: [
        new Box(700, 500, 50, 50, "rgb(255, 255, 132)", "coral", "rgb(255, 81, 73)", true, false, 2),    
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
        level6_1UnlockWall,
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
        level6_2UnlockWall,
        ///
        new Wall(750, 500, 50, 50, "rgb(190, 190, 190)"),
    ],
    finishAreas: [
        new FinishArea(150, 50, 50, 500),
    ],
    changeDirectionSquares: [
        new ChangeDirectionSquare(550, 500, 50, 50),
        new ChangeDirectionSquare(550, 200, 50, 50),
        new ChangeDirectionSquare(750, 200, 50, 50),
        new ChangeDirectionSquare(750, 50, 50, 50),
        new ChangeDirectionSquare(450, 50, 50, 50),
        new ChangeDirectionSquare(450, 300, 50, 50),
        new ChangeDirectionSquare(400, 300, 50, 50),
        new ChangeDirectionSquare(400, 500, 50, 50),
        new ChangeDirectionSquare(300, 500, 50, 50),      
    ],
    unlocks: [
        new Unlock(550, 500, 50, 50, "rgb(180, 180, 180)", "plum", level6_1UnlockWall, "orchid"),
        new Unlock(550, 500, 50, 50, "rgb(180, 180, 180)", "plum", level6_2UnlockWall, "orchid"),
    ],

    teleporters: [
        teleporter1,
        teleporter2
    ],
}

var levels = [

    level1,
    level2,
    level3,
    level4,
    level5,
    level6
]