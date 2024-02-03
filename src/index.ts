import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.static(__dirname + '/../public'))

const server = http.createServer(app);
const io = new Server(server, {
    path: '/socket.io'
});

const clients: Array<any> = [];

io.on('connection', (client) => {
    console.log(`Client connected ${client.id}`);
    clients.push(client);

    client.on('disconnect', () => {
        clients.splice(clients.indexOf(client), 1);
        console.log(`Client disconnected ${client.id}`);
    });
});

const messages: Array<any> = [];

app.post('/send', (req, res) => {
    const id = req.query.id || '';
    const msg = req.query.msg || '';

    const message = {
        id: id,
        msg: msg,
    };

    messages.push(message);

    for (const client of clients) {
        client.emit('msg', msg);
    }
    
    res.json({
        ok: true,
    });
});

app.get('/msg', (req, res) => {
    res.json(messages);
});

server.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
})