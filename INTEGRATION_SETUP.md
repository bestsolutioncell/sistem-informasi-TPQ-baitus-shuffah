# 🔧 **PANDUAN SETUP INTEGRASI SISTEM TPQ BAITUS SHUFFAH**

Panduan lengkap untuk mengkonfigurasi WhatsApp Business API dan Email SMTP pada sistem TPQ Baitus Shuffah.

## 📱 **SETUP WHATSAPP BUSINESS API**

### **1. Persiapan Akun Facebook Business**

1. **Buat Akun Facebook Business**
   - Kunjungi [Facebook Business](https://business.facebook.com)
   - Buat akun bisnis baru atau gunakan yang sudah ada
   - Verifikasi akun bisnis Anda

2. **Akses Facebook Developers**
   - Kunjungi [Facebook Developers](https://developers.facebook.com)
   - Login dengan akun Facebook Business
   - Buat aplikasi baru untuk WhatsApp Business

### **2. Konfigurasi WhatsApp Business API**

1. **Buat Aplikasi Baru**
   ```
   - Pilih "Business" sebagai tipe aplikasi
   - Masukkan nama aplikasi: "TPQ Baitus Shuffah"
   - Pilih kategori: "Education"
   ```

2. **Aktifkan WhatsApp Business API**
   ```
   - Di dashboard aplikasi, pilih "Add Product"
   - Pilih "WhatsApp Business API"
   - Ikuti wizard setup
   ```

3. **Dapatkan Kredensial**
   ```
   Access Token: EAAxxxxxxxxxx...
   Phone Number ID: 1234567890123456
   Business Account ID: 1234567890123456
   App Secret: xxxxxxxxxxxxxxxx
   ```

### **3. Setup Webhook**

1. **URL Webhook**
   ```
   https://yourdomain.com/api/whatsapp/webhook
   ```

2. **Verify Token**
   ```
   Buat token unik untuk verifikasi webhook
   Contoh: tpq_baitus_shuffah_webhook_2024
   ```

3. **Subscribe to Events**
   ```
   - messages
   - message_deliveries
   - message_reads
   ```

### **4. Verifikasi Nomor Telepon**

1. **Tambah Nomor Bisnis**
   - Masukkan nomor WhatsApp bisnis TPQ
   - Verifikasi dengan kode SMS/panggilan
   - Tunggu persetujuan dari WhatsApp

2. **Test Nomor**
   - Tambahkan nomor test untuk development
   - Gunakan nomor pribadi admin untuk testing

## 📧 **SETUP EMAIL SMTP**

### **1. Gmail SMTP (Recommended)**

1. **Aktifkan 2-Factor Authentication**
   ```
   - Buka Google Account Settings
   - Security > 2-Step Verification
   - Aktifkan 2FA
   ```

2. **Buat App Password**
   ```
   - Google Account > Security > App passwords
   - Pilih "Mail" dan "Other (custom name)"
   - Masukkan "TPQ Baitus Shuffah"
   - Salin password yang dihasilkan
   ```

3. **Konfigurasi SMTP**
   ```
   Host: smtp.gmail.com
   Port: 587
   Security: STARTTLS
   Username: admin@tpqbaitusshuffah.com
   Password: [App Password yang dihasilkan]
   ```

### **2. Outlook/Hotmail SMTP**

```
Host: smtp-mail.outlook.com
Port: 587
Security: STARTTLS
Username: admin@tpqbaitusshuffah.com
Password: [Password akun]
```

### **3. Custom SMTP (Hosting Provider)**

```
Host: mail.yourdomain.com
Port: 587 atau 465
Security: STARTTLS atau SSL
Username: admin@tpqbaitusshuffah.com
Password: [Password email]
```

## ⚙️ **KONFIGURASI SISTEM**

### **1. Akses Halaman Integrasi**

1. Login sebagai Admin
2. Buka menu **"Integrasi Sistem"** di sidebar
3. Atau akses langsung: `/dashboard/admin/settings/integrations`

### **2. Konfigurasi WhatsApp**

1. **Isi Form WhatsApp**
   ```
   Access Token: [Dari Facebook Developers]
   Phone Number ID: [Dari WhatsApp Business API]
   Business Account ID: [Dari Facebook Business]
   Webhook Verify Token: [Token buatan sendiri]
   App Secret: [Dari Facebook Developers]
   API Version: v18.0
   ```

2. **Simpan Konfigurasi**
   - Klik "Simpan Konfigurasi"
   - Tunggu konfirmasi berhasil

3. **Test Koneksi**
   - Klik "Test Koneksi"
   - Masukkan nomor WhatsApp untuk test
   - Periksa apakah pesan test diterima

### **3. Konfigurasi Email**

1. **Isi Form Email**
   ```
   SMTP Host: smtp.gmail.com
   SMTP Port: 587
   Email Address: admin@tpqbaitusshuffah.com
   Password: [App Password]
   From Name: TPQ Baitus Shuffah
   From Address: noreply@tpqbaitusshuffah.com
   ```

2. **Simpan Konfigurasi**
   - Klik "Simpan Konfigurasi"
   - Tunggu konfirmasi berhasil

3. **Test Koneksi**
   - Klik "Test Koneksi"
   - Periksa email test di inbox

## 🔒 **KEAMANAN & BEST PRACTICES**

### **1. Keamanan WhatsApp**

- **Jangan share Access Token** di tempat publik
- **Gunakan HTTPS** untuk webhook URL
- **Rotate token** secara berkala
- **Monitor usage** di Facebook Business Manager

### **2. Keamanan Email**

- **Gunakan App Password** bukan password utama
- **Aktifkan 2FA** pada akun email
- **Monitor login activity** secara berkala
- **Gunakan email khusus** untuk sistem

### **3. Environment Variables**

Untuk production, simpan kredensial di environment variables:

```env
# WhatsApp Configuration
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_verify_token
WHATSAPP_APP_SECRET=your_app_secret

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=admin@tpqbaitusshuffah.com
EMAIL_PASS=your_app_password
EMAIL_FROM_NAME=TPQ Baitus Shuffah
EMAIL_FROM_ADDRESS=noreply@tpqbaitusshuffah.com
```

## 🧪 **TESTING & TROUBLESHOOTING**

### **1. Test WhatsApp**

```bash
# Test via API
curl -X POST http://localhost:3000/api/whatsapp/test \
  -H "Content-Type: application/json" \
  -d '{"to": "628123456789", "message": "Test message"}'
```

### **2. Test Email**

```bash
# Test via API
curl -X PATCH http://localhost:3000/api/email/send \
  -H "Content-Type: application/json" \
  -d '{"to": "admin@example.com"}'
```

### **3. Common Issues**

**WhatsApp Issues:**
- ❌ **Invalid Access Token**: Periksa token di Facebook Developers
- ❌ **Phone Number Not Verified**: Verifikasi nomor di WhatsApp Business
- ❌ **Webhook Failed**: Periksa URL dan verify token

**Email Issues:**
- ❌ **Authentication Failed**: Periksa username/password
- ❌ **Connection Timeout**: Periksa host dan port
- ❌ **SSL/TLS Error**: Periksa pengaturan security

## 📊 **MONITORING & ANALYTICS**

### **1. Dashboard Monitoring**

- **WhatsApp Dashboard**: `/dashboard/admin/whatsapp`
- **Email Dashboard**: `/dashboard/admin/email`
- **Notification Dashboard**: `/dashboard/admin/notifications`

### **2. Log Monitoring**

- Periksa log sistem secara berkala
- Monitor delivery rate dan error rate
- Analisis performa pengiriman pesan

## 🎯 **FITUR YANG TERSEDIA**

### **1. Notifikasi Otomatis**

- ✅ **Payment Reminders** - Pengingat pembayaran SPP
- ✅ **Payment Confirmations** - Konfirmasi pembayaran
- ✅ **Attendance Alerts** - Notifikasi kehadiran
- ✅ **Hafalan Progress** - Laporan progress hafalan
- ✅ **Monthly Reports** - Laporan bulanan
- ✅ **System Announcements** - Pengumuman sistem

### **2. Bulk Messaging**

- ✅ **Bulk WhatsApp** - Kirim pesan massal via WhatsApp
- ✅ **Bulk Email** - Kirim email massal
- ✅ **Template Messages** - Pesan dengan template
- ✅ **Scheduled Messages** - Pesan terjadwal (coming soon)

### **3. Template Management**

- ✅ **Email Templates** - Kelola template email
- ✅ **WhatsApp Templates** - Template WhatsApp Business
- ✅ **Variable Replacement** - Dynamic content
- ✅ **Multi-language** - Support bahasa Indonesia

---

## 📞 **SUPPORT**

Jika mengalami kesulitan dalam setup, silakan hubungi:

- **Email**: support@tpqbaitusshuffah.com
- **WhatsApp**: +62 812-3456-7890
- **Documentation**: [Link to full documentation]

---

**© 2024 TPQ Baitus Shuffah - Sistem Manajemen Rumah Tahfidz**
