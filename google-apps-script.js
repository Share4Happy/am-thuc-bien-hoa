/**
 * ============================================================================
 * ĐA DỤNG (MULTI-LANDING) - GOOGLE APPS SCRIPT WEB APP
 * Hỗ trợ nhiều Landing Page dùng chung 1 URL duy nhất:
 *   - Landing page 'Ẩm Thực Biên Hòa' -> Tự động lưu vào tab 'Ẩm thực Biên Hoà'
 *   - Landing page cũ ('Print 3D Studio'...) -> Tiếp tục lưu vào trang tính 1 như cũ
 * ============================================================================
 * CÁCH CẬP NHẬT ĐỂ GIỮ NGUYÊN URL (CÁC LANDING KHÁC KHÔNG CẦN ĐỔI GÌ):
 * 1. Mở Google Sheet: https://docs.google.com/spreadsheets/d/1p4HGXK7mepMIxt9l2TpughyTzt762zQnVgcLwzGlalg/edit
 * 2. Vào Tiện ích mở rộng (Extensions) > Apps Script.
 * 3. Dán toàn bộ mã nguồn bên dưới vào file Code.gs và bấm Lưu (Ctrl+S).
 * 4. Bấm "Triển khai" (Deploy) > "Quản lý bản triển khai" (Manage deployments).
 * 5. Bấm icon hình cây bút chì (Chỉnh sửa / Edit) ở bản Web App hiện tại.
 * 6. Ở dòng Phiên bản (Version), bấm chọn "Mới" (New version).
 * 7. Bấm "Triển khai" (Deploy).
 *    => URL WEB APP SẼ GIỮ NGUYÊN 100%, KHÔNG CẦN ĐỔI URL Ở BẤT KỲ ĐÂU!
 * ============================================================================
 */

const CONFIG = {
  SHEET_ID: '1p4HGXK7mepMIxt9l2TpughyTzt762zQnVgcLwzGlalg', // Sheet ID của bạn
  AM_THUC_SHEET_NAME: 'Ẩm thực Biên Hoà',                     // Tên tab dành riêng cho Ẩm thực Biên Hòa
  DUPLICATE_WINDOW_MIN: 10                                    // Chặn gửi trùng cùng số điện thoại trong 10 phút
};

/**
 * Endpoint GET để kiểm tra trạng thái hoạt động của Web App
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      ok: true,
      message: 'Multi-Landing Lead Web App đang hoạt động. Vui lòng gửi dữ liệu qua phương thức POST.'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Endpoint POST nhận dữ liệu từ Landing Page
 */
function doPost(e) {
  try {
    // 1) Bảo vệ nếu chạy thử trực tiếp nút "Chạy" trên Apps Script
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse_(400, { ok: false, error: 'no_post_data' });
    }

    // 2) Parse JSON body (Landing Page gửi Content-Type text/plain để tránh CORS OPTIONS preflight)
    let data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (err) {
      return jsonResponse_(400, { ok: false, error: 'bad_json' });
    }

    // 3) Bẫy Honeypot: Nếu spam bot điền ô ẩn website -> Trả về ok giả lập, không ghi vào Sheet
    if (data.website) {
      return jsonResponse_(200, { ok: true, ignored: true });
    }

    // 4) Bắt buộc có sự đồng ý xử lý dữ liệu
    if (data.consent !== true) {
      return jsonResponse_(400, { ok: false, error: 'no_consent' });
    }

    // 5) Làm sạch và kiểm tra hợp lệ dữ liệu
    const lead = {
      fullName: safeText_(data.fullName, 60),
      phone: safeText_(data.phone, 20),
      email: safeText_(data.email, 100).toLowerCase(),
      region: safeText_(data.region, 60),
      address: safeText_(data.address, 200),
      source: safeText_(data.source, 60) || 'Website Landing Page'
    };

    if (lead.fullName.length < 2) {
      return jsonResponse_(400, { ok: false, error: 'bad_name' });
    }
    if (!/^(?:\+?84|0)[35789]\d{8}$/.test(lead.phone.replace(/\s+/g, ''))) {
      return jsonResponse_(400, { ok: false, error: 'bad_phone' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(lead.email)) {
      return jsonResponse_(400, { ok: false, error: 'bad_email' });
    }

    // 6) PHÂN LUỒNG TRANG TÍNH THÔNG MINH DỰA TRÊN NGUỒN GỬI TỚI:
    const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    let sheet;

    const isAmThuc = (
      data.targetSheet === CONFIG.AM_THUC_SHEET_NAME ||
      data.sheetName === CONFIG.AM_THUC_SHEET_NAME ||
      (lead.source && lead.source.indexOf('Ẩm Thực Biên Hòa') !== -1)
    );

    if (isAmThuc) {
      // >> DÀNH CHO LANDING ẨM THỰC BIÊN HÒA: Ghi vào tab 'Ẩm thực Biên Hoà'
      sheet = ss.getSheetByName(CONFIG.AM_THUC_SHEET_NAME);
      if (!sheet) {
        // Tự động tạo tab nếu chưa có
        sheet = ss.insertSheet(CONFIG.AM_THUC_SHEET_NAME);
        const headers = ['STT', 'Thời gian', 'Họ và tên', 'Số điện thoại', 'Email', 'Khu vực', 'Nhu cầu tư vấn', 'Nguồn'];
        sheet.appendRow(headers);
        sheet.getRange(1, 1, 1, headers.length)
          .setFontWeight('bold')
          .setBackground('#FFF3CD')
          .setHorizontalAlignment('center');
        sheet.setFrozenRows(1);
      }
    } else {
      // >> DÀNH CHO CÁC LANDING KHÁC (Print 3D Studio...): Ghi vào trang tính thứ nhất như cũ
      sheet = ss.getSheets()[0];
    }

    // 7) Chặn gửi trùng cùng số điện thoại trong 10 phút gần đây trên chính sheet đó
    if (hasRecentDuplicate_(sheet, lead.phone)) {
      return jsonResponse_(200, { ok: true, duplicate: true });
    }

    // 8) Ghi đúng 8 cột khớp bảng tính (Tự động tăng STT & giữ số 0 đầu SĐT)
    const lastRow = sheet.getLastRow();
    let stt = 1;
    if (lastRow >= 2) {
      const prevStt = parseInt(sheet.getRange(lastRow, 1).getValue(), 10);
      stt = (!isNaN(prevStt) && prevStt > 0) ? (prevStt + 1) : lastRow;
    }
    const timeFormatted = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'dd/MM/yyyy HH:mm:ss');

    sheet.getRange(lastRow + 1, 1, 1, 8)
      .setValues([[
        stt,
        timeFormatted,
        lead.fullName,
        "'" + lead.phone,
        lead.email,
        lead.region,
        lead.address,
        lead.source
      ]]);

    return jsonResponse_(200, { ok: true, message: 'Success' });
  } catch (globalErr) {
    return jsonResponse_(500, { ok: false, error: String(globalErr) });
  }
}

