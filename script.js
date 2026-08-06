// ================================
// ALL CODE RUNS AFTER DOM LOADS
// ================================
document.addEventListener('DOMContentLoaded', () => {
    
    // ================================
    // TASK PROGRESS BAR
    // ================================
    const tasks = document.querySelectorAll('.task');
    const progressBar = document.getElementById('progressBar');

    function updateProgressBar() {
        if (!progressBar) return;
        const total = tasks.length;
        const completed = document.querySelectorAll('.task:checked').length;
        const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
        progressBar.style.width = percent + '%';
    }

    tasks.forEach(task => {
        task.addEventListener('change', updateProgressBar);
    });

    // Initial calculation
    updateProgressBar();

    // ================================
    // THEME TOGGLE POSITIONING
    // ================================
    function positionToggle() {
        const firstSection = document.querySelector('.bento-grid section');
        const toggle = document.querySelector('.theme-toggle');
        
        if (!firstSection || !toggle) return;
        
        const gapFromTop = firstSection.getBoundingClientRect().top;
        const toggleHeight = toggle.offsetHeight;
        
        const togglePosition = (gapFromTop - toggleHeight) / 2;
        
        toggle.style.top = togglePosition + 'px';
    }

    const toggleBtn = document.querySelector('.theme-toggle');
    
        // Check system preference, default to light if none
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('darkmode');
    }
    
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            document.body.classList.toggle('darkmode');
        });
    }

    positionToggle();
    window.addEventListener('resize', positionToggle);

    // ================================
    // BENTO BOX EXPANSION
    // ================================
    const sections = document.querySelectorAll('main > section');
    const bentoGrid = document.querySelector('.bento-grid');
    const body = document.body;
    
    // Create backdrop dynamically
    let backdrop = document.querySelector('.overlay-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.classList.add('overlay-backdrop');
        body.appendChild(backdrop);
    }

    let currentExpanded = null;
    let placeholder = null;

    sections.forEach(section => {
        section.addEventListener('click', (e) => {
            // Only block clicks on specific interactive elements
            if (e.target.closest('.contact_link') || e.target.closest('.social-icons')) return;
            
            // BLOCKED: If already expanded, do nothing
            if (currentExpanded !== null) return;

            const targetUrl = section.dataset.url;
            openSection(section, targetUrl);
        });
    });

    function openSection(element, url) {
        currentExpanded = element;
        bentoGrid.classList.add('blocked');

        // Create placeholder to preserve grid space
        placeholder = document.createElement('div');
        placeholder.classList.add('section-placeholder');
        element.parentNode.insertBefore(placeholder, element);

        // Hide the element first (for opacity transition)
        element.style.opacity = '0';
        element.style.transform = 'scale(0.95)';
        
        // Immediately set it to fixed and centered (no positional capture)
        element.style.position = 'fixed';
        element.style.top = '50%';
        element.style.left = '50%';
        element.style.transform = 'translate(-50%, -50%) scale(0.95)';
        element.style.margin = '0';
        element.style.zIndex = '1000';
        
        // Force reflow for animation
        void element.offsetWidth;

        // Apply expanded class and fade in
        element.classList.add('expanded');
        backdrop.classList.add('active');
        
        // Fade in with smooth transition
        element.style.opacity = '1';
        element.style.transform = 'translate(-50%, -50%) scale(1)';

        // Update URL
        if (url) {
            history.pushState({ section: true, url: url }, '', url);
        }

        // Lock scrolling
        body.style.overflow = 'hidden';
    }

    function closeSection() {
        const element = currentExpanded;
        if (!element) return;

        // Fade out first
        element.style.opacity = '0';
        element.style.transform = 'translate(-50%, -50%) scale(0.95)';
        backdrop.classList.remove('active');
        
        bentoGrid.classList.remove('blocked');
        body.style.overflow = '';

        // Wait for animation, then cleanup
        setTimeout(() => {
            element.classList.remove('expanded');
            element.removeAttribute('style');
            
            if (placeholder && placeholder.parentNode) {
                placeholder.parentNode.removeChild(placeholder);
                placeholder = null;
            }

            history.replaceState(null, '', window.location.pathname);
            currentExpanded = null;
        }, 400);
    }

    // Close when clicking backdrop
    if (backdrop) {
        backdrop.addEventListener('click', closeSection);
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && currentExpanded !== null) {
            closeSection();
        }
    });

    // Handle browser back/forward
    window.addEventListener('popstate', () => {
        if (currentExpanded !== null) {
            closeSection();
        }
    });

    // Prevent scroll while expanded
    document.addEventListener('wheel', (e) => {
        if (currentExpanded !== null) {
            e.preventDefault();
        }
    }, { passive: false });

}); // End of DOMContentLoaded