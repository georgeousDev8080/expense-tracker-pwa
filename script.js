class ExpenseTracker {
    constructor() {
        try {
            // Safe localStorage access with error handling
            this.expenses = this.safeLoadExpenses();
            this.currentFilter = 'all';
            this.currentLanguage = localStorage.getItem('language') || 'en';
            this.currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            this.selectedExpenses = new Set();
            
            this.translations = {
                en: {
                    categories: {
                        food: 'Food & Dining',
                        transport: 'Transportation',
                        entertainment: 'Entertainment',
                        shopping: 'Shopping',
                        bills: 'Bills & Utilities',
                        healthcare: 'Healthcare',
                        education: 'Education',
                        other: 'Other'
                    },
                    messages: {
                        expenseAdded: 'Expense added successfully!',
                        expenseDeleted: 'Expense deleted successfully!',
                        expensesDeleted: 'Selected expenses deleted!',
                        noExpensesSelected: 'No expenses selected!',
                        reportExported: 'Report exported successfully!'
                    }
                },
                el: {
                    categories: {
                        food: 'Φαγητό & Εστιατόρια',
                        transport: 'Μεταφορές',
                        entertainment: 'Ψυχαγωγία',
                        shopping: 'Αγορές',
                        bills: 'Λογαριασμοί',
                        healthcare: 'Υγεία',
                        education: 'Εκπαίδευση',
                        other: 'Άλλα'
                    },
                    messages: {
                        expenseAdded: 'Το έξοδο προστέθηκε επιτυχώς!',
                        expenseDeleted: 'Το έξοδο διαγράφηκε επιτυχώς!',
                        expensesDeleted: 'Τα επιλεγμένα έξοδα διαγράφηκαν!',
                        noExpensesSelected: 'Δεν έχουν επιλεγεί έξοδα!',
                        reportExported: 'Η αναφορά εξήχθη επιτυχώς!'
                    }
                }
            };
            
            this.init();
        } catch (error) {
            console.error('Error initializing ExpenseTracker:', error);
            this.forceHideLoadingScreen();
        }
    }
    
    safeLoadExpenses() {
        try {
            const stored = localStorage.getItem('expenses');
            if (!stored) return [];
            
            const parsed = JSON.parse(stored);
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.error('Error loading expenses from localStorage:', error);
            // Clear corrupted data
            localStorage.removeItem('expenses');
            return [];
        }
    }
    
    forceHideLoadingScreen() {
        try {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
            }
        } catch (error) {
            console.error('Error hiding loading screen:', error);
        }
    }
    
    init() {
        try {
            this.setupEventListeners();
            this.setupIntersectionObserver();
            this.loadTheme();
            this.loadLanguage();
            this.renderExpenses();
            this.updateSummary();
            
            // Register service worker without blocking
            this.registerServiceWorker().catch(error => {
                console.warn('Service worker registration failed:', error);
            });
            
            // Always hide loading screen after maximum 2 seconds
            setTimeout(() => {
                this.forceHideLoadingScreen();
            }, 2000);
            
        } catch (error) {
            console.error('Error in init():', error);
            // Ensure loading screen is hidden even if init fails
            this.forceHideLoadingScreen();
        }
    }
    
    setupEventListeners() {
        try {
            // Form submission
            const form = document.getElementById('expenseForm');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.addExpense();
                });
            }
            
            // Theme toggle
            const themeToggle = document.getElementById('themeToggle');
            if (themeToggle) {
                themeToggle.addEventListener('click', () => {
                    this.toggleTheme();
                });
            }
            
            // Language toggle
            const langToggle = document.getElementById('langToggle');
            if (langToggle) {
                langToggle.addEventListener('click', () => {
                    this.toggleLanguage();
                });
            }
            
            // Export button
            const exportBtn = document.getElementById('exportBtn');
            if (exportBtn) {
                exportBtn.addEventListener('click', () => {
                    this.exportReport();
                });
            }
            
            // Filter buttons
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.setFilter(e.target.dataset.filter);
                });
            });
            
            // Delete selected button
            const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
            if (deleteSelectedBtn) {
                deleteSelectedBtn.addEventListener('click', () => {
                    this.deleteSelectedExpenses();
                });
            }
            
            // Add ripple effect to buttons
            document.querySelectorAll('.btn, .filter-btn').forEach(btn => {
                btn.addEventListener('click', this.createRipple);
            });
            
            // Form field focus effects
            document.querySelectorAll('.form-control').forEach(field => {
                field.addEventListener('focus', (e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(30, 58, 138, 0.1)';
                });
                
                field.addEventListener('blur', (e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                });
            });
        } catch (error) {
            console.error('Error setting up event listeners:', error);
        }
    }
    
    setupIntersectionObserver() {
        try {
            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }
                    });
                });
                
                document.querySelectorAll('.card').forEach(card => {
                    observer.observe(card);
                });
            }
        } catch (error) {
            console.error('Error setting up intersection observer:', error);
        }
    }
    
    createRipple(e) {
        try {
            const button = e.currentTarget;
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.6)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 600ms linear';
            ripple.style.pointerEvents = 'none';
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.remove();
                }
            }, 600);
        } catch (error) {
            console.error('Error creating ripple:', error);
        }
    }
    
    addExpense() {
        try {
            const description = document.getElementById('description')?.value?.trim();
            const amount = parseFloat(document.getElementById('amount')?.value);
            const category = document.getElementById('category')?.value;
            
            if (!description || !amount || !category || isNaN(amount)) {
                this.showToast('Please fill all fields correctly!', 'error');
                return;
            }
            
            const expense = {
                id: Date.now() + Math.random(),
                description,
                amount,
                category,
                date: new Date().toLocaleDateString(this.currentLanguage === 'el' ? 'el-GR' : 'en-US'),
                timestamp: Date.now()
            };
            
            this.expenses.unshift(expense);
            this.saveExpenses();
            this.renderExpenses();
            this.updateSummary();
            this.resetForm();
            
            this.showToast(this.translations[this.currentLanguage].messages.expenseAdded, 'success');
            this.createParticleExplosion();
            
            // Haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        } catch (error) {
            console.error('Error adding expense:', error);
            this.showToast('Error adding expense!', 'error');
        }
    }
    
    deleteExpense(id) {
        try {
            this.expenses = this.expenses.filter(expense => expense.id !== id);
            this.saveExpenses();
            this.renderExpenses();
            this.updateSummary();
            this.showToast(this.translations[this.currentLanguage].messages.expenseDeleted, 'success');
            
            if (navigator.vibrate) {
                navigator.vibrate([50, 50, 50]);
            }
        } catch (error) {
            console.error('Error deleting expense:', error);
            this.showToast('Error deleting expense!', 'error');
        }
    }
    
    deleteSelectedExpenses() {
        try {
            if (this.selectedExpenses.size === 0) {
                this.showToast(this.translations[this.currentLanguage].messages.noExpensesSelected, 'error');
                return;
            }
            
            this.expenses = this.expenses.filter(expense => !this.selectedExpenses.has(expense.id));
            this.selectedExpenses.clear();
            this.saveExpenses();
            this.renderExpenses();
            this.updateSummary();
            this.showToast(this.translations[this.currentLanguage].messages.expensesDeleted, 'success');
            
            if (navigator.vibrate) {
                navigator.vibrate([100, 50, 100]);
            }
        } catch (error) {
            console.error('Error deleting selected expenses:', error);
            this.showToast('Error deleting expenses!', 'error');
        }
    }
    
    toggleExpenseSelection(id) {
        try {
            if (this.selectedExpenses.has(id)) {
                this.selectedExpenses.delete(id);
            } else {
                this.selectedExpenses.add(id);
            }
            this.renderExpenses();
        } catch (error) {
            console.error('Error toggling expense selection:', error);
        }
    }
    
    setFilter(filter) {
        try {
            this.currentFilter = filter;
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.filter === filter);
            });
            this.renderExpenses();
        } catch (error) {
            console.error('Error setting filter:', error);
        }
    }
    
    getFilteredExpenses() {
        try {
            if (this.currentFilter === 'all') {
                return this.expenses;
            }
            return this.expenses.filter(expense => expense.category === this.currentFilter);
        } catch (error) {
            console.error('Error filtering expenses:', error);
            return [];
        }
    }
    
    renderExpenses() {
        try {
            const expensesList = document.getElementById('expensesList');
            if (!expensesList) return;
            
            const filteredExpenses = this.getFilteredExpenses();
            
            if (filteredExpenses.length === 0) {
                expensesList.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">📊</div>
                        <div class="empty-state-text" data-en="No expenses found" data-el="Δεν βρέθηκαν έξοδα">No expenses found</div>
                        <div class="empty-state-subtext" data-en="Add your first expense above to get started" data-el="Προσθέστε το πρώτο σας έξοδο παραπάνω για να ξεκινήσετε">Add your first expense above to get started</div>
                    </div>
                `;
                this.updateLanguageElements();
                return;
            }
            
            expensesList.innerHTML = filteredExpenses.map((expense, index) => `
                <div class="expense-item" style="animation-delay: ${index * 100}ms">
                    <div class="expense-info">
                        <div class="expense-description">${this.escapeHtml(expense.description)}</div>
                        <div class="expense-details">
                            ${this.translations[this.currentLanguage].categories[expense.category] || expense.category} • ${expense.date}
                        </div>
                    </div>
                    <div class="expense-amount">€${expense.amount.toFixed(2)}</div>
                    <div class="expense-actions">
                        <button class="btn btn-small ${this.selectedExpenses.has(expense.id) ? 'btn-secondary' : ''}" 
                                onclick="expenseTracker.toggleExpenseSelection(${expense.id})">
                            ${this.selectedExpenses.has(expense.id) ? '✓' : '☐'}
                        </button>
                        <button class="btn btn-danger btn-small" onclick="expenseTracker.deleteExpense(${expense.id})">
                            🗑️
                        </button>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error rendering expenses:', error);
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    updateSummary() {
        try {
            const total = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
            const count = this.expenses.length;
            
            this.animateCounter('totalAmount', total, (value) => `€${value.toFixed(2)}`);
            this.animateCounter('expenseCount', count);
        } catch (error) {
            console.error('Error updating summary:', error);
        }
    }
    
    animateCounter(elementId, targetValue, formatter = (value) => value) {
        try {
            const element = document.getElementById(elementId);
            if (!element) return;
            
            const startValue = 0;
            const duration = 1000;
            const startTime = Date.now();
            
            const updateCounter = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const currentValue = startValue + (targetValue - startValue) * this.easeOutQuart(progress);
                
                element.textContent = formatter(currentValue);
                element.classList.add('count-animation');
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    setTimeout(() => element.classList.remove('count-animation'), 500);
                }
            };
            
            updateCounter();
        } catch (error) {
            console.error('Error animating counter:', error);
        }
    }
    
    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }
    
    createParticleExplosion() {
        try {
            const explosion = document.createElement('div');
            explosion.className = 'particle-explosion';
            explosion.style.left = '50%';
            explosion.style.top = '50%';
            document.body.appendChild(explosion);
            
            for (let i = 0; i < 8; i++) {
                const particle = document.createElement('div');
                particle.className = 'explosion-particle';
                particle.style.setProperty('--random-x', (Math.random() - 0.5) * 200 + 'px');
                particle.style.setProperty('--random-y', (Math.random() - 0.5) * 200 + 'px');
                particle.style.left = '50%';
                particle.style.top = '50%';
                explosion.appendChild(particle);
            }
            
            setTimeout(() => {
                if (explosion.parentNode) {
                    explosion.remove();
                }
            }, 1000);
        } catch (error) {
            console.error('Error creating particle explosion:', error);
        }
    }
    
    toggleTheme() {
        try {
            this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            this.loadTheme();
            this.safeSetLocalStorage('theme', this.currentTheme);
        } catch (error) {
            console.error('Error toggling theme:', error);
        }
    }
    
    loadTheme() {
        try {
            document.documentElement.setAttribute('data-theme', this.currentTheme);
            const themeBtn = document.getElementById('themeToggle');
            const metaTheme = document.querySelector('meta[name="theme-color"]');
            
            if (themeBtn) {
                if (this.currentTheme === 'dark') {
                    themeBtn.innerHTML = '☀️ Light Mode';
                    themeBtn.setAttribute('data-en', '☀️ Light Mode');
                    themeBtn.setAttribute('data-el', '☀️ Φωτεινό Θέμα');
                } else {
                    themeBtn.innerHTML = '🌙 Dark Mode';
                    themeBtn.setAttribute('data-en', '🌙 Dark Mode');
                    themeBtn.setAttribute('data-el', '🌙 Σκοτεινό Θέμα');
                }
            }
            
            if (metaTheme) {
                metaTheme.setAttribute('content', this.currentTheme === 'dark' ? '#111827' : '#1e3a8a');
            }
            
            this.updateLanguageElements();
        } catch (error) {
            console.error('Error loading theme:', error);
        }
    }
    
    toggleLanguage() {
        try {
            this.currentLanguage = this.currentLanguage === 'en' ? 'el' : 'en';
            this.loadLanguage();
            this.safeSetLocalStorage('language', this.currentLanguage);
        } catch (error) {
            console.error('Error toggling language:', error);
        }
    }
    
    loadLanguage() {
        try {
            document.documentElement.setAttribute('lang', this.currentLanguage);
            this.updateLanguageElements();
            this.renderExpenses();
        } catch (error) {
            console.error('Error loading language:', error);
        }
    }
    
    updateLanguageElements() {
        try {
            document.querySelectorAll('[data-en]').forEach(element => {
                const key = this.currentLanguage === 'en' ? 'data-en' : 'data-el';
                const text = element.getAttribute(key);
                if (text) {
                    element.textContent = text;
                }
            });
            
            document.querySelectorAll('[data-en-placeholder]').forEach(element => {
                const key = this.currentLanguage === 'en' ? 'data-en-placeholder' : 'data-el-placeholder';
                const placeholder = element.getAttribute(key);
                if (placeholder) {
                    element.setAttribute('placeholder', placeholder);
                }
            });
        } catch (error) {
            console.error('Error updating language elements:', error);
        }
    }
    
    exportReport() {
        try {
            const total = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
            const categoryTotals = {};
            
            this.expenses.forEach(expense => {
                categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
            });
            
            const reportDate = new Date().toLocaleDateString(this.currentLanguage === 'el' ? 'el-GR' : 'en-US');
            const reportTitle = this.currentLanguage === 'en' ? 'Expense Report' : 'Αναφορά Εξόδων';
            
            const html = this.generateReportHTML(reportTitle, reportDate, total, categoryTotals);
            
            const blob = new Blob([html], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `expense-report-${reportDate.replace(/\//g, '-')}.html`;
            a.click();
            URL.revokeObjectURL(url);
            
            this.showToast(this.translations[this.currentLanguage].messages.reportExported, 'success');
        } catch (error) {
            console.error('Error exporting report:', error);
            this.showToast('Error exporting report!', 'error');
        }
    }
    
    generateReportHTML(reportTitle, reportDate, total, categoryTotals) {
        return `
<!DOCTYPE html>
<html lang="${this.currentLanguage}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${reportTitle} - ${reportDate}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #1e3a8a;
            min-height: 100vh;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #1e3a8a;
        }
        .header h1 {
            color: #1e3a8a;
            font-size: 2.5rem;
            margin: 0;
            font-weight: 700;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        .stat-card {
            background: #1e3a8a;
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }
        .stat-value {
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 5px;
        }
        .stat-label {
            font-size: 0.9rem;
            opacity: 0.9;
        }
        .categories {
            margin-bottom: 40px;
        }
        .category-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
        }
        .category-card {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #1e3a8a;
        }
        .category-name {
            font-weight: 600;
            color: #111827;
            margin-bottom: 5px;
        }
        .category-amount {
            font-size: 1.2rem;
            font-weight: 700;
            color: #1e3a8a;
        }
        .transactions {
            margin-top: 40px;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        .table th, .table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }
        .table th {
            background: #f9fafb;
            font-weight: 600;
            color: #111827;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            color: #6b7280;
            font-size: 0.9rem;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
        }
        @media (max-width: 768px) {
            .container { padding: 20px; }
            .stats { grid-template-columns: 1fr; }
            .category-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>💰 ${reportTitle}</h1>
            <p>${reportDate}</p>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <div class="stat-value">€${total.toFixed(2)}</div>
                <div class="stat-label">${this.currentLanguage === 'en' ? 'Total Spent' : 'Συνολικό Κόστος'}</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${this.expenses.length}</div>
                <div class="stat-label">${this.currentLanguage === 'en' ? 'Total Expenses' : 'Συνολικά Έξοδα'}</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">€${this.expenses.length ? (total / this.expenses.length).toFixed(2) : '0.00'}</div>
                <div class="stat-label">${this.currentLanguage === 'en' ? 'Average Expense' : 'Μέσος Όρος'}</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">€${this.expenses.length ? Math.max(...this.expenses.map(e => e.amount)).toFixed(2) : '0.00'}</div>
                <div class="stat-label">${this.currentLanguage === 'en' ? 'Highest Expense' : 'Μεγαλύτερο Έξοδο'}</div>
            </div>
        </div>
        
        <div class="categories">
            <h2>${this.currentLanguage === 'en' ? 'Category Breakdown' : 'Κατανομή Κατηγοριών'}</h2>
            <div class="category-grid">
                ${Object.entries(categoryTotals).map(([category, amount]) => `
                    <div class="category-card">
                        <div class="category-name">${this.translations[this.currentLanguage].categories[category] || category}</div>
                        <div class="category-amount">€${amount.toFixed(2)}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="transactions">
            <h2>${this.currentLanguage === 'en' ? 'All Transactions' : 'Όλες οι Συναλλαγές'}</h2>
            <table class="table">
                <thead>
                    <tr>
                        <th>${this.currentLanguage === 'en' ? 'Date' : 'Ημερομηνία'}</th>
                        <th>${this.currentLanguage === 'en' ? 'Description' : 'Περιγραφή'}</th>
                        <th>${this.currentLanguage === 'en' ? 'Category' : 'Κατηγορία'}</th>
                        <th>${this.currentLanguage === 'en' ? 'Amount' : 'Ποσό'}</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.expenses.map(expense => `
                        <tr>
                            <td>${expense.date}</td>
                            <td>${this.escapeHtml(expense.description)}</td>
                            <td>${this.translations[this.currentLanguage].categories[expense.category] || expense.category}</td>
                            <td>€${expense.amount.toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="footer">
            <p>${this.currentLanguage === 'en' ? 'Generated by ExpenseTracker PWA' : 'Δημιουργήθηκε από ExpenseTracker PWA'}</p>
        </div>
    </div>
</body>
</html>
        `;
    }
    
    showToast(message, type = 'success') {
        try {
            const toast = document.getElementById('toast');
            if (!toast) return;
            
            toast.textContent = message;
            toast.className = `toast ${type}`;
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        } catch (error) {
            console.error('Error showing toast:', error);
        }
    }
    
    resetForm() {
        try {
            const form = document.getElementById('expenseForm');
            if (form) {
                form.reset();
            }
            const description = document.getElementById('description');
            if (description) {
                description.focus();
            }
        } catch (error) {
            console.error('Error resetting form:', error);
        }
    }
    
    saveExpenses() {
        this.safeSetLocalStorage('expenses', JSON.stringify(this.expenses));
    }
    
    safeSetLocalStorage(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }
    
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('sw.js');
                console.log('Service Worker registered successfully:', registration);
            } catch (error) {
                console.log('Service Worker registration failed:', error);
            }
        }
    }
}

// Initialize the app with error handling
let expenseTracker;
try {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            expenseTracker = new ExpenseTracker();
        });
    } else {
        expenseTracker = new ExpenseTracker();
    }
} catch (error) {
    console.error('Critical error initializing app:', error);
    // Force hide loading screen as fallback
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }, 1000);
}

// Add ripple animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
