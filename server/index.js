const express = require('express')
const cors = require('cors')
const tableRouter = require('./routes/table.routes')

const PORT = 5000;

const app = express();
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));
app.use('/api', tableRouter)

app.listen(PORT, () => console.log(`server started on PORT=${PORT}`))