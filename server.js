const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Port configurations
const USER_PORT = 3000;
const ADMIN_PORT = 3001;

// Initialize apps
const userApp = express();
const adminApp = express();

const setupMiddleware = (app) => {
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
};

setupMiddleware(userApp);
setupMiddleware(adminApp);

// Database path
const DATA_DIR = path.join(__dirname, 'backend', 'data');
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Generate users data (10 BCA, 10 MCA students + parents + admin)
const createUsers = () => {
    const users = [
        { id: 100, email: 'sandhya@admin.com', password: '1234', role: 'admin', name: 'Admin Sandhya' }
    ];
    let idCounter = 1;

    // BCA Students & Parents
    const bcaNames = ['Aarav Sharma', 'Vivaan Verma', 'Aditya Iyer', 'Vihaan Singh', 'Arjun Desai', 'Sai Krishna', 'Ayaan Patel', 'Krishna Gupta', 'Ishaan Joshi', 'Shaurya Reddy'];
    const bcaParents = ['Rajesh Sharma', 'Sunil Verma', 'Ramesh Iyer', 'Sanjay Singh', 'Manish Desai', 'Venkatesh Krishna', 'Kamlesh Patel', 'Amit Gupta', 'Pradeep Joshi', 'Prakash Reddy'];

    for (let i = 0; i < 10; i++) {
        const sid = idCounter++;
        const pid = idCounter++;
        users.push({ id: sid, email: `student${sid}@abc.com`, password: '1234', role: 'student', name: bcaNames[i], class: 'BCA 1st Year', section: 'A' });
        users.push({ id: pid, email: `parent${pid}@abc.com`, password: '1234', role: 'parent', name: bcaParents[i], studentId: sid });
    }

    // MCA Students & Parents
    const mcaNames = ['Ananya Patil', 'Diya Malhotra', 'Khushi Mehta', 'Tanisha Choudhury', 'Aditi Nair', 'Sneha Kapoor', 'Kavya Rao', 'Riya Menon', 'Neha Bhatia', 'Shreya Kadam'];
    const mcaParents = ['Vijay Patil', 'Suresh Malhotra', 'Rakesh Mehta', 'Deepak Choudhury', 'Rajesh Nair', 'Anil Kapoor', 'Harish Rao', 'Suresh Menon', 'Sunil Bhatia', 'Pramod Kadam'];

    for (let i = 0; i < 10; i++) {
        const sid = idCounter++;
        const pid = idCounter++;
        users.push({ id: sid, email: `student${sid}@abc.com`, password: '1234', role: 'student', name: mcaNames[i], class: 'MCA 1st Year', section: 'A' });
        users.push({ id: pid, email: `parent${pid}@abc.com`, password: '1234', role: 'parent', name: mcaParents[i], studentId: sid });
    }

    // Adding dummy passwords visible for testing into the first student
    users[1].email = 'student@abc.com'; // Aarav Sharma (student, id: 1)
    users[2].email = 'parent@abc.com'; // Rajesh Sharma (parent, id: 2)

    return users;
};

const defaultData = {
    users: createUsers(),
    attendance: [],
    fees: [],
    results: [],
    events: [
        { id: 1, title: 'Annual IT Fest', date: '2026-04-10', description: 'Tech events, Hackathons, and more.' }
    ],
    news: [
        { id: 1, title: 'Exam Timetable Released', content: 'Semester end exams will begin from 15th May.', date: '2026-03-01' }
    ],
    messages: [],
    notifications: []
};

// Load or create DB files
const db = {};
Object.keys(defaultData).forEach(key => {
    const file = path.join(DATA_DIR, `${key}.json`);
    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, JSON.stringify(defaultData[key], null, 2));
    }
    db[key] = JSON.parse(fs.readFileSync(file, 'utf8'));
});

// Helper to save DB
const saveDB = (key) => {
    fs.writeFileSync(path.join(DATA_DIR, `${key}.json`), JSON.stringify(db[key], null, 2));
    notifyUpdate(key);
};

// Simple SSE Real-time Updates Setup
let clients = [];
const notifyUpdate = (type) => {
    clients.forEach(client => client.res.write(`data: ${JSON.stringify({ type })}\n\n`));
};

const sseHandler = (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const client = { id: Date.now(), res };
    clients.push(client);

    req.on('close', () => {
        clients = clients.filter(c => c.id !== client.id);
    });
};

userApp.get('/api/events-stream', sseHandler);
adminApp.get('/api/events-stream', sseHandler);

// --- APIs ---
const defineApis = (app) => {
    app.post('/api/login', (req, res) => {
        const { email, password } = req.body;
        const user = db.users.find(u => u.email === email && u.password === password);
        if (user) {
            if (user.role === 'admin') {
                res.json({ success: true, user: { id: user.id, name: user.name, role: user.role } });
            } else if (user.role === 'parent') {
                const student = db.users.find(u => u.id === user.studentId);
                res.json({ success: true, user: { id: user.id, name: user.name, role: user.role, email: user.email, childName: student?.name, studentRef: student?.id, class: student?.class, section: student?.section } });
            } else {
                res.json({ success: true, user: { id: user.id, name: user.name, role: user.role, email: user.email, studentRef: user.id, class: user.class, section: user.section } });
            }
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    });

    app.get('/api/stats', (req, res) => {
        const studentsCount = db.users.filter(u => u.role === 'student').length;
        const classesCount = new Set(db.users.filter(u => u.role === 'student').map(u => u.class)).size;
        const attendanceCount = db.attendance.length;
        const totalFees = db.fees.reduce((acc, f) => acc + parseFloat(f.amount || 0), 0);
        res.json({ studentsCount, classesCount, attendanceCount, totalFees });
    });

    app.get('/api/data/:collection', (req, res) => {
        const { collection } = req.params;
        if (db[collection]) res.json(db[collection]);
        else res.status(404).send('Not found');
    });

    app.post('/api/data/:collection', (req, res) => {
        const { collection } = req.params;
        if (db[collection]) {
            const newItem = { id: Date.now(), ...req.body };
            db[collection].push(newItem);
            saveDB(collection);
            res.json(newItem);
        } else res.status(404).send('Not found');
    });

    app.put('/api/data/:collection/:id', (req, res) => {
        const { collection, id } = req.params;
        if (db[collection]) {
            const index = db[collection].findIndex(item => item.id == id);
            if (index !== -1) {
                db[collection][index] = { ...db[collection][index], ...req.body };
                saveDB(collection);
                res.json(db[collection][index]);
            } else res.status(404).send('Item not found');
        } else res.status(404).send('Not found');
    });

    app.delete('/api/data/:collection/:id', (req, res) => {
        const { collection, id } = req.params;
        if (db[collection]) {
            db[collection] = db[collection].filter(item => item.id != id);
            saveDB(collection);
            res.json({ success: true });
        } else res.status(404).send('Not found');
    });
};

defineApis(userApp);
defineApis(adminApp);

// Serve Static Files
userApp.use(express.static(path.join(__dirname, 'user-frontend')));
adminApp.use('/admin', express.static(path.join(__dirname, 'admin-panel')));
adminApp.get('/', (req, res) => res.redirect('/admin'));

// Start servers
userApp.listen(USER_PORT, () => console.log(`User Portal running on http://localhost:${USER_PORT}`));
adminApp.listen(ADMIN_PORT, () => console.log(`Admin Panel running on http://localhost:${ADMIN_PORT}/admin`));
