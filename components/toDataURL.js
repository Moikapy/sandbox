export default async (src, callback) => {
  try {
    var image = new Image();
    image.crossOrigin = 'Anonymous';
    image.onload = function() {
      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      canvas.height = this.naturalHeight;
      canvas.width = this.naturalWidth;
      context.drawImage(this, 0, 0);
      var dataURL = canvas.toDataURL('image/jpeg');
      callback(dataURL);
    };
    image.src = src;
    return dataURL;
  } catch (e) {
    console.debug(e);
  }
};
