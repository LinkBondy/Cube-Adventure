"use strict";

const {
    GameMode, GameState, ShopMode
} = require('./GameData')

class MenuItem {
    constructor(title, value, color, action) {
        this.title = title
        this.value = value
        this.color = color
        this.action = action
    }
}

class Menu {
    constructor(menuItems) {
        this.menuItems = menuItems;
        this.selectedIndex = 0
    }
    moveUp() {
        if (this.selectedIndex !== 0) {
            this.selectedIndex = this.selectedIndex - 1
        }  
    }

    moveDown() {
        const numMenuItems = this.menuItems.length
        if (this.selectedIndex !== numMenuItems - 1) {
            this.selectedIndex = this.selectedIndex + 1
        }  
    }

    selected() {
        var menuItem = this.menuItems[this.selectedIndex]
        menuItem.action()
    }

    Draw() {
        const { game } = require('./Cube Adventure')
    
        var self = this
        const numMenuItems = this.menuItems.length
        const totalHeight = 600
        const totalHeight2 = 400
        const heightPerItem = totalHeight / numMenuItems
        const heightPerItem2 = totalHeight2 / numMenuItems
        game.context.font = '115px Arial'
        this.menuItems.forEach(function(menuItem, index) {
            if (index === self.selectedIndex && game.gameState !== GameState.Lost && game.gameState !== GameState.WonStage) {
                game.context.fillStyle = "rgba(128, 128, 128, 0.8)";
                game.context.fillRect(0, heightPerItem * index, 850, heightPerItem)
                game.selectorY = heightPerItem * index
                if (game.gameState === GameState.Menu) {
                    game.selectorY2 = heightPerItem * index + heightPerItem
                }

                if (game.gameState === GameState.Paused && game.gameMode === GameMode.StoryMode) {
                    game.selectorY2 = heightPerItem * index + heightPerItem
                }
                
                if (game.gameState === GameState.Rules && game.gameMode === GameMode.Shop) {
                    game.selectorY2 = heightPerItem * index + heightPerItem
                }
            }
            else if (index === self.selectedIndex && game.gameState === GameState.Lost || index === self.selectedIndex && game.gameState === GameState.WonStage) {
                game.context.fillStyle = "rgba(128, 128, 128, 0.8)"
                game.context.fillRect(0, 200 + heightPerItem2 * index, 850, heightPerItem2)
                game.selectorY = 200 + heightPerItem2 * index
                game.selectorY2 = 350 + heightPerItem2 * index
            }
        
            ///

            if (game.gameState === GameState.Lost || game.gameState === GameState.WonStage) {
                game.context.font = '115px Arial'
                game.context.fillStyle = menuItem.color
                game.context.fillText(menuItem.title, 10, 290 + heightPerItem2 * index)
            }
            
            else {
                game.context.font = '115px Arial'
                game.context.fillStyle = menuItem.color
                game.context.fillText(menuItem.title, 10, 90 + heightPerItem * index)
            }   
        })
    }
}

export var MainMenu = new Menu([
    new MenuItem("Story Mode", 1, "rgb(0, 166, 255)", function() {
        const { game } = require('./Cube Adventure')
        game.gameState = GameState.Rules
        game.gameMode = GameMode.StoryMode
    }),
    new MenuItem("Freeplay", 2, "rgb(0, 132, 216)", function() {
        const { game } = require('./Cube Adventure')
        game.gameState = GameState.Rules
        game.gameMode = GameMode.Freeplay
        game.oldLevel = game.currentLevel
    }),
    new MenuItem("Shop", 3, "rgb(0, 67, 190)", function() {
        const { game } = require('./Cube Adventure')
        game.gameState = GameState.Rules
        game.gameMode = GameMode.Shop
    }),
    new MenuItem("Items Info", 4, "rgb(0, 0, 139)", function() {
        const { game } = require('./Cube Adventure')
        game.gameState = GameState.Rules
        game.gameMode = GameMode.ItemsInfo
     }),
    /*new MenuItem("Settings", 5, "darkblue", function() {
        game.gameState = GameState.Rules
        game.gameMode = GameMode.Settings
    })*/
])

export var ShopMenu = new Menu([
    new MenuItem("Player", 1, "lightcoral", function() {
        const { game } = require('./Cube Adventure')
        game.gameState = GameState.Started
        game.shopMode = ShopMode.Player
    }),
    new MenuItem("Background", 2, "gold", function() {
        const { game } = require('./Cube Adventure')
        game.gameState = GameState.Started
        game.shopMode =  ShopMode.Backround
    }),
])
   
export var LoseMenu = new Menu([
    new MenuItem("Retry", 1, "violet", function() {
        const { game } = require('./Cube Adventure')    
        game.SetGameState(GameState.Started)
        game.Restart()
        game.loseCounterStop = false
    }),
    new MenuItem("Return to menu", 2, "hotpink", function() {
        const { game } = require('./Cube Adventure')    
        game.Restart()
        game.gameState = GameState.Menu
        game.loseCounterStop = false
    })
])
            
export var WinMenu = new Menu([
    new MenuItem("Continue", 1, "rgb(255, 0, 100)", function() {
        const { game } = require('./Cube Adventure')
        game.NextLevel()

    }),
    new MenuItem("Return to menu", 2, "deeppink", function() {
        const { game } = require('./Cube Adventure')
        game.NextLevel()
        game.gameState = GameState.Menu
    }),               
])

export var PauseMenu = new Menu([
    new MenuItem("Resume", 1, "rgb(255, 0, 86)", function() {
        const { game } = require('./Cube Adventure')    
        game.SetGameState(GameState.Started)

    }),
    new MenuItem("Retry", 2, "rgb(255, 105, 0)", function() {
        const { game } = require('./Cube Adventure')
        game.SetGameState(GameState.Started)
        game.Restart()
    }),
    new MenuItem("Return to menu", 3, "rgb(255, 170, 0)", function() {
        const { game } = require('./Cube Adventure')
        game.Restart()
        game.gameState = GameState.Menu
    }),               
])
    
export var Menus = [
    MainMenu,
    ShopMenu,
    LoseMenu,
    WinMenu,
    PauseMenu    
]