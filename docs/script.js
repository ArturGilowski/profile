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

    // Dropdown mobile toggle
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                // Prevent routing if main link is clicked
                if (e.target.tagName !== 'I' && !e.target.classList.contains('nav-link')) return;
                e.preventDefault(); 
                dropdown.classList.toggle('active');
            }
        });
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
                    formStatus.textContent = 'Sukces! Twoja wiadomość została wysłana.';
                    formStatus.style.color = '#27c93f';
                    formStatus.style.background = 'rgba(39, 201, 63, 0.1)';
                    formStatus.style.borderColor = 'rgba(39, 201, 63, 0.3)';
                } else {
                    return response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            formStatus.textContent = data["errors"].map(error => error["message"]).join(", ");
                        } else {
                            formStatus.textContent = 'Wystąpił problem przy wysyłaniu. Spróbuj ponownie później.';
                        }
                        formStatus.classList.remove('hidden');
                        formStatus.style.color = '#ff5f56';
                    });
                }
            })
.catch(error => {
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

    // 5. Floating Contact Widget
    const floatingContact = document.createElement('div');
    floatingContact.className = 'floating-contact animate-on-scroll';
    floatingContact.innerHTML = `
        <div class="floating-contact-header" data-i18n="widget_title">Skontaktuj się ze mną</div>
        <div class="floating-contact-item">
            <i class="fab fa-whatsapp"></i>
            <a href="https://wa.me/48514126061" target="_blank" rel="noopener noreferrer">+48 514 126 061</a>
        </div>
        <div class="floating-contact-item">
            <i class="fas fa-envelope"></i>
            <a href="mailto:artugilowski@gmail.com">artugilowski@gmail.com</a>
        </div>
    `;
    document.body.appendChild(floatingContact);
    
    // Add small delay to trigger CSS transition
    setTimeout(() => floatingContact.classList.add('visible'), 100);

    // 6. Scroll Axis (Progress & ScrollSpy)
    const scrollAxis = document.querySelector('.scroll-axis');
    if (scrollAxis) {
        const axisProgress = document.getElementById('axis-progress');
        const axisItems = document.querySelectorAll('.axis-item');
        const sections = Array.from(axisItems).map(item => document.getElementById(item.dataset.target));

        // Update Progress Line
        const updateAxisProgress = () => {
            const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollTotal <= 0) return;
            const scrollPercent = (window.scrollY / scrollTotal) * 100;
            if (axisProgress) axisProgress.style.height = `${scrollPercent}%`;
        };

        window.addEventListener('scroll', updateAxisProgress);
        updateAxisProgress(); // Initial call

        // ScrollSpy Observer
        const spyOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px', // Focus on top-ish section of screen
            threshold: 0
        };

        const spyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    axisItems.forEach(item => {
                        item.classList.toggle('active', item.dataset.target === id);
                    });
                }
            });
        }, spyOptions);

        sections.forEach(section => {
            if (section) spyObserver.observe(section);
        });
    }

    // 7. Cookie Banner Logic
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieBtn = document.getElementById('cookie-accept');

    if (cookieBanner && cookieBtn) {
        // Check if already accepted
        if (!localStorage.getItem('cookiesAccepted')) {
            setTimeout(() => {
                cookieBanner.classList.add('visible');
            }, 2000);
        }

        cookieBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.classList.remove('visible');
        });
    }
});
