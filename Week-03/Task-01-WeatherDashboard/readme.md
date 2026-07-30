# Week 03 Task 01: API Integration — Weather Dashboard with Fetch

AETHER is an immersive real-time weather visualization engine that transforms weather data into a dynamic atmospheric experience.
Unlike traditional weather dashboards that only display numbers and icons, AETHER creates a living digital sky where weather conditions control the environment. It combines real-time weather APIs, Canvas animations, SVG-based visualization, and responsive UI design to create a more natural way of experiencing weather.
> Observe the weather. Don't just read it.

## Features

## Real-Time Weather Data

AETHER retrieves live weather information for any searched location using the Open-Meteo API.
Users can view:
* Current temperature
* Feels-like temperature
* Humidity
* Wind speed
* Atmospheric pressure
* UV index
* Current weather condition

## Dynamic Atmospheric Sky Engine

The background environment changes according to real weather conditions.
Supported weather states:

* Clear Sky
* Clear Night
* Partly Cloudy
* Overcast
* Fog
* Rain
* Snow
* Thunderstorm
Each state creates a different atmosphere using:
* Dynamic sky gradients
* Moving cloud formations
* Rain particle animations
* Snow particle effects
* Night-time stars
* Lightning flashes during storms

## Interactive Horizon Visualization

AETHER includes a custom horizon arc that represents the position of the sun throughout the day.
The system uses actual sunrise and sunset data to calculate:
* Sunrise time
* Sunset time
* Current day progress
* Sun position on the horizon
This creates a visual connection between real astronomical data and the weather experience.

## Weather Intelligence & Guidance
AETHER does more than display forecasts.
It generates condition-based recommendations depending on the current environment.
Examples:
* UV protection suggestions
* Heat awareness guidance
* Rain preparation tips
* Fog driving precautions
* Storm safety recommendations
* Outdoor activity suggestions

## Three-Day Forecast
The application provides a short forecast overview containing:
* Upcoming weather conditions
* Maximum temperature
* Minimum temperature
* Daily weather summaries
  
# Technologies Used

## Frontend
* HTML
* CSS
* JavaScript (ES6)

## APIs
* Open-Meteo Geocoding API
* Open-Meteo Weather Forecast API

## Browser Technologies
* Canvas API for particle animations
* SVG for horizon visualization
* Fetch API for asynchronous data requests
* CSS Variables for dynamic themes
* CSS Animations and Transitions
* Responsive Web Design

# Design Approach

AETHER follows an observatory-inspired visual style.
The interface focuses on:
* Minimal layout
* Neutral atmospheric colors
* Glassmorphism panels
* Large typography
* Environmental animations
* Data-driven visual storytelling

The goal was to create a weather experience that feels closer to observing nature rather than opening a traditional weather application.

# 📂 Project Structure

```
AETHER-Weather-Engine
│
├── index.html
├── style.css
├── app.js
└── README.md
```

---

# How It Works

1. User searches for a city.
2. The Geocoding API converts the city name into geographic coordinates.
3. Coordinates are sent to the weather forecast API.
4. Weather conditions are identified using WMO weather codes.
5. The application selects the appropriate sky environment.
6. Canvas generates weather animations.
7. Weather information, recommendations, and forecasts are displayed dynamically.

#  Development Highlights

During development, the main focus was building a weather experience instead of a simple data display.

Key concepts explored:

* API integration
* Asynchronous JavaScript
* Dynamic DOM manipulation
* Canvas-based animations
* SVG visualization
* Responsive frontend architecture
* Weather condition mapping
* Real-time UI updates

# Future Improvements

Potential improvements:

* Automatic user location detection
* More advanced moon phase visualization
* Weather radar integration
* AI-powered weather assistant
* Progressive Web App support
* More realistic atmospheric simulations

# Author

**Insharah Irshad**

BS Artificial Intelligence Student
Frontend Developer | AI Enthusiast

⭐ If you find this project interesting, consider starring the repository.
