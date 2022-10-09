'use strict'
const { KeybindController } = require('../events/Keybinds')
const { ArrayChartController } = require('../menuModes/ArrayChart')
const { MenuController } = require('../menuModes/Menu')
const { LevelController } = require('../levels/Levels')
const { Background } = require('../levels/Class')
const { InfoController } = require('../menuModes/ItemInfo')
const { images } = require('../drawing/Images')
const { draw } = require('../drawing/Draw')
const { update } = require('../data/Update')
const { gameStates, dataManagement } = require('../data/GameData')
const { canvas } = require('../drawing/Canvas')
const { Keydown, KeyUp } = require('../events/Keydown')
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
  isRunning: true,
  lastTime: new Date().getTime(),
  ///
  mainLoop: function () {
    // const timePassed = new Date().getTime() - game.lastTime
    game.lastTime = new Date().getTime()
    let delta = 1
    if (!game.isRunning) { delta = 0 }
    dataManagement.Save(draw)
    update.UpdateGame(delta)
    draw.DrawGame()
    // window.setTimeout(game.mainLoop, 1000 / 120)
    window.requestAnimationFrame(game.mainLoop)
  }
}

function handleVisibilityChange () {
  if (document.visibilityState === 'hidden') {
    console.log('it is hidden')
    game.isRunning = false
  } else {
    console.log('it is showing')
    game.lastTime = new Date().getTime()
    game.isRunning = true
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
  gameStates.levelController = new LevelController()
  gameStates.background = new Background()
  gameStates.infoController = new InfoController()
  gameStates.menuController = new MenuController()
  gameStates.arrayChartController = new ArrayChartController()
  gameStates.keybindController = new KeybindController()
  gameStates.levelController.createLevels()
  dataManagement.Load()
  game.mainLoop()
  gameStates.loading = false
}

function LoadGame () {
  ///
  if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i)) { gameStates.mobile = true } else { gameStates.mobile = false }
  images.LoadImages()
  // audio.MusicW1.src = "musicName";
  ImageLoadingLoop()
}

document.addEventListener('visibilitychange', handleVisibilityChange, false)
document.addEventListener('DOMContentLoaded', LoadGame)
document.addEventListener('keydown', Keydown/* .bind(undefined, game) */)
document.addEventListener('keyup', KeyUp/* .bind(undefined, game) */)
document.addEventListener('mousedown', MouseDown/* .bind(undefined, game) */)
