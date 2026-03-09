// Login logic for Student Portal
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('error-msg');

    try {
        const res = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (data.success && (data.user.role === 'student' || data.user.role === 'parent')) {
            sessionStorage.setItem('school_user', JSON.stringify(data.user));
            window.location.href = 'dashboard.html';
        } else {
            errorMsg.innerText = data.message || 'Access denied. Only registered Students and Parents.';
            errorMsg.style.display = 'block';
        }
    } catch (err) {
        errorMsg.innerText = 'Connection error. Please try again.';
        errorMsg.style.display = 'block';
    }
});

// Public Contact Form Submission
document.getElementById('public-contact-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const content = document.getElementById('contact-content').value;
    const msgEl = document.getElementById('contact-msg');

    try {
        await fetch('http://localhost:3000/api/data/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, content, status: 'Unresolved' })
        });
        msgEl.innerText = 'Message sent to Admin successfully!';
        msgEl.style.display = 'block';
        msgEl.style.color = 'var(--secondary)';
        e.target.reset();
        setTimeout(() => msgEl.style.display = 'none', 3000);
    } catch (err) {
        msgEl.innerText = 'Failed to send message. Try again later.';
        msgEl.style.display = 'block';
        msgEl.style.color = '#ef4444';
    }
});

// Admission Form Submission
document.getElementById('admission-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('add-name').value;
    const email = document.getElementById('add-email').value;
    const phone = document.getElementById('add-phone').value;
    const course = document.getElementById('add-course').value;

    try {
        await fetch('http://localhost:3000/api/data/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                email,
                content: `Admission Request | Course: ${course} | Phone: ${phone}`,
                status: 'Unresolved'
            })
        });
        alert('Admission application submitted successfully! Admin will review it shortly.');
        e.target.reset();
    } catch (err) {
        alert('Failed to submit application. Please check your connection.');
    }
});
