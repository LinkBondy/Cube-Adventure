"use strict";
export var startingMenusStates = {
    //NewInfo: 1,
    NotStarted: 1,
    Menu: 2,
    Selected: 3
}

export var gameMode = {
    StoryMode: 1,
    Shop: 2,
    ItemsInfo: 3,
    Setting: 4
}

export var storyModeStates = {
    Selecting: 1,
    Playing: 2,
    Lost: 3,
    WonStage: 4,
    Paused: 5
}

export var ShopMode/*shopStates*/ = {
    ShopMenu: 1,
    Backround: 2,
    Player: 3
}

export var PlayerStyles = {
    BlueCube: 1,
    BlueCubeAlien: 2,
    BlueCubeLava: 3,
    BlueCubeWooden: 4,
    BlueCubeSad: 5,
}

export var BackgroundStyles = {
    Sprite: 1,
    Plastic: 2
}

export var cubeStyle = {
    BlueCube: 0,
    Alien: 1,
    Lava: 2,
    Wooden: 3,
    Sad: 4,
}

var settingStates = {
    Selecting: 1,
    Keybinds: 2,
    Brightness: 3,
    Sound: 4
}
 
export var gameStates = {
    currentStartingMenusState: startingMenusStates.NotStarted,
    currentStoryModeState: storyModeStates.Selecting,
    currentSettingState: settingStates.Selecting,
    currentGameMode: gameMode.StoryMode,
    currentShopMode: ShopMode.ShopMenu,
    currentBackgroundStyle: BackgroundStyles.Sprite,
    currentPlayerStyle: PlayerStyles.BlueCube,
    currentCubeStyle: cubeStyle.BlueCube,
    currentLevelIndex: 0,
    mobile: false,
    CurrentLevel: function() {
      return gameStates.levelController.levels[gameStates.currentLevelIndex]
    },

    SetGameState: function(gameState, type) {
        if (type === "Starting")
        gameStates.currentStartingMenusState = gameState
        if (type === "StoryMode")
        gameStates.currentStoryModeState = gameState
    }
}

export var levelTools = {
    currentLosses: 0,
    loseCounterStop: false,
    update: function(delta) {
        if  (gameStates.currentStoryModeState === storyModeStates.Playing && gameStates.currentGameMode === gameMode.StoryMode) {
            gameStates.CurrentLevel().enemies.forEach(function(enemy) {
                enemy.update(delta)
            })
            gameStates.CurrentLevel().players.forEach(function(player) {
                player.update(delta)
                player.changeSlideVariables()
            })
            gameStates.CurrentLevel().unlocks.forEach(function(unlock) {
                unlock.update(delta)
            })
            gameStates.CurrentLevel().holes.forEach(function(hole) {
                hole.update(delta)
            })
            gameStates.CurrentLevel().items.forEach(function(item) {
                item.update(delta)
            })
            gameStates.CurrentLevel().teleporters.forEach(function(teleporter) {
                teleporter.update(delta)
            })
        }
    },

    checkWin: function() {
        var win = false
        gameStates.CurrentLevel().players.forEach(function(player) {
            gameStates.CurrentLevel().finishAreas.forEach(function(finishArea) {
                if (finishArea.intersects(player)) {  
                    win = true
                } 
            })
        })
        return win 
    },

    checkLose: function() {
        var lose = false
        gameStates.CurrentLevel().players.forEach(function(player) {
            gameStates.CurrentLevel().enemies.forEach(function(enemy) {
                if (player.intersects(enemy)) {
                    lose = true
                }
            })
            gameStates.CurrentLevel().holes.forEach(function(hole) {
                if (player.intersectsAll(hole) && hole.fullHole) {
                    lose = true
                }
            })
        })
            
        return lose
    },

    NextLevel: function() {
        levelTools.Restart()
        if (gameStates.infoController.unlockedLevel === gameStates.currentLevelIndex)
            gameStates.infoController.unlockedLevel++     
    },

    Restart: function() {
        gameStates.CurrentLevel().finishAreas.forEach(function(finishArea) {
            finishArea.reset()
        },)

        gameStates.CurrentLevel().enemies.forEach(function(enemy) {
            enemy.reset()
        },)

        gameStates.CurrentLevel().players.forEach(function(player) {
            player.reset()        
        },)

        gameStates.CurrentLevel().waters.forEach(function(water) {
            water.reset()
        },)

        gameStates.CurrentLevel().holes.forEach(function(hole) {  
            hole.reset()
        },)

        gameStates.CurrentLevel().unlocks.forEach(function(unlock) {
            unlock.reset()
        },)

        gameStates.CurrentLevel().teleporters.forEach(function(teleporter) {
            teleporter.reset()
        })

        gameStates.CurrentLevel().items.forEach(function(item) {
            item.reset()
        })

        gameStates.CurrentLevel().rocks.forEach(function(rock) {  
            rock.reset()
        },)

        gameStates.CurrentLevel().changeDirectionSquares.forEach(function(changeDirectionSquare) {
            changeDirectionSquare.reset()
        },)
        
        gameStates.CurrentLevel().walls.forEach(function(wall) {
            wall.reset()
        },)
        gameStates.CurrentLevel().currentX = gameStates.CurrentLevel().startingX
        gameStates.CurrentLevel().currentY = gameStates.CurrentLevel().startingY
    },

}

