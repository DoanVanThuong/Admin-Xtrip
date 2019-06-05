import {CAPP} from "../../app.constants";
declare var unescape: any;
declare var window: any;

export class ImageHelper {
  /**
   * Conserve aspect ratio of the orignal region. Useful when shrinking/enlarging
   * images to fit intro a certain area.
   *
   * @param {Number} srcWidth Source area width
   * @param {Number} srcHeight Source area height
   * @param {Number} maxWidth Fittable area maximum available width
   * @param {Number} maxHeight Fittable area maximum available height
   * @return {Object} { width, height }
   *
   */
  calcAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
    let ratioArr = [maxWidth / srcWidth, maxHeight / srcHeight];
    let ratio = Math.min(ratioArr[0], ratioArr[1]);
    if(srcWidth < maxWidth && srcHeight < maxHeight) {
      ratio = 1;
    }

    return {width: srcWidth * ratio, height: srcHeight * ratio};
  }

  /**
   * The "callback" argument is called with either true or false
   * depending on whether the image at "url" exists or not.
   *
   * @param url
   * @param callback
   */
  checkExists(url, callback) {
    let img = new Image();
    img.onload = function () {
      callback(true);
    };
    img.onerror = function () {
      callback(false);
    };
    img.src = url;
  }

  /**
   * Get Image From Url
   *
   * @param url
   * @param callback
   */
  getFormUrl(url, callback) {
    let img: HTMLImageElement = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    img.onload = function (a) {
      let canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      let ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      let dataURI = canvas.toDataURL("image/jpg");

      // convert base64/URLEncoded data component to raw binary data held in a string
      let byteString;
      if (dataURI.split(',')[0].indexOf('base64') >= 0) {
        byteString = atob(dataURI.split(',')[1]);
      } else {
        byteString = unescape(dataURI.split(',')[1]);
      }

      // separate out the mime component
      let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

      // write the bytes of the string to a typed array
      let ia = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      return callback(new Blob([ia], {type: mimeString}));
    };

    img.src = url;
  }

  dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    let byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(dataURI.split(',')[1]);
    } else {
      byteString = unescape(dataURI.split(',')[1]);
    }

    // separate out the mime component
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    let ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type: mimeString});
  }

  /**
   * Resize Image
   *
   * @param file
   * @param callback
   */
  resize(file, callback) {
    let self = this;
    if (['image/png', 'image/jpeg', 'image/gif'].indexOf(file.type) > -1 && window.File && window.FileReader && window.FileList && window.Blob) {
      let fileType = file.type;
      let fileName = file.name;
      let reader = new FileReader();
      reader.onloadend = function () {
        let img: any = new Image();
        img.src = reader.result;
        img.onload = function () {
          let dimension = self.calcAspectRatioFit(img.width, img.height, CAPP.IMAGE_MAX_SIZE, CAPP.IMAGE_MAX_SIZE);
          let canvas = document.createElement('canvas');
          canvas.width = dimension.width;
          canvas.height = dimension.height;
          let ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, dimension.width, dimension.height);
          let dataURL = canvas.toDataURL(fileType);
          let file = self.dataURItoBlob(dataURL);
          file['name'] = fileName;
          callback(file);
        };
      };
      reader.readAsDataURL(file);
    } else {
      callback(file);
    }
  }
}
