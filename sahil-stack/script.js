/* Main site script: UI, stack, expressions, voice assistant, theme switch */

/* helpers */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const delay = ms => new Promise(r => setTimeout(r, ms));

/* Global voice toggle state (used by hanoi.js too) */
let voiceEnabled = true;

/* Speech synthesis setup - male voice preference */
const synth = window.speechSynthesis || null;
const voiceRateControl = $('#voiceRate');
let chosenVoice = null;

function pickMaleVoice() {
  if(!synth) return null;
  const voices = synth.getVoices();
  // prefer explicit male keywords or Google male names
  const maleKeywords = ['male', 'Male', 'Google UK English Male', 'Microsoft David', 'Daniel', 'Alloy', 'John'];
  // try candidates that match english first
  const englishVoices = voices.filter(v => /en/i.test(v.lang));
  // attempt to find a male voice among english voices
  for(const key of maleKeywords){
    const found = englishVoices.find(v => (v.name && v.name.includes(key)) || (v.voiceURI && v.voiceURI.includes(key)));
    if(found) return found;
  }
  // fallback: choose any english voice (prefer lower index)
  if(englishVoices.length) return englishVoices[0];
  // final fallback: any voice
  return voices[0] || null;
}

function initVoices(){
  chosenVoice = pickMaleVoice();
}
if(synth){
  // load voices
  synth.onvoiceschanged = () => { initVoices(); };
  initVoices();
}

/* speak function that returns a Promise which resolves when speech ends */
function speakAsync(text){
  return new Promise((resolve) => {
    if(!voiceEnabled || !synth){
      // If voice disabled or not supported, small visual wait so animations don't race
      // but don't block too long
      setTimeout(resolve, 350);
      return;
    }
    try {
      synth.cancel(); // stop any previous
      const ut = new SpeechSynthesisUtterance(text);
      ut.voice = chosenVoice;
      ut.rate = parseFloat(voiceRateControl.value || 1);
      ut.pitch = 1.0;
      ut.onend = () => resolve();
      ut.onerror = () => resolve();
      synth.speak(ut);
      // safety fallback in case onend not fired
      setTimeout(resolve, 8000);
    } catch (e) {
      resolve();
    }
  });
}

/* Sidebar nav (show only clicked section) */
$$('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.nav-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const section = btn.dataset.section;
    $('#pageTitle').textContent = btn.textContent;
    $$('.page').forEach(p=>p.classList.remove('active'));
    $('#' + section).classList.add('active');
  });
});

/* Voice toggle and theme */
$('#voiceToggle').addEventListener('change', e => { voiceEnabled = e.target.checked; });
$('#changeTheme').addEventListener('click', () => {
  document.body.classList.toggle('stack-theme-light');
  speakAsync('Theme changed');
});

/* ===== Stack implementation + animation ===== */
const stackViz = $('#stackViz');
const pushValue = $('#pushValue');
const btnPush = $('#btnPush');
const btnPop = $('#btnPop');
const btnClearStack = $('#btnClearStack');
const stackStatus = $('#stackStatus');
let stack = [];

function updateStackStatus(){ stackStatus.textContent = `Size: ${stack.length}`; }

function renderStack(animateIndex = null){
  stackViz.innerHTML = '';
  stack.forEach((val, idx) => {
    const el = document.createElement('div');
    el.className = 'stack-block';
    el.textContent = val;
    if(animateIndex !== null && idx === animateIndex){
      el.classList.add('push-in');
      requestAnimationFrame(() => {
        el.classList.add('push-animate');
        el.classList.remove('push-in');
      });
    }
    stackViz.appendChild(el);
  });
  updateStackStatus();
}

btnPush.addEventListener('click', async () => {
  const v = pushValue.value.trim();
  if(!v){ await speakAsync('Please type a value to push'); alert('Enter a value'); return; }
  stack.push(v);
  renderStack(stack.length - 1);
  await speakAsync(`Pushed ${v} onto the stack.`);
  pushValue.value = '';
});

btnPop.addEventListener('click', async () => {
  if(stack.length === 0){ await speakAsync('Stack is empty.'); alert('Stack is empty'); return; }
  const popped = stack.pop();
  renderStack();
  await speakAsync(`Popped ${popped} from the stack.`);
});

btnClearStack.addEventListener('click', async () => {
  stack = [];
  renderStack();
  await speakAsync('Stack cleared.');
});

/* ===== Expression conversion (animated + voice per step) ===== */
const exprInput = $('#exprInput');
const exprMode = $('#exprMode');
const exprConvert = $('#exprConvert');
const exprReset = $('#exprReset');
const exprStack = $('#exprStack');
const exprOutput = $('#exprOutput');
const exprSteps = $('#exprSteps');

function clearExprUI(){
  exprStack.innerHTML = '';
  exprOutput.textContent = '';
  exprSteps.innerHTML = '';
}

function pushExprVisual(text){
  const el = document.createElement('div');
  el.className = 'item';
  el.textContent = text;
  exprStack.appendChild(el);
}

function popExprVisual(){
  const top = exprStack.lastElementChild;
  if(top) top.remove();
  return top ? top.textContent : null;
}

function setExprOutput(text){
  exprOutput.textContent = text;
}

async function addStep(text){
  const p = document.createElement('div');
  p.textContent = text;
  exprSteps.prepend(p);
  await speakAsync(text);
}

