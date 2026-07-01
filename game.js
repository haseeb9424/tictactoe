const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const resetBtn = document.getElementById('reset');
const aiBtn = document.getElementById('ai');

let board = Array(9).fill('');
let current = 'X';
let running = true;
let vsAI = false;

const winLines = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function updateStatus(){
  if(!running) return;
  statusEl.textContent = 'Current: ' + current;
}

function checkWin(){
  for(const line of winLines){
    const [a,b,c] = line;
    if(board[a] && board[a] === board[b] && board[a] === board[c]){
      return { winner: board[a], line };
    }
  }
  if(board.every(Boolean)) return { draw: true };
  return null;
}

function render(){
  boardEl.querySelectorAll('.cell').forEach((cell,i)=>{
    cell.textContent = board[i];
    cell.classList.remove('winner');
    cell.setAttribute('aria-label', `Cell ${i+1}, ${board[i] ? board[i] : 'empty'}`);
  });

  const res = checkWin();
  if(res){
    running = false;
    if(res.draw){
      statusEl.textContent = 'Draw';
    } else {
      statusEl.textContent = res.winner + ' wins!';
      res.line.forEach(i=> boardEl.children[i].classList.add('winner'));
    }
  } else {
    updateStatus();
  }
}

function makeMove(i){
  if(!running || board[i]) return;
  board[i] = current;
  render();

  const res = checkWin();
  if(res) return;

  current = current === 'X' ? 'O' : 'X';
  updateStatus();

  if(vsAI && current === 'O'){
    setTimeout(aiMove, 250);
  }
}

function aiMove(){
  const empty = board.map((v,i)=> v ? null : i).filter(i=> i !== null);
  if(empty.length === 0) return;
  const move = findWinningMove('O') ?? findWinningMove('X') ?? empty[Math.floor(Math.random()*empty.length)];
  makeMove(move);
}

function findWinningMove(player){
  for(let i=0;i<9;i++){
    if(board[i]) continue;
    board[i] = player;
    const win = winLines.some(line => line.every(idx => board[idx] === player));
    board[i] = '';
    if(win) return i;
  }
  return null;
}

boardEl.addEventListener('click', e=>{
  const cell = e.target.closest('.cell');
  if(!cell) return;
  const i = Number(cell.dataset.index);
  makeMove(i);
});

boardEl.addEventListener('keydown', e=>{
  if(e.key === 'Enter' || e.key === ' '){
    const cell = e.target.closest('.cell');
    if(!cell) return;
    e.preventDefault();
    makeMove(Number(cell.dataset.index));
  }
});

resetBtn.addEventListener('click', ()=>{
  board.fill('');
  current = 'X';
  running = true;
  render();
});

aiBtn.addEventListener('click', ()=>{
  vsAI = !vsAI;
  aiBtn.textContent = vsAI ? 'Play vs Human' : 'Play vs AI';
  if(vsAI && current === 'O') setTimeout(aiMove, 200);
});

render();
