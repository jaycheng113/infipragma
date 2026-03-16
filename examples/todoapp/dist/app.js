// TodoApp — Application Logic (Scaffold)

(function () {
  'use strict';

  const STORAGE_KEY = 'todoapp-tasks';
  const THEME_KEY = 'todoapp-theme';

  // DOM Elements
  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');
  const taskList = document.getElementById('task-list');
  const emptyState = document.getElementById('empty-state');

  const filterBar = document.getElementById('filter-bar');
  const taskFooter = document.getElementById('task-footer');
  const taskCounter = document.getElementById('task-counter');
  const clearCompletedBtn = document.getElementById('clear-completed-btn');
  const toggleAllContainer = document.getElementById('toggle-all-container');
  const toggleAllCheckbox = document.getElementById('toggle-all');
  const statusAnnouncer = document.getElementById('status-announcer');

  // State
  let tasks = [];
  let currentFilter = 'all';
  let newlyAddedTaskId = null;

  // --- Accessibility ---

  function announce(message) {
    if (statusAnnouncer) {
      statusAnnouncer.textContent = '';
      // Force reflow so screen readers detect the change
      void statusAnnouncer.offsetHeight;
      statusAnnouncer.textContent = message;
    }
  }

  // --- Storage ---

  function loadTasks() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      tasks = data ? JSON.parse(data) : [];
    } catch {
      tasks = [];
    }
  }

  function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  // --- Dynamic Title ---

  function updateTitle(activeCount) {
    if (activeCount > 0) {
      document.title = '(' + activeCount + ') TodoApp';
    } else {
      document.title = 'TodoApp';
    }
  }

  // --- Rendering ---

  function getFilteredTasks() {
    if (currentFilter === 'active') {
      return tasks.filter(function (t) { return !t.completed; });
    }
    if (currentFilter === 'completed') {
      return tasks.filter(function (t) { return t.completed; });
    }
    return tasks;
  }

  function render() {
    taskList.innerHTML = '';

    var filtered = getFilteredTasks();

    if (tasks.length === 0) {
      emptyState.classList.remove('hidden');
      taskFooter.classList.add('hidden');
      toggleAllContainer.classList.add('hidden');
    } else {
      emptyState.classList.add('hidden');
      taskFooter.classList.remove('hidden');
      toggleAllContainer.classList.remove('hidden');
      var allCompleted = tasks.every(function (t) { return t.completed; });
      toggleAllCheckbox.checked = allCompleted;
    }

    var activeCount = tasks.filter(function (t) { return !t.completed; }).length;
    taskCounter.textContent = activeCount === 1 ? '1 item left' : activeCount + ' items left';

    var completedCount = tasks.filter(function (t) { return t.completed; }).length;
    if (completedCount > 0) {
      clearCompletedBtn.classList.remove('hidden');
    } else {
      clearCompletedBtn.classList.add('hidden');
    }

    updateTitle(activeCount);

    filtered.forEach(function (task, index) {
      const li = document.createElement('li');
      li.setAttribute('data-task-id', task.id);
      li.setAttribute('draggable', 'true');
      if (task.completed) li.classList.add('completed');
      if (task.id === newlyAddedTaskId) {
        li.classList.add('task-adding');
        li.addEventListener('animationend', function () {
          li.classList.remove('task-adding');
        }, { once: true });
      }

      // Drag and drop handlers
      li.addEventListener('dragstart', function (e) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', task.id);
        li.classList.add('dragging');
      });

      li.addEventListener('dragend', function () {
        li.classList.remove('dragging');
        var placeholder = taskList.querySelector('.drag-placeholder');
        if (placeholder) placeholder.remove();
      });

      li.setAttribute('role', 'listitem');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.completed;
      checkbox.setAttribute('aria-label', (task.completed ? 'Mark "' : 'Complete "') + task.text + '"');
      checkbox.addEventListener('change', function () {
        toggleTask(task.id);
      });

      const span = document.createElement('span');
      span.classList.add('task-text');
      span.textContent = task.text;

      span.addEventListener('dblclick', function () {
        var editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.classList.add('edit-input');
        editInput.value = task.text;
        li.replaceChild(editInput, span);
        editInput.focus();

        var committed = false;
        function commit() {
          if (committed) return;
          committed = true;
          editTask(task.id, editInput.value);
        }
        function cancel() {
          if (committed) return;
          committed = true;
          li.replaceChild(span, editInput);
        }

        editInput.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') {
            e.preventDefault();
            commit();
          } else if (e.key === 'Escape') {
            e.preventDefault();
            cancel();
          }
        });
        editInput.addEventListener('blur', function () {
          commit();
        });
      });

      var taskContent = document.createElement('div');
      taskContent.classList.add('task-content');
      taskContent.appendChild(span);

      if (task.createdAt) {
        var timestamp = document.createElement('small');
        timestamp.classList.add('task-timestamp');
        timestamp.textContent = formatDate(task.createdAt);
        taskContent.appendChild(timestamp);
      }

      const deleteBtn = document.createElement('button');
      deleteBtn.classList.add('delete-btn');
      deleteBtn.textContent = '\u00d7';
      deleteBtn.setAttribute('aria-label', 'Delete task');
      deleteBtn.addEventListener('click', function () {
        deleteTask(task.id);
      });

      li.appendChild(checkbox);
      li.appendChild(taskContent);
      li.appendChild(deleteBtn);
      taskList.appendChild(li);
    });
  }

  // --- ID Generation ---

  function generateId() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9);
  }

  // --- Date Formatting ---

  function formatDate(isoString) {
    var date = new Date(isoString);
    var now = new Date();
    var diffMs = now - date;
    var diffSec = Math.floor(diffMs / 1000);
    var diffMin = Math.floor(diffSec / 60);
    var diffHr = Math.floor(diffMin / 60);
    var diffDays = Math.floor(diffHr / 24);

    if (diffSec < 60) return 'just now';
    if (diffMin < 60) return diffMin + 'm ago';
    if (diffHr < 24) return diffHr + 'h ago';
    if (diffDays < 7) return diffDays + 'd ago';

    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  // --- Task Operations ---

  function addTask(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    var id = generateId();
    tasks.push({
      id: id,
      text: trimmed,
      completed: false,
      createdAt: new Date().toISOString(),
    });

    newlyAddedTaskId = id;
    saveTasks();
    render();
    newlyAddedTaskId = null;
    announce('Task added: ' + trimmed);
  }

  function toggleTask(id) {
    var task = tasks.find(function (t) { return t.id === id; });
    if (task) {
      task.completed = !task.completed;
      saveTasks();
      render();
      announce('Task "' + task.text + '" ' + (task.completed ? 'completed' : 'marked active'));
    }
  }

  function deleteTask(id) {
    var task = tasks.find(function (t) { return t.id === id; });
    var taskText = task ? task.text : '';
    var li = taskList.querySelector('li[data-task-id="' + id + '"]');
    if (li) {
      li.classList.add('task-deleting');
      var done = false;
      function finish() {
        if (done) return;
        done = true;
        tasks = tasks.filter(function (t) { return t.id !== id; });
        saveTasks();
        render();
        announce('Task deleted: ' + taskText);
      }
      li.addEventListener('animationend', finish, { once: true });
      // Fallback in case animationend doesn't fire
      setTimeout(finish, 350);
    } else {
      tasks = tasks.filter(function (t) { return t.id !== id; });
      saveTasks();
      render();
      announce('Task deleted: ' + taskText);
    }
  }

  function editTask(id, newText) {
    var trimmed = newText.trim();
    if (!trimmed) return;
    var task = tasks.find(function (t) { return t.id === id; });
    if (task) {
      task.text = trimmed;
      saveTasks();
      render();
    }
  }

  function clearCompleted() {
    var count = tasks.filter(function (t) { return t.completed; }).length;
    tasks = tasks.filter(function (t) { return !t.completed; });
    saveTasks();
    render();
    announce(count + ' completed task' + (count !== 1 ? 's' : '') + ' cleared');
  }

  // --- Drag and Drop ---

  function moveTask(taskId, targetId, insertBefore) {
    var fromIndex = tasks.findIndex(function (t) { return t.id === taskId; });
    if (fromIndex === -1) return;
    var task = tasks.splice(fromIndex, 1)[0];
    var toIndex = tasks.findIndex(function (t) { return t.id === targetId; });
    if (toIndex === -1) {
      tasks.push(task);
    } else {
      if (insertBefore) {
        tasks.splice(toIndex, 0, task);
      } else {
        tasks.splice(toIndex + 1, 0, task);
      }
    }
    saveTasks();
    render();
  }

  taskList.addEventListener('dragover', function (e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    var target = e.target.closest('li[data-task-id]');
    if (!target || target.classList.contains('dragging')) return;

    // Remove existing placeholder
    var existing = taskList.querySelector('.drag-placeholder');
    if (existing) existing.remove();

    // Show visual indicator via CSS class
    var rect = target.getBoundingClientRect();
    var midY = rect.top + rect.height / 2;
    if (e.clientY < midY) {
      target.classList.add('drag-over-top');
      target.classList.remove('drag-over-bottom');
    } else {
      target.classList.add('drag-over-bottom');
      target.classList.remove('drag-over-top');
    }
  });

  taskList.addEventListener('dragleave', function (e) {
    var target = e.target.closest('li[data-task-id]');
    if (target) {
      target.classList.remove('drag-over-top', 'drag-over-bottom');
    }
  });

  taskList.addEventListener('drop', function (e) {
    e.preventDefault();
    var taskId = e.dataTransfer.getData('text/plain');
    var target = e.target.closest('li[data-task-id]');

    // Clean up all drag-over classes
    taskList.querySelectorAll('li').forEach(function (li) {
      li.classList.remove('drag-over-top', 'drag-over-bottom');
    });

    if (!target) return;
    var targetId = target.getAttribute('data-task-id');
    if (taskId === targetId) return;

    var rect = target.getBoundingClientRect();
    var midY = rect.top + rect.height / 2;
    var insertBefore = e.clientY < midY;
    moveTask(taskId, targetId, insertBefore);
  });

  // --- Export / Import ---

  var exportBtn = document.getElementById('export-btn');
  var importInput = document.getElementById('import-input');

  exportBtn.addEventListener('click', function () {
    var dataStr = JSON.stringify(tasks, null, 2);
    var blob = new Blob([dataStr], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'todoapp-tasks.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  importInput.addEventListener('change', function (e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (ev) {
      try {
        var imported = JSON.parse(ev.target.result);
        if (!Array.isArray(imported)) {
          alert('Invalid file: expected a JSON array of tasks.');
          return;
        }
        // Validate each item has at minimum id, text, completed
        var valid = imported.every(function (t) {
          return t && typeof t.text === 'string' && typeof t.completed === 'boolean';
        });
        if (!valid) {
          alert('Invalid file: each task must have text (string) and completed (boolean).');
          return;
        }
        // Assign new IDs to avoid collisions, preserve text and completed
        imported.forEach(function (t) {
          if (!t.id) t.id = generateId();
        });
        tasks = imported;
        saveTasks();
        render();
      } catch (err) {
        alert('Failed to import: invalid JSON file.');
      }
    };
    reader.readAsText(file);
    // Reset so the same file can be re-imported
    importInput.value = '';
  });

  // --- Event Handlers ---

  taskForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var trimmed = taskInput.value.trim();
    if (!trimmed) {
      taskInput.classList.add('invalid');
      taskInput.focus();
      return;
    }
    addTask(taskInput.value);
    taskInput.value = '';
    taskInput.focus();
  });

  taskInput.addEventListener('input', function () {
    taskInput.classList.remove('invalid');
  });

  // --- Clear Completed Handler ---

  clearCompletedBtn.addEventListener('click', function () {
    clearCompleted();
  });

  // --- Toggle All Handler ---

  toggleAllCheckbox.addEventListener('change', function () {
    var anyActive = tasks.some(function (t) { return !t.completed; });
    var newState = anyActive;
    tasks.forEach(function (t) { t.completed = newState; });
    saveTasks();
    render();
  });

  // --- Filter Handlers ---

  filterBar.addEventListener('click', function (e) {
    var btn = e.target.closest('.filter-btn');
    if (!btn) return;
    currentFilter = btn.getAttribute('data-filter');
    filterBar.querySelectorAll('.filter-btn').forEach(function (b) {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');
    render();
    announce('Filter: ' + currentFilter);
  });

  // --- Theme Toggle ---

  var themeToggle = document.getElementById('theme-toggle');

  function getPreferredTheme() {
    var saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    themeToggle.textContent = theme === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF19';
  }

  themeToggle.addEventListener('click', function () {
    var current = document.documentElement.getAttribute('data-theme') || 'light';
    var next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });

  applyTheme(getPreferredTheme());

  // --- Init ---
  loadTasks();
  render();
})();
