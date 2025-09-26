// Flashcards JS
let deck = [];
let currentIndex = 0;
let flipped = false;

DocumentReady();
function DocumentReady(){
  document.addEventListener('DOMContentLoaded', () => {
    if (!auth.isAuthenticated()) { window.location.href = 'index.html'; return; }
    // default state
    updateCardUI();
  });
}

function startDeck(){
  const domain = document.getElementById('domainSelect').value;
  const size = parseInt(document.getElementById('deckSize').value, 10) || 20;
  let pool = questionBank;
  if (domain !== 'All') pool = questionBank.filter(q => q.domain === domain);
  // build deck as Q&A cards
  deck = shuffle(pool).slice(0, Math.min(size, pool.length)).map(q => ({
    q: q.question,
    a: `${q.options[q.correct]}\n\nExplanation: ${q.explanation || '—'}`
  }));
  currentIndex = 0;
  flipped = false;
  updateCardUI();
}

function flipCard(){
  flipped = !flipped;
  const card = document.getElementById('flashcard');
  if (flipped) card.classList.add('flipped'); else card.classList.remove('flipped');
}

function prevCard(){
  if (!deck.length) return;
  currentIndex = Math.max(0, currentIndex - 1);
  flipped = false;
  updateCardUI();
}

function nextCard(){
  if (!deck.length) return;
  currentIndex = Math.min(deck.length - 1, currentIndex + 1);
  flipped = false;
  updateCardUI();
}

function rateCard(score){
  // Simple spaced-repetition heuristic: if hard, push near end; if easy, leave
  if (!deck.length) return;
  if (score === 1) { // hard
    const item = deck[currentIndex];
    // reinsert a few positions later
    deck.splice(currentIndex, 1);
    const pos = Math.min(deck.length, currentIndex + 3);
    deck.splice(pos, 0, item);
    currentIndex = Math.min(pos, deck.length - 1);
  } else if (score === 3) { // easy
    // move to end if not already
    if (currentIndex < deck.length - 1){
      const item = deck[currentIndex];
      deck.splice(currentIndex, 1);
      deck.push(item);
      currentIndex = Math.min(currentIndex, deck.length - 1);
    }
  }
  flipped = false;
  updateCardUI();
}

function updateCardUI(){
  const front = document.getElementById('cardFront');
  const back = document.getElementById('cardBack');
  const idx = document.getElementById('cardIndex');
  const total = document.getElementById('cardTotal');
  const card = document.getElementById('flashcard');
  if (!deck.length){
    front.textContent = 'Click Start to generate a deck';
    back.textContent = 'Answer/Explanation';
    idx.textContent = '0';
    total.textContent = '0';
    card.classList.remove('flipped');
    return;
  }
  front.textContent = deck[currentIndex].q;
  back.textContent = deck[currentIndex].a;
  idx.textContent = String(currentIndex + 1);
  total.textContent = String(deck.length);
  if (flipped) card.classList.add('flipped'); else card.classList.remove('flipped');
}

function shuffle(arr){
  const a = arr.slice();
  for (let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}
