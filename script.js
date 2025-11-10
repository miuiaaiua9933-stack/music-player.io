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
    {
        title: "Hold Me",
        artist: "",
        src: "assets/music/Hold me.mp3",
        albumArt: "assets/images/pic5.jpg",
        lyrics: "The night is warm, the air is still\My drifting thoughts grow soft and still\I hear your light within the breeze\It carries me to gentle peace\Hold me close, the night is near\In your light, the world feels clear\Every breath, I find my way\Love will guide me, night to day\Gentle winds across the sky\Whisper soft as dreams pass by\Even when the shadows stay\Your warmth will lead me through the gray\Hold me close, the night is near\In your light, the world feels clear\Every breath, I find my way\Love will guide me, night to day"
    }
    {
        title: "Smile",
        artist: "",
        src: "assets/music/Smile.mp3",
        albumArt: "assets/images/pic6.jpg",
        lyrics: "明日の光はまだ見えなくても\そばにいるよ 愛してくれる人が\笑顔に触れ 心がほどけて\美しさがそっと 心を満たす\そんな幸せ感じているから\心からありがとう 伝えたいよ\あの頃のバスの時間は\笑い声が止まらなかった\小さな声が混ざっても\変わらない楽しさがあった\いろんな時を越えてきたけど\ここにあるのは変わらぬ愛\Smiles keep shining through the night\やさしい光が包み込む\Dreams keep growing with the sun\今日もまた歩き出せる\窓の外には温かな陽射し\夢は途切れず続いている\愛は色褪せない光\希望胸に進んで行こう\Hold on to the love we’ve found\手を取り合って歩こうよ\Even when the world feels cold\温もり感じていよう\Smiles keep shining through the night\やさしい光が包み込む\Dreams keep growing with the sun\今日もまた歩き出せる"
    }
    {
        title: "こもりうた",
        artist: "",
        src: "assets/music/こもりうた.mp3",
        albumArt: "assets/images/pic7.jpg",
        lyrics: "ねむるまえに　そっとみあげて\ほしがきらりと　まどをてらす\やさしいひかり　そっとひろがり\いま　ねむりのとびらが　ひらくよ\おやすみ　おやすみ　あしたのゆめを\きらきら　ひかるほしに　むねをつつまれて\おやすみ　おやすみ　やさしいひかりが\あなたを包んで　ねむりをそっと　さそうよ\ふかいもりの　やさしいこえが\ちいさなそらに　うたをささやく\かぜがそよそよ　まどをなでて\ねむりのしずくが　あなたをくるむ\おやすみ　おやすみ　あしたのゆめを\きらきら　ひかるほしに　むねをつつまれて\おやすみ　おやすみ　やさしいひかりが\あなたをつつんで　ねむりをそっと　さそうよ\ひかりはそっと　やさしく　やさしく\いっしょにねむりにつく　そっとね"
    }
];

const audio = document.getElementById('audioPlayer');
let currentSongIndex = 0;

// フラグ
let isShuffle = false;
let isRepeatOne = false;

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

// 終了時の挙動
audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', ()=> {
    if (isRepeatOne) {
        audio.currentTime = 0;
        audio.play().catch(()=>{});
    } else {
        playNext(true);
    }
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
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    const wasPlaying = !audio.paused;
    loadSong(currentSongIndex);
    if (wasPlaying) audio.play().catch(()=>{});
}
function nextSong(){
    playNext(false);
}

function playNext(autoplay = false) {
    if (isShuffle) {
        if (songs.length > 1) {
            let nextIndex = currentSongIndex;
            while (nextIndex === currentSongIndex) {
                nextIndex = Math.floor(Math.random() * songs.length);
            }
            currentSongIndex = nextIndex;
        }
    } else {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
    }

    const wasPlaying = !audio.paused;
    loadSong(currentSongIndex);

    if (autoplay || wasPlaying) {
        audio.play().catch(()=>{});
    }
}

// --- 変更: toggleShuffle と toggleRepeat が互いを無効化／有効化するようにした ---
function toggleShuffle() {
    const btn = document.getElementById('shuffleBtn');
    const rpt = document.getElementById('repeatBtn');

    // 切り替え後の状態
    isShuffle = !isShuffle;

    if (isShuffle) {
        // shuffle をONにする -> repeat をOFFかつ無効化
        btn.classList.add('active');
        btn.setAttribute('aria-pressed','true');

        // disable repeat
        isRepeatOne = false;
        rpt.classList.remove('active');
        rpt.setAttribute('aria-pressed','false');
        rpt.disabled = true;
        rpt.setAttribute('aria-disabled','true');
    } else {
        // shuffle をOFFに -> repeat を有効化（操作可能に）
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed','false');

        rpt.disabled = false;
        rpt.removeAttribute('aria-disabled');
    }
}

function toggleRepeat() {
    const rpt = document.getElementById('repeatBtn');
    const btn = document.getElementById('shuffleBtn');

    isRepeatOne = !isRepeatOne;

    if (isRepeatOne) {
        // repeat をONにする -> shuffle をOFFかつ無効化
        rpt.classList.add('active');
        rpt.setAttribute('aria-pressed','true');

        isShuffle = false;
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed','false');
        btn.disabled = true;
        btn.setAttribute('aria-disabled','true');
    } else {
        // repeat をOFFに -> shuffle を有効化
        rpt.classList.remove('active');
        rpt.setAttribute('aria-pressed','false');

        btn.disabled = false;
        btn.removeAttribute('aria-disabled');
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

// 初期化: ボタン disabled 状態をクリア（安全策）
window.addEventListener('DOMContentLoaded', () => {
    const shuffleBtn = document.getElementById('shuffleBtn');
    const repeatBtn = document.getElementById('repeatBtn');
    shuffleBtn.disabled = false;
    repeatBtn.disabled = false;
    shuffleBtn.removeAttribute('aria-disabled');
    repeatBtn.removeAttribute('aria-disabled');
    // ensure aria-pressed reflect flags
    shuffleBtn.setAttribute('aria-pressed', isShuffle ? 'true' : 'false');
    repeatBtn.setAttribute('aria-pressed', isRepeatOne ? 'true' : 'false');
});

loadSong(0);
renderPlaylist();
