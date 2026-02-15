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

// --- FUNCIÓN GENERADORA DE HTML (REUTILIZABLE PARA NO REPETIR CÓDIGO) ---
function createCardHTML(project, index, columnClass = 'col-md-6') {
    return `
        <div class="${columnClass} project-item" data-aos="fade-up" data-aos-delay="${index * 100}">
            <div class="project-card h-100 overflow-hidden rounded-4 border-0 shadow-sm position-relative">
                <div class="project-img-container" style="height: 400px;">
                    <img src="${project.image}" class="img-fluid w-100 h-100 object-fit-cover" alt="${project.title}">
                    
                    <div class="project-overlay d-flex flex-column justify-content-end p-4">
                        <span class="badge ${project.badge_color || 'bg-primary'} mb-2 w-fit">
                            ${project.display_category}
                        </span>
                        
                        <h3 class="text-white fw-bold mb-1">${project.title}</h3>
                        <p class="text-white-50 small mb-3 text-truncate">
                            ${project.description}
                        </p>
                        
                        <a href="${project.link}" class="text-cyan text-decoration-none fw-bold stretched-link">
                            Ver Proyecto <i class="fas fa-arrow-right ms-2"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
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