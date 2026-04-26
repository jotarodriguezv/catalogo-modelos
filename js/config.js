// =====================================================
// CONFIGURACIÓN DE SUPABASE
// Reemplaza estos valores con los tuyos desde:
// Supabase → Settings → API
// =====================================================

const SUPABASE_URL = 'https://tjyqfrtkjnwqxzmrcvmx.supabase.co/rest/v1/';
const SUPABASE_ANON_KEY = 'sb_publishable_f8haHHEAi6O3e45zXFbAYw_tZKd-Lln';

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
