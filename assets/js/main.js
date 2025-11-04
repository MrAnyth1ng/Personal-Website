// Function to handle the mouse movement and apply the scroll effect
function setupMouseScroll(windowSelector, movingElementSelector) {
    // 1. Get the elements we need
    const windowElement = document.querySelector(windowSelector);
    const movingElement = document.querySelector(movingElementSelector);

    // Stop if elements don't exist
    if (!windowElement || !movingElement) return;

    // Set a sensitivity factor for how fast the content moves
    // A lower number (e.g., 0.3) means you have to move the mouse further to scroll the content.
    const SENSITIVITY = 1.2; // Increased slightly for a more responsive feel

    // 2. Event Listener: Fires every time the mouse moves over the visible window
    windowElement.addEventListener('mousemove', (e) => {
        
        // A. Get boundary information for calculations
        const windowRect = windowElement.getBoundingClientRect();
        
        // Mouse X position relative to the left edge of the window
        const mouseX = e.clientX - windowRect.left;

        // B. Define the center point
        const center = windowRect.width / 2;

        // C. Calculate the distance of the mouse from the center
        // - negative on the left, positive on the right
        const offsetFromCenter = mouseX - center;

        // D. Calculate the total hidden content width
        // This is the total distance the moving strip exceeds the visible window.
        const scrollableWidth = movingElement.scrollWidth - windowRect.width;

        // E. Guard: Stop if content is not wider than the window
        if (scrollableWidth <= 0) {
            movingElement.style.transform = `translateX(0px)`;
            return;
        }

        // F. Calculate the target X translation (Scroll amount)
        // If the mouse is far right (max positive offset), translateX moves to max negative (far left)
        // We use the offset ratio multiplied by the scrollable width and sensitivity.
        let translateX = (offsetFromCenter / center) * scrollableWidth * -SENSITIVITY;

        // G. Boundary Check (CRITICAL MODIFICATION)
        
        // 1. Cannot scroll past the beginning (translateX must be 0 or less)
        translateX = Math.min(translateX, 0); 
        
        // 2. Cannot scroll past the end of the content strip (translateX must be >= -scrollableWidth)
        // This ensures the last item is fully visible.
        // We ensure the negative value does not exceed the total scrollable distance.
        translateX = Math.max(translateX, -scrollableWidth);

        // H. Apply the movement
        movingElement.style.transform = `translateX(${translateX}px)`;
        movingElement.style.transition = 'transform 0.1s linear'; // Ensure smooth movement
    });
    
    // 3. Optional: Reset transition when mouse leaves the area
    windowElement.addEventListener('mouseleave', () => {
        // Setting transition to 'none' prevents any lingering movement if the mouse stops exactly 
        // on a boundary, making subsequent mouse moves feel more responsive.
        movingElement.style.transition = 'none'; 
    });
}

// Initialize the function once the page is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Selectors for the visible window and the content strip
    setupMouseScroll('.carousel-window', '.skills-carousel');
});