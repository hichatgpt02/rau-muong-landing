// ============================================
// PASTE CODE NÀY VÀO GOOGLE APPS SCRIPT
// Hướng dẫn chi tiết ở file HUONG-DAN.md
// ============================================

// ===== CẤU HÌNH - THAY ĐỔI 2 DÒNG NÀY =====
const TELEGRAM_BOT_TOKEN = '8724084496:AAEy2Ki37qaZw8Y3zUtB8fM0uWoNAaSHSc0';   // Lấy từ @BotFather
const TELEGRAM_CHAT_ID = '-5009829901';       // Chat ID nhóm Telegram

// ===== XỬ LÝ ĐƠN HÀNG =====
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Lưu vào Google Sheet
    saveToSheet(data);
    
    // Gửi thông báo Telegram
    sendTelegram(data);
    
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'success', message: 'Đơn hàng đã được ghi nhận!' })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'error', message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// Cho phép CORS
function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({ status: 'ok', message: 'API đang hoạt động' })
  ).setMimeType(ContentService.MimeType.JSON);
}

// ===== LƯU VÀO SHEET =====
function saveToSheet(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('DonHang');
  
  // Tạo sheet nếu chưa có
  if (!sheet) {
    sheet = ss.insertSheet('DonHang');
    sheet.getRange(1, 1, 1, 11).setValues([[
      'STT', 'Thời gian', 'Họ tên', 'SĐT', 'Địa chỉ', 
      'Số lượng', 'Giá', 'Ghi chú', 'Nguồn', 'IP', 'Trạng thái'
    ]]);
    // Format header
    sheet.getRange(1, 1, 1, 11).setFontWeight('bold').setBackground('#4caf50').setFontColor('#fff');
    sheet.setFrozenRows(1);
  }
  
  const priceMap = {'5': '110.000đ', '10': '150.000đ', '20': '230.000đ'};
  const priceDisplay = data.price ? Number(data.price).toLocaleString('vi-VN') + 'đ' : (priceMap[data.quantity] || '');
  
  // Tìm dòng cuối cùng có dữ liệu (tránh dòng trống)
  const lastRow = sheet.getLastRow();
  const nextRow = lastRow + 1;
  const stt = lastRow; // STT = số dòng dữ liệu (trừ header)
  
  // Ghi đơn hàng vào đúng dòng tiếp theo
  sheet.getRange(nextRow, 1, 1, 11).setValues([[
    stt,
    new Date().toLocaleString('vi-VN'),
    data.name || '',
    data.phone || '',
    data.address || '',
    data.quantity || '',
    priceDisplay,
    data.note || '',
    data.source || 'Website',
    data.ip || 'N/A',
    'Mới'
  ]]);
}

// ===== GỬI TELEGRAM =====
function sendTelegram(data) {
  
  const tgPriceMap = {
    '5': '110.000đ',
    '10': '150.000đ',
    '20': '230.000đ'
  };
  const tgPrice = data.price ? Number(data.price).toLocaleString('vi-VN') + 'đ' : (tgPriceMap[data.quantity] || '');
  
  const message = `🛒 *ĐƠN HÀNG MỚI!*
🌐 *Website:* Hạt Giống Rau Muống Lá Tre

👤 *Khách:* ${data.name || 'Chưa có'}
📞 *SĐT:* ${data.phone}
📍 *Địa chỉ:* ${data.address || 'Chưa có'}
📦 *Số lượng:* ${data.quantity} gói - ${tgPrice}
📝 *Ghi chú:* ${data.note || 'Không'}
🌐 *IP:* ${data.ip || 'N/A'}
🕐 *Thời gian:* ${new Date().toLocaleString('vi-VN')}
📱 *Nguồn:* ${data.source || 'Website'}

⚡ Liên hệ khách ngay!`;

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'Markdown'
    })
  });
}
