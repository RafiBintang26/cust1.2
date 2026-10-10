const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

// Helper to remove black background and make transparent PNG
async function removeBlackBackground(inputPath, outputPath, tolerance = 30) {
  if (!fs.existsSync(inputPath)) {
    console.log(`Skipping missing file: ${inputPath}`);
    return;
  }
  const img = await loadImage(inputPath);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  const imgData = ctx.getImageData(0, 0, img.width, img.height);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Check if pixel is dark/black background
    const maxVal = Math.max(r, g, b);
    if (maxVal < tolerance) {
      data[i + 3] = 0; // Fully transparent
    } else if (maxVal < tolerance + 25) {
      // Soft feathering edge for smooth outline
      const alpha = (maxVal - tolerance) / 25;
      data[i + 3] = Math.round(alpha * 255);
    }
  }

  ctx.putImageData(imgData, 0, 0);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  console.log(`Saved transparent PNG to ${outputPath}`);
}

// Helper to generate Polaroid Frame transparent PNG
function createPolaroidFrame(outputPath, width = 600, height = 720) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Outer paper frame with rounded corners and paper texture
  const margin = 20;
  const photoW = width - margin * 2;
  const photoH = width - margin * 2; // Square photo window

  // Draw shadow glow
  ctx.shadowColor = 'rgba(0,0,0,0.18)';
  ctx.shadowBlur = 15;
  ctx.shadowOffsetY = 8;

  // Draw white polaroid body
  ctx.fillStyle = '#FAF8F5';
  ctx.beginPath();
  ctx.roundRect(0, 0, width, height, 12);
  ctx.fill();

  // Reset shadow for inner cutout
  ctx.shadowColor = 'transparent';

  // Inner frame texture & subtle border line
  ctx.strokeStyle = '#EBE7E0';
  ctx.lineWidth = 2;
  ctx.strokeRect(margin - 1, margin - 1, photoW + 2, photoH + 2);

  // CUTOUT PHOTO WINDOW (Make inner area fully transparent)
  ctx.clearRect(margin, margin, photoW, photoH);

  // Bottom paper text line hint (cute handwritten aesthetic)
  ctx.fillStyle = '#6B5E55';
  ctx.font = '22px cursive';
  ctx.textAlign = 'center';

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  console.log(`Created Polaroid Frame PNG: ${outputPath}`);
}

// Helper to generate Torn Paper PNG
function createTornPaper(outputPath, width = 500, height = 300, color = '#F4EAD3') {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = color;
  ctx.beginPath();

  // Create irregular deckle torn edges
  ctx.moveTo(20, 20);
  
  // Top torn edge
  for (let x = 20; x <= width - 20; x += 15) {
    const jitterY = (Math.random() - 0.5) * 8;
    ctx.lineTo(x, 20 + jitterY);
  }

  // Right torn edge
  for (let y = 20; y <= height - 20; y += 15) {
    const jitterX = (Math.random() - 0.5) * 8;
    ctx.lineTo(width - 20 + jitterX, y);
  }

  // Bottom torn edge
  for (let x = width - 20; x >= 20; x -= 15) {
    const jitterY = (Math.random() - 0.5) * 8;
    ctx.lineTo(x, height - 20 + jitterY);
  }

  // Left torn edge
  for (let y = height - 20; y >= 20; y -= 15) {
    const jitterX = (Math.random() - 0.5) * 8;
    ctx.lineTo(20 + jitterX, y);
  }

  ctx.closePath();
  ctx.shadowColor = 'rgba(0,0,0,0.15)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 5;
  ctx.fill();

  // Add subtle grid lines on paper
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = 'rgba(180, 160, 140, 0.2)';
  ctx.lineWidth = 1;
  for (let x = 40; x < width - 20; x += 25) {
    ctx.beginPath();
    ctx.moveTo(x, 25);
    ctx.lineTo(x, height - 25);
    ctx.stroke();
  }
  for (let y = 40; y < height - 20; y += 25) {
    ctx.beginPath();
    ctx.moveTo(25, y);
    ctx.lineTo(width - 25, y);
    ctx.stroke();
  }

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  console.log(`Created Torn Paper PNG: ${outputPath}`);
}

// Helper to generate Washi Tape transparent PNG
function createWashiTape(outputPath, width = 240, height = 50, color = 'rgba(235, 175, 185, 0.75)') {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = color;
  ctx.beginPath();
  
  // Left zig-zag cut edge
  ctx.moveTo(0, 0);
  for (let y = 0; y <= height; y += 6) {
    ctx.lineTo((y / 6) % 2 === 0 ? 5 : 0, y);
  }

  // Bottom straight edge
  ctx.lineTo(width - 5, height);

  // Right zig-zag cut edge
  for (let y = height; y >= 0; y -= 6) {
    ctx.lineTo(width - ((y / 6) % 2 === 0 ? 0 : 5), y);
  }

  // Top straight edge
  ctx.lineTo(0, 0);
  ctx.closePath();
  ctx.fill();

  // Washi tape diagonal stripe pattern
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 3;
  for (let x = -height; x < width + height; x += 15) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + height, height);
    ctx.stroke();
  }

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  console.log(`Created Washi Tape PNG: ${outputPath}`);
}

