var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
$(function () {
    let x = 0;
    let username;
    let started = false;
    $('#Game').hide();
    $('#scorePage').hide();
    const socket = io();
    //connecting
    $('#sendUsername').click(function () {
        return __awaiter(this, void 0, void 0, function* () {
            if (!$('#username').val()) {
                alert("Parameters missing!");
            }
            else {
                let selector = {
                    "selector": {
                        "name": { "$eq": $('#username').val() },
                    },
                    "fields": ["name"]
                };
                let data = yield doPost(selector, "http://127.0.0.1:5984/pong/_find");
                if (data.docs[0] != undefined) {
                    alert("already");
                }
                else {
                    let newUser = {
                        "name": $('#username').val(),
                        "score": 0
                    };
                    let dataPost = doPost(newUser, "http://127.0.0.1:5984/pong/");
                    if (dataPost != undefined) {
                        alert("User created");
                    }
                }
                socket.emit('userConnect');
            }
        });
    });
    //moving the bars
    $(this).on("click", function (e) {
        //game started?
        if (started) {
            //right or left side of the page
            if ($('#score').data('score') == false) {
                if (e.pageX > ($(window).innerWidth() / 2)) {
                    //check if the bar will go outside the document
                    x += 30;
                    $('#myBar').attr("transform", "translate(" + x + ",0)");
                }
                else {
                    x -= 30;
                    $('#myBar').attr("transform", "translate(" + x + ",0)");
                }
                socket.emit('moveBar', -x);
            }
            $("#score").data('score', false);
        }
    });
    //load score
    function loadScore() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch("http://localhost:5984/pong/_all_docs");
            const result = yield response.json();
            let html = '';
            for (const entry of result.rows) {
                const responseEntry = yield fetch("http://localhost:5984/pong/" + entry.id);
                const resultEntry = yield responseEntry.json();
                html += `<tr><td>${resultEntry.name}</td>`;
                html += `<td>${resultEntry.score}</td></tr>`;
            }
            $('#tableScore')[0].innerHTML += html;
        });
    }
    //hide game div, show scorepage
    $("#score").on("click", function (e) {
        $("#score").data('score', true);
        $('#Game').hide();
        loadScore();
        $('#scorePage').show();
    });
    //hide score div, show game div
    $("#closeScore").on("click", function (e) {
        $('#scorePage').hide();
        $('#Game').show();
    });
    //Post function for my couchDB
    function doPost(object, searchUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                $.ajax({
                    type: "POST",
                    url: searchUrl,
                    contentType: "application/JSON",
                    data: JSON.stringify(object),
                    dataType: "json",
                    async: false,
                    success: function (data) {
                        resolve(data);
                    }
                });
            });
        });
    }
    //moving the enemybar, reacting on server
    socket.on("moveBar", function (index) {
        $('#enemyBar').attr("transform", "translate(" + index + ",0)");
    });
    //hide login div, show game div
    socket.on("startGame", function () {
        started = true;
        $('#login').hide();
        $('#Game').show();
    });
    //message, when already 2 users are playing
    socket.on("alreadyPlaying", function (message) {
        window.alert(message);
    });
    //not implemented now
    socket.on("startBall", function (message) {
        setInterval(ballMove(), 500);
    });
    socket.on("moveBall", function (message) {
    });
    function ballMove() {
    }
});
