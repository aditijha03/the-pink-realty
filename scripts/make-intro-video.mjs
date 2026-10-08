import fs from 'fs';
import path from 'path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import ffmpegStatic from 'ffmpeg-static';
import { spawn } from 'child_process';

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'intro');
const OUT_TEMP_DIR = path.join(process.cwd(), 'scripts', 'out');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(OUT_TEMP_DIR)) fs.mkdirSync(OUT_TEMP_DIR, { recursive: true });

const WIDTH = 1280;
const HEIGHT = 720;
const FPS = 30;
const TOTAL_FRAMES = Math.floor(2.8 * FPS); // 84

let seed = 12345;
function random() {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function easeOutCubic(t) {
  return (--t) * t * t + 1;
}

async function generateFrames() {
  const logoPath = path.join(process.cwd(), 'public', 'logo.webp');
  const logoImage = await loadImage(logoPath);
  
  const logoTargetWidth = WIDTH * 0.55;
  const scale = logoTargetWidth / logoImage.width;
  const logoTargetHeight = logoImage.height * scale;
  const logoX = (WIDTH - logoTargetWidth) / 2;
  const logoY = (HEIGHT - logoTargetHeight) / 2;

  const sampleCanvas = createCanvas(Math.floor(logoTargetWidth), Math.floor(logoTargetHeight));
  const sampleCtx = sampleCanvas.getContext('2d');
  sampleCtx.drawImage(logoImage, 0, 0, sampleCanvas.width, sampleCanvas.height);
  const imgData = sampleCtx.getImageData(0, 0, sampleCanvas.width, sampleCanvas.height).data;

  const particles = [];
  const sampleStep = 6; 
  for (let y = 0; y < sampleCanvas.height; y += sampleStep) {
    for (let x = 0; x < sampleCanvas.width; x += sampleStep) {
      const idx = (y * sampleCanvas.width + x) * 4;
      const r = imgData[idx];
      const g = imgData[idx + 1];
      const b = imgData[idx + 2];
      const a = imgData[idx + 3];
      
      if (a > 20 && (r > 10 || g > 10 || b > 10)) {
        const isFromEdge = random() > 0.5;
        let startX, startY;
        if (isFromEdge) {
            const edge = Math.floor(random() * 4);
            if (edge === 0) { startX = random() * WIDTH; startY = -100; }
            else if (edge === 1) { startX = WIDTH + 100; startY = random() * HEIGHT; }
            else if (edge === 2) { startX = random() * WIDTH; startY = HEIGHT + 100; }
            else { startX = -100; startY = random() * HEIGHT; }
        } else {
            startX = WIDTH / 2 + (random() - 0.5) * 100;
            startY = HEIGHT / 2 + (random() - 0.5) * 100;
        }

        const isPink = (r > 150 && g < 100 && b > 80 && b < 180);
        const stagger = random() * 0.4 + (isPink ? 0.4 : 0);

        particles.push({
          targetX: logoX + x,
          targetY: logoY + y,
          startX,
          startY,
          r, g, b, a,
          stagger
        });
      }
    }
  }
  console.log(`Generated ${particles.length} particles`);

  const mainCanvas = createCanvas(WIDTH, HEIGHT);
  const ctx = mainCanvas.getContext('2d');

  const frameDir = path.join(process.cwd(), 'scripts', 'out', 'frames');
  if (!fs.existsSync(frameDir)) fs.mkdirSync(frameDir, { recursive: true });

  for (let frame = 0; frame < TOTAL_FRAMES; frame++) {
    const t = frame / FPS; 
    
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    if (t < 0.3) {
      // Pure black
    } else if (t < 1.8) {
      const progress = (t - 0.3) / 1.5; 
      
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const localProgress = Math.max(0, Math.min(1, (progress - p.stagger * 0.5) / (1 - p.stagger * 0.5)));
        
        if (localProgress > 0) {
            const ease = easeOutCubic(localProgress);
            const currX = p.startX + (p.targetX - p.startX) * ease;
            const currY = p.startY + (p.targetY - p.startY) * ease;
            const alpha = (p.a / 255) * ease;
            
            ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${alpha})`;
            const size = 1.5 + (1 - ease) * 3;
            ctx.fillRect(currX, currY, size, size);
        }
      }
    } else if (t < 2.3) {
      const progress = (t - 1.8) / 0.5; 
      const alpha = progress;

      ctx.globalAlpha = 1 - alpha;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${p.a/255})`;
        ctx.fillRect(p.targetX, p.targetY, 1.5, 1.5);
      }

      ctx.globalAlpha = alpha;
      ctx.drawImage(logoImage, logoX, logoY, logoTargetWidth, logoTargetHeight);
      
      ctx.globalCompositeOperation = 'soft-light';
      const shimmerOffset = progress * (WIDTH * 1.5) - (WIDTH * 0.25);
      const gradient = ctx.createLinearGradient(
          shimmerOffset - 150, 0,
          shimmerOffset + 150, HEIGHT
      );
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1.0;
      
    } else {
      ctx.drawImage(logoImage, logoX, logoY, logoTargetWidth, logoTargetHeight);
      
      if (frame === TOTAL_FRAMES - 1) {
        const posterBuffer = mainCanvas.toBuffer('image/png');
        fs.writeFileSync(path.join(OUTPUT_DIR, 'logo-poster.png'), posterBuffer);
      }
    }

    const buffer = mainCanvas.toBuffer('image/png');
    const framePath = path.join(frameDir, `frame_${frame.toString().padStart(4, '0')}.png`);
    fs.writeFileSync(framePath, buffer);

    if (frame % 20 === 0) console.log(`Rendered frame ${frame}/${TOTAL_FRAMES}`);
  }
}

