// ===================================
// 1. Mouse Scroll Functionality (Fixed Boundary Check)
// ===================================

function setupMouseScroll(windowSelector, movingElementSelector) {
    // 1. Get the elements we need
    const windowElement = document.querySelector(windowSelector);
    const movingElement = document.querySelector(movingElementSelector);

    // Stop if elements don't exist
    if (!windowElement || !movingElement) return;

    // Use the user's preferred sensitivity
    const SENSITIVITY = 1.2; 

    // 2. Event Listener: Fires every time the mouse moves over the visible window
    windowElement.addEventListener('mousemove', (e) => {
        
        // A. Get boundary information for calculations
        const windowRect = windowElement.getBoundingClientRect();
        const mouseX = e.clientX - windowRect.left;
        const center = windowRect.width / 2;
        const offsetFromCenter = mouseX - center;

        // D. Calculate the total hidden content width
        const scrollableWidth = movingElement.scrollWidth - windowRect.width;

        // E. Guard: Stop if content is not wider than the window
        if (scrollableWidth <= 0) {
            movingElement.style.transform = `translateX(0px)`;
            return;
        }

        // F. Calculate the target X translation (Scroll amount)
        let translateX = (offsetFromCenter / center) * scrollableWidth * -SENSITIVITY;

        // G. Boundary Check (CRITICAL FIX)
        translateX = Math.min(translateX, 0); // Cannot scroll past the beginning (left limit)
        translateX = Math.max(translateX, -scrollableWidth); // Cannot scroll past the end (right limit)

        // H. Apply the movement
        movingElement.style.transform = `translateX(${translateX}px)`;
        movingElement.style.transition = 'transform 0.1s linear';
    });
    
    // 3. Optional: Reset transition when mouse leaves the area
    windowElement.addEventListener('mouseleave', () => {
        movingElement.style.transition = 'none'; 
    });
}


// ===================================
// 2. Lightbox Functionality (NEW)
// ===================================

function setupLightbox() {
    // Get modal elements
    const modal = document.getElementById('lightbox-modal');
    const closeBtn = document.querySelector('.lightbox-close');
    const modalImage = document.getElementById('lightbox-image');

    // Get all project images (must match the new HTML structure)
    const projectImages = document.querySelectorAll('.project-card img');

    projectImages.forEach(img => {
        // We attach the event listener to the image element
        img.addEventListener('click', (e) => {
            // Prevent any default navigation behavior
            e.preventDefault(); 
            e.stopPropagation();

            // Get the image source
            const imgSrc = img.getAttribute('src');
            
            // Set the image in the modal
            modalImage.src = imgSrc;
            
            // Display the modal
            modal.style.display = 'block';
        });
    });

    // Close modal when user clicks on (x)
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }

    // Close modal when user clicks anywhere outside of the modal content
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}


// ===================================
// 3. Initialization
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize both features
    setupMouseScroll('.carousel-window', '.skills-carousel');
    setupLightbox(); 
});