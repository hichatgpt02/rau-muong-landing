# 📊 Hướng Dẫn Cài Đặt Sự Kiện Meta Pixel - Rau Muống Lá Tre

> **Pixel ID:** `984693801157190`  
> **Website:** `raumuong.shophatgiongf1.com`

---

## 📌 Tổng quan sự kiện đã cài đặt

| # | Sự kiện | Khi nào fire | Vị trí code |
|---|---------|-------------|-------------|
| 1 | **PageView** | Mỗi lần khách vào trang | `index.html` (trong `<head>`) |
| 2 | **Purchase** | Khi khách đặt hàng thành công | `script.js` (trong hàm submit form) |

---

## 1️⃣ Sự kiện PageView (Tự động)

**Khi nào fire:** Mỗi khi khách truy cập website.

**Vị trí:** File `index.html`, dòng 14-28, trong thẻ `<head>`

```html
<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '984693801157190');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=984693801157190&ev=PageView&noscript=1"/></noscript>
<!-- End Meta Pixel Code -->
```

**Dữ liệu gửi về Meta:**
- Pixel ID
- URL trang
- User Agent trình duyệt

---

## 2️⃣ Sự kiện Purchase (Khi đặt hàng)

**Khi nào fire:** Sau khi khách bấm "ĐẶT HÀNG NGAY" và đơn hàng gửi thành công.

**Vị trí:** File `script.js`, dòng 173-182, trong hàm xử lý submit form

```javascript
// Facebook Pixel - Track Purchase
if (typeof fbq === 'function') {
  fbq('track', 'Purchase', {
    value: data.price,           // Giá trị đơn hàng (VD: 150000)
    currency: 'VND',             // Đơn vị tiền tệ
    content_name: 'Hạt Giống Rau Muống Lá Tre',  // Tên sản phẩm
    content_type: 'product',     // Loại nội dung
    num_items: parseInt(data.quantity)  // Số lượng gói (5, 10, 20)
  });
}
```

**Dữ liệu gửi về Meta:**

| Tham số | Giá trị | Ví dụ |
|---------|---------|-------|
| `value` | Giá đơn hàng | `150000` |
| `currency` | Đơn vị tiền | `VND` |
| `content_name` | Tên sản phẩm | `Hạt Giống Rau Muống Lá Tre` |
| `content_type` | Loại | `product` |
| `num_items` | Số gói | `10` |

---

## 💰 Bảng giá trị Purchase theo combo

| Combo | value (VND) | num_items |
|-------|-------------|-----------|
| 5 gói | 110,000 | 5 |
| 10 gói | 150,000 | 10 |
| 20 gói | 230,000 | 20 |

---

## 🔧 Cài đặt trên Facebook Events Manager

### Bước 1: Kiểm tra Pixel hoạt động
1. Vào [Facebook Events Manager](https://business.facebook.com/events_manager2)
2. Chọn Pixel ID **984693801157190**
3. Tab **Overview** → xem sự kiện PageView và Purchase
4. Tab **Test Events** → mở website để xem sự kiện fire realtime

### Bước 2: Tạo Custom Conversion (nếu cần)
1. Vào Events Manager → **Custom Conversions**
2. Tạo conversion mới:
   - **Tên:** Đặt hàng Rau Muống
   - **Pixel:** 984693801157190
   - **Sự kiện:** Purchase
   - **Giá trị tối ưu:** Có (dựa trên value)

### Bước 3: Cấu hình trong Facebook Ads
1. Khi tạo Campaign → chọn mục tiêu **Conversions** hoặc **Sales**
2. Ở Ad Set → phần **Optimization** → chọn sự kiện **Purchase**
3. Pixel sẽ tự động đo lường ROAS (Return on Ad Spend)

---

## 🧪 Cách test Pixel

### Cách 1: Facebook Pixel Helper (Chrome Extension)
1. Cài [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
2. Vào `raumuong.shophatgiongf1.com`
3. Extension hiện icon xanh → PageView ✅
4. Đặt thử 1 đơn → extension hiện Purchase ✅

### Cách 2: Test Events (Events Manager)
1. Vào Events Manager → tab **Test Events**
2. Nhập URL: `https://raumuong.shophatgiongf1.com`
3. Bấm "Open Website" → thao tác trên web
4. Các sự kiện sẽ hiện realtime trong Test Events

---

## ⚠️ Lưu ý quan trọng

1. **Pixel chỉ fire trên domain thật** — Không fire trên localhost
2. **Nếu đổi Pixel ID** → sửa 2 chỗ trong `index.html` (dòng 24 và dòng 27)
3. **Muốn thêm sự kiện mới** (VD: AddToCart, ViewContent) → thêm `fbq('track', 'TenSuKien')` vào `script.js`
4. **Domain Verification** → Verify domain `shophatgiongf1.com` trong Business Manager để tối ưu tracking

---

## ✅ Tóm tắt

| Mục | Giá trị |
|-----|---------|
| **Pixel ID** | `984693801157190` |
| **Sự kiện PageView** | ✅ Tự động fire khi vào trang |
| **Sự kiện Purchase** | ✅ Fire khi đặt hàng thành công |
| **Dữ liệu Purchase** | Giá trị VND + số lượng gói |
| **Domain** | `raumuong.shophatgiongf1.com` |
