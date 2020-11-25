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
        $("#caratula").show();
        $("#caratula").prop('src', $("#" + id).attr("url"))
        $.ajax({
            type: "POST",
            url: "/api/cancionEscuchada",
            headers: { 'X-CSRFToken': token },
            data: { cancion: songVue.songString },
            dataType: "json",
            success: function (response) {
                console.log("!!");
                console.log(response);
            }
        });
        song = document.getElementById(id + "audioPlayer"); // Store data
        iconList = document.getElementById(id + "Icon");
        iconGeneric = document.getElementById("genericPlayer");
        try {
            if (iconList.className == "far fa-play-circle") {
                iconList.className = "far fa-pause-circle";
                iconGeneric.className = "far fa-pause-circle";
                if (song.paused) {
                    song.play();
                } else {
                    song.load();
                    song.play();
                    song.volume = 0.2;
                }
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
    $.ajax({
        type: "POST",
        url: "/api/cancionEscuchada",
        headers: { 'X-CSRFToken': token },
        data: { datos: 'illo' },
        dataType: "json",
        success: function (response) {
            console.log("!!");
            console.log(response);
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
        songString: ''
    }
})