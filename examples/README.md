# Stack-Specific Examples

Pre-configured `project.json` files for different tech stacks. Copy the one that matches your project and customize.

| Stack              | Path                           | Description              |
| ------------------ | ------------------------------ | ------------------------- |
| TypeScript+Express | [typescript-express/](typescript-express/) | REST API with Express.js  |
| TypeScript+NestJS  | [typescript-nest/](typescript-nest/)       | NestJS application        |
| Python+FastAPI    | [python-fastapi/](python-fastapi/)         | FastAPI microservice      |
| Go+Chi            | [go-chi/](go-chi/)                         | Go HTTP service           |
| Kotlin+Spring     | [kotlin-spring/](kotlin-spring/)           | Spring Boot application   |
| React              | [react/](react/)                           | React SPA                 |
| Next.js            | [nextjs/](nextjs/)                         | Next.js fullstack app     |
| Rust+Actix        | [rust-actix/](rust-actix/)                 | Rust web service          |
| Flutter            | [flutter/](flutter/)                       | Flutter mobile app        |

## Usage

1. Copy the relevant `project.json` to `.cursor/config/project.json` in your project.
2. Customize values (project name, paths, domain entities).
3. The 208 components (rules, agents, skills, commands, hooks) will automatically adapt to your configuration via `{{CONFIG}}` placeholders.
