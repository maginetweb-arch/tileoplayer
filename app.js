function loadM3U() {
  const url = document.getElementById('m3uUrl').value;
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
          const name = lines[i].split(',')[1];
          const streamUrl = lines[i + 1];
          const li = document.createElement('li');
          li.textContent = name;
          li.onclick = () => playStream(https://raw.githubusercontent.com/maginetweb-arch/trwnet/main/iptvit.m3u);
          list.appendChild(li);
        }
      }
    })
    .catch(error => alert('Errore: ' + error.message));
}

function playStream(url) {
  const video = document.getElementById('video');
  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = url;
  }
}
