// Check for required environment variables
import * as dotenv from 'dotenv' 
dotenv.config()

const requiredVariables = [
  'DISCORD_CLIENT_SECRET',
  'DISCORD_CLIENT_ID',
  'DISCORD_SERVER_ID',
  'DISCORD_CHANNEL_ID',
  'OPENAI_API_KEY'
]

const missingVariables = requiredVariables.filter(variable => {
  if (!process.env[variable]) {
    console.error(`ERROR: ${variable} is not set`)
    return true
  }
})

if (missingVariables.length > 0) {
  console.error('One or more required environment variables are not set')
  process.exit(1)
}