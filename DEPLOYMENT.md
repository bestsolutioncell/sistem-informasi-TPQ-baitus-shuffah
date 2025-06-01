# 🚀 Deployment Guide - Rumah Tahfidz Management System

Panduan lengkap untuk deployment sistem ke production environment.

## 📋 Pre-Deployment Checklist

### ✅ System Requirements
- [ ] Node.js 18+ installed
- [ ] PostgreSQL 15+ database
- [ ] Redis server (optional, for caching)
- [ ] SSL certificates configured
- [ ] Domain name configured
- [ ] Email SMTP credentials
- [ ] Payment gateway credentials (Midtrans)
- [ ] File storage credentials (Cloudinary)

### ✅ Environment Configuration
- [ ] Production environment variables configured
- [ ] Database connection tested
- [ ] External services tested (email, payment, storage)
- [ ] Security settings reviewed
- [ ] Backup strategy implemented

## 🔧 Environment Variables

### Required Variables
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/rumah_tahfidz_prod"

# Authentication
NEXTAUTH_SECRET="your-super-secret-nextauth-key-for-production"
NEXTAUTH_URL="https://yourdomain.com"
JWT_SECRET="your-super-secret-jwt-key-for-production"

# Application
NODE_ENV="production"
APP_URL="https://yourdomain.com"
APP_NAME="Rumah Tahfidz Baitus Shuffah"
```

### Optional Services
```env
# Email Service
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
EMAIL_FROM="noreply@yourdomain.com"

# WhatsApp Business API
WHATSAPP_API_URL="https://graph.facebook.com/v18.0"
WHATSAPP_ACCESS_TOKEN="your-whatsapp-access-token"
WHATSAPP_PHONE_NUMBER_ID="your-phone-number-id"

# Payment Gateway (Midtrans)
MIDTRANS_SERVER_KEY="your-midtrans-server-key"
MIDTRANS_CLIENT_KEY="your-midtrans-client-key"
MIDTRANS_IS_PRODUCTION="true"

# File Storage (Cloudinary)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
```

## 🐳 Docker Deployment (Recommended)

### 1. Prepare Environment
```bash
# Clone repository
git clone https://github.com/yourusername/rumah-tahfidz.git
cd rumah-tahfidz

# Copy environment file
cp .env.production .env.local
# Edit .env.local with your production values
```

### 2. Deploy with Docker Compose
```bash
# Build and start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f app
```

### 3. Initialize Database
```bash
# Run database migrations
docker-compose exec app npx prisma db push

# Seed initial data (optional)
docker-compose exec app npx tsx prisma/seed.ts
```

### 4. Verify Deployment
```bash
# Health check
curl https://yourdomain.com/api/health

# Test comprehensive functionality
curl -X POST https://yourdomain.com/api/test/comprehensive
```

## 🖥️ Manual Deployment

### 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Install Nginx
sudo apt install nginx

# Install PM2 for process management
npm install -g pm2
```

### 2. Database Setup
```bash
# Create database user
sudo -u postgres createuser --interactive

# Create database
sudo -u postgres createdb rumah_tahfidz_prod

# Configure PostgreSQL
sudo nano /etc/postgresql/15/main/postgresql.conf
sudo nano /etc/postgresql/15/main/pg_hba.conf

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### 3. Application Deployment
```bash
# Clone and setup application
git clone https://github.com/yourusername/rumah-tahfidz.git
cd rumah-tahfidz

# Install dependencies
npm ci --only=production

# Setup environment
cp .env.production .env.local
# Edit .env.local with your values

# Generate Prisma client
npx prisma generate

# Build application
npm run build

# Setup database
npx prisma db push

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 4. Nginx Configuration
```nginx
# /etc/nginx/sites-available/rumah-tahfidz
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/ssl/certs/yourdomain.crt;
    ssl_certificate_key /etc/ssl/private/yourdomain.key;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔒 Security Configuration

### 1. SSL/TLS Setup
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 2. Firewall Configuration
```bash
# Configure UFW
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 3. Security Headers
```nginx
# Add to Nginx server block
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

## 📊 Monitoring & Maintenance

### 1. Health Monitoring
```bash
# Setup monitoring script
cat > /usr/local/bin/health-check.sh << 'EOF'
#!/bin/bash
HEALTH_URL="https://yourdomain.com/api/health"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL)

if [ $RESPONSE -ne 200 ]; then
    echo "Health check failed: $RESPONSE"
    # Send alert (email, Slack, etc.)
fi
EOF

chmod +x /usr/local/bin/health-check.sh

# Add to crontab
echo "*/5 * * * * /usr/local/bin/health-check.sh" | crontab -
```

### 2. Log Management
```bash
# Setup log rotation
sudo nano /etc/logrotate.d/rumah-tahfidz

# Content:
/home/app/rumah-tahfidz/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 app app
}
```

### 3. Backup Strategy
```bash
# Database backup script
cat > /usr/local/bin/backup-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups/database"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

pg_dump -h localhost -U username rumah_tahfidz_prod > $BACKUP_DIR/backup_$DATE.sql
gzip $BACKUP_DIR/backup_$DATE.sql

# Keep only last 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
EOF

chmod +x /usr/local/bin/backup-db.sh

# Schedule daily backup
echo "0 2 * * * /usr/local/bin/backup-db.sh" | crontab -
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Database Connection Error
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection
psql -h localhost -U username -d rumah_tahfidz_prod

# Check logs
sudo tail -f /var/log/postgresql/postgresql-15-main.log
```

#### 2. Application Not Starting
```bash
# Check PM2 status
pm2 status

# View application logs
pm2 logs app

# Restart application
pm2 restart app
```

#### 3. SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Test Nginx configuration
sudo nginx -t
```

#### 4. Performance Issues
```bash
# Check system resources
htop
df -h
free -m

# Check application performance
curl -w "@curl-format.txt" -o /dev/null -s https://yourdomain.com/api/health
```

## 📈 Performance Optimization

### 1. Database Optimization
```sql
-- Add indexes for better performance
CREATE INDEX idx_santri_status ON santri(status);
CREATE INDEX idx_hafalan_santri_id ON hafalan(santri_id);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_payments_status ON payments(status);
```

### 2. Caching Strategy
```bash
# Install Redis
sudo apt install redis-server

# Configure Redis
sudo nano /etc/redis/redis.conf
# Set: maxmemory 256mb
# Set: maxmemory-policy allkeys-lru

sudo systemctl restart redis-server
```

### 3. CDN Configuration
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['res.cloudinary.com'],
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/your-cloud-name/image/fetch/',
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

## 🎯 Post-Deployment Checklist

- [ ] All services running correctly
- [ ] Health checks passing
- [ ] SSL certificate valid
- [ ] Database accessible
- [ ] Email notifications working
- [ ] Payment gateway functional
- [ ] File uploads working
- [ ] Monitoring alerts configured
- [ ] Backup system operational
- [ ] Performance metrics baseline established
- [ ] Documentation updated
- [ ] Team notified of deployment

## 📞 Support

For deployment support:
- 📧 Email: devops@rumahtahfidz.com
- 💬 Slack: #deployment-support
- 📚 Wiki: https://wiki.rumahtahfidz.com/deployment

---

**Happy Deploying! 🚀**
