const playlistUrl = 'https://raw.githubusercontent.com/maginetweb-arch/trwnet/main/iptvit.m3u';

window.addEventListener('DOMContentLoaded', () => {
  loadM3U(playlistUrl);
});

function loadM3U(url) {
  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error('Errore nel caricamento della lista');
      return response.text();
    })
    .then(data => {
      const lines = data.split('\n');
      const list = document.getElementById('channelList');
      list.innerHTML = '';
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('#EXTINF')) {
          const info = lines[i];
          const streamUrl = lines[i + 1];
          const name = info.split(',')[1];
          const logoMatch = info.match(/tvg-logo="([^"]+)"/);
          const logo = logoMatch ? logoMatch[1] : 'icon.png';

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
    .catch(error => alert('Errore: ' + error.message));
}

function playStream(url) {
  const video = document.getElementById('video');
  if (Hls.isSupported() && url.endsWith('.m3u8')) {
    const hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);
  } else {
    video.src = url;
  }
}
