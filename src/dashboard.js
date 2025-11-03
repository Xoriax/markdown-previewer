const API = (() => {
  try {
    return window.location.origin.includes('http') ? window.location.origin : 'http://localhost:5174';
  } catch { return 'http://localhost:5174'; }
})();

const els = {
  grid: document.getElementById('grid'),
  newCard: document.getElementById('new-card'),
  search: document.getElementById('search'),
  menu: document.getElementById('card-menu'),
};

let state = {
  files: [],
  filtered: [],
  menu: { open: false, fileId: null, anchorRect: null }
};

function formatDate(ts) {
  const d = new Date(ts);
  return d.toLocaleString();
}

function mdToText(md, max = 180) {
  const text = (md || '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/[#>*_~\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > max ? text.slice(0, max - 1) + '…' : text;
}

function cardElement(file) {
  const el = document.createElement('article');
  el.className = 'card';
  el.setAttribute('data-id', file._id);
  el.setAttribute('role', 'button');
  el.setAttribute('tabindex', '0');
  el.setAttribute('aria-label', `Ouvrir ${file.title}`);

  el.innerHTML = `
    <button class="kebab" type="button" aria-haspopup="menu" aria-label="Options">
      &hellip;
    </button>
    <div class="title">${file.title || 'Sans titre'}</div>
    <div class="snippet">${mdToText(file.content) || 'Aucun contenu pour le moment.'}</div>
    <div class="meta">
      <span class="badge">Modifié: ${formatDate(file.updatedAt || file.createdAt)}</span>
      <span class="cta">Ouvrir →</span>
    </div>
  `;

  el.addEventListener('click', (e) => {
    if (e.target.closest('.kebab')) return;
    const id = el.getAttribute('data-id');
    window.location.href = `/editor.html?id=${id}`;
  });
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const id = el.getAttribute('data-id');
      window.location.href = `/editor.html?id=${id}`;
    }
  });

  const kebab = el.querySelector('.kebab');
  kebab.addEventListener('click', (e) => {
    e.stopPropagation();
    const rect = kebab.getBoundingClientRect();
    openMenu(file._id, rect);
  });

  return el;
}

function paint() {
  els.grid.querySelectorAll('.card:not(.new-card)').forEach(n => n.remove());
  let insertAfter = els.newCard;
  state.filtered.forEach(file => {
    const card = cardElement(file);
    insertAfter.insertAdjacentElement('afterend', card);
    insertAfter = card;
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

function positionMenu(rect) {
  const menu = els.menu;
  const margin = 6;
  const top = Math.min(
    window.innerHeight - menu.offsetHeight - margin,
    rect.bottom + window.scrollY + margin
  );
  const left = Math.min(
    window.innerWidth - menu.offsetWidth - margin,
    rect.right + window.scrollX - menu.offsetWidth
  );
  menu.style.top = `${top}px`;
  menu.style.left = `${left}px`;
}

function openMenu(fileId, anchorRect) {
  state.menu.open = true;
  state.menu.fileId = fileId;
  state.menu.anchorRect = anchorRect;

  els.menu.classList.remove('hidden');
  els.menu.setAttribute('aria-hidden', 'false');

  requestAnimationFrame(() => {
    positionMenu(anchorRect);

    const first = els.menu.querySelector('.menu-item');
    if (first) first.focus();
  });
}

function closeMenu() {
  if (!state.menu.open) return;
  state.menu.open = false;
  state.menu.fileId = null;
  state.menu.anchorRect = null;
  els.menu.classList.add('hidden');
  els.menu.setAttribute('aria-hidden', 'true');
}

async function handleMenuAction(action) {
  const id = state.menu.fileId;
  if (!id) return;

  if (action === 'rename') {
    const current = state.files.find(f => f._id === id);
    const title = prompt('Nouveau titre :', current?.title || 'Sans titre');
    if (title == null) return;
    const trimmed = title.trim();
    if (!trimmed) return alert('Le titre ne peut pas être vide.');
    await api(`/api/files/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title: trimmed })
    });
    await loadFiles();
    closeMenu();
    return;
  }

  if (action === 'delete') {
    if (!confirm('Supprimer ce fichier ?')) return;
    await api(`/api/files/${id}`, { method: 'DELETE' });
    await loadFiles();
    closeMenu();
    return;
  }
}

async function createFile() {
  try {
    const payload = {
      title: 'Nouveau fichier',
      content: '# Nouveau document\n\nCommencez à écrire votre contenu Markdown.',
    };
    await api('/api/files', { method: 'POST', body: JSON.stringify(payload) });
    await new Promise(r => setTimeout(r, 80));
    await loadFiles();
  } catch (err) {
    console.error('Erreur lors de la création du fichier:', err);
    alert('Impossible de créer le fichier. Veuillez réessayer.');
  }
}

function bind() {
  els.newCard.onclick = createFile;
  els.newCard.onkeydown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') createFile();
  };
  els.search.addEventListener('input', onSearch);

  els.menu.addEventListener('click', (e) => {
    const btn = e.target.closest('.menu-item');
    if (!btn) return;
    const action = btn.dataset.action;
    handleMenuAction(action).catch(console.error);
  });

  document.addEventListener('click', (e) => {
    if (state.menu.open && !e.target.closest('#card-menu') && !e.target.closest('.kebab')) {
      closeMenu();
    }
  });

  window.addEventListener('resize', closeMenu);
  window.addEventListener('scroll', closeMenu, true);

  els.menu.addEventListener('keydown', (e) => {
    const items = Array.from(els.menu.querySelectorAll('.menu-item'));
    const idx = items.indexOf(document.activeElement);
    if (e.key === 'Escape') return closeMenu();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[(idx + 1) % items.length]?.focus();
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      items[(idx - 1 + items.length) % items.length]?.focus();
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      document.activeElement?.click();
    }
  });

  window.addEventListener('focus', () => {
    loadFiles().catch(console.error);
  });
}

bind();
loadFiles().catch(err => {
  console.error(err);
  alert('Impossible de charger les fichiers. Vérifie que le serveur tourne (npm run dev).');
});
