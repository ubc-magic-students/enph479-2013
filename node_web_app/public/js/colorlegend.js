function ColorLegend() {
  // red is positive sentiment, blue is negative
  function getColor(sentiment, weather) { // sentiment 0 - 255, weather 0 -100
      var color_string = "rgb " + sentiment + " 00 " + new String(255-sentiment);
      rgbColor = tinycolor(color_string);
      hsvColor = rgbColor.toHsl();
      hsvColor.v = weather + 30;

      // lighter color is good weather, darker is bad
      return tinycolor(hsvColor).toRgb();
  }

  function setPixel(imageData, x, y, r, g, b, a) {
    index = (x + y * imageData.width) * 4;
    //imageData.data[index+0] = r;
    imageData.data[index+0] = r;
    imageData.data[index+1] = g;
    imageData.data[index+2] = b;
    imageData.data[index+3] = a;
  }

element = document.getElementById("color-legend");
c = element.getContext("2d");

// read the width and height of the canvas
width = element.width;
height = element.height;

// create a new pixel array
imageData = c.createImageData(width, height);

var sentiment;
var weather;
var color;
for (i =0; i < width; i++) {
  for (j = 0; j < height; j++) {
    sentiment = 255 - i / width * 255;
    weather = j / height * 70;
    color = getColor(sentiment, weather);
    setPixel(imageData, j, i, color.r, color.g, color.b, color.a*255);
  }
}

console.log(imageData);

// copy the image data back onto the canvas
  c.putImageData(imageData,0,0); // at coords 0,0
}