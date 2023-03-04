import * as dotenv from 'dotenv' 
dotenv.config()

const TOKEN = process.env.DISCORD_BOT_TOKEN || '';
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || '';
const CLIENT_ID = process.env.DISCORD_CLIENT_ID || '';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const DEV = process.env.NODE_ENV != 'production'

export { TOKEN, CLIENT_SECRET, CLIENT_ID, OPENAI_API_KEY, DEV }
