


// модальное окно тестов
function openArticle(articleId) {
  const modal = document.getElementById('articleModal');

  document.querySelectorAll('.modal-article').forEach(article => {
    article.classList.remove('active');
  });

  const article = document.getElementById(articleId);

  if (article) {
    article.classList.add('active');
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeArticle() {
  const modal = document.getElementById('articleModal');

  modal.classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeArticle();
  }
});