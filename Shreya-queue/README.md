# Queue Data Structure - Real-Time Visualization

## Overview
An interactive web-based visualization of the **Queue Data Structure** that demonstrates FIFO (First In, First Out) operations with smooth animations and real-world examples.

## Features

### ✨ Core Functionality
- **Enqueue**: Add elements to the rear of the queue
- **Dequeue**: Remove elements from the front
- **Peek/Front**: View the front element without removing it
- **Clear**: Empty the entire queue
- **Queue Capacity**: Set optional maximum queue size

### 🎨 Visualization Features
- **Real-time Queue Display**: Visual representation of queue elements
- **Smooth Animations**: Sliding and scaling animations for enqueue/dequeue operations
- **Pointer Labels**: Dynamic "Front" and "Rear" indicators
- **Element Highlighting**: Front and rear elements are highlighted distinctly
- **Empty State**: Clear message when queue is empty

### 🎓 Educational Features
- **Operation Log**: Detailed log of all operations performed
- **Statistics Panel**: 
  - Current queue size
  - Front element value
  - Rear element value
  - Total operations count
- **Time Complexity Info**: Display O(1) complexity for all main operations
- **Use Cases Section**: Real-life applications of queues

### 🎬 Real-World Examples (Interactive Demos)
1. **Ticket Booking System** 🎫
   - Simulates customers joining a queue and receiving tickets
   - Shows first-come-first-served principle

2. **Printer Queue** 🖨️
   - Demonstrates how print jobs are processed in order
   - Shows job scheduling visualization

3. **Call Center System** ☎️
   - Simulates incoming calls being handled in order
   - Shows FIFO processing of customer calls

### ⚙️ Control Features
- **Adjustable Animation Speed**: Slow, Medium, Fast
- **Queue Capacity Limit**: Optional maximum size setting
- **Operation History**: Complete log with timestamps
- **Toast Notifications**: User feedback for operations

## Design & Styling

### Color Palette (Matching Team Theme)
- **Primary**: #6C63FF (Purple)
- **Secondary**: #4A44C6 (Dark Purple)
- **Accent**: #FF6584 (Pink)
- **Success**: #2ECC71 (Green)
- **Danger**: #E74C3C (Red)
- **Warning**: #F39C12 (Orange)
- **Info**: #3498DB (Blue)

### Design Elements
- **Glassmorphism**: Frosted glass effect with backdrop blur
- **Gradient Backgrounds**: Modern gradient overlays
- **Smooth Animations**: CSS transitions and keyframe animations
- **Dark Theme**: Professional dark mode with light text
- **Responsive Layout**: Works on desktop, tablet, and mobile

## Technical Stack
- **HTML5**: Semantic markup
- **CSS3**: Grid, Flexbox, Animations, Gradients
- **Vanilla JavaScript**: No dependencies required

## File Structure
```
Queue-Visualization/
├── index.html          # Main HTML file
├── styles.css          # All styling and animations
└── script.js           # JavaScript logic and interactions
```

## How to Use

### Manual Queue Operations
1. **Enqueue**: 
   - Enter a value in the input field
   - Click "Enqueue" button or press Enter
   - Element appears on the right side of queue

2. **Dequeue**:
   - Click "Dequeue" button
   - Front element is removed with animation

3. **Peek/Front**:
   - Click "Peek/Front" to view the front element
   - Shows in a notification without removing

4. **Clear Queue**:
   - Click "Clear Queue" to empty the queue
   - Removes all elements instantly

5. **Set Capacity**:
   - Enter a number in "Queue Capacity" field
   - Prevents enqueuing beyond capacity

### Real-World Examples
1. Select an example from dropdown menu
2. "Start Demo" button becomes visible
3. Click "Start Demo" to run the visualization
4. Watch as the queue processes items automatically

### Animation Speed Control
- **Slow**: 800ms per operation
- **Medium**: 500ms per operation (default)
- **Fast**: 300ms per operation

## Key Concepts Demonstrated

### FIFO Principle
The first element added is the first one to be removed, like people in a line at a store.

### Time Complexity
- **Enqueue**: O(1) - Constant time
- **Dequeue**: O(1) - Constant time
- **Peek**: O(1) - Constant time
- **Search**: O(n) - Linear time

### Real-Life Applications
- CPU task scheduling
- Print job management
- Call center systems
- Message queues
- Breadth-First Search (BFS)
- Load balancing

## Responsive Design
- **Desktop**: Full-width layout with side-by-side panels
- **Tablet**: Stacked layout with adjusted spacing
- **Mobile**: Optimized single-column layout with smaller elements

## Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Credits
Built as part of the **SHREK Data Structures Web Project** by Team SHREK

## Educational Value
This visualization helps students and developers:
- Understand Queue data structure fundamentals
- Visualize FIFO operations
- See real-world applications
- Practice queue operations interactively
- Learn time complexity analysis

---

**Made with ❤️ by SHREK Team**
