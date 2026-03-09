const user = JSON.parse(sessionStorage.getItem('school_user') || 'null');

if (!user || (user.role !== 'student' && user.role !== 'parent')) {
    window.location.href = 'index.html';
}

document.getElementById('student-name').innerText = user.name;
if (user.role === 'parent') {
    document.getElementById('parent-tag').innerText = `(Parent of ${user.childName})`;
}

document.getElementById('student-class').innerText = user.class;
document.getElementById('student-section').innerText = user.section;
document.getElementById('msg-name').value = user.name;
document.getElementById('msg-email').value = user.email;

function logout() {
    sessionStorage.removeItem('school_user');
    window.location.href = 'index.html';
}

function showSection(id) {
    document.querySelectorAll('.section').forEach(el => el.style.display = 'none');
    document.getElementById(id).style.display = 'block';
    document.querySelectorAll('.nav-menu a').forEach(el => el.classList.remove('active'));
    event.target.classList.add('active');
}

// Fetch and render data
async function loadData() {
    // Parallel fetching
    const [attRes, resRes, feeRes, evtRes, newsRes] = await Promise.all([
        fetch('http://localhost:3000/api/data/attendance'),
        fetch('http://localhost:3000/api/data/results'),
        fetch('http://localhost:3000/api/data/fees'),
        fetch('http://localhost:3000/api/data/events'),
        fetch('http://localhost:3000/api/data/news')
    ]);

    const atts = await attRes.json();
    const results = await resRes.json();
    const fees = await feeRes.json();
    const events = await evtRes.json();
    const news = await newsRes.json();

    const myAtts = atts.filter(a => String(a.studId) === String(user.studentRef));
    const myResults = results.filter(r => String(r.studId) === String(user.studentRef));
    const myFees = fees.filter(f => String(f.studId) === String(user.studentRef));

    // Stats calculation
    const present = myAtts.filter(a => a.status.toLowerCase() === 'present').length;
    const attPercentage = myAtts.length ? ((present / myAtts.length) * 100).toFixed(0) : 0;
    const pendingFees = myFees.filter(f => f.status.toLowerCase() === 'pending').reduce((sum, f) => sum + parseFloat(f.amount), 0);
    const latestResult = myResults.length ? myResults[myResults.length - 1].grade : '-';

    document.getElementById('stat-attendance').innerText = attPercentage + '%';
    document.getElementById('stat-fees').innerText = '$' + pendingFees;
    document.getElementById('stat-result').innerText = latestResult;

    // Render lists
    document.getElementById('attendance-list').innerHTML = myAtts.map(a => `
        <tr><td>${a.date}</td><td><span class="status-badge ${a.status.toLowerCase()}">${a.status}</span></td></tr>
    `).join('') || '<tr><td colspan="2">No records found.</td></tr>';

    document.getElementById('results-list').innerHTML = myResults.map(r => `
        <tr><td>${r.subject}</td><td>${r.marks}</td><td><strong>${r.grade}</strong></td><td><span class="status-badge ${r.status.toLowerCase()}">${r.status}</span></td></tr>
    `).join('') || '<tr><td colspan="4">No records found.</td></tr>';

    document.getElementById('fees-list').innerHTML = myFees.map(f => `
        <tr><td>${f.detail}</td><td>$${f.amount}</td><td><span class="status-badge ${f.status.toLowerCase()}">${f.status}</span></td></tr>
    `).join('') || '<tr><td colspan="3">No records found.</td></tr>';

    document.getElementById('events-grid').innerHTML = events.reverse().map(e => `
        <div class="card glass-panel text-left">
            <h3 class="mb-2 text-primary">${e.title}</h3>
            <p><i class="fa-solid fa-calendar text-secondary"></i> <strong>${e.date}</strong></p>
            <p class="mt-4">${e.description}</p>
        </div>
    `).join('');

    document.getElementById('news-grid').innerHTML = news.reverse().map(n => `
        <div class="card glass-panel text-left">
            <h3 class="mb-2 text-accent">${n.title}</h3>
            <p><i class="fa-solid fa-clock text-secondary"></i> <strong>${n.date}</strong></p>
            <p class="mt-4">${n.content}</p>
        </div>
    `).join('');
}

// Contact form submission
document.getElementById('contact-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = {
        name: user.name,
        email: user.email,
        content: document.getElementById('msg-content').value,
        status: 'Unresolved',
        date: new Date().toISOString().split('T')[0]
    };
    await fetch('http://localhost:3000/api/data/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg)
    });

    Toastify({
        text: "Message delivered directly to the Admin!",
        duration: 3000,
        gravity: "top",
        position: "center",
        backgroundColor: "#10b981",
        stopOnFocus: true
    }).showToast();

    document.getElementById('msg-content').value = '';
});

// Real-time Updates via SSE with TOASTS
const sse = new EventSource('http://localhost:3000/api/events-stream');
sse.onmessage = (event) => {
    const data = JSON.parse(event.data);
    loadData(); // Reload all data

    Toastify({
        text: `Live Sync: ${data.type.toUpperCase()} section was updated securely.`,
        duration: 5000,
        gravity: "top",
        position: "right",
        backgroundColor: "#2563eb",
        stopOnFocus: true
    }).showToast();
};

loadData();
