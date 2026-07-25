# Task 01: Interactive To-Do List
An interactive To-Do List application built using HTML, CSS, and JavaScript as part of the Frontend Development practice. This project focuses on DOM manipulation, event handling, and dynamic UI updates to create a responsive task management experience.

## Features
- Add new tasks dynamically
- Mark tasks as completed
- Delete tasks
- Filter tasks by:
  - All
  - Active
  - Completed
- Display remaining task count
- Clear all completed tasks
- Responsive and clean user interface

## Technologies Used
- HTML
- CSS
- JavaScript 
- DOM Manipulation

## Key Concepts Implemented
### DOM Manipulation

The project uses JavaScript DOM methods such as `querySelector()`, `createElement()`, `appendChild()`, and `textContent` to dynamically create and update task elements without manually modifying the HTML structure.

### Event Handling

Event listeners are used to handle user interactions such as adding tasks, completing tasks, filtering tasks, and deleting tasks.

### State Management

Tasks are stored in a JavaScript array as the single source of truth. Each task object contains its unique ID, text content, and completion status.

Example:

```javascript
{
  id: 1,
  text: "Learn JavaScript",
  completed: false
}
```
Keeping DOM and Data in Sync
The application keeps the DOM and task data synchronized by storing all task information inside a JavaScript array instead of relying on HTML elements as the source of data. Whenever a task is added, updated, deleted, or filtered, the data state is modified first and the render() function rebuilds the DOM according to the latest data. This ensures that the user interface always displays the current state of the application accurately.

## Learning Outcomes

Through this project, I practiced:
Understanding how JavaScript interacts with the DOM
Managing application state using arrays and objects
Working with events and user interactions
Creating dynamic web interfaces without page reloads
Applying clean frontend development practices

## By
Insharah Irshad 
BS Artificial Intelligence student
