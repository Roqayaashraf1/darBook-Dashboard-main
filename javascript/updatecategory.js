document.addEventListener('DOMContentLoaded', async () => {
    const categoryForm = document.querySelector('form');
    const categoryId = new URLSearchParams(window.location.search).get('id');
    const token = localStorage.getItem('token');

    console.log('Category ID:', categoryId);

    try {
        const categoryRes = await fetch(`http://localhost:3500/api/v1/categories/category-admin/${categoryId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': `${token}`,
                'currency': 'KWD'
            },
        });
        if (categoryRes.status === 401) {
            alert('Session expired. Please log in again.');
            localStorage.removeItem('token');
            window.location.href = './login.html';
        }
        if (!categoryRes.ok) {
            console.error(`Error: ${categoryRes.status} - ${categoryRes.statusText}`);
            throw new Error('Failed to fetch category details');
        }

        const data = await categoryRes.json();
        console.log('Category Details:', data);

        const category = data.category;
        if (category) {
            document.querySelector('input[name="englishname"]').value = category.englishname;
            document.querySelector('input[name="arabicname"]').value = category.arabicname;
        } else {
            alert('Category details not found.');
        }
    } catch (error) {
        console.error('Error fetching category details:', error);
        alert('Failed to fetch category details.');
    }

    categoryForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(categoryForm);
        const englishname = formData.get('englishname');
        const arabicname = formData.get('arabicname');

        try {
            const response = await fetch(`http://localhost:3500/api/v1/categories/${categoryId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'token': `${token}`,
                },
                body: JSON.stringify({ arabicname, englishname }),
            });
            if (response.status === 401) {
                alert('Session expired. Please log in again.');
                localStorage.removeItem('token');
                window.location.href = './login.html';
            }
            if (!response.ok) {
                console.error('Failed request:', response.statusText);
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            alert('Category updated successfully!');
            window.location.href = 'category-history.html';
        } catch (error) {
            console.error('Error updating category:', error);
            alert('Failed to update category.');
        }
    });
});
