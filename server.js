import express from 'express'
import path from 'path'
import {Client, Pool} from 'pg'
import config from './config'


const db = new Pool({
    connectionString: config.dbString,
  });

db.connect()
  .then(() => console.log('PostgreSQL connected.'))
  .catch(e => console.error('Connection error.', err.stack));

const app = express()
let port = 80

// access to public folder
app.use(express.static(path.join(__dirname, 'public')))

// getting some server variables
app.get('/getServerData', function(req, res){
    let bus = {
        field1: "Data1 from app",
        field2: "Data2 from app"
    }
    res.send(bus)
})

// getting database time
app.get('/getDBData', function(req, res){
  db.query(`SELECT NOW()`, (err, result) => {
    if (err){
      console.log(err);
    } else {
      if (result.rows[0]) {
        res.send(result.rows[0])
      }
    }
  })
})

let server = app.listen(port,()=>{
    console.log(`app is running on port ${port}`)
})