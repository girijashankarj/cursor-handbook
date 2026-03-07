---
name: component-creation
description: Step-by-step workflow for creating accessible, tested UI components. Use when the user asks to create a new UI component.
---

# Skill: Create UI Component

## Trigger
When the user asks to create a new UI component.

## Prerequisites
- [ ] Project uses React (or Vue; adjust steps)
- [ ] `src/components/` or equivalent exists
- [ ] Testing framework configured (Jest, Vitest, etc.)
- [ ] Styling approach known (Tailwind, CSS Modules, etc.)

## Steps

### Step 1: Define Component
- [ ] Name the component (PascalCase)
- [ ] Define its purpose and responsibilities
- [ ] Identify parent and child components
- [ ] List props and their types
- [ ] Identify state requirements

### Step 2: Create Component Directory
```
src/components/{category}/{ComponentName}/
├── {ComponentName}.tsx       # Component implementation
├── {ComponentName}.test.tsx  # Unit tests
├── {ComponentName}.stories.tsx # Storybook story (optional)
└── index.ts                  # Public export
```

### Step 3: Define Props Interface
- [ ] Create TypeScript interface for props
- [ ] Add JSDoc documentation for complex props
- [ ] Set default values where appropriate
- [ ] Mark optional props with `?`

### Step 4: Implement Component
- [ ] Use functional component with hooks
- [ ] Destructure props in function signature
- [ ] Implement rendering logic
- [ ] Add error boundary if needed
- [ ] Handle loading, error, and empty states

### Step 5: Add Accessibility
- [ ] Semantic HTML elements used
- [ ] ARIA attributes where needed
- [ ] Keyboard navigation works
- [ ] Focus management for modals/popups
- [ ] Color contrast meets WCAG 2.1 AA

### Step 6: Add Styling
- [ ] Follow project styling approach
- [ ] Responsive across breakpoints
- [ ] Dark mode support
- [ ] Design token usage (no magic numbers)
- [ ] No inline styles (except dynamic values)

### Step 7: Write Tests
- [ ] Renders correctly with default props
- [ ] Renders correctly with all prop combinations
- [ ] User interactions work (click, type, etc.)
- [ ] Accessibility tests pass
- [ ] Error states handled

### Step 8: Create Export
- [ ] Export component from index.ts
- [ ] Export props interface

## Completion Checklist
- [ ] Component renders with default props
- [ ] Props interface exported
- [ ] Tests pass
- [ ] Accessibility: keyboard nav, ARIA, contrast
- [ ] No lint/type errors

## If Step Fails
- **Step 2 (directory)**: Match existing structure in `src/components/` (ui/, features/, layout/)
- **Step 5 (a11y)**: Use `aria-label` on icon buttons; `role` only when semantic HTML insufficient
- **Step 7 (tests)**: Run single file: `npm test -- ComponentName.test.tsx`. Fix type errors first with `{{CONFIG.testing.typeCheckCommand}}`

## Example
Step 1: `OrderSummary` — displays order total and item count. Props: `items`, `taxRate`. Step 4: Functional component, `useMemo` for total calculation, loading/empty states.
