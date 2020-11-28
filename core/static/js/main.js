var song = null;
var idPlayer = null;
var iconList = null;
var iconGeneric = null;
var totalTable = null;
var totalTable_full = null;
var currentSongIndex = null;
var repeatSame = null;
var randomSong = null;
var token = null;
var firstTime = true;
var ref = null;
var popup = null;
var visible = null;

function PlayPause(id) {
    if (song == null || idPlayer == id) { // If song is null is a new song. If the id is the same just pause
        idPlayer = id;
        for (let i = 0; i < totalTable.length; i++) {
            if (totalTable[i].id == idPlayer) {
                currentSongIndex = i;
                break;
            }
        }
        songVue.songString = document.getElementById(id + "NameLabel").textContent;
        songVue.url = $(document.getElementById(id)).attr("url");;
        $("#caratula").show();
        var mydata = { cancion: songVue.songString };

        song = document.getElementById(id + "audioPlayer"); // Store data
        iconList = document.getElementById(id + "Icon");
        iconGeneric = document.getElementById("genericPlayer");
        try {
            if (iconList.className == "far fa-play-circle") {
                iconList.className = "far fa-pause-circle";
                iconGeneric.className = "far fa-pause-circle";
                if (firstTime) {
                    $.ajax({
                        type: "POST",
                        url: "/api/cancionEscuchada",
                        headers: { 'X-CSRFToken': token },
                        data: JSON.stringify(mydata),
                        contentType: 'application/json; charset=utf-8',
                        dataType: "json"
                    })
                        .done(function (data, textStatus, jqXHR) {
                            if (console && console.log) {
                                console.log("La solicitud se ha completado correctamente.");
                                console.log(data);
                            }
                        })
                        .fail(function (jqXHR, textStatus, errorThrown) {
                            if (console && console.log) {
                                console.log("La solicitud a fallado: " + textStatus);
                            }
                        });
                }
                firstTime = false
                song.play();
                song.volume = 0.2;
            } else if (iconList.className == "far fa-pause-circle") {
                iconList.className = "far fa-play-circle";
                iconGeneric.className = "far fa-play-circle";
                song.pause()
            }

        } catch (error) {
            console.log(error);
        }
    } else {
        song.pause()                                        // Pause the current playing song
        song.currentTime = 0;                               // Resets the song
        iconList.className = "far fa-play-circle";          // Edit the CSS to make sense
        iconGeneric.className = "far fa-play-circle";       //
        song = document.getElementById(id + "audioPlayer"); // Update the song player
        idPlayer = id;                                      // Update the id of the player
        firstTime = true                                    // POST the server about a new song being played
        PlayPause(id);                                      // Restart the func
    }
}
function genericPlayPause() {
    if (song.paused) {
        song.play();
        iconList.className = "far fa-pause-circle";
        iconGeneric.className = "far fa-pause-circle";
    } else {
        song.pause();
        iconList.className = "far fa-play-circle";
        iconGeneric.className = "far fa-play-circle";
    }
}
function nextSong(selector) {
    if (selector == 1) { // Next song. If it is the ending song just jump to the first one
        if (currentSongIndex == (totalTable.length - 1)) {
            PlayPause(totalTable[0].id);
        } else {
            PlayPause(totalTable[currentSongIndex + 1].id);
        }
    } else if (selector == 0) { // Repeat same song
        PlayPause(totalTable[currentSongIndex].id);
    } else if (selector == -1) { // Minus one song. Jump to a random one if it is the first one
        if (currentSongIndex == 0) {
            let random = Math.random() * (totalTable.length - 1);
            PlayPause(totalTable[Math.round(random)].id)
        } else {
            PlayPause(totalTable[currentSongIndex - 1].id);
        }
    } else if (selector == 2) {
        let random = Math.random() * (totalTable.length - 1);
        PlayPause(totalTable[Math.round(random)].id)
    }
}
function updateProgressValue() {
    if (song != null) {
        var percent = (song.currentTime * 100) / song.duration;
        // console.log("Duración: " + song.duration + "\n Current: " + song.currentTime + "\n(Current*100/duracion): " + percent + "%");
        $('.progress-bar').css('width', percent + '%').attr('aria-valuenow', percent);
        if (song.currentTime == song.duration) {
            iconList.className = "far fa-play-circle";
            iconGeneric.className = "far fa-play-circle";
            if (repeatSame) {
                nextSong(0);
            } else if (randomSong) {
                nextSong(2);
            } else {
                nextSong(1);
            }

        }
    }
};
function repeat() {
    var repeatIcon = $("#repeat");
    if (repeatIcon.hasClass("fa-spin")) {
        repeatIcon.removeClass("fa-spin");
        repeatIcon.removeClass("onRepeat");
        repeatSame = false;
    } else {
        repeatIcon.addClass("fa-spin");
        repeatIcon.addClass("onRepeat");
        repeatSame = true;
    }
}
function random() {
    var repeatIcon = $("#random");
    if (repeatIcon.hasClass("onRandom")) {
        repeatIcon.removeClass("onRandom");
        randomSong = false;
    } else {
        repeatIcon.addClass("onRandom");
        randomSong = true;
    }
}
setInterval(updateProgressValue, 100); // Update the progress of the bar

$(window).on("load", function () {
    $(".loader-wrapper").fadeOut("slow");
    $("#caratula").hide();
    ref = $('#lupa');
    popup = $('#popup');
    popup.hide();
    ref.click(function () {
        if (!visible) {
            visible = true;
            $('#casa').removeClass("selected");
            $('#lupa-i').addClass("selected");
            $('#casa-span').removeClass("selectedText");
            $('#lupa-span').addClass("selectedText");
            popup.show();
            var popper = new Popper(ref, popup, {
                placement: 'right',
            });
        } else {
            $('#lupa-i').removeClass("selected");
            $('#casa').addClass("selected");
            $('#lupa-span').removeClass("selectedText");
            $('#casa-span').addClass("selectedText");
            popup.hide();
            visible = false;
        }
    });
    try {
        totalTable = $('.table tr td a');
        totalTable_full = $(".table tr td");
    } catch (error) {
        console.log("Aqui no hay canciones");
    }
});
var songVue = new Vue({
    delimiters: ['[[', ']]'],
    el: '#NowPlaying',
    data: {
        message: 'Now Playing: ',
        songString: '',
        url: ''
    }
})
var searchVue = new Vue({
    delimiters: ['[[', ']]'],
    el: '#popup',
    data: {
        message: ''
    }
})