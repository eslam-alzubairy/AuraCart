document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('product-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    let allProducts = [];

    const fetchProducts = async () => {
        try {
            const response = await fetch('products.json');
            if (!response.ok) throw new Error('Network response was not ok');
            allProducts = await response.json();
            renderProducts(allProducts);
        } catch (error) {
            console.error('Fetch error:', error);
            productGrid.innerHTML = '<p>عذراً، حدث خطأ أثناء تحميل المنتجات.</p>';
        }
    };

    const renderProducts = (products) => {
        productGrid.innerHTML = '';
        products.forEach(product => {
            const productCardHTML = `
                <div class="product-card" data-id="${product.id}">
                    <a href="product.html?id=${product.id}">
                        <div class="product-image-container">
                            <img src="${product.images[0]}" alt="${product.name}" class="product-image">
                        </div>
                        <div class="product-info">
                            <p class="product-category">${product.category}</p>
                            <h3 class="product-name">${product.name}</h3>
                            <p class="product-price">
                                <span class="icon-saudi_riyal"></span> ${product.price.toFixed(2)}
                            </p>        
                </div>
                    </a>
                    <button class="add-to-cart-btn">أضف إلى السلة</button>
                </div>
            `;
            productGrid.innerHTML += productCardHTML;
        });
    };

    productGrid.addEventListener('click', (e) => {
        if (e.target.matches('.add-to-cart-btn')) {
            const card = e.target.closest('.product-card');
            const productId = Number(card.dataset.id);
            const product = allProducts.find(p => p.id === productId);
            if (product) {
                addToCart(productId, product);
            }
        }
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.dataset.category;
            
            if (category === 'all') {
                renderProducts(allProducts);
            } else {
                const filteredProducts = allProducts.filter(p => p.category === category);
                renderProducts(filteredProducts);
            }
        });
    });

    fetchProducts();
});