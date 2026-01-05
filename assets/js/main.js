// ====================================
// ECOLEAD CONSULTANTS - MAIN JAVASCRIPT
// ====================================

// Back to Top Button
function handleBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  
  if (!backToTopBtn) return;

  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add('active');
    } else {
      backToTopBtn.classList.remove('active');
    }
  });

  backToTopBtn.addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navMenu.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        navMenu.classList.remove('active');
      }
    });
  }

  // Set active nav link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Contact Form Handler
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      handleContactFormSubmit();
    });
  }

  // Smooth scroll behavior for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // Intersection Observer for fade-in animations on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeIn 0.6s ease-in';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all cards and sections
  document.querySelectorAll('.card, .project-card, .team-member').forEach(el => {
    observer.observe(el);
  });

  // Service Card Expand/Collapse
  handleServiceCardToggle();

  // Project Portfolio Filtering
  handleProjectFiltering();

  // Back to Top Button
  handleBackToTop();

  // Add animation CSS
  addAnimationStyles();
});

/**
 * Handle Project Portfolio Filtering with Tabs
 */
function handleProjectFiltering() {
  const tabs = document.querySelectorAll('.project-tab');
  const projects = document.querySelectorAll('.project-item');

  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const filterValue = this.getAttribute('data-filter');

      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      // Filter projects
      projects.forEach(project => {
        const category = project.getAttribute('data-category');

        if (filterValue === 'all' || category === filterValue) {
          project.classList.remove('hidden');
          project.style.display = '';
          // Trigger animation
          setTimeout(() => {
            project.style.opacity = '1';
          }, 10);
        } else {
          project.style.opacity = '0';
          setTimeout(() => {
            project.classList.add('hidden');
            project.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/**
 * Handle Service Card Toggle for Learn More Details
 * Enhanced with smooth animations and expanded content area
 */
function handleServiceCardToggle() {
  const learnMoreLinks = document.querySelectorAll('.service-learn-more');
  
  learnMoreLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const card = this.closest('.service-card');
      const expandedContent = card.querySelector('.service-expanded');
      
      if (expandedContent) {
        const isVisible = expandedContent.style.display !== 'none' && expandedContent.style.display !== '';
        
        if (isVisible) {
          // Collapse
          expandedContent.style.animation = 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards';
          setTimeout(() => {
            expandedContent.style.display = 'none';
          }, 400);
          this.textContent = 'Learn More →';
          this.style.color = 'var(--forest-green)';
        } else {
          // Expand
          expandedContent.style.display = 'block';
          expandedContent.style.animation = 'slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards';
          this.textContent = 'Hide Details ←';
          this.style.color = 'var(--accent-green)';
        }
      }
    });
  });
}

// Add slide-up animation
const slideUpStyle = document.createElement('style');
slideUpStyle.textContent = `
  @keyframes slideUp {
    from {
      opacity: 1;
      max-height: 500px;
      overflow: hidden;
    }
    to {
      opacity: 0;
      max-height: 0;
      overflow: hidden;
    }
  }
`;
if (!document.querySelector('style[data-animation="slideUp"]')) {
  slideUpStyle.setAttribute('data-animation', 'slideUp');
  document.head.appendChild(slideUpStyle);
}

/**
 * Handle Contact Form Submission
 * This demonstrates form validation and submission handling
 */
function handleContactFormSubmit() {
  const form = document.getElementById('contactForm');
  const formData = new FormData(form);

  // Validate form
  const requiredFields = ['name', 'organization', 'email', 'phone', 'service', 'projectType', 'projectScope'];
  let isValid = true;
  let errorMessage = '';

  for (let field of requiredFields) {
    const value = formData.get(field);
    if (!value || value.trim() === '') {
      isValid = false;
      errorMessage += `${field.charAt(0).toUpperCase() + field.slice(1)} is required.\n`;
    }
  }

  // Validate email format
  const email = formData.get('email');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    isValid = false;
    errorMessage += 'Please enter a valid email address.\n';
  }

  // Validate phone number (basic)
  const phone = formData.get('phone');
  if (phone.length < 10) {
    isValid = false;
    errorMessage += 'Please enter a valid phone number.\n';
  }

  if (!isValid) {
    alert('Please fix the following errors:\n\n' + errorMessage);
    return false;
  }

  // If validation passes, show success message
  showFormSuccessMessage();

  // In a real application, you would send this data to a server
  console.log('Form Data:', {
    name: formData.get('name'),
    organization: formData.get('organization'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    service: formData.get('service'),
    projectType: formData.get('projectType'),
    projectLocation: formData.get('projectLocation'),
    projectScope: formData.get('projectScope'),
    timeline: formData.get('timeline'),
    message: formData.get('message')
  });

  // Reset form
  form.reset();

  return false;
}

/**
 * Display Success Message
 */
function showFormSuccessMessage() {
  const form = document.getElementById('contactForm');
  const successDiv = document.createElement('div');
  successDiv.style.cssText = `
    background-color: #4caf50;
    color: white;
    padding: 15px 20px;
    border-radius: 4px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    animation: slideDown 0.3s ease;
  `;
  successDiv.innerHTML = `
    <span style="font-size: 1.2rem;">✓</span>
    <div>
      <strong>Thank You!</strong>
      <p style="margin: 0.25rem 0 0 0; font-size: 0.95rem;">Your proposal request has been received. We'll contact you within 24 business hours.</p>
    </div>
  `;

  // Insert success message before form
  form.parentNode.insertBefore(successDiv, form);

  // Remove success message after 5 seconds and scroll to it
  setTimeout(() => {
    successDiv.style.animation = 'slideUp 0.3s ease';
    setTimeout(() => {
      successDiv.remove();
    }, 300);
  }, 5000);

  // Scroll to success message
  successDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Add Animation Styles Dynamically
 */
function addAnimationStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes slideUp {
      from {
        opacity: 1;
        transform: translateY(0);
      }
      to {
        opacity: 0;
        transform: translateY(-20px);
      }
    }

    /* Smooth transitions on interactive elements */
    button:active,
    a:active {
      transform: scale(0.98);
    }

    input:focus,
    textarea:focus,
    select:focus {
      background-color: rgba(27, 94, 32, 0.02);
    }
  `;
  document.head.appendChild(style);
}

/**
 * Utility function to check if element is in viewport
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Utility function to format phone number
 */
function formatPhoneNumber(input) {
  if (input.id === 'phone') {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 0) {
      if (value.length <= 3) {
        value = value;
      } else if (value.length <= 6) {
        value = value.slice(0, 3) + ' ' + value.slice(3);
      } else if (value.length <= 10) {
        value = value.slice(0, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6);
      } else {
        value = value.slice(0, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6, 10) + ' ' + value.slice(10);
      }
    }
    input.value = value;
  }
}

/**
 * Add phone number formatting to phone inputs
 */
document.addEventListener('DOMContentLoaded', function() {
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function() {
      formatPhoneNumber(this);
    });
  }
});

/**
 * Print-friendly styles and functions
 */
function printPage() {
  window.print();
}

// Export functions if this is used as a module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    handleContactFormSubmit,
    showFormSuccessMessage,
    isInViewport,
    formatPhoneNumber
  };
}
