document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
});

let allProjects = []; 

async function loadProjects() {
    try {
        const response = await fetch('./assets/data/projectos.json'); 
        allProjects = await response.json();

        // 1. LÓGICA PORTFOLIO (projects.html) -> Diseño Premium
        const portfolioContainer = document.getElementById('projects-container');
        if (portfolioContainer) {
            renderProjects(allProjects); 
        }

        // 2. LÓGICA HOME (index.html) -> Diseño Compacto
        const featuredContainer = document.getElementById('featured-projects');
        if (featuredContainer) {
            renderFeaturedProjects(allProjects); 
        }

    } catch (error) {
        console.error('Error cargando proyectos:', error);
    }
}

// ==========================================
// RENDERIZADO: PORTFOLIO (projects.html)
// ==========================================
function renderProjects(projects) {
    const container = document.getElementById('projects-container');
    container.innerHTML = ''; 

    projects.forEach((project, index) => {
        // Llamamos a la tarjeta PREMIUM
        container.innerHTML += createPortfolioCard(project, index);
    });

    refreshAOS();
}

// ==========================================
// RENDERIZADO: HOME (index.html)
// ==========================================
function renderFeaturedProjects(projects) {
    const container = document.getElementById('featured-projects');
    container.innerHTML = '';

    // Lógica: Invertir y tomar 3 destacados (uno por categoría)
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
        // Llamamos a la tarjeta HOME (Nueva función)
        container.innerHTML += createHomeCard(project, index);
    });

    refreshAOS();
}

/* -----------------------------------------------------
   DISEÑO A: TARJETA PREMIUM (Para projects.html)
   ----------------------------------------------------- */
function createPortfolioCard(project, index) {
    const { 
        image, title, description, link, display_category, 
        badge_color = 'bg-primary' 
    } = project;

    return `
        <div class="col-md-6 project-item" data-aos="fade-up" data-aos-delay="${index * 100}">
            <div id="card-${index}" class="project-card-premium h-100 overflow-hidden rounded-4 border-0 position-relative group">
                
                <div class="project-img-container" style="height: 420px;">
                    <img src="${image}" 
                         class="img-fluid w-100 h-100 object-fit-cover transition-transform duration-500" 
                         alt="${title}" 
                         loading="lazy">
                    
                    <div class="position-absolute top-0 start-0 w-100 p-4 d-flex justify-content-between align-items-start bg-gradient-top pointer-events-none">
                        <span class="badge ${badge_color} border border-white border-opacity-25 shadow-sm px-3 py-2">
                            ${display_category}
                        </span>
                        
                        <div class="tech-icon bg-dark bg-opacity-75 rounded-circle p-2 text-white border border-white border-opacity-25 backdrop-blur cursor-pointer hover-glow" 
                             style="pointer-events: auto; z-index: 10; transition: 0.3s;"
                             onclick="toggleDescription(${index}, event)"
                             role="button"
                             title="Ver descripción completa">
                            <i class="fas fa-bolt text-cyan"></i>
                        </div>
                    </div>
                </div>

                <div class="project-overlay d-flex flex-column justify-content-end p-3">
                    <div class="glass-info glass-panel p-4 rounded-4 border border-white border-opacity-10 backdrop-blur">
                        <div class="d-flex justify-content-between align-items-end header-row">
                            <div class="text-content w-100">
                                <h3 class="text-white fw-bold mb-1 h4 text-shadow">${title}</h3>
                                <div class="desc-wrapper">
                                    <p class="text-white-75 small mb-0 description-text text-truncate">
                                        ${description}
                                    </p>
                                </div>
                            </div>
                            <a href="${link}" 
                               class="btn-icon-action stretched-link d-flex align-items-center justify-content-center bg-white text-dark rounded-circle shadow-lg hover-scale ms-3"
                               aria-label="Ver proyecto ${title}">
                                <i class="fas fa-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/* -----------------------------------------------------
   DISEÑO B: TARJETA COMPACTA (Para index.html)
   ----------------------------------------------------- */
function createHomeCard(project, index) {
    const { image, title, link, display_category, badge_color = 'bg-primary' } = project;

    // Diseño simplificado: Imagen + Gradiente + Título. Sin descripción larga ni rayo.
    return `
        <div class="col-md-4 project-item" data-aos="zoom-in" data-aos-delay="${index * 100}">
            <div class="home-project-card h-100 rounded-4 overflow-hidden position-relative border border-secondary border-opacity-25 bg-black">
                
                <div class="img-wrapper" style="height: 320px;">
                    <img src="${image}" 
                         class="w-100 h-100 object-fit-cover hover-zoom transition-transform duration-700" 
                         alt="${title}" 
                         loading="lazy">
                </div>

                <div class="position-absolute bottom-0 start-0 w-100 p-4 bg-gradient-dark d-flex flex-column justify-content-end">
                    <span class="badge ${badge_color} w-fit mb-2 small shadow-sm">${display_category}</span>
                    <h4 class="text-white fw-bold mb-1 h5">${title}</h4>
                    
                    <a href="${link}" class="stretched-link text-white text-decoration-none small mt-1 opacity-75 hover-opacity-100">
                        Ver caso de estudio <i class="fas fa-arrow-right ms-1"></i>
                    </a>
                </div>

            </div>
        </div>
    `;
}

// --- UTILIDADES ---

function toggleDescription(id, event) {
    event.preventDefault(); 
    event.stopPropagation();
    const card = document.getElementById(`card-${id}`);
    if (card) card.classList.toggle('expanded');
}

function filterProjects(category) {
    const buttons = document.querySelectorAll('.btn-nova-outline');
    buttons.forEach(btn => {
        btn.classList.remove('active'); 
        if(btn.textContent.toLowerCase().includes(category) || (category === 'all' && btn.textContent === 'Todos')) {
            btn.classList.add('active');
        }
    });

    // IMPORTANTE: Al filtrar, usamos createPortfolioCard porque el filtro solo está en projects.html
    const container = document.getElementById('projects-container');
    if (!container) return; // Seguridad si se llama desde index por error

    container.innerHTML = ''; 

    if (category === 'all') {
        allProjects.forEach((p, i) => container.innerHTML += createPortfolioCard(p, i));
    } else {
        const filtered = allProjects.filter(p => p.category.toLowerCase() === category.toLowerCase());
        filtered.forEach((p, i) => container.innerHTML += createPortfolioCard(p, i));
    }
    refreshAOS();
}

function refreshAOS() {
    if (typeof AOS !== 'undefined') {
        setTimeout(() => AOS.refresh(), 500);
    }
}

/* =========================================
   6. SEGURIDAD Y PREVENCIÓN
   ========================================= */
document.addEventListener('contextmenu', event => event.preventDefault());
document.onkeydown = function(e) {
    if(e.keyCode == 123 || (e.ctrlKey && e.shiftKey && (e.keyCode == 73 || e.keyCode == 74)) || (e.ctrlKey && e.keyCode == 85)) {
        return false;
    }
}