export var dataManagement = {
    Save: function(draw) {
        window.localStorage.setItem('level', gameStates.infoController.unlockedLevel)
        window.localStorage.setItem('newUpdate', false)
        if (gameStates.infoController.unlockedLevel !== gameStates.levelController.levels.length && gameStates.infoController.unlockedLevel === gameStates.currentLevelIndex - 1) {
            window.localStorage.setItem('stateGame', gameStates.currentStoryModeState)
        } else
            window.localStorage.setItem('stateGame', -1)
        window.localStorage.setItem('PlayerAlienLock', draw.blueCubeAlienLock)
        window.localStorage.setItem('PlayerWoodenLock', draw.blueCubeWoodenLock)
        window.localStorage.setItem('PlayerSadLock', draw.blueCubeSadLock)
        window.localStorage.setItem('StyleCube', gameStates.currentCubeStyle)
        window.localStorage.setItem('styleSprite', draw.spriteStyle)
        window.localStorage.setItem('stylePlastic', draw.plasticStyle)
    },

    Load: function(draw) {
        var newUpdate = window.localStorage.getItem('newUpdate')    
        if (newUpdate !== null) {
            var level = Number(window.localStorage.getItem('level'))
            var stateGame = Number(window.localStorage.getItem('stateGame'))
            if (level !== null) {
                gameStates.infoController.unlockedLevel = level
                if (stateGame == storyModeStates.WonStage) {
                    gameStates.infoController.unlockedLevel++
                }
            }
        }
       
        var WoodenLock = window.localStorage.getItem('PlayerWoodenLock')
        if (WoodenLock !== null) {
            if (WoodenLock === 'true')
                WoodenLock = true

            if (WoodenLock === 'false')
                WoodenLock = false

            draw.blueCubeWoodenLock = WoodenLock
        }

        var SadLock = window.localStorage.getItem('PlayerSadLock')
        if (SadLock !== null) {
            if (SadLock === 'true') 
                SadLock = true
            
            if (SadLock === 'false')
                SadLock = false
            
            draw.blueCubeSadLock = SadLock
        }

        var AlienLock = window.localStorage.getItem('PlayerAlienLock')
        if (AlienLock !== null) {
            if (AlienLock === 'true') 
                AlienLock = true
            
            if (AlienLock === 'false')
                AlienLock = false
            
            draw.blueCubeAlienLock = AlienLock
        }

        var styleSprite = window.localStorage.getItem('styleSprite')
        if (styleSprite !== null) {
            if (styleSprite === 'true')
                styleSprite = true

            if (styleSprite === 'false') 
                styleSprite = false

            draw.spriteStyle = styleSprite
        }

        var stylePlastic = window.localStorage.getItem('stylePlastic')
        if (stylePlastic !== null) {
            if (stylePlastic === 'true')
                stylePlastic = true

            if (stylePlastic === 'false')
                stylePlastic = false

            draw.plasticStyle = stylePlastic
        }

        var StyleCube = Number(window.localStorage.getItem('StyleCube'))
        if (StyleCube !== null) {
            gameStates.currentCubeStyle = StyleCube
        }
    },
}
