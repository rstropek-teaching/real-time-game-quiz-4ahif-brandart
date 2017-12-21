declare const io: SocketIOStatic;

$(function() {   

    const socket = io();
    $('#right').click(function () {
        $('#footer').animate({
            'marginLeft': "+=30px" //moves right
        });
        socket.emit('moveBar', 30);
        //widht: -17
    });

    $('#left').click(function () {
        $('#footer').animate({
            'marginLeft': "-=30px" //moves left
        });
        socket.emit('moveBar', -30);
    });

    socket.on("moveBar", function(index){
        $('#top').animate({
            'marginLeft': "+=" + index + "px"
        });
    });
});