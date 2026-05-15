// ===== Hạt Giống VT - Shopee Style Script =====
document.addEventListener('DOMContentLoaded', () => {

  // ===== NAV TOGGLE =====
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => mainNav.classList.toggle('active'));
    mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mainNav.classList.remove('active')));
  }

  // ===== HEADER SCROLL =====
  const header = document.getElementById('header');

  // ===== IMAGE GALLERY =====
  window.changeImage = function(thumb) {
    const mainImg = document.getElementById('mainProductImg');
    if (mainImg) {
      mainImg.src = thumb.src;
      document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    }
  };

  // ===== COMBO SELECTION =====
  window.selectCombo = function(card) {
    document.querySelectorAll('.combo-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');

    const qty = card.dataset.qty;
    const price = parseInt(card.dataset.price);
    const oldPrice = parseInt(card.dataset.old);
    const discount = card.dataset.discount;

    const priceFormatted = price.toLocaleString('vi-VN') + 'đ';
    const oldFormatted = oldPrice.toLocaleString('vi-VN') + 'đ';

    document.getElementById('displayPrice').textContent = priceFormatted;
    document.getElementById('displayOldPrice').textContent = oldFormatted;
    document.getElementById('displayDiscount').textContent = '-' + discount + '%';
    document.getElementById('buyQty').value = qty;
    document.getElementById('btnPrice').textContent = priceFormatted;

    const stickyPrice = document.getElementById('stickyPrice');
    if (stickyPrice) stickyPrice.textContent = '15k/1 gói';
  };

  // ===== STICKY BUY - ẩn khi ở form =====
  const stickyBuy = document.getElementById('stickyBuy');
  const buyForm = document.getElementById('buyForm');

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (header) header.classList.toggle('scrolled', window.scrollY > 50);
        if (stickyBuy && buyForm) {
          const formRect = buyForm.getBoundingClientRect();
          const isFormVisible = formRect.top < window.innerHeight && formRect.bottom > 0;
          stickyBuy.style.transform = isFormVisible ? 'translateY(100%)' : 'translateY(0)';
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // ===== PRICE MAP =====
  const priceMap = {'5': 110000, '10': 150000, '20': 230000};

  // ===== GOOGLE APPS SCRIPT API =====
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyfqTWj-T4uZXwVOknruhoAD3ESXkRcVNddYcDcoNeorf82YMbiJXnl5DtMZ3IzW6PW/exec';

  // ===== TELEGRAM BOT API =====
  const TELEGRAM_BOT_TOKEN = '8724084496:AAEy2Ki37qaZw8Y3zUtB8fM0uWoNAaSHSc0';
  const TELEGRAM_CHAT_ID = '-5009829901';

  async function sendTelegram(data) {
    const priceText = (data.price || 0).toLocaleString('vi-VN') + 'đ';
    const message = `🛒 *ĐƠN HÀNG MỚI \\- Rau Muống Lá Tre*\n\n👤 *Khách hàng:* ${escTg(data.name)}\n📞 *SĐT:* ${escTg(data.phone)}\n📍 *Địa chỉ:* ${escTg(data.address)}\n📦 *Số lượng:* ${data.quantity} gói\n💰 *Thanh toán:* ${escTg(priceText)} \\(COD\\)\n📝 *Ghi chú:* ${escTg(data.note || 'Không')}\n🌐 *IP:* ${escTg(data.ip || 'N/A')}\n⏰ *Thời gian:* ${escTg(new Date().toLocaleString('vi-VN'))}`;

    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'MarkdownV2'
        })
      });
    } catch (err) {
      console.error('Telegram error:', err);
    }
  }

  function escTg(str) {
    return String(str).replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1');
  }

  // ===== SUBMIT ORDER =====
  const buyFormEl = document.getElementById('buyForm');
  if (buyFormEl) {
    buyFormEl.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = document.getElementById('buyBtn');
      const data = {
        name: document.getElementById('buyName').value.trim(),
        phone: document.getElementById('buyPhone').value.trim(),
        address: document.getElementById('buyAddress').value.trim(),
        quantity: document.getElementById('buyQty').value,
        price: priceMap[document.getElementById('buyQty').value] || 150000,
        note: document.getElementById('buyNote').value.trim(),
        source: 'Rau Muống Lá Tre - Facebook Ads'
      };

      // Validate
      if (!data.name || !data.phone || !data.address) {
        showToast('⚠️ Vui lòng điền đầy đủ Họ tên, SĐT và Địa chỉ.', 'error');
        return;
      }
      if (!/^[0-9]{9,11}$/.test(data.phone.replace(/\s/g, ''))) {
        showToast('⚠️ Số điện thoại không hợp lệ.', 'error');
        return;
      }
      if (data.name.length < 2) {
        showToast('⚠️ Họ tên quá ngắn.', 'error');
        return;
      }
      if (data.address.length < 10) {
        showToast('⚠️ Địa chỉ quá ngắn, vui lòng nhập chi tiết hơn.', 'error');
        return;
      }

      // Check duplicate order - TẮT
      // const prevOrders = JSON.parse(localStorage.getItem('f1_orders') || '[]');
      // const isDuplicate = prevOrders.some(o => o.phone === data.phone);
      // if (isDuplicate) {
      //   showToast('⚠️ Bạn đã đặt đơn hàng trước đó. Vui lòng không đặt trùng!', 'error');
      //   showThankYouOverlay(data, true);
      //   return;
      // }
      const prevOrders = [];

      // Submit
      const originalHTML = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '⏳ Đang gửi đơn...';

      try {
        // Lấy IP khách hàng
        let clientIP = 'N/A';
        try {
          const ipRes = await fetch('https://api.ipify.org?format=json');
          const ipData = await ipRes.json();
          clientIP = ipData.ip;
        } catch(e) {}
        data.ip = clientIP;

        // Gửi đơn hàng đến Google Apps Script
        if (GOOGLE_SCRIPT_URL && !GOOGLE_SCRIPT_URL.includes('ĐIỀN_URL')) {
          const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
        }
        // Gửi thông báo Telegram
        await sendTelegram(data);

        // Facebook Pixel - Track Purchase
        if (typeof fbq === 'function') {
          fbq('track', 'Purchase', {
            value: data.price,
            currency: 'VND',
            content_name: 'Hạt Giống Rau Muống Lá Tre',
            content_type: 'product',
            num_items: parseInt(data.quantity)
          });
        }

        // Save order to localStorage
        prevOrders.push({ phone: data.phone, name: data.name, time: Date.now() });
        localStorage.setItem('f1_orders', JSON.stringify(prevOrders));

        btn.disabled = false;
        btn.innerHTML = originalHTML;
        buyFormEl.reset();

        // Show thank you overlay
        showThankYouOverlay(data, false);

      } catch (error) {
        console.error('Order error:', error);
        // Still save & show thank you (order likely went through with no-cors)
        prevOrders.push({ phone: data.phone, name: data.name, time: Date.now() });
        localStorage.setItem('f1_orders', JSON.stringify(prevOrders));

        btn.disabled = false;
        btn.innerHTML = originalHTML;
        buyFormEl.reset();

        showThankYouOverlay(data, false);
      }
    });
  }

  // ===== THANK YOU OVERLAY =====
  function showThankYouOverlay(data, isDuplicate) {
    const overlay = document.getElementById('thankyouOverlay');
    const orderInfo = document.getElementById('thankyouOrderInfo');
    if (!overlay) return;

    // Populate order info
    const priceFormatted = (data.price || 0).toLocaleString('vi-VN') + 'đ';
    orderInfo.innerHTML = `
      <div class="order-row"><span>👤 Khách hàng:</span> <strong>${data.name}</strong></div>
      <div class="order-row"><span>📞 Điện thoại:</span> <strong>${data.phone}</strong></div>
      <div class="order-row"><span>📦 Số lượng:</span> <strong>${data.quantity} gói</strong></div>
      <div class="order-row"><span>💰 Thanh toán:</span> <strong>${priceFormatted} (COD)</strong></div>
    `;

    // Show overlay with animation
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.classList.add('show');
      });
    });

    // Reset SVG animations
    const circle = overlay.querySelector('.thankyou-circle');
    const check = overlay.querySelector('.thankyou-check');
    if (circle) { circle.style.animation = 'none'; circle.offsetHeight; circle.style.animation = ''; }
    if (check) { check.style.animation = 'none'; check.offsetHeight; check.style.animation = ''; }
  }

  // Close thank you overlay
  const thankyouBackBtn = document.getElementById('thankyouBackBtn');
  if (thankyouBackBtn) {
    thankyouBackBtn.addEventListener('click', () => {
      const overlay = document.getElementById('thankyouOverlay');
      overlay.classList.remove('show');
      setTimeout(() => {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 400);
    });
  }

  // ===== TOAST =====
  function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
