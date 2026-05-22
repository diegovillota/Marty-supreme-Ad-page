
const castData = [
  {
    id: 1,
    nombre: "Timothée Chalamet",
    rol: "Marty Mauser",
    descripcion: "Actor estadounidense que ganó la atencion del director con su papel en Call me by your name.",
    imagen: "img/tmt.jpg",
    favorito: false,
  },
  {
    id: 2,
    nombre: "Odessa A'zion",
    rol: "Rachel Mazler",
    descripcion: "Actriz estadounidense destacada por su papel protagonico en Hellraiser(2022).",
    imagen: "img/oaz.webp",
    favorito: false,
  },
  {
    id: 3,
    nombre: "Gwyneth Paltrow",
    rol: "Kay Stone",
    descripcion: "Ganadora del Oscar en 1999 a mejor actriz.",
    imagen: "img/pltrw.png",
    favorito: false,
  },
  {
    id: 4,
    nombre: "Josh Safdie",
    rol: "Director",
    descripcion: "Director Estadounidense conocido por Good Times y Uncut Gems.",
    imagen: "img/sfd.jpg",
    favorito: false,
  },
];

/* ── 2. ESTADO GLOBAL ── */
let favoritosActivos = false;
let terminoBusqueda = "";

/* ── 3. UTILIDADES ── */

const escaparHTML = (str) =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const getCastFiltrado = () => {
  let resultado = castData;

  if (favoritosActivos) {
    resultado = resultado.filter((p) => p.favorito);
  }

  if (terminoBusqueda.trim() !== "") {
    const termino = terminoBusqueda.toLowerCase();
    resultado = resultado.filter(
      (p) =>
        p.nombre.toLowerCase().includes(termino) ||
        p.rol.toLowerCase().includes(termino) ||
        p.descripcion.toLowerCase().includes(termino)
    );
  }

  return resultado;
};

/* ── 4. RENDER DINÁMICO ── */

const generarTarjetaHTML = (persona) => {
  const claseCorazon = persona.favorito ? "fav-btn activo" : "fav-btn";
  const iconoCorazon = persona.favorito ? "♥" : "♡";
  const labelFav = persona.favorito ? "Quitar de favoritos" : "Añadir a favoritos";

  return `
    <article class="cast-card" data-id="${persona.id}">
      <div class="cast-img-wrap">
        <img
          src="${escaparHTML(persona.imagen)}"
          alt="${escaparHTML(persona.nombre)}"
          loading="lazy"
          onerror="this.src='https://placehold.co/220x280/111/FF8000?text=Sin+foto'"
        />
      </div>
      <div class="cast-info">
        <h3 class="cast-nombre">${escaparHTML(persona.nombre)}</h3>
        <span class="cast-rol">${escaparHTML(persona.rol)}</span>
        <p class="cast-desc">${escaparHTML(persona.descripcion)}</p>
        <button
          class="${claseCorazon}"
          data-id="${persona.id}"
          aria-label="${labelFav}"
          title="${labelFav}"
        >${iconoCorazon}</button>
      </div>
    </article>
  `;
};

function renderizarCast() {
  const contenedor = document.querySelector("#cast-grid");
  if (!contenedor) return;

  const lista = getCastFiltrado();

  if (lista.length === 0) {
    let mensajeVacio = "Aún no tienes favoritos. ¡Haz clic en el corazón de cualquier tarjeta!";
    if (!favoritosActivos) {
      mensajeVacio = "No se encontraron resultados para: " + terminoBusqueda;
    }
    contenedor.innerHTML = '<p class="cast-vacio">' + mensajeVacio + "</p>";
    return;
  }

  let html = "";
  lista.forEach((persona) => {
    html += generarTarjetaHTML(persona);
  });
  contenedor.innerHTML = html;

  const botones = contenedor.querySelectorAll(".fav-btn");
  for (let i = 0; i < botones.length; i++) {
    botones[i].addEventListener("click", manejarFavorito);
  }
}

/* ── 5. SISTEMA DE FAVORITOS ── */

function manejarFavorito(e) {
  const id = parseInt(e.currentTarget.dataset.id, 10);

  for (let i = 0; i < castData.length; i++) {
    if (castData[i].id === id) {
      castData[i].favorito = !castData[i].favorito;
      break;
    }
  }

  actualizarContadorFavoritos();
  renderizarCast();
}

const actualizarContadorFavoritos = () => {
  const contador = document.querySelector("#fav-count");
  if (!contador) return;

  let total = 0;
  let idx = 0;
  while (idx < castData.length) {
    if (castData[idx].favorito) total++;
    idx++;
  }

  contador.textContent = total > 0 ? "(" + total + ")" : "";
};

/* ── 6. BÚSQUEDA DINÁMICA ── */

const manejarBusqueda = (e) => {
  terminoBusqueda = e.target.value;
  renderizarCast();
};

/* ── 7. TOGGLE FAVORITOS ── */

function toggleVistaFavoritos() {
  favoritosActivos = !favoritosActivos;

  const btn = document.querySelector("#btn-favoritos");
  if (btn) {
    btn.classList.toggle("activo", favoritosActivos);
    btn.textContent = favoritosActivos ? "♥ Mostrando favoritos" : "♡ Ver favoritos";
  }

  renderizarCast();
}

