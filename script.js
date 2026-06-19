/* ============================================================
   SANDEEP PORTFOLIO — EASY TO UNDERSTAND JAVASCRIPT
   ============================================================ */

// ──────────────── 1. DOM ELEMENT SELECTIONS ────────────────
// Selecting elements from the HTML page so we can interact with them in JS
const header = document.querySelector('header');
const menuLinks = document.querySelectorAll('.menu a[href^="#"]');
const sections = document.querySelectorAll('section[id]');
const heroSection = document.querySelector('.hero');
const siteLogo = document.querySelector('.logo');

// Theme Switcher Elements
const themeToggleButton = document.getElementById('theme-toggle');
const themeToggleIcon = document.getElementById('theme-icon');

// Floating Back to Top Button
const backToTopButton = document.getElementById('back-to-top');

// Contact Form Elements
const contactForm = document.getElementById('contact-form');
const submitButton = document.querySelector('.send-btn');


// ──────────────── 2. INTERFACE THEME (LIGHT / DARK) ────────────────
// Check if the user previously chose the light theme (saved in local browser memory)
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  document.body.classList.add('light-theme');
  if (themeToggleIcon) {
    themeToggleIcon.classList.replace('fa-sun', 'fa-moon'); // Change sun to moon icon
  }
}

// Listen for a click on the floating theme button
if (themeToggleButton) {
  themeToggleButton.addEventListener('click', () => {
    // Toggle (add or remove) the "light-theme" class on the <body> tag
    document.body.classList.toggle('light-theme');
    
    // Check if the light theme is currently active
    const isLightThemeActive = document.body.classList.contains('light-theme');
    
    // Toggle the icons and save the user's choice in browser memory (localStorage)
    if (isLightThemeActive) {
      themeToggleIcon.classList.replace('fa-sun', 'fa-moon');
      localStorage.setItem('theme', 'light');
    } else {
      themeToggleIcon.classList.replace('fa-moon', 'fa-sun');
      localStorage.setItem('theme', 'dark');
    }
  });
}


