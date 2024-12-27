document.addEventListener('DOMContentLoaded', () => {
    const addcontactusForm = document.getElementById('add-contactus-form');

    addcontactusForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const title = document.querySelector('input[name="title"]').value;
        const email = document.querySelector('input[name="email"]').value;
        const message = document.querySelector('input[name="message"]').value;

        const token = localStorage.getItem('token'); 
        
        try {
            const response = await fetch('http://localhost:3500/api/v1/contactus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': `${token}`
                },
                body: JSON.stringify({
                    title: title,
                    email:email,
                    message:message
                })
            });
            if (response.status === 401) {
                alert('Session expired. Please log in again.');
                localStorage.removeItem('token');
                window.location.href = './login.html';
            }
            const data = await response.json();
        
            if (response.ok) {
                console.log('contactus added successfully:', data);
                addcontactusForm.reset();
                window.location.href = './contactus-history.html';
            } else {
                console.log('Failed to add contactus:', data.message || 'Unknown error');
                alert('Failed to add contactus: ' + (data.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error during contactus creation:', error);
            alert('An error occurred. Please try again.');
        }
    });
});
