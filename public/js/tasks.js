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

  // Máximo de tareas que se pueden seleccionar a la vez para una acción en lote (decisión del PO en UAT).
  var MAX_SELECTION = 3;

  // Recorta una lista de ids a las primeras MAX_SELECTION, sin cambiar su orden.
  function limitSelection(ids) {
    return ids.slice(0, MAX_SELECTION);
  }

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

  function rank(list, id) {
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return i;
    return list.length;
  }

  // Devuelve una copia ordenada. Sin 'key' (o en empate) se ordena por creación (id).
  // Prioridad y estado siguen el orden de PRIORITIES y STATUSES; las tareas sin fecha van siempre al final.
  function sortTasks(list, key, dir) {
    var sign = dir === 'desc' ? -1 : 1;
    function compare(a, b) {
      if (key === 'title') return a.title.localeCompare(b.title, 'es', { sensitivity: 'base' }) * sign;
      if (key === 'priority') return (rank(PRIORITIES, a.priority) - rank(PRIORITIES, b.priority)) * sign;
      if (key === 'status') return (rank(STATUSES, a.status) - rank(STATUSES, b.status)) * sign;
      if (key === 'due') {
        if (!a.due || !b.due) return (a.due ? 0 : 1) - (b.due ? 0 : 1);
        return (a.due < b.due ? -1 : a.due > b.due ? 1 : 0) * sign;
      }
      return 0;
    }
    return list.slice().sort(function (a, b) { return compare(a, b) || a.id - b.id; });
  }

  // Minúsculas y sin acentos, carácter a carácter, para comparar textos al buscar.
  function fold(ch) {
    return ch.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  }

  // [inicio, fin) de la primera coincidencia de 'query' en 'title' (sin distinguir mayúsculas ni acentos), o null.
  // Los índices se refieren al título original para poder resaltar la coincidencia.
  function matchRange(title, query) {
    var q = Array.prototype.map.call(String(query || '').trim(), fold).join('');
    if (!q) return null;
    var folded = '';
    var starts = [];  // starts[i]: índice en 'title' del carácter que generó folded[i]
    for (var i = 0; i < title.length; i++) {
      var f = fold(title.charAt(i));
      for (var j = 0; j < f.length; j++) starts.push(i);
      folded += f;
    }
    var at = folded.indexOf(q);
    if (at === -1) return null;
    return [starts[at], starts[at + q.length - 1] + 1];
  }

  // Devuelve las tareas que cumplen todos los filtros activos (estado, prioridad y búsqueda por título);
  // un filtro vacío no restringe.
  function filterTasks(list, filters) {
    var f = filters || {};
    var query = String(f.query || '').trim();
    return list.filter(function (t) {
      return (!f.status || t.status === f.status) && (!f.priority || t.priority === f.priority) &&
        (!query || matchRange(t.title, query) !== null);
    });
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

    function indexOf(id) {
      for (var i = 0; i < tasks.length; i++) if (tasks[i].id === id) return i;
      return -1;
    }

    // Al cambiar de estado la tarea pasa al final de la nueva columna; con el mismo estado no se mueve.
    function setStatus(index, status) {
      var task = tasks[index];
      if (task.status === status) return;
      tasks.splice(index, 1);
      task.status = status;
      tasks.push(task);
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
        var index = indexOf(id);
        if (index === -1) return { ok: false, error: MESSAGES.notFound };
        var task = tasks[index];
        setStatus(index, status);
        return { ok: true, task: copy(task) };
      },
      // Cambia el estado de varias tareas a la vez. Se recorren en el orden actual para que conserven
      // su orden relativo al final de la columna de destino. Los ids inexistentes se ignoran.
      moveMany: function (ids, status) {
        if (!has(STATUSES, status)) return { ok: false, error: MESSAGES.invalidStatus, field: 'status' };
        var targets = tasks.filter(function (t) { return ids.indexOf(t.id) !== -1 && t.status !== status; });
        targets.forEach(function (task) { setStatus(tasks.indexOf(task), status); });
        return { ok: true, moved: targets.length };
      },
      // Reemplaza los datos con las mismas reglas que al crear. Si cambia el estado, se comporta como move.
      update: function (id, input) {
        var index = indexOf(id);
        if (index === -1) return { ok: false, error: MESSAGES.notFound };
        var v = validate(input || {});
        if (!v.ok) return v;
        var task = tasks[index];
        task.title = v.value.title;
        task.priority = v.value.priority;
        task.due = v.value.due;
        setStatus(index, v.value.status);
        return { ok: true, task: copy(task) };
      },
      remove: function (id) {
        var index = indexOf(id);
        if (index === -1) return { ok: false, error: MESSAGES.notFound };
        return { ok: true, task: copy(tasks.splice(index, 1)[0]) };
      },
      list: function () {
        return tasks.map(copy);
      },
      byStatus: function (status) {
        return tasks.filter(function (t) { return t.status === status; }).map(copy);
      },
    };
  }

  var api = { createTaskStore: createTaskStore, STATUSES: STATUSES, PRIORITIES: PRIORITIES, MESSAGES: MESSAGES, formatDue: formatDue, sortTasks: sortTasks, filterTasks: filterTasks, matchRange: matchRange,
    MAX_SELECTION: MAX_SELECTION, limitSelection: limitSelection };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.TaskFlowTasks = api;
})(typeof window !== 'undefined' ? window : this);
