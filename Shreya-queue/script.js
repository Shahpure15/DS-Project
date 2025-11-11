// Queue Data Structure Implementation
class Queue {
    constructor(capacity = null) {
        this.items = [];
        this.capacity = capacity;
    }

    enqueue(element) {
        if (this.capacity && this.items.length >= this.capacity) {
            return false;
        }
        this.items.push(element);
        return true;
    }

    dequeue() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.items.shift();
    }

    front() {
        return this.items[0];
    }

    rear() {
        return this.items[this.items.length - 1];
    }

    isEmpty() {
        return this.items.length === 0;
    }

    size() {
        return this.items.length;
    }

    isFull() {
        return this.capacity && this.items.length >= this.capacity;
    }

    clear() {
        this.items = [];
    }

    getItems() {
        return [...this.items];
    }
}

// DOM Elements
const queueInput = document.getElementById('queue-input');
const queueSizeInput = document.getElementById('queue-size');
const enqueueBtns = document.getElementById('enqueue-btn');
const dequeueBtns = document.getElementById('dequeue-btn');
const peekBtn = document.getElementById('peek-btn');
const clearBtn = document.getElementById('clear-btn');
const queueContainer = document.getElementById('queue-container');
const logEntries = document.getElementById('log-entries');
const animationSpeedSelect = document.getElementById('animation-speed');
const exampleSelect = document.getElementById('example-select');
const demoBtnExample = document.getElementById('demo-example-btn');
const exampleDisplay = document.getElementById('example-display');

// Stats elements
const queueSizeStat = document.getElementById('queue-size-stat');
const frontStat = document.getElementById('front-stat');
const rearStat = document.getElementById('rear-stat');
const totalOpsStat = document.getElementById('total-ops');

// Initialize Queue
let queue = new Queue();
let totalOperations = 0;
let animationSpeed = 'medium';

// Animation speed values
const speedValues = {
    slow: 800,
    medium: 500,
    fast: 300
};

// Initialize Floating Elements
function initFloatingElements() {
    const container = document.getElementById('floating-elements');
    const count = 8;
    for (let i = 0; i < count; i++) {
        const element = document.createElement('div');
        element.className = 'floating-element';
        element.style.left = Math.random() * 100 + '%';
        element.style.top = Math.random() * 100 + '%';
        element.style.animationDelay = Math.random() * 15 + 's';
        element.style.width = (20 + Math.random() * 40) + 'px';
        element.style.height = element.style.width;
        container.appendChild(element);
    }
}

// Log Entry Function
function addLog(message, type = 'info') {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    logEntries.appendChild(entry);
    logEntries.scrollTop = logEntries.scrollHeight;
}

// Update Statistics
function updateStats() {
    queueSizeStat.textContent = queue.size();
    frontStat.textContent = queue.isEmpty() ? '-' : queue.front();
    rearStat.textContent = queue.isEmpty() ? '-' : queue.rear();
    totalOpsStat.textContent = totalOperations;
}

// Render Queue
async function renderQueue() {
    queueContainer.innerHTML = '';

    if (queue.isEmpty()) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'empty-queue-message';
        emptyMsg.innerHTML = '<i class="fas fa-inbox"></i> Queue is Empty';
        queueContainer.appendChild(emptyMsg);
    } else {
        const items = queue.getItems();
        items.forEach((item, index) => {
            const element = document.createElement('div');
            element.className = 'queue-element';

            if (index === 0) element.classList.add('front');
            if (index === items.length - 1) element.classList.add('rear');

            const indexSpan = document.createElement('span');
            indexSpan.className = 'index';
            indexSpan.textContent = `[${index}]`;
            element.appendChild(indexSpan);

            const value = document.createElement('div');
            value.textContent = item;
            element.appendChild(value);

            queueContainer.appendChild(element);
        });
    }

    updatePointerLabels();
    updateStats();
}

// Update Pointer Labels
function updatePointerLabels() {
    const frontPointer = document.querySelector('.front-pointer');
    const rearPointer = document.querySelector('.rear-pointer');

    if (queue.isEmpty()) {
        frontPointer.classList.remove('active');
        rearPointer.classList.remove('active');
    } else {
        frontPointer.classList.add('active');
        rearPointer.classList.add('active');
    }
}

