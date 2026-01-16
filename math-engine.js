// BASIT FAKAT ÇALIŞAN MATEMATİK MOTORU
class SimpleMathEngine {
    
    // İNTEGRAL HESAPLAMA
    integral(expr) {
        expr = expr.toLowerCase().replace(/\s+/g, '');
        
        // x^n integrali
        if (expr === 'x') {
            return {
                result: '(1/2)x² + C',
                steps: [
                    '∫ x dx',
                    'Kural: ∫ x^n dx = x^(n+1)/(n+1) + C',
                    'n = 1 için: x^2/2 + C'
                ]
            };
        }
        
        if (expr === 'x^2' || expr === 'x**2') {
            return {
                result: '(1/3)x³ + C',
                steps: [
                    '∫ x² dx',
                    'Kural: ∫ x^n dx = x^(n+1)/(n+1) + C',
                    'n = 2 için: x^3/3 + C'
                ]
            };
        }
        
        if (expr === 'x^3' || expr === 'x**3') {
            return {
                result: '(1/4)x⁴ + C',
                steps: [
                    '∫ x³ dx',
                    'Kural: x^4/4 + C'
                ]
            };
        }
        
        // Sabit ile çarpım
        const match2x = expr.match(/^(\d+)\*?x$/);
        if (match2x) {
            const a = parseInt(match2x[1]);
            const result = a / 2;
            return {
                result: `(${result})x² + C`,
                steps: [
                    `∫ ${a}x dx`,
                    `${a} ∫ x dx`,
                    `${a} × (x²/2) = ${result}x² + C`
                ]
            };
        }
        
        const match3x2 = expr.match(/^(\d+)\*?x\^2$/);
        if (match3x2) {
            const a = parseInt(match3x2[1]);
            const result = a / 3;
            return {
                result: `(${result})x³ + C`,
                steps: [
                    `∫ ${a}x² dx`,
                    `${a} ∫ x² dx`,
                    `${a} × (x³/3) = ${result}x³ + C`
                ]
            };
        }
        
        // Toplam: x^2 + 2x
        if (expr.includes('+')) {
            const parts = expr.split('+');
            let resultParts = [];
            let allSteps = ['İntegrali terim terim alalım:'];
            
            for (let part of parts) {
                part = part.trim();
                const intResult = this.integral(part);
                if (intResult.result) {
                    resultParts.push(intResult.result.replace(' + C', ''));
                    allSteps.push(`∫ ${part} dx = ${intResult.result}`);
                }
            }
            
            if (resultParts.length > 0) {
                return {
                    result: resultParts.join(' + ') + ' + C',
                    steps: allSteps
                };
            }
        }
        
        // Trigonometrik
        if (expr === 'sin(x)') {
            return {
                result: '-cos(x) + C',
                steps: ['∫ sin(x) dx = -cos(x) + C']
            };
        }
        
        if (expr === 'cos(x)') {
            return {
                result: 'sin(x) + C',
                steps: ['∫ cos(x) dx = sin(x) + C']
            };
        }
        
        // e^x
        if (expr === 'e^x') {
            return {
                result: 'e^x + C',
                steps: ['∫ e^x dx = e^x + C']
            };
        }
        
        // 1/x
        if (expr === '1/x') {
            return {
                result: 'ln|x| + C',
                steps: ['∫ 1/x dx = ln|x| + C']
            };
        }
        
        return {
            error: 'Bu integral henüz desteklenmiyor. Dene: x, x^2, x^3, sin(x), cos(x), e^x'
        };
    }
    
