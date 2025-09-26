// Custom Test Builder JS

document.addEventListener('DOMContentLoaded', () => {
  if (!auth.isAuthenticated()) { window.location.href = 'index.html'; return; }
  updateRange(document.getElementById('count'));
});

function updateRange(el){
  document.getElementById('countVal').textContent = el.value;
}

function buildAndStart(){
  const boxes = Array.from(document.querySelectorAll('.box .check input[type="checkbox"]'));
  const domains = boxes.filter(b=>b.checked).map(b=>b.value);
  const count = parseInt(document.getElementById('count').value,10) || 50;
  const minutes = Math.max(5, Math.min(230, parseInt(document.getElementById('minutes').value,10)||60));
  const shuffle = document.getElementById('shuffle').checked;

  // Collect questions from selected domains
  let pool = questionBank.filter(q => domains.includes(q.domain));
  if (!pool.length) pool = questionBank.slice();
  if (shuffle) pool = shuffleArray(pool);
  const selected = pool.slice(0, Math.min(count, pool.length));

  const payload = { questions: selected, timeSeconds: minutes*60, label:`Custom (${domains.join(', ')})` };
  sessionStorage.setItem('customTestSet', JSON.stringify(payload));
  window.location.href = 'test.html?mode=custom';
}

function shuffleArray(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}
