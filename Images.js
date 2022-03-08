"use strict";

export var images = {
    stillLoading: 0,
    blueCubeWoodenLock: true,
    blueCubeSadLock: true,
    blueCubeAlienLock: true,

    DrawImage: function(image, x, y) {
        const {
            game,
        } = require('./Cube Adventure')
    
        game.context.drawImage(image, 0, 0, image.width, image.height, x, y, image.width, image.height)
    },
}