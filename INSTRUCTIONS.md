# Full-Stack Coding Test: “Weather Dashboard”

**Time Estimate**: ~2 hours

**Goal**: Create a simple, clean, and maintainable application that fetches weather information based on user input and displays it in an aesthetically pleasing way. This task is designed to assess your ability to break down problems, organise code, and structure a well-architected application.

---

**Task Description**:

Create a weather dashboard using a public weather API (e.g., [OpenWeatherMap](https://openweathermap.org/api)). The app should allow the user to enter a city and display:

1. Current weather (temperature, weather description, and an appropriate weather icon).

2. Forecast for the next 3 days (basic temperature and weather conditions).

---

**Requirements:**

- **Frontend**:
  - Use React or Next.js / and Typescript
  - A simple, clean UI with form input for entering the city name.
  - Display weather information with clear sections for current weather and the forecast.
  - Include a small loading indicator while fetching data.
- **Backend**:
  - Set up a basic Node.js/Express or Next.js API routes backend, written in Typescript.
  - Use the backend to fetch data from the weather API (do not call the API directly from the frontend).
- **File Structure:**
  - Organise code into clear folders (components, services, pages, etc.).
  - Demonstrate thoughtful file organisation and separation of concerns.
- **Bonus (Optional):**
  - Show off state management (React context or other solutions).
  - Show a button to load the forecast for additional days (day 4, 5, ...)
  - Include minimal CSS styling (using Tailwind or styled-components is a plus).
  - Write a couple of unit tests for critical functions/components.

---

**Submission Instructions:**

- Provide a GitHub repository link with clear setup instructions ([README.md](http://readme.md/)).
- Include a brief explanation of your architectural decisions in the README.

---

**Evaluation Criteria:**

- Architecture: How well is the application structured?
- Code Quality: Readability, maintainability, and use of TypeScript.
- Problem-Solving: Efficient use of API calls and error handling.
- UI/UX: Clear, simple, and intuitive user interface.
