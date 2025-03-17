"use strict";

document.addEventListener('DOMContentLoaded', () => {
    console.log('ProjectLinks.js loaded and running');
    
    // Define project links for each video
    const videoProjectLinks = {
        'video1': 'projects/artour.html',
        'video2': 'projects/reaction.html',
        'video3': 'projects/elephant.html',
        'video4': 'projects/beestory.html',
        'video5': 'projects/realestate.html',
        'video6': 'projects/realestate.html'
    };
    
    // Check for video elements by their ID first
    Object.keys(videoProjectLinks).forEach(videoId => {
        const videoElement = document.getElementById(videoId);
        if (videoElement) {
            console.log(`Found video element by ID: ${videoId}`);
        } else {
            console.log(`Video element with ID ${videoId} not found directly`);
        }
    });
    
    // Also check for videos in slider
    const sliderVideos = document.querySelectorAll('.video-slide video');
    console.log(`Found ${sliderVideos.length} videos in slider`);
    
    // If videos don't have IDs, assign them based on their position
    if (sliderVideos.length > 0 && !sliderVideos[0].id) {
        console.log('Videos found but lacking IDs. Assigning IDs now...');
        sliderVideos.forEach((video, index) => {
            const videoId = `video${index + 1}`;
            video.id = videoId;
            console.log(`Assigned ID ${videoId} to video at index ${index}`);
        });
    }
    
    // Add Go to Project buttons to each video container
    Object.keys(videoProjectLinks).forEach(videoId => {
        // Try to find the video element
        const videoElement = document.getElementById(videoId);
        
        // Find the container
        const videoContainer = videoElement?.closest('.video-slide') || 
                               videoElement?.closest('.video-container') ||
                               document.querySelector(`.video-slide:nth-child(${parseInt(videoId.replace('video', ''))}) .video-container`);
        
        if (videoContainer) {
            console.log(`Found container for ${videoId}`);
            
            // Check if button already exists
            if (!videoContainer.querySelector('.project-button')) {
                // Create button
                const projectButton = document.createElement('button');
                projectButton.className = 'project-button';
                projectButton.innerHTML = '<i class="fas fa-external-link-alt"></i> Go to Project';
                projectButton.setAttribute('data-project', videoProjectLinks[videoId]);
                
                // Set click event
                projectButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const projectUrl = this.getAttribute('data-project');
                    console.log(`Navigating to: ${projectUrl}`);
                    window.location.href = projectUrl;
                });
                
                // Add button to container
                videoContainer.appendChild(projectButton);
                console.log(`Added button for ${videoId} linking to ${videoProjectLinks[videoId]}`);
                
                // Add button hover styles if not already in stylesheet
                if (!document.getElementById('project-button-styles')) {
                    const styles = document.createElement('style');
                    styles.id = 'project-button-styles';
                    styles.textContent = `
                        .project-button {
                            position: absolute;
                            bottom: 20px;
                            right: 20px;
                            background-color: rgba(0, 0, 0, 0.7);
                            color: white;
                            border: none;
                            border-radius: 4px;
                            padding: 8px 15px;
                            font-size: 14px;
                            cursor: pointer;
                            transition: background-color 0.3s ease;
                            z-index: 10;
                        }
                        
                        .project-button:hover {
                            background-color: rgba(0, 0, 0, 0.9);
                        }
                        
                        @media (max-width: 768px) {
                            .project-button {
                                bottom: 10px;
                                right: 10px;
                                padding: 6px 12px;
                                font-size: 12px;
                            }
                        }
                    `;
                    document.head.appendChild(styles);
                }
            } else {
                console.log(`Button already exists for ${videoId}`);
            }
        } else {
            console.log(`Could not find container for ${videoId}`);
        }
    });
    
    // Alternative approach: Add buttons to all video containers
    const allVideoContainers = document.querySelectorAll('.video-slide, .video-container');
    console.log(`Found ${allVideoContainers.length} total video containers`);
    
    allVideoContainers.forEach((container, index) => {
        // Only add if there's no button already
        if (!container.querySelector('.project-button')) {
            // Determine which project to link to based on position
            const videoIndex = index + 1;
            const projectLink = videoProjectLinks[`video${videoIndex}`] || videoProjectLinks['video1'];
            
            // Create button
            const projectButton = document.createElement('button');
            projectButton.className = 'project-button';
            projectButton.innerHTML = '<i class="fas fa-external-link-alt"></i> Go to Project';
            
            // Set click event
            projectButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log(`Navigating to: ${projectLink}`);
                window.location.href = projectLink;
            });
            
            // Add button to container
            container.appendChild(projectButton);
            console.log(`Added backup button at index ${index} linking to ${projectLink}`);
        }
    });
    
    // Handle video play state to ensure buttons are visible
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        // Make sure buttons are visible when video is playing
        video.addEventListener('play', function() {
            const container = video.closest('.video-slide') || video.closest('.video-container');
            if (container) {
                const button = container.querySelector('.project-button');
                if (button) {
                    button.style.opacity = '1';
                }
            }
        });
        
        // Add hover effect for video containers
        const container = video.closest('.video-slide') || video.closest('.video-container');
        if (container) {
            container.addEventListener('mouseenter', function() {
                const button = container.querySelector('.project-button');
                if (button) {
                    button.style.opacity = '1';
                }
            });
            
            container.addEventListener('mouseleave', function() {
                const button = container.querySelector('.project-button');
                if (button && !video.playing) {
                    button.style.opacity = '0.7';
                }
            });
        }
    });
}); 