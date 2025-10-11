const playlistUrl = 'https://raw.githubusercontent.com/maginetweb-arch/trwnet/main/iptvit.m3u';

window.addEventListener('DOMContentLoaded', () => {
  loadM3U(playlistUrl);
});

function loadM3U(url) {
  fetch(url)
    .then(res => res.text())
    .then(data => {
      const lines = data.split('\n');
      const list = document.getElementById('channelList');
      list.innerHTML = '';
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('#EXTINF')) {
          const name = lines[i].split(',')[1];
          const logo = lines[i].match(/tvg-logo="([^"]+)"/)?.[1] || 'icon.png';
          const streamUrl = lines[i + 1];

          const div = document.createElement('div');
          div.className = 'channel';

          const img = document.createElement('img');
          img.src = logo;
          img.alt = name;
          img.onclick = () => playStream(streamUrl);

          const label = document.createElement('p');
          label.textContent = name;

          div.appendChild(img);
          div.appendChild(label);
          list.appendChild(div);
        }
      }
    })
    .catch(err => alert('Errore nel caricamento della playlist: ' + err.message));
}

function playStream(url) {
  const video = document.getElementById('video');
  video.src = ''; // reset

  if (url.endsWith('.m3u8') && Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);
  } else if (url.endsWith('.mpd')) {
    const player = dashjs.MediaPlayer().create();
    player.initialize(video, url, true);
  } else {
    video.src = url;
  }
}
