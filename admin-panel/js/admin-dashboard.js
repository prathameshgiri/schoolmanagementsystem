const admin = JSON.parse(sessionStorage.getItem('admin_user') || 'null');

if (!admin || admin.role !== 'admin') {
    window.location.href = '/admin/';
}

function logout() {
    sessionStorage.removeItem('admin_user');
    window.location.href = '/admin/';
}

function showSection(id) {
    document.querySelectorAll('.section').forEach(el => el.style.display = 'none');
    document.getElementById(id).style.display = 'block';
    document.querySelectorAll('.nav-menu a').forEach(el => el.classList.remove('active'));
    event.target.classList.add('active');
}

function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

const API_BASE = 'http://localhost:3001/api';

async function fetchData(collection) {
    const res = await fetch(`${API_BASE}/data/${collection}`);
    return res.json();
}

async function loadDashboard() {
    const statsRes = await fetch(`${API_BASE}/stats`);
    const stats = await statsRes.json();

    const users = await fetchData('users');
    const students = users.filter(u => u.role === 'student');

    /* Beautiful Grid replacement for overview stats to match user dashboard */
    document.getElementById('overview').innerHTML = `
        <div class="cards-grid fade-in">
            <div class="card glass-panel" style="border-left: 4px solid var(--primary);">
                <i class="fa-solid fa-users text-primary mb-2" style="font-size:2rem"></i>
                <h3>Total Students</h3>
                <p class="stat">${students.length}</p>
            </div>
            <div class="card glass-panel" style="border-left: 4px solid var(--secondary);">
                <i class="fa-solid fa-clipboard-check text-secondary mb-2" style="font-size:2rem"></i>
                <h3>Classes Count</h3>
                <p class="stat">${stats.classesCount}</p>
            </div>
            <div class="card glass-panel" style="border-left: 4px solid var(--accent);">
                <i class="fa-solid fa-file-invoice-dollar text-accent mb-2" style="font-size:2rem"></i>
                <h3>Fees Collected (Gross)</h3>
                <p class="stat">$${stats.totalFees || 0}</p>
            </div>
            <div class="card glass-panel" style="border-left: 4px solid #ef4444;">
                <i class="fa-solid fa-user-xmark mb-2" style="font-size:2rem; color:#ef4444;"></i>
                <h3>Attendance Marked</h3>
                <p class="stat">${stats.attendanceCount}</p>
            </div>
        </div>
    `;

    document.getElementById('students-table').innerHTML = students.map(s => `
        <tr>
            <td>${s.id}</td><td>${s.name}</td><td>${s.email}</td><td>${s.class}</td><td>${s.section}</td>
            <td><button onclick="deleteRow('users', ${s.id})" class="btn" style="color:red">Del</button></td>
        </tr>
    `).join('');

    const attendance = await fetchData('attendance');
    document.getElementById('attendance-table').innerHTML = attendance.map(a => `
        <tr>
            <td>${a.date}</td><td>${a.studId}</td><td><span class="status-badge ${a.status.toLowerCase()}">${a.status}</span></td>
            <td><button onclick="deleteRow('attendance', ${a.id})" class="btn" style="color:red">Del</button></td>
        </tr>
    `).join('');

    const results = await fetchData('results');
    document.getElementById('results-table').innerHTML = results.map(r => `
        <tr>
            <td>${r.studId}</td><td>${r.subject}</td><td>${r.marks}</td><td>${r.grade}</td><td><span class="status-badge ${r.status.toLowerCase()}">${r.status}</span></td>
            <td><button onclick="deleteRow('results', ${r.id})" class="btn" style="color:red">Del</button></td>
        </tr>
    `).join('');

    const fees = await fetchData('fees');
    document.getElementById('fees-table').innerHTML = fees.map(f => `
        <tr>
            <td>${f.studId}</td><td>${f.detail}</td><td>$${f.amount}</td><td><span class="status-badge ${f.status.toLowerCase()}">${f.status}</span></td>
            <td><button onclick="deleteRow('fees', ${f.id})" class="btn" style="color:red">Del</button></td>
        </tr>
    `).join('');

    const events = await fetchData('events');
    document.getElementById('events-table').innerHTML = events.map(e => `
        <tr>
            <td>${e.title}</td><td>${e.date}</td><td>${e.description}</td>
            <td><button onclick="deleteRow('events', ${e.id})" class="btn" style="color:red">Del</button></td>
        </tr>
    `).join('');

    const news = await fetchData('news');
    document.getElementById('news-table').innerHTML = news.map(n => `
        <tr>
            <td>${n.title}</td><td>${n.date}</td>
            <td><button onclick="deleteRow('news', ${n.id})" class="btn" style="color:red">Del</button></td>
        </tr>
    `).join('');

    const messages = await fetchData('messages');

    let regularMessages = messages.filter(m => !m.content || !m.content.includes("Admission Request")).reverse();
    let admissionRequests = messages.filter(m => m.content && m.content.includes("Admission Request")).reverse();

    document.getElementById('messages-table').innerHTML = regularMessages.map(m => `
        <tr>
            <td>${m.name}</td><td>${m.email}</td><td>${m.content}</td><td><span class="status-badge ${m.status === 'Resolved' ? 'pass' : 'pending'}">${m.status || 'Unresolved'}</span></td>
            <td>
                ${m.status !== 'Resolved' ? `<button onclick="resolveMessage(${m.id})" class="btn" style="color:var(--secondary); padding: 5px 15px; background: rgba(16, 185, 129, 0.1);">Resolve</button>` : ''}
                <button onclick="deleteRow('messages', ${m.id})" class="btn" style="color:red; padding: 5px 15px; background: rgba(239, 68, 68, 0.1);">Del</button>
            </td>
        </tr>
    `).join('') || `<tr><td colspan="5" style="text-align: center; color: var(--text-light);">No inquiries found</td></tr>`;

    document.getElementById('admissions-table').innerHTML = admissionRequests.map(m => {
        let details = m.content.replace('Admission Request | ', '');
        return `
        <tr>
            <td><strong>${m.name}</strong></td>
            <td><a href="mailto:${m.email}" style="color:var(--primary);">${m.email}</a></td>
            <td>${details}</td>
            <td><span class="status-badge ${m.status === 'Resolved' ? 'pass' : 'pending'}">${m.status === 'Resolved' ? 'Reviewed' : 'Pending Review'}</span></td>
            <td>
                ${m.status !== 'Resolved' ? `<button onclick="resolveMessage(${m.id})" class="btn btn-primary" style="padding: 5px 15px; min-height: 0;">Mark Reviewed</button>` : ''}
                <button onclick="deleteRow('messages', ${m.id})" class="btn" style="background:#fee2e2; color:#dc2626; padding: 5px 15px;">Delete</button>
            </td>
        </tr>
        `;
    }).join('') || `<tr><td colspan="5" style="text-align: center; color: var(--text-light);">No admission applications yet</td></tr>`;

    const notifs = messages.map(m => {
        let isAdmission = m.content && m.content.includes("Admission");
        let icon = isAdmission ? '<i class="fa-solid fa-graduation-cap text-accent" style="margin-right: 12px; font-size: 1.2rem;"></i>' : '<i class="fa-solid fa-envelope text-primary" style="margin-right: 12px; font-size: 1.2rem;"></i>';
        let typeStr = isAdmission ? "Admission Application" : "Inquiry";
        return `${icon} New ${typeStr} from ${m.name}`;
    }).slice(0, 5);

    document.getElementById('notif-badge').innerText = messages.filter(m => m.status !== 'Resolved').length;
    document.getElementById('notifications-list').innerHTML = notifs.map(n => `<div class="notif-item"><strong>${n}</strong></div>`).join('') || "No new interactions.";
}

