# Talent Roster

Catálogo profesional de modelos para producción de contenido comercial.

## Estructura del proyecto

```
talent-roster/
├── index.html              → Catálogo principal
├── pages/
│   ├── perfil.html         → Perfil individual de modelo
│   └── privacidad.html     → Política de uso de imagen
├── css/
│   ├── style.css           → Estilos globales
│   ├── perfil.css          → Estilos del perfil
│   └── legal.css           → Estilos de la página legal
├── js/
│   ├── config.js           → ⚠️ Aquí van tus credenciales de Supabase
│   ├── supabase.js         → Cliente de Supabase (sin dependencias)
│   ├── main.js             → Lógica del catálogo
│   └── perfil.js           → Lógica del perfil individual
└── README.md
```

## Configuración inicial

### 1. Conectar Supabase

Edita `js/config.js` y reemplaza los valores:

```javascript
const SUPABASE_URL = 'https://TU_PROJECT_URL.supabase.co';
const SUPABASE_ANON_KEY = 'TU_ANON_KEY_AQUI';
```

Estos valores los encuentras en tu proyecto de Supabase:
- **Settings → API → Data API → API URL**
- **Settings → API → API Keys → Llave publicable**

### 2. Subir a GitHub Pages

1. Crea un repositorio en GitHub (puede ser privado)
2. Sube todos los archivos
3. Ve a **Settings → Pages**
4. En "Source" selecciona la rama `main` y carpeta `/ (root)`
5. GitHub te dará una URL tipo `https://tuusuario.github.io/talent-roster/`

### 3. Conectar tu dominio personalizado

En **Settings → Pages → Custom domain** escribe tu dominio.
Luego en tu proveedor DNS agrega un registro CNAME:
```
www  →  tuusuario.github.io
```

## Agregar modelos (desde Supabase)

Por ahora, agrega modelos directamente desde **Supabase → Table Editor → modelos**.

Campos clave:
| Campo | Descripción |
|---|---|
| `nombre` | Nombre real (requerido) |
| `nombre_artistico` | Nombre que se muestra públicamente |
| `ciudad_base` | Ciudad donde reside |
| `perfil_estilo` | Ej: "Lifestyle", "Comercial", "Editorial" |
| `descripcion` | Texto corto sobre la modelo |
| `tarifa_sesion` | Precio sesión de 2 horas (en pesos COP) |
| `tarifa_hora_adicional` | Precio por hora extra |
| `transporte_incluido` | true / false |
| `foto_perfil_url` | URL de la foto principal |
| `activa` | true para que aparezca en el catálogo |

## Agregar fotos y videos (portafolio)

En **Supabase → Table Editor → portafolio**:

| Campo | Descripción |
|---|---|
| `modelo_id` | UUID de la modelo |
| `tipo` | `foto` o `video` |
| `url` | URL de la foto (Supabase Storage) o URL de YouTube |
| `descripcion` | Descripción opcional |
| `orden` | Número para ordenar (1, 2, 3...) |

### Para subir fotos al Storage:
1. Supabase → Storage → bucket `portafolio`
2. Sube la foto
3. Clic derecho → "Get URL" → copia la URL pública
4. Pégala en el campo `url` de la tabla `portafolio`

### Para videos de YouTube:
Pega la URL normal del video no listado, ejemplo:
`https://www.youtube.com/watch?v=xxxxxxxxxxx`

## Próximas fases

- **Fase 2:** Panel de administración con login (Supabase Auth)
- **Fase 3:** Subida de fotos directo desde el panel
