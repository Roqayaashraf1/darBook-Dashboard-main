document.addEventListener('DOMContentLoaded', async () => {
    const subcategoryForm = document.querySelector('form');
    const subcategoryId = new URLSearchParams(window.location.search).get('id');
    const token = localStorage.getItem('token');
    console.log('subcategory ID:', subcategoryId);

    // Fetch and populate subcategory details
    const fetchsubcategoryDetails = async () => {
        try {
            const subcategoryRes = await fetch(`http://localhost:3500/api/v1/subcategory/admin/${subcategoryId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'token': `${token}`,
                    'currency': 'KWD',
                },
            });

            if (!subcategoryRes.ok) {
                console.error(`Error: ${subcategoryRes.status} - ${subcategoryRes.statusText}`);
                throw new Error('Failed to fetch subcategory details');
            }

            const data = await subcategoryRes.json();
            console.log('subcategory Details:', data);

            const subcategory = data.result; // Ensure correct key from API response
            if (subcategory) {
                document.querySelector('input[name="englishname"]').value = subcategory.englishname;
                document.querySelector('input[name="arabicname"]').value = subcategory.arabicname;
            } else {
                alert('subcategory details not found.');
            }
        } catch (error) {
            console.error('Error fetching subcategory details:', error);
            alert('Failed to fetch subcategory details.');
        }
    };

    await fetchsubcategoryDetails();

    // Handle form submission for updating subcategory
    subcategoryForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(subcategoryForm);
        const arabicname = formData.get('arabicname');
        const englishname = formData.get('englishname');

        try {
            const response = await fetch(`http://localhost:3500/api/v1/subcategory/${subcategoryId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'token': `${token}`,
                },
                body: JSON.stringify({ englishname, arabicname }),
            });

            if (!response.ok) {
                console.error('Failed request:', response.statusText);
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            alert('subcategory updated successfully!');
            window.location.href = 'subcategory-history.html';
        } catch (error) {
            console.error('Error updating subcategory:', error);
            alert('Failed to update subcategory.');
        }
    });
});
