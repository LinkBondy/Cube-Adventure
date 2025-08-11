'use strict'
const { canvas } = require('../drawing/Canvas')
const { gameStates, storyModeStates } = require('../data/GameData')

export class Timer {
  constructor (timeLimit, image, type) {
    this.time = timeLimit
    this.timeLimit = timeLimit
    this.clockFrame = 0
    this.timeWaited = 0
    this.active = false
    this.image = image
    this.type = type
  }

  draw () {
    canvas.context.font = '75px Arial'
    canvas.context.fillStyle = 'black'
    if (gameStates.CurrentLevel().checkLocked()) {
      canvas.context.fillText(this.time, 965, 110)
    } else {
      canvas.context.fillText('???', 965, 105)
    }
    this.FindClockFrame()
    // this.DrawImage(images.Clock, 860, 10)
    canvas.context.drawImage(this.image, this.clockFrame, 0, 96, 116, 860, 15, 48 * 2, 58 * 2)
  }

  FindClockFrame () {
    if (gameStates.currentStoryModeState === storyModeStates.Playing) {
      if (this.clockFrame === 96 * 63 && this.timeWaited === 48) {
        this.clockFrame = 0
        this.timeWaited = 0
      } else if (this.timeWaited === 48) {
        this.clockFrame += 96
        this.timeWaited = 0
      } else {
        this.timeWaited += 6
      }
    }
  }

  start () {
    const self = this

    // Set the timer to active
    this.active = true

    // Set the start date to the current date
    this.startDate = new Date()

    // Set the current timeout to the current timeout
    this.currentTimeout = window.setInterval(function () { self.update() }, 1000 * gameStates.delta)
  }

  pause () {
    const self = this

    // Set the paused date to the current date
    this.pausedDate = new Date()

    // Stop the current Timout/Interval
    window.clearInterval(self.currentTimeout)
  }

  resume () {
    const self = this

    // Stop the current Timout/Interval
    window.clearTimeout(this.currentTimeout)

    // Calculate the remaining time
    const remainingTime = 1000 - (self.pausedDate - self.startDate)

    // Set a new timeout with the remaining time to resume the update
    this.currentTimeout = window.setTimeout(function () { self.resumeUpdate() }, remainingTime * gameStates.delta)

    // Set the start date back to the date when the timer would have updated if not paused
    this.startDate = new Date() - (1000 - remainingTime)
  }

  resumeUpdate () {
    const self = this

    // Stop the current Timout/Interval
    window.clearTimeout(this.currentTimeout)

    // Set the start date to the current date
    this.startDate = new Date()

    // Set a new interval to resume the update
    this.currentTimeout = window.setInterval(function () { self.update() }, 1000 * gameStates.delta)

    // Decrease the time
    this.time -= 1
  }

  update () {
    this.startDate = new Date()
    this.time -= 1
  }

  reset () {
    this.active = false
    this.clockFrame = 0
    this.timeWaited = 0
    this.time = this.timeLimit
    window.clearInterval(this.currentTimeout)
  }
}
