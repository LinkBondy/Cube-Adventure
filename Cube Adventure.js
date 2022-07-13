'use strict'
const { KeybindController } = require('./Keybinds')
const { ArrayChartController } = require('./SeletionArea')
const { MenuController } = require('./Menu')
const { LevelController } = require('./Levels')
const { Background } = require('./Class')
const { InfoController } = require('./ItemInfo')
const { images } = require('./Images')
const { draw } = require('./Draw')
const { gameStates, levelTools, dataManagement } = require('./GameData')
const { canvas } = require('./Canvas')
const { Keydown, KeyUp } = require('./Keydown')
const { MouseDown } = require('./MouseDown')
const audio = {
  // MusicW1: new Audio(),

  SetMusic: function () {
    /* if (gameStates.currentStoryModeState === storyModeStates.Playing)
            audio.MusicW1.play();
        else
            audio.MusicW1.pause();
            */
  }
}

export var game = {
  startTime: new Date(),
  isRunning: true,
  lastTime: new Date().getTime(),
  ///
  mainLoop: function () {
    const timePassed = new Date().getTime() - game.lastTime
    game.lastTime = new Date().getTime()
    /* if (!game.isRunning)
            timePassed = 0
        console.log('timePassed is: ', timePassed)
        var delta = timePassed/20
        console.log(delta)
        if (delta > 1)
        delta = 1 */
    const delta = 1
    dataManagement.Save(draw)
    levelTools.UpdateGame(delta)
    draw.DrawGame()
    window.setTimeout(game.mainLoop, 1000 / 120)
    // window.requestAnimationFrame(game.mainLoop)
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
  gameStates.levelController = new LevelController()
  gameStates.background = new Background()
  gameStates.infoController = new InfoController()
  gameStates.menuController = new MenuController()
  gameStates.arrayChartController = new ArrayChartController()
  gameStates.keybindController = new KeybindController()
  gameStates.levelController.createLevels()
  dataManagement.Load(draw)
  game.mainLoop()
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
