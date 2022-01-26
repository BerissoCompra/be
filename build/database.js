"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDb = void 0;
const mongoose_1 = require("mongoose");
function connectDb() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const db = yield mongoose_1.connect("mongodb+srv://berissoCompra:159753-Bc@mcdarg.nlxws.mongodb.net/MCDArg?retryWrites=true&w=majority");
            console.log("db connected", db.connection.name);
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.connectDb = connectDb;
