// src/editor.js
const API = (() => {
  try {
    return window.location.origin.includes('http') ? window.location.origin : 'http://localhost:5174';
  } catch { return 'http://localhost:5174'; }
})();

const params = new URLSearchParams(window.location.search);
const currentId = params.get('id');

const els = {
  title: document.getElementById('file-title'),
  editor: document.getElementById('editor'),
  preview: document.getElementById('preview'),
  btnSave: document.getElementById('btn-save'),
  btnDelete: document.getElementById('btn-delete'),
};

if (!currentId) {
  alert('Aucun fichier sélectionné.');
  window.location.href = '/';
}

marked.setOptions({ breaks: true, gfm: true });

function renderPreview() {
  const html = marked.parse(els.editor.value || '');
  els.preview.innerHTML = DOMPurify.sanitize(html);
}
els.editor.addEventListener('input', renderPreview);

async function api(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function load() {
  const f = await api(`/api/files/${currentId}`);
  els.title.value = f.title || '';
  els.editor.value = f.content || '';
  renderPreview();
}

async function save() {
  await api(`/api/files/${currentId}`, {
    method: 'PUT',
    body: JSON.stringify({ title: els.title.value, content: els.editor.value })
  });
  // feedback discret
  els.btnSave.textContent = 'Enregistré';
  setTimeout(() => (els.btnSave.textContent = 'Enregistrer'), 1200);
}

async function del() {
  if (!confirm('Supprimer ce fichier ?')) return;
  await api(`/api/files/${currentId}`, { method: 'DELETE' });
  window.location.href = '/';
}

els.btnSave.onclick = save;
els.btnDelete.onclick = del;

load().catch(err => {
  console.error(err);
  alert('Impossible de charger le fichier.');
  window.location.href = '/';
});
