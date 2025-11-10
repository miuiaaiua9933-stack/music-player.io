// script.js — songs のパスを assets/ 配下に変更しています

const songs = [
    {
        title: "Silent Glow",
        artist: "",
        src: "assets/music/song1.mp3",
        albumArt: "assets/images/pic1.jpeg",
        lyrics: "I feel your light behind closed eyes\The quiet hum of dreams untold\Wraps my heart in gentle gold\Softly falls the midnight air\Echoes whisper, you are there\Every sigh and silent plea Stay with me\through fading light\Guide me softly through the night\When the dawn begins to glow\Your love will lead me home, I know\Through the calm and through the rain\Every loss becomes your name\In the dark, your voice remains\Calling me to dream again"
    },
    {
        title: "Dream",
        artist: "",
        src: "assets/music/song2.mp3",
        albumArt: "assets/images/pic2.jpeg",
        lyrics: "Dreams are still so far away\But I recall your smile that day\Safe and warm, just laughing free\Those gentle times still live in me\Tears may fall on quiet nights\When the weight is hard to hide\But a touch of kindness near\Always lights the dark with clear\The world is fragile, wide, and cold\But this sweet miracle I hold\Even if it hurts, I’ll try\One more step with you, tonight\Even if it hurts, I’ll try\One more step with you, tonight"
    },
    {
        title: "NIGHT",
        artist: "",
        src: "assets/music/song3.mp3",
        albumArt: "assets/images/pic3.jpg",
        lyrics: "Even if the dream is far away\I still remember your childhood smile\Sheltered days, just laughing free\Those memories are still alive in me\Some nights the tears begin to fall\Holding my breath, I hide it all\But someone’s kindness, soft and near\Lights a quiet flame, makes it clear\Hand in hand, let’s walk tonight\I know the glow that lives inside\A treasure chest, it’s all within\With love, it turns to light again\The world is wide, it fades away\But I’ll hold the miracle of meeting you\Even through pain, I’ll take one step\If it’s with you, I’ll never regret"
    },
    {
        title: "Bright",
        artist: "",
        src: "assets/music/song4.mp3",
        albumArt: "assets/images/pic4.jpg",
        lyrics: "The night is warm, the air is still\My drifting thoughts grow soft and still\I hear your light within the breeze\It carries me to gentle peace\Hold me close, the night is near\In your light, the world feels clear\Every breath, I find my way\Love will guide me, night to day\Gentle winds across the sky\Whisper soft as dreams pass by\Even when the shadows stay\Your warmth will lead me through the gray\Hold me close, the night is near\In your light, the world feels clear\Every breath, I find my way\Love will guide me, night to day"
    }
];

const audio = document.getElementById('audioPlayer');
let currentSongIndex = 0;

// --- 新規追加: シャッフルフラグ ---
let isShuffle = false;

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

// --- 変更: ended 時に自動で次の曲を再生するように (autoplay=true) ---
audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', ()=> {
    // 終了時は自動で次の曲を再生する（シャッフルがONならランダム）
    playNext(true);
});
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
    // previousは通常通り（シャッフル中でも直前へ戻るロジックが必要なら履歴を実装）
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    const wasPlaying = !audio.paused;
    loadSong(currentSongIndex);
    if (wasPlaying) audio.play().catch(()=>{});
}
function nextSong(){
    // ユーザが「次へ」ボタンを押した場合は自動再生フラグを false として処理
    playNext(false);
}

// --- 新規追加: 次の曲へ進む共通処理（autoplay が true のときは必ず再生する） ---
function playNext(autoplay = false) {
    if (isShuffle) {
        // シャッフル時は現在と異なるランダムインデックスを選ぶ（曲数が1ならそのまま）
        if (songs.length > 1) {
            let nextIndex = currentSongIndex;
            while (nextIndex === currentSongIndex) {
                nextIndex = Math.floor(Math.random() * songs.length);
            }
            currentSongIndex = nextIndex;
        }
        // songs.length === 1 の場合は currentSongIndex のまま
    } else {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
    }

    const wasPlaying = !audio.paused;
    loadSong(currentSongIndex);

    // autoplay が true の場合は必ず再生（ended の場合など）
    if (autoplay || wasPlaying) {
        audio.play().catch(()=>{});
    }
}

// --- 新規追加: シャッフル切替 ---
function toggleShuffle() {
    isShuffle = !isShuffle;
    const btn = document.getElementById('shuffleBtn');
    if (isShuffle) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed','true');
    } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed','false');
    }
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

// 初期化
loadSong(0);
renderPlaylist();
