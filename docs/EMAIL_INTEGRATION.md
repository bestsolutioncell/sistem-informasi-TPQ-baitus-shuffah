# 📧 Email Integration - Rumah Tahfidz

Dokumentasi lengkap untuk integrasi Email SMTP dalam sistem manajemen rumah tahfidz.

## 🚀 **Overview**

Email Integration memungkinkan sistem untuk:
- Mengirim email otomatis ke wali santri dan stakeholder
- Memberikan laporan progress hafalan via email
- Mengirim invoice dan konfirmasi pembayaran
- Menyediakan newsletter dan pengumuman
- Mengirim notifikasi kehadiran dan laporan bulanan

## 📋 **Features**

### 1. **Automated Email Notifications**
- ✅ **Welcome Email**: Email selamat datang untuk pengguna baru
- ✅ **Hafalan Progress**: Laporan kemajuan hafalan santri
- ✅ **Monthly Reports**: Laporan bulanan komprehensif
- ✅ **Payment Invoices**: Invoice pembayaran SPP dan donasi
- ✅ **Payment Confirmations**: Konfirmasi pembayaran berhasil
- ✅ **Attendance Notifications**: Pemberitahuan kehadiran santri

### 2. **Email Templates**
- ✅ **Professional Design**: Template email dengan desain Islamic yang elegan
- ✅ **Responsive Layout**: Template yang responsive untuk semua device
- ✅ **Dynamic Content**: Konten yang dapat disesuaikan dengan data
- ✅ **Multi-language Support**: Dukungan bahasa Indonesia dan Arab

### 3. **Email Management**
- ✅ **Bulk Email**: Kirim email ke multiple recipients
- ✅ **Email Logs**: Tracking status pengiriman email
- ✅ **Statistics**: Analytics delivery rate dan engagement
- ✅ **Template Management**: Kelola template email

### 4. **SMTP Integration**
- ✅ **Multiple Providers**: Support Gmail, Outlook, dan SMTP lainnya
- ✅ **Secure Connection**: TLS/SSL encryption
- ✅ **Authentication**: OAuth2 dan App Password support
- ✅ **Error Handling**: Robust error handling dan retry logic

## 🛠 **Setup & Configuration**

### 1. **SMTP Configuration**

#### **Gmail Setup (Recommended)**
1. **Enable 2-Factor Authentication** di akun Gmail Anda
2. **Generate App Password**:
   - Buka Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate password untuk "Mail"
3. **Use App Password** sebagai SMTP_PASS

#### **Other Email Providers**
- **Outlook/Hotmail**: smtp-mail.outlook.com:587
- **Yahoo**: smtp.mail.yahoo.com:587
- **Custom SMTP**: Sesuai dengan provider Anda

### 2. **Environment Variables**

Tambahkan konfigurasi berikut ke file `.env`:

```env
# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=noreply@rumahtahfidz.com

# Email Templates
EMAIL_TEMPLATE_WELCOME=true
EMAIL_TEMPLATE_HAFALAN=true
EMAIL_TEMPLATE_PAYMENT=true
EMAIL_TEMPLATE_ATTENDANCE=true
```

### 3. **Database Migration**

Jalankan migration untuk membuat tabel email logs:

```bash
npx prisma db push
```

Tabel yang akan dibuat:
- `email_logs`: Log email yang dikirim dengan status tracking

## 📧 **Usage**

### 1. **Sending Emails Programmatically**

```typescript
import { emailService } from '@/lib/email';

// Send welcome email
const result = await emailService.sendWelcomeEmail(
  'user@example.com',
  'Ahmad Fauzi',
  'SANTRI'
);

// Send hafalan progress
const result = await emailService.sendHafalanProgressReport(
  'parent@example.com',
  'Ahmad Fauzi',
  {
    surah: 'Al-Baqarah',
    progress: 75,
    grade: 88,
    notes: 'Sangat baik, terus semangat!',
    musyrif: 'Ustadz Abdullah',
    date: '2024-01-15'
  }
);

// Send monthly report
const result = await emailService.sendMonthlyReport(
  'parent@example.com',
  'Ahmad Fauzi',
  {
    month: 'Januari',
    year: 2024,
    attendanceRate: 95,
    hafalanProgress: 75,
    currentSurah: 'Al-Baqarah',
    averageGrade: 88,
    totalHafalan: 5,
    achievements: ['Menyelesaikan Juz 1', 'Nilai terbaik bulan ini'],
    recommendations: ['Tingkatkan muraja\'ah', 'Fokus pada tajwid']
  }
);
```

### 2. **Email API Endpoints**

```bash
# Send email
POST /api/email/send
{
  "type": "hafalan_progress",
  "recipientId": "student_id",
  "data": {
    "surah": "Al-Baqarah",
    "progress": 75,
    "grade": 88,
    "notes": "Sangat baik!",
    "musyrif": "Ustadz Abdullah",
    "date": "2024-01-15"
  }
}

# Get email statistics
GET /api/email/stats?period=30

# Get email logs
GET /api/email/logs?page=1&limit=20&status=SENT

# Test email connection
POST /api/email/test
{
  "email": "test@example.com",
  "subject": "Test Email",
  "message": "Test message content"
}
```

### 3. **Email Templates**

#### **Available Templates:**
1. **welcome** - Email selamat datang
2. **hafalan_progress** - Laporan progress hafalan
3. **monthly_report** - Laporan bulanan
4. **payment_invoice** - Invoice pembayaran
5. **payment_confirmation** - Konfirmasi pembayaran
6. **attendance_notification** - Notifikasi kehadiran
7. **newsletter** - Newsletter dan pengumuman

