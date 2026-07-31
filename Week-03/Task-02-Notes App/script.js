const STORAGE_KEY = 'corkboard.notes.v1';
  const colors = ['note-yellow','note-pink','note-blue','note-green','note-orange'];
  const pinColors = ['#d63b3b','#3b6bd6','#2f9e44','#e08e0b','#a13bd6'];

  let notes = loadNotes();
  let editingId = null;
  let searchTerm = '';

  function loadNotes(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if(!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    }catch(e){
      console.error('Failed to load notes', e);
      return [];
    }
  }

  function saveNotes(){
    try{
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    }catch(e){
      console.error('Failed to save notes', e);
    }
  }

  function uid(){
    return Date.now().toString(36) + Math.random().toString(36).slice(2,8);
  }

  function formatTimestamp(iso){
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'
    });
  }

  function seededVisual(id){
    // stable per-note color & rotation derived from id
    let hash = 0;
    for(let i=0;i<id.length;i++){ hash = (hash*31 + id.charCodeAt(i)) >>> 0; }
    const color = colors[hash % colors.length];
    const pin = pinColors[hash % pinColors.length];
    const rot = ((hash % 7) - 3) * 1.1; // -3.3deg .. 3.3deg
    return { color, pin, rot };
  }

  function render(){
    const grid = document.getElementById('grid');
    const empty = document.getElementById('emptyState');
    grid.innerHTML = '';

    const filtered = notes
      .filter(n => {
        if(!searchTerm) return true;
        const t = searchTerm.toLowerCase();
        return n.title.toLowerCase().includes(t) || n.content.toLowerCase().includes(t);
      })
      .sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    if(notes.length === 0){
      empty.style.display = 'block';
      empty.textContent = 'the board is bare — pin your first note above';
    } else if(filtered.length === 0){
      empty.style.display = 'block';
      empty.textContent = `no notes match "${searchTerm}"`;
    } else {
      empty.style.display = 'none';
    }

    filtered.forEach((note, i) => {
      const { color, pin, rot } = seededVisual(note.id);
      const el = document.createElement('div');
      el.className = `note ${color}`;
      el.style.setProperty('--rot', rot + 'deg');
      el.style.transform = `rotate(${rot}deg)`;
      el.style.animationDelay = (i * 45) + 'ms';
      el.dataset.id = note.id;

      el.innerHTML = `
        <div class="pin" style="background: radial-gradient(circle at 35% 30%, #fff8, ${pin} 60%, #0003 100%);"></div>
        <div class="note-title"></div>
        <div class="note-content"></div>
        <div class="note-footer">
          <span class="timestamp"></span>
          <div class="note-actions">
            <button class="edit-btn" title="Edit">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
              </svg>
            </button>
            <button class="delete-btn" title="Delete">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18"></path>
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                <path d="M10 11v6"></path>
                <path d="M14 11v6"></path>
              </svg>
            </button>
          </div>
        </div>
      `;
      el.querySelector('.note-title').textContent = note.title;
      el.querySelector('.note-content').textContent = note.content;
      el.querySelector('.timestamp').textContent = 'edited ' + formatTimestamp(note.updatedAt);

      el.querySelector('.edit-btn').addEventListener('click', () => openEditor(note.id));
      el.querySelector('.delete-btn').addEventListener('click', () => deleteNote(note.id));

      grid.appendChild(el);
    });
  }

  function deleteNote(id){
    const el = document.querySelector(`.note[data-id="${id}"]`);
    if(el){
      el.classList.add('removing');
      el.addEventListener('animationend', () => {
        notes = notes.filter(n => n.id !== id);
        saveNotes();
        render();
      }, { once:true });
    } else {
      notes = notes.filter(n => n.id !== id);
      saveNotes();
      render();
    }
  }

  function openEditor(id){
    editingId = id;
    const overlay = document.getElementById('overlay');
    const heading = document.getElementById('editorHeading');
    const titleInput = document.getElementById('titleInput');
    const contentInput = document.getElementById('contentInput');

    clearErrors();

    if(id){
      const note = notes.find(n => n.id === id);
      heading.textContent = 'Edit note';
      titleInput.value = note.title;
      contentInput.value = note.content;
    } else {
      heading.textContent = 'New note';
      titleInput.value = '';
      contentInput.value = '';
    }
    overlay.classList.add('open');
    setTimeout(() => titleInput.focus(), 50);
  }

  function closeEditor(){
    document.getElementById('overlay').classList.remove('open');
    editingId = null;
  }

  function clearErrors(){
    document.getElementById('titleField').classList.remove('invalid');
    document.getElementById('contentField').classList.remove('invalid');
  }

  function validateAndSave(){
    const titleInput = document.getElementById('titleInput');
    const contentInput = document.getElementById('contentInput');
    const titleField = document.getElementById('titleField');
    const contentField = document.getElementById('contentField');

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    let valid = true;
    clearErrors();

    if(!title){
      titleField.classList.add('invalid');
      valid = false;
    }
    if(!content){
      contentField.classList.add('invalid');
      valid = false;
    }

    if(!valid){
      const editorEl = document.querySelector('.editor');
      editorEl.style.animation = 'none';
      // force reflow to restart animation
      void editorEl.offsetWidth;
      editorEl.style.animation = 'shake 0.4s ease';
      return;
    }

    const now = new Date().toISOString();
    if(editingId){
      const note = notes.find(n => n.id === editingId);
      note.title = title;
      note.content = content;
      note.updatedAt = now;
    } else {
      notes.push({
        id: uid(),
        title,
        content,
        createdAt: now,
        updatedAt: now
      });
    }
    saveNotes();
    closeEditor();
    render();
  }

  document.getElementById('addBtn').addEventListener('click', () => openEditor(null));
  document.getElementById('cancelBtn').addEventListener('click', closeEditor);
  document.getElementById('saveBtn').addEventListener('click', validateAndSave);
  document.getElementById('overlay').addEventListener('click', (e) => {
    if(e.target.id === 'overlay') closeEditor();
  });
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && document.getElementById('overlay').classList.contains('open')){
      closeEditor();
    }
  });
  document.getElementById('searchInput').addEventListener('input', (e) => {
    searchTerm = e.target.value.trim();
    render();
  });

  render();