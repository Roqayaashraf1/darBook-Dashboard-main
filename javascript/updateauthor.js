document.addEventListener('DOMContentLoaded', async () => {
    const authorForm = document.querySelector('form');
    const authorId = new URLSearchParams(window.location.search).get('id');

    if (!authorId) {
        alert('Author ID is missing in the URL.');
        return;
    }

    const token = localStorage.getItem('token');

    // Fetch existing author details
    try {
        const authorRes = await fetch(`http://localhost:3500/api/v1/authors/${authorId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': `${token}`,
                'currency': "KWD"
            }
        });
        if (authorRes.status === 401) {
            alert('Session expired. Please log in again.');
            localStorage.removeItem('token');
            window.location.href = './login.html';
        }
        if (!authorRes.ok) {
            throw new Error('Failed to fetch author details');
        }

        const data = await authorRes.json();
        console.log('Author Details:', data); // Log the response to verify structure
        const author = data.result;

        if (author && author.name) {
            document.querySelector('input[name="name"]').value = author.name;
        } else {
            alert('Author details not found.');
        }
    } catch (error) {
        console.error('Error fetching author details:', error);
        alert('Failed to fetch author details.');
    }

    // Update author details
    authorForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(authorForm);
        const name = formData.get('name');

        try {
            const response = await fetch(`http://localhost:3500/api/v1/authors/${authorId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'token': `${token}`,
                },
                body: JSON.stringify({ name }),
            });
            if (response.status === 401) {
                alert('Session expired. Please log in again.');
                localStorage.removeItem('token');
                window.location.href = './login.html';
            }
            if (!response.ok) {
                throw new Error('Failed to update author');
            }

            const data = await response.json();
            window.location.href = 'author-history.html';
        } catch (error) {
            console.error('Error updating author:', error);
            alert('Failed to update author.');
        }
    });
});