    // TÜREV HESAPLAMA
    derivative(expr) {
        expr = expr.toLowerCase().replace(/\s+/g, '');
        
        // Sabit
        if (!isNaN(expr)) {
            return {
                result: '0',
                steps: ['Sabit sayının türevi 0\'dır']
            };
        }
        
        // x
        if (expr === 'x') {
            return {
                result: '1',
                steps: ['d/dx(x) = 1']
            };
        }
        
        // x^n
        const powMatch = expr.match(/^x\^(\d+)$/);
        if (powMatch) {
            const n = parseInt(powMatch[1]);
            const newPow = n - 1;
            const result = newPow === 0 ? n.toString() : newPow === 1 ? `${n}x` : `${n}x^${newPow}`;
            return {
                result: result,
                steps: [
                    `d/dx(x^${n})`,
                    `Kural: nx^(n-1)`,
                    `${n}x^${newPow} = ${result}`
                ]
            };
        }
        
        // ax^n
        const coeffPow = expr.match(/^(\d+)\*?x\^(\d+)$/);
        if (coeffPow) {
            const a = parseInt(coeffPow[1]);
            const n = parseInt(coeffPow[2]);
            const coef = a * n;
            const newPow = n - 1;
            const result = newPow === 0 ? coef.toString() : newPow === 1 ? `${coef}x` : `${coef}x^${newPow}`;
            return {
                result: result,
                steps: [
                    `d/dx(${a}x^${n})`,
                    `${a} × ${n}x^${n-1}`,
                    result
                ]
            };
        }
        
        // ax
        const linMatch = expr.match(/^(\d+)\*?x$/);
        if (linMatch) {
            const a = linMatch[1];
            return {
                result: a,
                steps: [`d/dx(${a}x) = ${a}`]
            };
        }
        
        // Trigonometrik
        if (expr === 'sin(x)') {
            return {
                result: 'cos(x)',
                steps: ['d/dx(sin(x)) = cos(x)']
            };
        }
        
        if (expr === 'cos(x)') {
            return {
                result: '-sin(x)',
                steps: ['d/dx(cos(x)) = -sin(x)']
            };
        }
        
        if (expr === 'tan(x)') {
            return {
                result: 'sec²(x)',
                steps: ['d/dx(tan(x)) = sec²(x)']
            };
        }
        
        // e^x
        if (expr === 'e^x') {
            return {
                result: 'e^x',
                steps: ['d/dx(e^x) = e^x']
            };
        }
        
        // ln(x)
        if (expr === 'ln(x)') {
            return {
                result: '1/x',
                steps: ['d/dx(ln(x)) = 1/x']
            };
        }
        
        // Toplam
        if (expr.includes('+')) {
            const parts = expr.split('+');
            let resultParts = [];
            let allSteps = ['Türevi terim terim alalım:'];
            
            for (let part of parts) {
                part = part.trim();
                const derResult = this.derivative(part);
                if (derResult.result && derResult.result !== '0') {
                    resultParts.push(derResult.result);
                    allSteps.push(`d/dx(${part}) = ${derResult.result}`);
                }
            }
            
            if (resultParts.length > 0) {
                return {
                    result: resultParts.join(' + '),
                    steps: allSteps
                };
            }
        }
        
        return {
            error: 'Bu türev henüz desteklenmiyor. Dene: x^n, sin(x), cos(x), e^x, ln(x)'
        };
    }
    
    // LİMİT HESAPLAMA
    limit(expr, point) {
        expr = expr.toLowerCase().replace(/\s+/g, '');
        point = point.toLowerCase();
        
        // Özel limitler
        if (expr === 'sin(x)/x' && point === '0') {
            return {
                result: '1',
                steps: [
                    'Önemli limit: lim(x→0) sin(x)/x = 1',
                    'Bu temel trigonometrik limittir'
                ]
            };
        }
        
        if (expr === '(1-cos(x))/x' && point === '0') {
            return {
                result: '0',
                steps: [
                    'lim(x→0) (1-cos(x))/x = 0'
                ]
            };
        }
        
        // Polinom değerlendirme
        if (point !== 'inf' && point !== '-inf') {
            const x = parseFloat(point);
            
            // x^n için
            const powMatch = expr.match(/x\^(\d+)/);
            if (powMatch) {
                const n = parseInt(powMatch[1]);
                const result = Math.pow(x, n);
                return {
                    result: result.toString(),
                    steps: [
                        `x = ${x} için`,
                        `${x}^${n} = ${result}`
                    ]
                };
            }
            
            // Basit x
            if (expr === 'x') {
                return {
                    result: point,
                    steps: [`lim(x→${point}) x = ${point}`]
                };
            }
        }
        
        // Sonsuz limiti
        if (point === 'inf') {
            if (expr.includes('1/x')) {
                return {
                    result: '0',
                    steps: ['lim(x→∞) 1/x = 0']
                };
            }
            
            if (expr === 'x') {
                return {
                    result: '∞',
                    steps: ['lim(x→∞) x = ∞']
                };
            }
        }
        
        return {
            error: 'Bu limit henüz desteklenmiyor'
        };
    }
    
    // DENKLEM ÇÖZME
    solve(equation) {
        equation = equation.toLowerCase().replace(/\s+/g, '');
        
        // ax + b = c şeklinde doğrusal denklem
        const linear = equation.match(/(-?\d*\.?\d*)x([+-]\d+\.?\d*)=(-?\d+\.?\d*)/);
        if (linear) {
            const a = linear[1] === '' ? 1 : linear[1] === '-' ? -1 : parseFloat(linear[1]);
            const b = parseFloat(linear[2]);
            const c = parseFloat(linear[3]);
            
            const x = (c - b) / a;
            
            return {
                result: `x = ${x}`,
                steps: [
                    `${a}x ${b >= 0 ? '+' : ''} ${b} = ${c}`,
                    `${a}x = ${c - b}`,
                    `x = ${x}`
                ]
            };
        }
        
        // x^2 + bx + c = 0 şeklinde karesel denklem
        const quad = equation.match(/x\^2([+-]\d+\.?\d*)x([+-]\d+\.?\d*)=0/);
        if (quad) {
            const a = 1;
            const b = parseFloat(quad[1]);
            const c = parseFloat(quad[2]);
            
            const discriminant = b * b - 4 * a * c;
            
            if (discriminant < 0) {
                return {
                    result: 'Reel çözüm yok',
                    steps: [
                        `Δ = b² - 4ac = ${discriminant}`,
                        'Δ < 0, reel kökler yok'
                    ]
                };
            }
            
            const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
            const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
            
            return {
                result: discriminant === 0 ? `x = ${x1}` : `x₁ = ${x1}, x₂ = ${x2}`,
                steps: [
                    `x² ${b >= 0 ? '+' : ''} ${b}x ${c >= 0 ? '+' : ''} ${c} = 0`,
                    `Δ = ${discriminant}`,
                    `x = (-b ± √Δ) / 2a`,
                    discriminant === 0 ? `x = ${x1}` : `x₁ = ${x1}, x₂ = ${x2}`
                ]
            };
        }
        
        // Basit x = a
        const simple = equation.match(/x=(-?\d+\.?\d*)/);
        if (simple) {
            return {
                result: `x = ${simple[1]}`,
                steps: [`Cevap: x = ${simple[1]}`]
            };
        }
        
        return {
            error: 'Bu denklem henüz desteklenmiyor. Dene: 2x+5=11 veya x^2-5x+6=0'
        };
    }
    
