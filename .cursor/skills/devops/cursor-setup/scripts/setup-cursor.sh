#!/bin/bash
# cursor-handbook Quick Setup Script
# Downloads and configures cursor-handbook for your project

set -e

REPO_URL="${CURSOR_CONFIG_REPO:-https://github.com/girijashankarj/cursor-handbook.git}"
CURSOR_DIR=".cursor"
BACKUP_SUFFIX=$(date +%Y%m%d%H%M%S)

echo "================================================"
echo "  cursor-handbook Setup"
echo "================================================"
echo ""

# Check prerequisites
if ! command -v git &> /dev/null; then
    echo "Error: git is not installed. Please install git first."
    exit 1
fi

# Check if .cursor already exists
if [ -d "$CURSOR_DIR" ]; then
    echo "Warning: $CURSOR_DIR directory already exists."
    read -p "Back up and replace? (y/N): " confirm
    if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
        echo "Backing up to ${CURSOR_DIR}.backup.${BACKUP_SUFFIX}..."
        mv "$CURSOR_DIR" "${CURSOR_DIR}.backup.${BACKUP_SUFFIX}"
    else
        echo "Aborted. Existing .cursor directory left unchanged."
        exit 0
    fi
fi

# Clone repository
echo ""
echo "Cloning cursor-handbook..."
git clone "$REPO_URL" "$CURSOR_DIR"

# Create project configuration from template
if [ -f "$CURSOR_DIR/config/project.json.template" ]; then
    cp "$CURSOR_DIR/config/project.json.template" "$CURSOR_DIR/config/project.json"
    echo "Created project.json from template."
fi

# Make hook scripts executable
if [ -d "$CURSOR_DIR/hooks" ]; then
    chmod +x "$CURSOR_DIR/hooks/"*.sh 2>/dev/null || true
    echo "Made hook scripts executable."
fi

echo ""
echo "================================================"
echo "  Setup Complete!"
echo "================================================"
echo ""
echo "Next steps:"
echo "  1. Edit .cursor/config/project.json"
echo "     - Set your project name, tech stack, and paths"
echo "     - Replace all {{PLACEHOLDER}} values"
echo "  2. Restart Cursor IDE"
echo "  3. Try /type-check to verify the setup"
echo ""
echo "Useful commands:"
echo "  /type-check       - Run type checking"
echo "  /code-reviewer    - Start a code review"
echo "  /test-single      - Test a single file"
echo "  /check-secrets    - Scan for leaked secrets"
echo ""
echo "Documentation: docs/getting-started/quick-start.md"
echo "================================================"
