app.factory('socket',function(socketFactory){
    //Create socket and connect to http://localhost:3000/
    //'http://chat.socket.io'
    //http://162.243.225.225:3002/
    //http://77.68.8.22
    var myIoSocket = io('https://77.68.8.22:3001/', {'origins':'*:*'});
    
    //console.log(myIoSocket);
    

    mySocket = socketFactory({
        ioSocket: myIoSocket
    });

    return mySocket;
})
