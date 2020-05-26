const fs = require('fs');

const deleteFile = (file) => {
  if (file) {
    fs.unlink(file.path, (error) => {
      console.log(error);
    });
  }
};

module.exports = deleteFile;