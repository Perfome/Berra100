// Particles Animation
function createParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: rgba(99, 102, 241, ${Math.random() * 0.5 + 0.3});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        container.appendChild(particle);
    }
}

const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% { transform: translate(0, 0); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        50% { transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px); }
    }
`;
document.head.appendChild(style);
createParticles();

// DOM Elements
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const messages = document.getElementById('messages');
const welcomeScreen = document.getElementById('welcomeScreen');
const chatMessages = document.getElementById('chatMessages');
const themeBtn = document.getElementById('themeBtn');
const clearBtn = document.getElementById('clearBtn');
const charCount = document.getElementById('charCount');
const totalCalc = document.getElementById('totalCalc');

let calcCount = 0;
let isDark = true;

// Character counter
messageInput.addEventListener('input', () => {
    charCount.textContent = messageInput.value.length;
    messageInput.style.height = 'auto';
    messageInput.style.height = messageInput.scrollHeight + 'px';
});

// Theme toggle
themeBtn.addEventListener('click', () => {
    isDark = !isDark;
    document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
});

// Clear chat
clearBtn.addEventListener('click', () => {
    messages.innerHTML = '';
    welcomeScreen.style.display = 'flex';
    calcCount = 0;
    totalCalc.textContent = '0';
});

// Tool buttons
document.querySelectorAll('.tool-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const symbol = btn.getAttribute('data-symbol');
        const start = messageInput.selectionStart;
        const text = messageInput.value;
        messageInput.value = text.substring(0, start) + symbol + text.substring(start);
        messageInput.focus();
        messageInput.selectionStart = messageInput.selectionEnd = start + symbol.length;
        charCount.textContent = messageInput.value.length;
    });
});

// Example tags
document.querySelectorAll('.example-tag').forEach(tag => {
    tag.addEventListener('click', () => {
        const cmd = tag.getAttribute('data-cmd');
        messageInput.value = cmd;
        charCount.textContent = cmd.length;
        sendMessage();
    });
});

// Menu buttons
document.querySelectorAll('.menu-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// Send message
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;

    // Hide welcome
    if (welcomeScreen.style.display !== 'none') {
        welcomeScreen.style.display = 'none';
    }

    // Add user message
    addMessage(text, 'user');
    messageInput.value = '';
    charCount.textContent = '0';
    messageInput.style.height = 'auto';

    // Process and respond
    setTimeout(() => {
        const response = processMessage(text);
        addMessage(response, 'ai');
        calcCount++;
        totalCalc.textContent = calcCount;
    }, 500);
}

function processMessage(text) {
    const lower = text.toLowerCase();

    // İNTEGRAL
    if (lower.includes('integral') || lower.includes('∫')) {
        const expr = extractExpression(text, ['integral', '∫']);
        const result = mathEngine.integral(expr);
        return formatResult('İntegral', expr, result);
    }

    // TÜREV
    if (lower.includes('turev') || lower.includes('türev') || lower.includes('derivative')) {
        const expr = extractExpression(text, ['turev', 'türev', 'derivative']);
        const result = mathEngine.derivative(expr);
        return formatResult('Türev', expr, result);
    }

    // LİMİT
    if (lower.includes('limit') || lower.includes('lim')) {
        const match = text.match(/limit\s+(.+?),?\s*x->(\S+)/i) || 
                      text.match(/lim\s*\((.+?)\).*?x->(\S+)/i);
        if (match) {
            const expr = match[1].trim();
            const point = match[2].trim();
            const result = mathEngine.limit(expr, point);
            return formatResult('Limit', `lim(x→${point}) ${expr}`, result);
        }
    }

    // DENKLEM ÇÖZME
    if (lower.includes('coz') || lower.includes('çöz') || lower.includes('solve') || text.includes('=')) {
        const eqMatch = text.match(/[x\d\s\+\-\*\^()]+=[^=]+/);
        if (eqMatch) {
            const equation = eqMatch[0].trim();
            const result = mathEngine.solve(equation);
            return formatResult('Denklem Çözümü', equation, result);
        }
    }

    // SADELEŞTİRME
    if (lower.includes('sadeleştir') || lower.includes('sadles') || lower.includes('simplify')) {
        const expr = extractExpression(text, ['sadeleştir', 'sadles', 'simplify']);
        const result = mathEngine.simplify(expr);
        return formatResult('Sadeleştirme', expr, result);
    }

    // ÇARPANLARA AYIRMA
    if (lower.includes('çarpanlar') || lower.includes('carpanlar') || lower.includes('factor')) {
        const expr = extractExpression(text, ['çarpanlar', 'carpanlar', 'factor']);
        const result = mathEngine.factor(expr);
        return formatResult('Çarpanlara Ayırma', expr, result);
    }

    // AÇILIM
    if (lower.includes('açılım') || lower.includes('acilim') || lower.includes('expand')) {
        const expr = extractExpression(text, ['açılım', 'acilim', 'expand']);
        const result = mathEngine.expand(expr);
        return formatResult('Açılım', expr, result);
    }

    // GENEL CEVAP
    return `
        <strong>Merhaba! Ben MathGenius AI 🤖</strong>
        <br><br>
        <strong>Yapabileceklerim:</strong><br>
        ∫ <strong>İntegral:</strong> "integral x^2" veya "∫ x^2"<br>
        d/dx <strong>Türev:</strong> "turev sin(x)"<br>
        lim <strong>Limit:</strong> "limit sin(x)/x, x->0"<br>
        = <strong>Denklem:</strong> "coz x^2-5x+6=0"<br>
        ⊕ <strong>Sadeleştir:</strong> "sadeleştir (x^2-4)/(x-2)"<br>
        ✕ <strong>Çarpanlar:</strong> "çarpanlar x^2-9"<br>
        + <strong>Açılım:</strong> "acilim (x+2)(x+3)"<br>
        <br>
        <strong>Örnek sor ve çözelim!</strong> 🚀
    `;
}

function extractExpression(text, keywords) {
    let expr = text;
    for (let kw of keywords) {
        const idx = expr.toLowerCase().indexOf(kw.toLowerCase());
        if (idx !== -1) {
            expr = expr.substring(idx + kw.length).trim();
            break;
        }
    }
    return expr.replace(/^:\s*/, '').replace(/dx\s*$/, '').trim();
}

function formatResult(title, question, result) {
    if (result.error) {
        return `
            <div class="result-box" style="border-left-color: #ef4444; background: rgba(239, 68, 68, 0.1);">
                <h4 style="color: #ef4444;">❌ ${title}</h4>
                <p><strong>Soru:</strong> ${question}</p>
                <p><strong>Hata:</strong> ${result.error}</p>
            </div>
        `;
    }

    let html = `
        <div class="result-box">
            <h4>✅ ${title}</h4>
            <p><strong>Soru:</strong> ${question}</p>
            <p><strong>Sonuç:</strong> <code>${result.result}</code></p>
    `;

    if (result.steps && result.steps.length > 0) {
        html += '<div class="steps"><strong>Çözüm Adımları:</strong>';
        for (let step of result.steps) {
            html += `<div class="step">${step}</div>`;
        }
        html += '</div>';
    }

    html += '</div>';
    return html;
}

function addMessage(content, type) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${type}`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = type === 'user' ? '👤' : '🤖';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = content;

    msgDiv.appendChild(avatar);
    msgDiv.appendChild(contentDiv);
    messages.appendChild(msgDiv);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

console.log('%c🚀 MathGenius AI Hazır!', 'color: #6366f1; font-size: 20px; font-weight: bold;');
console.log('%c✅ Matematik motoru çalışıyor!', 'color: #10b981; font-size: 14px;');
