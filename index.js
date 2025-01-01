const image = document.getElementById('cover'),
    title = document.getElementById('music-title'),
    artist = document.getElementById('music-artist'),
    currentTimeEl = document.getElementById('current-time'),
    durationEl = document.getElementById('duration'),
    progress = document.getElementById('progress'),
    playerProgress = document.getElementById('player-progress'),
    prevBtn = document.getElementById('prev'),
    nextBtn = document.getElementById('next'),
    playBtn = document.getElementById('play'),
    background = document.getElementById('bg-img'),
    playlistToggleBtn = document.getElementById('playlist-toggle'),
    playlistContainer = document.getElementById('playlist-container'),
    playlist = document.getElementById('playlist'),
    muteBtn = document.getElementById('mute'),
    volumeSlider = document.getElementById('volume'),
    repeatBtn = document.createElement('i'),
    shuffleBtn = document.createElement('i'),
    nowPlayingTitle = document.getElementById('now-playing-title');

// Set up repeat and shuffle buttons
repeatBtn.classList.add('fa-solid', 'fa-repeat');
repeatBtn.setAttribute('title', 'Repeat');
repeatBtn.id = 'repeat';

shuffleBtn.classList.add('fa-solid', 'fa-shuffle');
shuffleBtn.setAttribute('title', 'Shuffle');
shuffleBtn.id = 'shuffle';

const controlsContainer = document.querySelector('.player-controls');
controlsContainer.appendChild(repeatBtn);
controlsContainer.appendChild(shuffleBtn);

const music = new Audio();

const songs = [
    {
        path: 'Funk.mp3',
        displayName: 'FUNK OSCURO SUPERSLOWED',
        cover: 'th.jpg',
        artist: 'H6itam ',
    },
    {
        path: 'slay.mp3',
        displayName: 'SLAY',
        cover: 'qlzcHe_gusEhd.jpg',
        artist: 'Eternxlkz',
    },
    {
        path: 'Dare.mp3',
        displayName: 'DARE',
        cover: 'ACRZT0B1MZ4hd.jpg',
        artist: 'Sayfalse, TRXVELER, DJ ALIM ',
    },
    {
        path: 'Irokz - FUNK UNIVERSO.mp3',
        displayName: 'FUNK UNIVERSO',
        cover: 'yHKXRcZxpG8hd.jpg',
        artist: 'Irokz',
    },
    {
        path: 'Do.mp3',
        displayName: 'FUNK DO BOUNCE',
        cover: 'kWW-jZ6H_LEhd.jpg',
        artist: 'Ariis',
    },
    {
        path: 'So.mp3',
        displayName: 'Funk Of Galactico',
        cover: 'Bik8QJFu7J0hd.jpg',
        artist: 'SXID',
    },
    {
        path: 'Qo.mp3',
        displayName: 'Lets Go Gambling x X-Slide ',
        cover: '8aJZ_msjauohd.jpg',
        artist: 'purple drip boy',
    },
    {
        path: 'Ogryzek_-_AURA_(Official_Visualiser)_[_YouConvert.net_].mp3',
        displayName: 'AURA',
        cover: 'CgXFHAEVJtAhd.jpg',
        artist: 'Ogryzek',
    }
];

let musicIndex = 0;
let isPlaying = false;
let isRepeat = false;
let isShuffle = false;

function togglePlay() {
    if (isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}

function playMusic() {
    isPlaying = true;
    // Change play button icon
    playBtn.classList.replace('fa-play', 'fa-pause');
    // Set button hover title
    playBtn.setAttribute('title', 'Pause');
    music.play();
}

function pauseMusic() {
    isPlaying = false;
    // Change pause button icon
    playBtn.classList.replace('fa-pause', 'fa-play');
    // Set button hover title
    playBtn.setAttribute('title', 'Play');
    music.pause();
}

function loadMusic(song) {
    music.src = song.path;
    title.textContent = song.displayName;
    artist.textContent = song.artist;
    image.src = song.cover;
    background.src = song.cover;

    // Update "Now Playing"
    nowPlayingTitle.textContent = song.displayName;

    // Pause current music and load the new one
    if (isPlaying) {
        pauseMusic(); // First, pause the current music
    }
    music.load(); // Reload the new song
    playMusic(); // Then play the new song
}

function changeMusic(direction) {
    musicIndex = (musicIndex + direction + songs.length) % songs.length;
    loadMusic(songs[musicIndex]);
}

function updateProgressBar() {
    const { duration, currentTime } = music;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    const formatTime = (time) => String(Math.floor(time)).padStart(2, '0');
    durationEl.textContent = `${formatTime(duration / 60)}:${formatTime(duration % 60)}`;
    currentTimeEl.textContent = `${formatTime(currentTime / 60)}:${formatTime(currentTime % 60)}`;
}

function setProgressBar(e) {
    const width = playerProgress.clientWidth;
    const clickX = e.offsetX;
    music.currentTime = (clickX / width) * music.duration;
}

// Repeat button functionality
repeatBtn.addEventListener('click', () => {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle('active');
    repeatBtn.setAttribute('title', isRepeat ? 'Repeat On' : 'Repeat Off');
});

// Shuffle button functionality
shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active');
    shuffleBtn.setAttribute('title', isShuffle ? 'Shuffle On' : 'Shuffle Off');
});

// Playlist Toggle
playlistToggleBtn.addEventListener('click', () => {
    playlistContainer.classList.toggle('show');
    if (playlistContainer.classList.contains('show')) {
        playlistToggleBtn.classList.add('active');
    } else {
        playlistToggleBtn.classList.remove('active');
    }
});

// Volume Control
volumeSlider.addEventListener('input', () => {
    music.volume = volumeSlider.value / 100;
});

muteBtn.addEventListener('click', () => {
    music.muted = !music.muted;
    muteBtn.classList.toggle('active');
});

// Generate Playlist
function generatePlaylist() {
    playlist.innerHTML = ''; // Clear any existing playlist items

    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.textContent = `${song.displayName} - ${song.artist}`;
        li.addEventListener('click', () => loadMusic(songs[index])); // Click event for each song
        playlist.appendChild(li);
    });
}

generatePlaylist();

playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', () => changeMusic(-1));
nextBtn.addEventListener('click', () => changeMusic(1));
music.addEventListener('ended', () => {
    if (isRepeat) {
        music.currentTime = 0;
        playMusic();
    } else if (isShuffle) {
        musicIndex = Math.floor(Math.random() * songs.length);
        loadMusic(songs[musicIndex]);
    } else {
        changeMusic(1);
    }
});
music.addEventListener('timeupdate', updateProgressBar);
playerProgress.addEventListener('click', setProgressBar);

loadMusic(songs[musicIndex]);
