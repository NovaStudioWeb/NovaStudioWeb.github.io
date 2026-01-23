document.addEventListener('DOMContentLoaded', () => {
    // Inicializar AOS
    AOS.init({ 
        duration: 1000, 
        once: true,
        offset: 100
    });

    // Control del Navbar al hacer Scroll
    const navbar = document.querySelector('.navbar');
    
    window.onscroll = () => {
        if (window.scrollY > 50) {
            navbar.style.padding = "0.8rem 0";
            navbar.style.background = "rgba(5, 5, 5, 0.95)";
            navbar.style.boxShadow = "0 10px 30px rgba(0,0,0,0.5)";
        } else {
            navbar.style.padding = "1.2rem 0";
            navbar.style.background = "rgba(5, 5, 5, 0.8)";
            navbar.style.boxShadow = "none";
        }
    };

    // Actualizar año automáticamente en el footer
    const yearSpan = document.getElementById('year');
    if(yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Cerrar menú móvil al hacer click en un enlace
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.getElementById('navbarNav');
    const bsCollapse = new bootstrap.Collapse(menuToggle, {toggle: false});
    
    navLinks.forEach((l) => {
        l.addEventListener('click', () => { 
            if (window.innerWidth < 992) { bsCollapse.hide(); }
        });
    });
});

// Manejo del Formulario de Contacto
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const btn = this.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        
        btn.disabled = true;
        btn.innerHTML = 'Enviando... <i class="fa-solid fa-spinner fa-spin ms-2"></i>';

        // Estos IDs los obtienes de tu panel de EmailJS
        const serviceID = 'service_4xjpd4h';
        const templateID = 'template_whku6if'; // Tu Template ID

        emailjs.sendForm(serviceID, templateID, this)
            .then(() => {
                btn.innerHTML = '¡Enviado con éxito! <i class="fa-solid fa-check ms-2"></i>';
                btn.style.background = '#28a745';
                contactForm.reset();
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 4000);
            }, (err) => {
                btn.disabled = false;
                btn.innerHTML = 'Error al enviar <i class="fa-solid fa-xmark ms-2"></i>';
                btn.style.background = '#dc3545';
                alert(JSON.stringify(err));
            });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    AOS.init({ duration: 1000, once: true });

    // Año automático
    const year = document.getElementById('year');
    if(year) year.textContent = new Date().getFullYear();

    // Cerrar menú móvil al clickear un enlace
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.getElementById('navbarNav');
    const bsCollapse = new bootstrap.Collapse(menuToggle, {toggle: false});
    
    navLinks.forEach((l) => {
        l.addEventListener('click', () => {
            if (window.innerWidth < 992) { bsCollapse.hide(); }
        });
    });
});