// Global Variables
let isAdminLoggedIn = false;
let currentSemester = null;
let contentData = JSON.parse(localStorage.getItem('academicContent') || '{}');

// Subject data for each semester
const semesterSubjects = {
    1: [
        { code: 'PCD', name: 'Programming in C and Data Structures', modules: 5 },
        { code: 'EG', name: 'Engineering Graphics', modules: 4 },
        { code: 'EM', name: 'Engineering Mathematics-I', modules: 5 },
        { code: 'EP', name: 'Engineering Physics', modules: 5 },
        { code: 'EC', name: 'Engineering Chemistry', modules: 5 },
        { code: 'BEE', name: 'Basic Electrical Engineering', modules: 4 },
        { code: 'WS', name: 'Workshop', modules: 3 },
        { code: 'KAN', name: 'Kannada/Hindi', modules: 4 }
    ],
    2: [
        { code: 'EM2', name: 'Engineering Mathematics-II', modules: 5 },
        { code: 'EP2', name: 'Engineering Physics-II', modules: 5 },
        { code: 'EC2', name: 'Engineering Chemistry-II', modules: 5 },
        { code: 'CPP', name: 'Programming in C++', modules: 5 },
        { code: 'BEC', name: 'Basic Electronics', modules: 4 },
        { code: 'EM3', name: 'Engineering Mechanics', modules: 4 },
        { code: 'EVS', name: 'Environmental Studies', modules: 4 },
        { code: 'KAN2', name: 'Kannada/Hindi-II', modules: 4 }
    ],
    3: [
        { code: 'EM3', name: 'Engineering Mathematics-III', modules: 5 },
        { code: 'DS', name: 'Data Structures', modules: 5 },
        { code: 'LA', name: 'Linear Algebra', modules: 4 },
        { code: 'CO', name: 'Computer Organization', modules: 5 },
        { code: 'OOP', name: 'Object Oriented Programming', modules: 5 },
        { code: 'DBMS', name: 'Database Management Systems', modules: 5 },
        { code: 'OS', name: 'Operating Systems', modules: 5 }
    ],
    4: [
        { code: 'EM4', name: 'Engineering Mathematics-IV', modules: 5 },
        { code: 'ADA', name: 'Analysis and Design of Algorithms', modules: 5 },
        { code: 'MP', name: 'Microprocessors', modules: 5 },
        { code: 'CN', name: 'Computer Networks', modules: 5 },
        { code: 'SE', name: 'Software Engineering', modules: 5 },
        { code: 'TOC', name: 'Theory of Computation', modules: 5 },
        { code: 'UHV', name: 'Universal Human Values', modules: 3 }
    ],
    5: [
        { code: 'ML', name: 'Machine Learning', modules: 5 },
        { code: 'AI', name: 'Artificial Intelligence', modules: 5 },
        { code: 'DS', name: 'Data Science', modules: 5 },
        { code: 'CC', name: 'Cloud Computing', modules: 4 },
        { code: 'IOT', name: 'Internet of Things', modules: 4 },
        { code: 'BC', name: 'Block Chain Technology', modules: 4 }
    ],
    6: [
        { code: 'DL', name: 'Deep Learning', modules: 5 },
        { code: 'NLP', name: 'Natural Language Processing', modules: 5 },
        { code: 'CV', name: 'Computer Vision', modules: 5 },
        { code: 'BDA', name: 'Big Data Analytics', modules: 4 },
        { code: 'IS', name: 'Information Security', modules: 4 },
        { code: 'RL', name: 'Reinforcement Learning', modules: 4 }
    ],
    7: [
        { code: 'PROJECT', name: 'Major Project', modules: 1 },
        { code: 'SEMINAR', name: 'Technical Seminar', modules: 1 },
        { code: 'INTERN', name: 'Internship', modules: 1 },
        { code: 'ELEC1', name: 'Professional Elective-I', modules: 4 },
        { code: 'ELEC2', name: 'Professional Elective-II', modules: 4 }
    ],
    8: [
        { code: 'PROJECT2', name: 'Major Project-II', modules: 1 },
        { code: 'COMP', name: 'Comprehensive Exam', modules: 1 },
        { code: 'ELEC3', name: 'Professional Elective-III', modules: 4 },
        { code: 'ELEC4', name: 'Professional Elective-IV', modules: 4 },
        { code: 'ETHICS', name: 'Professional Ethics', modules: 3 }
    ]
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    // Initialize content data if empty
    if (Object.keys(contentData).length === 0) {
        initializeDefaultContent();
    }
    
    // Setup mobile menu
    setupMobileMenu();
}

function setupEventListeners() {
    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });
    
    // Setup dropdown toggles for mobile
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                this.classList.toggle('active');
            }
        });
    });
}

function setupMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Admin Functions
function showAdminLogin() {
    document.getElementById('admin-modal').style.display = 'block';
}

function hideAdminLogin() {
    document.getElementById('admin-modal').style.display = 'none';
    document.getElementById('admin-username').value = '';
    document.getElementById('admin-password').value = '';
}

function adminLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    
    // Simple authentication (in production, this would be server-side)
    if (username === 'admin' && password === 'admin123') {
        isAdminLoggedIn = true;
        hideAdminLogin();
        showAdminPanel();
        populateSubjectSelect();
        loadContentManagement();
    } else {
        alert('Invalid credentials! Use username: admin, password: admin123');
    }
}

function adminLogout() {
    isAdminLoggedIn = false;
    document.getElementById('admin-panel').style.display = 'none';
    // Reload the page to reset the view
    location.reload();
}

function showAdminPanel() {
    document.getElementById('admin-panel').style.display = 'block';
}

function showAdminTab(tab) {
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab
    event.target.classList.add('active');
    document.getElementById(tab + '-tab').classList.add('active');
    
    if (tab === 'manage') {
        loadContentManagement();
    }
}

function populateSubjectSelect() {
    const semesterSelect = document.getElementById('semester-select');
    const subjectSelect = document.getElementById('subject-select');
    
    semesterSelect.addEventListener('change', function() {
        const semester = this.value;
        subjectSelect.innerHTML = '<option value="">Select Subject</option>';
        
        if (semester && semesterSubjects[semester]) {
            semesterSubjects[semester].forEach(subject => {
                const option = document.createElement('option');
                option.value = subject.code;
                option.textContent = `${subject.code} - ${subject.name}`;
                subjectSelect.appendChild(option);
            });
        }
    });
}

function uploadContent(event) {
    event.preventDefault();
    
    const semester = document.getElementById('semester-select').value;
    const subject = document.getElementById('subject-select').value;
    const contentType = document.getElementById('content-type').value;
    const title = document.getElementById('content-title').value;
    const file = document.getElementById('file-upload').files[0];
    const description = document.getElementById('content-description').value;
    
    if (!semester || !subject || !contentType || !title || !file) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Simulate file upload (in production, this would upload to a server)
    const fileData = {
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file), // Temporary URL for demo
        uploadDate: new Date().toISOString()
    };
    
    // Store content data
    if (!contentData[semester]) {
        contentData[semester] = {};
    }
    if (!contentData[semester][subject]) {
        contentData[semester][subject] = {};
    }
    if (!contentData[semester][subject][contentType]) {
        contentData[semester][subject][contentType] = [];
    }
    
    contentData[semester][subject][contentType].push({
        title: title,
        file: fileData,
        description: description,
        id: Date.now().toString()
    });
    
    // Save to localStorage
    localStorage.setItem('academicContent', JSON.stringify(contentData));
    
    alert('Content uploaded successfully!');
    
    // Reset form
    event.target.reset();
    
    // Refresh content management if visible
    if (document.getElementById('manage-tab').classList.contains('active')) {
        loadContentManagement();
    }
}

function loadContentManagement() {
    const contentList = document.getElementById('content-list');
    contentList.innerHTML = '';
    
    if (Object.keys(contentData).length === 0) {
        contentList.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 40px;">No content uploaded yet.</p>';
        return;
    }
    
    Object.keys(contentData).forEach(semester => {
        Object.keys(contentData[semester]).forEach(subject => {
            Object.keys(contentData[semester][subject]).forEach(type => {
                contentData[semester][subject][type].forEach(content => {
                    const contentItem = document.createElement('div');
                    contentItem.className = 'content-item-admin';
                    contentItem.innerHTML = `
                        <div class="content-info">
                            <h4>${content.title}</h4>
                            <p>Semester ${semester} • ${subject} • ${type.replace('-', ' ')} • ${content.file.name}</p>
                            ${content.description ? `<p style="font-size: 0.85rem; margin-top: 5px;">${content.description}</p>` : ''}
                        </div>
                        <div class="content-actions">
                            <button class="btn btn-small btn-outline" onclick="previewContent('${content.file.url}')">Preview</button>
                            <button class="btn btn-small btn-danger" onclick="deleteContent('${semester}', '${subject}', '${type}', '${content.id}')">Delete</button>
                        </div>
                    `;
                    contentList.appendChild(contentItem);
                });
            });
        });
    });
}

function deleteContent(semester, subject, type, contentId) {
    if (confirm('Are you sure you want to delete this content?')) {
        contentData[semester][subject][type] = contentData[semester][subject][type].filter(
            content => content.id !== contentId
        );
        
        // Clean up empty objects
        if (contentData[semester][subject][type].length === 0) {
            delete contentData[semester][subject][type];
        }
        if (Object.keys(contentData[semester][subject]).length === 0) {
            delete contentData[semester][subject];
        }
        if (Object.keys(contentData[semester]).length === 0) {
            delete contentData[semester];
        }
        
        localStorage.setItem('academicContent', JSON.stringify(contentData));
        loadContentManagement();
        
        // Refresh current semester view if it's being displayed
        if (currentSemester) {
            loadSemester(currentSemester);
        }
    }
}

function previewContent(url) {
    window.open(url, '_blank');
}