#### **Template Features:**
- **Islamic Design**: Gradient teal dengan elemen Islamic
- **Responsive**: Optimal di desktop dan mobile
- **Professional**: Layout yang clean dan mudah dibaca
- **Branded**: Konsisten dengan identitas Rumah Tahfidz

## 📊 **Monitoring & Analytics**

### 1. **Email Logs**

Monitor email melalui admin dashboard:
- Status pengiriman (Sent, Failed, Pending)
- Timestamp pengiriman
- Recipient information
- Error messages untuk troubleshooting

### 2. **Statistics**

Track performa email:
- Total emails sent
- Success rate
- Failure rate
- Template usage statistics
- Daily/weekly trends

### 3. **API Endpoints**

```bash
# Get email statistics
GET /api/email/stats?period=30

# Get email logs with filters
GET /api/email/logs?status=SENT&template=hafalan_progress

# Test SMTP connection
GET /api/email/test

# Clean old logs
DELETE /api/email/logs?days=30
```

## 🔧 **Troubleshooting**

### 1. **Common Issues**

#### **Emails Not Sending**
- Check SMTP credentials
- Verify App Password (for Gmail)
- Check firewall/network restrictions
- Verify email provider settings

#### **Authentication Failed**
- Use App Password instead of regular password
- Enable 2-Factor Authentication
- Check SMTP host and port
- Verify TLS/SSL settings

#### **Emails Going to Spam**
- Setup SPF records
- Configure DKIM
- Use reputable email provider
- Avoid spam trigger words

### 2. **Debug Mode**

Enable debug logging:

```env
DEBUG=email:*
LOG_LEVEL=debug
```

### 3. **Test Connection**

```bash
# Test SMTP connection
curl -X GET /api/email/test

# Send test email
curl -X POST /api/email/test \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "subject": "Test Email",
    "message": "Test message"
  }'
```

## 📚 **Email Templates Preview**

### 1. **Welcome Email Template**

```html
🕌 Assalamu'alaikum
Selamat Datang di Rumah Tahfidz Baitus Shuffah

Bismillahirrahmanirrahim,
Selamat datang Ahmad Fauzi!

Alhamdulillah, akun Anda sebagai SANTRI telah berhasil dibuat.

🎯 Fitur yang Tersedia:
• 📖 Manajemen hafalan Al-Quran
• 📅 Sistem absensi digital
• 💳 Pembayaran online
• 📊 Laporan progress real-time

[Masuk ke Sistem]

Barakallahu fiikum,
Tim Rumah Tahfidz Baitus Shuffah
```

### 2. **Hafalan Progress Template**

```html
📖 Laporan Hafalan
Rumah Tahfidz Baitus Shuffah

Assalamu'alaikum Warahmatullahi Wabarakatuh,

👤 Santri: Ahmad Fauzi
📖 Surah: Al-Baqarah
📊 Progress: 75%
⭐ Nilai: 88
👨‍🏫 Musyrif: Ustadz Abdullah
📅 Tanggal: 15 Januari 2024

📝 Catatan Musyrif:
Alhamdulillah, kemajuan yang sangat baik. 
Terus semangat dalam menghafal Al-Quran.

Barakallahu fiikum,
Tim Rumah Tahfidz Baitus Shuffah
```

### 3. **Monthly Report Template**

```html
📊 Laporan Bulanan - Januari 2024
Rumah Tahfidz Baitus Shuffah

👤 Santri: Ahmad Fauzi

📈 Statistik Bulan Ini:
• Kehadiran: 95%
• Progress Hafalan: 75%
• Rata-rata Nilai: 88
• Hafalan Selesai: 5

📖 Surah Saat Ini: Al-Baqarah

🏆 Pencapaian:
• Menyelesaikan Juz 1
• Nilai terbaik bulan ini

💡 Rekomendasi:
• Tingkatkan muraja'ah
• Fokus pada tajwid

Barakallahu fiikum,
Tim Rumah Tahfidz Baitus Shuffah
```

## 🔐 **Security**

### 1. **Email Security**
- Use App Passwords instead of regular passwords
- Enable TLS/SSL encryption
- Secure storage untuk SMTP credentials
- Rate limiting untuk prevent spam

### 2. **Data Privacy**
- Email log retention policy (30 hari default)
- Anonymize sensitive data dalam logs
- GDPR compliance untuk data handling
- Opt-out mechanism untuk newsletters

### 3. **Authentication**
- OAuth2 support untuk modern authentication
- App Password untuk legacy authentication
- Multi-factor authentication support
- Secure credential management

## 📈 **Best Practices**

### 1. **Email Content**
- Gunakan bahasa yang sopan dan profesional
- Include Islamic greetings dan doa
- Provide value dalam setiap email
- Keep content concise dan relevant

### 2. **Delivery Optimization**
- Send emails pada waktu yang tepat
- Avoid peak hours untuk better delivery
- Use proper subject lines
- Implement retry logic untuk failed emails

### 3. **Template Management**
- Keep templates updated dan relevant
- Test templates across different email clients
- Use responsive design
- Maintain consistent branding

## 🚀 **Future Enhancements**

- [ ] Email scheduling dan delayed sending
- [ ] Advanced email analytics dan tracking
- [ ] Email campaign management
- [ ] A/B testing untuk email templates
- [ ] Integration dengan email marketing tools
- [ ] Advanced personalization
- [ ] Email automation workflows
- [ ] Multi-language template support

---

**Barakallahu fiikum** - Semoga integrasi Email ini memudahkan komunikasi dengan wali santri dan meningkatkan kualitas layanan rumah tahfidz 📧🤲
