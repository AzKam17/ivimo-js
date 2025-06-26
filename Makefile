# Makefile for PM2 Process Management

.PHONY: create-module

# Makefile for Project Management

.PHONY: create-module help

# Create a new module with all necessary subfolders
create-module:
	@read -p "Enter module name: " MODULE_NAME; \
	echo "Creating module: $$MODULE_NAME"; \
	MODULE_PATH="src/modules/$$MODULE_NAME"; \
	mkdir -p "$$MODULE_PATH"; \
	mkdir -p "$$MODULE_PATH/infrastructure/controllers"; \
	mkdir -p "$$MODULE_PATH/infrastructure/entities"; \
	mkdir -p "$$MODULE_PATH/infrastructure/repositories"; \
	mkdir -p "$$MODULE_PATH/infrastructure/services"; \
	mkdir -p "$$MODULE_PATH/interface/commands"; \
	mkdir -p "$$MODULE_PATH/interface/dtos"; \
	mkdir -p "$$MODULE_PATH/interface/queries"; \
	mkdir -p "$$MODULE_PATH/interface/responses"; \
	mkdir -p "$$MODULE_PATH/plugins"; \
	touch "$$MODULE_PATH/index.ts"; \
	touch "$$MODULE_PATH/routes.ts"; \
	touch "$$MODULE_PATH/plugins/index.ts"; \
	echo "import { Elysia } from 'elysia';\n\nexport const $${MODULE_NAME}Routes = new Elysia({ name: '$${MODULE_NAME}' })\n  // Add your routes here\n  .get('/', () => 'Hello from $${MODULE_NAME} module');" > "$$MODULE_PATH/routes.ts"; \
	echo "export * from './routes';" > "$$MODULE_PATH/index.ts"; \
	echo "Module $$MODULE_NAME created successfully with all required folders and basic files."

# Show help
help:
	@echo "Available commands:"
	@echo "  make create-module - Create a new module with all required folders"
	@echo "  make help         - Show this help message"

# Default target
.DEFAULT_GOAL := help
