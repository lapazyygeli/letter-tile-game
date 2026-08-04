import dotenv from 'dotenv'

// This process.env.APP_MODE is obtained from the npm run command,
// dotenv config just loads the new variables from the .env file to process.env.
const APP_MODE = process.env.APP_MODE || 'development'
dotenv.config({ path: `.env.${APP_MODE}` })