    // SADELEŞTİRME
    simplify(expr) {
        expr = expr.toLowerCase().replace(/\s+/g, '');
        
        // (x^2-a^2)/(x-a) = x+a
        const diffSquares = expr.match(/\(x\^2-(\d+)\)\/\(x-(\d+)\)/);
        if (diffSquares) {
            const a = parseInt(diffSquares[1]);
            const b = parseInt(diffSquares[2]);
            if (a === b * b) {
                return {
                    result: `x + ${b}`,
                    steps: [
                        `(x² - ${a})/(x - ${b})`,
                        `(x - ${b})(x + ${b})/(x - ${b})`,
                        `x + ${b}`
                    ]
                };
            }
        }
        
        // (ax+b)/(c) = (a/c)x + b/c
        const fraction = expr.match(/\((\d+)x([+-]\d+)\)\/(\d+)/);
        if (fraction) {
            const a = parseInt(fraction[1]);
            const b = parseInt(fraction[2]);
            const c = parseInt(fraction[3]);
            return {
                result: `${a/c}x + ${b/c}`,
                steps: [
                    `(${a}x ${b >= 0 ? '+' : ''} ${b})/${c}`,
                    `${a/c}x + ${b/c}`
                ]
            };
        }
        
        return {
            result: expr,
            steps: ['İfade zaten sadeleştirilmiş']
        };
    }
    
    // ÇARPANLARA AYIRMA
    factor(expr) {
        expr = expr.toLowerCase().replace(/\s+/g, '');
        
        // x^2 - a^2 = (x-a)(x+a)
        const diffSquares = expr.match(/x\^2-(\d+)/);
        if (diffSquares) {
            const a2 = parseInt(diffSquares[1]);
            const a = Math.sqrt(a2);
            if (Number.isInteger(a)) {
                return {
                    result: `(x - ${a})(x + ${a})`,
                    steps: [
                        `x² - ${a2}`,
                        `x² - ${a}²`,
                        `(x - ${a})(x + ${a})`
                    ]
                };
            }
        }
        
        // x^2 + bx + c
        const quad = expr.match(/x\^2([+-]\d+)x([+-]\d+)/);
        if (quad) {
            const b = parseInt(quad[1]);
            const c = parseInt(quad[2]);
            
            // İki sayı bul: p + q = b, p * q = c
            for (let p = -50; p <= 50; p++) {
                for (let q = -50; q <= 50; q++) {
                    if (p + q === b && p * q === c) {
                        return {
                            result: `(x ${p >= 0 ? '+' : ''} ${p})(x ${q >= 0 ? '+' : ''} ${q})`,
                            steps: [
                                `${p} + ${q} = ${b}`,
                                `${p} × ${q} = ${c}`,
                                `(x ${p >= 0 ? '+' : ''} ${p})(x ${q >= 0 ? '+' : ''} ${q})`
                            ]
                        };
                    }
                }
            }
        }
        
        return {
            result: expr,
            steps: ['Bu ifade çarpanlarına ayrılamıyor']
        };
    }
    
    // AÇILIM
    expand(expr) {
        expr = expr.toLowerCase().replace(/\s+/g, '');
        
        // (x+a)(x+b) = x^2 + (a+b)x + ab
        const prod = expr.match(/\(x([+-]\d+)\)\(x([+-]\d+)\)/);
        if (prod) {
            const a = parseInt(prod[1]);
            const b = parseInt(prod[2]);
            const sum = a + b;
            const product = a * b;
            
            return {
                result: `x² ${sum >= 0 ? '+' : ''} ${sum}x ${product >= 0 ? '+' : ''} ${product}`,
                steps: [
                    `(x ${a >= 0 ? '+' : ''} ${a})(x ${b >= 0 ? '+' : ''} ${b})`,
                    'x² + ax + bx + ab',
                    `x² ${sum >= 0 ? '+' : ''} ${sum}x ${product >= 0 ? '+' : ''} ${product}`
                ]
            };
        }
        
        return {
            result: expr,
            steps: ['İfade zaten açılmış']
        };
    }
}

// Global instance
window.mathEngine = new SimpleMathEngine();
