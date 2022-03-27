"use strict";
class Canvas {
    constructor() {
    }
    createCanvasContext() {
        var canvas = document.getElementById("mycanvas");
        this.context = canvas.getContext("2d")
        this.width = canvas.width
        this.height = canvas.height
    }
}

export const canvas = new Canvas()