
const readline = require('readline');
const scrDb = require('./build/config/scripts-db');
const db = require('./build/database')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Action? ', async(answer) => {
    
    if(answer === 'clsdb'){
        db.connectDb();
        await scrDb.CLEARDB();
    }
    
    rl.close();
});


