// Tareas en memoria. Sin red ni almacenamiento: cada recarga empieza desde cero.
// Se usa en el navegador (window.TaskFlowTasks) y en los tests de Node (module.exports).
(function (root) {
  'use strict';

  var STATUSES = [
    { id: 'todo', label: 'Por hacer' },
    { id: 'doing', label: 'En progreso' },
    { id: 'done', label: 'Hecho' },
  ];

  var PRIORITIES = [
    { id: 'alta', label: 'Alta' },
    { id: 'media', label: 'Media' },
    { id: 'baja', label: 'Baja' },
  ];

  var MESSAGES = {
    titleRequired: 'El título es obligatorio.',
    invalidPriority: 'La prioridad no es válida.',
    invalidStatus: 'El estado no es válido.',
    invalidDue: 'La fecha límite no es válida.',
    notFound: 'La tarea no existe.',
  };

  var DUE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

  function has(list, id) {
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return true;
    return false;
  }

  function copy(task) {
    return { id: task.id, title: task.title, priority: task.priority, status: task.status, due: task.due };
  }

  // 'YYYY-MM-DD' -> fecha local legible (es-PE). Se construye en hora local para no desfasar el día.
  function formatDue(due) {
    if (!due) return '';
    var parts = due.split('-');
    var date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return date.toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/\./g, '').replace(/ de /g, ' ');
  }

  function createTaskStore() {
    var tasks = [];
    var nextId = 1;

    function validate(input) {
      var title = String(input.title || '').trim();
      if (!title) return { ok: false, error: MESSAGES.titleRequired, field: 'title' };
      var priority = input.priority || 'media';
      if (!has(PRIORITIES, priority)) return { ok: false, error: MESSAGES.invalidPriority, field: 'priority' };
      var status = input.status || 'todo';
      if (!has(STATUSES, status)) return { ok: false, error: MESSAGES.invalidStatus, field: 'status' };
      var due = input.due || '';
      if (due && !DUE_PATTERN.test(due)) return { ok: false, error: MESSAGES.invalidDue, field: 'due' };
      return { ok: true, value: { title: title, priority: priority, status: status, due: due } };
    }

    return {
      add: function (input) {
        var v = validate(input || {});
        if (!v.ok) return v;
        var task = { id: nextId++, title: v.value.title, priority: v.value.priority, status: v.value.status, due: v.value.due };
        tasks.push(task);
        return { ok: true, task: copy(task) };
      },
      // Cambia el estado; la tarea pasa al final de la columna de destino. Misma columna: sin cambios.
      move: function (id, status) {
        if (!has(STATUSES, status)) return { ok: false, error: MESSAGES.invalidStatus, field: 'status' };
        var index = -1;
        for (var i = 0; i < tasks.length; i++) if (tasks[i].id === id) index = i;
        if (index === -1) return { ok: false, error: MESSAGES.notFound };
        var task = tasks[index];
        if (task.status !== status) {
          tasks.splice(index, 1);
          task.status = status;
          tasks.push(task);
        }
        return { ok: true, task: copy(task) };
      },
      list: function () {
        return tasks.map(copy);
      },
      byStatus: function (status) {
        return tasks.filter(function (t) { return t.status === status; }).map(copy);
      },
    };
  }

  var api = { createTaskStore: createTaskStore, STATUSES: STATUSES, PRIORITIES: PRIORITIES, MESSAGES: MESSAGES, formatDue: formatDue };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.TaskFlowTasks = api;
})(typeof window !== 'undefined' ? window : this);
