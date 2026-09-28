const API_URL = 'http://localhost:5000/api';

// --- Global State ---
let currentView = 'dashboard';
let students = [];

// --- Auth Handling ---
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (data.success) {
            document.getElementById('login-section').classList.add('hidden');
            document.getElementById('app-section').style.display = 'block';
            showView('dashboard');
        } else {
            document.getElementById('login-error').style.display = 'block';
        }
    } catch (err) {
        alert('Error connecting to backend!');
    }
});

function logout() {
    window.location.reload();
}

// --- Navigation ---
function showView(viewId) {
    currentView = viewId;
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    document.getElementById(`view-${viewId}`).classList.remove('hidden');
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.innerText.toLowerCase().includes(viewId)) item.classList.add('active');
    });

    if (viewId === 'dashboard') loadAnalytics();
    if (viewId === 'students') loadStudents();
    if (viewId === 'attendance') {
        document.getElementById('attendance-date').valueAsDate = new Date();
        loadAttendanceReport();
    }
    if (viewId === 'grades') {
        loadStudentsDropdown();
    }
}

// --- Student CRUD ---
async function loadStudents() {
    const res = await fetch(`${API_URL}/students`);
    students = await res.json();
    const tbody = document.querySelector('#students-table tbody');
    tbody.innerHTML = students.map(s => `
        <tr>
            <td>${s.id}</td>
            <td>${s.name}</td>
            <td>${s.email}</td>
            <td>${s.course}</td>
            <td>
                <button class="btn-primary" onclick="editStudent(${s.id})"><i class="fas fa-edit"></i></button>
                <button class="btn-danger" onclick="deleteStudent(${s.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

document.getElementById('student-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('student-id').value;
    const payload = {
        name: document.getElementById('student-name').value,
        email: document.getElementById('student-email').value,
        course: document.getElementById('student-course').value
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/students/${id}` : `${API_URL}/students`;

    await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    
    closeModal('student-modal');
    loadStudents();
});

function editStudent(id) {
    const s = students.find(x => x.id === id);
    document.getElementById('student-id').value = s.id;
    document.getElementById('student-name').value = s.name;
    document.getElementById('student-email').value = s.email;
    document.getElementById('student-course').value = s.course;
    openModal('student-modal');
}

async function deleteStudent(id) {
    if (confirm('Are you sure?')) {
        await fetch(`${API_URL}/students/${id}`, { method: 'DELETE' });
        loadStudents();
    }
}

// --- Attendance ---
async function loadAttendanceReport() {
    const date = document.getElementById('attendance-date').value;
    const res = await fetch(`${API_URL}/students`);
    const allStudents = await res.json();
    
    const attRes = await fetch(`${API_URL}/attendance/report?date=${date}`);
    const reports = await attRes.json();

    const tbody = document.querySelector('#attendance-table tbody');
    tbody.innerHTML = allStudents.map(s => {
        const report = reports.find(r => r.name === s.name) || {};
        const status = report.status || 'N/A';
        return `
            <tr>
                <td>${s.name}</td>
                <td>${s.course}</td>
                <td><span style="color: ${status === 'Present' ? 'green' : 'red'}">${status}</span></td>
                <td>
                    <button class="btn-primary" onclick="markAttendance(${s.id}, 'Present')">P</button>
                    <button class="btn-danger" onclick="markAttendance(${s.id}, 'Absent')">A</button>
                </td>
            </tr>
        `;
    }).join('');
}

async function markAttendance(student_id, status) {
    const date = document.getElementById('attendance-date').value;
    await fetch(`${API_URL}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id, date, status })
    });
    loadAttendanceReport();
}

// --- Grades ---
async function loadStudentsDropdown() {
    const res = await fetch(`${API_URL}/students`);
    const data = await res.json();
    const select = document.getElementById('grade-student-select');
    select.innerHTML = '<option value="">Select Student</option>' + 
        data.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    
    select.onchange = () => loadStudentGrades(select.value);
}

async function loadStudentGrades(studentId) {
    if (!studentId) return;
    const res = await fetch(`${API_URL}/grades/${studentId}`);
    const data = await res.json();
    const tbody = document.querySelector('#grades-table tbody');
    tbody.innerHTML = data.map(g => `
        <tr>
            <td>${g.subject}</td>
            <td>${g.marks}</td>
            <td>${g.marks >= 40 ? '<span style="color: green">Pass</span>' : '<span style="color: red">Fail</span>'}</td>
        </tr>
    `).join('');
}

document.getElementById('grade-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const student_id = document.getElementById('grade-student-select').value;
    if (!student_id) return alert('Select a student first');

    const payload = {
        student_id,
        subject: document.getElementById('grade-subject').value,
        marks: document.getElementById('grade-marks').value
    };

    await fetch(`${API_URL}/grades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    
    closeModal('grade-modal');
    loadStudentGrades(student_id);
});

// --- Analytics ---
async function loadAnalytics() {
    const res = await fetch(`${API_URL}/analytics/overall`);
    const overall = await res.json();
    document.getElementById('stat-total-students').innerText = overall.total_students;
    document.getElementById('stat-avg-marks').innerText = Math.round(overall.avg_score) + '%';

    const topRes = await fetch(`${API_URL}/analytics/top-students`);
    const top = await topRes.json();
    const tbody = document.querySelector('#top-students-table tbody');
    tbody.innerHTML = top.map(s => `
        <tr>
            <td>${s.name}</td>
            <td>${Math.round(s.average_marks)}%</td>
            <td>${s.total_marks}</td>
        </tr>
    `).join('');
}

// --- UI Helpers ---
function openModal(id) {
    document.getElementById(id).style.display = 'flex';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
    if (id === 'student-modal') document.getElementById('student-form').reset();
    if (id === 'grade-modal') document.getElementById('grade-form').reset();
}

function openGradeModal() {
    if (!document.getElementById('grade-student-select').value) return alert('Select a student first');
    openModal('grade-modal');
}