// Enqueue Operation
async function performEnqueue() {
    const value = queueInput.value.trim();

    if (!value) {
        showToast('Please enter a value', 'danger');
        return;
    }

    const capacity = queueSizeInput.value ? parseInt(queueSizeInput.value) : null;
    if (capacity && queue.capacity !== capacity) {
        queue.capacity = capacity;
    }

    if (queue.isFull()) {
        showToast('Queue is full! Cannot enqueue.', 'danger');
        addLog('Enqueue failed: Queue is full', 'danger');
        return;
    }

    queue.enqueue(value);
    totalOperations++;

    queueInput.value = '';
    queueInput.focus();

    addLog(`Enqueued: ${value} (Size: ${queue.size()})`, 'info');
    
    // Animate
    await renderQueue();
    await new Promise(resolve => setTimeout(resolve, speedValues[animationSpeed]));

    updateStats();
}

// Dequeue Operation
async function performDequeue() {
    if (queue.isEmpty()) {
        showToast('Queue is empty! Cannot dequeue.', 'danger');
        addLog('Dequeue failed: Queue is empty', 'danger');
        return;
    }

    const dequeuedValue = queue.dequeue();
    totalOperations++;

    addLog(`Dequeued: ${dequeuedValue} (Size: ${queue.size()})`, 'info');

    await renderQueue();
    await new Promise(resolve => setTimeout(resolve, speedValues[animationSpeed]));

    updateStats();
}

// Peek Operation
function performPeek() {
    if (queue.isEmpty()) {
        showToast('Queue is empty!', 'danger');
        addLog('Peek: Queue is empty', 'danger');
        return;
    }

    const frontValue = queue.front();
    showToast(`Front element: ${frontValue}`, 'info');
    addLog(`Peek: Front element is ${frontValue}`, 'success');
}

// Clear Operation
function performClear() {
    if (queue.isEmpty()) {
        showToast('Queue is already empty', 'warning');
        return;
    }

    const size = queue.size();
    queue.clear();
    totalOperations++;

    addLog(`Cleared queue (${size} elements removed)`, 'warning');
    renderQueue();
}

// Toast Notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.padding = '15px 20px';
    toast.style.borderRadius = '12px';
    toast.style.zIndex = '1000';
    toast.style.animation = 'slideIn 0.3s ease';
    toast.style.maxWidth = '300px';
    toast.style.fontSize = '0.95rem';

    if (type === 'danger') {
        toast.style.background = 'linear-gradient(135deg, #E74C3C, #C0392B)';
    } else if (type === 'warning') {
        toast.style.background = 'linear-gradient(135deg, #F39C12, #E67E22)';
    } else if (type === 'success') {
        toast.style.background = 'linear-gradient(135deg, #2ECC71, #27AE60)';
    } else {
        toast.style.background = 'linear-gradient(135deg, #3498DB, #2980B9)';
    }

    toast.style.color = 'white';
    toast.style.fontWeight = 'bold';
    toast.style.border = '1px solid rgba(255, 255, 255, 0.2)';
    toast.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// Event Listeners
enqueueBtns.addEventListener('click', performEnqueue);
dequeueBtns.addEventListener('click', performDequeue);
peekBtn.addEventListener('click', performPeek);
clearBtn.addEventListener('click', performClear);

// Enter key for input
queueInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performEnqueue();
    }
});

// Animation Speed Change
animationSpeedSelect.addEventListener('change', (e) => {
    animationSpeed = e.target.value;
    addLog(`Animation speed set to ${animationSpeed}`, 'info');
});

// Example Select Change
exampleSelect.addEventListener('change', (e) => {
    const value = e.target.value;
    demoBtnExample.style.display = value === 'none' ? 'none' : 'block';
    exampleDisplay.style.display = 'none';
});

// Demo Example Button
demoBtnExample.addEventListener('click', runExampleDemo);

// Real-World Examples
function runExampleDemo() {
    const exampleType = exampleSelect.value;

    if (exampleType === 'none') return;

    queue.clear();
    renderQueue();
    exampleDisplay.style.display = 'block';
    exampleDisplay.innerHTML = '';

    const title = document.createElement('h4');
    const examples = {
        ticket: '🎫 Ticket Booking System Demo',
        printer: '🖨️ Printer Queue Demo',
        callcenter: '☎️ Call Center System Demo'
    };
    title.textContent = examples[exampleType];
    exampleDisplay.appendChild(title);

    if (exampleType === 'ticket') {
        runTicketBookingDemo();
    } else if (exampleType === 'printer') {
        runPrinterQueueDemo();
    } else if (exampleType === 'callcenter') {
        runCallCenterDemo();
    }
}

