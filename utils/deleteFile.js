const fs = require('fs');

const deleteFile = (file) => {
    console.log("delete file")
  if (file) {
    fs.unlink(file.path, (error) => {
      console.log(error);
    });
  }
};

module.exports = deleteFile;