// ===== GLOBAL VARIABLES =====
let currentLanguage = 'en';
let currentTheme = 'light';
let isPhoneMode = false;
let cart = [];
let products = [];
let currentUser = null;
let isAdmin = false;
let orders = [];
let customers = [];

// ===== SAMPLE PRODUCTS DATA =====
const sampleProducts = [
    {
        id: 1,
        name: "Wireless Headphones",
        nameAr: "سماعات لاسلكية",
        description: "High-quality wireless headphones with noise cancellation",
        descriptionAr: "سماعات لاسلكية عالية الجودة مع إلغاء الضوضاء",
        price: 99.99,
        category: "electronics",
        image: "🎧"
    },
    {
        id: 2,
        name: "Cotton T-Shirt",
        nameAr: "قميص قطني",
        description: "Comfortable 100% cotton t-shirt in various colors",
        descriptionAr: "قميص قطني مريح 100% بألوان متنوعة",
        price: 24.99,
        category: "clothing",
        image: "👕"
    },
    {
        id: 3,
        name: "Coffee Maker",
        nameAr: "صانعة القهوة",
        description: "Automatic coffee maker with programmable timer",
        descriptionAr: "صانعة قهوة أوتوماتيكية مع مؤقت قابل للبرمجة",
        price: 79.99,
        category: "home",
        image: "☕"
    },
    {
        id: 4,
        name: "JavaScript Guide",
        nameAr: "دليل جافا سكريبت",
        description: "Complete guide to modern JavaScript programming",
        descriptionAr: "دليل شامل لبرمجة جافا سكريبت الحديثة",
        price: 39.99,
        category: "books",
        image: "📚"
    },
    {
        id: 5,
        name: "Smartphone",
        nameAr: "هاتف ذكي",
        description: "Latest smartphone with advanced camera and long battery life",
        descriptionAr: "أحدث هاتف ذكي مع كاميرا متقدمة وبطارية طويلة المدى",
        price: 699.99,
        category: "electronics",
        image: "📱"
    },
    {
        id: 6,
        name: "Running Shoes",
        nameAr: "حذاء جري",
        description: "Lightweight running shoes with excellent cushioning",
        descriptionAr: "حذاء جري خفيف الوزن مع توسيد ممتاز",
        price: 89.99,
        category: "clothing",
        image: "👟"
    }
];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    
    // Initialize cart page if we're on cart.html
    if (window.location.pathname.includes('cart.html')) {
        initializeCartPage();
    }
});

function initializeApp() {
    // Load saved data from localStorage
    loadSavedData();
    
    // Initialize products
    products = [...sampleProducts];
    
    // Set up event listeners
    setupEventListeners();
    
    // Render initial content
    renderProducts();
    updateCartDisplay();
    updateLanguage();
    applyTheme();
    applyPhoneMode();
    
    // Auto-detect mobile devices
    detectMobileDevice();
}

function loadSavedData() {
    // Load theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        currentTheme = savedTheme;
    }
    
    // Load language
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
        currentLanguage = savedLanguage;
    }
    
    // Load phone mode
    const savedPhoneMode = localStorage.getItem('phoneMode');
    if (savedPhoneMode) {
        isPhoneMode = JSON.parse(savedPhoneMode);
    }
    
    // Load cart
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    
    // Load user
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserDisplay();
    }
    
    // Load custom products
    const savedProducts = localStorage.getItem('customProducts');
    if (savedProducts) {
        const customProducts = JSON.parse(savedProducts);
        products = [...sampleProducts, ...customProducts];
    }
    
    // Load orders
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
        orders = JSON.parse(savedOrders);
    }
    
    // Load customers
    const savedCustomers = localStorage.getItem('customers');
    if (savedCustomers) {
        customers = JSON.parse(savedCustomers);
    }
}

function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// ===== PHONE MODE FUNCTIONALITY =====
function togglePhoneMode() {
    isPhoneMode = !isPhoneMode;
    applyPhoneMode();
    localStorage.setItem('phoneMode', JSON.stringify(isPhoneMode));
    
    // Show notification
    showNotification(
        isPhoneMode ? 
        (currentLanguage === 'ar' ? 'تم تفعيل وضع الهاتف' : 'Phone Mode Enabled') :
        (currentLanguage === 'ar' ? 'تم إلغاء وضع الهاتف' : 'Phone Mode Disabled')
    );
}

