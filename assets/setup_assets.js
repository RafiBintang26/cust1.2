const fs = require('fs');
const path = require('path');

const dirs = [
  'assets',
  'assets/gift',
  'assets/scrapbook',
  'assets/photos',
  'assets/audio'
];

dirs.forEach(d => {
  const dirPath = path.join(__dirname, d);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log('Created directory:', dirPath);
  }
});

// Copy audio file
const audioSrc = path.join(__dirname, 'hindia.mp3');
const audioDest = path.join(__dirname, 'assets/audio/hindia.mp3');
if (fs.existsSync(audioSrc)) {
  fs.copyFileSync(audioSrc, audioDest);
  console.log('Copied audio file to assets/audio/hindia.mp3');
}

// Copy generated artifact images
const brainDir = `C:\\Users\\zahra\\.gemini\\antigravity-ide\\brain\\42814ed1-fe1e-4044-ba43-d966c05caba4`;

const fileMappings = [
  { src: 'gift_box_body_1791610859983.jpg', dest: 'assets/gift/box_body.jpg' },
  { src: 'gift_box_lid_1791610883580.jpg', dest: 'assets/gift/box_lid.jpg' },
  { src: 'photo_couple_1_1791610910084.jpg', dest: 'assets/photos/photo1.jpg' },
  { src: 'photo_couple_2_1791610932985.jpg', dest: 'assets/photos/photo2.jpg' },
  { src: 'photo_couple_3_1791610957767.jpg', dest: 'assets/photos/photo3.jpg' },
  { src: 'photo_couple_4_1791610984645.jpg', dest: 'assets/photos/photo4.jpg' },
  { src: 'sticker_flowers_1791611007495.jpg', dest: 'assets/scrapbook/flowers.jpg' }
];

fileMappings.forEach(item => {
  const srcPath = path.join(brainDir, item.src);
  const destPath = path.join(__dirname, item.dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${item.src} -> ${item.dest}`);
  } else {
    console.log(`Warning: File not found ${srcPath}`);
  }
});

console.log('Asset setup script finished successfully.');
