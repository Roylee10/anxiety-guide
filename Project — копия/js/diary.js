    /* ── dnevnik: emotion diary ── */
    const MOODS = [
      { id: 'calm', label: 'Спокойно', emoji: '😌', color: '#1F7A6C', pale: '#E1F0EB' },
      { id: 'happy', label: 'Радостно', emoji: '😄', color: '#C07F1C', pale: '#FBEEDA' },
      { id: 'sad', label: 'Грустно', emoji: '😢', color: '#4C7C9B', pale: '#E4EEF3' },
      { id: 'anxious', label: 'Тревожно', emoji: '😟', color: '#8F3A5E', pale: '#F7E5ED' },
      { id: 'angry', label: 'Злился', emoji: '😠', color: '#9E3F2D', pale: '#FBE7E1' },
      { id: 'tired', label: 'Устал', emoji: '🥱', color: '#5A6B62', pale: '#E3E9DD' },
    ];
    const STORAGE_KEY = 'diary-entries';
    let entries = [];
    let selectedMood = null;
    let storageAvailable = true;

    const $ = (id) => document.getElementById(id);
    const todayStr = () => new Date().toISOString().slice(0, 10);

    function moodById(id) { return MOODS.find(m => m.id === id); }

    function renderMoodGrid() {
      const grid = $('moodGrid');
      grid.innerHTML = '';
      MOODS.forEach(m => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'mood-btn' + (selectedMood === m.id ? ' on' : '');
        btn.style.setProperty('--mc', m.color);
        btn.style.setProperty('--mc-pale', m.pale);
        btn.innerHTML = `<span class="emoji">${m.emoji}</span><span class="label">${m.label}</span>`;
        btn.addEventListener('click', () => { selectedMood = m.id; renderMoodGrid(); updateSaveState(); });
        grid.appendChild(btn);
      });
    }

    function updateSaveState() {
      $('saveBtn').disabled = !selectedMood;
    }

    function findEntry(date) { return entries.find(e => e.date === date); }

    function loadFormForDate(date) {
      const existing = findEntry(date);
      selectedMood = existing ? existing.mood : null;
      $('entryNote').value = existing ? (existing.note || '') : '';
      $('editingNote').style.display = existing ? 'inline-block' : 'none';
      $('formTitle').textContent = existing ? 'Изменить запись за этот день' : 'Как ребёнок себя чувствовал?';
      renderMoodGrid();
      updateSaveState();
    }

    function renderHistory() {
      const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
      const list = $('histList');
      list.innerHTML = '';
      if (sorted.length === 0) {
        $('historyEmpty').style.display = 'block';
        $('historyHint').style.display = 'none';
        $('chartCard').style.display = 'none';
        return;
      }
      $('historyEmpty').style.display = 'none';
      $('historyHint').style.display = 'block';
      $('historyHint').textContent = `Всего записей: ${sorted.length}`;
      sorted.slice(0, 30).forEach(e => {
        const m = moodById(e.mood);
        const row = document.createElement('div');
        row.className = 'hist-item';
        const d = new Date(e.date + 'T00:00:00');
        const dateLabel = d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
        row.innerHTML = `
      <span class="hist-emoji" style="background:${m ? m.pale : '#eee'}">${m ? m.emoji : '❓'}</span>
      <div class="hist-body">
        <div class="hist-date">${dateLabel}</div>
        <div class="hist-mood">${m ? m.label : 'Неизвестно'}</div>
        ${e.note ? `<div class="hist-note">${escapeHtml(e.note)}</div>` : ''}
      </div>
      <button class="hist-del" data-date="${e.date}" aria-label="Удалить запись">Удалить</button>`;
        list.appendChild(row);
      });
      list.querySelectorAll('.hist-del').forEach(btn => {
        btn.addEventListener('click', async () => {
          entries = entries.filter(e => e.date !== btn.dataset.date);
          await persist();
          renderHistory();
          renderChart();
          if ($('entryDate').value === btn.dataset.date) loadFormForDate(btn.dataset.date);
        });
      });
    }

    function renderChart() {
      const card = $('chartCard');
      if (entries.length === 0) { card.style.display = 'none'; return; }
      card.style.display = 'block';
      const counts = {};
      MOODS.forEach(m => counts[m.id] = 0);
      entries.forEach(e => { if (counts[e.mood] !== undefined) counts[e.mood]++; });
      const max = Math.max(1, ...Object.values(counts));
      const container = $('barRows');
      container.innerHTML = '';
      MOODS.forEach(m => {
        const c = counts[m.id];
        const pct = Math.round((c / max) * 100);
        const row = document.createElement('div');
        row.className = 'bar-row';
        row.innerHTML = `
      <span class="bar-label">${m.emoji} ${m.label}</span>
      <span class="bar-track"><span class="bar-fill" style="width:${pct}%;background:${m.color}"></span></span>
      <span class="bar-count">${c}</span>`;
        container.appendChild(row);
      });
    }

    function escapeHtml(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    async function persist() {
      if (!storageAvailable) return;
      try {
        await window.storage.set(STORAGE_KEY, JSON.stringify(entries), false);
      } catch (err) {
        console.error('Storage save error:', err);
      }
    }

    async function initDiary() {
      $('entryDate').value = todayStr();
      $('entryDate').addEventListener('change', (e) => loadFormForDate(e.target.value));

      storageAvailable = typeof window.storage !== 'undefined' && window.storage !== null;
      if (!storageAvailable) {
        $('storageNote').textContent = 'Хранение недоступно в этом окне — записи сохранятся только до перезагрузки страницы.';
        $('storageNote').classList.add('warn');
      }

      try {
        if (storageAvailable) {
          const res = await window.storage.get(STORAGE_KEY, false);
          entries = (res && res.value) ? JSON.parse(res.value) : [];
        } else {
          entries = [];
        }
      } catch (err) {
        entries = [];
      }

      renderMoodGrid();
      loadFormForDate($('entryDate').value);
      renderHistory();
      renderChart();

      $('saveBtn').addEventListener('click', async () => {
        if (!selectedMood) return;
        const date = $('entryDate').value;
        const note = $('entryNote').value.trim();
        const idx = entries.findIndex(e => e.date === date);
        const entry = { date, mood: selectedMood, note };
        if (idx > -1) entries[idx] = entry; else entries.push(entry);
        await persist();
        renderHistory();
        renderChart();
        $('editingNote').style.display = 'inline-block';
        $('formTitle').textContent = 'Изменить запись за этот день';
        const msg = $('saveMsg');
        msg.classList.add('show');
        setTimeout(() => msg.classList.remove('show'), 2200);
      });

      $('resetBtn').addEventListener('click', async () => {
        if (entries.length === 0) return;
        if (!confirm('Удалить все записи дневника без возможности восстановления?')) return;
        entries = [];
        await persist();
        renderHistory();
        renderChart();
        loadFormForDate($('entryDate').value);
      });
    }

    initDiary();