// Global generic delete
async function deleteRow(collection, id) {
    if (confirm('Are you sure?')) {
        await fetch(`${API_BASE}/data/${collection}/${id}`, { method: 'DELETE' });
        loadDashboard();
    }
}

async function resolveMessage(id) {
    await fetch(`${API_BASE}/data/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Resolved' })
    });
    loadDashboard();
}

// Form Submissions
document.getElementById('form-student').addEventListener('submit', async (e) => {
    e.preventDefault();
    await fetch(`${API_BASE}/data/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: document.getElementById('stud-name').value,
            email: document.getElementById('stud-email').value,
            password: '1234',
            role: 'student',
            class: document.getElementById('stud-class').value,
            section: document.getElementById('stud-section').value
        })
    });
    closeModal('student-modal'); e.target.reset(); loadDashboard();
});

document.getElementById('form-attendance').addEventListener('submit', async (e) => {
    e.preventDefault();
    await fetch(`${API_BASE}/data/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            date: document.getElementById('att-date').value,
            studId: document.getElementById('att-stud-id').value,
            status: document.getElementById('att-status').value
        })
    });
    closeModal('attendance-modal'); e.target.reset(); loadDashboard();
});

document.getElementById('form-result').addEventListener('submit', async (e) => {
    e.preventDefault();
    await fetch(`${API_BASE}/data/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            studId: document.getElementById('res-stud-id').value,
            subject: document.getElementById('res-subject').value,
            marks: document.getElementById('res-marks').value,
            grade: document.getElementById('res-grade').value,
            status: document.getElementById('res-status').value
        })
    });
    closeModal('result-modal'); e.target.reset(); loadDashboard();
});

