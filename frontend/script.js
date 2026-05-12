/**
 * Rehab AI - Plain JavaScript
 * Premium Health/Fitness App Dashboard
 */

// ========================================
// State Management
// ========================================

const state = {
  activeNav: 'dashboard',
  sidebarCollapsed: false,
  selectedMood: 1,
  feedback: '',
  newComment: '',
  isAddingComment: false,
  currentMonth: new Date(),
  exercises: [
    { id: 1, name: 'Morning Stretches', duration: '10 min', completed: true, emoji: '🌅' },
    { id: 2, name: 'Shoulder Mobility', duration: '15 min', completed: true, emoji: '💪' },
    { id: 3, name: 'Core Strengthening', duration: '12 min', completed: false, emoji: '🎯' },
    { id: 4, name: 'Balance Training', duration: '8 min', completed: false, emoji: '⚖️' },
    { id: 5, name: 'Evening Cool Down', duration: '10 min', completed: false, emoji: '🌙' },
  ],
  comments: [
    {
      id: 1,
      text: 'Felt great after today\'s shoulder exercises. Range of motion improving! 💪',
      timestamp: Date.now() - 1000 * 60 * 30,
      author: 'You',
      initials: 'JD',
      emoji: '😊',
    },
    {
      id: 2,
      text: 'Slight discomfort in lower back during core exercises. Will mention to therapist.',
      timestamp: Date.now() - 1000 * 60 * 60 * 3,
      author: 'You',
      initials: 'JD',
      emoji: '🤔',
    },
    {
      id: 3,
      text: 'Great progress this week! Keep focusing on the stretching exercises. You\'re doing amazing! ⭐',
      timestamp: Date.now() - 1000 * 60 * 60 * 24,
      author: 'Dr. Sarah',
      initials: 'DS',
      isDoctor: true,
      emoji: '👩‍⚕️',
    },
  ],
};

// ========================================
// Utility Functions
// ========================================

function formatDistanceToNow(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  return new Date(timestamp).toLocaleDateString();
}

function getMonthName(date) {
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function getDaysInMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function getFirstDayOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
}

// ========================================
// DOM Elements
// ========================================

const elements = {
  sidebar: document.getElementById('sidebar'),
  sidebarCollapseBtn: document.getElementById('sidebar-collapse-btn'),
  navItems: document.querySelectorAll('.nav-item'),
  notificationBtn: document.getElementById('notification-btn'),
  notificationDropdown: document.getElementById('notification-dropdown'),
  userProfileBtn: document.getElementById('user-profile-btn'),
  userDropdown: document.getElementById('user-dropdown'),
  tasksContainer: document.getElementById('tasks-container'),
  calendarDays: document.getElementById('calendar-days'),
  calendarMonth: document.getElementById('calendar-month'),
  prevMonthBtn: document.getElementById('prev-month-btn'),
  nextMonthBtn: document.getElementById('next-month-btn'),
  moodOptions: document.querySelectorAll('.mood-option'),
  feedbackTextarea: document.getElementById('feedback-textarea'),
  feedbackCharCount: document.getElementById('feedback-char-count'),
  feedbackSubmitBtn: document.getElementById('feedback-submit-btn'),
  addNoteBtn: document.getElementById('add-note-btn'),
  addCommentBox: document.getElementById('add-comment-box'),
  commentTextarea: document.getElementById('comment-textarea'),
  cancelCommentBtn: document.getElementById('cancel-comment-btn'),
  saveCommentBtn: document.getElementById('save-comment-btn'),
  commentsContainer: document.getElementById('comments-container'),
  tasksProgressFill: document.getElementById('tasks-progress-fill'),
  tasksCurrentCount: document.getElementById('tasks-current-count'),
};

// ========================================
// Event Handlers
// ========================================

// Sidebar collapse
function handleSidebarCollapse() {
  state.sidebarCollapsed = !state.sidebarCollapsed;
  elements.sidebar.classList.toggle('collapsed', state.sidebarCollapsed);
  document.querySelector('.header').style.left = state.sidebarCollapsed ? '96px' : '288px';
  document.querySelector('.main-content').style.marginLeft = state.sidebarCollapsed ? '96px' : '288px';
}

// Navigation
function handleNavClick(e) {
  const navItem = e.currentTarget;
  const itemId = navItem.dataset.id;
  
  state.activeNav = itemId;
  
  elements.navItems.forEach(item => {
    item.classList.remove('active');
  });
  navItem.classList.add('active');
}

// Dropdowns
function toggleDropdown(dropdown) {
  dropdown.classList.toggle('open');
}

