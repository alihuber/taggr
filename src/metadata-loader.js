const fs = require('fs');
const last = require('lodash').last;
const ID3Parser = require('id3-parser');
const { v4: uuidv4 } = require('uuid');

const _loadMetadata = filePaths => {
  const metadata = [];
  filePaths.forEach((filepath, idx) => {
    const songBuffer = fs.readFileSync(filepath);
    const data = ID3Parser.parse(songBuffer);
    const fileName = last(filepath.split('/'));
    const comment = data.comments && data.comments[0] && data.comments[0].value;
    let cover = '';
    if (data.image && data.image.data) {
      const str = data.image.data.toString('base64');
      cover = str;
    }
    const obj = {
      _id: uuidv4(),
      idx,
      numbering: data.track,
      title: data.title,
      artist: data.band || data.artist,
      fileName,
      albumArtist: data.artist,
      album: data.album,
      genre: data.genre,
      year: data.year,
      comment,
      cover,
      selected: false,
    };
    metadata.push(obj);
  });

  return metadata;
};

module.exports = {
  _loadMetadata,
};
