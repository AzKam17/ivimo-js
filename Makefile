# Makefile for PM2 Process Management

.PHONY: pm2-start pm2-stop pm2-restart pm2-status pm2-logs pm2-monit pm2-save pm2-startup pm2-help create-module

# Start the PM2 process
pm2-start:
	source ~/.bashrc || source ~/.profile || source ~/.bash_profile || true
	pm2 start pm2.config.js

# Stop the PM2 process
pm2-stop:
	source ~/.bashrc || source ~/.profile || source ~/.bash_profile || true
	pm2 stop typesense-sync-properties

# Restart the PM2 process
pm2-restart:
	source ~/.bashrc || source ~/.profile || source ~/.bash_profile || true
	pm2 restart typesense-sync-properties

# Check the status of the PM2 process
pm2-status:
	source ~/.bashrc || source ~/.profile || source ~/.bash_profile || true
	pm2 list

# View the logs of the PM2 process
pm2-logs:
	source ~/.bashrc || source ~/.profile || source ~/.bash_profile || true
	pm2 logs typesense-sync-properties

# Monitor the PM2 process
pm2-monit:
	source ~/.bashrc || source ~/.profile || source ~/.bash_profile || true
	pm2 monit

# Save the current PM2 process list
pm2-save:
	source ~/.bashrc || source ~/.profile || source ~/.bash_profile || true
	pm2 save

# Setup PM2 to start on system boot
pm2-startup:
	source ~/.bashrc || source ~/.profile || source ~/.bash_profile || true
	pm2 startup
	@echo "Run the command above to setup PM2 to start on system boot"

# Delete the PM2 process
pm2-delete:
	source ~/.bashrc || source ~/.profile || source ~/.bash_profile || true
	pm2 delete typesense-sync-properties

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
pm2-help:
	@echo "Available commands:"
	@echo "  make pm2-start    - Start the PM2 process"
	@echo "  make pm2-stop     - Stop the PM2 process"
	@echo "  make pm2-restart  - Restart the PM2 process"
	@echo "  make pm2-status   - Check the status of the PM2 process"
	@echo "  make pm2-logs     - View the logs of the PM2 process"
	@echo "  make pm2-monit    - Monitor the PM2 process"
	@echo "  make pm2-save     - Save the current PM2 process list"
	@echo "  make pm2-startup  - Setup PM2 to start on system boot"
	@echo "  make pm2-delete   - Delete the PM2 process"
	@echo "  make create-module - Create a new module with all required folders"
	@echo "  make pm2-help     - Show this help message"

# Default target
.DEFAULT_GOAL := pm2-help