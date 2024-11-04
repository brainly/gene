function getFileName(path) {
  return path.replace(/.+\/(.+\.tsx?)$/, '$1');
}

module.exports = {getFileName};
