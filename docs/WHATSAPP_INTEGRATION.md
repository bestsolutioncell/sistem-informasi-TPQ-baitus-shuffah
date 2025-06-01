# 📱 WhatsApp Integration - Rumah Tahfidz

Dokumentasi lengkap untuk integrasi WhatsApp Business API dalam sistem manajemen rumah tahfidz.

## 🚀 **Overview**

WhatsApp Integration memungkinkan sistem untuk:
- Mengirim notifikasi otomatis ke wali santri
- Memberikan laporan progress hafalan
- Mengirim pengingat pembayaran
- Menyediakan layanan customer service otomatis
- Mengirim laporan bulanan

## 📋 **Features**

### 1. **Automated Notifications**
- ✅ **Hafalan Progress**: Notifikasi ketika santri menyelesaikan hafalan
- ✅ **Attendance Alerts**: Pemberitahuan ketika santri tidak hadir
- ✅ **Payment Reminders**: Pengingat pembayaran SPP dan donasi
- ✅ **Monthly Reports**: Laporan bulanan untuk wali santri

### 2. **Manual Messaging**
- ✅ **Bulk Messages**: Kirim pesan ke multiple recipients
- ✅ **Custom Templates**: Template pesan yang dapat disesuaikan
- ✅ **Media Support**: Kirim gambar, dokumen, dan audio
- ✅ **Message Tracking**: Tracking status delivery dan read

### 3. **Auto-Response System**
- ✅ **FAQ Responses**: Jawaban otomatis untuk pertanyaan umum
- ✅ **Schedule Information**: Informasi jadwal otomatis
- ✅ **Contact Information**: Informasi kontak dan alamat
- ✅ **Payment Information**: Informasi rekening pembayaran

## 🛠 **Setup & Configuration**

### 1. **WhatsApp Business API Setup**