function applyPhoneMode() {
    const body = document.body;
    const phoneModeBtn = document.getElementById('phoneModeBtn');
    const phoneModeText = document.getElementById('phoneModeText');
    
    if (isPhoneMode) {
        body.setAttribute('data-phone-mode', 'true');
        phoneModeBtn.classList.add('active');
        phoneModeText.textContent = currentLanguage === 'ar' ? 'هاتف' : 'Phone';
        phoneModeBtn.title = currentLanguage === 'ar' ? 'إلغاء وضع الهاتف' : 'Exit Phone Mode';
    } else {
        body.removeAttribute('data-phone-mode');
        phoneModeBtn.classList.remove('active');
        phoneModeText.textContent = currentLanguage === 'ar' ? 'هاتف' : 'Phone';
        phoneModeBtn.title = currentLanguage === 'ar' ? 'وضع الهاتف' : 'Phone Mode';
    }
}

function detectMobileDevice() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isSmallScreen = window.innerWidth <= 768;
    
    // Auto-enable phone mode for mobile devices on first visit
    if ((isMobile || isSmallScreen) && !localStorage.getItem('phoneMode')) {
        isPhoneMode = true;
        localStorage.setItem('phoneMode', JSON.stringify(true));
        applyPhoneMode();
    }
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'phone-mode-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        font-size: 14px;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Theme toggle
    document.getElementById('themeBtn').addEventListener('click', toggleTheme);
    
    // Language toggle
    document.getElementById('languageBtn').addEventListener('click', toggleLanguage);
    
    // Phone mode toggle
    document.getElementById('phoneModeBtn').addEventListener('click', togglePhoneMode);
    
    // User button
    document.getElementById('userBtn').addEventListener('click', openUserModal);
    
    // Cart button
    document.getElementById('cartBtn').addEventListener('click', openCartModal);
    
    // Search functionality
    document.getElementById('searchBtn').addEventListener('click', performSearch);
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            filterProducts(this.dataset.category);
            // Update active filter button
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Sort dropdown
    document.getElementById('sortSelect').addEventListener('change', function() {
        sortProducts(this.value);
    });
    
    // Modal close buttons
    setupModalEventListeners();
    
    // User forms
    setupUserFormListeners();
    
    // Admin functionality
    setupAdminListeners();
    
    // Checkout functionality
    setupCheckoutListeners();
}

function setupModalEventListeners() {
    // Cart modal
    document.getElementById('closeCart').addEventListener('click', closeCartModal);
    document.getElementById('cartModal').addEventListener('click', function(e) {
        if (e.target === this) closeCartModal();
    });
    
    // User modal
    document.getElementById('closeUser').addEventListener('click', closeUserModal);
    document.getElementById('userModal').addEventListener('click', function(e) {
        if (e.target === this) closeUserModal();
    });
    
    // Admin modals
    document.getElementById('closeAdminLogin').addEventListener('click', closeAdminLoginModal);
    document.getElementById('closeAdminPanel').addEventListener('click', closeAdminPanelModal);
    
    // Checkout modal
    document.getElementById('closeCheckout').addEventListener('click', closeCheckoutModal);
    document.getElementById('checkoutModal').addEventListener('click', function(e) {
        if (e.target === this) closeCheckoutModal();
    });
}

function setupUserFormListeners() {
    // Tab switching
    document.getElementById('loginTab').addEventListener('click', function() {
        switchUserTab('login');
    });
    document.getElementById('registerTab').addEventListener('click', function() {
        switchUserTab('register');
    });
    
    // Form submissions
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
}

function setupAdminListeners() {
    document.getElementById('adminLoginForm').addEventListener('submit', handleAdminLogin);
    document.getElementById('addProductForm').addEventListener('submit', handleAddProduct);
    
    // Add cancel edit button listener if it exists
    const cancelBtn = document.getElementById('cancelEditBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', cancelEdit);
    }
    
    // Add bulk delete button listener if it exists
    const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
    if (bulkDeleteBtn) {
        bulkDeleteBtn.addEventListener('click', bulkDeleteProducts);
    }
}

function setupCheckoutListeners() {
    document.getElementById('checkoutBtn').addEventListener('click', openCheckoutModal);
    document.getElementById('checkoutForm').addEventListener('submit', handleCheckout);
    document.getElementById('clearCart').addEventListener('click', clearCart);
}

// ===== THEME FUNCTIONALITY =====
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme();
    localStorage.setItem('theme', currentTheme);
}

function applyTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    const themeIcon = document.querySelector('#themeBtn i');
    themeIcon.className = currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// ===== LANGUAGE FUNCTIONALITY =====
function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'ar' : 'en';
    updateLanguage();
    localStorage.setItem('language', currentLanguage);
}

