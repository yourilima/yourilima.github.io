"use strict";
class Position {
    Latitude;
    Longtitude;
}
class GeoMap {
    image;
    canvas;
    top;
    bottom;
    onError = (error) => { };
    constructor(canvasObj, imageUrl, topLeft, bottomRight) {
        this.top = topLeft;
        this.bottom = bottomRight;
        this.image = new Image();
        this.canvas = canvasObj;
        this.imageSrc = imageUrl;
    }
    set imageSrc(imageurl) {
        this.image.src = imageurl;
        this.image.onload = (event) => {
            this.canvas.height = this.image.height;
            this.canvas.width = this.image.width;
            this.background = this.image;
        };
    }
    set background(img) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
    }
    get context() {
        return this.canvas.getContext('2d');
    }
    ratioWidth() {
        return this.canvas.width / (this.bottom.Longtitude - this.top.Longtitude);
    }
    ratioHeight() {
        return this.canvas.height / (this.top.Latitude - this.bottom.Latitude);
    }
    offsetX(longitude) {
        return (longitude - this.top.Longtitude) * this.ratioWidth();
    }
    offsetY(latitude) {
        return (this.top.Latitude - latitude) * this.ratioHeight();
    }
    SetPosition(position) {
        this.background = this.image;
        this.drawLocation(this.offsetX(position.coords.longitude), this.offsetY(position.coords.latitude), position.coords.accuracy);
    }
    drawLocation(x, y, accuracy) {
        this.context.beginPath();
        this.context.arc(x, y, (accuracy * 0.00001) * ((this.ratioHeight() + this.ratioWidth()) / 2), 0, Math.PI * 2, true);
        this.context.fillStyle = "rgb(99 173 248 / 50%)"; // Color of the dot
        this.context.fill();
        this.context.closePath();
        this.context.beginPath();
        this.context.arc(x, y, 5, 0, Math.PI * 2, true);
        this.context.fillStyle = 'rgb(255 0 0)'; // Color of the dot
        this.context.fill();
        this.context.closePath();
    }
    Run() {
        const watchId = navigator.geolocation.watchPosition((position) => this.SetPosition(position), (error) => {
            this.onError(error);
        }, {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 500000
        });
    }
}
//# sourceMappingURL=map.js.map