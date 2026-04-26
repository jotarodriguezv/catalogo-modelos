// =====================================================
// CLIENTE SUPABASE LIGERO (sin npm, vanilla JS)
// =====================================================

const supabase = {
  async query(table, filters = {}) {
    let url = `${SUPABASE_URL}/rest/v1/${table}?`;
    const params = [];

    if (filters.select) params.push(`select=${filters.select}`);
    if (filters.eq) {
      Object.entries(filters.eq).forEach(([k, v]) => {
        params.push(`${k}=eq.${v}`);
      });
    }
    if (filters.order) params.push(`order=${filters.order}`);

    url += params.join('&');

    const res = await fetch(url, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Error en la consulta');
    }

    return await res.json();
  },

  // Obtener todas las modelos activas
  async getModelos() {
    return this.query('modelos', {
      select: 'id,nombre,nombre_artistico,ciudad_base,perfil_estilo,tarifa_sesion,tarifa_hora_adicional,transporte_incluido,foto_perfil_url',
      eq: { activa: 'true' },
      order: 'creado_en.desc'
    });
  },

  // Obtener modelo por ID
  async getModeloById(id) {
    const results = await this.query('modelos', {
      select: '*',
      eq: { id, activa: 'true' }
    });
    return results[0] || null;
  },

  // Obtener portafolio de una modelo
  async getPortafolio(modeloId) {
    return this.query('portafolio', {
      select: 'id,tipo,url,thumbnail_url,descripcion,orden',
      eq: { modelo_id: modeloId },
      order: 'orden.asc,creado_en.asc'
    });
  }
};
