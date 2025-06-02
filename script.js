// script.js
document.addEventListener('DOMContentLoaded', function() {
    const siteHeader = document.getElementById('siteHeader');
    const mainNav = document.getElementById('mainNav'); // Asegúrate que tu nav tenga este ID
    const mobileMenuButton = document.getElementById('mobileMenuBtn'); // Asegúrate que tu botón tenga este ID

    // --- HEADER THEME BASED ON SECTION BACKGROUND & SCROLL DEPTH ---
    let lastKnownScrollPosition = 0;
    let ticking = false;

    function adaptHeaderTheme(scrollPos) {
        if (!siteHeader) return; // Salir si el header no existe

        // 1. Manejo de borde sutil al hacer un poco de scroll
        if (scrollPos > 30) {
            siteHeader.classList.add('has-scrolled-thoda');
        } else {
            siteHeader.classList.remove('has-scrolled-thoda');
        }

        // 2. Detección de sección actual para tema claro/oscuro
        let currentSectionTheme = 'light-bg'; // Default para el body o secciones sin clase específica
        const sections = document.querySelectorAll('main > section[id]');
        const headerRect = siteHeader.getBoundingClientRect();
        const headerBottom = headerRect.top + scrollPos + headerRect.height;


        // Si estamos muy arriba (dentro del hero), forzar tema oscuro
        const heroSection = document.getElementById('inicio'); // Asumiendo que el hero tiene ID 'inicio'
        if (heroSection) {
            const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
            if (headerBottom < heroBottom - 50) { // Si el final del header está bien dentro del hero
                 siteHeader.setAttribute('data-theme', 'dark-bg');
                 ticking = false; // Reset ticking after direct set
                 return; // Salir temprano, ya establecimos el tema del hero
            }
        }


        for (let section of sections) {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            // Consideramos que una sección "activa" es aquella cuyo inicio está por encima
            // del final del header, y cuyo final está por debajo del inicio del header.
            // O una sección que ocupa la mayor parte de la vista debajo del header.
            // Este es un punto de detección simple, puede requerir ajustes.
            // Punto de detección: un poco por debajo del header
            const detectionPoint = scrollPos + headerRect.height + 20;

            if (detectionPoint >= sectionTop && detectionPoint < sectionBottom) {
                if (section.classList.contains('bg-azul-noche') || section.id === 'inicio') {
                    currentSectionTheme = 'dark-bg';
                } else {
                    currentSectionTheme = 'light-bg';
                }
                break; // Encontramos la sección activa
            }
        }
        siteHeader.setAttribute('data-theme', currentSectionTheme);
    }

    if (siteHeader) {
        adaptHeaderTheme(window.scrollY); // Estado inicial
        window.addEventListener('scroll', function() {
            lastKnownScrollPosition = window.scrollY;
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    adaptHeaderTheme(lastKnownScrollPosition);
                    ticking = false;
                });
                ticking = true;
            }
        });
    }


    // --- MOBILE MENU ---
    if (mobileMenuButton && mainNav) {
        mobileMenuButton.addEventListener('click', function() {
            mainNav.classList.toggle('is-open');
            const isOpen = mainNav.classList.contains('is-open');
            this.setAttribute('aria-expanded', isOpen);
             if (isOpen) {
                this.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'; // Icono X
            } else {
                this.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>'; // Icono Hamburguesa
            }
        });
    }

    // --- SMOOTH SCROLL FOR ANCHOR LINKS ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId.length > 1 && document.querySelector(targetId)) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                const headerOffset = siteHeader ? siteHeader.offsetHeight : 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                if (mainNav && mainNav.classList.contains('is-open')) {
                    mainNav.classList.remove('is-open');
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                    mobileMenuButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
                }
            }
        });
    });


    // --- HERO SLIDESHOW ---
     const heroSlides = document.querySelectorAll('.hero-slide-bg');
    let currentHeroSlide = 0;
    const heroSlideInterval = 7000;

    function nextHeroSlide() {
        if (heroSlides.length === 0) return;
        heroSlides[currentHeroSlide].classList.remove('active');
        currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
        heroSlides[currentHeroSlide].classList.add('active');
    }
    if (heroSlides.length > 1) {
        if (heroSlides[0]) heroSlides[0].classList.add('active'); // Asegurar que el primero esté activo
        setInterval(nextHeroSlide, heroSlideInterval);
    } else if (heroSlides.length === 1) {
        if (heroSlides[0]) heroSlides[0].classList.add('active');
    }


    // --- SCROLL REVEAL ANIMATIONS ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => { revealObserver.observe(el); });


    // Active Nav Link Highlighting
    const navLinks = document.querySelectorAll('.main-navigation a');
    const currentUrlPath = window.location.pathname.split('/').pop();

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop().split('#')[0];
        if (link.classList.contains('active')) link.classList.remove('active'); // Reset
        if (linkPath === currentUrlPath && currentUrlPath !== '' && currentUrlPath !== 'index.html') {
            link.classList.add('active');
        } else if ((currentUrlPath === '' || currentUrlPath === 'index.html') && link.getAttribute('href') === '#inicio') {
            link.classList.add('active');
        }
    });

    if (currentUrlPath === '' || currentUrlPath === 'index.html') {
        const sectionsForNav = document.querySelectorAll('main > section[id]');
        const headerHeightForNav = siteHeader ? siteHeader.offsetHeight : 70;

        const sectionNavObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                const id = entry.target.getAttribute('id');
                const navLink = document.querySelector(`.main-navigation a[href="#${id}"]`);
                if (navLink) {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.2) { // Umbral para activar
                        navLinks.forEach(el => el.classList.remove('active'));
                        navLink.classList.add('active');
                    }
                }
            });
        }, { rootMargin: `-${headerHeightForNav}px 0px -65% 0px`, threshold: [0.2, 0.8] }); // Ajustar estos valores

        sectionsForNav.forEach(section => {
            if (section.id) sectionNavObserver.observe(section);
        });
    }

    console.log("Sitio Dra. Martina - Tema 'Clínica de Prestigio' Activado.");
});