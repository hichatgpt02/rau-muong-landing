# 📋 Hướng Dẫn Kết Nối Google Sheet + Telegram Nhận Đơn Hàng

> **Mục đích:** Khi khách hàng đặt hàng trên website, đơn hàng sẽ **tự động lưu vào Google Sheet** và **gửi thông báo vào Telegram** để bạn xử lý ngay.

---

## 📌 Tổng quan luồng hoạt động

```
Khách đặt hàng trên web → Website gửi data → Google Apps Script
                                                    ↓
                                    ┌───────────────┴───────────────┐
                                    ↓                               ↓
                           Lưu vào Google Sheet           Gửi Telegram thông báo
                           (tab "DonHang")                (vào group/chat)
```

---

## Bước 1: Tạo Google Sheet

1. Đăng nhập Gmail
2. Vào [Google Sheets](https://sheets.google.com) → Click **+ Bảng tính trống** (Blank spreadsheet)
3. Đặt tên bảng tính: `Đơn Hàng - Rau Muống` (hoặc tên bạn muốn)
4. **Không cần tạo header** - code sẽ tự tạo khi có đơn đầu tiên

> 💡 Google Sheet sẽ tự động tạo sheet `DonHang` với các cột: Thời gian, Họ tên, SĐT, Địa chỉ, Số lượng, Giá, Ghi chú, Nguồn, IP, Trạng thái

---

## Bước 2: Tạo Bot Telegram + Lấy Chat ID

### 2a. Tạo Bot Telegram

1. Mở ứng dụng Telegram
2. Tìm kiếm **@BotFather** (bot chính thức của Telegram, có dấu tick xanh ✅)
3. Gửi lệnh: `/newbot`
4. BotFather sẽ hỏi **tên bot** → nhập tên gì cũng được, ví dụ: `Don Hang Rau Muong`
5. BotFather sẽ hỏi **username bot** → nhập username (phải kết thúc bằng `bot`), ví dụ: `donhang_raumuong_bot`
6. BotFather sẽ trả về **Bot Token** dạng:
   ```
   7123456789:AAF-xxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
7. **⚠️ Lưu lại token này** — sẽ dùng ở Bước 3

### 2b. Lấy Chat ID nhận thông báo

**Cách 1: Nhận vào group Telegram (khuyên dùng)**

1. Tạo 1 group Telegram mới (hoặc dùng group có sẵn)
2. **Thêm bot** vừa tạo vào group (tìm theo username bot ở bước 2a.5)
3. Gửi 1 tin nhắn bất kỳ trong group (ví dụ: `test`)
4. Mở trình duyệt, vào link sau (thay `<TOKEN>` bằng token thật):
   ```
   https://api.telegram.org/bot<TOKEN>/getUpdates
   ```
   Ví dụ:
   ```
   https://api.telegram.org/bot7123456789:AAF-xxxxxxxxxxx/getUpdates
   ```
5. Tìm trong kết quả trả về dòng `"chat":{"id":-100xxxxxxxxxx` → số đó là **Chat ID**
6. **⚠️ Chat ID group luôn bắt đầu bằng dấu `-`** (ví dụ: `-5085673953` hoặc `-1001234567890`)

**Cách 2: Nhận trực tiếp vào tài khoản cá nhân**

1. Tìm kiếm **@userinfobot** trên Telegram
2. Gửi lệnh `/start`
3. Bot sẽ trả về **Chat ID** của bạn (số dương, ví dụ: `123456789`)

---

## Bước 3: Paste Code vào Google Apps Script

1. Quay lại Google Sheet đã tạo ở Bước 1
2. Click menu **Tiện ích mở rộng** (Extensions) → **Apps Script**
3. Trình soạn thảo Apps Script sẽ mở ra → **Xóa hết code mặc định**
4. Mở file `google-apps-script.js` (file đi kèm tài liệu này)
5. **Copy toàn bộ nội dung** → **Paste vào Apps Script editor**
6. **SỬA 2 dòng đầu tiên** bằng token và chat ID thật:

```javascript
const TELEGRAM_BOT_TOKEN = '7123456789:AAF-xxxxxxxxxxxxxxxxxxxxxxxxxxx';  // Token từ bước 2a
const TELEGRAM_CHAT_ID = '-5085673953';                                    // Chat ID từ bước 2b
```

7. Bấm **Ctrl+S** để lưu

---

## Bước 4: Deploy (Triển khai) Apps Script

1. Click nút **Triển khai** (Deploy) → **Triển khai mới** (New deployment)
2. Bên cạnh "Chọn loại", click icon ⚙️ → chọn **Ứng dụng web** (Web app)
3. Cấu hình:
   - **Mô tả (Description):** `API Đơn hàng Rau Muống` (hoặc gì cũng được)
   - **Thực thi với tư cách (Execute as):** chọn **Tôi** (Me)
   - **Ai có quyền truy cập (Who has access):** chọn **Bất kỳ ai** (Anyone)
4. Click **Triển khai** (Deploy)
5. Google sẽ hỏi **xác nhận quyền** → Click **Cho phép** (Authorize)
   - Nếu thấy cảnh báo "Google chưa xác minh" → click **Nâng cao** (Advanced) → **Truy cập (Go to)...**
6. **Copy URL triển khai** — dạng:
   ```
   https://script.google.com/macros/s/AKfycbw.../exec
   ```

> ⚠️ **LƯU Ý QUAN TRỌNG:** Mỗi lần SỬA code trong Apps Script → bạn phải vào **Triển khai** → **Quản lý triển khai** → **Chỉnh sửa** (icon bút chì) → đổi **Phiên bản** sang **Triển khai mới** → bấm **Triển khai**. Nếu không, code cũ vẫn chạy!

---

## Bước 5: Điền URL vào Website

Gửi lại URL vừa copy ở Bước 4 cho người quản lý website để cập nhật vào file `script.js`:

```javascript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw.../exec';
```

---

## Bước 6: Test thử

1. Vào website → điền form đặt hàng → bấm **Đặt hàng**
2. Kiểm tra:
   - ✅ Google Sheet có dòng mới trong tab `DonHang`
   - ✅ Telegram group nhận tin nhắn thông báo đơn hàng

---

## ❓ Xử lý lỗi thường gặp

| Vấn đề | Nguyên nhân | Cách sửa |
|--------|------------|----------|
| Telegram không nhận tin | Sai Bot Token hoặc Chat ID | Kiểm tra lại token, kiểm tra bot đã được thêm vào group chưa |
| Sheet không ghi data | Chưa deploy hoặc deploy sai quyền | Deploy lại, chọn "Anyone" + "Me" |
| Báo lỗi khi deploy | Chưa cho phép quyền truy cập | Click "Cho phép" khi Google hỏi |
| Sửa code nhưng không có hiệu lực | Chưa deploy phiên bản mới | Vào Quản lý triển khai → tạo phiên bản mới |
| Chat ID group không tìm thấy | Bot chưa vào group hoặc chưa gửi tin | Thêm bot vào group, gửi tin rồi check lại `/getUpdates` |

---

## 📊 Bảng giá hiện tại (tham khảo)

| Combo | Giá hiển thị | Giá ghi vào Sheet |
|-------|-------------|-------------------|
| 5 gói | 80.000đ (+30k ship) | 110.000đ |
| 10 gói | 150.000đ (Free ship) | 150.000đ |
| 20 gói | 230.000đ (Free ship) | 230.000đ |

> Khi thay đổi giá → cần sửa **3 file**: `index.html` (combo cards), `script.js` (priceMap), `google-apps-script.js` (priceMap)

---

## ✅ Tóm tắt những gì cần gửi lại

Sau khi setup xong, gửi lại cho bên quản lý website **1 thứ duy nhất**:

```
URL Google Apps Script: https://script.google.com/macros/s/AKfycbw.../exec
```

Bên website sẽ cập nhật URL này vào code để đơn hàng tự động chạy.
