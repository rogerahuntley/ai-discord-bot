import dotenv from 'dotenv' 
dotenv.config()

// Check for required environment variables
const requiredVariables = [
  'DISCORD_BOT_TOKEN',
  'DISCORD_CLIENT_SECRET',
  'DISCORD_CLIENT_ID',
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