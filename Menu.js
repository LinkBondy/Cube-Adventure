"use strict";
const {gameMode, startingMenusStates, storyModeStates, ShopMode, gameStates, levelTools, settingStates} = require('./GameData')
const {canvas} = require('./Canvas')
class MenuItem {
    constructor(title, valueX, valueY, color, action) {
        this.title = title
        this.valueX = valueX
        this.valueY = valueY
        this.color = color
        this.action = action
    }
}

class Menu {
    constructor(menuItems, width, height, offsetX, negativeOffsetX, offsetY, negativeOffsetY, textYOffset) {
        this.menuItems = menuItems;
        this.selectedIndexX = 0
        this.selectedIndexY = 0
        this.width = width
        this.height = height
        this.offsetX = offsetX
        this.negativeOffsetX = negativeOffsetX
        this.offsetY = offsetY
        this.negativeOffsetY = negativeOffsetY
        this.textYOffset = textYOffset / 3
        ///
        this.menuItems.forEach(function(menuItem) {
            menuItem.size = textYOffset + "px Arial"
        })
    }

    moveLeft() {
        if (this.selectedIndexX !== 0) {
            this.selectedIndexX = this.selectedIndexX - 1
        }  
    }

    moveRight() {
        if (this.selectedIndexX !== this.width - 1) {
            this.selectedIndexX = this.selectedIndexX + 1
        }  
    } 

    moveUp() {
        if (this.selectedIndexY !== 0) {
            this.selectedIndexY = this.selectedIndexY - 1
        }  
    }

    moveDown() {
        if (this.selectedIndexY !== this.height - 1) {
            this.selectedIndexY = this.selectedIndexY + 1
        }  
    }

    selected() {
        // Find the selected menuItem
        var menuItem = this.menuItems[this.selectedIndexX * this.height + this.selectedIndexY]
        menuItem.action()
    }

    Draw() {
        var self = this
        // Setting the width and height per menuItem
        const heightPerItem = (this.negativeOffsetY - 5 - this.offsetY) / this.height
        const widthPerItem = (this.negativeOffsetX - 5 - this.offsetX) / this.width
        this.menuItems.forEach(function(menuItem) {
            if ((menuItem.valueX - 1) === self.selectedIndexX && (menuItem.valueY - 1) === self.selectedIndexY) {
                canvas.context.shadowColor = "rgba(0, 0, 0, 0.8)";;
                canvas.context.shadowOffsetX = 5;
                canvas.context.shadowOffsetY = 5;
                canvas.context.fillStyle = "rgba(128, 128, 128, 0.8)";
                canvas.context.fillRect(self.offsetX + widthPerItem * (menuItem.valueX - 1), self.offsetY + heightPerItem * (menuItem.valueY - 1), widthPerItem, heightPerItem)
                canvas.context.shadowOffsetX = 0;
                canvas.context.shadowOffsetY = 0;
                // Storing selector positions
                gameStates.selectorX = widthPerItem * (menuItem.valueX - 1) + self.offsetX
                gameStates.selectorXBottom = widthPerItem * menuItem.valueX + self.offsetX
                gameStates.selectorY = heightPerItem * (menuItem.valueY - 1) + self.offsetY
                gameStates.selectorYBottom = heightPerItem * menuItem.valueY + self.offsetY
            }
            // Drawing the MenuItem's text
            canvas.context.font = menuItem.size
            canvas.context.fillStyle = menuItem.color
            var textX = widthPerItem * (menuItem.valueX - 1) + self.offsetX
            var textY = heightPerItem * (menuItem.valueY - 1) + self.offsetY
            canvas.context.textAlign = 'center'
            canvas.context.fillText(menuItem.title, textX + widthPerItem / 2, textY + heightPerItem / 2 + self.textYOffset)
            canvas.context.textAlign = 'left'
        })
    }
}

