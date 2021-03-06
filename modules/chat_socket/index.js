const util = require("util");
let socketio = require('socket.io')

module.exports.listen = function(server){
    let io = socketio.listen(server)

    // ------------------------------ Traitement du socket
    let objUtilisateur = {}
    io.on('connection', function(socket){
    console.log(socket.id)
    	// ------------------------------ Traitement des Users
    	socket.on('setUser', function(data){
    		objUtilisateur[socket.id] = data.user;
    		console.log('objUtilisateur = ' + util.inspect(objUtilisateur));
    		console.log('data nouveau user = ' + util.inspect(data));
    		socket.emit('valide_user', data);
    		io.sockets.emit('diffuser_list_user', objUtilisateur);
    	});
    	// ------------------------------ Traitement des messages
    	socket.on('setMessage', function(data){
    		data.user = objUtilisateur[socket.id];
    		console.log('message recu = ' + util.inspect(data));
    		socket.broadcast.emit('diffuser_message', data); // envoyer à tout le monde sauf lui même
    		socket.emit('valide_message', data);
    	});
    	socket.on('disconnect', function(data){
    		delete objUtilisateur[socket.id];
    		console.log('deconnexion!');
    		io.sockets.emit('diffuser_list_user', objUtilisateur); // envoyer à tout le monde
    	});
	});

	return io;
}