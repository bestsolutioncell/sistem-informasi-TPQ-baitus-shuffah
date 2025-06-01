# 🕐 **PANDUAN SETUP CRON JOB - AUTOMATED NOTIFICATION TRIGGERS**

Panduan lengkap untuk mengatur cron job untuk trigger notifikasi otomatis pada sistem TPQ Baitus Shuffah.

## 📋 **OVERVIEW**

Sistem notification triggers memungkinkan pengiriman notifikasi otomatis berdasarkan event dan jadwal tertentu:

- **Payment Due Reminders** - Pengingat pembayaran 3 hari sebelum jatuh tempo
- **Payment Overdue Notifications** - Notifikasi pembayaran terlambat
- **Birthday Reminders** - Ucapan ulang tahun untuk santri
- **Monthly Reports** - Laporan bulanan otomatis
- **Attendance Alerts** - Notifikasi ketidakhadiran
- **Hafalan Milestones** - Notifikasi pencapaian hafalan

## ⚙️ **SETUP CRON JOB**

### **1. Server Linux/Ubuntu**

#### **Edit Crontab**
```bash
# Edit crontab untuk user
crontab -e

# Atau edit crontab untuk root
sudo crontab -e
```

#### **Tambahkan Cron Jobs**
```bash
# Jalankan trigger notifikasi setiap hari jam 9:00 pagi
0 9 * * * curl -X POST -H "Authorization: Bearer your_cron_secret" https://yourdomain.com/api/cron/notifications

# Jalankan laporan bulanan setiap tanggal 1 jam 9:00 pagi
0 9 1 * * curl -X POST -H "Authorization: Bearer your_cron_secret" -H "Content-Type: application/json" -d '{"triggerType":"MONTHLY_REPORTS"}' https://yourdomain.com/api/notifications/triggers

# Backup: Jalankan trigger setiap 6 jam (jika ada yang terlewat)
0 */6 * * * curl -X POST -H "Authorization: Bearer your_cron_secret" https://yourdomain.com/api/cron/notifications
```

### **2. Windows Task Scheduler**

#### **Buat Task Baru**
1. Buka **Task Scheduler**
2. Klik **Create Basic Task**
3. Nama: "TPQ Notification Triggers"
4. Trigger: **Daily** at **9:00 AM**
5. Action: **Start a program**

#### **Program/Script**
```cmd
Program: curl.exe
Arguments: -X POST -H "Authorization: Bearer your_cron_secret" https://yourdomain.com/api/cron/notifications
```

### **3. Vercel Cron Jobs**

#### **vercel.json**
```json
{
  "crons": [
    {
      "path": "/api/cron/notifications",
      "schedule": "0 9 * * *"
    }
  ]
}
```

### **4. Netlify Functions**

#### **netlify.toml**
```toml
[build]
  functions = "netlify/functions"

[[plugins]]
  package = "@netlify/plugin-scheduled-functions"

[plugins.inputs]
  schedule = "0 9 * * *"
```

## 🔐 **KEAMANAN CRON JOB**

### **1. Environment Variables**

```env
# Set di production
CRON_SECRET=your_very_secure_random_secret_key_here_2024
```

### **2. Authorization Header**

```bash
# Gunakan Bearer token untuk autentikasi
curl -X POST \
  -H "Authorization: Bearer your_cron_secret" \
  -H "Content-Type: application/json" \
  https://yourdomain.com/api/cron/notifications
```

### **3. IP Whitelist (Optional)**

```javascript
// Di API route, tambahkan IP whitelist
const allowedIPs = ['127.0.0.1', 'your.server.ip'];
const clientIP = request.headers.get('x-forwarded-for') || 'unknown';

if (!allowedIPs.includes(clientIP)) {
  return NextResponse.json({ error: 'Unauthorized IP' }, { status: 403 });
}
```

## 📅 **JADWAL CRON YANG DIREKOMENDASIKAN**

### **1. Trigger Harian**
```bash
# Setiap hari jam 9:00 pagi
0 9 * * * curl -X POST -H "Authorization: Bearer $CRON_SECRET" $API_URL/api/cron/notifications
```

### **2. Trigger Mingguan**
```bash
# Setiap Senin jam 8:00 pagi (untuk laporan mingguan)
0 8 * * 1 curl -X POST -H "Authorization: Bearer $CRON_SECRET" -d '{"triggerType":"WEEKLY_REPORTS"}' $API_URL/api/notifications/triggers
```

### **3. Trigger Bulanan**
```bash
# Setiap tanggal 1 jam 9:00 pagi (untuk laporan bulanan)
0 9 1 * * curl -X POST -H "Authorization: Bearer $CRON_SECRET" -d '{"triggerType":"MONTHLY_REPORTS"}' $API_URL/api/notifications/triggers
```

