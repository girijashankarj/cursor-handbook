'use strict';

/**
 * Component-to-category manifest derived from cursor-setup-agent.md.
 * Paths are relative to .cursor/ inside the package.
 * A trailing slash means "include everything under this directory".
 * An exact filename means "include only this file".
 */

const CATEGORIES = {
  core: {
    label: 'Core',
    description: 'Architecture, security, devops fundamentals (always included)',
    alwaysIncluded: true,
    paths: [
      // Config & meta — always needed
      'config/',
      'settings/',
      'hooks.json',
      'BUGBOT.md',
      'README.md',

      // Rules
      'rules/main-rules.mdc',
      'rules/architecture/',
      'rules/security/',
      'rules/devops/',

      // Agents
      'agents/README.md',
      'agents/cursor-setup-agent.md',
      'agents/architect-agent.md',
      'agents/implementation-agent.md',
      'agents/refactor-agent.md',
      'agents/git-agent.md',
      'agents/design-pattern-agent.md',
      'agents/business-agent.md',
      'agents/business-estimation-agent.md',
      'agents/business-requirements-agent.md',
      'agents/expense-agent.md',
      'agents/multi-role-agent.md',
      'agents/agent-creator-agent.md',
      'agents/ai-ml-prompt-engineering-agent.md',
      'agents/data-labeller-agent.md',
      'agents/performance-agent.md',
      'agents/backend-code-reviewer.md',

      // Skills
      'skills/backend/code-review/',
      'skills/devops/commit-message-generator/',
      'skills/devops/pr-description-generator/',
      'skills/devops/task-master/',
      'skills/devops/jira-ticket-creator/',
      'skills/devops/doc-redactor/',
      'skills/devops/automation-helper/',
      'skills/devops/cursor-setup/',
      'skills/devops/handbook-validator/',
      'skills/devops/component-search/',
      'skills/devops/token-counter/',
      'skills/devops/env-file-generator/',
      'skills/devops/git-conflict-resolver/',
      'skills/devops/release-manager/',
      'skills/documentation/prompt-engineering/',
      'skills/documentation/websearch/',
      'skills/documentation/regex-builder/',

      // Commands
      'commands/COMMAND_TEMPLATE.md',
      'commands/devops/commit-message.md',
      'commands/devops/pr-description.md',
      'commands/devops/automate.md',
      'commands/devops/jira-ticket.md',
      'commands/devops/json-diff.md',
      'commands/devops/changelog.md',
      'commands/devops/release.md',
      'commands/devops/rollback-plan.md',
      'commands/devops/git-cleanup.md',
      'commands/devops/cron.md',
      'commands/security/',

      // Hooks
      'hooks/README.md',
      'hooks/pre-commit-check.sh',
      'hooks/scan-secrets.sh',
      'hooks/shell-guard.sh',
      'hooks/context-enrichment.sh',
      'hooks/inject-context.sh',
      'hooks/post-edit-check.sh',

      // Templates
      'templates/README.template',
    ],
  },

  frontend: {
    label: 'Frontend',
    description: 'React, Angular, Vue, Svelte, accessibility, components',
    paths: [
      'rules/frontend/',

      'agents/accessibility-agent.md',
      'agents/ui-component-agent.md',
      'agents/frontend-performance-agent.md',
      'agents/frontend-state-agent.md',
      'agents/frontend-styling-agent.md',

      'skills/frontend/',

      'templates/component.template',
      'templates/react-component.tsx.template',
    ],
  },

  backend: {
    label: 'Backend',
    description: 'API handlers, error handling, logging, Node.js, Python, Go, Java',
    paths: [
      'rules/backend/',

      'agents/api-gateway-agent.md',
      'agents/backend-api-agent.md',
      'agents/backend-debugging-agent.md',
      'agents/backend-event-handler-agent.md',
      'agents/rate-agent.md',
      'agents/openapi-spec-agent.md',

      'skills/backend/create-handler/',
      'skills/backend/debug-issue/',
      'skills/backend/optimize-performance/',
      'skills/backend/api-mock-server/',
      'skills/backend/dependency-graph/',
      'skills/backend/error-handler-generator/',
      'skills/backend/feature-flag-manager/',
      'skills/documentation/api-docs/',
      'skills/documentation/openapi-generator/',
      'skills/documentation/postman-collection-generator/',

      'commands/backend/',
      'commands/devops/openapi-spec.md',

      'hooks/auto-format.sh',
      'hooks/format-on-edit.sh',
      'hooks/lint-check.sh',
      'hooks/type-check.sh',

      'templates/api-handler.ts.template',
      'templates/handler.template',
      'templates/service.template',
    ],
  },

  database: {
    label: 'Database',
    description: 'Schema design, migrations, query patterns, ORM',
    paths: [
      'rules/database/',

      'agents/db-agent.md',
      'agents/backend-database-agent.md',
      'agents/data-validator-agent.md',
      'agents/migration-agent.md',
      'agents/database-schema-agent.md',
      'agents/database-query-optimization-agent.md',

      'skills/database/',

      'commands/database/',

      'hooks/validate-sql.sh',

      'templates/migration.template',
    ],
  },

  cloud: {
    label: 'Cloud / Infrastructure',
    description: 'AWS, Terraform, Docker, serverless, infrastructure',
    paths: [
      'rules/cloud/',

      'agents/infra-agent.md',
      'agents/cloud-infrastructure-agent.md',
      'agents/cloud-deployment-agent.md',
      'agents/cloud-cost-optimization-agent.md',
      'agents/cost-optimizer-agent.md',
      'agents/ai-platform-engineer-agent.md',
      'agents/rag-creator-agent.md',

      'skills/cloud/',

      'commands/devops/docker-build.md',
      'commands/devops/docker-compose.md',
      'commands/devops/deploy.md',
      'commands/devops/build.md',

      'templates/dockerfile.template',
    ],
  },

  testing: {
    label: 'Testing',
    description: 'Jest, test patterns, mocking, coverage, integration tests',
    paths: [
      'rules/testing/',

      'agents/testing-agent.md',
      'agents/test-runner.md',
      'agents/regression-agent.md',
      'agents/e2e-testing-agent.md',
      'agents/testing-load-testing-agent.md',
      'agents/testing-security-testing-agent.md',

      'skills/testing/',

      'commands/testing/',

      'hooks/coverage-check.sh',

      'templates/test.template',
    ],
  },

  devops: {
    label: 'DevOps',
    description: 'CI/CD, monitoring, incident response, deployment pipelines',
    paths: [
      'agents/devops-ci-cd-agent.md',
      'agents/devops-incident-agent.md',
      'agents/monitoring-agent.md',
      'agents/platform-dx-agent.md',

      'skills/devops/ci-cd/',
      'skills/devops/monitoring/',
      'skills/devops/setup-monitoring/',
      'skills/devops/dependency-remediation/',
      'skills/devops/incident-runbook-creator/',
      'skills/devops/changelog-generator/',
    ],
  },

  documentation: {
    label: 'Documentation',
    description: 'Architecture docs, API docs, ADRs, diagrams, reverse engineering',
    paths: [
      'agents/diagram-agent.md',
      'agents/doc-setup-agent.md',
      'agents/doc-sync-agent.md',
      'agents/documentation-docs-agent.md',
      'agents/reverse-engineering-doc-agent.md',
      'agents/design-agent.md',
      'agents/architecture-migration-agent.md',
      'agents/architecture-refactoring-agent.md',
      'agents/boundaries-agent.md',

      'skills/documentation/architecture-docs/',
      'skills/documentation/adr-generator/',
    ],
  },

  security: {
    label: 'Security',
    description: 'Auth, auditing, compliance, guardrails',
    paths: [
      'agents/guardrail-agent.md',
      'agents/compliance-agent.md',
      'agents/security-auth-agent.md',
      'agents/security-audit-agent.md',
    ],
  },
};

const SELECTABLE_KEYS = Object.keys(CATEGORIES).filter(
  (k) => !CATEGORIES[k].alwaysIncluded
);

function buildAllowedPaths(selectedKeys) {
  const paths = [...CATEGORIES.core.paths];
  for (const key of selectedKeys) {
    if (CATEGORIES[key]) {
      paths.push(...CATEGORIES[key].paths);
    }
  }
  return paths;
}

function isPathAllowed(relativePath, allowedPaths) {
  for (const allowed of allowedPaths) {
    if (allowed.endsWith('/')) {
      if (relativePath.startsWith(allowed) || relativePath === allowed.slice(0, -1)) {
        return true;
      }
    } else {
      if (relativePath === allowed) {
        return true;
      }
    }
  }
  return false;
}

module.exports = { CATEGORIES, SELECTABLE_KEYS, buildAllowedPaths, isPathAllowed };
