const isVideo = (filename) => {
  var ext = getExtension(filename);
  switch (ext.toLowerCase()) {
    case "m4v":
    case "avi":
    case "mpg":
    case "mp4":
    case "3gp":
    case "flv":
      return true;
  }
  return false;
}

const isRaw = (filename) => {
    var ext = getExtension(filename);
    switch (ext.toLowerCase()) {
      case "txt":
      case "doc":
      case "docx":
      case "xls":
        return true;
    }
    return false;
  }

function getExtension(filename) {
  var parts = filename.split(".");
  return parts[parts.length - 1];
}

module.exports = {
    isVideo,
    isRaw
};