// Ticket Booking Demo
async function runTicketBookingDemo() {
    const customers = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'];
    const displayArea = exampleDisplay;

    addLog('=== Ticket Booking System Started ===', 'info');

    for (const customer of customers) {
        const item = document.createElement('div');
        item.className = 'example-item';
        item.innerHTML = `<strong>${customer}</strong> joined the queue`;
        displayArea.appendChild(item);

        queue.enqueue(customer);
        totalOperations++;
        addLog(`${customer} booked a ticket`, 'success');
        await new Promise(resolve => setTimeout(resolve, 600));
        await renderQueue();
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    const ticketMsg = document.createElement('div');
    ticketMsg.className = 'example-item';
    ticketMsg.innerHTML = `<em>Processing tickets in order...</em>`;
    displayArea.appendChild(ticketMsg);

    await new Promise(resolve => setTimeout(resolve, 800));

    while (!queue.isEmpty()) {
        const customer = queue.dequeue();
        totalOperations++;

        const item = document.createElement('div');
        item.className = 'example-item';
        item.innerHTML = `<strong style="color: #2ECC71;">${customer}</strong> has been served ✓`;
        displayArea.appendChild(item);

        addLog(`${customer} has been served and left`, 'success');
        await new Promise(resolve => setTimeout(resolve, 700));
        await renderQueue();
    }

    addLog('=== Ticket Booking System Completed ===', 'success');
}

// Printer Queue Demo
async function runPrinterQueueDemo() {
    const jobs = ['Document-1.pdf', 'Image-2.jpg', 'Report-3.docx', 'Photo-4.png'];
    const displayArea = exampleDisplay;

    addLog('=== Printer Queue Started ===', 'info');

    for (const job of jobs) {
        const item = document.createElement('div');
        item.className = 'example-item';
        item.innerHTML = `<strong>${job}</strong> added to print queue`;
        displayArea.appendChild(item);

        queue.enqueue(job);
        totalOperations++;
        addLog(`${job} sent to printer`, 'success');
        await new Promise(resolve => setTimeout(resolve, 500));
        await renderQueue();
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    const printingMsg = document.createElement('div');
    printingMsg.className = 'example-item';
    printingMsg.innerHTML = `<em>Printer processing jobs in queue order...</em>`;
    displayArea.appendChild(printingMsg);

    await new Promise(resolve => setTimeout(resolve, 800));

    while (!queue.isEmpty()) {
        const job = queue.dequeue();
        totalOperations++;

        const item = document.createElement('div');
        item.className = 'example-item';
        item.innerHTML = `<strong style="color: #2ECC71;">🖨️ Printing: ${job}</strong> ✓`;
        displayArea.appendChild(item);

        addLog(`Printing: ${job}`, 'success');
        await new Promise(resolve => setTimeout(resolve, 900));
        await renderQueue();
    }

    addLog('=== All documents printed ===', 'success');
}

// Call Center Demo
async function runCallCenterDemo() {
    const calls = ['Call from John', 'Call from Sarah', 'Call from Mike', 'Call from Lisa', 'Call from Tom'];
    const displayArea = exampleDisplay;

    addLog('=== Call Center System Started ===', 'info');

    for (const callInfo of calls) {
        const item = document.createElement('div');
        item.className = 'example-item';
        item.innerHTML = `<strong>📞 ${callInfo}</strong> - Waiting in queue`;
        displayArea.appendChild(item);

        queue.enqueue(callInfo);
        totalOperations++;
        addLog(`${callInfo} received - Added to queue`, 'success');
        await new Promise(resolve => setTimeout(resolve, 600));
        await renderQueue();
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    const agentMsg = document.createElement('div');
    agentMsg.className = 'example-item';
    agentMsg.innerHTML = `<em>Agent is connecting calls in order...</em>`;
    displayArea.appendChild(agentMsg);

    await new Promise(resolve => setTimeout(resolve, 800));

    let callCount = 1;
    while (!queue.isEmpty()) {
        const callInfo = queue.dequeue();
        totalOperations++;

        const item = document.createElement('div');
        item.className = 'example-item';
        item.innerHTML = `<strong style="color: #2ECC71;">✓ Call #${callCount}: ${callInfo}</strong> - Connected & Served`;
        displayArea.appendChild(item);

        addLog(`${callInfo} connected to agent`, 'success');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await renderQueue();
        callCount++;
    }

    addLog('=== All calls processed ===', 'success');
}

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    initFloatingElements();
    renderQueue();
    addLog('Queue Visualization Ready!', 'success');
    addLog('Enter a value and click Enqueue to get started', 'info');
});
