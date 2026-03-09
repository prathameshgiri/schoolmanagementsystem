// Admin Login Logic
document.getElementById('admin-login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('error-msg');

    try {
        const res = await fetch('http://localhost:3001/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (data.success && data.user.role === 'admin') {
            sessionStorage.setItem('admin_user', JSON.stringify(data.user));
            window.location.href = '/admin/admin-dashboard.html';
        } else {
            errorMsg.innerText = data.message || 'Access denied. Admins only.';
            errorMsg.style.display = 'block';
        }
    } catch (err) {
        errorMsg.innerText = 'Connection error. Please try again.';
        errorMsg.style.display = 'block';
    }
});
