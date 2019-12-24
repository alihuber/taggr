const { dialog, ipcMain } = require('electron');
const fs = require('fs');
const ID3Writer = require('browser-id3-writer');

ipcMain.on('save-metadata', function(event, filePaths, metadata) {
  const dialogOpts = {
    type: 'info',
    buttons: ['Ok'],
    title: 'Success',
    detail: 'Files sucessfully saved',
  };
  const length = filePaths.length;
  let coverBuffer;
  filePaths.forEach((filepath, idx) => {
    const songBuffer = fs.readFileSync(filepath);
    const data = metadata[idx];
    if (data.cover.length !== 0) {
      coverBuffer = Buffer.from(data.cover, 'base64');
    }
    const title = data.title;
    const album = data.album;
    const artist = [data.artist];
    const albumArtist = data.albumArtist;
    const genre = [data.genre];
    const year = Number(data.year);
    const comment = data.comment;
    const numbering = data.numbering;
    const writer = new ID3Writer(songBuffer);
    // TIT2 (song title)
    // TALB (album title)
    // TPE1 (song artists) ARRAY
    // TPE2 (album artist)
    // TRCK (song number in album): '5' or '5/10'
    // TYER (album release year) NUMBER
    // TCON (song genres) ARRAY
    writer
      .setFrame('TIT2', title)
      .setFrame('TALB', album)
      .setFrame('TPE1', artist)
      .setFrame('TPE2', albumArtist)
      .setFrame('TRCK', numbering)
      .setFrame('TCON', genre)
      .setFrame('TYER', year)
      .setFrame('COMM', {
        description: 'Comment',
        text: comment,
      });
    if (coverBuffer) {
      writer.setFrame('APIC', {
        type: 3, // cover front
        data: coverBuffer,
        description: 'Cover',
      });
    }
    writer.addTag();

    const taggedSongBuffer = Buffer.from(writer.arrayBuffer);
    fs.writeFileSync(filepath, taggedSongBuffer);
    if (idx === length - 1) {
      dialog.showMessageBox(dialogOpts, () => {});
    }
  });
});
