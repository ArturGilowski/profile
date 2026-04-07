document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar i Scroll
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = hamburger.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Animacje Intersection Observer
    const fadeElements = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(element => {
        observer.observe(element);
    });

    // 3. Formularz Kontaktowy
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Wysyłanie...';
            btn.disabled = true;

            const formData = new FormData(contactForm);
            
            fetch(contactForm.action, {
                method: contactForm.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    contactForm.reset();
                    formStatus.classList.remove('hidden');
                    formStatus.textContent = 'Wiadomość została wysłana pomyślnie! Odezwę się wkrótce.';
                    formStatus.style.color = '#27c93f';
                    formStatus.style.background = 'rgba(39, 201, 63, 0.1)';
                    formStatus.style.borderColor = 'rgba(39, 201, 63, 0.3)';
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            formStatus.textContent = data["errors"].map(error => error["message"]).join(", ");
                        } else {
                            formStatus.textContent = 'Oops! Wystąpił problem przy wysyłaniu formularza.';
                        }
                        formStatus.classList.remove('hidden');
                        formStatus.style.color = '#ff5f56';
                        formStatus.style.background = 'rgba(255, 95, 86, 0.1)';
                        formStatus.style.borderColor = 'rgba(255, 95, 86, 0.3)';
                    });
                }
            }).catch(error => {
                formStatus.textContent = 'Wiadomość została wysłana pomyślnie! Odezwę się wkrótce. (tryb demo)';
                formStatus.classList.remove('hidden');
                formStatus.style.color = '#27c93f';
                formStatus.style.background = 'rgba(39, 201, 63, 0.1)';
                formStatus.style.borderColor = 'rgba(39, 201, 63, 0.3)';
                contactForm.reset();
            }).finally(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                
                setTimeout(() => {
                    formStatus.classList.add('hidden');
                }, 5000);
            });
        });
    }

    // 4. Back to top button
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
