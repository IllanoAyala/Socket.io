const socket = io('http://localhost:3000');

document.addEventListener('DOMContentLoaded', () => {

    socket.on('msg', (msg) => {
        const li = document.createElement('li');
        li.textContent = msg;
        document.querySelector('ul').appendChild(li);
    });

    document.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();

        const msg = {
            id: socket.id,
            msg: e.target.msg.value
        };

        console.log(JSON.stringify(msg));

        fetch(`/send?id=${msg.id}&msg=${msg.msg}`, {
            method: 'POST'               
        })
        .then(response => response.json())
        .catch(error => console.error('Erro:', error));

        e.target.msg.value = '';
    });

    
});
        