// Semester and Subject Functions
function loadSemester(semester) {
    currentSemester = semester;
    
    // Hide semester grid and show subject details
    document.getElementById('semester-grid').style.display = 'none';
    document.getElementById('subject-details').style.display = 'block';
    
    // Update semester title
    const semesterTitle = document.getElementById('semester-title');
    const semesterInfo = getSemesterInfo(semester);
    semesterTitle.innerHTML = `
        <h2>${semesterInfo.name}</h2>
        <p>${semesterInfo.cycle}</p>
    `;
    
    // Load subjects
    const subjectsGrid = document.getElementById('subjects-grid');
    subjectsGrid.innerHTML = '';
    
    if (semesterSubjects[semester]) {
        semesterSubjects[semester].forEach(subject => {
            const subjectCard = createSubjectCard(semester, subject);
            subjectsGrid.appendChild(subjectCard);
        });
    }
}

function getSemesterInfo(semester) {
    const semesterData = {
        1: { name: '1st Semester', cycle: 'Physics/Chemistry Cycle' },
        2: { name: '2nd Semester', cycle: 'Physics/Chemistry Cycle' },
        3: { name: '3rd Semester', cycle: 'Core Engineering' },
        4: { name: '4th Semester', cycle: 'Core Engineering' },
        5: { name: '5th Semester', cycle: 'Specialization' },
        6: { name: '6th Semester', cycle: 'Specialization' },
        7: { name: '7th Semester', cycle: 'Advanced' },
        8: { name: '8th Semester', cycle: 'Advanced' }
    };
    
    return semesterData[semester] || { name: 'Unknown Semester', cycle: 'Unknown' };
}

function createSubjectCard(semester, subject) {
    const card = document.createElement('div');
    card.className = 'subject-card';
    
    const subjectContent = contentData[semester] && contentData[semester][subject.code] 
        ? contentData[semester][subject.code] : {};
    
    const contentTypes = ['notes', 'module', 'question-bank', 'model-paper'];
    let contentHTML = '';
    
    contentTypes.forEach(type => {
        const typeLabel = type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
        const items = subjectContent[type] || [];
        
        let itemsHTML = '';
        if (items.length > 0) {
            itemsHTML = items.map(item => 
                `<a href="${item.file.url}" target="_blank" class="content-item" title="${item.description || ''}">${item.title}</a>`
            ).join('');
        } else {
            // Generate module placeholders for 'module' type
            if (type === 'module' && subject.modules > 0) {
                for (let i = 1; i <= subject.modules; i++) {
                    itemsHTML += `<span class="content-item not-uploaded">Module ${i} - NOT UPLOADED</span>`;
                }
            } else {
                itemsHTML = `<span class="content-item not-uploaded">NOT UPLOADED</span>`;
            }
        }
        
        contentHTML += `
            <div class="content-type">
                <h4>${typeLabel}</h4>
                <div class="content-items">${itemsHTML}</div>
            </div>
        `;
    });
    
    card.innerHTML = `
        <div class="subject-header">
            <h3>${subject.name}</h3>
            <p>Subject Code: ${subject.code}</p>
        </div>
        <div class="subject-content">
            <div class="content-types">
                ${contentHTML}
            </div>
        </div>
    `;
    
    return card;
}

function showSemesterGrid() {
    document.getElementById('subject-details').style.display = 'none';
    document.getElementById('semester-grid').style.display = 'block';
    currentSemester = null;
}

function initializeDefaultContent() {
    // Initialize with some sample content structure
    contentData = {};
    localStorage.setItem('academicContent', JSON.stringify(contentData));
}

// Utility Functions
function downloadFile(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Search functionality (for future implementation)
function searchContent(query) {
    // This would search through all content
    console.log('Searching for:', query);
}

// Theme toggle (for future implementation)
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

// Handle window resize
window.addEventListener('resize', function() {
    const navMenu = document.getElementById('nav-menu');
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        document.getElementById('hamburger').classList.remove('active');
        
        // Close mobile dropdowns
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
});

// Handle clicks outside modals
window.addEventListener('click', function(event) {
    const modal = document.getElementById('admin-modal');
    if (event.target === modal) {
        hideAdminLogin();
    }
});

// Keyboard accessibility
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        hideAdminLogin();
        
        // Close mobile menu
        const navMenu = document.getElementById('nav-menu');
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            document.getElementById('hamburger').classList.remove('active');
        }
    }
});

// Service Worker Registration (for future PWA implementation)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // navigator.serviceWorker.register('/sw.js');
    });
}

// Export functions for global access
window.loadSemester = loadSemester;
window.showSemesterGrid = showSemesterGrid;
window.showAdminLogin = showAdminLogin;
window.hideAdminLogin = hideAdminLogin;
window.adminLogin = adminLogin;
window.adminLogout = adminLogout;
window.showAdminTab = showAdminTab;
window.uploadContent = uploadContent;
window.deleteContent = deleteContent;
window.previewContent = previewContent;