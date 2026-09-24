    /* ── mobile nav toggle ── */
    document.getElementById('navToggle').addEventListener('click', () => {
      document.getElementById('mainNav').classList.toggle('open');
    });

    /* ── router between the four "pages" ── */
    const PAGES = ['home', 'art-terapiya', 'statyi', 'dnevnik', 'testy'];
    const TITLES = {
      'home': 'Путеводитель для родителей тревожных детей',
      'art-terapiya': 'Арт-терапия дома — Путеводитель для родителей',
      'statyi': 'Статьи о тревожности — Путеводитель для родителей',
      'dnevnik': 'Дневник эмоций — Путеводитель для родителей',
      'testy': 'Тесты — Путеводитель для родителей',
    };

    function showPage(name, opts) {
      opts = opts || {};
      if (PAGES.indexOf(name) === -1) name = 'home';
      document.querySelectorAll('main[data-page]').forEach(m => {
        m.hidden = (m.dataset.page !== name);
      });
      document.querySelectorAll('.main-nav a').forEach(a => {
        a.classList.toggle('current', a.getAttribute('href') === '#' + name);
      });
      document.title = TITLES[name];
      document.getElementById('mainNav').classList.remove('open');
      if (opts.scroll) window.scrollTo({ top: 0, behavior: 'auto' });
    }

    window.addEventListener('hashchange', () => {
      showPage((location.hash || '#home').slice(1), { scroll: true });
    });
    showPage((location.hash || '#home').slice(1), { scroll: false });
