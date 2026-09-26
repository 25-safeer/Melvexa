

console.log("Lets write javascript")
let currentSong = new Audio;
let songs;
let isDragging = false;
let currFolder;
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder;

    let a = await fetch(`/${folder}/info.json`);
    let response = await a.json();

    songs = response.songs;

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];

    songUL.innerHTML = "";

    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
            <img class="invert" src="img/music.svg" alt="music">

            <div class="info">
                <div>${decodeURIComponent(song)}</div>
            </div>

            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="img/play.svg" alt="">
            </div>
        </li>`;
    }

    Array.from(
        document.querySelector(".songList").getElementsByTagName("li")
    ).forEach(e => {
        e.addEventListener("click", () => {
            playmusic(
                e.querySelector(".info").firstElementChild.innerHTML
            );
        });
    });

    return songs;
}

const playmusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/${encodeURIComponent(track)}`;

    if (!pause) {
        currentSong.play();
        play.src = "img/pause.svg";
    }

    document.querySelector(".songinfo").innerHTML = decodeURIComponent(track);
    document.querySelector(".songduration").innerHTML = "00:00 / 00:00";
}

const seekbar = document.querySelector(".seekbar");
const circle = document.querySelector(".circle");


async function displayAlbums() {

    const playlists = [
        "angry",
        "cokestudio",
        "dance",
        "hindi",
        "karan",
        "lofi",
        "punjabi",
        "romantic",
        "sad",
        "saraiki",
        "sidhu",
        "sufi"
    ];

    let cardContainer = document.querySelector(".cards");
    cardContainer.innerHTML = "";

    const requests = playlists.map(folder =>
        fetch(`/songs/${folder}/info.json`)
            .then(response => response.json())
            .then(data => ({
                folder: folder,
                data: data
            }))
    );

    const results = await Promise.all(requests);

    for (const item of results) {

        const folder = item.folder;
        const response = item.data;

        cardContainer.innerHTML += `
            <div data-folder="${folder}" id="card" class="card">

                <img class="play" src="assets/Play.png" alt="play">

                <img class="coverImg"
                     src="${response.cover}"
                     alt="Cover Image">

                <h3>${response.title}</h3>

                <p>${response.description}</p>

            </div>
        `;
    }

    Array.from(document.getElementsByClassName("card")).forEach(e => {

        e.addEventListener("click", async () => {

            songs = await getSongs(
                `songs/${e.dataset.folder}`
            );

            if (songs.length > 0) {
                playmusic(songs[0]);
            }

        });

    });
}

async function main() {
    await getSongs("songs/hindi")
    playmusic(songs[0], true)

    displayAlbums();


    document.getElementById("play").addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songduration").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`




        const percentage = (currentSong.currentTime / currentSong.duration) * 100;
        const seekbarWidth = seekbar.clientWidth;
        const circleWidth = circle.offsetWidth;

        const position = (percentage / 100) * (seekbarWidth - circleWidth);

        circle.style.left = position + "px";


    })

    currentSong.addEventListener("ended", () => {
        play.src = "img/play.svg"
    })

    window.addEventListener("keydown", (e) => {
        if (e.key === ' ' || e.key === 'Spacebar') {
            if (currentSong.paused) {
                currentSong.play()
                play.src = "img/pause.svg"
            }
            else {
                currentSong.pause()
                play.src = "img/play.svg"
            }
        }
    })





    circle.addEventListener("pointerdown", () => {
        isDragging = true;
    });

    document.addEventListener("pointermove", (e) => {
        if (!isDragging) return;

        const rect = seekbar.getBoundingClientRect();

        let x = e.clientX - rect.left;


        x = Math.max(0, Math.min(x, rect.width));

        const percentage = (x / rect.width) * 100;

        circle.style.left = percentage + "%";

        currentSong.currentTime =
            (percentage / 100) * currentSong.duration;
    });

    document.addEventListener("pointerup", () => {
        isDragging = false;
    });



    seekbar.addEventListener("click", (e) => {
        let percent = ((e.offsetX / e.target.getBoundingClientRect().width) * 100)
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = (currentSong.duration * percent) / 100
    })

    document.getElementById("previous").addEventListener("click", () => {
        currentSong.pause()
        play.src = "img/play.svg"

        let currentTrack = decodeURIComponent(
            currentSong.src.split("/").slice(-1)[0]
        )

        let index = songs.indexOf(currentTrack)

        if ((index - 1) >= 0) {
            playmusic(songs[index - 1])
        }
    })

    document.getElementById("next").addEventListener("click", () => {
        currentSong.pause()
        play.src = "img/play.svg"

        let currentTrack = decodeURIComponent(
            currentSong.src.split("/").slice(-1)[0]
        )

        let index = songs.indexOf(currentTrack)

        if ((index + 1) < songs.length) {
            playmusic(songs[index + 1])
        }
    })

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0%"
    })

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", () => {
            document.querySelector(".left").style.left = "0%"
        })
    })
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            document.querySelector(".left").style.left = "-120%"
        }
    })


    document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100
        let img = document.querySelector(".volume>img")
        if (img.src.includes("img/mute.svg")) {
            img.src = img.src.replace("img/mute.svg", "img/volume.svg")
        }
        if (currentSong.volume == 0) {
            img.src = img.src.replace("img/volume.svg", "img/mute.svg")
        }
    })

    document.querySelector(".volume>img").addEventListener("click", e => {

        if (e.target.src.includes("img/volume.svg")) {
            e.target.src = e.target.src.replace("img/volume.svg", "img/mute.svg")
            currentSong.volume = 0
            document.querySelector(".volume").getElementsByTagName("input")[0].value = 0
        }
        else {
            e.target.src = e.target.src.replace("img/mute.svg", "img/volume.svg")
            currentSong.volume = 0.3
            document.querySelector(".volume").getElementsByTagName("input")[0].value = 30
        }
    })
    document.getElementById("range").addEventListener("change", e => {

    })


}

main()