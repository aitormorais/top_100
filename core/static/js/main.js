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
var slider = null;

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
        getImgUrl(id);
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
                        url: "/es/api/cancionEscuchada",
                        headers: { 'X-CSRFToken': token },
                        data: JSON.stringify(mydata),
                        contentType: 'application/json; charset=utf-8',
                        dataType: "json",
                        success: function (response) {
                            console.log(response);
                            let jsonData = response;
                        }
                    })
                }
                firstTime = false
                song.play();
                song.volume = 0.5;
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
    if (window.location.pathname.includes('/genero')) {
        $('#genero').addClass("selected");
    } else if (window.location.pathname.includes('/artista')) {
        $('#artista').addClass("selected");
    } else if (window.location.pathname.includes('/cancion')) {
        $('#canciones').addClass("selected");
    } else if (window.location.pathname.includes('/login')) {
        $('#login').addClass("selected");
    } else if (window.location.pathname.includes('/search')) {
        //No remarcar ninguno
    } else {
        $('#home').addClass("selected");
    }
    // Buscar el slider
    slider = document.querySelector("#volume-control");
    slider.addEventListener("change", function (e) {
        try {
            song.volume = e.currentTarget.value / 100;
        } catch (error) {
            //La cancion es null, por lo que no se ha seleccionado ninguna cancion   
        }
        songVue.volume = " Volume: " + e.currentTarget.value;
    });
    // PopUp de la lupa
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
async function getImgUrl(id) {
    let mydata = { pk: id };
    $.ajax({
        type: "POST",
        url: "/es/api/caratula",
        headers: { 'X-CSRFToken': token },
        data: JSON.stringify(mydata),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            console.log(response);
            let jsonData = response; // Response is a raw json. JSON.parse wouldn't read it. so I have to convert it to a String.
            if (jsonData.status == 200) { // If it is correct just change the img.
                console.log(jsonData.data)
                console.log(jsonData.caratula)
                songVue.url = jsonData.caratula
            }
            else {
                console.log("Error");
                console.log(jsonData)
            }
        }
    });
}
function showPopUp(id) {
    if ($("#popup" + id).length == 0) {// Download the img data from the server if the popper pop Up does not exist.
        ajaxDownloadPopUp(id).done(function () {
            new Popper($("#" + id), $("#popperUp"), {
                placement: 'right',
            });
            $("#popperUp").show();
        })
        //It doesn't exist
    }
    else {
        new Popper($("#" + id), $("#popperUp"), {
            placement: 'right',
        });
        $("#popperUp").show();
    }
}
function ajaxDownloadPopUp(id) {
    return $.ajax({
        type: "GET",
        url: `/es/api/ImgPopUp/${id}`,
        success: function (response) {
            $("#popperUp").html(response);


        }
    });
}
function hidePopUp(id) {
    $("#popperUp").hide()
}
function roundToTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
}
var songVue = new Vue({
    delimiters: ['[[', ']]'],
    el: '#NowPlaying',
    data: {
        message: 'Now Playing: ',
        songString: '',
        url: '',
        volume: ' Volume: 50'
    },
    methods: {
        redirect: function () {
            if (window.location.pathname.includes('es')) {
                window.location.replace("/es/cancion/" + this.songString);
            } else if (window.location.pathname.includes('eu')) {
                window.location.replace("/eu/cancion/" + this.songString);
            }
        }
    }
})
var searchVue = new Vue({
    delimiters: ['[[', ']]'],
    el: '#popup',
    data: {
        message: ''
    }
})