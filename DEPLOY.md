# 🚀 Hướng Dẫn Deploy Lên Cloudflare Pages

> **Tài liệu dành cho người deploy website lên Cloudflare Pages.**
> Website tĩnh (HTML/CSS/JS) → deploy trực tiếp, không cần build.

---

## 📌 Thông tin Project

| Mục | Giá trị |
|---|---|
| **Cloudflare Pages** | `rau-muong` |
| **Domain chính** | `raumuong.shophatgiongf1.com` |
| **Pages.dev** | `rau-muong.pages.dev` |
| **Branch production** | `main` |

---

## ⚡ Deploy nhanh (1 lệnh)

```powershell
cd "C:\Users\admin\Documents\CODE WED\Rau muống"
powershell -ExecutionPolicy Bypass -File deploy.ps1
```

> ⚠️ **Branch phải là `main`** (không phải `master` hay `production`). Deploy sai branch → custom domain vẫn hiển thị bản cũ!

---

## 📋 Deploy đầy đủ (commit + push + deploy)

### Bước 1: Deploy lên Cloudflare Pages

```powershell
cd "C:\Users\admin\Documents\CODE WED\Rau muống"
powershell -ExecutionPolicy Bypass -File deploy.ps1
```

### Bước 2: Xác nhận deploy thành công

```powershell
# Đợi 10 giây rồi kiểm tra
Start-Sleep 10
(Invoke-WebRequest -Uri "https://rau-muong.pages.dev/" -UseBasicParsing).Content.Substring(0,300)
```

Nếu thấy HTML của trang web → deploy thành công ✅

---

## 🔧 Lần đầu tiên deploy (nếu chưa có project trên Cloudflare)

### Yêu cầu

- Có tài khoản [Cloudflare](https://dash.cloudflare.com/)
- Cài [Node.js](https://nodejs.org/) (version 18+)
- Đăng nhập Wrangler:

```powershell
npx -y wrangler login
```

### Tạo project mới

```powershell
npx -y wrangler pages project create rau-muong --production-branch=main
```

### Deploy lần đầu

```powershell
cd "C:\Users\admin\Documents\CODE WED\Rau muống"
npx -y wrangler pages deploy . --project-name=rau-muong --branch=main
```

### Kết nối Custom Domain

1. Đăng nhập [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Vào **Workers & Pages** → chọn project `rau-muong`
3. Tab **Custom domains** → **Set up a custom domain**
4. Nhập domain: `raumuong.shophatgiongf1.com`
5. Cloudflare tự tạo CNAME record → bấm **Activate domain**
6. Đợi 1-5 phút cho DNS cập nhật

---

## 📁 Cấu trúc file cần deploy

```
├── index.html              # Trang chính
├── style.css               # CSS toàn bộ giao diện
├── script.js               # Logic + Pixel + Form xử lý
├── deploy.ps1              # Script deploy tự động
├── google-apps-script.js   # Code cho Google Apps Script (KHÔNG deploy, chỉ tham khảo)
├── DEPLOY.md               # Tài liệu deploy (file này)
├── HUONG-DAN.md            # Hướng dẫn setup Sheet + Telegram
└── images/
    ├── raumuong-*.jpg      # Ảnh sản phẩm rau muống
    ├── logo.png            # Logo shop
    └── avatar-*.png        # Avatar review khách hàng
```

> 💡 Cloudflare Pages sẽ deploy **tất cả file trong thư mục**, kể cả `.md` và backup. Không ảnh hưởng hoạt động web nhưng nếu muốn gọn hơn, có thể thêm file `.cfignore` để loại trừ.

---

## 🔄 Cập nhật Google Apps Script (nếu sửa code nhận đơn)

> File `google-apps-script.js` KHÔNG liên quan đến deploy Cloudflare. Nó chạy trên Google.

1. Mở [Google Apps Script](https://script.google.com)
2. Chọn project đơn hàng
3. Copy toàn bộ nội dung file `google-apps-script.js` mới → paste đè vào editor
4. Bấm **Triển khai** → **Quản lý triển khai** → Chỉnh sửa → Phiên bản mới → **Triển khai**
5. Nếu URL thay đổi → cập nhật vào `script.js` dòng `GOOGLE_SCRIPT_URL` → deploy lại web

---

## ❌ Xử lý sự cố

### Deploy rồi mà web vẫn hiển thị bản cũ?

1. **Hard refresh trình duyệt:** `Ctrl + Shift + R`
2. **Kiểm tra branch:** phải deploy branch `main` (không phải master)
3. **Check preview URL:** link `https://xxxxx.rau-muong.pages.dev/` in ra khi deploy
4. **Purge cache Cloudflare:** Dashboard → Caching → Purge Everything

### Pixel không tracking?

- Kiểm tra Pixel ID trong `<head>` của `index.html`
- Cài extension **Facebook Pixel Helper** trên Chrome để debug
- Pixel chỉ fire khi có người thật truy cập (không fire khi dùng localhost)

### Lỗi "wrangler: command not found"?

```powershell
npm install -g wrangler
# hoặc dùng npx:
npx -y wrangler pages deploy ...
```

---

## 📊 Bảng giá hiện tại - Rau Muống Lá Tre

| Combo | Giá | Ship | Ghi chú |
|---|---|---|---|
| 5 gói | 80.000đ | +30k ship = **110k** | Mồi (decoy) |
| **10 gói** | **150.000đ** | **Free ship** | ⭐ Phổ biến nhất - Tiết kiệm 100k |
| 20 gói | 230.000đ | Free ship | 🔥 Tiết kiệm nhất |

> Khi thay đổi giá → sửa **3 file**: `index.html` (combo cards), `script.js` (priceMap), `google-apps-script.js` (priceMap)
