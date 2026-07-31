# Week 03 Task 02: Local Storage Notes App

Corkboard is a sticky note-inspired notes application built using **HTML, CSS, and JavaScript**. This project demonstrates how browser storage can be used to create a practical note-taking application where user data remains available even after refreshing or reopening the browser.
Unlike temporary note applications, Corkboard stores all notes in **Local Storage**, allowing users to create, edit, delete, and search notes without losing their work.
> Pin your thoughts before they wander off.

# Features

## Create Notes
Users can create new notes by adding:
- Note title
- Note content

Each note automatically receives:
- Unique ID
- Creation timestamp
- Last edited timestamp

## Edit Notes

Users can update existing notes whenever required.
When a note is edited:
- Content updates instantly
- Last edited timestamp changes automatically
- Updated data is saved in Local Storage

## Delete Notes
Users can remove notes permanently from the corkboard.
Features include:
- Smooth delete animation
- Automatic storage update
- Instant UI refresh

## Search Notes

The application includes a real-time search system.
Users can search notes by:
- Title
- Content
The notes display updates dynamically while typing.

## Form Validation
The application validates user input before saving notes.
Validation rules:
- Title cannot be empty
- Content cannot be empty

If validation fails:

- Inline error messages appear
- Invalid fields are highlighted
- Empty notes are prevented from being saved

## Local Storage Persistence
All notes are stored using the browser's **Local Storage API**.
This allows users to:
- Keep notes after refreshing the page
- Access saved notes after reopening the browser
- Maintain data without using a database

## Last Edited Timestamp

Every note displays its latest modification time.
The timestamp automatically updates whenever a note is edited, helping users track recent changes.

# Technologies Used

## Frontend
- HTML
- CSS
- JavaScript 

## Browser APIs

- Local Storage API
- DOM Manipulation
- Event Listeners
- JSON Parse & Stringify

# Design Approach

Corkboard follows a realistic bulletin board concept where notes appear as colorful sticky notes pinned on a wooden board.
The design focuses on:
- Sticky note inspired UI
- Handwritten typography
- Randomized note colors
- Pin decorations
- Smooth animations
- Responsive grid layout
- Clean user experience

The goal was to create a visually engaging notes application while implementing real-world frontend functionality.

# Local Storage Data Structure
The application stores notes as an array of JavaScript objects inside Local Storage. Each note object contains an ID, title, content, creation date, and last updated date. Before storing data, the array is converted into JSON format using `JSON.stringify()`. When the application loads, stored data is converted back into JavaScript objects using `JSON.parse()`.
This structured approach makes CRUD operations easier and ensures that notes remain available after browser refresh.

## Author

Insharah Irshad
BS Artificial Intelligence Student
