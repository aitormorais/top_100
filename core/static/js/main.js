let playing = true;
var song;

function PlayPause(id) {
    song = document.getElementById(id + "audioPlayer");

    try {
        if (document.getElementById(id + "Icon").className == "far fa-play-circle") {
            document.getElementById(id + "Icon").className = "far fa-pause-circle";
            document.getElementById("genericPlayer").className = "far fa-pause-circle";
            if (document.getElementById(id + "audioPlayer").paused){
                document.getElementById(id + "audioPlayer").play();
                playing = false;
            } else {
                document.getElementById(id + "audioPlayer").load()
                document.getElementById(id + "audioPlayer").play()
                playing = false;
            }
        } else if (document.getElementById(id + "Icon").className == "far fa-pause-circle"){
            document.getElementById(id + "Icon").className = "far fa-play-circle";
            document.getElementById("genericPlayer").className = "far fa-play-circle";
            document.getElementById(id + "audioPlayer").pause()
            playing = true;
        }
        
    } catch (error) {
        console.log(error);
    } 
}
function updateProgressValue() {
    if(song != null){
        var percent = (song.duration * song.currentTime) / 100;
        $('.progress-bar').css('width', percent+'%').attr('aria-valuenow', percent);
    }
};
function changeProgressBar() {
    song.currentTime = progressBar.value;
};
setInterval(updateProgressValue, 500);