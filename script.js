document.addEventListener('DOMContentLoaded', () => {
  // ===== DOM Elements =====
  const DOM = {
    body: document.body,
    header: document.querySelector('.header'),
    hamburger: document.querySelector('.hamburger'),
    navLinks: document.querySelector('.nav-links'),
    navItems: document.querySelectorAll('.nav-link'),
    backToTop: document.querySelector('.back-to-top'),
    sections: document.querySelectorAll('section'),
    contactForm: document.getElementById('contact-form'),
    portfolioItems: document.querySelectorAll('.portfolio-item'),
    filterButtons: document.querySelectorAll('.filter-btn'),
    testimonials: document.querySelectorAll('.testimonial'),
    heroImage: document.querySelector('.hero-image img'),
    serviceCards: document.querySelectorAll('.service-card'),
    yearElement: document.getElementById('year')
  };

  // ===== Initialize All Functions =====
  function init() {
    setCurrentYear();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initPortfolioFilter();
    initTestimonialSlider();
    initContactForm();
    initBackToTop();
    initHoverEffects();
    initPageLoadAnimations();
  }

  // ===== Set Current Year in Footer =====
  function setCurrentYear() {
    DOM.yearElement.textContent = new Date().getFullYear();
  }

  // ===== Mobile Navigation =====
  function initMobileMenu() {
    DOM.hamburger.addEventListener('click', () => {
      const isExpanded = DOM.hamburger.classList.toggle('active');
      DOM.navLinks.classList.toggle('active');
      DOM.body.classList.toggle('no-scroll');
      DOM.hamburger.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when clicking on nav items
    DOM.navItems.forEach(item => {
      item.addEventListener('click', () => {
        if (DOM.navLinks.classList.contains('active')) {
          DOM.navLinks.classList.remove('active');
          DOM.hamburger.classList.remove('active');
          DOM.body.classList.remove('no-scroll');
          DOM.hamburger.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // ===== Smooth Scrolling =====
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const headerHeight = DOM.header.offsetHeight;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Update URL without jumping
          history.pushState(null, null, targetId);
        }
      });
    });
  }

  // ===== Scroll Animations =====
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          sectionObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    DOM.sections.forEach(section => {
      sectionObserver.observe(section);
    });

    // Header scroll effect
    window.addEventListener('scroll', () => {
      const scrollPosition = window.scrollY;
      
      // Header background effect
      DOM.header.classList.toggle('scrolled', scrollPosition > 100);
      
      // Back to top button
      DOM.backToTop.classList.toggle('visible', scrollPosition > 500);
      
      // Active nav link highlighting
      highlightActiveNavLink(scrollPosition);
    });
  }

  function highlightActiveNavLink(scrollPosition) {
    DOM.sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        DOM.navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${sectionId}`) {
            item.classList.add('active');
          }
        });
      }
    });
  }

  // ===== Portfolio Filtering =====
// Portfolio Filter
function initPortfolioFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      button.classList.add('active');
      
      const filterValue = button.getAttribute('data-filter');
      
      // Filter portfolio items
      portfolioItems.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
  initPortfolioFilter();
});

  // ===== Testimonial Slider =====
  function initTestimonialSlider() {
    let currentSlide = 0;
    const slideCount = DOM.testimonials.length;
    
    function showSlide(index) {
      DOM.testimonials.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
    }
    
    // Auto-rotate testimonials
    const slideInterval = setInterval(() => {
      currentSlide = (currentSlide + 1) % slideCount;
      showSlide(currentSlide);
    }, 5000);
    
    // Pause on hover
    const sliderContainer = document.querySelector('.testimonial-slider');
    if (sliderContainer) {
      sliderContainer.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
      });
      
      sliderContainer.addEventListener('mouseleave', () => {
        setInterval(() => {
          currentSlide = (currentSlide + 1) % slideCount;
          showSlide(currentSlide);
        }, 5000);
      });
    }
    
    // Initial display
    showSlide(0);
  }

  // ===== Contact Form Handling =====
  function initContactForm() {
    if (!DOM.contactForm) return;
    
    DOM.contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(DOM.contactForm);
      const formElements = DOM.contactForm.elements;
      
      // Validate form
      if (!validateForm(formElements)) return;
      
      try {
        // Simulate form submission
        await submitForm(formData);
        
        // Show success message
        showFormFeedback('success', 'Thank you! Your message has been sent.');
        
        // Reset form
        DOM.contactForm.reset();
        
      } catch (error) {
        showFormFeedback('error', 'There was an error sending your message. Please try again.');
      }
    });
    
    // Input validation on blur
    DOM.contactForm.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('blur', () => validateInput(input));
    });
  }

  function validateForm(formElements) {
    let isValid = true;
    
    Array.from(formElements).forEach(element => {
      if (element.required && !element.value.trim()) {
        isValid = false;
        showInputError(element, 'This field is required');
      } else if (element.type === 'email' && !isValidEmail(element.value)) {
        isValid = false;
        showInputError(element, 'Please enter a valid email');
      }
    });
    
    return isValid;
  }

  function validateInput(input) {
    const errorElement = input.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('input-error')) return;
    
    if (input.required && !input.value.trim()) {
      showInputError(input, 'This field is required');
    } else if (input.type === 'email' && !isValidEmail(input.value)) {
      showInputError(input, 'Please enter a valid email');
    } else {
      clearInputError(input);
    }
  }

  function showInputError(input, message) {
    const errorElement = input.nextElementSibling;
    if (errorElement && errorElement.classList.contains('input-error')) {
      errorElement.textContent = message;
      input.classList.add('error');
    }
  }

  function clearInputError(input) {
    const errorElement = input.nextElementSibling;
    if (errorElement && errorElement.classList.contains('input-error')) {
      errorElement.textContent = '';
      input.classList.remove('error');
    }
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function submitForm(formData) {
    // In a real implementation, you would send to your server
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Form submitted:', Object.fromEntries(formData));
        resolve({ status: 'success' });
      }, 1000);
    });
  }

  function showFormFeedback(type, message) {
    const feedbackElement = DOM.contactForm.querySelector('.form-feedback');
    if (!feedbackElement) return;
    
    feedbackElement.textContent = message;
    feedbackElement.className = 'form-feedback';
    feedbackElement.classList.add(type);
    
    // Hide feedback after 5 seconds
    setTimeout(() => {
      feedbackElement.textContent = '';
      feedbackElement.className = 'form-feedback';
    }, 5000);
  }

  // ===== Back to Top Button =====
  function initBackToTop() {
    DOM.backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ===== Hover Effects =====
  function initHoverEffects() {
    // Hero image tilt effect
    if (DOM.heroImage) {
      DOM.heroImage.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = DOM.heroImage.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        
        DOM.heroImage.style.transform = `
          perspective(1000px) 
          rotateY(${-x * 10}deg) 
          rotateX(${y * 5}deg) 
          scale(1.02)
        `;
      });
      
      DOM.heroImage.addEventListener('mouseleave', () => {
        DOM.heroImage.style.transform = `
          perspective(1000px) 
          rotateY(-10deg) 
          rotateX(5deg)
        `;
      });
    }
    
    // Service card hover effects
    DOM.serviceCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
        card.style.boxShadow = 'var(--shadow-lg)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = 'var(--shadow-md)';
      });
    });
  }

  // ===== Page Load Animations =====
  function initPageLoadAnimations() {
    // Add loaded class when page fully loads
    window.addEventListener('load', () => {
      setTimeout(() => {
        DOM.body.classList.add('loaded');
      }, 200);
    });
  }

  // Start the app
  init();
});