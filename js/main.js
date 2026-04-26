// =====================================================
// LÓGICA DEL CATÁLOGO PRINCIPAL
// =====================================================

let todasLasModelos = [];

async function iniciarCatalogo() {
  try {
    todasLasModelos = await supabase.getModelos();
    ocultarLoading();

    if (todasLasModelos.length === 0) {
      mostrarEmpty();
      return;
    }

    renderCiudades(todasLasModelos);
    renderCards(todasLasModelos);
  } catch (err) {
    console.error('Error cargando modelos:', err);
    ocultarLoading();
    mostrarEmpty();
  }
}

function renderCiudades(modelos) {
  const ciudades = [...new Set(modelos.map(m => m.ciudad_base))].sort();
  const container = document.getElementById('cityFilters');

  ciudades.forEach(ciudad => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.dataset.city = ciudad;
    btn.textContent = ciudad;
    btn.addEventListener('click', () => filtrarPorCiudad(ciudad, btn));
    container.appendChild(btn);
  });

  document.querySelector('[data-city="all"]').addEventListener('click', (e) => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    renderCards(todasLasModelos);
  });
}

function filtrarPorCiudad(ciudad, btnActivo) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btnActivo.classList.add('active');
  const filtradas = todasLasModelos.filter(m => m.ciudad_base === ciudad);
  renderCards(filtradas);
}

function renderCards(modelos) {
  const grid = document.getElementById('catalogGrid');
  grid.innerHTML = '';

  modelos.forEach((modelo, i) => {
    const nombre = modelo.nombre_artistico || modelo.nombre;
    const foto = modelo.foto_perfil_url || 'https://via.placeholder.com/400x500/111/333?text=TR';
    const transporte = modelo.transporte_incluido
      ? '<span class="tag tag-green">Transporte incluido</span>'
      : '<span class="tag tag-gray">Transporte aparte</span>';

    const card = document.createElement('div');
    card.className = 'model-card';
    card.style.animationDelay = `${i * 60}ms`;
    card.innerHTML = `
      <div class="card-foto-wrap">
        <img src="${foto}" alt="${nombre}" class="card-foto" loading="lazy"/>
        <div class="card-overlay">
          <span class="card-cta">Ver perfil →</span>
        </div>
        ${modelo.perfil_estilo ? `<div class="card-estilo">${modelo.perfil_estilo}</div>` : ''}
      </div>
      <div class="card-info">
        <h3 class="card-nombre">${nombre}</h3>
        <p class="card-ciudad">${modelo.ciudad_base}</p>
        <div class="card-tarifas">
          <div class="tarifa-item">
            <span class="tarifa-etiqueta">Sesión estándar</span>
            <span class="tarifa-precio">${formatCOP(modelo.tarifa_sesion)}</span>
          </div>
          <div class="tarifa-item">
            <span class="tarifa-etiqueta">Hora adicional</span>
            <span class="tarifa-precio">${formatCOP(modelo.tarifa_hora_adicional)}</span>
          </div>
        </div>
        <div class="card-tags">${transporte}</div>
      </div>
    `;

    card.addEventListener('click', () => {
      window.location.href = `pages/perfil.html?id=${modelo.id}`;
    });

    grid.appendChild(card);
  });
}

function ocultarLoading() {
  document.getElementById('loadingState').style.display = 'none';
}

function mostrarEmpty() {
  document.getElementById('emptyState').classList.remove('hidden');
}

// Iniciar
iniciarCatalogo();
