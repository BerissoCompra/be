import express, { Application } from 'express';
import * as http from 'http';
import * as socketIo from 'socket.io';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';

import indexRoutes from './routes/indexRoutes';
import comerciosRoutes from './routes/comerciosRoutes';
import usersRoutes from './routes/usersRoutes';
import productosRoutes from './routes/productosRoutes';
import { connectDb } from './database';
import pedidosRoutes from './routes/pedidosRoutes';
import path from 'path';
import imagesRoutes from './routes/imagesRoutes';
import publicidadRoutes from './routes/publicidadRoutes';
import categoriasRoutest from './routes/categoriasRoutes';
import serviciosRoutes from './routes/serviciosRoutes';
import { CLEARDB, InitialSetup } from './config/scripts-db';

const app = express();
const server = http.createServer(app);
const io = new socketIo.Server(server, { cors: { origin: '*' } });

//Db config
connectDb();
InitialSetup();

//Config
app.set('port', process.env.PORT || 3000);
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));

//Routes
app.use(indexRoutes);
app.use('/api/comercios', comerciosRoutes);
app.use('/api/images', imagesRoutes);
app.use('/api/catalogo', productosRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/auth', usersRoutes);
app.use('/api/publicidad', publicidadRoutes);
app.use('/api/categorias', categoriasRoutest);
app.use('/api/servicios', serviciosRoutes);
app.use('/uploads', express.static(path.resolve('uploads')));

let userConnected = new Map();

io.on('connection', (socket) => {
  const { comercioId } = socket.handshake.query;
  socket.join(comercioId as string);
  addUser(comercioId, socket.id);

  socket.on('cliente', (res) => {
    socket.broadcast.emit('cliente', res);
    console.log('EMMIT --------CLIENTE------------- ', comercioId);
  });

  socket.on('comercio', (res) => {
    socket.broadcast.emit('comercio', res);
    console.log('EMMIT --------COMERCIO------------- ', comercioId);
  });

  socket.on('disconnect', (reason) => {
    removeUser(comercioId, socket.id);
  });
});

const addUser = (comercioId: any, id: any) => {
  if (!userConnected.has(comercioId)) {
    userConnected.set(comercioId, new Set(id));
  } else {
    userConnected.get(comercioId).add(id);
  }
};

const removeUser = (comercioId: any, id: any) => {
  if (userConnected.has(comercioId)) {
    let userIds = userConnected.get(comercioId);
    if (userIds.size == 0) {
      userConnected.delete(comercioId);
    }
  }
};

server.listen(app.get('port'), () => {
  console.log('Server on port - ', app.get('port'));
});
