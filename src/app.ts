import express from 'express'

const app = express()
const PORT = 3000 //probably bestto be in a .env file
app.listen(PORT, () => console.log(`Server running on ${PORT}`))
