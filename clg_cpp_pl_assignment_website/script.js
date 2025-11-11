// Tab switching
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

// Toggle more info
function toggleMoreInfo(btn) {
    const info = btn.nextElementSibling;
    info.style.display = (info.style.display === 'block') ? 'none' : 'block';
}

// DLL Implementation
class Node {
    constructor(data) { this.data = data; this.prev = null; this.next = null; }
}

class DoublyLinkedList {
    constructor() { this.head = null; this.tail = null; }

    addFront() {
        const value = Number(document.getElementById('valueInput').value);
        if (!value && value !== 0) return alert('Enter a value!');
        const newNode = new Node(value);
        if (!this.head) this.head = this.tail = newNode;
        else { newNode.next = this.head; this.head.prev = newNode; this.head = newNode; }
        this.display(newNode,'new-node');
    }

    addEnd() {
        const value = Number(document.getElementById('valueInput').value);
        if (!value && value !== 0) return alert('Enter a value!');
        const newNode = new Node(value);
        if (!this.head) this.head = this.tail = newNode;
        else { newNode.prev = this.tail; this.tail.next = newNode; this.tail = newNode; }
        this.display(newNode,'new-node');
    }

    addMiddle() {
        const value = Number(document.getElementById('valueInput').value);
        const pos = Number(document.getElementById('positionInput').value);
        if (!value && value !== 0) return alert('Enter a value!');
        if (!pos || pos < 1) return alert('Enter a valid position!');
        const newNode = new Node(value);
        if (!this.head) { this.head = this.tail = newNode; }
        else if(pos===1){ this.addFront(); return; }
        else{
            let current = this.head, count=1;
            while(current.next && count<pos-1){ current=current.next; count++; }
            newNode.next=current.next;
            if(current.next) current.next.prev=newNode; else this.tail=newNode;
            current.next=newNode; newNode.prev=current;
        }
        this.display(newNode,'new-node');
    }

    popFront() {
        if(!this.head) return alert('List is empty!');
        const delNode=this.head;
        if(this.head===this.tail){ this.head=this.tail=null; }
        else{ this.head=this.head.next; this.head.prev=null; }
        this.display(delNode,'delete-node');
    }

    popEnd() {
        if(!this.tail) return alert('List is empty!');
        const delNode=this.tail;
        if(this.head===this.tail){ this.head=this.tail=null; }
        else{ this.tail=this.tail.prev; this.tail.next=null; }
        this.display(delNode,'delete-node');
    }

    popMiddle() {
        const pos=Number(document.getElementById('positionInput').value);
        if(!this.head) return alert('List is empty!');
        if(!pos || pos<1) return alert('Enter valid position!');
        if(pos===1){ this.popFront(); return; }
        let current=this.head, count=1;
        while(current && count<pos){ current=current.next; count++; }
        if(!current) return alert('Position out of range!');
        if(current.next) current.next.prev=current.prev; else this.tail=current.prev;
        if(current.prev) current.prev.next=current.next;
        this.display(current,'delete-node');
    }

    display(highlightNode=null, actionClass='') {
        const container=document.getElementById('dll-container');
        container.innerHTML='';
        let current=this.head;
        while(current){
            const nodeDiv=document.createElement('div');
            nodeDiv.className='node';
            nodeDiv.innerText=current.data;
            if(current===this.head) nodeDiv.classList.add('head');
            if(current===this.tail) nodeDiv.classList.add('tail');
            if(current===highlightNode){ nodeDiv.classList.add(actionClass); setTimeout(()=>nodeDiv.classList.remove(actionClass),700); }
            container.appendChild(nodeDiv);
            if(current.next){
                const arrow=document.createElement('div');
                arrow.className='arrow';
                arrow.innerText='↔';
                container.appendChild(arrow);
            }
            current=current.next;
        }
    }
}

const dll=new DoublyLinkedList();
