class Position {
  Latitude!: number;
  Longtitude!: number;
}

class GeoMap {
  private image : HTMLImageElement;
  private canvas: HTMLCanvasElement;
  private top: Position;
  private bottom: Position;

  onError = (error: GeolocationPositionError) => {};

  constructor(canvasObj: HTMLCanvasElement, imageUrl: string, topLeft: Position, bottomRight: Position) {
    this.top = topLeft;
    this.bottom = bottomRight;
    this.image = new Image();
    this.canvas = canvasObj;
    this.imageSrc = imageUrl;
  }

  set imageSrc(imageurl: string) {
    this.image.src = imageurl;
    this.image.onload = (event) => {
      this.canvas.height = this.image.height;
      this.canvas.width = this.image.width;
      this.background = this.image;
    }
  }
  
  set background(img: HTMLImageElement) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
  }

  get context() {
    return this.canvas.getContext('2d')!;
  }

  private ratioWidth() {
    return this.canvas.width/(this.bottom.Longtitude - this.top.Longtitude);
  }
  private ratioHeight() {
    return this.canvas.height/(this.top.Latitude - this.bottom.Latitude);
  }

  private offsetX(longitude: number) {
    return (longitude - this.top.Longtitude) * this.ratioWidth();
  }

  private offsetY(latitude: number) {
    return (this.top.Latitude - latitude) * this.ratioHeight();
  }

  private SetPosition(position: GeolocationPosition) {

    this.background = this.image;

    this.drawLocation(this.offsetX(position.coords.longitude),this.offsetY(position.coords.latitude),position.coords.accuracy);
  }

  private drawLocation(x: number, y: number, accuracy: number) {
    this.context.beginPath();
    this.context.arc(x, y, (accuracy*0.00001)*((this.ratioHeight()+this.ratioWidth())/2), 0, Math.PI * 2, true);
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
    const watchId = navigator.geolocation.watchPosition((position) => this.SetPosition(position),  (error) => {
      
      this.onError(error);
    }, {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 500000
    });
  }
}
