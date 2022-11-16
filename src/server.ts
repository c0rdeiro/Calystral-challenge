import app from '.'

const PORT = 3000 //should be in the .env file, here for simplicity
app.listen(PORT, () => console.log(`Server running on ${PORT}`))
