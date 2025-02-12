class Position {
  Latitude;
  Longtitude;
}
class Map {
  #image
  #canvas
  constructor(canvasObj, imageUrl, topLeft, bottomRight) {
    image = new Image();
    canvas = canvasObj;
    imageSrc = imageUrl;
  }

  set imageSrc(imageurl) {
    image.src = imageurl;
    image.onload = function() {
      canvas.height = image.height;
      canvas.width = image.width;
      
    }
    canvas.height
  }
  set background(img) {
    this.context.drawImage(img, 0, 0, canvas.width, canvas.height);
  }

  get context() {
    return canvas.getContext('2d');
  }

  function #SetPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    // Draw a dot on the canvas, 
    const dotY = (56.045857616798834-latitude)*1200000; // X coordinate of the dot
    const dotX = (longitude-8.115638562938113)*1200000; // Y coordinate of the dot
    document.getElementById("debug").innerHTML = dotX + " - " + dotY + " radius: " + position.coords.accuracy;
    console.log(dotX,dotY);
    const dotRadius = position.coords.accuracy; // Radius of the dot
    ctx.clearRect(0, 0, canvas.width, canvas.height);    
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(dotX, dotY, dotRadius, 0, Math.PI * 2, true);
    ctx.fillStyle = 'blue'; // Color of the dot
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(dotX, dotY, 5, 0, Math.PI * 2, true);
    ctx.fillStyle = 'red'; // Color of the dot
    ctx.fill();
    ctx.closePath();
  }
  
  function Run() {
    const watchId = navigator.geolocation.watchPosition(function (position) {
                        showPosition(position, ctx)
                    }, showError, {
                        enableHighAccuracy: true,
                        maximumAge: 0,
                        timeout: 500000
                    });
  }
}
