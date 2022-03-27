"use strict";
export var GameState = {
    NotStarted: 0,
    Menu: 1,
    Rules: 2,
    Started: 3,
    Lost: 4,
    WonStage: 5,
    Paused: 6
}

export var GameMode = {
    StoryMode: 1,
    Freeplay: 2,
    Shop: 3,
    ItemsInfo: 4,
    Setting: 5
}

export var ShopMode = {
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

export var gameStates = {
    currentGameState: GameState.NotStarted,
    currentGameMode: GameMode.StoryMode,
    currentShopMode: ShopMode.ShopMenu,
    currentBackgroundStyle: BackgroundStyles.Sprite,
    currentPlayerStyle: PlayerStyles.BlueCube,
    currentCubeStyle: cubeStyle.BlueCube,
    currentLevelIndex: 0,
    mobile: false,
    CurrentLevel: function() {
      return gameStates.levelController.levels[gameStates.currentLevelIndex]
    },

    SetGameState: function(gameState) {
        gameStates.currentGameState = gameState
    }
}

export var levelTools = {
    currentLosses: 0,
    loseCounterStop: false,
    update: function(delta) {
        if  (gameStates.currentGameState === GameState.Started && gameStates.currentGameMode === GameMode.StoryMode || gameStates.currentGameState === GameState.Started && gameStates.currentGameMode === GameMode.Freeplay) {
            gameStates.CurrentLevel().enemies.forEach(function(enemy) {
                enemy.update(delta)
            })
            gameStates.CurrentLevel().players.forEach(function(player) {
                player.update(delta)
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
        if (gameStates.infoController.unlockedLevel !== gameStates.levelController.levels.length)
            gameStates.infoController.unlockedLevel++
        if (gameStates.currentLevelIndex === (gameStates.levelController.levels.length - 1)) {
            gameStates.currentLevelIndex = 0
            levelTools.Restart()
            gameStates.SetGameState(GameState.NotStarted)
        } else {
            gameStates.currentLevelIndex++
            levelTools.Restart()
            gameStates.SetGameState(GameState.Started)
        }

    },

    Restart: function() {
        gameStates.CurrentLevel().enemies.forEach(function(enemy) {
            enemy.reset() 
        })

        gameStates.CurrentLevel().players.forEach(function(player) {
            player.reset()
        })

        gameStates.CurrentLevel().unlocks.forEach(function(unlock) {
            unlock.activated = false    
        })

        gameStates.CurrentLevel().rocks.forEach(function(rock) {
            rock.allowMovement = false
        })

        gameStates.CurrentLevel().holes.forEach(function(hole) {
            hole.reset()
        })

        gameStates.CurrentLevel().items.forEach(function(item) {
            item.reset()
        })

        gameStates.CurrentLevel().changeDirectionSquares.forEach(function(changeDirectionSquare) {
            changeDirectionSquare.reset()
        })
    },

}

export var dataManagement = {
    Save: function(draw) {
        if (gameStates.currentGameMode === GameMode.StoryMode) 
            window.localStorage.setItem('level', gameStates.currentLevelIndex)
        if (gameStates.infoController.unlockedLevel !== gameStates.levelController.levels.length) 
            window.localStorage.setItem('isMax', true)    
        window.localStorage.setItem('newUpdate', false)    
        window.localStorage.setItem('stateGame', gameStates.currentGameState)
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
                gameStates.currentLevelIndex = level
                if (stateGame === GameState.WonStage) {
                    gameStates.currentLevelIndex++
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
        if (window.localStorage.getItem('isMax') === true)
            gameStates.infoController.unlockedLevel = gameStates.levelController.levels.length
        else
            gameStates.infoController.unlockedLevel = gameStates.currentLevelIndex 
    },
}
