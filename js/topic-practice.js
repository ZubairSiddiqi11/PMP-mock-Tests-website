// Topic Practice JS

document.addEventListener('DOMContentLoaded', () => {
  if (!auth.isAuthenticated()) { window.location.href = 'index.html'; return; }
  populateSuggestions();
});

function populateSuggestions(){
  const wrap = document.getElementById('suggestedChips');
  const last = (auth.getUserTestHistory() || []).slice(-1)[0];
  const domains = ['People','Process','Business Environment','Agile','Hybrid'];
  const defaultChips = domains.map(d=>({label:d, domain:d}));
  let chips = defaultChips;
  if (last && last.breakdown){
    const sorted = Object.keys(last.breakdown).map(d=>{
      const b = last.breakdown[d];
      const pct = b.total? Math.round((b.correct/b.total)*100):0;
      return {label:`${d} (${pct}%)`, domain:d, pct};
    }).sort((a,b)=>a.pct-b.pct);
    if (sorted.length) chips = sorted;
  }
  wrap.innerHTML = chips.map(c=>`<span class="chip" onclick="quickPractice('${c.domain}')">${c.label}</span>`).join('');
}

function quickPractice(domain){
  document.getElementById('domain').value = domain;
  startPractice();
}

function startPractice(){
  const domain = document.getElementById('domain').value;
  const count = parseInt(document.getElementById('count').value,10);
  const minutes = Math.max(5, Math.min(230, parseInt(document.getElementById('minutes').value,10)||30));

  // Build custom set
  const questions = window.questionFunctions.getTopicQuestions(domain, count);
  const payload = { questions, timeSeconds: minutes*60, label:`Topic: ${domain}` };
  sessionStorage.setItem('customTestSet', JSON.stringify(payload));
  window.location.href = 'test.html?mode=custom';
}
