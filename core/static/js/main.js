var song = null;
var idPlayer = null;
var iconList = null;
var iconGeneric = null;
var totalTable = null;
var currentSongIndex = null;

function PlayPause(id) {
    if(song == null || idPlayer == id){ // If song is null is a new song. If the id is the same just pause
        idPlayer = id;
        for (let i = 0; i < totalTable.length; i++) {
            if(totalTable[i].id == idPlayer){
                currentSongIndex = i;
            }
        }
        song = document.getElementById(id + "audioPlayer"); // Store data
        iconList = document.getElementById(id + "Icon");
        iconGeneric = document.getElementById("genericPlayer");
        try {
            if (iconList.className == "far fa-play-circle") {
                iconList.className = "far fa-pause-circle";
                iconGeneric.className = "far fa-pause-circle";
                if (song.paused){
                    song.play();
                } else {
                    song.load();
                    song.play();
                    song.volume = 0.2;
                }
            } else if (iconList.className == "far fa-pause-circle"){
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
    if (song.paused){
        song.play();
        iconList.className = "far fa-pause-circle";
        iconGeneric.className = "far fa-pause-circle";
    } else {
        song.pause();
        iconList.className = "far fa-play-circle";
        iconGeneric.className = "far fa-play-circle";
    }
}
function nextSong(index) {
    console.log("i: " + currentSongIndex + "\nindex: " + index + "\ni + index: " + (currentSongIndex+index));
    let nextId = totalTable[currentSongIndex + index].id;
    PlayPause(nextId);
}
function updateProgressValue() {
    if(song != null){
        var percent = (song.currentTime * 100) / song.duration;
        // console.log("Duración: " + song.duration + "\n Current: " + song.currentTime + "\n(Current*100/duracion): " + percent + "%");
        $('.progress-bar').css('width', percent+'%').attr('aria-valuenow', percent);
        if (song.currentTime == song.duration){
            iconList.className = "far fa-play-circle";
            iconGeneric.className = "far fa-play-circle";
            console.log("Current index: " + currentSongIndex + "\nLength: " + (totalTable.length - 1));
            if(currentSongIndex == (totalTable.length - 1)){
                let index = -Math.abs(currentSongIndex)
                nextSong(index);
            } else {
                nextSong(1);
            }
        }
    }
};
setInterval(updateProgressValue, 200); // Update the progress of the bar
$(window).on("load",function(){
    $(".loader-wrapper").fadeOut("slow");
    try {
        totalTable = $('.table tr td a');
    } catch (error) {
        console.log("Aqui no hay canciones");
    }
});