### **4. Trigger Backup**
```bash
# Setiap 6 jam (backup jika ada yang terlewat)
0 */6 * * * curl -X POST -H "Authorization: Bearer $CRON_SECRET" $API_URL/api/cron/notifications
```

## 🧪 **TESTING CRON JOB**

### **1. Manual Test**

```bash
# Test trigger semua
curl -X POST \
  -H "Authorization: Bearer your_cron_secret" \
  -H "Content-Type: application/json" \
  https://yourdomain.com/api/cron/notifications

# Test trigger spesifik
curl -X POST \
  -H "Authorization: Bearer your_cron_secret" \
  -H "Content-Type: application/json" \
  -d '{"triggerType":"PAYMENT_DUE_REMINDERS"}' \
  https://yourdomain.com/api/notifications/triggers
```

### **2. Check Status**

```bash
# Cek status trigger
curl -X GET \
  -H "Authorization: Bearer your_cron_secret" \
  https://yourdomain.com/api/cron/notifications
```

### **3. Dashboard Monitoring**

- Akses: `/dashboard/admin/notifications/triggers`
- Monitor log eksekusi
- Lihat statistik trigger
- Jalankan trigger manual

## 📊 **MONITORING & LOGGING**

### **1. Log Files**

```bash
# Redirect output ke log file
0 9 * * * curl -X POST -H "Authorization: Bearer $CRON_SECRET" $API_URL/api/cron/notifications >> /var/log/tpq-cron.log 2>&1
```

### **2. Email Notifications**

```bash
# Kirim email jika cron gagal
0 9 * * * curl -X POST -H "Authorization: Bearer $CRON_SECRET" $API_URL/api/cron/notifications || echo "Cron job failed" | mail -s "TPQ Cron Failed" admin@tpqbaitusshuffah.com
```

### **3. Slack/Discord Webhook**

```bash
# Notifikasi ke Slack jika berhasil
0 9 * * * curl -X POST -H "Authorization: Bearer $CRON_SECRET" $API_URL/api/cron/notifications && curl -X POST -H 'Content-type: application/json' --data '{"text":"TPQ notification triggers completed successfully"}' YOUR_SLACK_WEBHOOK_URL
```

## 🔧 **TROUBLESHOOTING**

### **1. Cron Job Tidak Jalan**

```bash
# Cek status cron service
sudo systemctl status cron

# Restart cron service
sudo systemctl restart cron

# Cek log cron
sudo tail -f /var/log/cron.log
```

### **2. API Endpoint Error**

```bash
# Test manual dengan verbose
curl -v -X POST \
  -H "Authorization: Bearer your_cron_secret" \
  https://yourdomain.com/api/cron/notifications
```

### **3. Permission Issues**

```bash
# Pastikan user memiliki permission
chmod +x /path/to/script.sh

# Atau jalankan sebagai root
sudo crontab -e
```

## 📱 **INTEGRATION DENGAN HOSTING PROVIDERS**

### **1. Vercel**

```json
{
  "functions": {
    "app/api/cron/notifications.js": {
      "maxDuration": 300
    }
  },
  "crons": [
    {
      "path": "/api/cron/notifications",
      "schedule": "0 9 * * *"
    }
  ]
}
```

### **2. Netlify**

```javascript
// netlify/functions/scheduled-notifications.js
exports.handler = async (event, context) => {
  const response = await fetch(`${process.env.URL}/api/cron/notifications`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.CRON_SECRET}`
    }
  });
  
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Cron job executed' })
  };
};
```

### **3. Railway/Heroku**

```bash
# Heroku Scheduler
heroku addons:create scheduler:standard
heroku addons:open scheduler

# Tambahkan job:
curl -X POST -H "Authorization: Bearer $CRON_SECRET" $API_URL/api/cron/notifications
```

## 🎯 **BEST PRACTICES**

### **1. Reliability**

- ✅ **Multiple Schedules** - Setup backup cron jobs
- ✅ **Error Handling** - Handle API failures gracefully
- ✅ **Monitoring** - Monitor execution logs
- ✅ **Alerting** - Setup failure notifications

### **2. Performance**

- ✅ **Timeout Settings** - Set appropriate timeouts
- ✅ **Rate Limiting** - Avoid overwhelming the system
- ✅ **Batch Processing** - Process in batches for large datasets
- ✅ **Resource Management** - Monitor memory and CPU usage

### **3. Security**

- ✅ **Secret Management** - Use secure secret keys
- ✅ **HTTPS Only** - Always use HTTPS endpoints
- ✅ **IP Whitelist** - Restrict access by IP if possible
- ✅ **Audit Logs** - Keep logs of all executions

---

## 📞 **SUPPORT**

Jika mengalami kesulitan dalam setup cron job, silakan hubungi:

- **Email**: support@tpqbaitusshuffah.com
- **WhatsApp**: +62 812-3456-7890
- **Documentation**: [Link to full documentation]

---

**© 2024 TPQ Baitus Shuffah - Automated Notification System**
