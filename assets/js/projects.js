document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
});

let allProjects = []; 

async function loadProjects() {
    try {
        const response = await fetch('./assets/data/projectos.json'); 
        allProjects = await response.json();

        // 1. DETECTAR SI ESTAMOS EN LA PÁGINA DE PORTAFOLIO (projects.html)
        const portfolioContainer = document.getElementById('projects-container');
        if (portfolioContainer) {
            renderProjects(allProjects); // Cargar todos
        }

        // 2. DETECTAR SI ESTAMOS EN EL HOME (index.html)
        const featuredContainer = document.getElementById('featured-projects');
        if (featuredContainer) {
            renderFeaturedProjects(allProjects); // Cargar solo los destacados
        }

    } catch (error) {
        console.error('Error cargando proyectos:', error);
    }
}

// --- LÓGICA PARA PROJECTS.HTML (TODOS LOS PROYECTOS) ---
function renderProjects(projects) {
    const container = document.getElementById('projects-container');
    container.innerHTML = ''; 

    projects.forEach((project, index) => {
        container.innerHTML += createCardHTML(project, index);
    });

    refreshAOS();
}

// --- LÓGICA PARA INDEX.HTML (SOLO DESTACADOS / UNO POR CATEGORÍA) ---
function renderFeaturedProjects(projects) {
    const container = document.getElementById('featured-projects');
    container.innerHTML = '';

    // Lógica Inteligente: Invertir orden y sacar 1 de cada categoría
    const newestFirst = [...projects].reverse();
    const uniqueCategories = new Map();
    
    newestFirst.forEach(project => {
        if (!uniqueCategories.has(project.category)) {
            uniqueCategories.set(project.category, project);
        }
    });

    // Convertir a array y tomar máximo 3
    const featured = Array.from(uniqueCategories.values()).slice(0, 3);

    featured.forEach((project, index) => {
        // En el home usamos col-md-4 porque son 3 columnas, en portafolio col-md-6
        // Así que pasamos 'col-md-4' como argumento extra a la función creadora
        container.innerHTML += createCardHTML(project, index, 'col-md-4');
    });

    refreshAOS();
}

// --- FUNCIÓN GENERADORA DE HTML ACTUALIZADA ---
function createCardHTML(project, index, columnClass = 'col-md-6') {
    return `
        <div class="${columnClass} project-item" data-aos="fade-up" data-aos-delay="${index * 100}">
            <div id="card-${index}" class="project-card-premium h-100 overflow-hidden rounded-4 border-0 position-relative group">
                
                <div class="project-img-container" style="height: 420px;">
                    <img src="${project.image}" class="img-fluid w-100 h-100 object-fit-cover transition-transform duration-500" alt="${project.title}">
                    
                    <div class="position-absolute top-0 start-0 w-100 p-4 d-flex justify-content-between align-items-start bg-gradient-top pointer-events-none">
                        <span class="badge ${project.badge_color || 'bg-primary'} border border-white border-opacity-25 shadow-sm px-3 py-2">
                            ${project.display_category}
                        </span>
                        
                        <div class="tech-icon bg-dark bg-opacity-75 rounded-circle p-2 text-white border border-white border-opacity-25 backdrop-blur cursor-pointer hover-glow" 
                             style="pointer-events: auto; z-index: 10; transition: 0.3s;"
                             onclick="toggleDescription(${index}, event)"
                             title="Ver descripción completa">
                            <i class="fas fa-bolt text-cyan"></i>
                        </div>
                    </div>
                </div>

                <div class="project-overlay d-flex flex-column justify-content-end p-3">
                    <div class="glass-info glass-panel p-4 rounded-4 border border-white border-opacity-10 backdrop-blur">
                        
                        <div class="d-flex justify-content-between align-items-end header-row">
                            <div class="text-content w-100">
                                <h3 class="text-white fw-bold mb-1 h4 text-shadow">${project.title}</h3>
                                
                                <div class="desc-wrapper">
                                    <p class="text-white-75 small mb-0 description-text text-truncate">
                                        ${project.description}
                                    </p>
                                </div>
                            </div>
                            
                            <a href="${project.link}" class="btn-icon-action stretched-link d-flex align-items-center justify-content-center bg-white text-dark rounded-circle shadow-lg hover-scale ms-3">
                                <i class="fas fa-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    `;
}

// --- NUEVA FUNCIÓN PARA EXPANDIR/CONTRAER ---
function toggleDescription(id, event) {
    // 1. Evitar que el click nos lleve al link del proyecto
    event.preventDefault(); 
    event.stopPropagation();

    // 2. Seleccionar la tarjeta
    const card = document.getElementById(`card-${id}`);
    
    // 3. Alternar la clase 'expanded'
    card.classList.toggle('expanded');
}

// --- FILTRADO (SOLO SE USA EN PROJECTS.HTML) ---
function filterProjects(category) {
    const buttons = document.querySelectorAll('.btn-nova-outline');
    buttons.forEach(btn => {
        btn.classList.remove('active'); 
        if(btn.textContent.toLowerCase().includes(category) || (category === 'all' && btn.textContent === 'Todos')) {
            btn.classList.add('active');
        }
    });

    if (category === 'all') {
        renderProjects(allProjects);
    } else {
        const filtered = allProjects.filter(p => p.category.toLowerCase() === category.toLowerCase());
        renderProjects(filtered);
    }
}

// Utilidad para refrescar animaciones
function refreshAOS() {
    if (typeof AOS !== 'undefined') {
        setTimeout(() => AOS.refresh(), 500);
    }
}

/* =========================================
   6. SEGURIDAD Y PREVENCIÓN
   ========================================= */

// Deshabilitar menú contextual
document.addEventListener('contextmenu', event => event.preventDefault());

// Bloquear atajos de teclado de herramientas de desarrollador
document.onkeydown = function(e) {
    if(e.keyCode == 123 || 
      (e.ctrlKey && e.shiftKey && (e.keyCode == 73 || e.keyCode == 74)) || 
      (e.ctrlKey && e.keyCode == 85)) {
        return false;
    }
}