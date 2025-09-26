// Progress Page JS

document.addEventListener('DOMContentLoaded', () => {
  if (!auth.isAuthenticated()) { window.location.href = 'index.html'; return; }
  loadMetrics();
  renderTrend();
  renderDomainBar();
  renderHistory();
  renderRecommendations();
});

function loadMetrics(){
  const hist = auth.getUserTestHistory();
  if (!hist.length){
    document.getElementById('metricAverage').textContent = '0%';
    document.getElementById('metricBest').textContent = '0%';
    document.getElementById('metricTests').textContent = '0';
    document.getElementById('metricWeak').textContent = '—';
    return;
  }
  const scores = hist.map(h=>h.score);
  const avg = Math.round(scores.reduce((a,b)=>a+b,0)/scores.length);
  const best = Math.max(...scores);
  document.getElementById('metricAverage').textContent = avg + '%';
  document.getElementById('metricBest').textContent = best + '%';
  document.getElementById('metricTests').textContent = hist.length;
  document.getElementById('metricWeak').textContent = getWeakestArea(hist) || '—';
}

function getWeakestArea(hist){
  const areas = {};
  hist.forEach(t => {
    if (!t.breakdown) return;
    Object.keys(t.breakdown).forEach(k => {
      const b = t.breakdown[k];
      if (!areas[k]) areas[k] = {tot:0, ok:0};
      areas[k].tot += b.total||0; areas[k].ok += b.correct||0;
    });
  });
  let min = 101, weak=null;
  Object.keys(areas).forEach(k=>{
    if(areas[k].tot>0){
      const p = Math.round(areas[k].ok*100/areas[k].tot);
      if (p<min){ min=p; weak=k; }
    }
  });
  return weak;
}

function renderTrend(){
  const ctx = document.getElementById('trendChart');
  const hist = auth.getUserTestHistory();
  const labels = hist.map((_,i)=>`Test ${i+1}`);
  const data = hist.map(h=>h.score);
  new Chart(ctx, { type:'line', data:{ labels, datasets:[{ label:'Score %', data, borderColor:'#667eea', backgroundColor:'rgba(102,126,234,0.15)', fill:true, tension:.35 }]}, options:{ responsive:true, plugins:{legend:{display:false}}, scales:{ y:{ beginAtZero:true, max:100, ticks:{ callback:v=>v+'%' } } } } });
}

function renderDomainBar(){
  const ctx = document.getElementById('domainBar');
  const hist = auth.getUserTestHistory();
  const domains = ['People','Process','Business Environment','Agile','Hybrid'];
  const agg = domains.map(d=>({tot:0,ok:0}));
  hist.forEach(t=>{
    domains.forEach((d,i)=>{
      const b=t.breakdown&&t.breakdown[d];
      if(b){ agg[i].tot+=b.total||0; agg[i].ok+=b.correct||0; }
    })
  });
  const scores = agg.map(a=> a.tot? Math.round(a.ok*100/a.tot):0);
  new Chart(ctx,{type:'bar',data:{labels:domains,datasets:[{label:'Mastery %',data:scores,backgroundColor:['#667eea','#764ba2','#f59e0b','#10b981','#06b6d4']}]},options:{responsive:true,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,max:100,ticks:{callback:v=>v+'%'}}}}});
}

function renderRecommendations(){
  const list = document.getElementById('recList');
  const hist = auth.getUserTestHistory();
  if(!hist.length){ list.innerHTML = '<div class="rec">No data yet. Take a test to get recommendations.</div>'; return; }
  const last = hist[hist.length-1];
  const recs = [];
  Object.keys(last.breakdown||{}).forEach(d=>{
    const b=last.breakdown[d]; if(!b||!b.total) return; const p=Math.round(b.correct*100/b.total);
    if(p<50) recs.push({cls:'urgent', text:`Critical improvement needed in ${d} (${p}%). Start a focused practice now.`});
    else if(p<70) recs.push({cls:'moderate', text:`You are close on ${d} (${p}%). Review key concepts and practice more.`});
    else recs.push({cls:'', text:`Great work on ${d} (${p}%). Maintain your level.`});
  });
  if(!recs.length){ list.innerHTML = '<div class="rec">No recommendations right now.</div>'; return; }
  list.innerHTML = recs.map(r=>`<div class="rec ${r.cls}">${r.text}</div>`).join('');
}

function renderHistory(){
  const el = document.getElementById('historyList');
  const hist = auth.getUserTestHistory();
  if(!hist.length){ el.innerHTML = '<div class="history-item"><div>No tests taken yet.</div></div>'; return; }
  el.innerHTML = hist.slice().reverse().map(t=>{
    const badge = t.type && t.type.toLowerCase().includes('full')? 'full' : t.type && t.type.toLowerCase().includes('quick')? 'quick' : 'custom';
    const date = new Date(t.date).toLocaleString();
    return `<div class="history-item">
      <div class="left">
        <span class="badge ${badge}">${t.type||'Test'}</span>
        <strong>${t.score}%</strong>
        <span class="muted">${t.correct}/${t.total} correct</span>
      </div>
      <div class="right muted">${date}</div>
    </div>`;
  }).join('');
}
