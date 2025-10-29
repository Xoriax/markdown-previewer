const API = origin => {
  // Si tu ouvres via http://localhost:5174, origin sera ce host.
  // Si tu ouvres via file://, remplace par "http://localhost:5174".
  try { return window.location.origin.includes('http') ? window.location.origin : 'http://localhost:5174'; }
  catch { return 'http://localhost:5174'; }
}();

const els = {
  list: document.getElementById('file-list'),
  search: document.getElementById('search'),
  btnNew: document.getElementById('btn-new'),
  btnSave: document.getElementById('btn-save'),
  btnDelete: document.getElementById('btn-delete'),
  title: document.getElementById('file-title'),
  editor: document.getElementById('editor'),
  preview: document.getElementById('preview')
};

let state = {
  files: [],
  currentId: null
};

// Markdown config + render
marked.setOptions({ breaks: true, gfm: true });
function renderPreview() {
  const html = marked.parse(els.editor.value || '');
  els.preview.innerHTML = DOMPurify.sanitize(html);
}
els.editor.addEventListener('input', renderPreview);

// Fetch helpers
async function api(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function loadFiles() {
  const all = await api('/api/files');
  state.files = all;
  paintList();
}

function paintList(filter = '') {
  const q = filter.toLowerCase();
  els.list.innerHTML = '';
  state.files
    .filter(f => f.title.toLowerCase().includes(q))
    .forEach(f => {
      const li = document.createElement('li');
      li.textContent = f.title;
      li.dataset.id = f._id;
      if (f._id === state.currentId) li.classList.add('active');
      li.onclick = () => openFile(f._id);
      els.list.appendChild(li);
    });
}

async function openFile(id) {
  const f = await api(`/api/files/${id}`);
  state.currentId = f._id;
  els.title.value = f.title;
  els.editor.value = f.content || '';
  renderPreview();
  paintList(els.search.value || '');
}

function newFileTemplate() {
  return {
    title: 'Nouveau fichier',
    content: '# Nouveau document\n\nTape ton Markdown ici.'
  };
}

async function createFile() {
  const body = newFileTemplate();
  const created = await api('/api/files', { method: 'POST', body: JSON.stringify(body) });
  state.files.unshift(created);
  state.currentId = created._id;
  paintList(els.search.value || '');
  openFile(created._id);
}

async function saveFile() {
  if (!state.currentId) {
    // Si aucun fichier sélectionné, on crée
    const created = await api('/api/files', {
      method: 'POST', body: JSON.stringify({
        title: els.title.value || 'Sans titre',
        content: els.editor.value || ''
      })
    });
    state.files.unshift(created);
    state.currentId = created._id;
    paintList(els.search.value || '');
    return;
  }
  const updated = await api(`/api/files/${state.currentId}`, {
    method: 'PUT',
    body: JSON.stringify({ title: els.title.value, content: els.editor.value })
  });
  // Met à jour la liste
  const idx = state.files.findIndex(f => f._id === state.currentId);
  if (idx >= 0) state.files[idx] = updated;
  paintList(els.search.value || '');
}

async function deleteFile() {
  if (!state.currentId) return;
  await api(`/api/files/${state.currentId}`, { method: 'DELETE' });
  state.files = state.files.filter(f => f._id !== state.currentId);
  state.currentId = null;
  els.title.value = '';
  els.editor.value = '';
  renderPreview();
  paintList(els.search.value || '');
}

// Bind UI
els.btnNew.onclick = createFile;
els.btnSave.onclick = saveFile;
els.btnDelete.onclick = deleteFile;
els.search.oninput = (e) => paintList(e.target.value);

// Init
renderPreview();
loadFiles().catch(err => {
  console.error(err);
  alert('Impossible de charger les fichiers. Vérifie que le serveur tourne (npm run dev).');
});