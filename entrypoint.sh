#!/bin/bash

set -e

# Check environment variables
if node /app/checkEnvironment.js; then
  # Register the bot with the Discord API
  npm run register

  # Start the application with PM2
  pm2 start /app/index.js --name steal-dog-discord-bot

  # Use the `pm2 logs` command to stream the logs of the PM2 process to the container logs
  pm2 logs
else
  # Exit the script with an error code if environment variables are missing
  exit 1
fi