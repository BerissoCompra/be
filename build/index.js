"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http = __importStar(require("http"));
const socketIo = __importStar(require("socket.io"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const indexRoutes_1 = __importDefault(require("./routes/indexRoutes"));
const comerciosRoutes_1 = __importDefault(require("./routes/comerciosRoutes"));
const usersRoutes_1 = __importDefault(require("./routes/usersRoutes"));
const productosRoutes_1 = __importDefault(require("./routes/productosRoutes"));
const database_1 = require("./database");
const pedidosRoutes_1 = __importDefault(require("./routes/pedidosRoutes"));
const app = express_1.default();
const server = http.createServer(app);
const io = new socketIo.Server(server);
database_1.connectDb();
//Config
app.set('port', process.env.PORT || 3000);
app.use(morgan_1.default('dev'));
app.use(cors_1.default());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
//Routes
app.use(indexRoutes_1.default);
app.use('/api/comercios', comerciosRoutes_1.default);
app.use('/api/catalogo', productosRoutes_1.default);
app.use('/api/pedidos', pedidosRoutes_1.default);
app.use('/api/auth', usersRoutes_1.default);
io.on('connection', (socket) => {
    const idHandShake = socket.id;
    const { comercioId } = socket.handshake.query;
    socket.join(comercioId);
    socket.on('cliente', (res) => {
        const data = res;
        socket.broadcast.to(comercioId).emit('cliente', data);
        console.log("EMMIT --------CLIENTE------------- ", comercioId);
    });
    socket.on('comercio', (res) => {
        const data = res;
        socket.broadcast.to(comercioId).emit('comercio', data);
        console.log("EMMIT --------COMERCIO------------- ", comercioId);
    });
});
server.listen(app.get('port'), () => {
    console.log("Server on port - ", app.get('port'));
});
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
