"use strict";
const {gameMode, startingMenusStates, storyModeStates, ShopMode, gameStates, levelTools} = require('./GameData')
const {canvas} = require('./Canvas')
class MenuItem {
    constructor(title, value, color, size, action) {
        this.title = title
        this.value = value
        this.color = color
        this.size = size
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
            canvas.context.font = menuItem.size
            canvas.context.fillStyle = menuItem.color
            canvas.context.fillText(menuItem.title, 10, 90 + self.offsetY + heightPerItem * index)
            
            
        })
    }
}

 export class MenuController {
    constructor() {
        this.menus = []
        this.menus.push(this.MainMenu = new Menu([
            new MenuItem("Story Mode", 1, "rgb(0, 166, 255)", '115px Arial', function() {
                gameStates.currentStartingMenusState = startingMenusStates.Selected
                gameStates.currentGameMode = gameMode.StoryMode
            }),
            new MenuItem("Shop", 2, "rgb(0, 132, 216)", '115px Arial', function() {
                gameStates.currentStartingMenusState = startingMenusStates.Selected
                gameStates.currentGameMode = gameMode.Shop
            }),
            new MenuItem("Items Info", 3, "rgb(0, 67, 190)", '115px Arial', function() {
                gameStates.currentStartingMenusState = startingMenusStates.Selected
                gameStates.currentGameMode = gameMode.ItemsInfo
             }),
            new MenuItem("Coming Soon", 4, "rgb(0, 0, 139)", '115px Arial', function() {
                //gameStates.currentStartingMenusState = startingMenusStates.Selected
                //gameStates.currentGameMode = gameMode.Settings
            })
        ], 0, 600))
        
        this.menus.push(this.ShopMenu = new Menu([
            new MenuItem("Player", 1, "lightcoral", '115px Arial', function() {
                gameStates.currentShopMode = ShopMode.Player
            }),
            new MenuItem("Background", 2, "gold", '115px Arial', function() {
                gameStates.currentShopMode =  ShopMode.Backround
            }),
        ], 0, 600))
           
        this.menus.push(this.LoseMenu = new Menu([
            new MenuItem("Retry", 1,"rgb(120, 0, 225)", '115px Arial', function() {
                levelTools.Restart()  
                gameStates.SetGameState(storyModeStates.Playing, "StoryMode")
                levelTools.loseCounterStop = false
            }),
            new MenuItem("Selection Menu", 2, "rgb(90, 0, 225)", '115px Arial', function() {
                levelTools.Restart()
                gameStates.SetGameState(storyModeStates.Selecting, "StoryMode")
                levelTools.loseCounterStop = false
            }),
            new MenuItem("Main Menu", 3, "rgb(60, 0, 225)", '115px Arial', function() {
                levelTools.Restart()
                gameStates.SetGameState(storyModeStates.Selecting, "StoryMode")
                gameStates.currentStartingMenusState = startingMenusStates.Menu
                levelTools.loseCounterStop = false
            })
        ], 175, 600))
                    
        this.menus.push(this.WinMenu = new Menu([
            new MenuItem("Continue", 1, "rgb(255, 0, 75)", '115px Arial', function() {
                if (gameStates.currentLevelIndex < gameStates.levelController.levels.length - 1) {
                    levelTools.NextLevel()
                    gameStates.currentLevelIndex++
                    gameStates.SetGameState(storyModeStates.Playing, "StoryMode")
                }
            }),
            new MenuItem("Selection Menu", 2, "rgb(255, 5, 115)", '115px Arial', function() {
                levelTools.NextLevel()
                gameStates.SetGameState(storyModeStates.Selecting, "StoryMode")
            }),
            new MenuItem("Main Menu", 3, "rgb(255, 10, 150)", '115px Arial', function() {
                levelTools.NextLevel()
                gameStates.SetGameState(storyModeStates.Selecting, "StoryMode")
                gameStates.currentStartingMenusState = startingMenusStates.Menu
            }),               
        ], 150, 600))
        
        this.menus.push(this.PauseMenu = new Menu([
            new MenuItem("Resume", 1, "rgb(255, 0, 86)", '115px Arial', function() {
                gameStates.SetGameState(storyModeStates.Playing, "StoryMode")
                gameStates.CurrentLevel().enemies.forEach(function(enemy) {
                    enemy.setTimer()   
                })
            }),
            new MenuItem("Retry", 2, "rgb(255, 85, 20)", '115px Arial', function() {
                levelTools.Restart()
                gameStates.SetGameState(storyModeStates.Playing, "StoryMode")
            }),
            new MenuItem("Selection Menu", 3, "rgb(255, 124, 0)", '115px Arial', function() {
                levelTools.Restart()
                gameStates.SetGameState(storyModeStates.Selecting, "StoryMode")
            }),
            new MenuItem("Main Menu", 4, "rgb(255, 170, 0)", '115px Arial', function() {
                levelTools.Restart()
                gameStates.SetGameState(storyModeStates.Selecting, "StoryMode")
                gameStates.currentStartingMenusState = startingMenusStates.Menu
            }),               
        ], 0, 600))
    }
    CheckMenu() {
        if (gameStates.currentStartingMenusState === startingMenusStates.Menu)
            return 0
        ///
        if (gameStates.currentShopMode === ShopMode.ShopMenu && gameStates.currentGameMode === gameMode.Shop && gameStates.currentStartingMenusState === startingMenusStates.Selected)
            return 1
        ///
        if (gameStates.currentGameMode === gameMode.StoryMode && gameStates.currentStartingMenusState === startingMenusStates.Selected) {
            if (gameStates.currentStoryModeState === storyModeStates.Lost)
                return 2
                ///
            if (gameStates.currentStoryModeState === storyModeStates.WonStage)
                return 3
                ///
            if (gameStates.currentStoryModeState === storyModeStates.Paused) 
                return 4
        }
    }   
}
