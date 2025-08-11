'use strict'
const { KeybindController } = require('../events/KeyBinds')
const { ArrayChartController } = require('../menus/ArrayChart')
const { MenuController } = require('../menus/Menu')
const { GameController } = require('../levels/Levels')
// const { Timer } = require('../levels/Timer')
const { Background } = require('../levels/levelItems/Class')
const { AdventureLogController } = require('../menus/AdventureLog')
const { WorldSelector, LevelSelector } = require('../levels/GameSelectors')
const { LossScreen, WinScreen, TitleScreen } = require('../drawing/GameScreens')
const { images } = require('../drawing/Images')
const { draw } = require('../drawing/Draw')
const { update } = require('../data/Update')
const { gameStates, dataManagement } = require('../data/GameData')
const { canvas } = require('../drawing/Canvas')
const { Keydown, KeyUp } = require('../events/KeyDown')
const { MouseDown } = require('../events/MouseDown')

/* const audio = {
  MusicW1: new Audio(),
  SetMusic: function () {
    if (gameStates.currentStoryModeState === storyModeStates.Playing)
            audio.MusicW1.play();
        else
            audio.MusicW1.pause();
  }
} */

export const game = {
  startTime: new Date(),
  lastTime: new Date().getTime(),
  ///
  mainLoop: function () {
    // const timePassed = new Date().getTime() - game.lastTime
    if (gameStates.isRunning) {
      game.lastTime = new Date().getTime()
      dataManagement.Save(false)
      update.UpdateGame()
      draw.MainDraw()
      // window.setTimeout(game.mainLoop, 1000 / 120)
    }
    window.requestAnimationFrame(game.mainLoop)
  }
}

function handleVisibilityChange () {
  if (document.visibilityState === 'hidden') {
    console.log('it is hidden')
    gameStates.isRunning = false
  } else {
    console.log('it is showing')
    game.lastTime = new Date().getTime()
    gameStates.isRunning = true
  }
}

function ImageLoadingLoop () {
  if (images.stillLoading > 0) {
    window.setTimeout(ImageLoadingLoop, 1000 / 60)
  } else {
    StartGame()
  }
}

function StartGame () {
  canvas.createCanvasContext()
  gameStates.loading = true
  gameStates.gameController = new GameController()
  gameStates.worldSelector = new WorldSelector()
  gameStates.levelSelector = new LevelSelector()
  // gameStates.levelTimer = new Timer()
  gameStates.background = new Background()
  gameStates.adventureLogController = new AdventureLogController()
  gameStates.menuController = new MenuController()
  gameStates.arrayChartController = new ArrayChartController()
  gameStates.arrayChartController.start()
  gameStates.keybindController = new KeybindController()
  gameStates.keybindController.setupKeybinds()
  gameStates.lossScreen = new LossScreen()
  gameStates.winScreen = new WinScreen()
  gameStates.titleScreen = new TitleScreen()
  gameStates.gameController.CreateLevels()
  gameStates.gameController.CreateWorlds()
  dataManagement.Load()
  gameStates.keybindController.start()
  game.mainLoop()
  gameStates.loading = false
}

function LoadGame () {
  if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/Windows Phone/i)) { gameStates.mobile = true } else { gameStates.mobile = false }
  images.LoadImages()
  // audio.MusicW1.src = "musicName";
  ImageLoadingLoop()
}

document.addEventListener('visibilitychange', handleVisibilityChange, false)
document.addEventListener('DOMContentLoaded', LoadGame)
document.addEventListener('keydown', Keydown/* .bind(undefined, game) */)
document.addEventListener('keyup', KeyUp/* .bind(undefined, game) */)
document.addEventListener('mousedown', MouseDown/* .bind(undefined, game) */)
