// State Engine Initialization: Sync data array from system localStorage
let tasks = JSON.parse(localStorage.getItem('todo_tasks')) || [];

// Active DOM Target Lookups
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const pendingList = document.getElementById('pending-list');
const completedList = document.getElementById('completed-list');
const pendingCounter = document.getElementById('pending-counter');
const completedCounter = document.getElementById('completed-counter');

// Core App Lifecycle Listeners
document.addEventListener('DOMContentLoaded', renderApp);
addTaskBtn.addEventListener('click', createTask);
taskInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') createTask(); });

/**
 * Commits the current tasks state to memory cache and triggers view synchronization
 */
function saveState() {
  localStorage.setItem('todo_tasks', JSON.stringify(tasks));
  renderApp();
}

/**
 * Evaluates inputs and constructs a new standardized data entry entity
 */
function createTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  const timestampConfig = { hour: '2-digit', minute: '2-digit' };
  const newTask = {
    id: Date.now().toString(),
    text: text,
    completed: false,
    createdTime: new Date().toLocaleTimeString([], timestampConfig),
    completedTime: null
  };

  tasks.push(newTask);
  taskInput.value = '';
  saveState();
}

/**
 * Alters the status designation profile flags for specific target entities
 */
function toggleTask(id) {
  const timestampConfig = { hour: '2-digit', minute: '2-digit' };
  tasks = tasks.map(task => {
    if (task.id === id) {
      const isNowCompleted = !task.completed;
      return {
        ...task,
        completed: isNowCompleted,
        completedTime: isNowCompleted ? new Date().toLocaleTimeString([], timestampConfig) : null
      };
    }
    return task;
  });
  saveState();
}

/**
 * Severs individual items cleanly from state storage based on identifier signatures
 */
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveState();
}

/**
 * Restructures item targets temporarily to mount inline interaction interface elements
 */
function enableEdit(id, taskRowElement) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  const textDisplay = taskRowElement.querySelector('.task-text');
  const actionsContainer = taskRowElement.querySelector('.actions');
  
  // Transform standard block node layout into focused inline Input controls
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'edit-input';
  input.value = task.text;
  
  taskRowElement.replaceChild(input, textDisplay);
  input.focus();

  // Swap standard actions with inline submission switches
  actionsContainer.innerHTML = `
    <button class="btn-action btn-edit" style="color: var(--success);">Save</button>
    <button class="btn-action btn-delete">Cancel</button>
  `;

  const saveBtn = actionsContainer.querySelector('.btn-edit');
  const cancelBtn = actionsContainer.querySelector('.btn-delete');

  const commitEditChanges = () => {
    const freshValueText = input.value.trim();
    if (freshValueText) {
      task.text = freshValueText;
      saveState();
    } else {
      deleteTask(id);
    }
  };

  saveBtn.addEventListener('click', commitEditChanges);
  cancelBtn.addEventListener('click', renderApp);
  input.addEventListener('keypress', (e) => { if (e.key === 'Enter') commitEditChanges(); });
}

/**
 * Drives view generation updates by sweeping and rebuilding DOM nodes to match state maps
 */
function renderApp() {
  // Clear lists down to base state containers to prepare clean draw
  pendingList.innerHTML = '';
  completedList.innerHTML = '';

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  // Sync numerical evaluation summary displays
  pendingCounter.innerText = `${pendingTasks.length} pending`;
  completedCounter.innerText = `${completedTasks.length} completed`;

  // Draw default notifications when entries array segments look empty
  if (pendingTasks.length === 0) {
    pendingList.innerHTML = '<li class="empty-message">No pending tasks. Great job!</li>';
  }
  if (completedTasks.length === 0) {
    completedList.innerHTML = '<li class="empty-message">No completed tasks yet. Keep moving forward!</li>';
  }

  // Generate and mount operational structural elements per entry item
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;

    li.innerHTML = `
      <div class="task-row">
        <div class="checkbox-btn" data-action="toggle"></div>
        <span class="task-text">${escapeHTML(task.text)}</span>
        <div class="actions">
          ${!task.completed ? '<button class="btn-action btn-edit" data-action="edit">Edit</button>' : ''}
          <button class="btn-action btn-delete" data-action="delete">Delete</button>
        </div>
      </div>
      <div class="timestamp">
        Added: ${task.createdTime} ${task.completedTime ? ` | Completed: ${task.completedTime}` : ''}
      </div>
    `;

    // Connect node listener logic handlers exclusively to the component node subtree elements
    const row = li.querySelector('.task-row');
    li.querySelector('[data-action="toggle"]').addEventListener('click', () => toggleTask(task.id));
    li.querySelector('[data-action="delete"]').addEventListener('click', () => deleteTask(task.id));
    
    if (!task.completed) {
      li.querySelector('[data-action="edit"]').addEventListener('click', () => enableEdit(task.id, row));
    }

    // Direct nodes appropriately toward their correct target lists
    if (task.completed) {
      completedList.appendChild(li);
    } else {
      pendingList.appendChild(li);
    }
  });
}

/**
 * Sanitation helper configuration to clean structural strings against XSS injection paths
 */
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}
