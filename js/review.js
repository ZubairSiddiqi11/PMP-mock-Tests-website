// Review Mode JS
let reviewData = null;

document.addEventListener('DOMContentLoaded', () => {
  if (!auth.isAuthenticated()) { window.location.href = 'index.html'; return; }
  const data = sessionStorage.getItem('reviewData') || sessionStorage.getItem('testResults');
  if (!data){ window.location.href = 'dashboard.html'; return; }
  reviewData = JSON.parse(data);
  initFilters();
  renderReview();
});

function initFilters(){
  ['showIncorrect','showCorrect','showExplanations'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', renderReview);
  });
}

function renderReview(){
  const list = document.getElementById('reviewList');
  const showIncorrect = document.getElementById('showIncorrect').checked;
  const showCorrect = document.getElementById('showCorrect').checked;
  const showExplanations = document.getElementById('showExplanations').checked;

  const qs = reviewData.questionsData || [];
  const ans = reviewData.answers || {};

  let correctCount = 0, incorrectCount = 0;
  const items = [];

  qs.forEach((q, i) => {
    const user = ans[i];
    const isCorrect = user === q.correct;
    if (isCorrect) correctCount++; else incorrectCount++;

    if ((isCorrect && !showCorrect) || (!isCorrect && !showIncorrect)) return;

    const answersHTML = q.options.map((opt, idx) => {
      const classes = ['answer'];
      if (idx === q.correct) classes.push('correct');
      if (idx === user) classes.push('user');
      return `<div class="${classes.join(' ')}"><strong>${String.fromCharCode(65+idx)}.</strong> <span>${opt}</span></div>`;
    }).join('');

    items.push(`
      <article class="review-item ${isCorrect? 'correct':'incorrect'}">
        <div class="q"><strong>Q${i+1}.</strong> ${q.question}
          <span class="badge-domain">${q.domain}</span>
        </div>
        <div class="answers">${answersHTML}</div>
        ${showExplanations? `<div class="expl"><strong>Explanation:</strong> ${q.explanation || '—'}</div>`:''}
      </article>
    `);
  });

  document.getElementById('statCorrect').textContent = correctCount;
  document.getElementById('statIncorrect').textContent = incorrectCount;
  list.innerHTML = items.length? items.join('') : '<div class="card">No questions to display with current filters.</div>';
}
