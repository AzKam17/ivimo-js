module.exports = {
  apps: [{
    name: "typesense-sync-properties",
    script: "./scripts/property-sync-worker.ts",
    interpreter: "bun",
    watch: false,
    autorestart: true,
    restart_delay: 5000,
    max_memory_restart: "200M",
    log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    env: {
      NODE_ENV: "production",
    },
    dotenv_path: "../.env"
  }]
};