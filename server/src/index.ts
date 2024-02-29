import express, { Application, Request, Response } from 'express'
import dotenv from 'dotenv'


dotenv.config()
const app: Application = express();
const port = process.env.PORT || 3001;


app.use(express.json())

app.get('/api', (req: Request, res: Response) => {
    res.send("Welcome to the world of Arduino with Node.js installed")
})


app.post('/api', (req: Request, res: Response) => { 
    console.log(req.body);
    res.send("Thanks for the patience of Arduino")
})

app.listen(port, () => { 
    console.log(`[server]: Server is running at ${port}`)
})

export default app