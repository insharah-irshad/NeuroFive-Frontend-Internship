# Task 02 - Responsive Layouts: Flexbox & CSS Grid Playground

## Project Overview

This project was developed as part of my Frontend Development Internship at **NeuroFive Solutions**.
The objective of this task was to understand and implement modern CSS layout techniques by creating the same responsive pricing section using two different approaches:

1. CSS Flexbox
2. CSS Grid

The purpose was to explore the differences between both layout systems and understand when each technique is more suitable for building responsive web interfaces
---

## Task Objective

The goal of this project was to:

- Create a 3-column pricing section with header and footer
- Build the layout using CSS Flexbox
- Rebuild the same layout using CSS Grid
- Make both versions responsive for smaller screens
- Compare the experience of using Flexbox and Grid

# Flexbox vs CSS Grid Comparison

While building this pricing section, Flexbox was easier for arranging the cards in a row and controlling alignment. However, handling the overall column structure and responsiveness required additional properties like flex-wrap and flex-direction.
CSS Grid made creating the three-column layout easier because rows and columns could be controlled directly. Making the layout responsive was also simpler by changing the number of grid column.
Overall, Flexbox is better suited for one-dimensional layouts, while CSS Grid is more suitable for two-dimensional layouts. For this pricing section, CSS Grid felt more convenient because it provided better control over the complete layout structure.

# Flexbox Implementation

The first version of the pricing layout was created using CSS Flexbox.
### Features:
- Used `display: flex` for layout arrangement
- Applied flex properties for alignment and spacing
- Used `flex-wrap` for better responsiveness
- Added media queries to stack cards vertically on smaller screens
Flexbox was useful for arranging elements in a single direction and controlling alignment between pricing cards.

# CSS Grid Implementation

The second version was recreated using CSS Grid.

### Features:
- Used `display: grid` for layout structure
- Created equal columns using `grid-template-columns`
- Managed spacing using grid gap
- Added responsive behavior using media queries
Grid provided better control over the two-dimensional structure of the pricing section.


# Responsive Design

Both versions are responsive and adapt to smaller screen sizes.

### Desktop View:
- Three pricing cards displayed in a horizontal layout.

### Mobile View:
- Cards automatically stack into a single column below 600px using CSS media queries.

# Technologies Used

- HTML
- CSS
- Flexbox
- CSS Grid
- Responsive Web Design

# Project Structure

```
Task-02-ResponsiveLayouts
│
├── Flexbox.html
├── Grid.html
└── README.md
```


# Learning Outcomes

Through this task, I learned:

- How to create responsive layouts using modern CSS techniques
- Difference between Flexbox and CSS Grid
- When to use Flexbox and when to use Grid
- How media queries improve responsiveness
- Better project organization using GitHub

## By

**Insharah Irshad**  
Frontend Development Intern  
NeuroFive Solutions
