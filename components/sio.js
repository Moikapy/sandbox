const fs = require('fs');
const deleteStorage = filePath => {
  fs.access(filePath, error => {
    if (!error) {
      fs.unlink(filePath, () => {});
    } else {
      console.log('errorz:', error);
    }
  });
};
module.exports = (io, siofu) => {
  // Actions while user is connected
  io.on('connection', socket => {
    console.log('connected');
    //Listens to File Upload
    const uploader = new siofu();
    uploader.dir = './storage';
    uploader.listen(socket);

    // Saving File
    uploader.on('saved', event => {
      const success = event.file.success;
      const title = event.file.base;
      const path = event.file.pathName;
      const fileName = event.file.name;
      const filePath = path;
      if (success) {
        console.log({ title, path, fileName, filePath });
        deleteStorage(filePath);
      } else {
        console.log('error');
      }
    });
    //When User Disconnects from Page
    socket.on('disconnect', () => {
      console.log('disconnected');
    });
  });
};
