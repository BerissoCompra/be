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
import path from 'path';
import imagesRoutes from './routes/imagesRoutes';
import publicidadRoutes from './routes/publicidadRoutes';
import categoriasRoutest from './routes/categoriasRoutes';


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
app.use('/api/images',imagesRoutes);
app.use('/api/catalogo',productosRoutes);
app.use('/api/pedidos',pedidosRoutes);
app.use('/api/auth',usersRoutes);
app.use('/api/publicidad',publicidadRoutes);
app.use('/api/categorias',categoriasRoutest);
app.use('/uploads', express.static(path.resolve('uploads')));

io.on('connection', (socket) => {
    const {comercioId} = socket.handshake.query;    

    socket.join(comercioId as string);

    socket.on('cliente', (res)=>{
        const data = res;
        socket.emit('cliente', data);
        console.log("EMMIT --------CLIENTE------------- ", comercioId)
    })

    socket.on('comercio', (res)=>{
        const data = res;
        socket.emit('comercio', data);
        console.log("EMMIT --------COMERCIO------------- ", comercioId)
    })
});
  

server.listen(app.get('port'), ()=>{
    console.log("Server on port - ", app.get('port'))
})