/* ── 8. INYECTAR SECCIÓN EN EL HTML ── */

function inyectarSeccionCast() {
  const seccion = document.createElement("section");
  seccion.id = "cast";
  seccion.className = "cast-section";
  seccion.setAttribute("aria-label", "Elenco y equipo");

  seccion.innerHTML =
    '<div class="cast-inner">' +
      '<h2>Elenco &amp; Equipo</h2>' +
      '<p class="cast-sub">Conoce a los protagonistas de esta historia</p>' +
      '<div class="cast-controles">' +
        '<input type="search" id="cast-search" class="cast-search" placeholder="Buscar por nombre o rol..." aria-label="Buscar en el elenco" />' +
        '<button id="btn-favoritos" class="btn btn-secondary btn-fav-toggle">&#9825; Ver favoritos</button>' +
        '<span id="fav-count" class="fav-count"></span>' +
      "</div>" +
      '<div id="cast-grid" class="cast-grid"></div>' +
    "</div>";

  const footer = document.querySelector(".site-footer");
  if (footer) {
    footer.parentNode.insertBefore(seccion, footer);
  }
}

/* ── 9. ESTILOS DINÁMICOS ── */

function inyectarEstilosCast() {
  const tag = document.createElement("style");
  tag.id = "cast-dynamic-styles";
  tag.textContent =
    ".cast-section { padding: 60px 0 20px; }" +
    ".cast-inner { max-width: 1320px; margin: 0 auto; padding: 0 24px; }" +
    ".cast-inner h2 { margin: 0 0 8px; font-size: clamp(1.8rem, 3vw, 2.6rem); font-weight: 800; }" +
    ".cast-sub { color: #b8b8b8; margin: 0 0 32px; font-size: 1rem; }" +
    ".cast-controles { display: flex; gap: 14px; align-items: center; flex-wrap: wrap; margin-bottom: 32px; }" +
    ".cast-search { flex: 1; min-width: 200px; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.14); border-radius: 999px; padding: 12px 20px; font-size: .97rem; color: #f4f4f4; font-family: inherit; outline: none; transition: border-color .2s ease; }" +
    ".cast-search::placeholder { color: rgba(255,255,255,.3); }" +
    ".cast-search:focus { border-color: #FF8000; }" +
    ".btn-fav-toggle { border-radius: 999px; padding: 12px 22px; font-size: .9rem; }" +
    ".btn-fav-toggle.activo { background: #FF8000; color: #050505; border-color: #FF8000; }" +
    ".fav-count { color: #FF8000; font-weight: 700; font-size: .95rem; }" +
    ".cast-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 24px; }" +
    ".cast-vacio { grid-column: 1 / -1; text-align: center; color: #b8b8b8; padding: 40px 0; font-size: 1rem; }" +
    ".cast-card { background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.08); border-radius: 20px; overflow: hidden; transition: transform .25s ease, box-shadow .25s ease; display: flex; flex-direction: column; }" +
    ".cast-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(0,0,0,.5); }" +
    ".cast-img-wrap { overflow: hidden; height: 220px; }" +
    ".cast-img-wrap img { width: 100%; height: 100%; object-fit: cover; object-position: top; display: block; transition: transform .4s ease; }" +
    ".cast-card:hover .cast-img-wrap img { transform: scale(1.04); }" +
    ".cast-info { padding: 16px; display: flex; flex-direction: column; gap: 6px; flex: 1; }" +
    ".cast-nombre { margin: 0; font-size: 1rem; font-weight: 700; }" +
    ".cast-rol { font-size: .78rem; color: #FF8000; text-transform: uppercase; letter-spacing: .08em; }" +
    ".cast-desc { margin: 4px 0 0; font-size: .85rem; color: #c0c0c0; line-height: 1.55; flex: 1; }" +
    ".fav-btn { align-self: flex-end; background: transparent; border: 1px solid rgba(255,255,255,.15); border-radius: 999px; color: #b8b8b8; cursor: pointer; font-size: 1.1rem; padding: 6px 14px; margin-top: 10px; transition: background .2s ease, color .2s ease, border-color .2s ease; }" +
    ".fav-btn:hover { border-color: #FF8000; color: #FF8000; }" +
    ".fav-btn.activo { background: rgba(255,128,0,.15); color: #FF8000; border-color: #FF8000; }";

  document.head.appendChild(tag);
}

/* ── 10. AGREGAR ELENCO AL NAV ── */

function agregarLinkNav() {
  const navLinks = document.querySelector(".nav-links");
  if (!navLinks) return;
  if (navLinks.querySelector('a[href="#cast"]')) return;

  const li = document.createElement("li");
  const a = document.createElement("a");
  a.href = "#cast";
  a.textContent = "Elenco";
  li.appendChild(a);
  navLinks.appendChild(li);
}

/* ── 11. INICIALIZACIÓN ── */

function init() {
  inyectarEstilosCast();
  inyectarSeccionCast();
  agregarLinkNav();
  renderizarCast();

  const inputBusqueda = document.querySelector("#cast-search");
  if (inputBusqueda) {
    inputBusqueda.addEventListener("input", manejarBusqueda);
  }

  const btnFav = document.querySelector("#btn-favoritos");
  if (btnFav) {
    btnFav.addEventListener("click", toggleVistaFavoritos);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}