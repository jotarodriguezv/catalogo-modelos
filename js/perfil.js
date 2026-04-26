// =====================================================
// LÓGICA DEL PERFIL INDIVIDUAL
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

function renderPortafolio(items) {
  const fotos = items.filter(i => i.tipo === 'foto');
  const videos = items.filter(i => i.tipo === 'video');

  const fotosGrid = document.getElementById('fotosGrid');
  const videosGrid = document.getElementById('videosGrid');

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

  if (videos.length === 0) {
    document.getElementById('emptyVideos').classList.remove('hidden');
  } else {
    videos.forEach(video => {
      const div = document.createElement('div');
      div.className = 'video-item';
      // Soporte para YouTube y otros embeds
      const esYoutube = video.url.includes('youtube.com') || video.url.includes('youtu.be');
      if (esYoutube) {
        const ytId = extraerYoutubeId(video.url);
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
          ${video.descripcion ? `<p class="video-desc">${video.descripcion}</p>` : ''}
        `;
      } else {
        // Video directo (mp4 u otro)
        div.innerHTML = `
          <div class="video-embed-wrap">
            <video controls preload="metadata">
              <source src="${video.url}" type="video/mp4"/>
            </video>
          </div>
          ${video.descripcion ? `<p class="video-desc">${video.descripcion}</p>` : ''}
        `;
      }
      videosGrid.appendChild(div);
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

function extraerYoutubeId(url) {
  const regExp = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : '';
}

function capitalizar(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

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

function mostrarError() {
  document.getElementById('loadingState').style.display = 'none';
  document.getElementById('errorState').classList.remove('hidden');
}

iniciarPerfil();
