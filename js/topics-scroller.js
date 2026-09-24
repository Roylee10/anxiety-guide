    /* ── home: topics horizontal scroller ── */
    (function () {
      const track = document.getElementById('topicsTrack');
      const left = document.getElementById('scrLeft');
      const right = document.getElementById('scrRight');
      if (track && left && right) {
        left.addEventListener('click', () => track.scrollBy({ left: -260, behavior: 'smooth' }));
        right.addEventListener('click', () => track.scrollBy({ left: 260, behavior: 'smooth' }));
      }
    })();
