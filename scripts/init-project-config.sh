#!/bin/bash
# cursor-handbook: Interactive project.json generator
# Prompts for key values and creates .cursor/config/project.json from template
# Usage: ./scripts/init-project-config.sh [--non-interactive]
# See also: make init (uses project.json.handbook if in handbook repo)

set -e

TEMPLATE=".cursor/config/project.json.template"
OUTPUT=".cursor/config/project.json"
NON_INTERACTIVE=false
[ "${1:-}" = "--non-interactive" ] && NON_INTERACTIVE=true

if [ ! -f "$TEMPLATE" ]; then
  echo "Error: $TEMPLATE not found. Run from project root after cloning cursor-handbook."
  exit 1
fi

prompt() {
  local var="$1" default="$2" prompt="$3"
  if [ "$NON_INTERACTIVE" = true ]; then
    eval "$var=\"\${$var:-$default}\""
  else
    read -p "$prompt [$default]: " val
    eval "$var=\"\${val:-$default}\""
  fi
}

echo "cursor-handbook: Project configuration"
echo "======================================"

prompt PROJECT_NAME "my-project" "Project name"
prompt LANGUAGE "TypeScript" "Language"
prompt FRAMEWORK "Express.js" "Framework"
prompt DATABASE "PostgreSQL" "Database"
prompt PACKAGE_MANAGER "pnpm" "Package manager (npm|yarn|pnpm)"
prompt COVERAGE_MIN "90" "Min coverage %"
prompt TEST_CMD "pnpm run test" "Test command"
prompt TYPE_CHECK_CMD "pnpm run type-check" "Type-check command"

# Create output directory
mkdir -p "$(dirname "$OUTPUT")"

# Copy template and replace placeholders
cp "$TEMPLATE" "$OUTPUT"

# Escape for sed (handle / in paths)
TEST_CMD_ESC=$(echo "$TEST_CMD" | sed 's/[\/&]/\\&/g')
TYPE_CHECK_CMD_ESC=$(echo "$TYPE_CHECK_CMD" | sed 's/[\/&]/\\&/g')

# Replace key placeholders
sed -i.bak "s/{{PROJECT_NAME}}/$PROJECT_NAME/g" "$OUTPUT"
sed -i.bak "s/{{LANGUAGE}}/$LANGUAGE/g" "$OUTPUT"
sed -i.bak "s/{{FRAMEWORK}}/$FRAMEWORK/g" "$OUTPUT"
sed -i.bak "s/{{DATABASE}}/$DATABASE/g" "$OUTPUT"
sed -i.bak "s/{{PACKAGE_MANAGER}}/$PACKAGE_MANAGER/g" "$OUTPUT"
sed -i.bak "s/\"coverageMinimum\": 90/\"coverageMinimum\": $COVERAGE_MIN/g" "$OUTPUT"
sed -i.bak "s|{{TEST_COMMAND}}|$TEST_CMD_ESC|g" "$OUTPUT"
sed -i.bak "s|{{TYPE_CHECK_COMMAND}}|$TYPE_CHECK_CMD_ESC|g" "$OUTPUT"

# Set common path defaults for TypeScript/Node
sed -i.bak "s/{{SOURCE_PATH}}/src/g" "$OUTPUT"
sed -i.bak "s/{{API_PATH}}/src\/apis/g" "$OUTPUT"
sed -i.bak "s/{{HANDLER_BASE_PATH}}/src\/apis\/handlers\/v1/g" "$OUTPUT"
sed -i.bak "s/{{COMMON_PATH}}/src\/apis\/common/g" "$OUTPUT"
sed -i.bak "s/{{EVENTS_PATH}}/src\/events\/handlers/g" "$OUTPUT"
sed -i.bak "s/{{CONFIG_PATH}}/config/g" "$OUTPUT"
sed -i.bak "s/{{RUNTIME}}/Node.js/g" "$OUTPUT"
sed -i.bak "s/{{CLOUD_PROVIDER}}/AWS/g" "$OUTPUT"
sed -i.bak "s/{{ORM}}/Prisma/g" "$OUTPUT"
sed -i.bak "s/{{TEST_FRAMEWORK}}/Jest/g" "$OUTPUT"
sed -i.bak "s/{{LINTER}}/ESLint/g" "$OUTPUT"
sed -i.bak "s/{{FORMATTER}}/Prettier/g" "$OUTPUT"
sed -i.bak "s/{{SOFT_DELETE_FIELD}}/active_indicator/g" "$OUTPUT"
sed -i.bak "s/{{CREATED_AT_FIELD}}/created_at/g" "$OUTPUT"
sed -i.bak "s/{{UPDATED_AT_FIELD}}/updated_at/g" "$OUTPUT"
sed -i.bak "s/{{ENTITY_1}}/Order/g" "$OUTPUT"
sed -i.bak "s/{{ENTITY_2}}/Product/g" "$OUTPUT"
sed -i.bak "s/{{LIFECYCLE_STATES}}/DRAFT → SUBMITTED → COMPLETED/g" "$OUTPUT"
sed -i.bak "s/{{CONTAINER_TOOL}}/Docker/g" "$OUTPUT"
sed -i.bak "s/{{CICD_TOOL}}/GitHub Actions/g" "$OUTPUT"
sed -i.bak "s|{{LINT_COMMAND}}|$PACKAGE_MANAGER run lint|g" "$OUTPUT"
sed -i.bak "s|{{COVERAGE_COMMAND}}|$PACKAGE_MANAGER run test:coverage|g" "$OUTPUT"
sed -i.bak "s/{{HANDLER_ENTRY_FILE}}/index.ts/g" "$OUTPUT"
sed -i.bak "s/{{REQUEST_SCHEMA_FILE}}/request.schema.json/g" "$OUTPUT"
sed -i.bak "s/{{RESPONSE_SCHEMA_FILE}}/response.schema.json/g" "$OUTPUT"
sed -i.bak "s/{{PROJECT_DESCRIPTION}}/REST API/g" "$OUTPUT"
sed -i.bak "s|{{REPOSITORY_URL}}|https://github.com/example/$PROJECT_NAME|g" "$OUTPUT"
sed -i.bak "s/{{INTERNAL_PREFIX}}/@myorg/g" "$OUTPUT"
sed -i.bak "s|{{REGISTRY_URL}}|https://npm.pkg.github.com|g" "$OUTPUT"

# Remove backup (macOS sed creates .bak)
rm -f "${OUTPUT}.bak"

echo ""
echo "Created $OUTPUT"
echo "Edit remaining placeholders and restart Cursor IDE."
