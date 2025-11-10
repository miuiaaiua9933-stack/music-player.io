// script.js - songs.json を fetch して歌詞ファイルを個別に読み込む実装
// (既存のプレイヤー機能／シャッフル／リピート等は維持)

let songs = []; // 後で fetch により読み込まれる

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

async function loadSongsFromJson() {
  try {
    const res = await fetch('assets/data/songs.json');
    if (!res.ok) throw new Error('songs.json fetch failed: ' + res.status);
    songs = await res.json();

    // lyrics がパス（.txt/.lrc）なら読んで置き換える
    await Promise.all(songs.map(async (s) => {
      if (s.lyrics && typeof s.lyrics === 'string' && s.lyrics.match(/\.(txt|lrc)$/i)) {
        try {
          const r = await fetch(s.lyrics);
          if (r.ok) {
            s.lyrics = await r.text();
          } else {
            console.warn('lyrics fetch failed for', s.lyrics, r.status);
            s.lyrics = '';
          }
        } catch (err) {
          console.warn('lyrics fetch error for', s.lyrics, err);
          s.lyrics = '';
        }
      }
    }));

    // 初期化
    if (songs.length > 0) {
      loadSong(0);
      renderPlaylist();
    } else {
      console.warn('songs.json is empty');
    }
  } catch (err) {
    console.error('Failed to load songs.json', err);
  }
}

function loadSong(index) {
  currentSongIndex = index;
  const song = songs[index];
  if (!song) return;
  audio.src = song.src;
  if (typeof audio.volume !== 'undefined') audio.volume = audio.volume || 0.7;
  document.getElementById('songTitle').textContent = song.title || '';
  document.getElementById('songArtist').textContent = song.artist || '';
  document.getElementById('albumArt').src = song.albumArt || '';
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
  if (!isNaN(audio.duration)) audio.currentTime = pct * audio.duration;
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

function toggleShuffle() {
  const btn = document.getElementById('shuffleBtn');
  const rpt = document.getElementById('repeatBtn');

  isShuffle = !isShuffle;

  if (isShuffle) {
    btn.classList.add('active');
    btn.setAttribute('aria-pressed','true');

    // disable repeat
    isRepeatOne = false;
    rpt.classList.remove('active');
    rpt.setAttribute('aria-pressed','false');
    rpt.disabled = true;
    rpt.setAttribute('aria-disabled','true');
  } else {
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
    rpt.classList.add('active');
    rpt.setAttribute('aria-pressed','true');

    isShuffle = false;
    btn.classList.remove('active');
    btn.setAttribute('aria-pressed','false');
    btn.disabled = true;
    btn.setAttribute('aria-disabled','true');
  } else {
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
  if (!songs || songs.length === 0) {
    el.innerHTML = '<div style="padding:12px;color:#666;">No songs loaded</div>';
    return;
  }
  el.innerHTML = songs.map((s,i) => `
    <div class="playlist-item ${i===currentSongIndex ? 'active' : ''}" onclick="selectSong(${i})">
      <img class="thumb" src="${s.albumArt}" alt="${s.title}">
      <div style="flex:1; min-width:0;">
        <div style="font-weight:700;">${s.title}</div>
        <div style="font-size:13px; color:${i===currentSongIndex ? '#fff' : '#666'};">${s.artist || ''}</div>
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

// 初期化: DOMContentLoaded で songs.json を読み込む
window.addEventListener('DOMContentLoaded', async () => {
  // Clear any previous disabled state
  const shuffleBtn = document.getElementById('shuffleBtn');
  const repeatBtn = document.getElementById('repeatBtn');
  if (shuffleBtn) { shuffleBtn.disabled = false; shuffleBtn.removeAttribute('aria-disabled'); shuffleBtn.setAttribute('aria-pressed', isShuffle ? 'true' : 'false'); }
  if (repeatBtn) { repeatBtn.disabled = false; repeatBtn.removeAttribute('aria-disabled'); repeatBtn.setAttribute('aria-pressed', isRepeatOne ? 'true' : 'false'); }

  await loadSongsFromJson();
});
