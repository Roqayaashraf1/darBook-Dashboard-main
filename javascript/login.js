document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the default form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3500/api/v1/auth/signin-admin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'currency':"KWD"
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Save the token
            localStorage.setItem('token', data.token);

            // Redirect user to dashboard or another page
            window.location.href = './index.html'; // Adjust the path as needed
        } else {
            // Display error message
            const errorMessage = document.getElementById('error-message');
            errorMessage.textContent = data.message || 'Login failed. Please try again.';
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Login error:', error);
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = 'An error occurred. Please try again.';
        errorMessage.style.display = 'block';
    }
});
