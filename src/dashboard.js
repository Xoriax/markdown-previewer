// src/dashboard.js

const API = (() => {
  try {
    return window.location.origin.includes('http') ? window.location.origin : 'http://localhost:5174';
  } catch { return 'http://localhost:5174'; }
})();

const els = {
  grid: document.getElementById('grid'),
  newCard: document.getElementById('new-card'),
  search: document.getElementById('search'),
};

let state = {
  files: [],
  filtered: [],
};

function formatDate(ts) {
  const d = new Date(ts);
  return d.toLocaleString();
}

function mdToText(md, max = 180) {
  // Très simple "strip markdown"
  const text = md
    .replace(/```[\s\S]*?```/g, '')   // blocs code
    .replace(/`[^`]*`/g, '')          // inline code
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '') // images
    .replace(/\[[^\]]*\]\([^)]+\)/g, '')  // liens
    .replace(/[#>*_~\-]+/g, ' ')          // syntaxe de base
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > max ? text.slice(0, max - 1) + '…' : text;
}

function cardHTML(file) {
  return `
    <article class="card" data-id="${file._id}" role="button" tabindex="0" aria-label="Ouvrir ${file.title}">
      <div class="title">${file.title || 'Sans titre'}</div>
      <div class="snippet">${mdToText(file.content || '') || 'Aucun contenu pour le moment.'}</div>
      <div class="meta">
        <span class="badge">Modifié: ${formatDate(file.updatedAt || file.createdAt)}</span>
        <span class="cta">Ouvrir →</span>
      </div>
    </article>
  `;
}

function paint() {
  // enlève toutes les cartes sauf la tuile + (premier enfant)
  els.grid.querySelectorAll('.card:not(.new-card)').forEach(n => n.remove());
  const frag = document.createElement('div');
  frag.innerHTML = state.filtered.map(cardHTML).join('');
  // insérer après la new-card
  els.newCard.insertAdjacentElement('afterend', frag);
  // binder
  els.grid.querySelectorAll('.card:not(.new-card)').forEach(card => {
    card.onclick = () => {
      const id = card.getAttribute('data-id');
      window.location.href = `/editor.html?id=${id}`;
    };
    card.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') card.click();
    };
  });
}

async function api(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function loadFiles() {
  const files = await api('/api/files');
  state.files = files;
  state.filtered = files;
  paint();
}

function onSearch(e) {
  const q = (e.target.value || '').toLowerCase();
  state.filtered = state.files.filter(f =>
    (f.title || '').toLowerCase().includes(q)
    || (f.content || '').toLowerCase().includes(q)
  );
  paint();
}

async function createFile() {
  // modèle de fichier initial
  const payload = {
    title: 'Nouveau fichier',
    content: '# Nouveau document\n\nCommencez à écrire votre contenu Markdown.',
  };
  const created = await api('/api/files', { method: 'POST', body: JSON.stringify(payload) });

  // ajouter visuellement une carte de prévisualisation à côté (immédiat)
  state.files.unshift(created);
  state.filtered.unshift(created);
  paint();

  // focus visuel et accès éditeur au clic utilisateur
  // (si tu veux rediriger directement, décommente la ligne suivante)
  // window.location.href = `/editor.html?id=${created._id}`;
}

function bind() {
  els.newCard.onclick = createFile;
  els.newCard.onkeydown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') createFile();
  };
  els.search.addEventListener('input', onSearch);
}

bind();
loadFiles().catch(err => {
  console.error(err);
  alert('Impossible de charger les fichiers. Vérifie que le serveur tourne (npm run dev).');
});
