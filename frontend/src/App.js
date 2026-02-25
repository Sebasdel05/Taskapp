import React, { useState, useEffect, useCallback } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const PRIORITY_COLORS = {
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#ef4444',
};

const PRIORITY_LABELS = { low: 'Baja', medium: 'Media', high: 'Alta' };

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium' });
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch(`${API}/tasks`);
      const json = await res.json();
      setTasks(json.data || []);
    } catch {
      setError('No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    try {
      const url = editId ? `${API}/tasks/${editId}` : `${API}/tasks`;
      const method = editId ? 'PUT' : 'POST';
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setForm({ title: '', description: '', priority: 'medium' });
      setEditId(null);
      fetchTasks();
    } catch {
      setError('Error al guardar la tarea.');
    }
  };

  const toggleComplete = async (task) => {
    await fetch(`${API}/tasks/${task._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !task.completed }),
    });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    if (!window.confirm('¿Eliminar esta tarea?')) return;
    await fetch(`${API}/tasks/${id}`, { method: 'DELETE' });
    fetchTasks();
  };

  const startEdit = (task) => {
    setEditId(task._id);
    setForm({ title: task.title, description: task.description, priority: task.priority });
  };

  const filtered = tasks.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'done') return t.completed;
    return true;
  });

  const styles = {
    root: { fontFamily: "'Segoe UI', sans-serif", background: '#0f172a', minHeight: '100vh', color: '#e2e8f0', padding: '2rem 1rem' },
    container: { maxWidth: 700, margin: '0 auto' },
    header: { textAlign: 'center', marginBottom: '2rem' },
    h1: { fontSize: '2.2rem', fontWeight: 800, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    subtitle: { color: '#94a3b8', marginTop: 4 },
    card: { background: '#1e293b', borderRadius: 16, padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid #334155' },
    input: { width: '100%', padding: '0.6rem 0.9rem', borderRadius: 8, border: '1px solid #475569', background: '#0f172a', color: '#e2e8f0', fontSize: '0.95rem', boxSizing: 'border-box', marginBottom: 10 },
    select: { width: '100%', padding: '0.6rem 0.9rem', borderRadius: 8, border: '1px solid #475569', background: '#0f172a', color: '#e2e8f0', fontSize: '0.95rem', boxSizing: 'border-box', marginBottom: 12 },
    btn: { padding: '0.6rem 1.4rem', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' },
    btnPrimary: { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', width: '100%' },
    btnSmall: { padding: '0.35rem 0.8rem', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 },
    filterRow: { display: 'flex', gap: 8, marginBottom: '1.2rem' },
    task: { background: '#0f172a', borderRadius: 12, padding: '1rem', marginBottom: 10, border: '1px solid #334155', display: 'flex', gap: 12, alignItems: 'flex-start' },
    taskTitle: { fontWeight: 600, fontSize: '1rem', marginBottom: 2 },
    taskDesc: { fontSize: '0.85rem', color: '#94a3b8' },
    badge: { display: 'inline-block', padding: '2px 8px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, color: '#fff' },
    checkbox: { width: 20, height: 20, cursor: 'pointer', marginTop: 2, accentColor: '#6366f1' },
    actions: { display: 'flex', gap: 6, marginTop: 8 },
    error: { background: '#450a0a', border: '1px solid #ef4444', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1rem', color: '#fca5a5' },
    stats: { display: 'flex', gap: 12, justifyContent: 'center', marginBottom: '1.5rem' },
    stat: { background: '#1e293b', borderRadius: 10, padding: '0.6rem 1.2rem', textAlign: 'center', border: '1px solid #334155' },
    statNum: { fontSize: '1.5rem', fontWeight: 800, color: '#8b5cf6' },
    statLabel: { fontSize: '0.75rem', color: '#94a3b8' },
  };

  const total = tasks.length;
  const done = tasks.filter((t) => t.completed).length;

  return (
    <div style={styles.root}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.h1}>✅ TaskApp</div>
          <div style={styles.subtitle}>Gestiona tus tareas con React + Node + MongoDB</div>
        </div>

        {error && <div style={styles.error}>⚠️ {error}</div>}

        <div style={styles.stats}>
          <div style={styles.stat}><div style={styles.statNum}>{total}</div><div style={styles.statLabel}>Total</div></div>
          <div style={styles.stat}><div style={{ ...styles.statNum, color: '#22c55e' }}>{done}</div><div style={styles.statLabel}>Completadas</div></div>
          <div style={styles.stat}><div style={{ ...styles.statNum, color: '#f59e0b' }}>{total - done}</div><div style={styles.statLabel}>Pendientes</div></div>
        </div>

        <div style={styles.card}>
          <h2 style={{ margin: '0 0 1rem', fontSize: '1rem', color: '#94a3b8' }}>
            {editId ? '✏️ Editar tarea' : '➕ Nueva tarea'}
          </h2>
          <form onSubmit={handleSubmit}>
            <input style={styles.input} placeholder="Título de la tarea *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <input style={styles.input} placeholder="Descripción (opcional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <select style={styles.select} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              <option value="low">🟢 Prioridad Baja</option>
              <option value="medium">🟡 Prioridad Media</option>
              <option value="high">🔴 Prioridad Alta</option>
            </select>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" style={{ ...styles.btn, ...styles.btnPrimary }}>
                {editId ? 'Actualizar' : 'Crear Tarea'}
              </button>
              {editId && (
                <button type="button" style={{ ...styles.btn, background: '#334155', color: '#e2e8f0' }} onClick={() => { setEditId(null); setForm({ title: '', description: '', priority: 'medium' }); }}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div style={styles.filterRow}>
          {['all', 'active', 'done'].map((f) => (
            <button key={f} style={{ ...styles.btn, background: filter === f ? '#6366f1' : '#1e293b', color: filter === f ? '#fff' : '#94a3b8', border: '1px solid #334155' }} onClick={() => setFilter(f)}>
              {f === 'all' ? 'Todas' : f === 'active' ? 'Pendientes' : 'Completadas'}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>Cargando tareas...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#475569', padding: '2rem' }}>Sin tareas en esta categoría.</div>
        ) : (
          filtered.map((task) => (
            <div key={task._id} style={{ ...styles.task, opacity: task.completed ? 0.6 : 1 }}>
              <input type="checkbox" style={styles.checkbox} checked={task.completed} onChange={() => toggleComplete(task)} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ ...styles.taskTitle, textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</span>
                  <span style={{ ...styles.badge, background: PRIORITY_COLORS[task.priority] }}>{PRIORITY_LABELS[task.priority]}</span>
                </div>
                {task.description && <div style={styles.taskDesc}>{task.description}</div>}
                <div style={styles.actions}>
                  <button style={{ ...styles.btnSmall, background: '#1e40af', color: '#bfdbfe' }} onClick={() => startEdit(task)}>Editar</button>
                  <button style={{ ...styles.btnSmall, background: '#7f1d1d', color: '#fecaca' }} onClick={() => deleteTask(task._id)}>Eliminar</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
