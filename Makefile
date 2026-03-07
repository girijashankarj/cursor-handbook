# cursor-handbook Makefile
# Usage: make [target]

.PHONY: init setup verify help

help:
	@echo "cursor-handbook targets:"
	@echo "  make init    - One-command setup: copy handbook config to project.json"
	@echo "  make setup   - Alias for init"
	@echo "  make verify  - Run validation and component count check"

init: setup

setup:
	@if [ ! -f .cursor/config/project.json ]; then \
		if [ -f .cursor/config/project.json.handbook ]; then \
			cp .cursor/config/project.json.handbook .cursor/config/project.json; \
			echo "Created .cursor/config/project.json from handbook template."; \
		else \
			./scripts/init-project-config.sh; \
		fi; \
	else \
		echo ".cursor/config/project.json already exists. Edit it to customize."; \
	fi

verify:
	@./scripts/validate.sh 2>/dev/null || true
	@./scripts/generate-component-index.sh 2>/dev/null || echo "Run from project root with COMPONENT_INDEX.md present."
