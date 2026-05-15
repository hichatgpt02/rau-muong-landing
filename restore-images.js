const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'ảnh rau muống');
const dst = path.join(__dirname, 'images');

const copies = [
  ['photo_2026-05-15_11-57-31.jpg', 'raumuong-nonla.jpg'],
  ['Hat-giong-rau-muong-la-tre1.jpg', 'raumuong-vuon.jpg'],
  ['photo_2026-05-15_11-57-00.jpg', 'raumuong-luong.jpg'],
  ['photo_2026-05-15_11-57-05.jpg', 'raumuong-ngamhat.jpg'],
  ['photo_2026-05-15_11-57-10.jpg', 'raumuong-gieohat.jpg'],
  ['photo_2026-05-15_11-57-16.jpg', 'raumuong-thuhoach1.jpg'],
  ['photo_2026-05-15_11-57-40.jpg', 'raumuong-cancanh.jpg'],
  ['rau-muong-la-tre-vn-6-89d94a02-71f6-4030-8346-4d0c9b15013a.jpg', 'raumuong-bancong.jpg'],
  ['photo_2026-05-15_11-57-21.jpg', 'raumuong-thuhoach2.jpg'],
  ['photo_2026-05-15_11-57-24.jpg', 'raumuong-catgoc.jpg'],
  ['photo_2026-05-15_11-57-36.jpg', 'raumuong-catxao.jpg'],
  ['rau-muong-la-tre2_1660285749.jpg', 'raumuong-vuonlon.jpg'],
  ['rau-muong.jpg', 'raumuong-xanh.jpg'],
  ['unnamed.jpg', 'raumuong-chau.jpg'],
];

copies.forEach(([from, to]) => {
  const srcFile = path.join(src, from);
  const dstFile = path.join(dst, to);
  fs.copyFileSync(srcFile, dstFile);
  const size = (fs.statSync(dstFile).size / 1024).toFixed(0);
  console.log(`✅ ${from} → ${to} (${size}KB)`);
});

console.log('\n✨ Đã khôi phục tất cả 14 ảnh gốc!');
