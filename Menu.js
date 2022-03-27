"use strict";
const {GameMode, GameState, ShopMode, gameStates, levelTools} = require('./GameData')
const {canvas} = require('./Canvas')
export var menusVaribles = {
    game: undefined
}

class MenuItem {
    constructor(title, value, color, action) {
        this.title = title
        this.value = value
        this.color = color
        this.action = action
    }
}

class Menu {
    constructor(menuItems, offsetY, negativeOffsetY) {
        this.menuItems = menuItems;
        this.selectedIndex = 0
        this.offsetY = offsetY
        this.negativeOffsetY = negativeOffsetY
    }
    moveUp() {
        if (this.selectedIndex !== 0) {
            this.selectedIndex = this.selectedIndex - 1
        }  
    }

    moveDown() {
        if (this.selectedIndex !== this.menuItems.length - 1) {
            this.selectedIndex = this.selectedIndex + 1
        }  
    }

    selected() {
        var menuItem = this.menuItems[this.selectedIndex]
        menuItem.action()
    }

    Draw(textBody) {
        var self = this
        const heightPerItem = (this.negativeOffsetY - this.offsetY) / this.menuItems.length
        canvas.context.font = '115px Arial'
        if (textBody !== undefined)
            textBody()
        this.menuItems.forEach(function(menuItem, index) {
            if (index === self.selectedIndex) {
            canvas.context.fillStyle = "rgba(128, 128, 128, 0.8)";
            canvas.context.fillRect(0, self.offsetY + heightPerItem * index, 850, heightPerItem)
            gameStates.selectorY = heightPerItem * index + self.offsetY
            gameStates.selectorYBottom = heightPerItem * (index + 1) + self.offsetY
            }
            ///
            canvas.context.font = '115px Arial'
            canvas.context.fillStyle = menuItem.color
            canvas.context.fillText(menuItem.title, 10, 90 + self.offsetY + heightPerItem * index)
            
            
        })
    }
}

 export class MenuController {
    constructor() {
        this.menus = []
        this.menus.push(this.MainMenu = new Menu([
            new MenuItem("Story Mode", 1, "rgb(0, 166, 255)", function() {
                gameStates.currentGameState = GameState.Rules
                gameStates.currentGameMode = GameMode.StoryMode
            }),
            new MenuItem("Freeplay", 2, "rgb(0, 132, 216)", function() {
                gameStates.currentGameState = GameState.Rules
                gameStates.currentGameMode = GameMode.Freeplay
            }),
            new MenuItem("Shop", 3, "rgb(0, 67, 190)",function() {
                gameStates.currentGameState = GameState.Rules
                gameStates.currentGameMode = GameMode.Shop
            }),
            new MenuItem("Items Info", 4, "rgb(0, 0, 139)",function() {
                gameStates.currentGameState = GameState.Rules
                gameStates.currentGameMode = GameMode.ItemsInfo
             }),
            /*new MenuItem("Settings", 5, "darkblue", 0, function() {
                gameStates.currentGameState = GameState.Rules
                gameStates.currentGameMode = GameMode.Settings
            })*/
        ], 0, 600))
        
        this.menus.push(this.ShopMenu = new Menu([
            new MenuItem("Player", 1, "lightcoral", function() {
                gameStates.currentGameState = GameState.Started
                gameStates.currentShopMode = ShopMode.Player
            }),
            new MenuItem("Background", 2, "gold", function() {
                gameStates.currentGameState = GameState.Started
                gameStates.currentShopMode =  ShopMode.Backround
            }),
        ], 0, 600))
           
        this.menus.push(this.LoseMenu = new Menu([
            new MenuItem("Retry", 1, "violet", function() {  
                gameStates.SetGameState(GameState.Started)
                levelTools.Restart()
                levelTools.loseCounterStop = false
            }),
            new MenuItem("Return to menu", 2, "hotpink", function() {
                levelTools.Restart()
                gameStates.currentGameState = GameState.Menu
                levelTools.loseCounterStop = false
            })
        ], 200, 600))
                    
        this.menus.push(this.WinMenu = new Menu([
            new MenuItem("Continue", 1, "rgb(255, 0, 100)", function() {
                levelTools.NextLevel()
        
            }),
            new MenuItem("Return to menu", 2, "deeppink", function() {
                levelTools.NextLevel()
                gameStates.currentGameState = GameState.Menu
            }),               
        ], 200, 600))
        
        this.menus.push(this.PauseMenu = new Menu([
            new MenuItem("Resume", 1, "rgb(255, 0, 86)", function() {
                gameStates.SetGameState(GameState.Started)
        
            }),
            new MenuItem("Retry", 2, "rgb(255, 105, 0)", function() {
                gameStates.SetGameState(GameState.Started)
                levelTools.Restart()
            }),
            new MenuItem("Return to menu", 3, "rgb(255, 170, 0)", function() {
                levelTools.Restart()
                gameStates.currentGameState = GameState.Menu
            }),               
        ], 0, 600))
    }
}
