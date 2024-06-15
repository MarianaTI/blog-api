import app from "./app.js";
import { port } from "./config.js";
import { connectToDb } from "./db.js";

async function main(){
    await connectToDb();

    // para mandar el puerto de configuración
    app.listen(port);

    console.log('Server on port: ', port);
    console.log('http://localhost:3000/');
}

main();