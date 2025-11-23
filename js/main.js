// DocLite Main JavaScript
// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active navbar link highlighting
const navLinks = document.querySelectorAll('.navbar-link');
const sections = document.querySelectorAll('.tools-category');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Fade in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

document.querySelectorAll('.tool-card').forEach(card => {
    observer.observe(card);
});

// Lazy load ad slots
window.addEventListener('load', () => {
    const adSlots = document.querySelectorAll('.ad-slot');
    adSlots.forEach(ad => {
        // Simulate ad loading (replace with actual AdSense code)
        setTimeout(() => {
            ad.style.opacity = '1';
        }, 100);
    });
});

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.createElement('button');
    menuToggle.className = 'navbar-toggle';
    menuToggle.innerHTML = '<i class="ti ti-menu-2"></i>';
    menuToggle.setAttribute('aria-label', 'Toggle navigation');
    
    const navbarContainer = document.querySelector('.navbar-container');
    const navbarMenu = document.querySelector('.navbar-menu');
    
    if (navbarContainer && navbarMenu) {
        // Insert toggle button before the menu
        navbarContainer.insertBefore(menuToggle, navbarMenu);
        
        menuToggle.addEventListener('click', () => {
            navbarMenu.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navbarMenu.classList.contains('active')) {
                icon.classList.replace('ti-menu-2', 'ti-x');
            } else {
                icon.classList.replace('ti-x', 'ti-menu-2');
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && navbarMenu.classList.contains('active')) {
                navbarMenu.classList.remove('active');
                menuToggle.querySelector('i').classList.replace('ti-x', 'ti-menu-2');
            }
        });

        // Close menu when clicking a link
        navbarMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navbarMenu.classList.remove('active');
                menuToggle.querySelector('i').classList.replace('ti-x', 'ti-menu-2');
            });
        });
    }
});