// Helper to generate Heart Sticker PNG
function createHeartSticker(outputPath, size = 150) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  ctx.shadowColor = 'rgba(0,0,0,0.2)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 4;

  // White border background
  ctx.fillStyle = '#FFFFFF';
  drawHeart(ctx, size / 2, size / 2, size * 0.45);
  ctx.fill();

  ctx.shadowColor = 'transparent';

  // Inner glossy pink heart
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, '#FF758C');
  grad.addColorStop(1, '#FF7EB3');
  ctx.fillStyle = grad;
  drawHeart(ctx, size / 2, size / 2, size * 0.38);
  ctx.fill();

  // Gloss highlight
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.beginPath();
  ctx.arc(size * 0.38, size * 0.35, size * 0.1, 0, Math.PI * 2);
  ctx.fill();

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  console.log(`Created Heart Sticker PNG: ${outputPath}`);
}

function drawHeart(ctx, cx, cy, r) {
  ctx.beginPath();
  ctx.moveTo(cx, cy + r * 0.7);
  ctx.bezierCurveTo(cx - r * 1.2, cy - r * 0.2, cx - r * 0.7, cy - r * 1.1, cx, cy - r * 0.4);
  ctx.bezierCurveTo(cx + r * 0.7, cy - r * 1.1, cx + r * 1.2, cy - r * 0.2, cx, cy + r * 0.7);
  ctx.closePath();
}

// Helper to generate Star Sticker PNG
function createStarSticker(outputPath, size = 120) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  ctx.shadowColor = 'rgba(0,0,0,0.2)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 4;

  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  const points = 5;
  const outerR = size * 0.45;
  const innerR = size * 0.2;
  const cx = size / 2;
  const cy = size / 2;

  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  console.log(`Created Star Sticker PNG: ${outputPath}`);
}

// Helper to generate Postage Stamp PNG
function createStampSticker(outputPath, width = 160, height = 200) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#FFF9F0';
  ctx.shadowColor = 'rgba(0,0,0,0.15)';
  ctx.shadowBlur = 8;
  ctx.fill();

  // Main stamp body
  ctx.beginPath();
  ctx.rect(10, 10, width - 20, height - 20);
  ctx.fill();

  // Scalloped cut edges
  ctx.globalCompositeOperation = 'destination-out';
  const radius = 6;
  for (let x = 15; x < width - 10; x += 16) {
    ctx.beginPath(); ctx.arc(x, 10, radius, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x, height - 10, radius, 0, Math.PI * 2); ctx.fill();
  }
  for (let y = 15; y < height - 10; y += 16) {
    ctx.beginPath(); ctx.arc(10, y, radius, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(width - 10, y, radius, 0, Math.PI * 2); ctx.fill();
  }

  ctx.globalCompositeOperation = 'source-over';
  // Inner illustration frame
  ctx.fillStyle = '#E892A0';
  ctx.fillRect(24, 24, width - 48, height - 48);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('LOVE', width / 2, height / 2 - 5);
  ctx.font = '12px sans-serif';
  ctx.fillText('SPECIAL POST', width / 2, height / 2 + 15);

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  console.log(`Created Stamp Sticker PNG: ${outputPath}`);
}

async function run() {
  console.log('Generating transparent PNG assets...');

  // 1. Process 3D gift box images to transparent PNGs
  await removeBlackBackground(
    path.join(__dirname, 'assets/gift/box_body.jpg'),
    path.join(__dirname, 'assets/gift/box_body.png'),
    30
  );

  await removeBlackBackground(
    path.join(__dirname, 'assets/gift/box_lid.jpg'),
    path.join(__dirname, 'assets/gift/box_lid.png'),
    30
  );

  await removeBlackBackground(
    path.join(__dirname, 'assets/scrapbook/flowers.jpg'),
    path.join(__dirname, 'assets/scrapbook/flower_sticker.png'),
    35
  );

  // 2. Generate vector/textured transparent PNG assets
  createPolaroidFrame(path.join(__dirname, 'assets/scrapbook/polaroid_frame.png'));
  createTornPaper(path.join(__dirname, 'assets/scrapbook/torn_paper_kraft.png'), 480, 320, '#EFE3CE');
  createTornPaper(path.join(__dirname, 'assets/scrapbook/torn_paper_pink.png'), 420, 260, '#FCDDEC');
  createWashiTape(path.join(__dirname, 'assets/scrapbook/washi_tape_1.png'), 220, 45, 'rgba(240, 160, 180, 0.85)');
  createWashiTape(path.join(__dirname, 'assets/scrapbook/washi_tape_2.png'), 200, 40, 'rgba(175, 210, 225, 0.85)');
  createHeartSticker(path.join(__dirname, 'assets/scrapbook/sticker_heart.png'));
  createStarSticker(path.join(__dirname, 'assets/scrapbook/sticker_star.png'));
  createStampSticker(path.join(__dirname, 'assets/scrapbook/sticker_stamp.png'));

  console.log('All transparent PNG assets generated successfully!');
}

run().catch(console.error);
