#!/bin/bash

# סקריפט דחיפה לשרת dev.bflow.co.il
# Usage: ./scripts/deploy.sh [environment]

set -e

# צבעים לפלט יפה
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# פונקציות עזר
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# קריאת קונפיגורציה
ENVIRONMENT=${1:-production}
CONFIG_FILE="deploy.config.js"

if [ ! -f "$CONFIG_FILE" ]; then
    log_error "קובץ הקונפיגורציה $CONFIG_FILE לא נמצא"
    exit 1
fi

# הגדרות בסיסיות (ניתנות לעדכון בהתאם לשרת שלך)
SERVER_HOST="95.179.254.156"
SERVER_USER="ploi"
SERVER_PATH="/home/ploi/dev.bflow.co.il"
SSH_KEY_PATH="$HOME/.ssh/ploi_dev_bflow"

log_info "מתחיל תהליך דחיפה לשרת $SERVER_HOST..."

# בדיקת חיבור SSH
log_info "בודק חיבור SSH..."
if ! ssh -i "$SSH_KEY_PATH" -o ConnectTimeout=10 -o BatchMode=yes "$SERVER_USER@$SERVER_HOST" exit 2>/dev/null; then
    log_error "לא ניתן להתחבר לשרת. בדוק את הגדרות ה-SSH"
    log_info "הפעל: ./scripts/setup-ssh.sh"
    exit 1
fi
log_success "חיבור SSH מוכשר"

# בניית הפרויקט
log_info "בונה את הפרויקט..."
npm run build

if [ $? -ne 0 ]; then
    log_error "שגיאה בבניית הפרויקט"
    exit 1
fi
log_success "בניית הפרויקט הושלמה"

# יצירת ארכיון
log_info "יוצר ארכיון לדחיפה..."
DEPLOY_DIR="deploy-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$DEPLOY_DIR"

# העתקת קבצים נדרשים
cp -r .next "$DEPLOY_DIR/"
cp -r public "$DEPLOY_DIR/" 2>/dev/null || true
cp package.json "$DEPLOY_DIR/"
cp package-lock.json "$DEPLOY_DIR/" 2>/dev/null || true
cp next.config.js "$DEPLOY_DIR/"

# יצירת תיקיית data אם לא קיימת
mkdir -p "$DEPLOY_DIR/data"

# יצירת ארכיון
tar -czf "${DEPLOY_DIR}.tar.gz" "$DEPLOY_DIR"
rm -rf "$DEPLOY_DIR"

log_success "ארכיון נוצר: ${DEPLOY_DIR}.tar.gz"

# העלאה לשרת
log_info "מעלה קבצים לשרת..."
scp -i "$SSH_KEY_PATH" "${DEPLOY_DIR}.tar.gz" "$SERVER_USER@$SERVER_HOST:/tmp/"

if [ $? -ne 0 ]; then
    log_error "שגיאה בהעלאת הקבצים"
    exit 1
fi

# פריסה בשרת
log_info "מבצע פריסה בשרת..."
ssh -i "$SSH_KEY_PATH" "$SERVER_USER@$SERVER_HOST" << EOF
    set -e
    
    echo "🔄 עוצר שירותים..."
    sudo systemctl stop dev-platform 2>/dev/null || true
    
    echo "📦 חולץ קבצים..."
    cd /tmp
    tar -xzf ${DEPLOY_DIR}.tar.gz
    
    echo "🔄 מעדכן קבצים..."
    mkdir -p $SERVER_PATH
    cp -r ${DEPLOY_DIR}/* $SERVER_PATH/
    sudo chown -R $SERVER_USER:$SERVER_USER $SERVER_PATH
    
    echo "📦 מתקין dependencies..."
    cd $SERVER_PATH
    npm ci --only=production
    
    echo "🔄 מפעיל שירותים..."
    sudo systemctl start dev-platform
    sudo systemctl enable dev-platform
    
    echo "🧹 מנקה קבצים זמניים..."
    rm -rf /tmp/${DEPLOY_DIR}*
    
    echo "✅ פריסה הושלמה בהצלחה!"
EOF

if [ $? -eq 0 ]; then
    log_success "פריסה הושלמה בהצלחה!"
    log_info "האתר זמין בכתובת: https://$SERVER_HOST"
else
    log_error "שגיאה בתהליך הפריסה"
    exit 1
fi

# ניקוי קבצים מקומיים
rm -f "${DEPLOY_DIR}.tar.gz"

# בדיקת תקינות
log_info "בודק תקינות האתר..."
sleep 5
if curl -f -s "https://dev.bflow.co.il" > /dev/null; then
    log_success "האתר פועל תקין!"
else
    log_warning "יתכן שהאתר לא פועל כראוי. בדוק את הלוגים בשרת"
fi

log_success "תהליך הדחיפה הושלם!"
echo ""
echo "🚀 האתר שלך זמין בכתובת: https://dev.bflow.co.il"
echo "📊 לצפייה בלוגים: ssh -i $SSH_KEY_PATH $SERVER_USER@$SERVER_HOST 'sudo journalctl -u dev-platform -f'"