export class MenuController {
    constructor() {
        this.menus = []
        this.menus.push(this.MainMenu = new Menu([
            new MenuItem("Story Mode", 1, 1, "rgb(0, 166, 255)", function() {
                gameStates.currentStartingMenusState = startingMenusStates.Selected
                gameStates.currentGameMode = gameMode.StoryMode
            }),
            new MenuItem("Customize",  1, 2, "rgb(0, 132, 216)", function() {
                gameStates.currentStartingMenusState = startingMenusStates.Selected
                gameStates.currentGameMode = gameMode.Shop
            }),
            new MenuItem("Items Info", 1, 3, "rgb(0, 67, 190)", function() {
                gameStates.currentStartingMenusState = startingMenusStates.Selected
                gameStates.currentGameMode = gameMode.ItemsInfo
             }),
            new MenuItem("Settings", 1, 4, "rgb(0, 0, 139)", function() {
                gameStates.currentStartingMenusState = startingMenusStates.Selected
                gameStates.currentGameMode = gameMode.Settings
            }),
            new MenuItem("Comming Soon", 1, 5, "rgb(55, 0, 110)", function() {
                
            })
        ], /*length*/1, /*height*/5, /*offsetX*/0, /*negativeOffsetX*/850, /*offsetY*/0, /*negativeOffsetY*/600, /*Used to find textOffsetY and fontSize*/90))
        
        this.menus.push(this.ShopMenu = new Menu([
            new MenuItem("Player",  1, 1, "lightcoral", function() {
                gameStates.currentShopMode = ShopMode.Player
            }),
            new MenuItem("Background",  1, 2, "gold", function() {
                gameStates.currentShopMode =  ShopMode.Backround
            }),
        ], /*length*/1, /*height*/2, /*offsetX*/0, /*negativeOffsetX*/850, /*offsetY*/0, /*negativeOffsetY*/600, /*Used to find textOffsetY and fontSize*/130))

        this.menus.push(this.KeybindsSelector = new Menu([
            new MenuItem("ArrowLeft", 1, 1, "rgb(172, 0, 172)", function() {gameStates.keybindController.startRebind("A", 1, this)}),
            new MenuItem("ArrowRight", 1, 2, "rgb(183, 0, 158)", function() {gameStates.keybindController.startRebind("A", 2, this)}),
            new MenuItem("ArrowUp", 1, 3, "rgb(195, 0, 144)", function() {gameStates.keybindController.startRebind("A", 3, this)}),
            new MenuItem("ArrowDown", 1, 4, "rgb(207, 0, 130)", function() {gameStates.keybindController.startRebind("A", 4, this)}),
            ///
            new MenuItem("Space", 1, 5, "rgb(219, 0, 116)", function() {gameStates.keybindController.startRebind("A", 5, this)}),
            new MenuItem("Backspace", 1, 6, "rgb(231, 0, 102)", function() {gameStates.keybindController.startRebind("A", 6, this)}),
            new MenuItem("Shift", 1, 7, "rgb(243, 0, 88)", function() {gameStates.keybindController.startRebind("A", 7, this)}),
            new MenuItem("Column 1", 1, 8, "rgb(255, 0, 75)", function() {gameStates.keybindController.resetKeybinds("A")}),
            ///
            ///
            new MenuItem("a", 2, 1, "rgb(172, 0, 172)", function() {gameStates.keybindController.startRebind("B", 1, this)}),
            new MenuItem("d", 2, 2, "rgb(183, 0, 158)", function() {gameStates.keybindController.startRebind("B", 2, this)}),
            new MenuItem("w", 2, 3, "rgb(195, 0, 144)", function() {gameStates.keybindController.startRebind("B", 3, this)}),
            new MenuItem("s", 2, 4, "rgb(207, 0, 130)", function() {gameStates.keybindController.startRebind("B", 4, this)}),
            ///
            new MenuItem("Enter", 2, 5, "rgb(219, 0, 116)", function() {gameStates.keybindController.startRebind("B", 5, this)}),
            new MenuItem("b", 2, 6, "rgb(231, 0, 102)", function() {gameStates.keybindController.startRebind("B", 6, this)}),
            new MenuItem("u", 2, 7, "rgb(243, 0, 88)", function() {gameStates.keybindController.startRebind("B", 7, this)}),
            new MenuItem("Column 2", 2, 8, "rgb(255, 0, 75)", function() {gameStates.keybindController.resetKeybinds("B")}),
        ], /*length*/2, /*height*/8, /*offsetX*/290, /*negativeOffsetX*/850, /*offsetY*/0, /*negativeOffsetY*/600, /*Used to find textOffsetY and fontSize*/50))

        this.menus.push(this.SettingsMenu = new Menu([
            new MenuItem("Keybinds", 1, 1, "rgb(230, 200, 0)", function() {
                gameStates.SetGameState(settingStates.Keybinds, "Settings")
            }),
            new MenuItem("Theme Colour", 1, 2, "rgb(135, 200, 0)", function() {
                gameStates.SetGameState(settingStates.ThemeColourSelection, "Settings")
            }),
            new MenuItem("Comming Soon", 1, 3, "rgb(0, 200, 0)", function() {     
                //gameStates.SetGameState(settingStates.Sound, "Settings")
            }),               
        ], /*length*/1, /*height*/3, /*offsetX*/0, /*negativeOffsetX*/850, /*offsetY*/0, /*negativeOffsetY*/600, /*Used to find textOffsetY and fontSize*/115))
   
        this.menus.push(this.LoseMenu = new Menu([
            new MenuItem("Retry", 1, 1, "rgb(120, 0, 225)", function() {
                levelTools.Restart()  
                gameStates.SetGameState(storyModeStates.Playing, "StoryMode")
                levelTools.loseCounterStop = false
            }),
            new MenuItem("Selection Menu", 1, 2, "rgb(90, 0, 225)", function() {
                levelTools.Restart()
                gameStates.SetGameState(storyModeStates.Selecting, "StoryMode")
                levelTools.loseCounterStop = false
            }),
            new MenuItem("Main Menu", 1, 3, "rgb(60, 0, 225)", function() {
                levelTools.Restart()
                gameStates.SetGameState(storyModeStates.Selecting, "StoryMode")
                gameStates.currentStartingMenusState = startingMenusStates.Menu
                levelTools.loseCounterStop = false
            })
        ], /*length*/1, /*height*/3, /*offsetX*/0, /*negativeOffsetX*/850, /*offsetY*/175, /*negativeOffsetY*/600, /*Used to find textOffsetY and fontSize*/115))
                    
        this.menus.push(this.WinMenu = new Menu([
            new MenuItem("Continue", 1, 1, "rgb(255, 0, 75)", function() {
                if (gameStates.currentLevelIndex < gameStates.levelController.levels.length - 1) {
                    levelTools.NextLevel()
                    gameStates.currentLevelIndex++
                    gameStates.SetGameState(storyModeStates.Playing, "StoryMode")
                }
            }),
            new MenuItem("Selection Menu", 1, 2, "rgb(255, 5, 115)", function() {
                levelTools.NextLevel()
                gameStates.SetGameState(storyModeStates.Selecting, "StoryMode")
            }),
            new MenuItem("Main Menu", 1, 3, "rgb(255, 10, 150)", function() {
                levelTools.NextLevel()
                gameStates.SetGameState(storyModeStates.Selecting, "StoryMode")
                gameStates.currentStartingMenusState = startingMenusStates.Menu
            }),               
        ], /*length*/1, /*height*/3, /*offsetX*/0, /*negativeOffsetX*/850, /*offsetY*/150, /*negativeOffsetY*/600, /*Used to find textOffsetY and fontSize*/115))
        
        this.menus.push(this.PauseMenu = new Menu([
            new MenuItem("Resume", 1, 1, "rgb(255, 0, 86)", function() {
                gameStates.SetGameState(storyModeStates.Playing, "StoryMode")
                gameStates.CurrentLevel().enemies.forEach(function(enemy) {
                    enemy.setTimer()   
                })
            }),
            new MenuItem("Retry", 1, 2, "rgb(255, 85, 20)", function() {
                levelTools.Restart()
                gameStates.SetGameState(storyModeStates.Playing, "StoryMode")
            }),
            new MenuItem("Selection Menu", 1, 3, "rgb(255, 124, 0)", function() {
                levelTools.Restart()
                gameStates.SetGameState(storyModeStates.Selecting, "StoryMode")
            }),
            new MenuItem("Main Menu", 1, 4, "rgb(255, 170, 0)", function() {
                levelTools.Restart()
                gameStates.SetGameState(storyModeStates.Selecting, "StoryMode")
                gameStates.currentStartingMenusState = startingMenusStates.Menu
            }),               
        ], /*length*/1, /*height*/4, /*offsetX*/0, /*negativeOffsetX*/850, /*offsetY*/0, /*negativeOffsetY*/600, /*Used to find textOffsetY and fontSize*/115))

        
    }
    CheckMenu() {
        //Find the current menu
        if (gameStates.currentStartingMenusState === startingMenusStates.Menu)
            return 0
        ///
        if (gameStates.currentStartingMenusState === startingMenusStates.Selected) {
            if (gameStates.currentShopMode === ShopMode.ShopMenu && gameStates.currentGameMode === gameMode.Shop)
                return 1
            ///
            if (gameStates.currentGameMode === gameMode.Settings) {
                if (gameStates.currentSettingState === settingStates.Keybinds && !gameStates.keybindController.seletingKeybind)
                    return 2
                    ///
                if (gameStates.currentSettingState === settingStates.Selecting)
                    return 3
            }
            ///
            if (gameStates.currentGameMode === gameMode.StoryMode) {
                if (gameStates.currentStoryModeState === storyModeStates.Lost)
                    return 4
                    ///
                if (gameStates.currentStoryModeState === storyModeStates.WonStage)
                    return 5
                    ///
                if (gameStates.currentStoryModeState === storyModeStates.Paused) 
                    return 6
            } 
        }
    }   
}
