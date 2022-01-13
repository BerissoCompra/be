import express, { Application } from 'express';
import * as http from 'http';
import * as socketIo from 'socket.io';
import morgan from 'morgan';
import cors from 'cors';

import indexRoutes from './routes/indexRoutes';
import comerciosRoutes from './routes/comerciosRoutes';
import usersRoutes from './routes/usersRoutes';
import productosRoutes from './routes/productosRoutes';
import {connectDb} from './database';
import pedidosRoutes from './routes/pedidosRoutes';

const app =  express();
const server = http.createServer(app);
const io = new socketIo.Server(server);

connectDb();

//Config
app.set('port', process.env.PORT || 3000);
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}))

//Routes
app.use(indexRoutes);
app.use('/api/comercios',comerciosRoutes);
app.use('/api/catalogo',productosRoutes);
app.use('/api/pedidos',pedidosRoutes);
app.use('/api/auth',usersRoutes);

io.on('connection', (socket) => {
    const idHandShake = socket.id;
    const {comercioId} = socket.handshake.query;    
    socket.join(comercioId);

    socket.on('cliente', (res)=>{
        const data = res;
        socket.broadcast.to(comercioId).emit('cliente', data);
        console.log("EMMIT --------CLIENTE------------- ", comercioId)
    })

    socket.on('comercio', (res)=>{
        const data = res;
        socket.broadcast.to(comercioId).emit('comercio', data);
        console.log("EMMIT --------COMERCIO------------- ", comercioId)
    })
});
  

server.listen(app.get('port'), ()=>{
    console.log("Server on port - ", app.get('port'))
})


// class ServerClass {

//     public app: Application;

//     constructor()
//     {
//         this.app = express();
//         this.config();
//         this.routes();
//     }

//     config():void
//     {
//         //const server = this.server(this.app)
//         connectDb();
//         this.app.set('port', process.env.PORT || 3000);
//         this.app.use(morgan('dev'));
//         this.app.use(cors());
//         this.app.use(express.json());
//         this.app.use(express.urlencoded({extended: false}))
//     }

//     routes():void
//     {
//         this.app.use(indexRoutes);
//         this.app.use('/api/comercios',comerciosRoutes);
//         this.app.use('/api/catalogo',productosRoutes);
//         this.app.use('/api/pedidos',pedidosRoutes);
//         this.app.use('/api/auth',usersRoutes);
//     }

//     start():void{
//         this.app.listen(this.app.get('port'), ()=>{
//             console.log("Server on port - ", this.app.get('port'))
//         })
//     }
// }

// const server = new ServerClass();
// server.start();