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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const routes_1 = __importDefault(require("./api/routes"));
const error_1 = require("./mw/error");
const helmet_1 = __importDefault(require("helmet"));
const create_1 = __importDefault(require("./db/create"));
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
exports.server = app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () { return yield (0, create_1.default)(); }));
const cookieP_1 = __importDefault(require("./functions/cookieP"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const socketio_1 = require("./socket/socketio");
let sessions = [];
const findU = (si) => { var _a; return (_a = sessions.find((s) => s.socketid == si)) === null || _a === void 0 ? void 0 : _a.userid; };
socketio_1.io.use((socket, next) => {
    const cookies = (0, cookieP_1.default)(socket.handshake.headers.cookie || "");
    const token = cookies.token;
    try {
        const { id } = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "");
        sessions.push({ userid: id, socketid: socket.id });
        next();
    }
    catch (error) {
        next(new Error("Error"));
    }
});
socketio_1.io.on("connection", (socket) => {
    socket.on("chat message", (data) => {
        console.log("chat");
        socket.emit("chat message", data);
    });
    socket.on("disconnect", () => {
        console.log("disconnect");
        sessions = sessions.filter((s) => s.socketid != socket.id);
    });
});
app.use(express_1.default.static(__dirname.replace("\\dist", "") + "\\client\\dist"));
app.use(express_1.default.json({ limit: "60mb" }));
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use((0, helmet_1.default)());
app.get("/sessions", (req, res) => {
    res.json(sessions);
});
app.use("/api", routes_1.default);
app.get("*", (req, res) => {
    res.sendFile(__dirname.replace("\\dist", "") + "\\client\\dist");
});
app.use(error_1.errorHandler);
app.use(error_1.routeNotFound);