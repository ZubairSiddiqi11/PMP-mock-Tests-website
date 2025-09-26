// Daily Challenge JS
let daily = { questions: [], index: 0, answers: {}, timer: null, timeRemaining: 10*60 };

document.addEventListener('DOMContentLoaded', () => {
  if (!auth.isAuthenticated()) { window.location.href = 'index.html'; return; }
  setupDailyFromStorage();
});

function setupDailyFromStorage(){
  // Build a new set daily based on date key
  const key = 'daily_set_'+new Date().toISOString().slice(0,10);
  const cached = sessionStorage.getItem(key);
  if (cached){
    const parsed = JSON.parse(cached);
    daily.questions = parsed.questions || [];
  } else {
    // 10 random questions, mixed
    const qs = window.questionFunctions.getRandomQuestions(10);
    daily.questions = qs;
    sessionStorage.setItem(key, JSON.stringify({questions: qs}));
  }
  document.getElementById('qTotal').textContent = daily.questions.length;
  updateDailyUI();
}

function startDaily(){
  // Reset state
  daily.index = 0;
  daily.answers = {};
  daily.timeRemaining = 10*60; // 10 minutes
  if (daily.timer) clearInterval(daily.timer);
  daily.timer = setInterval(()=>{
    if (daily.timeRemaining<=0){
      clearInterval(daily.timer);
      finishDaily();
      return;
    }
    daily.timeRemaining--; updateDailyTimer();
  }, 1000);
  updateDailyTimer();
  renderDailyQuestion();
}

function updateDailyTimer(){
  const m = Math.floor(daily.timeRemaining/60), s = daily.timeRemaining%60;
  document.getElementById('dailyTimer').textContent = `${m}:${s.toString().padStart(2,'0')}`;
}

function renderDailyQuestion(){
  if (!daily.questions.length) return;
  const q = daily.questions[daily.index];
  document.getElementById('dailyQuestion').textContent = q.question;
  const opts = document.getElementById('dailyOptions');
  opts.innerHTML = '';
  q.options.forEach((opt, i)=>{
    const div = document.createElement('div');
    div.className = 'option'+(daily.answers[daily.index]===i? ' selected':'');
    div.innerHTML = `<strong>${String.fromCharCode(65+i)}.</strong> <span>${opt}</span>`;
    div.onclick = ()=>{ daily.answers[daily.index]=i; renderDailyQuestion(); updateDailyProgress(); };
    opts.appendChild(div);
  });
  document.getElementById('qIndex').textContent = daily.index+1;
  updateDailyProgress();
}

function updateDailyProgress(){
  const answered = Object.keys(daily.answers).length;
  const pct = Math.round((answered/Math.max(1,daily.questions.length))*100);
  document.getElementById('dailyProgress').style.width = pct+'%';
}

function prevDaily(){ if (daily.index>0){ daily.index--; renderDailyQuestion(); } }
function nextDaily(){ if (daily.index<daily.questions.length-1){ daily.index++; renderDailyQuestion(); } else { finishDaily(); } }

function finishDaily(){
  if (daily.timer) clearInterval(daily.timer);
  // Calculate result
  let correct = 0; daily.questions.forEach((q,i)=>{ if (daily.answers[i]===q.correct) correct++; });
  const score = Math.round((correct/daily.questions.length)*100);
  document.getElementById('dailyScore').textContent = score+'%';
  document.getElementById('dailyResult').style.display = 'block';
  // Save to history
  auth.addTestToHistory({
    mode:'daily', type:'Daily Challenge', score, correct, total: daily.questions.length,
    breakdown: buildBreakdown(daily.questions, daily.answers), questions: daily.questions.length
  });
  // Prepare review data
  const reviewData = {
    mode:'daily', score, correct, total: daily.questions.length, answers: daily.answers,
    questionsData: daily.questions, breakdown: buildBreakdown(daily.questions, daily.answers), date: new Date().toISOString()
  };
  sessionStorage.setItem('reviewData', JSON.stringify(reviewData));
}

function buildBreakdown(questions, answers){
  const map = {'People':{total:0,correct:0}, 'Process':{total:0,correct:0}, 'Business Environment':{total:0,correct:0}, 'Agile':{total:0,correct:0}, 'Hybrid':{total:0,correct:0}};
  questions.forEach((q,i)=>{
    if(!map[q.domain]) map[q.domain]={total:0,correct:0};
    map[q.domain].total++; if (answers[i]===q.correct) map[q.domain].correct++;
  });
  return map;
}

function prepareReviewFromDaily(){
  // No-op: data already in sessionStorage under 'reviewData'
}