async function encodeVideo() {
  const frameDir = path.join(process.cwd(), 'scripts', 'out', 'frames');
  const mp4Output = path.join(OUTPUT_DIR, 'logo-intro.mp4');
  const webmOutput = path.join(OUTPUT_DIR, 'logo-intro.webm');

  console.log('Encoding MP4...');
  await new Promise((resolve, reject) => {
    const mp4Args = [
      '-y', '-framerate', '30',
      '-i', path.join(frameDir, 'frame_%04d.png'),
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      '-crf', '26',
      '-movflags', '+faststart',
      '-an',
      mp4Output
    ];
    const p = spawn(ffmpegStatic, mp4Args, { stdio: 'inherit' });
    p.on('close', code => code === 0 ? resolve() : reject(new Error(`mp4 error code ${code}`)));
  });

  console.log('Encoding WebM...');
  await new Promise((resolve, reject) => {
    const webmArgs = [
      '-y', '-framerate', '30',
      '-i', path.join(frameDir, 'frame_%04d.png'),
      '-c:v', 'libvpx-vp9',
      '-pix_fmt', 'yuv420p',
      '-crf', '36',
      '-b:v', '0',
      '-an',
      webmOutput
    ];
    const p = spawn(ffmpegStatic, webmArgs, { stdio: 'inherit' });
    p.on('close', code => code === 0 ? resolve() : reject(new Error(`webm error code ${code}`)));
  });

  console.log('Encoding Poster to WebP...');
  await new Promise((resolve, reject) => {
    const webpArgs = [
      '-y',
      '-i', path.join(OUTPUT_DIR, 'logo-poster.png'),
      '-c:v', 'libwebp',
      path.join(OUTPUT_DIR, 'logo-poster.webp')
    ];
    const p = spawn(ffmpegStatic, webpArgs, { stdio: 'ignore' });
    p.on('close', code => {
        if (code === 0 && fs.existsSync(path.join(OUTPUT_DIR, 'logo-poster.png'))) {
            fs.unlinkSync(path.join(OUTPUT_DIR, 'logo-poster.png'));
        }
        resolve();
    });
  });

  console.log('Creating contact sheet...');
  const contactFrames = [
      Math.floor(0.3 * 30),
      Math.floor(0.8 * 30),
      Math.floor(1.3 * 30),
      Math.floor(1.8 * 30),
      Math.floor(2.2 * 30),
      Math.floor(2.8 * 30) - 1
  ];
  
  const canvas = createCanvas(1280 * 2, 720 * 3);
  const ctx = canvas.getContext('2d');
  
  for (let i = 0; i < contactFrames.length; i++) {
    const fn = contactFrames[i];
    const framePath = path.join(frameDir, `frame_${fn.toString().padStart(4, '0')}.png`);
    if (fs.existsSync(framePath)) {
        const img = await loadImage(framePath);
        const col = i % 2;
        const row = Math.floor(i / 2);
        ctx.drawImage(img, col * 1280, row * 720);
    }
  }
  fs.writeFileSync(path.join(process.cwd(), 'scripts', 'out', 'contact-sheet.png'), canvas.toBuffer('image/png'));
  console.log('Contact sheet saved to scripts/out/contact-sheet.png');
}

async function run() {
  await generateFrames();
  await encodeVideo();
  
  const frameDir = path.join(process.cwd(), 'scripts', 'out', 'frames');
  fs.rmSync(frameDir, { recursive: true, force: true });
  console.log('Done!');
}

run().catch(console.error);
