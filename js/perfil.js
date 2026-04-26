// =====================================================
// LÓGICA DEL PERFIL INDIVIDUAL
// Soporta: YouTube, Instagram /p/, Instagram /reel/, video MP4
// =====================================================

async function iniciarPerfil() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    mostrarError();
    return;
  }

  try {
    const [modelo, portafolio] = await Promise.all([
      supabase.getModeloById(id),
      supabase.getPortafolio(id)
    ]);

    if (!modelo) {
      mostrarError();
      return;
    }

    renderPerfil(modelo);
    renderPortafolio(portafolio);
    document.title = `${modelo.nombre_artistico || modelo.nombre} — Talent Roster`;

    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('perfilWrapper').classList.remove('hidden');

  } catch (err) {
    console.error('Error cargando perfil:', err);
    mostrarError();
  }
}

function renderPerfil(modelo) {
  const nombre = modelo.nombre_artistico || modelo.nombre;
  const foto = modelo.foto_perfil_url || 'https://via.placeholder.com/600x800/111/333?text=TR';

  document.getElementById('perfilFoto').src = foto;
  document.getElementById('perfilFoto').alt = nombre;
  document.getElementById('perfilNombre').textContent = nombre;
  document.getElementById('perfilCiudad').textContent = `📍 ${modelo.ciudad_base}`;
  document.getElementById('perfilDescripcion').textContent = modelo.descripcion || '';

  if (modelo.perfil_estilo) {
    document.getElementById('perfilEstilo').textContent = modelo.perfil_estilo;
  } else {
    document.getElementById('perfilEstilo').style.display = 'none';
  }

  document.getElementById('tarifaSesion').textContent = formatCOP(modelo.tarifa_sesion);
  document.getElementById('tarifaHora').textContent = formatCOP(modelo.tarifa_hora_adicional);

  const transEl = document.getElementById('tarifaTransporte');
  const transCard = document.getElementById('tarifaTransporteCard');
  if (modelo.transporte_incluido) {
    transEl.textContent = 'Incluido';
    transCard.classList.add('transporte-si');
  } else {
    transEl.textContent = 'No incluido';
    transCard.classList.add('transporte-no');
  }
}

// ---- Detectores de tipo de URL ----

function esYoutube(url) {
  return url.includes('youtube.com') || url.includes('youtu.be');
}

function esInstagramPost(url) {
  return url.includes('instagram.com/p/');
}

function esInstagramReel(url) {
  return url.includes('instagram.com/reel/');
}

function extraerYoutubeId(url) {
  const regExp = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : '';
}

function construirEmbedInstagram(url) {
  // Limpia la URL y agrega /embed/ al final
  // Soporta: /p/CODIGO/ y /reel/CODIGO/
  const base = url.split('?')[0].replace(/\/$/, '');
  return `${base}/embed/`;
}

// ---- Render de cada item de video ----

function renderVideoItem(video) {
  const div = document.createElement('div');
  div.className = 'video-item';

  const url = video.url.trim();
  const desc = video.descripcion
    ? `<p class="video-desc">${video.descripcion}</p>`
    : '';

  if (esYoutube(url)) {
    const ytId = extraerYoutubeId(url);
    div.innerHTML = `
      <div class="video-embed-wrap">
        <iframe
          src="https://www.youtube.com/embed/${ytId}"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          loading="lazy">
        </iframe>
      </div>
      ${desc}
    `;

  } else if (esInstagramPost(url) || esInstagramReel(url)) {
    const embedUrl = construirEmbedInstagram(url);
    // Instagram reels son verticales (9:16), posts son cuadrados (1:1)
    const ratio = esInstagramReel(url) ? '9/16' : '1/1';
    div.innerHTML = `
      <div class="video-embed-wrap" style="aspect-ratio:${ratio};">
        <iframe
          src="${embedUrl}"
          frameborder="0"
          scrolling="no"
          allowtransparency="true"
          loading="lazy">
        </iframe>
      </div>
      ${desc}
    `;

  } else {
    // Video directo (MP4 u otro formato)
    div.innerHTML = `
      <div class="video-embed-wrap">
        <video controls preload="metadata">
          <source src="${url}" type="video/mp4"/>
        </video>
      </div>
      ${desc}
    `;
  }

  return div;
}

// ---- Render del portafolio completo ----

function renderPortafolio(items) {
  const fotos = items.filter(i => i.tipo === 'foto');
  const videos = items.filter(i => i.tipo === 'video');

  const fotosGrid = document.getElementById('fotosGrid');
  const videosGrid = document.getElementById('videosGrid');

  // Fotos
  if (fotos.length === 0) {
    document.getElementById('emptyFotos').classList.remove('hidden');
  } else {
    fotos.forEach(foto => {
      const div = document.createElement('div');
      div.className = 'foto-item';
      div.innerHTML = `<img src="${foto.url}" alt="${foto.descripcion || 'Fotografía'}" loading="lazy"/>`;
      div.addEventListener('click', () => abrirLightbox(foto.url));
      fotosGrid.appendChild(div);
    });
  }

  // Videos
  if (videos.length === 0) {
    document.getElementById('emptyVideos').classList.remove('hidden');
  } else {
    videos.forEach(video => {
      videosGrid.appendChild(renderVideoItem(video));
    });
  }

  // Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.portafolio-panel').forEach(p => p.classList.add('hidden'));
      btn.classList.add('active');
      document.getElementById(`tab${capitalizar(btn.dataset.tab)}`).classList.remove('hidden');
    });
  });
}

// ---- Lightbox ----

function abrirLightbox(src) {
  document.getElementById('lightboxImg').src = src;
  document.getElementById('lightbox').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

document.getElementById('lightboxClose').addEventListener('click', () => {
  document.getElementById('lightbox').classList.add('hidden');
  document.body.style.overflow = '';
});

document.getElementById('lightbox').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) {
    document.getElementById('lightbox').classList.add('hidden');
    document.body.style.overflow = '';
  }
});

// ---- Utilidades ----

function capitalizar(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function mostrarError() {
  document.getElementById('loadingState').style.display = 'none';
  document.getElementById('errorState').classList.remove('hidden');
}

// ---- Iniciar ----
iniciarPerfil();
