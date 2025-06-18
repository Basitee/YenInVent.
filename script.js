 // Data Structure
        let storeData = {
            users: [
                { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
                { id: 2, username: 'manager', password: 'manager123', role: 'manager' },
                { id: 3, username: 'cashier', password: 'cashier123', role: 'cashier' }
            ],
            products: [
                { id: 1, name: 'Laptop', category: 'Electronics', price: 999.99, stock: 15, expiry: '2025-12-31', barcode: '123456789' },
                { id: 2, name: 'Smartphone', category: 'Electronics', price: 699.99, stock: 30, expiry: '2026-06-30', barcode: '987654321' },
                { id: 3, name: 'Headphones', category: 'Electronics', price: 149.99, stock: 45, expiry: '2025-09-15', barcode: '456789123' },
                { id: 4, name: 'Notebook', category: 'Stationery', price: 4.99, stock: 100, expiry: '2027-01-01', barcode: '321654987' },
                { id: 5, name: 'Pen', category: 'Stationery', price: 1.99, stock: 200, expiry: '2026-12-31', barcode: '789123456' },
                { id: 6, name: 'Coffee Mug', category: 'Kitchen', price: 12.99, stock: 25, expiry: '2028-01-01', barcode: '654987321' },
                { id: 7, name: 'Water Bottle', category: 'Kitchen', price: 19.99, stock: 35, expiry: '2027-06-30', barcode: '147258369' },
                { id: 8, name: 'T-shirt', category: 'Clothing', price: 24.99, stock: 50, expiry: '2026-03-31', barcode: '369258147' },
                { id: 9, name: 'Jeans', category: 'Clothing', price: 49.99, stock: 20, expiry: '2026-03-31', barcode: '258369147' },
                { id: 10, name: 'Sneakers', category: 'Footwear', price: 89.99, stock: 18, expiry: '2026-12-31', barcode: '951753852' }
            ],
            sales: [],
            settings: {
                lowStockThreshold: 10,
                expiryWarningDays: 7,
                taxRate: 10
            }
        };

        // Current User
        let currentUser = null;
        let currentPage = 'dashboard';

        // DOM Elements
        const loginScreen = document.getElementById('login-screen');
        const loginContainer = document.getElementById('login-container');
        const loginForm = document.getElementById('login-form');
        const app = document.getElementById('app');
        const userRoleElement = document.getElementById('user-role');
        const logoutBtn = document.getElementById('logout-btn');
        const toggleNavBtn = document.getElementById('toggle-nav');
        const navContainer = document.getElementById('nav-container');
        const mainContent = document.getElementById('main-content');
        const navLinks = document.querySelectorAll('.nav-link');
        const pages = document.querySelectorAll('.page');

        // Dashboard Elements
        const totalProductsElement = document.getElementById('total-products');
        const lowStockElement = document.getElementById('low-stock');
        const expiringSoonElement = document.getElementById('expiring-soon');
        const todaySalesElement = document.getElementById('today-sales');
        const salesChartCanvas = document.getElementById('sales-chart');

        // Inventory Elements
        const inventorySearch = document.getElementById('inventory-search');
        const addProductBtn = document.getElementById('add-product-btn');
        const inventoryTableBody = document.getElementById('inventory-table-body');
        const productModal = document.getElementById('product-modal');
        const productForm = document.getElementById('product-form');
        const saveProductBtn = document.getElementById('save-product-btn');
        const closeProductModal = document.getElementById('close-product-modal');
        const cancelProductBtn = document.getElementById('cancel-product-btn');

        // POS Elements
        const posSearch = document.getElementById('pos-search');
        const productsGrid = document.getElementById('products-grid');
        const cartItems = document.getElementById('cart-items');
        const cartSubtotal = document.getElementById('cart-subtotal');
        const cartTax = document.getElementById('cart-tax');
        const cartTotal = document.getElementById('cart-total');
        const clearCartBtn = document.getElementById('clear-cart-btn');
        const checkoutBtn = document.getElementById('checkout-btn');
        let currentCart = [];

        // Reports Elements
        const reportType = document.getElementById('report-type');
        const startDate = document.getElementById('start-date');
        const endDate = document.getElementById('end-date');
        const generateReportBtn = document.getElementById('generate-report-btn');
        const reportChartCanvas = document.getElementById('report-chart');
        const reportTableBody = document.getElementById('report-table-body');
        const exportReportBtn = document.getElementById('export-report-btn');

        // Settings Elements
        const addUserBtn = document.getElementById('add-user-btn');
        const usersTableBody = document.getElementById('users-table-body');
        const userModal = document.getElementById('user-modal');
        const userForm = document.getElementById('user-form');
        const saveUserBtn = document.getElementById('save-user-btn');
        const closeUserModal = document.getElementById('close-user-modal');
        const cancelUserBtn = document.getElementById('cancel-user-btn');
        const lowStockThreshold = document.getElementById('low-stock-threshold');
        const expiryWarningDays = document.getElementById('expiry-warning-days');
        const taxRate = document.getElementById('tax-rate');
        const saveSettingsBtn = document.getElementById('save-settings-btn');
        const exportProductsBtn = document.getElementById('export-products-btn');
        const exportSalesBtn = document.getElementById('export-sales-btn');
        const backupDataBtn = document.getElementById('backup-data-btn');

        // Confirmation Modal Elements
        const confirmModal = document.getElementById('confirm-modal');
        const confirmMessage = document.getElementById('confirm-message');
        const confirmBtn = document.getElementById('confirm-btn');
        const closeConfirmModal = document.getElementById('close-confirm-modal');
        const cancelConfirmBtn = document.getElementById('cancel-confirm-btn');
        let confirmCallback = null;

        // Initialize the application
        function init() {
            // Load data from localStorage if available
            const savedData = localStorage.getItem('yenInventData');
            if (savedData) {
                storeData = JSON.parse(savedData);
            } else {
                // Create some sample sales data
                const today = new Date();
                const lastMonth = new Date();
                lastMonth.setMonth(lastMonth.getMonth() - 1);
                
                for (let i = 0; i < 30; i++) {
                    const date = new Date(lastMonth);
                    date.setDate(date.getDate() + i);
                    
                    const items = [];
                    const productCount = Math.floor(Math.random() * 5) + 1;
                    let total = 0;
                    
                    for (let j = 0; j < productCount; j++) {
                        const productIndex = Math.floor(Math.random() * storeData.products.length);
                        const product = storeData.products[productIndex];
                        const quantity = Math.floor(Math.random() * 3) + 1;
                        
                        items.push({
                            productId: product.id,
                            name: product.name,
                            price: product.price,
                            quantity: quantity
                        });
                        
                        total += product.price * quantity;
                    }
                    
                    // Add tax
                    total += total * (storeData.settings.taxRate / 100);
                    
                    storeData.sales.push({
                        id: i + 1,
                        date: date.toISOString().split('T')[0],
                        items: items,
                        total: parseFloat(total.toFixed(2)),
                        userId: Math.floor(Math.random() * 3) + 1 // Random user
                    });
                }
                
                saveData();
            }

            // Set up event listeners
            setupEventListeners();

            // Set default dates for reports
            const today = new Date().toISOString().split('T')[0];
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            const lastMonthStr = lastMonth.toISOString().split('T')[0];
            
            startDate.value = lastMonthStr;
            endDate.value = today;

            // Load settings
            lowStockThreshold.value = storeData.settings.lowStockThreshold;
            expiryWarningDays.value = storeData.settings.expiryWarningDays;
            taxRate.value = storeData.settings.taxRate;
        }

        // Set up all event listeners
        function setupEventListeners() {
            // Login
            loginForm.addEventListener('submit', handleLogin);

            // Logout
            logoutBtn.addEventListener('click', handleLogout);

            // Navigation
            toggleNavBtn.addEventListener('click', toggleNav);
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    navigateTo(link.dataset.page);
                });
            });

            // Dashboard
            // No specific event listeners needed for dashboard

            // Inventory
            inventorySearch.addEventListener('input', filterInventory);
            addProductBtn.addEventListener('click', () => openProductModal());
            saveProductBtn.addEventListener('click', saveProduct);
            closeProductModal.addEventListener('click', () => closeModal(productModal));
            cancelProductBtn.addEventListener('click', () => closeModal(productModal));

            // POS
            posSearch.addEventListener('input', filterProducts);
            clearCartBtn.addEventListener('click', clearCart);
            checkoutBtn.addEventListener('click', checkout);

            // Reports
            generateReportBtn.addEventListener('click', generateReport);
            exportReportBtn.addEventListener('click', exportReport);

            // Settings
            addUserBtn.addEventListener('click', () => openUserModal());
            saveUserBtn.addEventListener('click', saveUser);
            closeUserModal.addEventListener('click', () => closeModal(userModal));
            cancelUserBtn.addEventListener('click', () => closeModal(userModal));
            saveSettingsBtn.addEventListener('click', saveSettings);
            exportProductsBtn.addEventListener('click', exportProducts);
            exportSalesBtn.addEventListener('click', exportSales);
            backupDataBtn.addEventListener('click', backupData);

            // Confirmation Modal
            closeConfirmModal.addEventListener('click', () => closeModal(confirmModal));
            cancelConfirmBtn.addEventListener('click', () => closeModal(confirmModal));
            confirmBtn.addEventListener('click', () => {
                if (confirmCallback) confirmCallback();
                closeModal(confirmModal);
            });

            // Window resize for responsive design
            window.addEventListener('resize', handleResize);
        }

        // Handle login
        function handleLogin(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            const user = storeData.users.find(u => u.username === username && u.password === password);
            
            if (user) {
                currentUser = user;
                
                // Animate login screen out
                loginContainer.classList.add('hidden');
                
                setTimeout(() => {
                    loginScreen.style.display = 'none';
                    app.style.display = 'block';
                    
                    // Update UI for logged in user
                    userRoleElement.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
                    
                    // Load the dashboard
                    navigateTo('dashboard');
                    
                    // Check if mobile and collapse nav by default
                    if (window.innerWidth <= 768) {
                        navContainer.classList.remove('active');
                        mainContent.classList.add('expanded');
                    }
                }, 500);
            } else {
                alert('Invalid username or password');
            }
        }

        // Handle logout
        function handleLogout() {
            currentUser = null;
            
            // Reset login form
            loginForm.reset();
            loginContainer.classList.remove('hidden');
            
            // Hide app and show login screen
            app.style.display = 'none';
            loginScreen.style.display = 'flex';
        }

        // Toggle navigation
        function toggleNav() {
            navContainer.classList.toggle('active');
            mainContent.classList.toggle('expanded');
        }

        // Navigate to a page
        function navigateTo(page) {
            // Hide all pages
            pages.forEach(p => p.style.display = 'none');
            
            // Show the selected page
            document.getElementById(`${page}-page`).style.display = 'block';
            
            // Update active nav link
            navLinks.forEach(link => link.classList.remove('active'));
            document.querySelector(`.nav-link[data-page="${page}"]`).classList.add('active');
            
            // Update current page
            currentPage = page;
            
            // Load page-specific content
            switch (page) {
                case 'dashboard':
                    loadDashboard();
                    break;
                case 'inventory':
                    loadInventory();
                    break;
                case 'pos':
                    loadPOS();
                    break;
                case 'reports':
                    loadReports();
                    break;
                case 'settings':
                    loadSettings();
                    break;
            }
            
            // Close nav on mobile
            if (window.innerWidth <= 768) {
                navContainer.classList.remove('active');
                mainContent.classList.add('expanded');
            }
        }

        // Handle window resize
        function handleResize() {
            if (window.innerWidth > 768) {
                navContainer.classList.add('active');
                mainContent.classList.remove('expanded');
            }
        }

        // Load dashboard data
        function loadDashboard() {
            // Total products
            totalProductsElement.textContent = storeData.products.length;
            
            // Low stock items
            const lowStockItems = storeData.products.filter(
                p => p.stock <= storeData.settings.lowStockThreshold
            );
            lowStockElement.textContent = lowStockItems.length;
            
            // Expiring soon
            const today = new Date();
            const warningDate = new Date();
            warningDate.setDate(today.getDate() + storeData.settings.expiryWarningDays);
            
            const expiringSoon = storeData.products.filter(p => {
                if (!p.expiry) return false;
                const expiryDate = new Date(p.expiry);
                return expiryDate <= warningDate && expiryDate >= today;
            });
            expiringSoonElement.textContent = expiringSoon.length;
            
            // Today's sales
            const todayStr = today.toISOString().split('T')[0];
            const todaySales = storeData.sales.filter(s => s.date === todayStr);
            const todayTotal = todaySales.reduce((sum, sale) => sum + sale.total, 0);
            todaySalesElement.textContent = `₵${todayTotal.toFixed(2)}`;
            
            // Sales chart
            renderSalesChart();
        }

        // Render sales chart
        function renderSalesChart() {
            // Group sales by day for the last 30 days
            const salesByDay = {};
            const today = new Date();
            const last30Days = new Date();
            last30Days.setDate(today.getDate() - 30);
            
            // Initialize with 0 sales for each day
            for (let i = 0; i <= 30; i++) {
                const date = new Date(last30Days);
                date.setDate(date.getDate() + i);
                const dateStr = date.toISOString().split('T')[0];
                salesByDay[dateStr] = 0;
            }
            
            // Add actual sales
            storeData.sales.forEach(sale => {
                const saleDate = new Date(sale.date);
                if (saleDate >= last30Days && saleDate <= today) {
                    salesByDay[sale.date] += sale.total;
                }
            });
            
            // Prepare chart data
            const labels = Object.keys(salesByDay).map(date => {
                const d = new Date(date);
                return `${d.getMonth() + 1}/${d.getDate()}`;
            });
            
            const data = Object.values(salesByDay);
            
            // Create or update chart
            if (window.salesChart) {
                window.salesChart.data.labels = labels;
                window.salesChart.data.datasets[0].data = data;
                window.salesChart.update();
            } else {
                const ctx = salesChartCanvas.getContext('2d');
                window.salesChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Sales ($)',
                            data: data,
                            borderColor: 'rgba(52, 152, 219, 1)',
                            backgroundColor: 'rgba(52, 152, 219, 0.1)',
                            borderWidth: 2,
                            tension: 0.4,
                            fill: true
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                display: false
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }
        }

        // Load inventory
        function loadInventory() {
            inventoryTableBody.innerHTML = '';
            
            storeData.products.forEach(product => {
                const row = document.createElement('tr');
                
                // Determine stock status
                let status = '';
                let statusClass = '';
                
                if (product.stock <= storeData.settings.lowStockThreshold) {
                    status = 'Low Stock';
                    statusClass = 'warning';
                } else {
                    status = 'In Stock';
                    statusClass = 'success';
                }
                
                // Check expiry
                if (product.expiry) {
                    const today = new Date();
                    const expiryDate = new Date(product.expiry);
                    const warningDate = new Date();
                    warningDate.setDate(today.getDate() + storeData.settings.expiryWarningDays);
                    
                    if (expiryDate < today) {
                        status = 'Expired';
                        statusClass = 'danger';
                    } else if (expiryDate <= warningDate) {
                        status = 'Expiring Soon';
                        statusClass = 'danger';
                    }
                }
                
                row.innerHTML = `
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>${product.category}</td>
                    <td>₵${product.price.toFixed(2)}</td>
                    <td>${product.stock}</td>
                    <td>${product.expiry || 'N/A'}</td>
                    <td><span class="badge ${statusClass}">${status}</span></td>
                    <td>
                        <button class="action-btn edit-btn" data-id="${product.id}">✏️</button>
                        ${currentUser.role === 'admin' || currentUser.role === 'manager' ? 
                          `<button class="action-btn delete-btn" data-id="${product.id}">🗑️</button>` : ''}
                    </td>
                `;
                
                inventoryTableBody.appendChild(row);
            });
            
            // Add event listeners to edit/delete buttons
            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const productId = parseInt(btn.dataset.id);
                    const product = storeData.products.find(p => p.id === productId);
                    openProductModal(product);
                });
            });
            
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const productId = parseInt(btn.dataset.id);
                    showConfirmation(
                        'Delete Product',
                        'Are you sure you want to delete this product?',
                        () => deleteProduct(productId)
                    );
                });
            });
        }

        // Filter inventory
        function filterInventory() {
            const searchTerm = inventorySearch.value.toLowerCase();
            
            Array.from(inventoryTableBody.children).forEach(row => {
                const productName = row.children[1].textContent.toLowerCase();
                const productCategory = row.children[2].textContent.toLowerCase();
                
                if (productName.includes(searchTerm) || productCategory.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        }

        // Open product modal
        function openProductModal(product = null) {
            const modalTitle = document.getElementById('product-modal-title');
            const productId = document.getElementById('product-id');
            const productName = document.getElementById('product-name');
            const productCategory = document.getElementById('product-category');
            const productPrice = document.getElementById('product-price');
            const productStock = document.getElementById('product-stock');
            const productExpiry = document.getElementById('product-expiry');
            const productBarcode = document.getElementById('product-barcode');
            
            if (product) {
                // Edit mode
                modalTitle.textContent = 'Edit Product';
                productId.value = product.id;
                productName.value = product.name;
                productCategory.value = product.category;
                productPrice.value = product.price;
                productStock.value = product.stock;
                productExpiry.value = product.expiry || '';
                productBarcode.value = product.barcode || '';
            } else {
                // Add mode
                modalTitle.textContent = 'Add Product';
                productForm.reset();
                productId.value = '';
                
                // Generate new ID
                if (storeData.products.length > 0) {
                    productId.value = Math.max(...storeData.products.map(p => p.id)) + 1;
                } else {
                    productId.value = 1;
                }
            }
            
            openModal(productModal);
        }

        // Save product
        function saveProduct() {
            const productId = parseInt(document.getElementById('product-id').value);
            const productName = document.getElementById('product-name').value;
            const productCategory = document.getElementById('product-category').value;
            const productPrice = parseFloat(document.getElementById('product-price').value);
            const productStock = parseInt(document.getElementById('product-stock').value);
            const productExpiry = document.getElementById('product-expiry').value;
            const productBarcode = document.getElementById('product-barcode').value;
            
            if (!productName || !productCategory || isNaN(productPrice) || isNaN(productStock)) {
                alert('Please fill in all required fields');
                return;
            }
            
            const product = {
                id: productId,
                name: productName,
                category: productCategory,
                price: productPrice,
                stock: productStock,
                expiry: productExpiry || null,
                barcode: productBarcode || null
            };
            
            // Check if we're editing or adding
            const existingIndex = storeData.products.findIndex(p => p.id === productId);
            
            if (existingIndex >= 0) {
                // Update existing product
                storeData.products[existingIndex] = product;
            } else {
                // Add new product
                storeData.products.push(product);
            }
            
            saveData();
            closeModal(productModal);
            loadInventory();
            
            // If we're on the POS page, refresh the product grid
            if (currentPage === 'pos') {
                loadPOS();
            }
        }

        // Delete product
        function deleteProduct(id) {
            storeData.products = storeData.products.filter(p => p.id !== id);
            saveData();
            loadInventory();
            
            // If we're on the POS page, refresh the product grid
            if (currentPage === 'pos') {
                loadPOS();
            }
        }

        // Load POS
        function loadPOS() {
            productsGrid.innerHTML = '';
            
            storeData.products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.dataset.id = product.id;
                
                productCard.innerHTML = `
                    <div class="product-image">
                        ${product.name.charAt(0).toUpperCase()}
                    </div>
                    <div class="product-info">
                        <div class="product-name">${product.name}</div>
                        <div class="product-price">₵${product.price.toFixed(2)}</div>
                        <div class="product-stock">${product.stock} in stock</div>
                    </div>
                `;
                
                productCard.addEventListener('click', () => addToCart(product));
                productsGrid.appendChild(productCard);
            });
            
            updateCart();
        }

        // Filter products in POS
        function filterProducts() {
            const searchTerm = posSearch.value.toLowerCase();
            
            Array.from(productsGrid.children).forEach(card => {
                const productName = card.querySelector('.product-name').textContent.toLowerCase();
                
                if (productName.includes(searchTerm)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        // Add to cart
        function addToCart(product) {
            // Check if product is already in cart
            const existingItem = currentCart.find(item => item.productId === product.id);
            
            if (existingItem) {
                // Check if we have enough stock
                if (existingItem.quantity >= product.stock) {
                    alert('Not enough stock available');
                    return;
                }
                
                existingItem.quantity++;
            } else {
                // Check if we have at least 1 in stock
                if (product.stock < 1) {
                    alert('This product is out of stock');
                    return;
                }
                
                // Add new item to cart
                currentCart.push({
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1
                });
            }
            
            updateCart();
        }

        // Update cart display
        function updateCart() {
            cartItems.innerHTML = '';
            
            if (currentCart.length === 0) {
                cartItems.innerHTML = '<p style="text-align: center; color: #777;">Your cart is empty</p>';
                cartSubtotal.textContent = '$0.00';
                cartTax.textContent = '₵0.00';
                cartTotal.textContent = '₵0.00';
                return;
            }
            
            let subtotal = 0;
            
            currentCart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;
                
                cartItem.innerHTML = `
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">₵${item.price.toFixed(2)} each</div>
                    </div>
                    <div class="cart-item-actions">
                        <button class="action-btn decrease-btn" data-id="${item.productId}">−</button>
                        <input type="number" class="cart-item-qty" value="${item.quantity}" min="1" data-id="${item.productId}">
                        <button class="action-btn increase-btn" data-id="${item.productId}">+</button>
                        <button class="action-btn remove-btn" data-id="${item.productId}">🗑️</button>
                    </div>
                `;
                
                cartItems.appendChild(cartItem);
            });
            
            // Calculate tax and total
            const tax = subtotal * (storeData.settings.taxRate / 100);
            const total = subtotal + tax;
            
            cartSubtotal.textContent = `₵${subtotal.toFixed(2)}`;
            cartTax.textContent = `₵${tax.toFixed(2)}`;
            cartTotal.textContent = `₵${total.toFixed(2)}`;
            
            // Add event listeners to cart buttons
            document.querySelectorAll('.decrease-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const productId = parseInt(btn.dataset.id);
                    const item = currentCart.find(item => item.productId === productId);
                    
                    if (item.quantity > 1) {
                        item.quantity--;
                        updateCart();
                    }
                    
                    e.stopPropagation();
                });
            });
            
            document.querySelectorAll('.increase-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const productId = parseInt(btn.dataset.id);
                    const item = currentCart.find(item => item.productId === productId);
                    const product = storeData.products.find(p => p.id === productId);
                    
                    if (item.quantity < product.stock) {
                        item.quantity++;
                        updateCart();
                    } else {
                        alert('Not enough stock available');
                    }
                    
                    e.stopPropagation();
                });
            });
            
            document.querySelectorAll('.cart-item-qty').forEach(input => {
                input.addEventListener('change', (e) => {
                    const productId = parseInt(input.dataset.id);
                    const item = currentCart.find(item => item.productId === productId);
                    const product = storeData.products.find(p => p.id === productId);
                    const newQty = parseInt(input.value);
                    
                    if (newQty >= 1 && newQty <= product.stock) {
                        item.quantity = newQty;
                        updateCart();
                    } else if (newQty > product.stock) {
                        alert('Not enough stock available');
                        input.value = item.quantity;
                    } else {
                        input.value = item.quantity;
                    }
                    
                    e.stopPropagation();
                });
            });
            
            document.querySelectorAll('.remove-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const productId = parseInt(btn.dataset.id);
                    currentCart = currentCart.filter(item => item.productId !== productId);
                    updateCart();
                    
                    e.stopPropagation();
                });
            });
        }

        // Clear cart
        function clearCart() {
            currentCart = [];
            updateCart();
        }

        // Checkout
        function checkout() {
            if (currentCart.length === 0) {
                alert('Your cart is empty');
                return;
            }
            
            // Check stock availability
            for (const item of currentCart) {
                const product = storeData.products.find(p => p.id === item.productId);
                
                if (product.stock < item.quantity) {
                    alert(`Not enough stock available for ${product.name}`);
                    return;
                }
            }
            
            // Process checkout
            const today = new Date().toISOString().split('T')[0];
            const subtotal = currentCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const tax = subtotal * (storeData.settings.taxRate / 100);
            const total = subtotal + tax;
            
            // Create sale record
            const newSale = {
                id: storeData.sales.length > 0 ? Math.max(...storeData.sales.map(s => s.id)) + 1 : 1,
                date: today,
                items: [...currentCart],
                total: parseFloat(total.toFixed(2)),
                userId: currentUser.id
            };
            
            // Update product stock
            currentCart.forEach(item => {
                const product = storeData.products.find(p => p.id === item.productId);
                product.stock -= item.quantity;
            });
            
            // Add to sales
            storeData.sales.push(newSale);
            saveData();
            
            // Clear cart
            currentCart = [];
            updateCart();
            
            // Show success message
            alert(`Sale completed successfully! Total: ₵${total.toFixed(2)}`);
            
            // Refresh dashboard if we're on it
            if (currentPage === 'dashboard') {
                loadDashboard();
            }
        }

        // Load reports
        function loadReports() {
            // Set default report to daily sales
            reportType.value = 'daily';
            generateReport();
        }

        // Generate report
        function generateReport() {
            const type = reportType.value;
            const start = startDate.value;
            const end = endDate.value;
            
            if (!start || !end) {
                alert('Please select a date range');
                return;
            }
            
            // Filter sales by date range
            const filteredSales = storeData.sales.filter(sale => {
                return sale.date >= start && sale.date <= end;
            });
            
            if (filteredSales.length === 0) {
                alert('No sales data found for the selected date range');
                return;
            }
            
            // Generate report based on type
            switch (type) {
                case 'daily':
                    generateDailyReport(filteredSales);
                    break;
                case 'monthly':
                    generateMonthlyReport(filteredSales);
                    break;
                case 'inventory':
                    generateInventoryReport();
                    break;
            }
        }

        // Generate daily sales report
        function generateDailyReport(sales) {
            // Group sales by day
            const salesByDay = {};
            
            sales.forEach(sale => {
                if (!salesByDay[sale.date]) {
                    salesByDay[sale.date] = {
                        total: 0,
                        items: 0
                    };
                }
                
                salesByDay[sale.date].total += sale.total;
                salesByDay[sale.date].items += sale.items.reduce((sum, item) => sum + item.quantity, 0);
            });
            
            // Prepare data for table
            reportTableBody.innerHTML = '';
            
            Object.entries(salesByDay).forEach(([date, data]) => {
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>${formatDate(date)}</td>
                    <td>₵${data.total.toFixed(2)}</td>
                    <td>${data.items}</td>
                    <td>
                        <button class="action-btn view-btn" data-date="${date}">👁️ View</button>
                    </td>
                `;
                
                reportTableBody.appendChild(row);
            });
            
            // Add event listeners to view buttons
            document.querySelectorAll('.view-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const date = btn.dataset.date;
                    viewDailySalesDetails(date);
                });
            });
            
            // Prepare data for chart
            const labels = Object.keys(salesByDay).map(date => formatDate(date));
            const totals = Object.values(salesByDay).map(data => data.total);
            
            // Render chart
            renderReportChart(labels, totals, 'Daily Sales');
        }

        // Generate monthly sales report
        function generateMonthlyReport(sales) {
            // Group sales by month
            const salesByMonth = {};
            
            sales.forEach(sale => {
                const [year, month] = sale.date.split('-').slice(0, 2);
                const monthKey = `${year}-${month}`;
                
                if (!salesByMonth[monthKey]) {
                    salesByMonth[monthKey] = {
                        total: 0,
                        items: 0
                    };
                }
                
                salesByMonth[monthKey].total += sale.total;
                salesByMonth[monthKey].items += sale.items.reduce((sum, item) => sum + item.quantity, 0);
            });
            
            // Prepare data for table
            reportTableBody.innerHTML = '';
            
            Object.entries(salesByMonth).forEach(([month, data]) => {
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>${formatMonth(month)}</td>
                    <td>₵${data.total.toFixed(2)}</td>
                    <td>${data.items}</td>
                    <td>
                        <button class="action-btn view-btn" data-month="${month}">👁️ View</button>
                    </td>
                `;
                
                reportTableBody.appendChild(row);
            });
            
            // Add event listeners to view buttons
            document.querySelectorAll('.view-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const month = btn.dataset.month;
                    viewMonthlySalesDetails(month);
                });
            });
            
            // Prepare data for chart
            const labels = Object.keys(salesByMonth).map(month => formatMonth(month));
            const totals = Object.values(salesByMonth).map(data => data.total);
            
            // Render chart
            renderReportChart(labels, totals, 'Monthly Sales');
        }

        // Generate inventory report
        function generateInventoryReport() {
            // Prepare data for table
            reportTableBody.innerHTML = '';
            
            // Sort products by stock level (low to high)
            const sortedProducts = [...storeData.products].sort((a, b) => a.stock - b.stock);
            
            sortedProducts.forEach(product => {
                const row = document.createElement('tr');
                
                // Determine status
                let status = '';
                if (product.stock <= storeData.settings.lowStockThreshold) {
                    status = 'Low Stock';
                } else {
                    status = 'In Stock';
                }
                
                // Check expiry
                if (product.expiry) {
                    const today = new Date();
                    const expiryDate = new Date(product.expiry);
                    const warningDate = new Date();
                    warningDate.setDate(today.getDate() + storeData.settings.expiryWarningDays);
                    
                    if (expiryDate < today) {
                        status = 'Expired';
                    } else if (expiryDate <= warningDate) {
                        status = 'Expiring Soon';
                    }
                }
                
                row.innerHTML = `
                    <td>${product.name}</td>
                    <td>${product.category}</td>
                    <td>${product.stock}</td>
                    <td>${product.expiry || 'N/A'}</td>
                    <td>${status}</td>
                `;
                
                reportTableBody.appendChild(row);
            });
            
            // Prepare data for chart - top 10 products by stock
            const topProducts = [...storeData.products]
                .sort((a, b) => b.stock - a.stock)
                .slice(0, 10);
            
            const labels = topProducts.map(p => p.name);
            const data = topProducts.map(p => p.stock);
            
            // Render chart
            renderReportChart(labels, data, 'Top Products by Stock', 'bar');
        }

        // View daily sales details
        function viewDailySalesDetails(date) {
            const dailySales = storeData.sales.filter(sale => sale.date === date);
            
            if (dailySales.length === 0) {
                alert('No sales found for this date');
                return;
            }
            
            let message = `Sales for ${formatDate(date)}:\n\n`;
            let total = 0;
            
            dailySales.forEach(sale => {
                const user = storeData.users.find(u => u.id === sale.userId);
                message += `Sale #${sale.id} (by ${user.username}): ₵${sale.total.toFixed(2)}\n`;
                total += sale.total;
                
                sale.items.forEach(item => {
                    message += `- ${item.name} (${item.quantity} @ ₵${item.price.toFixed(2)})\n`;
                });
                
                message += '\n';
            });
            
            message += `Total for day: ₵${total.toFixed(2)}`;
            
            alert(message);
        }

        // View monthly sales details
        function viewMonthlySalesDetails(month) {
            const monthlySales = storeData.sales.filter(sale => {
                const [year, m] = sale.date.split('-').slice(0, 2);
                return `${year}-${m}` === month;
            });
            
            if (monthlySales.length === 0) {
                alert('No sales found for this month');
                return;
            }
            
            let message = `Sales for ${formatMonth(month)}:\n\n`;
            let total = 0;
            
            // Group by day
            const salesByDay = {};
            
            monthlySales.forEach(sale => {
                if (!salesByDay[sale.date]) {
                    salesByDay[sale.date] = 0;
                }
                
                salesByDay[sale.date] += sale.total;
                total += sale.total;
            });
            
            Object.entries(salesByDay).forEach(([date, dailyTotal]) => {
                message += `${formatDate(date)}: ₵${dailyTotal.toFixed

                (2)}\n`;
                            });

                            message += `\nTotal for month: ₵${total.toFixed(2)}`;

                            alert(message);
                        }

                        // Render report chart
                        function renderReportChart(labels, data, label, type = 'line') {
                            if (window.reportChart) {
                                window.reportChart.data.labels = labels;
                                window.reportChart.data.datasets[0].data = data;
                                window.reportChart.data.datasets[0].label = label;
                                window.reportChart.config.type = type;
                                window.reportChart.update();
                            } else {
                                const ctx = reportChartCanvas.getContext('2d');
                                window.reportChart = new Chart(ctx, {
                                    type: type,
                                    data: {
                                        labels: labels,
                                        datasets: [{
                                            label: label,
                                            data: data,
                                            borderColor: 'rgba(52, 152, 219, 1)',
                                            backgroundColor: 'rgba(52, 152, 219, 0.1)',
                                            borderWidth: 2,
                                            tension: 0.4,
                                            fill: true
                                        }]
                                    },
                                    options: {
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                display: false
                                            }
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true
                                            }
                                        }
                                    }
                                });
                            }
                        }

                        // Export report as CSV
                        function exportReport() {
                            let csv = '';
                            const rows = reportTableBody.parentElement.querySelectorAll('tr');
                            rows.forEach(row => {
                                const cols = row.querySelectorAll('th, td');
                                const rowData = Array.from(cols).map(col => `"${col.textContent.replace(/"/g, '""')}"`);
                                csv += rowData.join(',') + '\n';
                            });

                            const blob = new Blob([csv], { type: 'text/csv' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'report.csv';
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                        }

                        // Export products as CSV
                        function exportProducts() {
                            let csv = 'ID,Name,Category,Price,Stock,Expiry,Barcode\n';
                            storeData.products.forEach(p => {
                                csv += `${p.id},"${p.name}","${p.category}",${p.price},${p.stock},"${p.expiry || ''}","${p.barcode || ''}"\n`;
                            });

                            const blob = new Blob([csv], { type: 'text/csv' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'products.csv';
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                        }

                        // Export sales as CSV
                        function exportSales() {
                            let csv = 'Sale ID,Date,User,Total,Items\n';
                            storeData.sales.forEach(sale => {
                                const user = storeData.users.find(u => u.id === sale.userId);
                                const items = sale.items.map(i => `${i.name} (${i.quantity})`).join('; ');
                                csv += `${sale.id},${sale.date},${user ? user.username : ''},${sale.total},"${items}"\n`;
                            });

                            const blob = new Blob([csv], { type: 'text/csv' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'sales.csv';
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                        }

                        // Backup all data as JSON
                        function backupData() {
                            const dataStr = JSON.stringify(storeData, null, 2);
                            const blob = new Blob([dataStr], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'yeninvent-backup.json';
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                        }

                        // Load settings
                        function loadSettings() {
                            usersTableBody.innerHTML = '';
                            storeData.users.forEach(user => {
                                const row = document.createElement('tr');
                                row.innerHTML = `
                                    <td>${user.username}</td>
                                    <td>${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</td>
                                    <td>
                                        <button class="action-btn edit-user-btn" data-id="${user.id}">✏️</button>
                                        ${user.role !== 'admin' ? `<button class="action-btn delete-user-btn" data-id="${user.id}">🗑️</button>` : ''}
                                    </td>
                                `;
                                usersTableBody.appendChild(row);
                            });

                            // Edit user
                            document.querySelectorAll('.edit-user-btn').forEach(btn => {
                                btn.addEventListener('click', () => {
                                    const userId = parseInt(btn.dataset.id);
                                    const user = storeData.users.find(u => u.id === userId);
                                    openUserModal(user);
                                });
                            });

                            // Delete user
                            document.querySelectorAll('.delete-user-btn').forEach(btn => {
                                btn.addEventListener('click', () => {
                                    const userId = parseInt(btn.dataset.id);
                                    showConfirmation(
                                        'Delete User',
                                        'Are you sure you want to delete this user?',
                                        () => deleteUser(userId)
                                    );
                                });
                            });

                            // Load settings values
                            lowStockThreshold.value = storeData.settings.lowStockThreshold;
                            expiryWarningDays.value = storeData.settings.expiryWarningDays;
                            taxRate.value = storeData.settings.taxRate;
                        }

                        // Open user modal
                        function openUserModal(user = null) {
                            const modalTitle = document.getElementById('user-modal-title');
                            const userId = document.getElementById('user-id');
                            const userUsername = document.getElementById('user-username');
                            const userPassword = document.getElementById('user-password');
                            const userRoleSelect = document.getElementById('user-role');

                            if (user) {
                                modalTitle.textContent = 'Edit User';
                                userId.value = user.id;
                                userUsername.value = user.username;
                                userPassword.value = user.password;
                                userRoleSelect.value = user.role;
                            } else {
                                modalTitle.textContent = 'Add User';
                                userForm.reset();
                                userId.value = '';
                                userRoleSelect.value = 'cashier';
                            }

                            openModal(userModal);
                        }

                        // Save user
                        function saveUser() {
                            const userId = document.getElementById('user-id').value;
                            const username = document.getElementById('user-username').value;
                            const password = document.getElementById('user-password').value;
                            const role = document.getElementById('user-role').value;

                            if (!username || !password || !role) {
                                alert('Please fill in all required fields');
                                return;
                            }

                            if (userId) {
                                // Edit
                                const user = storeData.users.find(u => u.id === parseInt(userId));
                                if (user) {
                                    user.username = username;
                                    user.password = password;
                                    user.role = role;
                                }
                            } else {
                                // Add
                                const newId = storeData.users.length > 0 ? Math.max(...storeData.users.map(u => u.id)) + 1 : 1;
                                storeData.users.push({
                                    id: newId,
                                    username,
                                    password,
                                    role
                                });
                            }

                            saveData();
                            closeModal(userModal);
                            loadSettings();
                        }

                        // Delete user
                        function deleteUser(id) {
                            storeData.users = storeData.users.filter(u => u.id !== id);
                            saveData();
                            loadSettings();
                        }

                        // Save settings
                        function saveSettings() {
                            storeData.settings.lowStockThreshold = parseInt(lowStockThreshold.value) || 10;
                            storeData.settings.expiryWarningDays = parseInt(expiryWarningDays.value) || 7;
                            storeData.settings.taxRate = parseFloat(taxRate.value) || 10;
                            saveData();
                            alert('Settings saved!');
                            // Refresh dashboard and inventory if needed
                            if (currentPage === 'dashboard') loadDashboard();
                            if (currentPage === 'inventory') loadInventory();
                        }

                        // Modal helpers
                        function openModal(modal) {
                            modal.classList.add('active');
                        }
                        function closeModal(modal) {
                            modal.classList.remove('active');
                        }

                        // Confirmation modal
                        function showConfirmation(title, message, callback) {
                            document.getElementById('confirm-modal-title').textContent = title;
                            confirmMessage.textContent = message;
                            confirmCallback = callback;
                            openModal(confirmModal);
                        }

                        // Save data to localStorage
                        function saveData() {
                            localStorage.setItem('yenInventData', JSON.stringify(storeData));
                        }

                        // Format date
                        function formatDate(dateStr) {
                            const d = new Date(dateStr);
                            return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
                        }

                        // Format month
                        function formatMonth(monthStr) {
                            const [year, month] = monthStr.split('-');
                            return `${year}-${month}`;
                        }

                        // Initialize app on load
                        window.onload = init;


                        /**
                         * Restrict navigation and actions based on user role.
                         */
                        function applyRolePermissions() {
                            // Hide or show nav items
                            document.querySelectorAll('.nav-link').forEach(link => {
                                const page = link.dataset.page;
                                if (currentUser.role === 'admin') {
                                    link.style.display = '';
                                } else if (currentUser.role === 'manager') {
                                    // Manager: dashboard, inventory, reports
                                    if (['dashboard', 'inventory', 'reports'].includes(page)) {
                                        link.style.display = '';
                                    } else {
                                        link.style.display = 'none';
                                    }
                                } else if (currentUser.role === 'cashier') {
                                    // Cashier: dashboard, pos, reports
                                    if (['dashboard', 'pos', 'reports'].includes(page)) {
                                        link.style.display = '';
                                    } else {
                                        link.style.display = 'none';
                                    }
                                }
                            });

                            // Hide add/edit/delete product buttons for cashier
                            if (currentUser.role === 'cashier') {
                                addProductBtn.style.display = 'none';
                            } else {
                                addProductBtn.style.display = '';
                            }

                            // Hide settings page for non-admins
                            if (currentUser.role !== 'admin') {
                                document.querySelector('.nav-link[data-page="settings"]').style.display = 'none';
                            } else {
                                document.querySelector('.nav-link[data-page="settings"]').style.display = '';
                            }
                        }

                        // Patch navigation to prevent access to unauthorized pages
                        const originalNavigateTo = navigateTo;
                        navigateTo = function(page) {
                            // Role-based access control
                            if (currentUser.role === 'manager' && !['dashboard', 'inventory', 'reports'].includes(page)) {
                                alert('Access denied: Managers can only access Dashboard, Inventory, and Reports.');
                                return;
                            }
                            if (currentUser.role === 'cashier' && !['dashboard', 'pos', 'reports'].includes(page)) {
                                alert('Access denied: Cashiers can only access Dashboard, POS, and Reports.');
                                return;
                            }
                            originalNavigateTo(page);
                        };

                        // Patch openProductModal to prevent cashiers from adding/editing products
                        const originalOpenProductModal = openProductModal;
                        openProductModal = function(product = null) {
                            if (currentUser.role === 'cashier') {
                                alert('Access denied: Cashiers cannot add or edit products.');
                                return;
                            }
                            originalOpenProductModal(product);
                        };

                        // Patch saveProduct to prevent cashiers from saving products
                        const originalSaveProduct = saveProduct;
                        saveProduct = function() {
                            if (currentUser.role === 'cashier') {
                                alert('Access denied: Cashiers cannot add or edit products.');
                                return;
                            }
                            originalSaveProduct();
                        };

                        // Patch deleteProduct to prevent cashiers from deleting products
                        const originalDeleteProduct = deleteProduct;
                        deleteProduct = function(id) {
                            if (currentUser.role === 'cashier') {
                                alert('Access denied: Cashiers cannot delete products.');
                                return;
                            }
                            originalDeleteProduct(id);
                        };

                        // Patch openUserModal, saveUser, deleteUser for admin only
                        const originalOpenUserModal = openUserModal;
                        openUserModal = function(user = null) {
                            if (currentUser.role !== 'admin') {
                                alert('Access denied: Only admins can manage users.');
                                return;
                            }
                            originalOpenUserModal(user);
                        };
                        const originalSaveUser = saveUser;
                        saveUser = function() {
                            if (currentUser.role !== 'admin') {
                                alert('Access denied: Only admins can manage users.');
                                return;
                            }
                            originalSaveUser();
                        };
                        const originalDeleteUser = deleteUser;
                        deleteUser = function(id) {
                            if (currentUser.role !== 'admin') {
                                alert('Access denied: Only admins can manage users.');
                                return;
                            }
                            originalDeleteUser(id);
                        };

                        // Patch saveSettings for admin only
                        const originalSaveSettings = saveSettings;
                        saveSettings = function() {
                            if (currentUser.role !== 'admin') {
                                alert('Access denied: Only admins can change system settings.');
                                return;
                            }
                            originalSaveSettings();
                        };

                        // Patch exportProducts, exportSales, backupData for admin only
                        const originalExportProducts = exportProducts;
                        exportProducts = function() {
                            if (currentUser.role !== 'admin') {
                                alert('Access denied: Only admins can export product list.');
                                return;
                            }
                            originalExportProducts();
                        };
                        const originalExportSales = exportSales;
                        exportSales = function() {
                            if (currentUser.role !== 'admin') {
                                alert('Access denied: Only admins can export sales data.');
                                return;
                            }
                            originalExportSales();
                        };
                        const originalBackupData = backupData;
                        backupData = function() {
                            if (currentUser.role !== 'admin') {
                                alert('Access denied: Only admins can backup data.');
                                return;
                            }
                            originalBackupData();
                        };

                        // Call applyRolePermissions after login
                        const originalHandleLogin = handleLogin;
                        handleLogin = function(e) {
                            originalHandleLogin.call(this, e);
                            if (currentUser) {
                                applyRolePermissions();
                            }
                        };

                        /**
                         * Dark Mode Support
                         */

                        // Add dark mode toggle button to header
                        const darkModeBtn = document.createElement('button');
                        darkModeBtn.className = 'logout-btn';
                        darkModeBtn.id = 'dark-mode-btn';
                        darkModeBtn.style.marginRight = '1rem';
                        darkModeBtn.innerHTML = '<span id="dark-mode-icon">🌙</span>';
                        // Insert before logout button
                        logoutBtn.parentNode.insertBefore(darkModeBtn, logoutBtn);

                        // Add dark mode CSS
                        const darkModeStyle = document.createElement('style');
                        darkModeStyle.innerHTML = `
                        body.dark-mode {
                            background-color: #181a1b;
                            color: #f5f6fa;
                        }
                        body.dark-mode .login-container,
                        body.dark-mode .stat-card,
                        body.dark-mode .chart-container,
                        body.dark-mode .table-container,
                        body.dark-mode .cart-container,
                        body.dark-mode .modal-content,
                        body.dark-mode .product-card {
                            background: #23272b !important;
                            color: #f5f6fa !important;
                            box-shadow: 0 5px 15px rgba(0,0,0,0.3) !important;
                        }
                        body.dark-mode .nav-container {
                            background: #181a1b !important;
                            color: #f5f6fa !important;
                        }
                        body.dark-mode .main-content {
                            background: #181a1b !important;
                        }
                        body.dark-mode .app-header {
                            background: #23272b !important;
                            color: #f5f6fa !important;
                        }
                        body.dark-mode .btn,
                        body.dark-mode .btn-secondary {
                            background: #2980b9 !important;
                            color: #f5f6fa !important;
                        }
                        body.dark-mode .btn-secondary {
                            background: #444950 !important;
                        }
                        body.dark-mode .nav-link {
                            color: #f5f6fa !important;
                        }
                        body.dark-mode .nav-link.active,
                        body.dark-mode .nav-link:hover {
                            background: rgba(255,255,255,0.05) !important;
                            border-left: 3px solid #3498db !important;
                        }
                        body.dark-mode table {
                            background: #23272b !important;
                            color: #f5f6fa !important;
                        }
                        body.dark-mode th {
                            background: #23272b !important;
                            color: #f5f6fa !important;
                        }
                        body.dark-mode tr:hover {
                            background: #23272b !important;
                        }
                        body.dark-mode input,
                        body.dark-mode select,
                        body.dark-mode textarea {
                            background: #23272b !important;
                            color: #f5f6fa !important;
                            border: 1px solid #444950 !important;
                        }
                        body.dark-mode .search-box {
                            background: #23272b !important;
                        }
                        body.dark-mode .badge.success {
                            background: #214d36 !important;
                            color: #2ecc71 !important;
                        }
                        body.dark-mode .badge.warning {
                            background: #4d3e21 !important;
                            color: #f39c12 !important;
                        }
                        body.dark-mode .badge.danger {
                            background: #4d2121 !important;
                            color: #e74c3c !important;
                        }
                        body.dark-mode .modal {
                            background: rgba(0,0,0,0.8) !important;
                        }
                        `;
                        document.head.appendChild(darkModeStyle);

                        // Dark mode logic
                        function setDarkMode(enabled) {
                            if (enabled) {
                                document.body.classList.add('dark-mode');
                                document.getElementById('dark-mode-icon').textContent = '☀️';
                                localStorage.setItem('yenInventDarkMode', '1');
                            } else {
                                document.body.classList.remove('dark-mode');
                                document.getElementById('dark-mode-icon').textContent = '🌙';
                                localStorage.setItem('yenInventDarkMode', '0');
                            }
                        }

                        // Toggle dark mode on button click
                        darkModeBtn.addEventListener('click', () => {
                            setDarkMode(!document.body.classList.contains('dark-mode'));
                        });

                        // On load, check dark mode preference
                        (function() {
                            const darkPref = localStorage.getItem('yenInventDarkMode');
                            if (
                                darkPref === '1' ||
                                (darkPref === null && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
                            ) {
                                setDarkMode(true);
                            }
                        })();
