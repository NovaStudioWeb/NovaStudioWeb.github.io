document.addEventListener('DOMContentLoaded', () => {
    // 1. INICIALIZAR AOS (Animaciones)
    AOS.init({ 
        duration: 1000, 
        once: true,
        offset: 100
    });

    // 2. VARIABLES DE NAVEGACIÓN
    const navbar = document.querySelector('.navbar');
    const navbarCollapse = document.getElementById('navbarNav');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Inicializar el objeto Collapse de Bootstrap una sola vez
    const bsCollapse = new bootstrap.Collapse(navbarCollapse, { toggle: false });

    // 3. CONTROL DEL NAVBAR AL HACER SCROLL
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = "0.8rem 0";
            navbar.style.background = "rgba(5, 5, 5, 0.95)";
            navbar.style.boxShadow = "0 10px 30px rgba(0,0,0,0.5)";
        } else {
            navbar.style.padding = "1.2rem 0";
            navbar.style.background = "rgba(5, 5, 5, 0.8)";
            navbar.style.boxShadow = "none";
        }
    });

    // 4. LÓGICA DE CIERRE DEL MENÚ MÓVIL
    // Cerrar al hacer click en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 992 && navbarCollapse.classList.contains('show')) {
                bsCollapse.hide();
            }
        });
    });

    // Cerrar al hacer click afuera del menú
    document.addEventListener('click', (event) => {
        const isClickInsideMenu = navbarCollapse.contains(event.target);
        const isClickOnToggler = navbarToggler.contains(event.target);
        const isMenuOpen = navbarCollapse.classList.contains('show');

        if (isMenuOpen && !isClickInsideMenu && !isClickOnToggler) {
            bsCollapse.hide();
        }
    });

    // 5. AÑO AUTOMÁTICO EN EL FOOTER
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 6. MANEJO DEL FORMULARIO DE CONTACTO (EmailJS)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            // DETIENE LA RECARGA DE LA PÁGINA
            event.preventDefault();
            
            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            
            btn.disabled = true;
            btn.innerHTML = 'Enviando... <i class="fa-solid fa-spinner fa-spin ms-2"></i>';

            // Configuración EmailJS
            const serviceID = 'service_4xjpd4h';
            const templateID = 'template_whku6if';

            emailjs.sendForm(serviceID, templateID, this)
                .then(() => {
                    // --- MODIFICACIÓN: SWEETALERT SUCCESS ---
                    Swal.fire({
                        title: '¡Mensaje Recibido!',
                        text: 'Gracias por contactar a Nova Studio. Nos pondremos en contacto pronto.',
                        icon: 'success',
                        background: '#111111',       // Fondo oscuro
                        color: '#ffffff',            // Texto blanco
                        confirmButtonColor: '#00d2ff', // Botón Cyan
                        confirmButtonText: 'GENIAL',
                        customClass: {
                            popup: 'border border-secondary'
                        }
                    });
                    // ----------------------------------------

                    btn.innerHTML = '¡Enviado con éxito! <i class="fa-solid fa-check ms-2"></i>';
                    btn.style.background = '#28a745';
                    contactForm.reset();
                    
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.style.background = '';
                        btn.disabled = false;
                    }, 4000);
                }, (err) => {
                    // --- MODIFICACIÓN: SWEETALERT ERROR ---
                    Swal.fire({
                        title: 'Oops...',
                        text: 'Hubo un error al enviar el mensaje. Por favor intenta nuevamente.',
                        icon: 'error',
                        background: '#111111',
                        color: '#ffffff',
                        confirmButtonColor: '#8a2be2' // Botón Violeta
                    });
                    // --------------------------------------
                    
                    btn.disabled = false;
                    btn.innerHTML = 'Error al enviar <i class="fa-solid fa-xmark ms-2"></i>';
                    btn.style.background = '#dc3545';
                    console.error('EmailJS Error:', err);
                });
        });
    }
});

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