function closeAllDropdowns() {
  document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
}
async function fetchExercises() {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/exercises/", {
      headers: {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzc4NTczNzczLCJpYXQiOjE3Nzg1NzM0NzMsImp0aSI6IjJlZGNjZDliODRlYzRiMDY5ZjJkZmQzYTVhMTA5Yzg2IiwidXNlcl9pZCI6IjMifQ.xzoauCM45DUWku1A-1zhDvsgY_pwzLZPCK1hj58knFo"
      }
    });

    const data = await response.json();

    console.log(data);

    state.exercises = (data.results || data).map(exercise =>({
      id: exercise.id,
      name: exercise.name,
      duration: `${exercise.reps} reps`,
      completed: false,
      emoji: "💪"
    }));

    renderTasks();

  } catch (error) {
    console.log("Error fetching exercises:", error);
  }
}
// Tasks
function renderTasks() {
  const completedCount = state.exercises.filter(ex => ex.completed).length;
  const totalCount = state.exercises.length;
  const progressPercent = (completedCount / totalCount) * 100;
  
  elements.tasksProgressFill.style.width = `${progressPercent}%`;
  elements.tasksCurrentCount.textContent = completedCount;
  
  elements.tasksContainer.innerHTML = state.exercises.map(exercise => `
    <div class="task-item ${exercise.completed ? 'completed' : ''}" data-id="${exercise.id}">
      <div class="task-left">
        <div class="task-checkbox" onclick="toggleTask(${exercise.id})">
          ${exercise.completed ? `
            <div class="task-checkbox-checked">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span class="check-sparkle">✨</span>
            </div>
          ` : `
            <div class="task-checkbox-unchecked">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
              </svg>
            </div>
          `}
        </div>
        <div class="task-info">
          <span class="task-emoji">${exercise.emoji}</span>
          <div>
            <p class="task-name ${exercise.completed ? 'completed' : ''}">${exercise.name}</p>
            <p class="task-duration">${exercise.duration}</p>
          </div>
        </div>
      </div>
      ${!exercise.completed ? `
        <button class="btn btn-primary btn-sm" onclick="toggleTask(${exercise.id})">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          Done
        </button>
      ` : `
        <div class="task-status">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span>Complete</span>
        </div>
      `}
    </div>
  `).join('');
}

function toggleTask(id) {
  state.exercises = state.exercises.map(ex => 
    ex.id === id ? { ...ex, completed: !ex.completed } : ex
  );
  renderTasks();
}

// Calendar
function renderCalendar() {
  const year = state.currentMonth.getFullYear();
  const month = state.currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(state.currentMonth);
  const firstDay = getFirstDayOfMonth(state.currentMonth);
  const today = new Date();
  const scheduledDays = [3, 5, 8, 10, 12, 15, 17, 19, 22, 24, 26, 29];
  
  elements.calendarMonth.textContent = getMonthName(state.currentMonth);
  
  // Get days from previous month
  const prevMonth = new Date(year, month, 0);
  const prevMonthDays = prevMonth.getDate();
  
  let html = '';
  
  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    html += `<button class="calendar-day other-month">${prevMonthDays - i}</button>`;
  }
  
  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    const isScheduled = scheduledDays.includes(day);
    
    let classes = 'calendar-day';
    if (isToday) classes += ' today';
    else if (isScheduled) classes += ' scheduled';
    
    html += `
      <button class="${classes}">
        ${day}
        ${isToday ? '<svg class="today-sparkle" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>' : ''}
        ${isScheduled && !isToday ? '<span class="scheduled-dot"><span class="scheduled-dot-inner"></span></span>' : ''}
      </button>
    `;
  }
  
  // Next month days
  const totalCells = firstDay + daysInMonth;
  const remainingCells = 42 - totalCells;
  for (let i = 1; i <= remainingCells; i++) {
    html += `<button class="calendar-day other-month">${i}</button>`;
  }
  
  elements.calendarDays.innerHTML = html;
}

function handlePrevMonth() {
  state.currentMonth = new Date(state.currentMonth.getFullYear(), state.currentMonth.getMonth() - 1, 1);
  renderCalendar();
}

function handleNextMonth() {
  state.currentMonth = new Date(state.currentMonth.getFullYear(), state.currentMonth.getMonth() + 1, 1);
  renderCalendar();
}

// Mood selection
function handleMoodSelect(e) {
  const moodOption = e.currentTarget;
  const index = parseInt(moodOption.dataset.index);
  
  state.selectedMood = index;
  
  elements.moodOptions.forEach((option, i) => {
    option.classList.toggle('selected', i === index);
    
    // Update gradient based on selection
    const gradients = [
      'linear-gradient(135deg, #4ade80 0%, #10b981 100%)',
      'linear-gradient(135deg, #6ee7b7 0%, #93c5fd 100%)',
      'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
      'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
      'linear-gradient(135deg, #ef4444 0%, #f43f5e 100%)',
    ];
    
    if (i === index) {
      option.style.background = gradients[i];
    } else {
      option.style.background = 'transparent';
    }
  });
}

