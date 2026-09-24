/* =========================
   ТЕСТ НА ТРЕВОЖНОСТЬ
   ========================= */

const testQuestions = [

  {
    question: 'Как часто ребёнок переживает перед предстоящими событиями?',
    answers: [
      'Практически никогда',
      'Иногда',
      'Часто',
      'Почти всегда'
    ]
  },

  {
    question: 'Как часто ребёнку трудно расслабиться после напряжённой ситуации?',
    answers: [
      'Практически никогда',
      'Иногда',
      'Часто',
      'Почти всегда'
    ]
  },

  {
    question: 'Как часто ребёнок сильно переживает из-за возможных ошибок?',
    answers: [
      'Практически никогда',
      'Иногда',
      'Часто',
      'Почти всегда'
    ]
  },

  {
    question: 'Как часто ребёнок избегает ситуаций, которые кажутся ему сложными или пугающими?',
    answers: [
      'Практически никогда',
      'Иногда',
      'Часто',
      'Почти всегда'
    ]
  },

  {
    question: 'Как часто ребёнок просит взрослых подтвердить, что всё будет хорошо?',
    answers: [
      'Практически никогда',
      'Иногда',
      'Часто',
      'Почти всегда'
    ]
  },

  {
    question: 'Как часто перед важными событиями ребёнок становится беспокойным или напряжённым?',
    answers: [
      'Практически никогда',
      'Иногда',
      'Часто',
      'Почти всегда'
    ]
  },

  {
    question: 'Как часто тревога мешает ребёнку сосредоточиться на обычных делах?',
    answers: [
      'Практически никогда',
      'Иногда',
      'Часто',
      'Почти всегда'
    ]
  },

  {
    question: 'Как часто ребёнок переживает о том, что может произойти что-то плохое?',
    answers: [
      'Практически никогда',
      'Иногда',
      'Часто',
      'Почти всегда'
    ]
  },

  {
    question: 'Как часто ребёнок испытывает физическое напряжение во время переживаний?',
    answers: [
      'Практически никогда',
      'Иногда',
      'Часто',
      'Почти всегда'
    ]
  },

  {
    question: 'Как часто тревожные переживания заметно влияют на настроение ребёнка?',
    answers: [
      'Практически никогда',
      'Иногда',
      'Часто',
      'Почти всегда'
    ]
  }

];


let currentTestQuestion = 0;
let testScore = 0;
let selectedTestAnswer = null;


function openTest() {

  const modal = document.getElementById('testModal');

  if (!modal) return;

  currentTestQuestion = 0;
  testScore = 0;
  selectedTestAnswer = null;

  document.getElementById('testScreen').hidden = false;
  document.getElementById('testResult').hidden = true;

  modal.classList.add('active');

  document.body.style.overflow = 'hidden';

  renderTestQuestion();
}


function closeTest() {

  const modal = document.getElementById('testModal');

  if (!modal) return;

  modal.classList.remove('active');

  document.body.style.overflow = '';
}


function renderTestQuestion() {

  const question = testQuestions[currentTestQuestion];

  const number = currentTestQuestion + 1;
  const total = testQuestions.length;

  selectedTestAnswer = null;

  document.getElementById('testQuestionNumber').textContent =
    `Вопрос ${number} из ${total}`;

  document.getElementById('testQuestion').textContent =
    question.question;

  const progress =
    (number / total) * 100;

  document.getElementById('testProgress').style.width =
    `${progress}%`;

  const answersContainer =
    document.getElementById('testAnswers');

  answersContainer.innerHTML = '';

  question.answers.forEach((answer, index) => {

    const button = document.createElement('button');

    button.type = 'button';

    button.className = 'test-answer';

    button.textContent = answer;

    button.addEventListener('click', () => {

      selectedTestAnswer = index;

      answersContainer
        .querySelectorAll('.test-answer')
        .forEach(btn => {
          btn.classList.remove('selected');
        });

      button.classList.add('selected');

      document.getElementById('testNextButton').disabled = false;
    });

    answersContainer.appendChild(button);
  });

  const nextButton =
    document.getElementById('testNextButton');

  nextButton.disabled = true;

  nextButton.textContent =
    number === total ? 'Получить результат' : 'Далее →';
}


function nextTestQuestion() {

  if (selectedTestAnswer === null) return;

  /*
   * 0 = никогда
   * 1 = иногда
   * 2 = часто
   * 3 = почти всегда
   */

  testScore += selectedTestAnswer;

  if (currentTestQuestion < testQuestions.length - 1) {

    currentTestQuestion++;

    renderTestQuestion();

  } else {

    showTestResult();
  }
}


function showTestResult() {

  document.getElementById('testScreen').hidden = true;

  const result =
    document.getElementById('testResult');

  result.hidden = false;

  let title = '';
  let text = '';

  /*
   * Максимум — 30 баллов.
   */

  if (testScore <= 7) {

    title = 'Небольшое количество тревожных признаков';

    text =
      'По ответам в этом опроснике вы отметили относительно небольшое количество признаков тревожности. Это не означает отсутствие переживаний — важно учитывать конкретные ситуации и изменения в поведении ребёнка.';

  } else if (testScore <= 15) {

    title = 'Стоит внимательнее понаблюдать';

    text =
      'В ответах присутствует заметное количество признаков, связанных с тревожными переживаниями. Обратите внимание на ситуации, в которых они возникают, и на то, насколько они влияют на повседневную жизнь ребёнка.';

  } else {

    title = 'Стоит обсудить ситуацию со специалистом';

    text =
      'В ответах отмечено достаточно много признаков тревожных переживаний. Если подобные проявления сохраняются и заметно мешают ребёнку в повседневной жизни, стоит обсудить ситуацию с детским психологом или другим подходящим специалистом.';
  }

  document.getElementById('testResultTitle').textContent = title;

  document.getElementById('testResultText').textContent = text;
}


function restartTest() {

  currentTestQuestion = 0;

  testScore = 0;

  selectedTestAnswer = null;

  document.getElementById('testScreen').hidden = false;

  document.getElementById('testResult').hidden = true;

  renderTestQuestion();
}


/* Закрытие теста клавишей Escape */

document.addEventListener('keydown', function(event) {

  if (event.key === 'Escape') {

    const modal =
      document.getElementById('testModal');

    if (modal && modal.classList.contains('active')) {
      closeTest();
    }
  }

});