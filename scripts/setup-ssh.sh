#!/bin/bash

# סקריפט הגדרת SSH לדחיפה לשרת dev.bflow.co.il
# Usage: ./scripts/setup-ssh.sh

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

log_input() {
    echo -e "${YELLOW}📝 $1${NC}"
}

# הגדרות
SSH_KEY_PATH="$HOME/.ssh/bflow_deploy"
SSH_CONFIG_PATH="$HOME/.ssh/config"

log_info "מגדיר SSH לשרת dev.bflow.co.il..."

# יצירת תיקיית SSH אם לא קיימת
mkdir -p "$HOME/.ssh"
chmod 700 "$HOME/.ssh"

# בדיקה אם המפתח כבר קיים
if [ -f "$SSH_KEY_PATH" ]; then
    log_warning "מפתח SSH כבר קיים ב-$SSH_KEY_PATH"
    read -p "האם ברצונך ליצור מפתח חדש? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "משתמש במפתח הקיים"
    else
        rm -f "$SSH_KEY_PATH" "$SSH_KEY_PATH.pub"
        log_info "מפתח קיים נמחק"
    fi
fi

# יצירת מפתח SSH אם לא קיים
if [ ! -f "$SSH_KEY_PATH" ]; then
    log_info "יוצר מפתח SSH חדש..."
    ssh-keygen -t ed25519 -f "$SSH_KEY_PATH" -N "" -C "dev-platform-deploy-$(date +%Y%m%d)"
    
    if [ $? -eq 0 ]; then
        log_success "מפתח SSH נוצר בהצלחה"
        chmod 600 "$SSH_KEY_PATH"
        chmod 644 "$SSH_KEY_PATH.pub"
    else
        log_error "שגיאה ביצירת מפתח SSH"
        exit 1
    fi
fi

# קריאת הגדרות שרת
log_input "הזן את כתובת השרת (ברירת מחדל: dev.bflow.co.il):"
read -r SERVER_HOST
SERVER_HOST=${SERVER_HOST:-dev.bflow.co.il}

log_input "הזן את שם המשתמש בשרת (ברירת מחדל: deploy):"
read -r SERVER_USER
SERVER_USER=${SERVER_USER:-deploy}

log_input "הזן את הפורט (ברירת מחדל: 22):"
read -r SERVER_PORT
SERVER_PORT=${SERVER_PORT:-22}

# הוספת הגדרה ל-SSH config
log_info "מעדכן קובץ SSH config..."

# יצירת backup של config אם קיים
if [ -f "$SSH_CONFIG_PATH" ]; then
    cp "$SSH_CONFIG_PATH" "$SSH_CONFIG_PATH.backup.$(date +%Y%m%d-%H%M%S)"
fi

# הסרת הגדרה קיימת אם יש
if [ -f "$SSH_CONFIG_PATH" ]; then
    sed -i '/# dev.bflow.co.il deployment/,/^$/d' "$SSH_CONFIG_PATH"
fi

# הוספת הגדרה חדשה
cat >> "$SSH_CONFIG_PATH" << EOF

# dev.bflow.co.il deployment
Host dev.bflow.co.il bflow-deploy
    HostName $SERVER_HOST
    User $SERVER_USER
    Port $SERVER_PORT
    IdentityFile $SSH_KEY_PATH
    IdentitiesOnly yes
    StrictHostKeyChecking no
    UserKnownHostsFile /dev/null
    LogLevel ERROR

EOF

log_success "קובץ SSH config עודכן"

# הצגת המפתח הציבורי
log_info "המפתח הציבורי שלך:"
echo "----------------------------------------"
cat "$SSH_KEY_PATH.pub"
echo "----------------------------------------"

echo ""
log_warning "כעת עליך להעתיק את המפתח הציבורי לשרת!"
echo ""
echo "📋 העתק את המפתח למעלה והדבק אותו בשרת בדרכים הבאות:"
echo ""
echo "1️⃣  בכניסה לשרת כroot או sudo:"
echo "   ssh $SERVER_USER@$SERVER_HOST"
echo "   mkdir -p ~/.ssh"
echo "   echo 'המפתח_הציבורי' >> ~/.ssh/authorized_keys"
echo "   chmod 600 ~/.ssh/authorized_keys"
echo "   chmod 700 ~/.ssh"
echo ""
echo "2️⃣  או באמצעות ssh-copy-id:"
echo "   ssh-copy-id -i $SSH_KEY_PATH.pub $SERVER_USER@$SERVER_HOST"
echo ""

# בדיקת חיבור
log_input "האם השלמת את העתקת המפתח לשרת? (y/N):"
read -p "" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    log_info "בודק חיבור SSH..."
    
    if ssh -i "$SSH_KEY_PATH" -o ConnectTimeout=10 "$SERVER_USER@$SERVER_HOST" exit 2>/dev/null; then
        log_success "חיבור SSH פועל תקין!"
        echo ""
        log_info "כעת תוכל להשתמש בפקודות הבאות:"
        echo "• לדחיפה לשרת: ./scripts/deploy.sh"
        echo "• לחיבור לשרת: ssh bflow-deploy"
        echo ""
    else
        log_error "חיבור SSH נכשל"
        echo ""
        log_info "נסה את הפקודות הבאות לפתרון בעיות:"
        echo "• ssh -vvv -i $SSH_KEY_PATH $SERVER_USER@$SERVER_HOST"
        echo "• בדוק שהמפתח הועתק נכון לשרת"
        echo "• בדוק שפורט $SERVER_PORT פתוח בשרת"
    fi
else
    log_info "בדיקת החיבור תוכל להתבצע מאוחר יותר"
    echo "להפעלת הבדיקה: ssh -i $SSH_KEY_PATH $SERVER_USER@$SERVER_HOST"
fi

# יצירת קובץ תזכורת
cat > ssh-setup-info.txt << EOF
SSH Setup Information for dev.bflow.co.il
========================================

Date: $(date)
SSH Key: $SSH_KEY_PATH
Public Key: $SSH_KEY_PATH.pub
Server: $SERVER_HOST
User: $SERVER_USER
Port: $SERVER_PORT

Commands:
---------
Deploy: ./scripts/deploy.sh
Connect: ssh bflow-deploy
Test: ssh -i $SSH_KEY_PATH $SERVER_USER@$SERVER_HOST

Public Key Content:
------------------
$(cat "$SSH_KEY_PATH.pub")

EOF

log_success "הגדרת SSH הושלמה!"
log_info "מידע נשמר בקובץ: ssh-setup-info.txt"

