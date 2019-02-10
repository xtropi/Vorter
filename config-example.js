// RENAME FILE TO --> config.js

let dbType = "postgresql" // or mongodb lul
let dbName = "databasename"
let dbAuthName = "login"
let dbAuthPass = "password"
let dbIPAddress = "localhost" 
let dbPort = "5433" 


let dbString = `${dbType}://${dbAuthName}:${dbAuthPass}@${dbIPAddress}:${dbPort}/${dbName}`

let config = {
    dbString: dbString
}

export default config