function updateLanguage() {
    document.documentElement.setAttribute('lang', currentLanguage);
    document.body.style.direction = currentLanguage === 'ar' ? 'rtl' : 'ltr';
    
    // Update all elements with language attributes
    document.querySelectorAll('[data-en]').forEach(element => {
        const text = currentLanguage === 'en' ? element.dataset.en : element.dataset.ar;
        if (text) {
            element.textContent = text;
        }
    });
    
    // Update placeholders
    document.querySelectorAll('[data-placeholder-en]').forEach(element => {
        const placeholder = currentLanguage === 'en' ? element.dataset.placeholderEn : element.dataset.placeholderAr;
        if (placeholder) {
            element.placeholder = placeholder;
        }
    });
    
    // Re-render products to update language
    renderProducts();
}

// ===== PRODUCT FUNCTIONALITY =====
function renderProducts(productsToRender = products) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (productsToRender.length === 0) {
        grid.innerHTML = `<div class="no-products" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-secondary);">
            ${currentLanguage === 'en' ? 'No products found' : 'لم يتم العثور على منتجات'}
        </div>`;
        return;
    }
    
    productsToRender.forEach(product => {
        const productCard = createProductCard(product);
        grid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-category', product.category);
    
    const name = currentLanguage === 'en' ? product.name : (product.nameAr || product.name);
    const description = currentLanguage === 'en' ? product.description : (product.descriptionAr || product.description);
    
    card.innerHTML = `
        <div class="product-emoji">${product.image}</div>
        <h3 class="product-name">${name}</h3>
        <p class="product-description">${description}</p>
        <div class="product-price">$${product.price.toFixed(2)}</div>
        <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
            ${currentLanguage === 'en' ? 'Add to Cart' : 'أضف إلى العربة'}
        </button>
        ${isAdmin ? `
        <div class="admin-controls" style="margin-top: 0.5rem; display: flex; gap: 0.5rem;">
            <button class="edit-product-btn" onclick="editProduct(${product.id})" style="background: var(--blue-color); color: white; border: none; padding: 0.5rem; border-radius: 0.375rem; cursor: pointer; flex: 1; font-weight: 600;">
                ${currentLanguage === 'en' ? 'Edit' : 'تعديل'}
            </button>
            <button class="remove-product-btn" onclick="removeProduct(${product.id})" style="background: var(--red-color); color: white; border: none; padding: 0.5rem; border-radius: 0.375rem; cursor: pointer; flex: 1; font-weight: 600;">
                ${currentLanguage === 'en' ? 'Remove' : 'حذف'}
            </button>
        </div>` : ''}
    `;
    
    return card;
}

function filterProducts(category) {
    const filteredProducts = category === 'all' ? products : products.filter(p => p.category === category);
    renderProducts(filteredProducts);
}

function sortProducts(sortType) {
    let sortedProducts = [...products];
    
    switch (sortType) {
        case 'price-low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        default:
            sortedProducts = [...products];
    }
    
    renderProducts(sortedProducts);
}

function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (!searchTerm) {
        renderProducts();
        return;
    }
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        (product.nameAr && product.nameAr.includes(searchTerm)) ||
        (product.descriptionAr && product.descriptionAr.includes(searchTerm))
    );
    
    renderProducts(filteredProducts);
}

// ===== CART FUNCTIONALITY =====
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            nameAr: product.nameAr,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    saveToLocalStorage('cart', cart);
    
    // Add visual feedback to cart count
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.classList.add('updated');
        setTimeout(() => cartCount.classList.remove('updated'), 800);
    }
    
    // Update cart modal items display
    renderCartItems();
    
    // Show enhanced feedback with product info
    const productName = currentLanguage === 'en' ? product.name : (product.nameAr || product.name);
    showNotification(
        `${product.image} ${productName} ${currentLanguage === 'en' ? 'added to cart!' : 'تمت الإضافة إلى العربة!'}`, 
        'success'
    );
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    renderCartItems();
    saveToLocalStorage('cart', cart);
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCartDisplay();
        renderCartItems();
        saveToLocalStorage('cart', cart);
    }
}

function setQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    const quantity = parseInt(newQuantity);
    
    if (quantity <= 0 || isNaN(quantity)) {
        removeFromCart(productId);
    } else if (quantity <= 99) {
        item.quantity = quantity;
        updateCartDisplay();
        renderCartItems();
        saveToLocalStorage('cart', cart);
    }
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
    
    const cartTotal = document.getElementById('cartTotal');
    if (cartTotal) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = total.toFixed(2);
    }
    
    // Update cart item count display
    const cartItemCount = document.getElementById('cartItemCount');
    if (cartItemCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const text = currentLanguage === 'en' ? 
            (totalItems === 1 ? '1 item' : `${totalItems} items`) : 
            (totalItems === 1 ? '1 عنصر' : `${totalItems} عناصر`);
        cartItemCount.textContent = text;
    }
}

