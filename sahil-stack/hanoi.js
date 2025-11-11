/* Tower of Hanoi animation with narration that waits for speech completion.
   Uses global speakAsync(text) and voiceEnabled defined in script.js
*/

let hanoiRunning = false;
let hanoiMoves = [];
let hanoiIndex = 0;

const pegA = $('#pegA');
const pegB = $('#pegB');
const pegC = $('#pegC');
const hanoiLog = $('#hanoiLog');
const btnStart = $('#start-hanoi');
const btnStop = $('#stop-hanoi');
const btnClear = $('#clear-hanoi');
const inputCount = $('#hanoiCount');

// prepare random color for disks
function diskGradient(i) {
  const hue = (i * 40) % 360;
  return `linear-gradient(90deg, hsl(${hue} 85% 65%), hsl(${(hue+30)%360} 75% 58%))`;
}

function clearLog() { hanoiLog.innerHTML = ''; }
function log(msg) {
  const p = document.createElement('div');
  p.textContent = msg;
  hanoiLog.prepend(p);
}

/* Setup pegs and disks */
function setupHanoi(n) {
  // clear pegs
  pegA.innerHTML = '<div class="peg-label">A</div>';
  pegB.innerHTML = '<div class="peg-label">B</div>';
  pegC.innerHTML = '<div class="peg-label">C</div>';
  clearLog();

  for (let i = n; i >= 1; i--) {
    const d = document.createElement('div');
    d.className = 'disk idle';
    d.textContent = i;
    d.style.width = `${60 + i * 28}px`;
    d.style.background = diskGradient(i);
    d.dataset.size = i;
    pegA.appendChild(d);
  }
}

/* recursive solver collects moves in array */
function collectHanoiMoves(n, from, to, aux) {
  if (n === 0) return;
  collectHanoiMoves(n - 1, from, aux, to);
  hanoiMoves.push({disk: n, from, to});
  collectHanoiMoves(n - 1, aux, to, from);
}

/* perform single DOM move with animation after narration finishes */
async function performNextMove() {
  if (!hanoiRunning) return;
  if (hanoiIndex >= hanoiMoves.length) {
    await speakAsync('Tower of Hanoi completed. Well done!');
    log('Completed!');
    hanoiRunning = false;
    return;
  }

  const mv = hanoiMoves[hanoiIndex];
  const fromEl = document.getElementById('peg' + mv.from);
  const toEl = document.getElementById('peg' + mv.to);
  const disk = fromEl.lastElementChild;
  if (!disk) {
    hanoiIndex++;
    return performNextMove();
  }

  // Speak full sentence, wait until done, then animate the disk move
  const sentence = `Move disk ${mv.disk} from peg ${mv.from} to peg ${mv.to}.`;
  log(sentence);
  await speakAsync(sentence); // WAIT until voice finishes

  // animate: mark as moving, move in DOM, then settle
  disk.classList.remove('idle');
  disk.classList.add('moving');
  await delay(260);
  toEl.appendChild(disk);
  disk.classList.remove('moving');
  disk.classList.add('idle');
  hanoiIndex++;
  // small pause so animation and audio pacing feels natural
  await delay(350);
  return performNextMove();
}

/* public handlers */
btnStart.addEventListener('click', async () => {
  if (hanoiRunning) return;
  const n = Math.max(2, Math.min(6, parseInt(inputCount.value) || 3));
  setupHanoi(n);
  hanoiMoves = [];
  hanoiIndex = 0;
  collectHanoiMoves(n, 'A', 'C', 'B');
  hanoiRunning = true;
  await speakAsync(`Starting Tower of Hanoi with ${n} disks. I will explain each move.`);
  performNextMove();
});

btnStop.addEventListener('click', () => {
  if (!hanoiRunning) return;
  hanoiRunning = false;
  speakAsync('Stopping the simulation.');
  log('Simulation stopped.');
});

btnClear.addEventListener('click', () => {
  hanoiRunning = false;
  hanoiMoves = [];
  hanoiIndex = 0;
  setupHanoi(parseInt(inputCount.value) || 3);
  clearLog();
  speakAsync('Cleared the board.');
});
