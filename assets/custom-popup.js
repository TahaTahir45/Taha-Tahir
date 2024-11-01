document.addEventListener('DOMContentLoaded', function () {
  const popup = document.getElementById('product-popup');
  const popupTitle = document.getElementById('popup-title');
  const popupPrice = document.getElementById('popup-price');
  const popupDescription = document.getElementById('popup-description');
  const variantSelect = document.getElementById('variant-select');
  const addToCartButton = document.getElementById('add-to-cart');
  let currentProduct = null;

  document.querySelectorAll('.view-details').forEach(button => {
    button.addEventListener('click', function () {
      const handle = this.dataset.productHandle;
      fetch(`/products/${handle}.js`)
        .then(response => response.json())
        .then(product => {
          currentProduct = product;
          popupTitle.textContent = product.title;
          popupPrice.textContent = `$${(product.price / 100).toFixed(2)}`;
          popupDescription.innerHTML = product.description;

          variantSelect.innerHTML = ""; // Clear previous options
          product.variants.forEach(variant => {
            const option = document.createElement('option');
            option.value = variant.id;
            option.textContent = variant.title;
            variantSelect.appendChild(option);
          });
          popup.classList.remove('hidden'); // Show the popup
        });
    });
  });

  // Close popup
  document.querySelector('.close-popup').addEventListener('click', () => {
    popup.classList.add('hidden'); // Hide the popup
  });

  // Add to cart button functionality
  addToCartButton.addEventListener('click', () => {
    const variantId = variantSelect.value;
    const selectedVariant = currentProduct.variants.find(variant => variant.id === parseInt(variantId));
    const itemsToAdd = [{ id: variantId, quantity: 1 }];

    // Add conditional item if variant matches specific criteria
    if (selectedVariant && selectedVariant.title.includes('Black') && selectedVariant.title.includes('Medium')) {
      itemsToAdd.push({
        id: 'SOFT_WINTER_JACKET_VARIANT_ID',
        quantity: 1
      });
    }

    // Add items to cart
    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: itemsToAdd })
    })
      .then(response => {
        if (response.ok) {
          alert('Product(s) added to cart!');
        } else {
          alert('Failed to add product(s) to cart.');
        }
      })
      .catch(error => console.error('Error:', error));
  });
});
