// script.js — songs のパスを assets/ 配下に変更しています

const songs = [
    {
        title: "Summer Breeze",
        artist: "Demo Artist",
        src: "assets/music/song1.mp3",
        albumArt: "assets/images/summer.svg",
        lyrics: "Summer Breeze\nOpen up your windows\nLet the warm air in\nSoft guitar and memories\nWe let the evening begin"
    },
    {
        title: "Midnight Jazz",
        artist: "Cool Cats",
        src: "assets/music/song2.mp3",
        albumArt: "assets/images/midnight.svg",
        lyrics: "Midnight lights\nSaxophones playing low\nCity sleeps but we don't\nIn the stillness we glow"
    },
    {
        title: "Electric Dreams",
        artist: "Synth Wave",
        src: "assets/music/song3.mp3",
        albumArt: "assets/images/electric.svg",
        lyrics: "Neon nights and distant beams\nWe chase the glow of electric dreams\nHeartbeats synced to pulsing lights\nWe dance alone through endless nights"
    },
    {
        title: "Ocean Waves",
        artist: "Nature Sounds",
        src: "assets/music/song4.mp3",
        albumArt: "assets/images/ocean.svg",
        lyrics: "Waves roll in, waves roll out\nA rhythm old as time\nBreathe the salt and let it fade\nThe sea will ease your mind"
    }
];

const audio = document.getElementById('audioPlayer');
let currentSongIndex = 0;

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2,'0')}`;
}

function loadSong(index) {
    currentSongIndex = index;
    const song = songs[index];
    audio.src = song.src;
    if (typeof audio.volume !== 'undefined') audio.volume = audio.volume || 0.7;
    document.getElementById('songTitle').textContent = song.title;
    document.getElementById('songArtist').textContent = song.artist;
    document.getElementById('albumArt').src = song.albumArt;
    updatePlaylist();
    updateLyricsDisplay();
}

function togglePlay() {
    const vinyl = document.getElementById('vinyl');
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');
    if (audio.paused) {
        audio.play().catch(()=>{});
        vinyl.classList.add('spinning');
        playIcon.style.display='none'; pauseIcon.style.display='block';
    } else {
        audio.pause();
        vinyl.classList.remove('spinning');
        playIcon.style.display='block'; pauseIcon.style.display='none';
    }
}

function updateProgress() {
    if (!isNaN(audio.duration)) {
        const prog = (audio.currentTime / audio.duration) * 100;
        document.getElementById('progress').style.width = prog + '%';
        document.getElementById('currentTime').textContent = formatTime(audio.currentTime);
        document.getElementById('duration').textContent = formatTime(audio.duration);
    }
}

audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', ()=> nextSong());
audio.addEventListener('loadedmetadata', ()=> {
    document.getElementById('duration').textContent = formatTime(audio.duration);
});

function seek(event) {
    const bar = event.currentTarget;
    const clickX = event.offsetX;
    const width = bar.offsetWidth;
    const pct = clickX / width;
    audio.currentTime = pct * audio.duration;
}

function previousSong(){ 
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    const wasPlaying = !audio.paused;
    loadSong(currentSongIndex);
    if (wasPlaying) audio.play().catch(()=>{});
}
function nextSong(){
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    const wasPlaying = !audio.paused;
    loadSong(currentSongIndex);
    if (wasPlaying) audio.play().catch(()=>{});
}

function changeVolume(event){
    const bar = event.currentTarget;
    const clickX = event.offsetX;
    const width = bar.offsetWidth;
    const v = Math.max(0, Math.min(1, clickX / width));
    audio.volume = v;
    document.getElementById('volumeLevel').style.width = (v*100) + '%';
    bar.setAttribute('aria-valuenow', Math.round(v * 100));
}

function renderPlaylist(){
    const el = document.getElementById('playlist');
    el.innerHTML = songs.map((s,i) => `
        <div class="playlist-item ${i===currentSongIndex ? 'active' : ''}" onclick="selectSong(${i})">
            <img class="thumb" src="${s.albumArt}" alt="${s.title}">
            <div style="flex:1; min-width:0;">
                <div style="font-weight:700;">${s.title}</div>
                <div style="font-size:13px; color:${i===currentSongIndex ? '#fff' : '#666'};">${s.artist}</div>
            </div>
        </div>
    `).join('');
}

function selectSong(index){
    const wasPlaying = !audio.paused;
    loadSong(index);
    if (wasPlaying) audio.play().catch(()=>{});
}

function updatePlaylist(){ renderPlaylist(); }

function toggleLyrics(){
    const overlay = document.getElementById('lyricsOverlay');
    const btn = document.getElementById('lyricsToggle');
    const pressed = btn.getAttribute('aria-pressed') === 'true';
    if (!pressed) {
        overlay.classList.add('open');
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        overlay.setAttribute('aria-hidden', 'false');
        updateLyricsDisplay();
    } else {
        overlay.classList.remove('open');
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
        overlay.setAttribute('aria-hidden', 'true');
    }
}

function updateLyricsDisplay(){
    const panel = document.getElementById('lyricsOverlayPanel');
    const overlay = document.getElementById('lyricsOverlay');
    const song = songs[currentSongIndex];
    if (!song) return;
    panel.textContent = song.lyrics && song.lyrics.trim().length > 0 ? song.lyrics : 'この曲の歌詞は未登録です。';
    if (overlay.classList.contains('open')) panel.scrollTop = 0;
    updatePlaylist();
}

document.addEventListener('keydown', (e) => {
    const btn = document.getElementById('lyricsToggle');
    if (document.activeElement === btn && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        toggleLyrics();
    }
});

loadSong(0);
renderPlaylist();