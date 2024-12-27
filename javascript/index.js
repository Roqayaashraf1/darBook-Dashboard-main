function decodeToken(token) {
    try {
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = atob(payloadBase64); 
        return JSON.parse(decodedPayload);
    } catch (error) {
        console.error("Invalid token format:", error);
        return null;
    }
}

// Check token expiration on page load
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('You are not logged in. Redirecting to login page.');
        window.location.href = './login.html?reason=not_logged_in';
        return;
    }

    const decodedToken = decodeToken(token);
    const currentTime = Math.floor(Date.now() / 1000); 

    if (!decodedToken || decodedToken.exp < currentTime) {
        alert('Your session has expired. Please log in again.');
        localStorage.removeItem('token');
        window.location.href = './login.html?reason=session_expired';
        return;
    }

    const remainingTime = (decodedToken.exp - currentTime) * 1000; 
    if (remainingTime > 0) {
        setTimeout(() => {
            alert('Your session is about to expire. Please save your work or log in again.');
            window.location.href = './login.html?reason=session_expired';
        }, remainingTime - 60000); 
    }
});
