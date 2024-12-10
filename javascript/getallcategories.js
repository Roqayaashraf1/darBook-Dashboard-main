document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#example tbody');
    const btnEn = document.querySelector('#btn-en');
    const btnAr = document.querySelector('#btn-ar');
    let selectedLanguage = 'ar';
    let currentPage = 1;
    const paginationControls = document.getElementById('paginationControls');
    const token = localStorage.getItem('token');
    btnEn.addEventListener('click', () => {
        selectedLanguage = 'en';
        fetchCategories(selectedLanguage);
    });

    btnAr.addEventListener('click', () => {
        selectedLanguage = 'ar';
        fetchCategories(selectedLanguage);
    });

    async function fetchCategories(language, page = 1) {
        try {
            const response = await fetch(`http://localhost:3500/api/v1/categories?page=${page}`, {
                headers: {
                    'accept-language': language,
                    'currency': "KWD"
                }
            });

            const data = await response.json();

            if (data.message === "success") {
                populateTable(data.result, language);
                setupPagination(data.totalPages, page);
                populateTable(data.result);
            } else {
                console.error('Failed to fetch categories:', data.message);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }

    function populateTable(categories) {
        tableBody.innerHTML = '';
        categories.forEach(category => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${category.name}</td>
                
                     <td><a href="edit-category.html ?id=${category._id}"  class="btn btn-info"><i class="fa fa-edit"></i></a></td>
                 <button type="button" class="btn btn-danger mt-3" data-category-id="${category._id}">Delete category</button>
            `;

            tableBody.appendChild(row);
        });

        tableBody.querySelectorAll('.btn-danger').forEach(button => {
            button.addEventListener('click', async (event) => {
                const categoryId = event.target.getAttribute('data-category-id');
                if (confirm('Are you sure you want to delete this category?')) {
                    await deleteCategory(categoryId);
                }
            });
        });
    }

    async function deleteCategory(id) {
        try {
            const response = await fetch(`http://localhost:3500/api/v1/categories/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'token': `${token}`

                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete category');
            }

            alert('category deleted successfully');
            fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Failed to delete category. Please try again.');
        }
    }
    function setupPagination(totalPages, currentPage) {
        paginationControls.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.classList.add('pagination-btn');
            if (i === currentPage) {
                button.classList.add('active');
            }
            button.addEventListener('click', () => {
                fetchSubcategory(selectedLanguage, i);
            });
            paginationControls.appendChild(button);
        }
    }


    fetchCategories(selectedLanguage,currentPage);
});