function renderCartItems() {
    const cartItems = document.getElementById('cartItems');
    if (!cartItems) {
        return;
    }
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h4>${currentLanguage === 'en' ? 'Your cart is empty' : 'عربة التسوق فارغة'}</h4>
                <p>${currentLanguage === 'en' ? 'Add some products to get started!' : 'أضف بعض المنتجات للبدء!'}</p>
            </div>
        `;
        return;
    }
    
    cartItems.innerHTML = cart.map(item => {
        const name = currentLanguage === 'en' ? item.name : (item.nameAr || item.name);
        const subtotal = (item.price * item.quantity).toFixed(2);
        
        return `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-main">
                    <div class="cart-item-image">${item.image}</div>
                    <div class="cart-item-details">
                        <div class="cart-item-name">${name}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    </div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" onclick="updateQuantity(${item.id}, ${item.quantity - 1})" ${item.quantity <= 1 ? 'disabled' : ''}>
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="99" 
                               onchange="setQuantity(${item.id}, this.value)" onblur="setQuantity(${item.id}, this.value)">
                        <button class="quantity-btn plus" onclick="updateQuantity(${item.id}, ${item.quantity + 1})" ${item.quantity >= 99 ? 'disabled' : ''}>
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function clearCart() {
    if (confirm(currentLanguage === 'en' ? 'Are you sure you want to clear your cart?' : 'هل أنت متأكد من إفراغ عربة التسوق؟')) {
        cart = [];
        updateCartDisplay();
        renderCartItems();
        saveToLocalStorage('cart', cart);
        showNotification(currentLanguage === 'en' ? 'Cart cleared!' : 'تم إفراغ العربة!', 'success');
    }
}

// ===== MODAL FUNCTIONALITY =====
function openCartModal() {
    renderCartItems();
    updateCartDisplay();
    document.getElementById('cartModal').style.display = 'block';
}

function closeCartModal() {
    document.getElementById('cartModal').style.display = 'none';
}

function openUserModal() {
    if (currentUser) {
        // User is logged in, show logout option
        if (confirm(currentLanguage === 'en' ? 'Do you want to logout?' : 'هل تريد تسجيل الخروج؟')) {
            logout();
        }
    } else {
        document.getElementById('userModal').style.display = 'block';
    }
}

function closeUserModal() {
    document.getElementById('userModal').style.display = 'none';
}

function openAdminLoginModal() {
    document.getElementById('adminLoginModal').style.display = 'block';
}

function closeAdminLoginModal() {
    document.getElementById('adminLoginModal').style.display = 'none';
}

function openAdminPanelModal() {
    document.getElementById('adminPanelModal').style.display = 'block';
    renderProducts(); // Refresh products in admin panel
    updateAdminStats();
    renderOrders();
}

function updateAdminStats() {
    const totalProducts = products.length;
    const totalCustomers = customers.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    
    // Update stats if elements exist
    const statsContainer = document.getElementById('adminStats');
    if (statsContainer) {
        statsContainer.innerHTML = `
            <div class="admin-stat">
                <h4>${totalProducts}</h4>
                <p>${currentLanguage === 'en' ? 'Total Products' : 'إجمالي المنتجات'}</p>
            </div>
            <div class="admin-stat">
                <h4>${totalCustomers}</h4>
                <p>${currentLanguage === 'en' ? 'Total Customers' : 'إجمالي العملاء'}</p>
            </div>
            <div class="admin-stat">
                <h4>${orders.length}</h4>
                <p>${currentLanguage === 'en' ? 'Total Orders' : 'إجمالي الطلبات'}</p>
            </div>
            <div class="admin-stat">
                <h4>$${totalRevenue.toFixed(2)}</h4>
                <p>${currentLanguage === 'en' ? 'Total Revenue' : 'إجمالي الإيرادات'}</p>
            </div>
        `;
    }
}

function closeAdminPanelModal() {
    document.getElementById('adminPanelModal').style.display = 'none';
}

function openCheckoutModal() {
    if (cart.length === 0) {
        showNotification(currentLanguage === 'en' ? 'Your cart is empty!' : 'عربة التسوق فارغة!', 'error');
        return;
    }
    
    renderCheckoutSummary();
    document.getElementById('checkoutModal').style.display = 'block';
    closeCartModal();
}

function closeCheckoutModal() {
    document.getElementById('checkoutModal').style.display = 'none';
}

// ===== USER AUTHENTICATION =====
function switchUserTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.user-form').forEach(form => form.classList.remove('active'));
    
    if (tab === 'login') {
        document.getElementById('loginTab').classList.add('active');
        document.getElementById('loginForm').classList.add('active');
    } else {
        document.getElementById('registerTab').classList.add('active');
        document.getElementById('registerForm').classList.add('active');
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Check for admin login
    if (email === 'admin@elyas-shop.com' && password === 'admin123') {
        openAdminLoginModal();
        closeUserModal();
        return;
    }
    
    // Simple user authentication (in real app, this would be server-side)
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        updateUserDisplay();
        closeUserModal();
        saveToLocalStorage('currentUser', currentUser);
        showNotification(currentLanguage === 'en' ? 'Login successful!' : 'تم تسجيل الدخول بنجاح!', 'success');
    } else {
        showNotification(currentLanguage === 'en' ? 'Invalid credentials!' : 'بيانات اعتماد غير صحيحة!', 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        showNotification(currentLanguage === 'en' ? 'Passwords do not match!' : 'كلمات المرور غير متطابقة!', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification(currentLanguage === 'en' ? 'Password must be at least 6 characters!' : 'كلمة المرور يجب أن تكون 6 أحرف على الأقل!', 'error');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find(u => u.email === email)) {
        showNotification(currentLanguage === 'en' ? 'Email already exists!' : 'البريد الإلكتروني موجود بالفعل!', 'error');
        return;
    }
    
    const newUser = { name, email, password, id: Date.now() };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    currentUser = newUser;
    updateUserDisplay();
    closeUserModal();
    saveToLocalStorage('currentUser', currentUser);
    showNotification(currentLanguage === 'en' ? 'Registration successful!' : 'تم التسجيل بنجاح!', 'success');
}

function handleAdminLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    
    if (email === 'admin@elyas-shop.com' && password === 'admin123') {
        isAdmin = true;
        closeAdminLoginModal();
        openAdminPanelModal();
        showNotification(currentLanguage === 'en' ? 'Admin login successful!' : 'تم تسجيل دخول المدير بنجاح!', 'success');
    } else {
        showNotification(currentLanguage === 'en' ? 'Invalid admin credentials!' : 'بيانات اعتماد المدير غير صحيحة!', 'error');
    }
}

function updateUserDisplay() {
    const userText = document.getElementById('userText');
    if (currentUser) {
        userText.textContent = currentUser.name;
    } else {
        userText.textContent = currentLanguage === 'en' ? 'Log In' : 'تسجيل الدخول';
    }
}

function logout() {
    currentUser = null;
    isAdmin = false;
    updateUserDisplay();
    localStorage.removeItem('currentUser');
    renderProducts(); // Refresh to remove admin buttons
    showNotification(currentLanguage === 'en' ? 'Logged out successfully!' : 'تم تسجيل الخروج بنجاح!', 'success');
}

// ===== ADMIN FUNCTIONALITY =====
let editingProductId = null;

function handleAddProduct(e) {
    e.preventDefault();
    
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const description = document.getElementById('productDescription').value;
    const category = document.getElementById('productCategory').value;
    const image = document.getElementById('productImage').value;
    
    if (editingProductId) {
        // Update existing product
        const productIndex = products.findIndex(p => p.id === editingProductId);
        if (productIndex !== -1) {
            products[productIndex] = {
                ...products[productIndex],
                name,
                description,
                price,
                category,
                image
            };
            
            showNotification(currentLanguage === 'en' ? 'Product updated successfully!' : 'تم تحديث المنتج بنجاح!', 'success');
            editingProductId = null;
            document.querySelector('.add-product-btn').textContent = currentLanguage === 'en' ? 'Add Product' : 'إضافة منتج';
        }
    } else {
        // Add new product
        const newProduct = {
            id: Date.now(),
            name,
            description,
            price,
            category,
            image
        };
        
        products.push(newProduct);
        showNotification(currentLanguage === 'en' ? 'Product added successfully!' : 'تمت إضافة المنتج بنجاح!', 'success');
    }
    
    // Save custom products
    const customProducts = products.filter(p => !sampleProducts.find(sp => sp.id === p.id));
    saveToLocalStorage('customProducts', customProducts);
    
    renderProducts();
    document.getElementById('addProductForm').reset();
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Fill form with product data
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productImage').value = product.image;
    
    // Set editing mode
    editingProductId = productId;
    document.querySelector('.add-product-btn').textContent = currentLanguage === 'en' ? 'Update Product' : 'تحديث المنتج';
    
    // Show cancel button
    const cancelBtn = document.getElementById('cancelEditBtn');
    if (cancelBtn) {
        cancelBtn.style.display = 'block';
    }
    
    // Scroll to form
    document.getElementById('addProductForm').scrollIntoView({ behavior: 'smooth' });
    
    showNotification(currentLanguage === 'en' ? 'Product loaded for editing' : 'تم تحميل المنتج للتعديل', 'info');
}

function cancelEdit() {
    editingProductId = null;
    document.getElementById('addProductForm').reset();
    document.querySelector('.add-product-btn').textContent = currentLanguage === 'en' ? 'Add Product' : 'إضافة منتج';
    
    // Hide cancel button
    const cancelBtn = document.getElementById('cancelEditBtn');
    if (cancelBtn) {
        cancelBtn.style.display = 'none';
    }
}

function removeProduct(productId) {
    if (confirm(currentLanguage === 'en' ? 'Are you sure you want to clear your basket?' : 'هل أنت متأكد من إفراغ سلة التسوق؟')) {
        // Check if we're editing this product
        if (editingProductId === productId) {
            cancelEdit();
        }
        
        products = products.filter(p => p.id !== productId);
        
        // Also remove from cart if present
        cart = cart.filter(item => item.id !== productId);
        updateCartDisplay();
        saveToLocalStorage('cart', cart);
        
        // Update custom products in localStorage
        const customProducts = products.filter(p => !sampleProducts.find(sp => sp.id === p.id));
        saveToLocalStorage('customProducts', customProducts);
        
        renderProducts();
        showNotification(currentLanguage === 'en' ? 'Product removed successfully!' : 'تم حذف المنتج بنجاح!', 'success');
    }
}

function bulkDeleteProducts() {
    if (confirm(currentLanguage === 'en' ? 'Are you sure you want to delete ALL custom products? This cannot be undone!' : 'هل أنت متأكد من حذف جميع المنتجات المخصصة؟ لا يمكن التراجع عن هذا الإجراء!')) {
        // Keep only sample products
        products = [...sampleProducts];
        
        // Clear custom products from storage
        localStorage.removeItem('customProducts');
        
        // Clear cart of any deleted products
        cart = cart.filter(item => sampleProducts.find(sp => sp.id === item.id));
        updateCartDisplay();
        saveToLocalStorage('cart', cart);
        
        cancelEdit();
        renderProducts();
        showNotification(currentLanguage === 'en' ? 'All custom products deleted!' : 'تم حذف جميع المنتجات المخصصة!', 'success');
    }
}

// ===== CHECKOUT FUNCTIONALITY =====
function renderCheckoutSummary() {
    const summary = document.getElementById('checkoutSummary');
    const total = document.getElementById('checkoutTotal');
    
    summary.innerHTML = cart.map(item => {
        const name = currentLanguage === 'en' ? item.name : (item.nameAr || item.name);
        return `
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span>${item.image} ${name} x${item.quantity}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `;
    }).join('');
    
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    total.textContent = totalAmount.toFixed(2);
}

function handleCheckout(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const shippingAddress = document.getElementById('shippingAddress').value;
    
    // Create order object
    const orderId = 'ORD-' + Date.now();
    const orderTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const newOrder = {
        id: orderId,
        customerName: fullName,
        customerEmail: email,
        shippingAddress: shippingAddress,
        items: [...cart],
        total: orderTotal,
        date: new Date().toISOString(),
        status: 'pending'
    };
    
    // Add order to orders array
    orders.push(newOrder);
    saveToLocalStorage('orders', orders);
    
    // Add customer if not exists
    if (!customers.find(c => c.email === email)) {
        const newCustomer = {
            id: Date.now(),
            name: fullName,
            email: email,
            registrationDate: new Date().toISOString(),
            totalOrders: 1,
            totalSpent: orderTotal
        };
        customers.push(newCustomer);
    } else {
        // Update existing customer
        const customer = customers.find(c => c.email === email);
        customer.totalOrders += 1;
        customer.totalSpent += orderTotal;
    }
    saveToLocalStorage('customers', customers);
    
    // Clear cart
    cart = [];
    updateCartDisplay();
    localStorage.removeItem('cart');
    
    closeCheckoutModal();
    
    showNotification(
        currentLanguage === 'en' 
            ? `Order placed successfully! Order ID: ${orderId}` 
            : `تم تأكيد الطلب بنجاح! رقم الطلب: ${orderId}`,
        'success'
    );
}

// ===== ORDERS MANAGEMENT =====
function renderOrders() {
    const ordersContainer = document.getElementById('ordersContainer');
    if (!ordersContainer) return;
    
    if (orders.length === 0) {
        ordersContainer.innerHTML = `
            <div class="no-orders" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                <i class="fas fa-shopping-bag" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>${currentLanguage === 'en' ? 'No orders yet' : 'لا توجد طلبات بعد'}</p>
            </div>
        `;
        return;
    }
    
    // Sort orders by date (newest first)
    const sortedOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    ordersContainer.innerHTML = `
        <div class="orders-list">
            ${sortedOrders.map(order => `
                <div class="order-card">
                    <div class="order-header">
                        <div class="order-info">
                            <h5 class="order-id">${order.id}</h5>
                            <p class="order-customer">${order.customerName} (${order.customerEmail})</p>
                            <p class="order-date">${new Date(order.date).toLocaleDateString()}</p>
                        </div>
                        <div class="order-total">
                            <span class="order-amount">$${order.total.toFixed(2)}</span>
                            <span class="order-status status-${order.status}">${order.status}</span>
                        </div>
                    </div>
                    <div class="order-items">
                        ${order.items.map(item => `
                            <div class="order-item">
                                <span>${item.image} ${item.name} x${item.quantity}</span>
                                <span>$${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="order-address">
                        <strong>${currentLanguage === 'en' ? 'Shipping Address:' : 'عنوان الشحن:'}</strong>
                        <p>${order.shippingAddress}</p>
                    </div>
                    <div class="order-actions">
                        <button class="order-action-btn" onclick="updateOrderStatus('${order.id}', 'processing')" 
                                ${order.status === 'processing' ? 'disabled' : ''}>
                            ${currentLanguage === 'en' ? 'Mark Processing' : 'قيد المعالجة'}
                        </button>
                        <button class="order-action-btn" onclick="updateOrderStatus('${order.id}', 'shipped')" 
                                ${order.status === 'shipped' ? 'disabled' : ''}>
                            ${currentLanguage === 'en' ? 'Mark Shipped' : 'تم الشحن'}
                        </button>
                        <button class="order-action-btn" onclick="updateOrderStatus('${order.id}', 'delivered')" 
                                ${order.status === 'delivered' ? 'disabled' : ''}>
                            ${currentLanguage === 'en' ? 'Mark Delivered' : 'تم التسليم'}
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function updateOrderStatus(orderId, newStatus) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        saveToLocalStorage('orders', orders);
        renderOrders();
        updateAdminStats();
        showNotification(
            currentLanguage === 'en' 
                ? `Order ${orderId} status updated to ${newStatus}` 
                : `تم تحديث حالة الطلب ${orderId} إلى ${newStatus}`,
            'success'
        );
    }
}

// ===== UTILITY FUNCTIONS =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Enhanced notification styling
    const bgColor = type === 'success' ? 'linear-gradient(135deg, var(--success-color), var(--green-hover))' : 
                   type === 'error' ? 'linear-gradient(135deg, var(--error-color), var(--red-hover))' : 
                   'linear-gradient(135deg, var(--primary-color), var(--primary-hover))';
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-lg);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        animation: notificationSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 350px;
        word-wrap: break-word;
        font-weight: 600;
        border: 2px solid rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
        transform: translateX(100%);
    `;
    
    // Add icon based on type
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.2rem;">${icon}</span>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto remove
    setTimeout(() => {
        notification.style.animation = 'notificationSlideOut 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 400);
    }, 4000);
}

// ===== CART PAGE FUNCTIONALITY =====
function initializeCartPage() {
    // Set up cart page event listeners
    setupCartPageListeners();
    
    // Render cart page content
    renderCartPage();
    
    // Update cart displays
    updateCartPageDisplays();
    
    // Render recommended products
    renderRecommendedProducts();
}

function setupCartPageListeners() {
    // Checkout button
    const checkoutBtnPage = document.getElementById('checkoutBtnPage');
    if (checkoutBtnPage) {
        checkoutBtnPage.addEventListener('click', openCheckoutModal);
    }
    
    // Clear cart button
    const clearCartPage = document.getElementById('clearCartPage');
    if (clearCartPage) {
        clearCartBtn.addEventListener('click', clearCart);
    }
    
    // Checkout modal functionality
    setupCheckoutListeners();
}

function renderCartPage() {
    const cartItemsPage = document.getElementById('cartItemsPage');
    const emptyCartPage = document.getElementById('emptyCartPage');
    const cartPageContent = document.querySelector('.cart-page-content');
    
    if (!cartItemsPage) return;
    
    if (cart.length === 0) {
        // Show empty cart state
        if (emptyCartPage) emptyCartPage.style.display = 'block';
        if (cartPageContent) cartPageContent.style.display = 'none';
        return;
    }
    
    // Hide empty cart state and show content
    if (emptyCartPage) emptyCartPage.style.display = 'none';
    if (cartPageContent) cartPageContent.style.display = 'grid';
    
    // Render cart items using the same structure as modal
    cartItemsPage.innerHTML = cart.map(item => {
        const name = currentLanguage === 'en' ? item.name : (item.nameAr || item.name);
        const itemSubtotal = (item.price * item.quantity).toFixed(2);
        return `
            <div class="cart-item">
                <div class="cart-item-main">
                    <div class="cart-item-image">${item.image}</div>
                    <div class="cart-item-details">
                        <div class="cart-item-name">${name}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)} ${currentLanguage === 'en' ? 'each' : 'للقطعة'}</div>
                        <div class="cart-item-subtotal">${currentLanguage === 'en' ? 'Subtotal:' : 'المجموع الفرعي:'} <strong>$${itemSubtotal}</strong></div>
                    </div>
                    <div class="cart-item-subtotal">$${subtotal}</div>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})" title="${currentLanguage === 'en' ? 'Remove item' : 'إزالة العنصر'}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
                <div class="cart-item-controls">
                    <label class="quantity-label">${currentLanguage === 'en' ? 'Quantity:' : 'الكمية:'}</label>
                    <div class="quantity-controls">
                        <button class="quantity-btn quantity-decrease" onclick="updateQuantity(${item.id}, -1)" ${item.quantity <= 1 ? 'disabled' : ''} aria-label="${currentLanguage === 'en' ? 'Decrease quantity' : 'تقليل الكمية'}">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="99" onchange="setQuantity(${item.id}, this.value)" aria-label="${currentLanguage === 'en' ? 'Item quantity' : 'كمية العنصر'}">
                        <button class="quantity-btn quantity-increase" onclick="updateQuantity(${item.id}, 1)" ${item.quantity >= 99 ? 'disabled' : ''} aria-label="${currentLanguage === 'en' ? 'Increase quantity' : 'زيادة الكمية'}">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function updateCartPageDisplays() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Update header displays
    const cartItemCountHeader = document.getElementById('cartItemCountHeader');
    const cartTotalHeader = document.getElementById('cartTotalHeader');
    
    if (cartItemCountHeader) {
        const itemText = currentLanguage === 'en' ? 
            (totalItems === 1 ? '1 item' : `${totalItems} items`) :
            (totalItems === 1 ? '1 عنصر' : `${totalItems} عناصر`);
        cartItemCountHeader.textContent = itemText;
    }
    
    if (cartTotalHeader) {
        cartTotalHeader.textContent = total.toFixed(2);
    }
    
    // Update sidebar summary
    const summaryItemCount = document.getElementById('summaryItemCount');
    const summarySubtotal = document.getElementById('summarySubtotal');
    const summaryTotal = document.getElementById('summaryTotal');
    
    if (summaryItemCount) {
        summaryItemCount.textContent = totalItems;
    }
    
    if (summarySubtotal) {
        summarySubtotal.textContent = total.toFixed(2);
    }
    
    if (summaryTotal) {
        summaryTotal.textContent = total.toFixed(2);
    }
}

function renderRecommendedProducts() {
    const recommendedProducts = document.getElementById('recommendedProducts');
    if (!recommendedProducts) return;
    
    // Get 3 random products that are not in cart
    const availableProducts = products.filter(product => 
        !cart.find(cartItem => cartItem.id === product.id)
    );
    
    const randomProducts = availableProducts
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
    
    recommendedProducts.innerHTML = randomProducts.map(product => {
        const name = currentLanguage === 'en' ? product.name : (product.nameAr || product.name);
        return `
            <div class="recommended-item" onclick="addToCart(${product.id})">
                <div class="recommended-item-image">${product.image}</div>
                <div class="recommended-item-details">
                    <div class="recommended-item-name">${name}</div>
                    <div class="recommended-item-price">$${product.price.toFixed(2)}</div>
                </div>
            </div>
        `;
    }).join('');
}

// Override functions for cart page
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    
    // Update cart page if we're on it
    if (window.location.pathname.includes('cart.html')) {
        renderCartPage();
        updateCartPageDisplays();
        renderRecommendedProducts();
    } else {
        renderCartItems();
    }
    
    saveToLocalStorage('cart', cart);
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCartDisplay();
        
        // Update cart page if we're on it
        if (window.location.pathname.includes('cart.html')) {
            renderCartPage();
            updateCartPageDisplays();
        } else {
            renderCartItems();
        }
        
        saveToLocalStorage('cart', cart);
    }
}

function setQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    const quantity = parseInt(newQuantity);
    
    if (quantity <= 0 || isNaN(quantity)) {
        removeFromCart(productId);
    } else if (quantity <= 99) {
        item.quantity = quantity;
        updateCartDisplay();
        
        // Update cart page if we're on it
        if (window.location.pathname.includes('cart.html')) {
            renderCartPage();
            updateCartPageDisplays();
        } else {
            renderCartItems();
        }
        
        saveToLocalStorage('cart', cart);
    }
}

function clearCart() {
    cart = [];
    updateCartDisplay();
    
    // Update cart page if we're on it
    if (window.location.pathname.includes('cart.html')) {
        renderCartPage();
        updateCartPageDisplays();
        renderRecommendedProducts();
    } else {
        renderCartItems();
    }
    
    localStorage.removeItem('cart');
    showNotification(currentLanguage === 'en' ? 'Cart cleared!' : 'تم إفراغ العربة!', 'success');
}

// Add CSS for notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
