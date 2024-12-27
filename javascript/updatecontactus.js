document.addEventListener('DOMContentLoaded', async () => {
    const contactus = document.querySelector('form');
    const contactusId = new URLSearchParams(window.location.search).get('id');

    if (!contactusId) {
        alert('contactus ID is missing in the URL.');
        return;
    }

    const token = localStorage.getItem('token');

    // Fetch existing author details
    try {
        const contactusRes = await fetch(`http://localhost:3500/api/v1/contactus/${contactusId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': `${token}`
            }
        });
        if (contactusRes.status === 401) {
            alert('Session expired. Please log in again.');
            localStorage.removeItem('token');
            window.location.href = './login.html';
        }
        if (!contactusRes.ok) {
            throw new Error('Failed to fetch contactus details');
        }

        const data = await contactusRes.json();
        console.log('contactus Details:', data); // Log the response to verify structure
        const contactus = data.result;

        if (contactus && contactus.title && contactus.email && contactus.message ) {
            document.querySelector('input[name="title"]').value = contactus.title;
            document.querySelector('input[name="email"]').value = contactus.email;
            document.querySelector('input[name="message"]').value = contactus.message;
        } else {
            alert('contactus details not found.');
        }
    } catch (error) {
        console.error('Error fetching contactus details:', error);
        alert('Failed to fetch contactus details.');
    }

    // Update author details
    contactus.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(contactus);
        const title = formData.get('title');
        const email = formData.get('email');
        const message = formData.get('message');
        try {
            const response = await fetch(`http://localhost:3500/api/v1/contactus/${contactusId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'token': `${token}`,
                },
                body: JSON.stringify({ title,email,message }),
            });
            if (response.status === 401) {
                alert('Session expired. Please log in again.');
                localStorage.removeItem('token');
                window.location.href = './login.html';
            }
            if (!response.ok) {
                throw new Error('Failed to update contactus ');
            }

            const data = await response.json();
            window.location.href = 'contactus-history.html';
        } catch (error) {
            console.error('Error updating contactus:', error);
            alert('Failed to update contactus.');
        }
    });
});
