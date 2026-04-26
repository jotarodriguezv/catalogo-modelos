// =====================================================
// CONFIGURACIÓN DE SUPABASE
// Reemplaza estos valores con los tuyos desde:
// Supabase → Settings → API
// =====================================================

const SUPABASE_URL = 'https://TU_PROJECT_URL.supabase.co';
const SUPABASE_ANON_KEY = 'TU_ANON_KEY_AQUI';

// Formateador de moneda colombiana
function formatCOP(valor) {
  if (!valor) return 'A convenir';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(valor);
}
