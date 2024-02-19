import express, { Application, Request, Response } from 'express'
import dotenv from 'dotenv'


dotenv.config()
const app: Application = express();
const port = process.env.PORT || 3001;


app.use(express.json())

app.get('/api', (req: Request, res: Response) => {
    console.log('YAY!')
    res.send("Welcome to the world of Arduino with Node.js installed")
})

app.listen(port, () => { 
    console.log(`[server]: Server is running at {port}`)
})

export default app