/**
 * HÀM TEST TRỰC TIẾP TRONG APPS SCRIPT:
 * Bạn có thể chọn hàm 'testAmThucBienHoa' hoặc 'testLandingKhac' rồi bấm 'Chạy' (Run)
 */
function testAmThucBienHoa() {
  const fakeEvent = {
    postData: {
      contents: JSON.stringify({
        fullName: 'Khách Ẩm Thực Test',
        phone: '0912345678',
        email: 'test@amthucbienhoa.com',
        region: 'Phường Quyết Thắng',
        address: 'Cần tư vấn quán lẩu tôm',
        consent: true,
        source: 'Website Ẩm Thực Biên Hòa',
        targetSheet: 'Ẩm thực Biên Hoà'
      })
    }
  };
  const result = doPost(fakeEvent);
  Logger.log('Kết quả test Ẩm Thực: ' + result.getContent());
}

function testLandingKhac() {
  const fakeEvent = {
    postData: {
      contents: JSON.stringify({
        fullName: 'Khách Print 3D Test',
        phone: '0987654321',
        email: 'test@print3d.com',
        region: 'Biên Hòa',
        address: 'Cần in mẫu 3D',
        consent: true,
        source: 'Website Landing Page'
      })
    }
  };
  const result = doPost(fakeEvent);
  Logger.log('Kết quả test Landing khác: ' + result.getContent());
}

/**
 * Làm sạch chuỗi văn bản đầu vào & Chống Formula Injection (CSV Injection) trong Google Sheets
 */
function safeText_(value, maxLen) {
  let text = String(value == null ? '' : value)
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLen);

  // Ngăn chặn Formula Injection: nếu chuỗi bắt đầu bằng =, +, -, @ thì thêm dấu ' phía trước
  if (/^[=+@\-\t\r]/.test(text)) {
    text = "'" + text;
  }
  return text;
}

/**
 * Kiểm tra trùng lặp số điện thoại trong vòng 50 dòng gần nhất
 */
function hasRecentDuplicate_(sheet, phone) {
  try {
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return false;

    const numRows = Math.min(lastRow - 1, 50);
    const startRow = lastRow - numRows + 1;
    const values = sheet.getRange(startRow, 1, numRows, 4).getValues();
    const normalized = String(phone || '').replace(/['\s+]/g, '');

    for (let i = values.length - 1; i >= 0; i--) {
      const row = values[i];
      const rowPhone = String(row[3] || '').replace(/['\s+]/g, '');
      if (rowPhone === normalized) return true;
    }
    return false;
  } catch (err) {
    return false;
  }
}

/**
 * Helper định dạng phản hồi JSON
 */
function jsonResponse_(code, payload) {
  const output = Object.assign({ status: code }, payload);
  return ContentService
    .createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}
