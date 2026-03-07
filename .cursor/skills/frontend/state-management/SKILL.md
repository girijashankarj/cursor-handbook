# Skill: Set Up State Management

## Description
Workflow for choosing and implementing the right state management approach.

## Trigger
When the user needs to manage state for a new feature or refactor existing state.

## Steps

### Step 1: Analyze State Requirements
- [ ] What data needs to be managed?
- [ ] Is it UI state or server state?
- [ ] How many components need access?
- [ ] How often does it change?
- [ ] Does it need to persist?

### Step 2: Choose Approach
Use this decision tree:
1. **Single component** → `useState` / `useReducer`
2. **Parent + 1-2 children** → Lift state up
3. **Many components, UI state** → Context / Zustand
4. **Server data** → TanStack Query
5. **Form data** → React Hook Form
6. **Complex workflows** → XState

### Step 3: Implement Store/Hook
Based on the chosen approach, create:
- [ ] State types/interfaces
- [ ] Store definition or custom hook
- [ ] Actions/mutations
- [ ] Selectors for derived data

### Step 4: Connect Components
- [ ] Add provider (if using Context/Redux)
- [ ] Use hooks in components
- [ ] Implement loading states
- [ ] Implement error handling
- [ ] Handle empty states

### Step 5: Optimize Performance
- [ ] Memoize selectors
- [ ] Avoid unnecessary re-renders
- [ ] Keep state granular
- [ ] Use React.memo for pure components

### Step 6: Test
- [ ] Test store/hook in isolation
- [ ] Test components with mocked state
- [ ] Test state transitions
- [ ] Test error handling

## Completion
State management is implemented, connected, optimized, and tested.
