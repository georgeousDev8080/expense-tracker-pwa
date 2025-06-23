class ExpenseTracker {
    constructor() {
        this.expenses = this.loadExpenses();
        this.currentFilter = '';
        this.selectedExpenses = new Set();
        this.currentLanguage = localStorage.getItem('language') || 'en';
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        this.translations = {
            en: {
                'app.title': 'Expense Tracker',
                'app.subtitle': 'Track your expenses with style',
                'controls.theme': '🌙 Dark Mode',
                'controls.themeLight': '☀️ Light Mode',
                'summary.total': 'Total Spent',
                'summary.count': 'Expenses',
                'form.description': 'Description',
                'form.amount': 'Amount (€)',
                'form.selectCategory': 'Select Category',
                'form.add': 'Add Expense',
                'categories.food': 'Food - Bakery - Supermarket',
                'categories.transport': 'Transportation',
                'categories.entertainment': 'Entertainment',
                'categories.shopping': 'Shopping',
                'categories.bills': 'Bills & Utilities',
                'categories.healthcare': 'Healthcare',
                'categories.education': 'Education',
                'categories.coffee': 'Coffee - Personal Expenses',
                'categories.clothing': 'Clothing',
                'categories.other': 'Other',
                'filters.all': 'All',
                'actions.selectAll': 'Select All',
                'actions.deleteSelected': 'Delete Selected',
                'actions.export': 'Export Analytics Report',
                'messages.noExpenses': 'No expenses yet. Add your first expense above!',
                'messages.expenseAdded': 'Expense added successfully!',
                'messages.expenseDeleted': 'Expense deleted!',
                'messages.expensesDeleted': 'Selected expenses deleted!',
                'messages.reportExported': 'Analytics report exported!',
                'export.title': 'Expense Analytics Report',
                'export.generatedOn': 'Generated on',
                'export.totalExpenses': 'Total Expenses',
                'export.totalAmount': 'Total Amount',
                'export.averageExpense': 'Average Expense',
                'export.highestExpense': 'Highest Expense',
                'export.categoryBreakdown': 'Category Breakdown',
                'export.allTransactions': 'All Transactions',
                'export.description': 'Description',
                'export.amount': 'Amount',
                'export.category': 'Category',
                'export.date': 'Date'
            },
            gr: {
                'app.title': 'Παρακολούθηση Εξόδων',
                'app.subtitle': 'Παρακολουθήστε τα έξοδά σας με στυλ',
                'controls.theme': '🌙 Σκούρο Θέμα',
                'controls.themeLight': '☀️ Φωτεινό Θέμα',
                'summary.total': 'Συνολικά Έξοδα',
                'summary.count': 'Έξοδα',
                'form.description': 'Περιγραφή',
                'form.amount': 'Ποσό (€)',
                'form.selectCategory': 'Επιλέξτε Κατηγορία',
                'form.add': 'Προσθήκη Εξόδου',
                'categories.food': 'Φαγητό - Φούρνος - Σούπερ Μάρκετ',
                'categories.transport': 'Μεταφορά',
                'categories.entertainment': 'Ψυχαγωγία',
                'categories.shopping': 'Αγορές',
                'categories.bills': 'Λογαριασμοί & Υπηρεσίες',
                'categories.healthcare': 'Υγεία',
                'categories.education': 'Εκπαίδευση',
                'categories.coffee': 'Καφές - Προσωπικά Έξοδα',
                'categories.clothing': 'Ένδυση',
                'categories.other': 'Άλλα',
                'filters.all': 'Όλα',
                'actions.selectAll': 'Επιλογή Όλων',
                'actions.deleteSelected': 'Διαγραφή Επιλεγμένων',
                'actions.export': 'Εξαγωγή Αναλυτικής Αναφοράς',
                'messages.noExpenses': 'Δεν υπάρχουν έξοδα ακόμα. Προσθέστε το πρώτο σας έξοδο παραπάνω!',
                'messages.expenseAdded': 'Το έξοδο προστέθηκε επιτυχώς!',
                'messages.expenseDeleted': 'Το έξοδο διαγράφηκε!',
                'messages.expensesDeleted': 'Τα επιλεγμένα έξοδα διαγράφηκαν!',
                'messages.reportExported': 'Η αναλυτική αναφορά εξήχθη!',
                'export.title': 'Αναλυτική Αναφορά Εξόδων',
                'export.generatedOn': 'Δημιουργήθηκε στις',
                'export.totalExpenses': 'Συνολικά Έξοδα',
                'export.totalAmount': 'Συνολικό Ποσό',
                'export.averageExpense': 'Μέσος Όρος Εξόδου',
                'export.highestExpense': 'Υψηλότερο Έξοδο',
                'export.categoryBreakdown': 'Ανάλυση ανά Κατηγορία',
                'export.allTransactions': 'Όλες οι Συναλλαγές',
                'export.description': 'Περιγραφή',
                'export.amount': 'Ποσό',
                'export.category': 'Κατηγορία',
                'export.date': 'Ημερομηνία'
            }
        };

        this.init();
    }

    init() {
        try {
            console.log('Initializing Expense Tracker...');
            this.setupEventListeners();
            this.setupServiceWorker();
            this.applyTheme();
            this.applyLanguage();
            this.renderExpenses();
            this.updateSummary();
            this.animateEntrance();
            
            // Force hide loading screen after 3 seconds max
            setTimeout(() => {
                console.log('Force hiding loading screen...');
                const loadingScreen = document.getElementById('loadingScreen');
                if (loadingScreen) {
                    loadingScreen.classList.add('hidden');
                }
            }, 3000);
            
            console.log('Expense Tracker initialized successfully');
        } catch (error) {
            console.error('Error during initialization:', error);
            // Force hide loading screen on error
            setTimeout(() => {
                const loadingScreen = document.getElementById('loadingScreen');
                if (loadingScreen) {
                    loadingScreen.classList.add('hidden');
                }
            }, 1000);
        }
    }

    setupEventListeners() {
        // Form submission
        document.getElementById('expenseForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addExpense();
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Language toggle
        document.getElementById('langToggle').addEventListener('click', () => {
            this.toggleLanguage();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.category);
                this.updateFilterButtons(e.target);
            });
        });

        // Select all checkbox
        document.getElementById('selectAll').addEventListener('change', (e) => {
            this.selectAll(e.target.checked);
        });

        // Delete selected button
        document.getElementById('deleteSelected').addEventListener('click', () => {
            this.deleteSelected();
        });

        // Export button
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportReport();
        });

        // Setup intersection observer for animations
        this.setupIntersectionObserver();
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js', {
                scope: './'
            })
            .then(registration => {
                console.log('SW registered:', registration);
                // Force update if needed
                if (registration.waiting) {
                    registration.waiting.postMessage({type: 'SKIP_WAITING'});
                }
            })
            .catch(error => {
                console.log('SW registration failed:', error);
                // Don't let SW failures block the app
                this.forceLoadApp();
            });
        } else {
            // Service workers not supported, continue normally
            this.forceLoadApp();
        }
    }

    // Add this method to force app loading if SW fails
    forceLoadApp() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
            }
        }, 1000);
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });

        // Observe all glass cards
        document.querySelectorAll('.glass-card').forEach(card => {
            observer.observe(card);
        });
    }

    addExpense() {
        const description = document.getElementById('description').value.trim();
        const amount = parseFloat(document.getElementById('amount').value);
        const category = document.getElementById('category').value;

        if (!description || !amount || !category) {
            this.showToast('Please fill all fields!', 'error');
            return;
        }

        const expense = {
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            description,
            amount,
            category,
            date: this.formatDate(new Date()),
            timestamp: Date.now()
        };

        this.expenses.unshift(expense);
        this.saveExpenses();
        this.renderExpenses();
        this.updateSummary();
        this.clearForm();
        this.showToast(this.translate('messages.expenseAdded'), 'success');
        this.createParticleExplosion();
        this.vibrateDevice();
    }

    deleteExpense(id) {
        this.expenses = this.expenses.filter(expense => expense.id !== id);
        this.selectedExpenses.delete(id);
        this.saveExpenses();
        this.renderExpenses();
        this.updateSummary();
        this.updateBulkActions();
        this.showToast(this.translate('messages.expenseDeleted'), 'success');
        this.vibrateDevice();
    }

    deleteSelected() {
        this.expenses = this.expenses.filter(expense => !this.selectedExpenses.has(expense.id));
        this.selectedExpenses.clear();
        this.saveExpenses();
        this.renderExpenses();
        this.updateSummary();
        this.updateBulkActions();
        this.showToast(this.translate('messages.expensesDeleted'), 'success');
        this.vibrateDevice();
    }

    selectExpense(id, checked) {
        if (checked) {
            this.selectedExpenses.add(id);
        } else {
            this.selectedExpenses.delete(id);
        }
        this.updateBulkActions();
        this.updateSelectAllCheckbox();
    }

    selectAll(checked) {
        const filteredExpenses = this.getFilteredExpenses();
        if (checked) {
            filteredExpenses.forEach(expense => this.selectedExpenses.add(expense.id));
        } else {
            filteredExpenses.forEach(expense => this.selectedExpenses.delete(expense.id));
        }
        
        document.querySelectorAll('.expense-checkbox:not(#selectAll)').forEach(checkbox => {
            checkbox.checked = checked;
        });
        
        this.updateBulkActions();
    }

    updateSelectAllCheckbox() {
        const filteredExpenses = this.getFilteredExpenses();
        const selectAllCheckbox = document.getElementById('selectAll');
        const selectedFiltered = filteredExpenses.filter(expense => this.selectedExpenses.has(expense.id));
        
        selectAllCheckbox.checked = filteredExpenses.length > 0 && selectedFiltered.length === filteredExpenses.length;
        selectAllCheckbox.indeterminate = selectedFiltered.length > 0 && selectedFiltered.length < filteredExpenses.length;
    }

    updateBulkActions() {
        const bulkActions = document.getElementById('bulkActions');
        const selectedCount = document.getElementById('selectedCount');
        
        if (this.selectedExpenses.size > 0) {
            bulkActions.classList.add('show');
            selectedCount.textContent = `${this.selectedExpenses.size} selected`;
        } else {
            bulkActions.classList.remove('show');
        }
    }

    setFilter(category) {
        this.currentFilter = category;
        this.selectedExpenses.clear();
        this.renderExpenses();
        this.updateBulkActions();
    }

    updateFilterButtons(activeBtn) {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }

    getFilteredExpenses() {
        if (!this.currentFilter) return this.expenses;
        return this.expenses.filter(expense => expense.category === this.currentFilter);
    }

    renderExpenses() {
        const expenseList = document.getElementById('expenseList');
        const filteredExpenses = this.getFilteredExpenses();

        if (filteredExpenses.length === 0) {
            expenseList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📊</div>
                    <p data-translate="messages.noExpenses">${this.translate('messages.noExpenses')}</p>
                </div>
            `;
            return;
        }

        expenseList.innerHTML = filteredExpenses.map((expense, index) => `
            <div class="expense-item" data-id="${expense.id}" style="animation-delay: ${index * 100}ms">
                <div class="expense-info">
                    <input type="checkbox" class="expense-checkbox" 
                           ${this.selectedExpenses.has(expense.id) ? 'checked' : ''}
                           onchange="expenseTracker.selectExpense('${expense.id}', this.checked)">
                    <div class="expense-details">
                        <div class="expense-description">${expense.description}</div>
                        <div class="expense-meta">
                            <span>${this.translate('categories.' + expense.category)}</span>
                            <span>${expense.date}</span>
                        </div>
                    </div>
                </div>
                <div class="expense-amount">€${expense.amount.toFixed(2)}</div>
                <div class="expense-actions">
                    <button class="btn-delete" onclick="expenseTracker.deleteExpense('${expense.id}')" title="Delete">
                        🗑️
                    </button>
                </div>
            </div>
        `).join('');

        // Animate items in
        setTimeout(() => {
            document.querySelectorAll('.expense-item').forEach(item => {
                item.classList.add('animate-in');
            });
        }, 50);

        this.updateSelectAllCheckbox();
    }

    updateSummary() {
        const totalAmount = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const expenseCount = this.expenses.length;

        this.animateCounter('totalAmount', totalAmount, '€');
        this.animateCounter('expenseCount', expenseCount);
    }

    animateCounter(elementId, targetValue, prefix = '') {
        const element = document.getElementById(elementId);
        const duration = 1000;
        const startTime = performance.now();
        const startValue = 0;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = startValue + (targetValue - startValue) * easeOut;
            
            if (prefix === '€') {
                element.textContent = prefix + currentValue.toFixed(2);
            } else {
                element.textContent = Math.floor(currentValue);
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        localStorage.setItem('theme', this.currentTheme);
    }

    applyTheme() {
        document.body.setAttribute('data-theme', this.currentTheme);
        const themeToggle = document.getElementById('themeToggle');
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (this.currentTheme === 'dark') {
            themeToggle.innerHTML = '☀️ ' + this.translate('controls.themeLight');
            metaThemeColor.content = '#000000';
        } else {
            themeToggle.innerHTML = '🌙 ' + this.translate('controls.theme');
            metaThemeColor.content = '#667eea';
        }
    }

    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'en' ? 'gr' : 'en';
        this.applyLanguage();
        localStorage.setItem('language', this.currentLanguage);
    }

    applyLanguage() {
        const langToggle = document.getElementById('langToggle');
        langToggle.textContent = this.currentLanguage === 'en' ? '🇬🇷 Ελληνικά' : '🇺🇸 English';
        
        // Update all elements with data-translate attribute
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            element.textContent = this.translate(key);
        });

        // Re-render expenses to update category translations
        this.renderExpenses();
        this.applyTheme(); // Update theme button text
    }

    translate(key) {
        return this.translations[this.currentLanguage][key] || key;
    }

    formatDate(date) {
        if (this.currentLanguage === 'gr') {
            return date.toLocaleDateString('el-GR');
        }
        return date.toLocaleDateString('en-US');
    }

    clearForm() {
        document.getElementById('expenseForm').reset();
        // Remove focus from form inputs
        document.querySelectorAll('.form-input, .form-select').forEach(input => {
            input.blur();
        });
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            ${message}
            <div class="toast-progress"></div>
        `;

        document.body.appendChild(toast);

        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);

        // Hide and remove toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    }

    createParticleExplosion() {
        const container = document.createElement('div');
        container.className = 'particle-explosion';
        container.style.left = '50%';
        container.style.top = '50%';
        
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'explosion-particle';
            
            const angle = (i / 10) * Math.PI * 2;
            const velocity = 100 + Math.random() * 100;
            const dx = Math.cos(angle) * velocity;
            const dy = Math.sin(angle) * velocity;
            
            particle.style.setProperty('--dx', dx + 'px');
            particle.style.setProperty('--dy', dy + 'px');
            
            container.appendChild(particle);
        }
        
        document.body.appendChild(container);
        
        setTimeout(() => {
            document.body.removeChild(container);
        }, 1000);
    }

    vibrateDevice() {
        if ('vibrate' in navigator) {
            navigator.vibrate([100, 50, 100]);
        }
    }

    animateEntrance() {
        // Stagger animation for glass cards
        const cards = document.querySelectorAll('.glass-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate-in');
            }, index * 200);
        });
    }

    exportReport() {
        const totalAmount = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const expenseCount = this.expenses.length;
        const averageExpense = expenseCount > 0 ? totalAmount / expenseCount : 0;
        const highestExpense = expenseCount > 0 ? Math.max(...this.expenses.map(e => e.amount)) : 0;

        // Category breakdown
        const categoryTotals = {};
        this.expenses.forEach(expense => {
            categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
        });

        const currentDate = new Date().toLocaleDateString(this.currentLanguage === 'gr' ? 'el-GR' : 'en-US');

        const reportHTML = `
<!DOCTYPE html>
<html lang="${this.currentLanguage}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.translate('export.title')}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 2rem;
            background: linear-gradient(135deg, #667eea, #764ba2);
            min-height: 100vh;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 2rem;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid #667eea;
        }
        .title {
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }
        .subtitle {
            color: #666;
            font-size: 1.1rem;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        .stat-card {
            background: linear-gradient(135deg, #f8f9ff, #e8f2ff);
            border: 1px solid #e0e8ff;
            border-radius: 15px;
            padding: 1.5rem;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        }
        .stat-value {
            font-size: 2rem;
            font-weight: 700;
            color: #667eea;
            margin-bottom: 0.5rem;
        }
        .stat-label {
            color: #666;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 0.9rem;
        }
        .section {
            margin-bottom: 2rem;
        }
        .section-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: #333;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid #eee;
        }
        .category-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }
        .category-card {
            background: #f8f9ff;
            border: 1px solid #e0e8ff;
            border-radius: 10px;
            padding: 1rem;
            text-align: center;
        }
        .category-name {
            font-weight: 600;
            color: #333;
            margin-bottom: 0.5rem;
        }
        .category-amount {
            font-size: 1.2rem;
            font-weight: 700;
            color: #667eea;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        }
        .table th {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 1rem;
            text-align: left;
            font-weight: 600;
        }
        .table td {
            padding: 1rem;
            border-bottom: 1px solid #eee;
        }
        .table tr:nth-child(even) {
            background: #f8f9ff;
        }
        .table tr:hover {
            background: #e8f2ff;
        }
        .amount {
            font-weight: 600;
            color: #667eea;
        }
        .footer {
            text-align: center;
            margin-top: 2rem;
            padding-top: 1rem;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 0.9rem;
        }
        @media (max-width: 768px) {
            body { padding: 1rem; }
            .container { padding: 1rem; }
            .stats-grid { grid-template-columns: 1fr; }
            .category-grid { grid-template-columns: 1fr; }
            .table { font-size: 0.9rem; }
            .table th, .table td { padding: 0.5rem; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="title">${this.translate('export.title')}</h1>
            <p class="subtitle">${this.translate('export.generatedOn')}: ${currentDate}</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">${expenseCount}</div>
                <div class="stat-label">${this.translate('export.totalExpenses')}</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">€${totalAmount.toFixed(2)}</div>
                <div class="stat-label">${this.translate('export.totalAmount')}</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">€${averageExpense.toFixed(2)}</div>
                <div class="stat-label">${this.translate('export.averageExpense')}</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">€${highestExpense.toFixed(2)}</div>
                <div class="stat-label">${this.translate('export.highestExpense')}</div>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">${this.translate('export.categoryBreakdown')}</h2>
            <div class="category-grid">
                ${Object.entries(categoryTotals).map(([category, amount]) => `
                    <div class="category-card">
                        <div class="category-name">${this.translate('categories.' + category)}</div>
                        <div class="category-amount">€${amount.toFixed(2)}</div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">${this.translate('export.allTransactions')}</h2>
            <table class="table">
                <thead>
                    <tr>
                        <th>${this.translate('export.description')}</th>
                        <th>${this.translate('export.amount')}</th>
                        <th>${this.translate('export.category')}</th>
                        <th>${this.translate('export.date')}</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.expenses.map(expense => `
                        <tr>
                            <td>${expense.description}</td>
                            <td class="amount">€${expense.amount.toFixed(2)}</td>
                            <td>${this.translate('categories.' + expense.category)}</td>
                            <td>${expense.date}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <div class="footer">
            <p>Generated by Expense Tracker PWA • ${new Date().toLocaleString()}</p>
        </div>
    </div>
</body>
</html>
        `;

        // Create and download the report
        const blob = new Blob([reportHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `expense-report-${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showToast(this.translate('messages.reportExported'), 'success');
        this.createParticleExplosion();
    }

    loadExpenses() {
        try {
            const saved = localStorage.getItem('expenses');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading expenses:', error);
            return [];
        }
    }

    saveExpenses() {
        try {
            localStorage.setItem('expenses', JSON.stringify(this.expenses));
        } catch (error) {
            console.error('Error saving expenses:', error);
            this.showToast('Error saving data!', 'error');
        }
    }
}

// Initialize the app
const expenseTracker = new ExpenseTracker();

// Make it globally available for inline event handlers
window.expenseTracker = expenseTracker;
