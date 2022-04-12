const fs = require('fs')
const readline = require('readline');


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Ambiente QA | DEVELOPMENT? ', (answer) => {
    
    let ambiente = `${answer == 'QA' ? answer : 'Development'}`;
    let configuracion = '';

    if(answer === 'QA'){
        configuracion = `
export const Config = {
    baseUrl: 'http://ec2-44-201-231-118.compute-1.amazonaws.com:3000',
    frontUrl: 'http://mcdsoftwares.com',
}
        `
    }
    else{
        configuracion = `
export const Config = {
baseUrl: 'http://localhost:3000',
frontUrl: 'http://localhost:4200',
}
        `
    }
    
    // write to a new file named 2pac.txt
    fs.writeFile('./src/config/api.config.ts', configuracion, (err) => {
        // throws an error, you could also catch it here
        if (err) throw err;
        // success case, the file was saved
        console.log('Archivo guardado');
    });

    rl.close();
});




