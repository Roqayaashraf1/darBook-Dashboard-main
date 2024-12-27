document.addEventListener('DOMContentLoaded', async () => {
    const productForm = document.querySelector('form');
    const productId = new URLSearchParams(window.location.search).get('id');
    const token = localStorage.getItem('token');

    // Fetch categories, subcategories, and authors from the API
    try {
        const [categoriesRes, authorsRes ,subcategoryRes] = await Promise.all([
            fetch('http://localhost:3500/api/v1/categories', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'currency':'KWD',
                    'accept-language':"english"
                }
            }),
            fetch('http://localhost:3500/api/v1/authors', {
                method: 'GET',
                headers: {
                    
                    'Content-Type': 'application/json',
                       'currency': "KWD"
                }
            })
        ,
            fetch('http://localhost:3500/api/v1/subcategory', {
                method: 'GET',
                headers: {
                    
                    'Content-Type': 'application/json',
                       'currency': "KWD",
                       'language':"english",
                }
            })
        ]);


        if (categoriesRes.ok) {
            const categoriesData = await categoriesRes.json();
            const categorySelect = document.getElementById('category');
            categoriesData.result.forEach(category => {
                const option = document.createElement('option');
                option.value = category._id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        }
        if (authorsRes.ok) {
            const authorsData = await authorsRes.json();
            const authorSelect = document.getElementById('author');
            authorsData.result.forEach(author => {
                const option = document.createElement('option');
                option.value = author._id;
                option.textContent = author.name;
                authorSelect.appendChild(option);
            });
        }
        if (subcategoryRes.ok) {
            const subcategoryData = await subcategoryRes.json();
            const subcategorySelect = document.getElementById('Subcategory');
            subcategoryData.result.forEach(subcategory => {
                const option = document.createElement('option');
                option.value = subcategory._id;
                option.textContent = subcategory.name;
                subcategorySelect.appendChild(option);
            });
        }

    } catch (error) {
        console.error('Error fetching :', error);
    }

    // Fetch the product details for updating
    try {
        const productRes = await fetch(`http://localhost:3500/api/v1/products/${productId}`, {
            method: 'GET',
            headers: {
                
                'Content-Type': 'application/json',
                'currency':"KWD"  
            }
        });

        if (productRes.ok) {
            const data = await productRes.json();
            const product = data.result;

            // Populate the form with the product data
            document.querySelector('input[name="title"]').value = product.title;
            document.querySelector('input[name="price"]').value = product.price;
            document.querySelector('input[name="quantity"]').value = product.quantity;
            document.querySelector('input[name="sold"]').value = product.sold;
            document.querySelector('input[name="papersnumber"]').value = product.papersnumber;
            document.querySelector('input[name="description"]').value = product.description;

            // Preselect category, subcategory, and author
            document.querySelector('select[name="category"]').value = product.category._id;
            document.querySelector('select[name="author"]').value = product.author._id;
            document.querySelector('select[name="Subcategory"]').value = product.Subcategory._id;
        }
    } catch (error) {
        console.error('Error fetching product details:', error);
    }


    // Handle form submission
    productForm.addEventListener('submit', async (event) => {
        event.preventDefault();  // Prevent default form submission

        const formData = new FormData(productForm);
        formData.append('id', productId);  // Add product ID

        try {
            const updateRes = await fetch(`http://localhost:3500/api/v1/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'token': ` ${token}` 
                },
                body: formData
            });
            if (updateRes.status === 401) {
                alert('Session expired. Please log in again.');
                localStorage.removeItem('token');
                window.location.href = './login.html';
            }
            if (updateRes.ok) {
                const result = await updateRes.json();
                console.log(result);
                window.location.href = 'product-history.html';
            } else {
                alert('Failed to update product');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            alert('An error occurred');
        }
    });
});
