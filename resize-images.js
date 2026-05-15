const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const IMAGES_DIR = path.join(__dirname, 'images');
const SOURCE_DIR = path.join(__dirname, 'ảnh rau muống');

// Mapping: source file -> target configs
// Hero/main images: 800x800 square crop (center focus)
// Gallery images: 800x600 landscape crop  
// Thumbnails are handled by CSS, but we optimize the source files

const imageConfigs = [
  // === HERO / MAIN GALLERY IMAGES (square 800x800) ===
  {
    src: path.join(SOURCE_DIR, 'photo_2026-05-15_11-57-31.jpg'),
    dest: path.join(IMAGES_DIR, 'raumuong-nonla.jpg'),
    width: 800, height: 800,
    fit: 'cover',
    position: 'top',  // Focus on top part where person is
    label: 'Nông dân nón lá thu hoạch'
  },
  {
    src: path.join(SOURCE_DIR, 'Hat-giong-rau-muong-la-tre1.jpg'),
    dest: path.join(IMAGES_DIR, 'raumuong-vuon.jpg'),
    width: 800, height: 800,
    fit: 'cover',
    position: 'centre',
    label: 'Vườn rau muống xanh mướt'
  },
  {
    src: path.join(SOURCE_DIR, 'photo_2026-05-15_11-57-00.jpg'),
    dest: path.join(IMAGES_DIR, 'raumuong-luong.jpg'),
    width: 800, height: 800,
    fit: 'cover',
    position: 'centre',
    label: 'Luống rau muống non'
  },
  {
    src: path.join(SOURCE_DIR, 'photo_2026-05-15_11-57-05.jpg'),
    dest: path.join(IMAGES_DIR, 'raumuong-ngamhat.jpg'),
    width: 800, height: 800,
    fit: 'cover',
    position: 'top',
    label: 'Ngâm hạt giống'
  },
  {
    src: path.join(SOURCE_DIR, 'photo_2026-05-15_11-57-10.jpg'),
    dest: path.join(IMAGES_DIR, 'raumuong-gieohat.jpg'),
    width: 800, height: 800,
    fit: 'cover',
    position: 'centre',
    label: 'Gieo hạt xuống vườn'
  },
  {
    src: path.join(SOURCE_DIR, 'photo_2026-05-15_11-57-16.jpg'),
    dest: path.join(IMAGES_DIR, 'raumuong-thuhoach1.jpg'),
    width: 800, height: 800,
    fit: 'cover',
    position: 'top',
    label: 'Thu hoạch rau muống'
  },
  {
    src: path.join(SOURCE_DIR, 'photo_2026-05-15_11-57-40.jpg'),
    dest: path.join(IMAGES_DIR, 'raumuong-cancanh.jpg'),
    width: 800, height: 800,
    fit: 'cover',
    position: 'centre',
    label: 'Cận cảnh rau muống giòn'
  },
  {
    src: path.join(SOURCE_DIR, 'rau-muong-la-tre-vn-6-89d94a02-71f6-4030-8346-4d0c9b15013a.jpg'),
    dest: path.join(IMAGES_DIR, 'raumuong-bancong.jpg'),
    width: 800, height: 800,
    fit: 'cover',
    position: 'centre',
    label: 'Trồng ban công'
  },

  // === ADDITIONAL IMAGES for Gallery/Reviews ===
  {
    src: path.join(SOURCE_DIR, 'photo_2026-05-15_11-57-21.jpg'),
    dest: path.join(IMAGES_DIR, 'raumuong-thuhoach2.jpg'),
    width: 800, height: 800,
    fit: 'cover',
    position: 'centre',
    label: 'Thu hoạch rau muống 2'
  },
  {
    src: path.join(SOURCE_DIR, 'photo_2026-05-15_11-57-24.jpg'),
    dest: path.join(IMAGES_DIR, 'raumuong-catgoc.jpg'),
    width: 800, height: 800,
    fit: 'cover',
    position: 'top',
    label: 'Cắt gốc rau muống'
  },
  {
    src: path.join(SOURCE_DIR, 'photo_2026-05-15_11-57-36.jpg'),
    dest: path.join(IMAGES_DIR, 'raumuong-catxao.jpg'),
    width: 800, height: 800,
    fit: 'cover',
    position: 'centre',
    label: 'Cắt rau muống tại vườn'
  },
  {
    src: path.join(SOURCE_DIR, 'rau-muong-la-tre2_1660285749.jpg'),
    dest: path.join(IMAGES_DIR, 'raumuong-vuonlon.jpg'),
    width: 800, height: 800,
    fit: 'cover',
    position: 'centre',
    label: 'Vườn rau muống rộng'
  },
  {
    src: path.join(SOURCE_DIR, 'rau-muong.jpg'),
    dest: path.join(IMAGES_DIR, 'raumuong-xanh.jpg'),
    width: 800, height: 800,
    fit: 'cover',
    position: 'centre',
    label: 'Rau muống xanh tươi'
  },
  {
    src: path.join(SOURCE_DIR, 'unnamed.jpg'),
    dest: path.join(IMAGES_DIR, 'raumuong-chau.jpg'),
    width: 800, height: 800,
    fit: 'cover',
    position: 'centre',
    label: 'Rau muống trồng chậu'
  },
];

async function processImages() {
  console.log('🖼️  Bắt đầu resize ảnh rau muống...\n');
  
  for (const config of imageConfigs) {
    try {
      // Check source exists
      if (!fs.existsSync(config.src)) {
        console.log(`❌ Không tìm thấy: ${path.basename(config.src)}`);
        continue;
      }

      const srcInfo = await sharp(config.src).metadata();
      
      await sharp(config.src)
        .resize(config.width, config.height, {
          fit: config.fit,
          position: config.position,
        })
        .jpeg({
          quality: 88,
          mozjpeg: true, // Better compression
        })
        .sharpen({
          sigma: 0.8,      // Slight sharpening
          m1: 0.5,
          m2: 0.3,
        })
        .toFile(config.dest);

      const destStats = fs.statSync(config.dest);
      const srcStats = fs.statSync(config.src);
      const saved = Math.round((1 - destStats.size / srcStats.size) * 100);
      
      console.log(`✅ ${config.label}`);
      console.log(`   ${path.basename(config.src)} (${srcInfo.width}x${srcInfo.height}) → ${path.basename(config.dest)} (${config.width}x${config.height})`);
      console.log(`   ${(srcStats.size/1024).toFixed(0)}KB → ${(destStats.size/1024).toFixed(0)}KB (${saved > 0 ? '-' : '+'}${Math.abs(saved)}%)\n`);
      
    } catch (err) {
      console.log(`❌ Lỗi: ${config.label} - ${err.message}`);
    }
  }
  
  console.log('✨ Hoàn thành resize tất cả ảnh!');
}

processImages();