// ──────────────── 3. SINGLE SCROLL MONITOR ────────────────
// All interactions that depend on scrolling down/up the page
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY; // How many pixels the user scrolled down

  // A. Navbar Shrink effect
  if (header) {
    if (scrollY > 50) {
      header.classList.add('scrolled'); // Add scrolled class to make navbar small
    } else {
      header.classList.remove('scrolled'); // Remove it if scrolled to the top
    }
  }

  // B. Back to Top Button visibility
  if (backToTopButton) {
    if (scrollY > 300) {
      backToTopButton.classList.add('visible'); // Show back-to-top button
    } else {
      backToTopButton.classList.remove('visible'); // Hide it
    }
  }

  // C. Active Link Highlight
  // Loop through all sections to find which one is currently in view
  let currentActiveSectionId = '';
  sections.forEach(section => {
    // If our scroll position is past the section top (offset slightly for navbar height)
    if (scrollY >= section.offsetTop - 160) {
      currentActiveSectionId = section.id;
    }
  });

  // Remove the active border highlight from all links, and add it only to the active link
  menuLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentActiveSectionId}`) {
      link.classList.add('active');
    }
  });

  // D. Hero Parallax translation (move hero image/text slightly on scroll)
  if (heroSection && scrollY < window.innerHeight) {
    heroSection.style.transform = `translateY(${scrollY * 0.12}px)`;
  }
});


// ──────────────── 4. NAVIGATION SMOOTH SCROLLING ────────────────
// Loop through all menu links to set up smooth scrolling on click
menuLinks.forEach(anchor => {
  anchor.addEventListener('click', (event) => {
    const targetId = anchor.getAttribute('href'); // e.g. "#about" or "#projects"
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      event.preventDefault(); // Stop standard browser snap scroll

      // Scroll to the target element smoothly
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Logo Click scrolls to the top of page smoothly
if (siteLogo) {
  siteLogo.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Back to Top Button scrolls to top smoothly
if (backToTopButton) {
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}


// ──────────────── 5. TYPING ANIMATION EFFECT ────────────────
const typedTextContainer = document.getElementById('typed-text');

if (typedTextContainer) {
  const wordsList = [
    'Computer Science Student',
    'Full Stack Developer',
    'Frontend Enthusiast',
    'Open to Opportunities'
  ];

  let currentWordIndex = 0; // Current word in array
  let currentCharIndex = 0; // Current character index inside word
  let isDeletingText = false; // Status showing if we are typing or deleting

  function runTypingAnimation() {
    const currentWord = wordsList[currentWordIndex];

    if (isDeletingText) {
      // Deleting: remove one character from end
      typedTextContainer.textContent = currentWord.substring(0, currentCharIndex - 1);
      currentCharIndex--;
    } else {
      // Typing: add next character to end
      typedTextContainer.textContent = currentWord.substring(0, currentCharIndex + 1);
      currentCharIndex++;
    }

    // Set standard speed delay
    let speedDelay = isDeletingText ? 40 : 80;

    // Word is fully typed out: pause and then start deleting
    if (!isDeletingText && currentCharIndex === currentWord.length) {
      isDeletingText = true;
      speedDelay = 2000; // Pause at the end of word (2 seconds)
    } 
    // Word is fully deleted: move to the next word and start typing
    else if (isDeletingText && currentCharIndex === 0) {
      isDeletingText = false;
      currentWordIndex = (currentWordIndex + 1) % wordsList.length; // Loop around array index
      speedDelay = 300; // Short pause before next word
    }

    // Recursively trigger this function again after speedDelay milliseconds
    setTimeout(runTypingAnimation, speedDelay);
  }

  // Start the loop
  runTypingAnimation();
}


// ──────────────── 6. SCROLL REVEAL (FADE-IN ANIMATION) ────────────────
// Find all cards we want to animate when scrolling them into view
const animatedCardsList = document.querySelectorAll('.reveal, .card, .skills-card, .certifications-card, .card1');

if (animatedCardsList.length > 0) {
  // Set up an intersection observer that watches when items enter screen
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // If the card has entered the viewport boundary
      if (entry.isIntersecting) {
        entry.target.classList.add('visible'); // Adds CSS visible class to fade it in
        observer.unobserve(entry.target); // Stop observing once it's already shown
      }
    });
  }, {
    threshold: 0.1 // Triggers when 10% of card is visible on screen
  });

  // Attach all target cards to this observer
  animatedCardsList.forEach(card => {
    card.classList.add('reveal'); // Ensure card has the fade class
    observer.observe(card);
  });
}


// ──────────────── 7. BACKGROUND CANVAS PARTICLES ────────────────
const canvas = document.createElement('canvas');
if (heroSection) {
  canvas.id = 'particles-canvas';
  heroSection.prepend(canvas); // Place canvas inside hero container

  const ctx = canvas.getContext('2d');
  let canvasWidth, canvasHeight;
  let particlesArray = [];

  // Update canvas size to fill the hero section container
  function updateCanvasSize() {
    canvasWidth = canvas.width = heroSection.offsetWidth;
    canvasHeight = canvas.height = heroSection.offsetHeight;
  }

  // Particle Class constructor definition
  class Particle {
    constructor() {
      this.x = Math.random() * canvasWidth;
      this.y = Math.random() * canvasHeight;
      this.size = Math.random() * 2 + 0.8; // Radius of particle
      this.speedX = (Math.random() - 0.5) * 0.4; // Speed on X axis
      this.speedY = (Math.random() - 0.5) * 0.4; // Speed on Y axis
      this.alpha = Math.random() * 0.35 + 0.1; // Opacity
    }

    update() {
      // Move particle by its speeds
      this.x += this.speedX;
      this.y += this.speedY;

      // Bounce off borders
      if (this.x < 0 || this.x > canvasWidth) this.speedX *= -1;
      if (this.y < 0 || this.y > canvasHeight) this.speedY *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      
      // Select particle color depending on interface mode
      if (document.body.classList.contains('light-theme')) {
        ctx.fillStyle = `rgba(79, 70, 229, ${this.alpha * 0.8})`; // Indigo points for light mode
      } else {
        ctx.fillStyle = `rgba(129, 140, 248, ${this.alpha})`; // Light indigo points for dark mode
      }
      ctx.fill();
    }
  }

  // Populate particles array
  function createParticles() {
    particlesArray = [];
    for (let i = 0; i < 45; i++) {
      particlesArray.push(new Particle());
    }
  }

  // Connect close points with lines
  function drawConnectionLines() {
    for (let i = 0; i < particlesArray.length; i++) {
      for (let j = i + 1; j < particlesArray.length; j++) {
        const diffX = particlesArray[i].x - particlesArray[j].x;
        const diffY = particlesArray[i].y - particlesArray[j].y;
        const distance = Math.sqrt(diffX * diffX + diffY * diffY);

        // Draw line if distance between two particles is small
        if (distance < 110) {
          const isLightMode = document.body.classList.contains('light-theme');
          ctx.strokeStyle = isLightMode
            ? `rgba(79, 70, 229, ${0.08 * (1 - distance / 110)})`
            : `rgba(129, 140, 248, ${0.12 * (1 - distance / 110)})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
          ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
          ctx.stroke();
        }
      }
    }
  }

  // Main animation loop called recursively by the browser frame ticker
  function runCanvasAnimationLoop() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight); // Clear canvas

    // Update and draw each particle
    particlesArray.forEach(particle => {
      particle.update();
      particle.draw();
    });

    drawConnectionLines();

    // Trigger next frame loop
    requestAnimationFrame(runCanvasAnimationLoop);
  }

  // Size changes
  window.addEventListener('resize', () => {
    updateCanvasSize();
    createParticles();
  });

  // Start initialization
  updateCanvasSize();
  createParticles();
  runCanvasAnimationLoop();
}


// ──────────────── 8. CONTACT FORM SUBMISSION ────────────────
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Stop standard form refresh trigger

    // Get the name, email, and message inputs
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const messageInput = document.getElementById('contact-message');

    if (!nameInput || !emailInput || !messageInput || !submitButton) return;

    const nameValue = nameInput.value.trim();
    const emailValue = emailInput.value.trim();
    const messageValue = messageInput.value.trim();

    // Visual loading state updates
    submitButton.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Preparing…';
    submitButton.disabled = true;

    // Show mail client redirect after a short visual delay
    setTimeout(() => {
      submitButton.innerHTML = '<i class="fa-solid fa-check-circle"></i> Opening Mail Client…';
      
      const mailSubject = encodeURIComponent(`Portfolio Inquiry from ${nameValue}`);
      const mailBody = encodeURIComponent(`Hello Sandeep,\n\n${messageValue}\n\nBest regards,\n${nameValue}\nEmail: ${emailValue}`);
      
      // Trigger default system email sender client
      window.location.href = `mailto:Sandeepbanvari77@gmail.com?subject=${mailSubject}&body=${mailBody}`;

      // Reset button and clear form inputs after opening client
      setTimeout(() => {
        submitButton.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
        submitButton.disabled = false;
        
        nameInput.value = '';
        emailInput.value = '';
        messageInput.value = '';
      }, 1500);
    }, 1000);
  });
}
