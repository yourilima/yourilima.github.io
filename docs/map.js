class Position {
  Latitude;
  Longtitude;
}
class GeoMap {
  #image
  #canvas
  #top
  #bottom

  /**
   * 
   * @param {HTMLCanvasElement} canvasObj 
   * @param {string} imageUrl 
   * @param {Position} topLeft 
   * @param {Position} bottomRight 
   */
  constructor(canvasObj, imageUrl, topLeft, bottomRight) {
    this.#top = topLeft;
    this.#bottom = bottomRight;
    this.#image = new Image();
    this.#canvas = canvasObj;
    this.imageSrc = imageUrl;
  }

  /**
   * @param {string} imageurl
   */
  set imageSrc(imageurl) {
    this.#image.src = imageurl;
    this.#image.onload = (event) => {
      this.#canvas.height = event.target.height;
      this.#canvas.width = event.target.width;
      this.background = this.#image;
    }
  }
  /**
   * @param {HTMLImageElement} img
   */
  set background(img) {
    this.context.drawImage(img, 0, 0, this.#canvas.width, this.#canvas.height);
  }

  get context() {
    return this.#canvas.getContext('2d');
  }

  #ratioWidth() {
    return this.#canvas.width/(this.#bottom.Longtitude - this.#top.Longtitude);
  }
  #ratioHeight() {
    return this.#canvas.height/(this.#top.Latitude - this.#bottom.Latitude);
  }

  /**
   * 
   * @param {number} longitude 
   * @returns 
   */
  #offsetX(longitude) {
    return (longitude - this.#top.Longtitude) * this.#ratioWidth();
  }

  /**
   * 
   * @param {number} latitude 
   * @returns 
   */
  #offsetY(latitude) {
    return (this.#top.Latitude - latitude) * this.#ratioHeight();
  }

  /**
   * 
   * @param {GeolocationPosition} position 
   */
  #SetPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    // Draw a dot on the canvas, 
    const dotY = this.#offsetY(latitude);
    const dotX = this.#offsetX(longitude); // Y coordinate of the dot
    document.getElementById("debug").innerHTML = dotX + " - " + dotY + " radius: " + position.coords.accuracy;
    console.log(dotX, dotY);
    var ctx = this.context;
    const dotRadius = position.coords.accuracy; // Radius of the dot
    ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
    ctx.drawImage(this.#image, 0, 0, this.#canvas.width, this.#canvas.height);
    this.#drawLocation(dotX,dotY,dotRadius);
  }

  #drawLocation(x, y, accuracy) {
    this.context.beginPath();
    this.context.arc(x, y, (accuracy*0.00001)*((this.#ratioHeight()+this.#ratioWidth())/2), 0, Math.PI * 2, true);
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
    const watchId = navigator.geolocation.watchPosition((position) => this.#SetPosition(position), function (error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          alert("User denied the request for Geolocation.");
          break;
        case error.POSITION_UNAVAILABLE:
          alert("Location information is unavailable.");
          break;
        case error.TIMEOUT:
          alert("The request to get user location timed out.");
          break;
        case error.UNKNOWN_ERROR:
          alert("An unknown error occurred.");
          break;
      }
      console.log(error);
    }, {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 500000
    });
  }
}