/* precedence */
function prec(c){
  if(c === '+'||c === '-') return 1;
  if(c === '*'||c === '/') return 2;
  return 0;
}

/* Infix -> Postfix (animated) */
async function animateInfixToPostfix(expr){
  clearExprUI();
  let output = '';
  const st = [];
  await addStep(`Converting infix to postfix for ${expr}.`);
  for(const ch of expr){
    if(ch === ' ') continue;
    if(/[A-Za-z0-9]/.test(ch)){
      output += ch;
      setExprOutput(output);
      await addStep(`Read operand ${ch}; append to output: ${output}.`);
    } else if(ch === '('){
      st.push(ch); pushExprVisual('(');
      await addStep(`Read left parenthesis, push it to the stack.`);
    } else if(ch === ')'){
      await addStep(`Read right parenthesis. Pop until left parenthesis.`);
      while(st.length && st[st.length-1] !== '('){
        const op = st.pop(); popExprVisual();
        output += op; setExprOutput(output);
        await addStep(`Pop ${op} from stack to output → ${output}.`);
      }
      if(st.length && st[st.length-1] === '('){ st.pop(); popExprVisual(); await addStep(`Discard left parenthesis from stack.`); }
    } else {
      await addStep(`Read operator ${ch}.`);
      while(st.length && prec(st[st.length-1]) >= prec(ch) && st[st.length-1] !== '('){
        const op = st.pop(); popExprVisual();
        output += op; setExprOutput(output);
        await addStep(`Pop ${op} from stack to output → ${output}.`);
      }
      st.push(ch); pushExprVisual(ch);
      await addStep(`Push operator ${ch} to stack.`);
    }
  }
  while(st.length){
    const op = st.pop(); popExprVisual();
    output += op; setExprOutput(output);
    await addStep(`Pop remaining ${op} to output → ${output}.`);
  }
  await addStep(`Final postfix expression is ${output}.`);
  return output;
}

/* Infix -> Prefix */
async function animateInfixToPrefix(expr){
  await addStep(`Converting infix to prefix for ${expr}.`);
  let rev = expr.split('').reverse().map(ch => ch === '(' ? ')' : ch === ')' ? '(' : ch).join('');
  await addStep(`Reverse expression: ${rev}.`);
  const postfix = await animateInfixToPostfix(rev);
  const prefix = postfix.split('').reverse().join('');
  await addStep(`Final prefix: ${prefix}.`);
  return prefix;
}

/* Postfix -> Infix */
async function animatePostfixToInfix(expr){
  clearExprUI();
  const st = [];
  await addStep(`Converting postfix to infix: ${expr}.`);
  for(const ch of expr){
    if(ch === ' ') continue;
    if(/[A-Za-z0-9]/.test(ch)){
      st.push(ch); pushExprVisual(ch);
      await addStep(`Push operand ${ch} to stack.`);
    } else {
      const b = st.pop(); popExprVisual();
      const a = st.pop(); popExprVisual();
      const comb = `(${a}${ch}${b})`;
      st.push(comb); pushExprVisual(comb);
      await addStep(`Apply operator ${ch}: combine ${a} and ${b} → ${comb}.`);
    }
  }
  await addStep(`Final infix: ${st[st.length-1]}.`);
  return st.pop();
}

/* Prefix -> Infix */
async function animatePrefixToInfix(expr){
  clearExprUI();
  const st = [];
  await addStep(`Converting prefix to infix: ${expr}.`);
  for(let i = expr.length - 1; i >= 0; i--){
    const ch = expr[i];
    if(ch === ' ') continue;
    if(/[A-Za-z0-9]/.test(ch)){
      st.push(ch); pushExprVisual(ch);
      await addStep(`Push operand ${ch}.`);
    } else {
      const a = st.pop(); popExprVisual();
      const b = st.pop(); popExprVisual();
      const comb = `(${a}${ch}${b})`;
      st.push(comb); pushExprVisual(comb);
      await addStep(`Operator ${ch}: combine → ${comb}.`);
    }
  }
  await addStep(`Final infix: ${st[st.length-1]}.`);
  return st.pop();
}

/* expression main handler */
exprConvert.addEventListener('click', async () => {
  const expr = exprInput.value.trim();
  if(!expr){ await speakAsync('Please enter an expression'); alert('Enter an expression'); return; }
  exprConvert.disabled = true;
  try{
    let res = '';
    const mode = exprMode.value;
    if(mode === 'infixToPostfix') res = await animateInfixToPostfix(expr);
    else if(mode === 'infixToPrefix') res = await animateInfixToPrefix(expr);
    else if(mode === 'postfixToInfix') res = await animatePostfixToInfix(expr);
    else if(mode === 'prefixToInfix') res = await animatePrefixToInfix(expr);
    await addStep(`Conversion result: ${res}.`);
  } catch(e){
    console.error(e);
    alert('Conversion error');
  } finally {
    exprConvert.disabled = false;
  }
});

exprReset.addEventListener('click', () => {
  clearExprUI();
  exprInput.value = '';
  speakAsync('Expression UI reset.');
});

/* initialize small UI */
renderStack();

/* ensure voices are loaded for selection */
if(synth) synth.onvoiceschanged = () => { initVoices(); initVoices = pickMaleVoice; };
