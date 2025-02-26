"use strict";

document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.video-slider');
    const slides = document.querySelectorAll('.video-slide');
    const dots = document.querySelectorAll('.slider-dot');
    const prevBtn = document.querySelector('.slider-arrow.prev');
    const nextBtn = document.querySelector('.slider-arrow.next');
    
    let currentIndex = 0;
    const slideCount = slides.length;
    let isAnimating = false;
    
    // Initialize videos
    slides.forEach(slide => {
        const video = slide.querySelector('video');
        video.addEventListener('loadedmetadata', () => {
            video.play().catch(e => console.log("Auto-play prevented:", e));
        });
    });
    
    // Clone first and last slides for seamless looping
    const firstSlideClone = slides[0].cloneNode(true);
    const lastSlideClone = slides[slideCount - 1].cloneNode(true);
    slider.appendChild(firstSlideClone);
    slider.insertBefore(lastSlideClone, slides[0]);
    
    // Adjust initial position to show first real slide
    slider.style.transform = `translateX(-100%)`;
    
    // Function to update slider position with seamless looping
    function updateSlider(direction = null) {
        if (isAnimating) return;
        isAnimating = true;
        
        // Calculate new index
        if (direction === 'next') {
            currentIndex++;
        } else if (direction === 'prev') {
            currentIndex--;
        }
        
        // Apply transition for smooth movement
        slider.style.transition = 'transform 0.5s ease';
        slider.style.transform = `translateX(-${(currentIndex + 1) * 100}%)`;
        
        // Update active dot
        updateActiveDot();
        
        // Handle video playback
        updateVideoPlayback();
        
        // Check for loop points after transition completes
        setTimeout(() => {
            if (currentIndex === slideCount) {
                // If we've moved past the last slide, jump to first slide without animation
                slider.style.transition = 'none';
                currentIndex = 0;
                slider.style.transform = `translateX(-100%)`;
            } else if (currentIndex === -1) {
                // If we've moved before the first slide, jump to last slide without animation
                slider.style.transition = 'none';
                currentIndex = slideCount - 1;
                slider.style.transform = `translateX(-${(currentIndex + 1) * 100}%)`;
            }
            
            isAnimating = false;
        }, 500);
    }
    
    function updateActiveDot() {
        // Ensure index is within bounds for dot display
        const displayIndex = (currentIndex + slideCount) % slideCount;
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === displayIndex);
        });
    }
    
    function updateVideoPlayback() {
        // Calculate real index including clones
        const displayIndex = (currentIndex + slideCount) % slideCount;
        
        // Pause all videos
        document.querySelectorAll('.video-slide video').forEach(video => {
            video.pause();
        });
        
        // Play current video (both original and clone if applicable)
        const currentVideos = document.querySelectorAll(`.video-slide:nth-child(${displayIndex + 2}) video, 
                                                       .video-slide:nth-child(${displayIndex + 2 + slideCount}) video,
                                                       .video-slide:nth-child(${displayIndex + 2 - slideCount}) video`);
        
        currentVideos.forEach(video => {
            video.play().catch(e => console.log("Play prevented:", e));
        });
    }
    
    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (isAnimating) return;
            currentIndex = index;
            slider.style.transition = 'transform 0.5s ease';
            slider.style.transform = `translateX(-${(currentIndex + 1) * 100}%)`;
            updateActiveDot();
            updateVideoPlayback();
        });
    });
    
    // Event listeners for arrows
    prevBtn.addEventListener('click', () => {
        updateSlider('prev');
    });
    
    nextBtn.addEventListener('click', () => {
        updateSlider('next');
    });
    
    // Touch/swipe functionality
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left - next slide
            updateSlider('next');
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right - previous slide
            updateSlider('prev');
        }
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            updateSlider('prev');
        } else if (e.key === 'ArrowRight') {
            updateSlider('next');
        }
    });
    
    // Auto-advance slides every 5 seconds
    let autoplayInterval = setInterval(() => {
        updateSlider('next');
    }, 5000);
    
    // Pause autoplay on hover/interaction
    const videoContainer = document.querySelector('.video-container');
    videoContainer.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });
    
    videoContainer.addEventListener('mouseleave', () => {
        autoplayInterval = setInterval(() => {
            updateSlider('next');
        }, 5000);
    });
    
    // Initialize slider
    updateActiveDot();
    updateVideoPlayback();
});
