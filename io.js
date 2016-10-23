'use strict';

const socket = require('socket.io');
const io = socket.listen();
const Immutable = require('immutable');
const Map = Immutable.Map;
const List = Immutable.List;

var chessGames = Map();


// connection creates a socket connection
  // @start - creates a token valied for 3 minutes with a unique id for creator
  // @join - creates a room for the game and distinguishes whose which color
  // @clock-run - creates a steady clock for users
  // @new-move 
  // @send-message
  // @resign
  // @rematch-offer 
  // @rematch-decline 
  // @rematch-accept
  // @disconnect 

io.sockets.on('connection', socket => {
  
  socket.on('start', data => {
    let token;
    const b = new Buffer(Math.random() + new Date().getTime() + socket.id);
    token = b.toString('base64').slice(12, 28);

    // token is valid for 3 minutes
    const timeout = setTimeout(() => {
      if (chessGames.getIn([token, 'players']).isEmpty()) {
        chessGames = chessGames.delete(token);
        socket.emit('token-expired');
      }
    }, 3 * 60 * 1000);

    chessGames = chessGames.set(token, Map({
      creator: socket,
      players: List(),
      interval: null,
      timeout: timeout
    }));

    socket.emit('created', {token: token});
  });

  socket.on('join', data => {
    const game = chessGames.get(data.token);

    if (!game) {
      socket.emit('token-invalid');
      return;
    }

    const nOfPlayers = game.get('players').size;
    const colors = ['black', 'white'];
    let color;

    clearTimeout(game.get('timeout'));

    if (nOfPlayers >= 2) {
      socket.emit('full');
      return;
    } else if (nOfPlayers === 1) {
      if (game.getIn(['players', 0, 'color']) === 'black')
        color = 'white';
      else
        color = 'black';

    } else {
      color = colors[Math.floor(Math.random() * 2)];
    }

    // join room
    socket.join(data.token);

    chessGames = chessGames.updateIn([data.token, 'players'], players =>
      players.push(Map({
        socket: socket,
        color: color,
        time: data.time - data.inc + 1,
        inc: data.inc
      })));

    game.get('creator').emit('ready');
    socket.emit('joined', {color: color});

    if (nOfPlayers === 1) {
      io.to(data.token).emit('both-joined');
    }
  });

  socket.on('clock-run', data => runClock(data.color, data.token, socket));

  socket.on('new-move', data => {
    maybeEmit('move', data.move, data.token, socket);
    if (data.move.gameOver) {
      clearInterval(chessGames.getIn([data.token, 'interval']));
    }
  });

  socket.on('send-message', data =>
    maybeEmit('receive-message', data, data.token, socket));

  socket.on('resign', data => {
    if (!chessGames.has(data.token)) return;
    clearInterval(chessGames.getIn([data.token, 'interval']));

    io.to(data.token).emit('player-resigned', {
      color: data.color
    });
  });

  socket.on('rematch-offer', data =>
    maybeEmit('rematch-offered', {}, data.token, socket));

  socket.on('rematch-decline', data =>
    maybeEmit('rematch-declined', {}, data.token, socket));

  socket.on('rematch-accept', data => {
    if (!chessGames.has(data.token)) return;

    chessGames = chessGames.updateIn([data.token, 'players'], players =>
      players.map(player => player
        .set('time', data.time - data.inc + 1)
        .set('inc', data.inc)
        .update('color', color => color === 'black' ? 'white' : 'black')));

    io.to(data.token).emit('rematch-accepted');
  });

  socket.on('disconnect', () => {
    const token = findToken(socket);

    if (!token) return;

    maybeEmit('opponent-disconnected', {}, token, socket);
    clearInterval(chessGames.getIn([token, 'interval']));
    chessGames = chessGames.delete(token);
  });

});

function maybeEmit(event, data, token, socket) {
  if (!chessGames.has(token)) return;

  const opponent = getOpponent(token, socket);
  if (opponent) {
    opponent.get('socket').emit(event, data);
  }
}

function findToken(socket) {
  return chessGames.findKey((game, token) =>
    game.get('players').some(player => player.get('socket') === socket));
}

function runClock(color, token, socket) {
  if (!chessGames.has(token)) return;

  chessGames.getIn([token, 'players']).forEach((player, idx) => {
    if (player.get('socket') === socket && player.get('color') === color) {
      clearInterval(chessGames.getIn([token, 'interval']));
      
      chessGames = chessGames
        .updateIn([token, 'players', idx, 'time'], time =>
          time += player.get('inc'))
        .setIn([token, 'interval'], setInterval(() => {
          let timeLeft = 0;
          chessGames = chessGames.updateIn([token, 'players', idx, 'time'], time => {
            timeLeft = time - 1;
            return time - 1;
          });

          if (timeLeft >= 0) {
            io.to(token).emit('countdown', {
              time: timeLeft,
              color: color
            });
          } else {
            io.to(token).emit('countdown-gameover', {
              color: color
            });
            clearInterval(chessGames.getIn([token, 'interval']));
          }
        }, 1000));

      return false;
    }
  });
}

function getOpponent(token, socket) {
  let index = null;

  chessGames.getIn([token, 'players']).forEach((player, idx) => {
    if (player.get('socket') === socket) {
      index = Math.abs(idx - 1);

      return false;
    }
  });

  if (index !== null) {
    return chessGames.getIn([token, 'players', index]);
  }
}

module.exports = {
  io: io
};