document.addEventListener('DOMContentLoaded', async () => {
    const productDetailsContent = document.getElementById('product-details-content');
    let allProducts = [];

    const getProductIdFromURL = () => {
        const params = new URLSearchParams(window.location.search);
        return Number(params.get('id'));
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch('products.json');
            if (!response.ok) throw new Error('Network response was not ok');
            allProducts = await response.json();
            return allProducts;
        } catch (error) {
            console.error('Fetch error:', error);
            return [];
        }
    };

    const renderProductDetails = (product) => {
        if (!product) {
            productDetailsContent.innerHTML = '<p>لم يتم العثور على المنتج.</p>';
            return;
        }

        const thumbnailsHTML = product.images.map((img, index) => 
            `<img src="${img}" alt="Thumbnail ${index + 1}" class="thumb-img ${index === 0 ? 'active' : ''}">`
        ).join('');

        const productDetailsHTML = `
            <div class="product-gallery">
                <img src="${product.images[0]}" alt="${product.name}" class="main-image">
                <div class="thumbnail-images">
                    ${thumbnailsHTML}
                </div>
            </div>
            <div class="product-details-info">
                <p class="category">${product.category}</p>
                <h1 class="name">${product.name}</h1>
                <p class="price">${product.price.toFixed(2)} ر.س</p>
                <p class="description">${product.description}</p>
                <button class="add-to-cart-btn" data-id="${product.id}">أضف إلى السلة</button>
            </div>
        `;
        productDetailsContent.innerHTML = productDetailsHTML;
    };

    const initPage = async () => {
        const products = await fetchProducts();
        const productId = getProductIdFromURL();
        const product = products.find(p => p.id === productId);
        renderProductDetails(product);
    };

    productDetailsContent.addEventListener('click', (e) => {
        // Handle add to cart
        if (e.target.matches('.add-to-cart-btn')) {
            const productId = Number(e.target.dataset.id);
            const product = allProducts.find(p => p.id === productId);
            if (product) {
                addToCart(productId, product);
            }
        }

        // Handle thumbnail click
        if (e.target.matches('.thumb-img')) {
            const mainImage = document.querySelector('.main-image');
            mainImage.src = e.target.src;
            
            document.querySelectorAll('.thumb-img').forEach(img => img.classList.remove('active'));
            e.target.classList.add('active');
        }
    });

    initPage();
});