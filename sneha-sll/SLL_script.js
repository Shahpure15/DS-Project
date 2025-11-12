// SLL_script.js (Finalized Code with DOM Safety)

// Global variables, now guaranteed to be assigned in init() due to 'defer' in HTML
let VISUAL_AREA; 
let SIZE_DISPLAY; 

const SLL_VISUALIZER = (function() {
    
    // --- 1. Data Structure Classes (Unchanged) ---
    
    class Node {
        constructor(data) {
            this.data = data;
            this.next = null;
        }
    }

    class SinglyLinkedList {
        constructor() {
            this.head = null;
            this.size = 0;
        }

        // ... ALL INSERTION/DELETION LOGIC REMAINS HERE (Omitted for brevity) ...
        insertAtHead(data) {
            const newNode = new Node(data);
            newNode.next = this.head;
            this.head = newNode;
            this.size++;
            return newNode;
        }
        
        insertAtTail(data) {
            const newNode = new Node(data);
            if (!this.head) {
                this.head = newNode;
            } else {
                let current = this.head;
                while (current.next) {
                    current = current.next;
                }
                current.next = newNode;
            }
            this.size++;
            return newNode;
        }

        insertAtIndex(data, index) {
            if (index < 0 || index > this.size) return null;
            if (index === 0) return this.insertAtHead(data); 
            if (index === this.size) return this.insertAtTail(data);

            const newNode = new Node(data);
            let current = this.head;
            let previous;
            let count = 0;

            while (count < index) {
                previous = current;
                current = current.next;
                count++;
            }
            
            newNode.next = current;
            previous.next = newNode;
            this.size++;
            return newNode;
        }
        
        deleteHead() {
            if (!this.head) return null;
            const deletedNode = this.head;
            this.head = this.head.next;
            this.size--;
            return deletedNode;
        }

        deleteTail() {
            if (!this.head) return null;
            if (this.size === 1) return this.deleteHead();

            let current = this.head;
            let previous;
            while (current.next) {
                previous = current;
                current = current.next;
            }
            
            previous.next = null;
            this.size--;
            return current;
        }

        deleteAtIndex(index) {
            if (index < 0 || index >= this.size) return null;

            if (index === 0) return this.deleteHead();

            let current = this.head;
            let previous;
            let count = 0;

            while (count < index) {
                previous = current;
                current = current.next;
                count++;
            }

            previous.next = current.next;
            this.size--;
            return current;
        }
    }

    let list = new SinglyLinkedList();

    // --- 2. Visualization Functions ---

    function createNodeElement(data) {
        const nodeDiv = document.createElement('div');
        nodeDiv.className = 'sll-node';
        const dataDiv = document.createElement('div');
        dataDiv.className = 'sll-data';
        dataDiv.textContent = data;
        const pointerDiv = document.createElement('div');
        pointerDiv.className = 'sll-next-pointer';
        pointerDiv.textContent = 'Next';
        nodeDiv.appendChild(dataDiv);
        nodeDiv.appendChild(pointerDiv);
        return nodeDiv;
    }

    function createArrowElement() {
        const arrowDiv = document.createElement('div');
        arrowDiv.className = 'sll-arrow';
        arrowDiv.innerHTML = '&rarr;';
        return arrowDiv;
    }

    function renderListToDOM(highlightedNode = null, action = null) {
        // Now that 'defer' is used, these variables are guaranteed to be set
        // by the time renderListToDOM is first called inside init().
        
        VISUAL_AREA.innerHTML = '';
        // FIX: Check if SIZE_DISPLAY exists before setting textContent
        if (SIZE_DISPLAY) { 
            SIZE_DISPLAY.textContent = list.size;
        }

        if (list.size === 0) {
            VISUAL_AREA.innerHTML = '<div class="empty-list-message">List is currently empty.</div>';
            return;
        }

        let current = list.head;
        while (current) {
            const nodeElement = createNodeElement(current.data);

            if (highlightedNode && highlightedNode.data === current.data) {
                if (action === 'insert') {
                    nodeElement.classList.add('highlight-insert');
                } else if (action === 'delete') {
                    nodeElement.classList.add('highlight-delete');
                } else if (action === 'search') {
                    nodeElement.classList.add('highlight-search');
                }
            }
            
            VISUAL_AREA.appendChild(nodeElement);

            if (current.next) {
                VISUAL_AREA.appendChild(createArrowElement());
            } else {
                nodeElement.querySelector('.sll-next-pointer').textContent = 'NULL';
            }

            current = current.next;
        }
    }
    
    async function animateSearch(targetValue) {
        let current = list.head;
        let found = false;

        const allNodes = VISUAL_AREA.querySelectorAll('.sll-node');
        allNodes.forEach(node => node.classList.remove('highlight-search'));

        while (current) {
            renderListToDOM(current, 'search');
            await new Promise(resolve => setTimeout(resolve, 300));

            if (current.data == targetValue) {
                found = true;
                alert(`Value ${targetValue} found!`);
                break;
            }
            
            current = current.next;
        }
        
        setTimeout(() => {
            renderListToDOM();
            if (!found) {
                 alert(`Value ${targetValue} not found in the list.`);
            }
        }, 500); 
    }


    // --- 3. Public API (Handlers) ---

    function getValidInput(inputValue, name) {
        const trimmedValue = inputValue.trim();
        if (!trimmedValue) {
            alert(`Please enter a value for ${name}.`);
            return null;
        }
        const value = parseInt(trimmedValue);
        if (isNaN(value)) {
            alert(`Please enter a valid number for ${name}.`);
            return null;
        }
        return value;
    }

    return {
        // --- HANDLERS (Unchanged) ---
        
        insertAtHead: function(inputValue) {
            const value = getValidInput(inputValue, 'Value');
            if (value === null) return;
            const newNode = list.insertAtHead(value);
            renderListToDOM(newNode, 'insert');
            document.getElementById('insert-head-value').value = '';
        },
        
        insertAtTail: function(inputValue) {
            const value = getValidInput(inputValue, 'Value');
            if (value === null) return;
            const newNode = list.insertAtTail(value);
            renderListToDOM(newNode, 'insert');
            document.getElementById('insert-tail-value').value = '';
        },

        insertAtIndex: function(inputValue, indexValue) {
            const value = getValidInput(inputValue, 'Value');
            const index = getValidInput(indexValue, 'Index');

            if (value === null || index === null) return;
            
            if (index < 0 || index > list.size) {
                alert(`Index ${index} is invalid. Must be between 0 and ${list.size}.`);
                return;
            }

            const newNode = list.insertAtIndex(value, index);
            if (newNode) renderListToDOM(newNode, 'insert');

            document.getElementById('insert-index-value').value = '';
            document.getElementById('insert-index-index').value = '';
        },
        
        deleteHead: function() {
            if (list.size === 0) { alert("List is empty."); return; }
            const deletedNode = list.head;
            renderListToDOM(deletedNode, 'delete');
            setTimeout(() => {
                list.deleteHead();
                renderListToDOM();
            }, 500);
        },

        deleteTail: function() {
            if (list.size === 0) { alert("List is empty."); return; }
            const confirmedDeletedNode = list.deleteTail();
            if (confirmedDeletedNode) {
                renderListToDOM(confirmedDeletedNode, 'delete');
                setTimeout(() => { renderListToDOM(); }, 500);
            }
        },

        deleteAtIndex: function(indexValue) {
            const index = getValidInput(indexValue, 'Index');
            if (index === null) return;

            if (index < 0 || index >= list.size) {
                alert(`Index ${index} is invalid. Must be between 0 and ${list.size - 1}.`);
                return;
            }

            const deletedNode = list.deleteAtIndex(index);
            if (deletedNode) {
                 renderListToDOM(deletedNode, 'delete');
                 setTimeout(() => { renderListToDOM(); }, 500);
            }
            document.getElementById('delete-index').value = '';
        },
        
        search: function(inputValue) {
            const value = getValidInput(inputValue, 'Value');
            if (value === null) return;
            if (list.size === 0) { alert("List is empty. Cannot search."); return; }
            
            animateSearch(value);
            document.getElementById('search-value').value = '';
        },

        init: function() {
            // FIX: Assign the global variables now that the HTML has loaded (guaranteed by 'defer').
            VISUAL_AREA = document.getElementById('sll-visualization-area');
            SIZE_DISPLAY = document.getElementById('list-size');
            
            renderListToDOM();
        }
    };
})();

SLL_VISUALIZER.init();