// Feedback
function handleFeedbackInput(e) {
  state.feedback = e.target.value;
  elements.feedbackCharCount.textContent = `${state.feedback.length}/500`;
}

function handleFeedbackSubmit() {
  if (state.feedback.trim()) {
    alert('Thank you for your feedback!');
    state.feedback = '';
    elements.feedbackTextarea.value = '';
    elements.feedbackCharCount.textContent = '0/500';
  }
}

// Comments
function renderComments() {
  elements.commentsContainer.innerHTML = state.comments.map(comment => `
    <div class="comment-item ${comment.isDoctor ? 'doctor' : 'user'}">
      <div class="comment-avatar-container">
        <div class="comment-avatar ${comment.isDoctor ? 'doctor' : 'user'}">${comment.initials}</div>
        <span class="comment-avatar-emoji">${comment.emoji}</span>
      </div>
      <div class="comment-content">
        <div class="comment-header">
          <span class="comment-author">${comment.author}</span>
          ${comment.isDoctor ? '<span class="comment-badge">Therapist</span>' : ''}
          <span class="comment-time">${formatDistanceToNow(comment.timestamp)}</span>
        </div>
        <p class="comment-text">${comment.text}</p>
        ${comment.isDoctor ? `
          <div class="comment-footer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span>Professional feedback</span>
          </div>
        ` : ''}
      </div>
    </div>
  `).join('');
}

function toggleAddComment() {
  state.isAddingComment = !state.isAddingComment;
  elements.addCommentBox.classList.toggle('hidden', !state.isAddingComment);
  if (state.isAddingComment) {
    elements.commentTextarea.focus();
  }
}

function handleCancelComment() {
  state.isAddingComment = false;
  state.newComment = '';
  elements.commentTextarea.value = '';
  elements.addCommentBox.classList.add('hidden');
}

function handleSaveComment() {
  const text = elements.commentTextarea.value.trim();
  if (!text) return;
  
  const newComment = {
    id: Date.now(),
    text,
    timestamp: Date.now(),
    author: 'You',
    initials: 'JD',
    emoji: '📝',
  };
  
  state.comments.unshift(newComment);
  state.newComment = '';
  elements.commentTextarea.value = '';
  state.isAddingComment = false;
  elements.addCommentBox.classList.add('hidden');
  renderComments();
}

// ========================================
// Event Listeners
// ========================================

function initEventListeners() {
  // Sidebar collapse
  if (elements.sidebarCollapseBtn) {
    elements.sidebarCollapseBtn.addEventListener('click', handleSidebarCollapse);
  }
  
  // Navigation
  elements.navItems.forEach(item => {
    item.addEventListener('click', handleNavClick);
  });
  
  // Dropdowns
  if (elements.notificationBtn) {
    elements.notificationBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllDropdowns();
      toggleDropdown(elements.notificationDropdown.parentElement);
    });
  }
  
  if (elements.userProfileBtn) {
    elements.userProfileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllDropdowns();
      toggleDropdown(elements.userDropdown.parentElement);
    });
  }
  
  // Close dropdowns on outside click
  document.addEventListener('click', () => {
    closeAllDropdowns();
  });
  
  // Calendar navigation
  if (elements.prevMonthBtn) {
    elements.prevMonthBtn.addEventListener('click', handlePrevMonth);
  }
  
  if (elements.nextMonthBtn) {
    elements.nextMonthBtn.addEventListener('click', handleNextMonth);
  }
  
  // Mood selection
  elements.moodOptions.forEach(option => {
    option.addEventListener('click', handleMoodSelect);
  });
  
  // Feedback
  if (elements.feedbackTextarea) {
    elements.feedbackTextarea.addEventListener('input', handleFeedbackInput);
  }
  
  if (elements.feedbackSubmitBtn) {
    elements.feedbackSubmitBtn.addEventListener('click', handleFeedbackSubmit);
  }
  
  // Comments
  if (elements.addNoteBtn) {
    elements.addNoteBtn.addEventListener('click', toggleAddComment);
  }
  
  if (elements.cancelCommentBtn) {
    elements.cancelCommentBtn.addEventListener('click', handleCancelComment);
  }
  
  if (elements.saveCommentBtn) {
    elements.saveCommentBtn.addEventListener('click', handleSaveComment);
  }
}

// ========================================
// Initialization
// ========================================

function init() {
  initEventListeners();
  fetchExercises();
  renderCalendar();
  renderComments();
  
  // Set initial mood
  elements.moodOptions[state.selectedMood].classList.add('selected');
  elements.moodOptions[state.selectedMood].style.background = 'linear-gradient(135deg, #6ee7b7 0%, #93c5fd 100%)';
}

// Run when DOM is ready
document.addEventListener('DOMContentLoaded', init);

// Make toggleTask globally accessible
window.toggleTask = toggleTask;