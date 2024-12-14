document.addEventListener('DOMContentLoaded', () => {
    const subcategoryTableBody = document.getElementById('subcategoryTableBody');
    const paginationControls = document.getElementById('paginationControls');
    const btnEn = document.querySelector('#btn-en');
    const btnAr = document.querySelector('#btn-ar');
    let selectedLanguage = 'arabic';
    let currentPage = 1; // Initialize current page
    const token = localStorage.getItem('token');

    btnEn.addEventListener('click', () => {
        selectedLanguage = 'english';
        fetchSubcategory(selectedLanguage, currentPage);
    });

    btnAr.addEventListener('click', () => {
        selectedLanguage = 'arabic';
        fetchSubcategory(selectedLanguage, currentPage);
    });

    async function fetchSubcategory(language, page = 1) {
        try {
            const response = await fetch(`http://localhost:3500/api/v1/subcategory/getallsubcategory-admin?page=${page}`, {
                headers: {
                    'language': language,
                    'token': `${token}`
                }
            });

            const data = await response.json();

            if (data.message === "success") {
                populateTable(data.result, language);
                setupPagination(data.totalPages, page);
                console.log(data.result, language);
            } else {
                console.error('Failed to fetch subcategory:', data.message);
            }
        } catch (error) {
            console.error('Error fetching subcategory:', error);
        }
    }

    function populateTable(subcategories, language) {
        subcategoryTableBody.innerHTML = '';
        subcategories.forEach(subcategory => {
            const category = subcategory.category;
            let categoryDetails = '';

            if (category) {
                categoryDetails = `<td>${language === 'english' ? category.englishname || 'N/A' : category.arabicname || 'N/A'}</td>`;
            } else {
                categoryDetails = '<td colspan="3">N/A</td>';
            }

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${subcategory.name}</td>
                ${categoryDetails}
                <td><a href="edit-subcategory.html?id=${subcategory._id}" class="btn btn-info"><i class="fa fa-edit"></i></a></td>
                <td><button type="button" class="btn btn-danger mt-3" data-id="${subcategory._id}">Delete Subcategory</button></td>
            `;
            subcategoryTableBody.appendChild(row);
        });

        document.querySelectorAll('.btn-danger').forEach(button => {
            button.addEventListener('click', async (event) => {
                const subcategoryId = event.target.getAttribute('data-id');
                try {
                    const response = await fetch(`http://localhost:3500/api/v1/subcategory/${subcategoryId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'token': `${token}`
                        }
                    });

                    const data = await response.json();

                    if (data.message === "success") {
                        event.target.closest('tr').remove();
                        console.log('Subcategory deleted:', data.result);
                    } else {
                        console.error('Failed to delete subcategory:', data.message);
                    }
                } catch (error) {
                    console.error('Error deleting subcategory:', error);
                }
            });
        });
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

    // Initial fetch of subcategories
    fetchSubcategory(selectedLanguage, currentPage);
});