#### **Step 1: Create Facebook Business Account**
1. Buka [Facebook Business Manager](https://business.facebook.com)
2. Buat akun bisnis baru atau gunakan yang sudah ada
3. Verifikasi akun bisnis Anda

#### **Step 2: Setup WhatsApp Business API**
1. Buka [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)
2. Buat aplikasi baru di Facebook Developers
3. Tambahkan WhatsApp Business API ke aplikasi
4. Dapatkan Phone Number ID dan Access Token

#### **Step 3: Configure Webhook**
1. Set webhook URL: `https://yourdomain.com/api/whatsapp/webhook`
2. Set verify token sesuai dengan `WHATSAPP_WEBHOOK_VERIFY_TOKEN`
3. Subscribe ke events: `messages`, `message_deliveries`, `message_reads`

### 2. **Environment Variables**

Tambahkan konfigurasi berikut ke file `.env`:

```env
# WhatsApp Business API
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_TEST_PHONE=6281234567890
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_verify_token
WHATSAPP_WEBHOOK_SECRET=your_webhook_secret

# Cron Jobs
CRON_SECRET=your_cron_secret
```

### 3. **Database Migration**

Jalankan migration untuk membuat tabel WhatsApp:

```bash
npx prisma db push
```

Tabel yang akan dibuat:
- `whatsapp_logs`: Log pesan yang dikirim
- `whatsapp_incoming`: Log pesan yang diterima

## 📱 **Usage**

### 1. **Sending Messages Programmatically**

```typescript
import { whatsappService } from '@/lib/whatsapp';

// Send text message
const result = await whatsappService.sendTextMessage(
  '6281234567890',
  'Hello from Rumah Tahfidz!'
);

// Send hafalan progress
const result = await whatsappService.sendHafalanProgressToParent(
  '6281234567890',
  'Ahmad Fauzi',
  'Al-Baqarah',
  75,
  88
);

// Send payment reminder
const result = await whatsappService.sendPaymentReminder(
  '6281234567890',
  'Ahmad Fauzi',
  'SPP Januari 2024',
  300000,
  '2024-01-31'
);
```

### 2. **Automation Rules**

```typescript
import { whatsappAutomation } from '@/lib/whatsapp-automation';

// Process hafalan completion
await whatsappAutomation.processHafalanCompleted(
  'hafalan_id',
  'student_id',
  85
);

// Process attendance absence
await whatsappAutomation.processAttendanceAbsent(
  'student_id',
  '2024-01-15'
);

// Process payment due
await whatsappAutomation.processPaymentDue();

// Process monthly report
await whatsappAutomation.processMonthlyReport();
```

### 3. **Manual Notifications via API**

```bash
# Send hafalan progress notification
curl -X POST /api/whatsapp/send \
  -H "Content-Type: application/json" \
  -d '{
    "type": "hafalan_progress",
    "recipientId": "student_id",
    "data": {
      "surah": "Al-Baqarah",
      "progress": 75,
      "grade": 88
    }
  }'

# Send attendance notification
curl -X POST /api/whatsapp/send \
  -H "Content-Type: application/json" \
  -d '{
    "type": "attendance_notification",
    "recipientId": "student_id",
    "data": {
      "status": "ALPHA",
      "date": "2024-01-15",
      "time": "08:00"
    }
  }'
```

## 🔄 **Cron Jobs**

### 1. **Setup Cron Jobs**

Untuk production, setup cron jobs untuk menjalankan notifikasi otomatis:

```bash
# Daily notifications (8 AM)
0 8 * * * curl -X POST https://yourdomain.com/api/cron/whatsapp-notifications \
  -H "Authorization: Bearer your_cron_secret" \
  -H "Content-Type: application/json" \
  -d '{"type": "daily"}'

# Weekly notifications (Monday 8 AM)
0 8 * * 1 curl -X POST https://yourdomain.com/api/cron/whatsapp-notifications \
  -H "Authorization: Bearer your_cron_secret" \
  -H "Content-Type: application/json" \
  -d '{"type": "weekly"}'

# Monthly notifications (1st day 8 AM)
0 8 1 * * curl -X POST https://yourdomain.com/api/cron/whatsapp-notifications \
  -H "Authorization: Bearer your_cron_secret" \
  -H "Content-Type: application/json" \
  -d '{"type": "monthly"}'

# Payment reminders (9 AM and 3 PM)
0 9,15 * * * curl -X POST https://yourdomain.com/api/cron/whatsapp-notifications \
  -H "Authorization: Bearer your_cron_secret" \
  -H "Content-Type: application/json" \
  -d '{"type": "payment_reminders"}'
```

### 2. **Vercel Cron (Alternative)**

Jika menggunakan Vercel, tambahkan ke `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/whatsapp-notifications",
      "schedule": "0 8 * * *"
    }
  ]
}
```

## 📊 **Monitoring & Analytics**

### 1. **Message Logs**

Akses logs melalui admin dashboard:
- Status delivery (Sent, Delivered, Read, Failed)
- Timestamp pengiriman dan pembacaan
- Recipient information
- Message content dan type

### 2. **Statistics**

Monitor performa WhatsApp:
- Total messages sent
- Delivery rate
- Read rate
- Failure rate
- Response time analytics

### 3. **API Endpoints**

```bash
# Get WhatsApp logs
GET /api/whatsapp/logs?page=1&limit=20&status=DELIVERED

# Get WhatsApp statistics
GET /api/whatsapp/stats?period=30

# Test WhatsApp connection
POST /api/whatsapp/test

# Get cron status
GET /api/cron/whatsapp-notifications
```

## 🔧 **Troubleshooting**

### 1. **Common Issues**

#### **Messages Not Sending**
- Check WhatsApp Business API credentials
- Verify phone number is registered
- Check rate limits (1000 messages per day for free tier)
- Verify webhook configuration

#### **Webhook Not Working**
- Ensure webhook URL is accessible
- Check webhook verify token
- Verify SSL certificate
- Check webhook signature validation

#### **Auto-responses Not Working**
- Check incoming message processing
- Verify phone number format
- Check automation rules configuration

### 2. **Debug Mode**

Enable debug logging:

```env
DEBUG=whatsapp:*
LOG_LEVEL=debug
```

### 3. **Test Connection**

```bash
# Test API connection
curl -X GET /api/whatsapp/test

# Send test message
curl -X POST /api/whatsapp/test \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "6281234567890",
    "message": "Test message"
  }'
```

## 📚 **Message Templates**

### 1. **Hafalan Progress Template**

```
🕌 *Laporan Hafalan - Rumah Tahfidz Baitus Shuffah*

👤 *Santri:* {{student_name}}
📖 *Surah:* {{surah_name}}
📊 *Progress:* {{progress}}%
⭐ *Nilai:* {{grade}}

Alhamdulillah, putra/putri Anda menunjukkan kemajuan yang baik dalam menghafal Al-Quran.

Barakallahu fiikum 🤲

_Pesan otomatis dari Sistem Rumah Tahfidz_
```

### 2. **Attendance Notification Template**

```
🕌 *Notifikasi Kehadiran - Rumah Tahfidz Baitus Shuffah*

👤 *Santri:* {{student_name}}
📅 *Tanggal:* {{date}}
🕐 *Waktu:* {{time}}
{{status_emoji}} *Status:* {{status}}

{{status_message}}

Barakallahu fiikum 🤲

_Pesan otomatis dari Sistem Rumah Tahfidz_
```

### 3. **Payment Reminder Template**

```
🕌 *Pengingat Pembayaran - Rumah Tahfidz Baitus Shuffah*

👤 *Santri:* {{student_name}}
💳 *Jenis:* {{payment_type}}
💰 *Jumlah:* Rp {{amount}}
📅 *Jatuh Tempo:* {{due_date}}

Mohon untuk melakukan pembayaran sebelum tanggal jatuh tempo.

Untuk pembayaran dapat melalui:
🏦 Transfer Bank
💳 E-Wallet
🏪 Datang langsung ke kantor

Barakallahu fiikum 🤲

_Pesan otomatis dari Sistem Rumah Tahfidz_
```

## 🔐 **Security**

### 1. **Webhook Security**
- Verify webhook signature menggunakan webhook secret
- Validate incoming requests
- Rate limiting untuk webhook endpoints

### 2. **API Security**
- Secure storage untuk access tokens
- Environment variables untuk credentials
- HTTPS untuk semua communications

### 3. **Data Privacy**
- Log retention policy (30 hari default)
- Anonymize sensitive data dalam logs
- GDPR compliance untuk data handling

## 📈 **Best Practices**

### 1. **Message Frequency**
- Jangan spam users dengan terlalu banyak pesan
- Implement rate limiting
- Respect user preferences

### 2. **Content Guidelines**
- Gunakan bahasa yang sopan dan profesional
- Include opt-out instructions
- Provide value dalam setiap pesan

### 3. **Error Handling**
- Implement retry logic untuk failed messages
- Log errors untuk debugging
- Graceful degradation jika WhatsApp tidak available

## 🚀 **Future Enhancements**

- [ ] WhatsApp Business Catalog integration
- [ ] Interactive buttons dan quick replies
- [ ] Voice message support
- [ ] WhatsApp Pay integration
- [ ] Chatbot dengan AI/NLP
- [ ] Multi-language support
- [ ] Advanced analytics dashboard

---

**Barakallahu fiikum** - Semoga integrasi WhatsApp ini memudahkan komunikasi dengan wali santri dan meningkatkan kualitas layanan rumah tahfidz 📱🤲
