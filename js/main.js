/**
 * CROCCO PAINTING - Main Interactive Logic
 * Optimized for Mobile Responsiveness & Architectural Transitions
 */

document.addEventListener('DOMContentLoaded', () => {
    initComparisonSlider();
    initMobileMenu();
    initQuoteForm();
    initGallery();
});

/* ---------------------------------------------------------
   1. COMPARISON SLIDER (Before/After)
   --------------------------------------------------------- */
function initComparisonSlider() {
    const slider = document.getElementById('comparison-slider');
    const afterImage = document.getElementById('after-image');
    const sliderLine = document.querySelector('.slider-line');
    
    if (slider && afterImage) {
        slider.addEventListener('input', (e) => {
            const value = e.target.value;
            afterImage.style.clipPath = `inset(0 0 0 ${value}%)`;
            if (sliderLine) sliderLine.style.left = `${value}%`;
            document.querySelector('.slider-button').style.left = `${value}%`;
        });
    }
}

/* ---------------------------------------------------------
   2. MOBILE NAVIGATION (Hamburger Menu)
   --------------------------------------------------------- */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            document.body.style.overflow = isExpanded ? 'auto' : 'hidden';
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }
}

/* ---------------------------------------------------------
   3. MULTI-STEP QUOTE TOOL logic
   --------------------------------------------------------- */
function initQuoteForm() {
    const form = document.getElementById("quote-form");
    const successMsg = document.getElementById("form-success");
    const headerContent = document.getElementById("quote-header");

    if (!form) return;

    form.addEventListener("submit", async function(event) {
        event.preventDefault();
        const statusBtn = document.getElementById("submit-btn");
        const originalText = statusBtn.innerHTML;
        
        statusBtn.innerHTML = "Sending...";
        statusBtn.disabled = true;

        const data = new FormData(event.target);
        
        try {
            const response = await fetch(event.target.action, {
                method: form.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                form.style.display = "none";
                if (headerContent) headerContent.style.display = "none";
                successMsg.style.display = "block";
                successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                throw new Error();
            }
        } catch (error) {
            alert("Oops! There was a problem. Please try again.");
            statusBtn.disabled = false;
            statusBtn.innerHTML = originalText;
        }
    });
}

/**
 * Global Step Navigation
 * Handled via window object to support inline HTML onclick attributes
 */
window.nextQuoteStep = function(serviceType) {
    const serviceInput = document.getElementById('selected-service');
    if (serviceInput) serviceInput.value = serviceType;
    window.goToStep(2);
};

window.goToStep = function(stepNumber) {
    const steps = document.querySelectorAll('.step');
    const toolSection = document.querySelector('.quote-tool');

    steps.forEach(s => {
        s.style.display = 'none';
        s.classList.remove('active');
    });
    
    const currentStep = document.getElementById(`step-${stepNumber}`);
    if (currentStep) {
        // Use "" to allow CSS to determine display (grid/block)
        currentStep.style.display = ""; 
        currentStep.classList.add('active');

        // Mobile Fix: Scroll user back to the top of the tool
        if (toolSection) {
            toolSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // Accessibility Focus
        const heading = currentStep.querySelector('h3');
        if (heading) {
            heading.setAttribute('tabindex', '-1');
            heading.focus();
        }
    }
};

/*carousel Shiznit*/
function initGallery() {
    const cells = document.querySelectorAll('.carousel-cell');
    const prevBtn = document.querySelector('.carousel-nav.prev');
    const nextBtn = document.querySelector('.carousel-nav.next');
    if (cells.length === 0) return;

    let currentIndex = 0;
    let slideInterval;

    function updateSlides(newIndex) {
        cells[currentIndex].classList.remove('is-selected');
        currentIndex = (newIndex + cells.length) % cells.length; // Handles negative numbers
        cells[currentIndex].classList.add('is-selected');
        
        // Reset timer so it doesn't flip immediately after a manual click
        startTimer();
    }

    function startTimer() {
        clearInterval(slideInterval);
        slideInterval = setInterval(() => {
            updateSlides(currentIndex + 1);
        }, 5000);
    }

    // Event Listeners
    nextBtn.addEventListener('click', () => updateSlides(currentIndex + 1));
    prevBtn.addEventListener('click', () => updateSlides(currentIndex - 1));

    // Initialize
    cells[0].classList.add('is-selected');
    startTimer();
}