function player(id) {
    try {
        if (document.getElementById(id + "Icon").className == "far fa-play-circle") {
            document.getElementById(id + "Icon").className = "far fa-pause-circle";
            document.getElementById("genericPlayer").className = "far fa-pause-circle";
            if (document.getElementById(id + "audioPlayer").paused){
                document.getElementById(id + "audioPlayer").play();
            } else {
                document.getElementById(id + "audioPlayer").load()
                document.getElementById(id + "audioPlayer").play()
            }
        } else if (document.getElementById(id + "Icon").className == "far fa-pause-circle"){
            document.getElementById(id + "Icon").className = "far fa-play-circle";
            document.getElementById("genericPlayer").className = "far fa-play-circle";
            document.getElementById(id + "audioPlayer").pause()
        }
        
    } catch (error) {
        console.log(error);
    } 
}