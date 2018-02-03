var net=require('net');

var chatServer= net.createServer();
clientList=[];
chatServer.on('connection', function(client) {
    console.log("Server running");

    client.name=client.remoteAddress+':'+client.remotePort;
    client.write('Hi!'+client.name+'\n');
    console.log(client.name + " joined");
    clientList.push(client);
    client.on('data', function (data) {
        broadcast(data,client);
        
    });

    client.on('end', function(){
        console.log(client.name + " quit \n");
        broadcast("quit", client);
        clientList.splice(clientList.indexOf(client), 1);
    });
    client.on('error', function(e){
       console.log(e);
    });

});
function broadcast(message,client){

    for(var i=0;i<clientList.length;i+=1)
    {
        if(client!==clientList[i]) {
            if(clientList[i].writable) {
                clientList[i].write(client.name + " says " + message+"\n");

            }
            else
            {
                clientList[i].destroy();
                clientList.splice(clientList.indexOf(clientList[i]), 1);
            }

        }

    }
    client.write("Message Sent\n");
    console.log(client.name + " says " + message);
}
chatServer.listen(9000);