document.getElementById('form-fee').addEventListener('submit', async (e) => {
    e.preventDefault();
    await fetch(`${API_BASE}/data/fees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            studId: document.getElementById('fee-stud-id').value,
            detail: document.getElementById('fee-detail').value,
            amount: document.getElementById('fee-amount').value,
            status: document.getElementById('fee-status').value
        })
    });
    closeModal('fee-modal'); e.target.reset(); loadDashboard();
});

document.getElementById('form-event').addEventListener('submit', async (e) => {
    e.preventDefault();
    await fetch(`${API_BASE}/data/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: document.getElementById('evt-title').value,
            date: document.getElementById('evt-date').value,
            description: document.getElementById('evt-desc').value
        })
    });
    closeModal('event-modal'); e.target.reset(); loadDashboard();
});

document.getElementById('form-news').addEventListener('submit', async (e) => {
    e.preventDefault();
    await fetch(`${API_BASE}/data/news`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: document.getElementById('nws-title').value,
            date: document.getElementById('nws-date').value,
            content: document.getElementById('nws-content').value
        })
    });
    closeModal('news-modal'); e.target.reset(); loadDashboard();
});

// Real-time Updates via SSE
const sse = new EventSource(`${API_BASE}/events-stream`);
sse.onmessage = (event) => {
    const data = JSON.parse(event.data);
    loadDashboard();

    // Play a gentle notification sound effect
    const audio = new Audio('data:audio/mp3;base64,//OQxAAAAANIAQAAAEDwAAVQAAAABJAAAIAD/++L4AAAAAA'); // silent placeholder or skip
    let actionStr = data.type === 'messages' ? 'New Contact/Admission Submission!' : `${data.type.toUpperCase()} database updated`;

    Toastify({
        text: `🔔 Live Sync: ${actionStr}`,
        duration: 5000,
        gravity: "bottom",
        position: "right",
        style: {
            background: "linear-gradient(to right, var(--primary), var(--secondary))",
            borderRadius: "10px",
            boxShadow: "var(--shadow-lg)",
            fontWeight: "600",
            padding: "16px 24px"
        },
        stopOnFocus: true
    }).showToast();
};

loadDashboard();
