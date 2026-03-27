# Useful Design Principles and Design Patterns

## Design Principles

### 1) KISS (Keep It Simple, Stupid)
- Build the simplest solution that solves the problem.
- Avoid premature abstractions and over-engineering.
- Student signal: if code needs too much explanation, simplify it.

### 2) DRY (Don’t Repeat Yourself)
- Move duplicated logic into reusable functions/modules.
- Reduces bugs because changes happen in one place.
- Warning: do not over-abstract too early; duplication can be acceptable temporarily.

### 3) SOLID (overview)
- SOLID is a group of five object-oriented design guidelines:
- `S` Single Responsibility: one reason to change.
- `O` Open/Closed: open for extension, closed for modification.
- `L` Liskov Substitution: subtypes should be safely replaceable.
- `I` Interface Segregation: prefer small focused interfaces.
- `D` Dependency Inversion: depend on abstractions, not low-level details.
- In frontend, apply SOLID pragmatically to improve testability and maintainability, not as rigid rules.

### 4) Separation of Concerns
- Keep concerns isolated (UI, state, data fetching, styling, validation).
- Improves maintainability and team collaboration.

### 5) Composition over Inheritance
- Prefer combining small reusable pieces over deep class hierarchies.
- In frontend, composition usually fits component-driven architecture better.

### 6) YAGNI (You Aren’t Gonna Need It)
- Do not build features “just in case.”
- Implement only what is required now, then iterate.

### 7) Principle of Least Astonishment
- APIs and naming should behave as developers expect.
- Clear naming and predictable behavior reduce onboarding time.

### 8) Accessibility First
- Treat accessibility as a core quality requirement, not a final check.
- Use semantic HTML, labels, keyboard navigation, and contrast-aware styles.

### 9) Performance as a Feature
- Optimize rendering, loading, and interaction early enough to avoid regressions.
- Measure with Lighthouse/Web Vitals and fix bottlenecks iteratively.

---

## Useful Design Patterns (Frontend)

### 1) Module Pattern
- Group related functionality and keep internals private.
- Good for organizing features in plain JavaScript projects.

### 2) Factory Pattern
- Centralize object creation logic.
- Useful when object setup is conditional or repeated.

### 3) Observer / Pub-Sub Pattern
- Components communicate through events without tight coupling.
- Useful for notifications, analytics events, and cross-module updates.

### 4) Strategy Pattern
- Swap algorithms/behaviors at runtime via interchangeable functions/objects.
- Example: different sorting/filtering/payment strategies.

### 5) Adapter Pattern
- Wrap incompatible interfaces so systems can work together.
- Common for normalizing third-party API responses.

### 6) Facade Pattern
- Provide a simplified API over a complex subsystem.
- Example: one `apiClient` module hiding fetch headers/error handling/retries.

### 7) Repository Pattern
- Abstract data source details (HTTP, cache, local storage).
- Keeps business logic independent from transport details.

### 8) Container/Presentational Pattern
- Container handles data/state; presentational component handles UI.
- Improves component reusability and testability.

### 9) State Machine Pattern
- Model UI states explicitly (idle/loading/success/error).
- Reduces impossible states and conditional complexity.

### 10) Command Pattern
- Encapsulate actions as objects/functions.
- Useful for undo/redo, queued actions, and macro operations.

---

## Practical Teaching Tip
When discussing patterns with students:
1. Start from a real pain point (duplication, coupling, hard testing).
2. Show a small “before” and “after”.
3. Explain tradeoffs (complexity, flexibility, performance).
4. Emphasize that patterns are tools, not rules.
