// Config de marked
marked.setOptions({
  breaks: true,
  gfm: true
});

const editor = document.getElementById('editor');
const preview = document.getElementById('preview');

// Exemple de contenu initial
const starter = `# Bienvenue 👋

Tape du **Markdown** à gauche, vois le rendu *en direct* à droite.

## Exemples rapides
- **Gras** / *Italique* / \`Code\`
- Listes
- [Lien](https://example.com)
- \`\`\`js
console.log("Hello Markdown");
\`\`\`
`;

editor.value = starter;

// Render sécurisé avec DOMPurify
function render() {
  const raw = editor.value;
  const html = marked.parse(raw);
  preview.innerHTML = DOMPurify.sanitize(html);
}

editor.addEventListener('input', render);
render();

// Persistance simple (localStorage)
const KEY = 'markdown-previewer-content';
window.addEventListener('beforeunload', () => {
  localStorage.setItem(KEY, editor.value);
});
window.addEventListener('load', () => {
  const saved = localStorage.getItem(KEY);
  if (saved) {
    editor.value = saved;
    render();
  }
});