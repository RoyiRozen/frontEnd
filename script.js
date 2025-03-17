"use strict";

let gridItems = document.querySelectorAll('.grid-item');
gridItems.forEach(item => {
    item.addEventListener('hover', () => {
    const itemText = item.textContent.trim();
    const itemImage = item.querySelector('img');
    item.setAttribute('data-title', itemText);
    item.setAttribute('data-image', itemImage);
    });
});

let input = document.querySelector('.contact-input');
if (input) {
    let inputContainer = input.parentElement; // Get the parent container
    
    input.addEventListener('click', () => {
        let inputValue = input.value.trim();
        
        if (inputValue) {
            // Store the input value (you can push to an array or handle as needed)
            storeInput(inputValue);
            
            // Clear the input
            input.value = '';
            
            // Hide the input
            input.style.display = 'none';
            
            // Create and show thank you message
            const thankYouMessage = document.createElement('p');
            thankYouMessage.textContent = 'Thank you!';
            thankYouMessage.classList.add('thank-you-message');
            inputContainer.appendChild(thankYouMessage);
        }
    });
}

// Helper function to store the input (modify as needed)
function storeInput(value) {
    // Example: Store in an array
    const inputList = window.inputList || [];
    inputList.push(value);
    window.inputList = inputList;
    
    console.log('Stored inputs:', inputList); // For debugging
}

let linkedinIcon = document.querySelector('.fa-linkedin');
if (linkedinIcon) {
    linkedinIcon.addEventListener('click', () => {
        window.open('https://www.linkedin.com/in/royi-rozen/', '_blank');
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-button');
    const gridItems = document.querySelectorAll('.grid-item');
    
    // Function to filter grid items
    function filterItems(filterValue) {
        gridItems.forEach(item => {
            const itemFilters = item.getAttribute('data-filters').split(' ');
            
            if (filterValue === 'All' || itemFilters.includes(filterValue.replace('#', ''))) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    }
    
    // Add click event listeners to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.id;
            
            // Toggle active class for the clicked button
            if (this.classList.contains('active')) {
                // If already active, deactivate and show all
                this.classList.remove('active');
                filterItems('All');
                
                // Set All button as active
                document.getElementById('All').classList.add('active');
            } else {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to the clicked button
                this.classList.add('active');
                
                // Filter the items
                filterItems(filterValue);
            }
        });
    });
    
    // View Toggle Functionality
    const twoColumnBtn = document.getElementById('two-column-btn');
    const threeColumnBtn = document.getElementById('three-column-btn');
    const gridContainer = document.querySelector('.grid-container');
    
    if (twoColumnBtn && threeColumnBtn && gridContainer) {
        twoColumnBtn.addEventListener('click', function() {
            if (!this.classList.contains('active')) {
                threeColumnBtn.classList.remove('active');
                this.classList.add('active');
                gridContainer.classList.remove('three-columns');
                
                // Animate the transition
                gridItems.forEach(item => {
                    item.style.opacity = '0.5';
                    setTimeout(() => {
                        item.style.opacity = '1';
                    }, 300);
                });
            }
        });
        
        threeColumnBtn.addEventListener('click', function() {
            if (!this.classList.contains('active')) {
                twoColumnBtn.classList.remove('active');
                this.classList.add('active');
                gridContainer.classList.add('three-columns');
                
                // Animate the transition
                gridItems.forEach(item => {
                    item.style.opacity = '0.5';
                    setTimeout(() => {
                        item.style.opacity = '1';
                    }, 300);
                });
            }
        });
        
        // Initialize with correct column setting
        if (window.innerWidth > 992) {
            // Default to two columns on desktop
            twoColumnBtn.classList.add('active');
            threeColumnBtn.classList.remove('active');
            gridContainer.classList.remove('three-columns');
        } else {
            // For smaller screens, adjust based on best fit
            if (window.innerWidth <= 768) {
                // On mobile, always default to one column
                twoColumnBtn.classList.add('active');
                threeColumnBtn.classList.remove('active');
                gridContainer.classList.remove('three-columns');
            }
        }
    }
    
    // Random color animation for grid items
    function initColorAnimation() {
        gridItems.forEach((item, index) => {
            // Add base animation class
            item.classList.add('color-animate');
            
            // Create random timing for color animations
            setInterval(() => {
                // Temporarily remove and re-add the animation class to reset it
                item.classList.remove('color-animate');
                
                // Force reflow
                void item.offsetWidth;
                
                // Add class back with random delay
                item.classList.add('color-animate');
            }, 5000 + Math.random() * 5000); // Random interval between 5-10 seconds (faster)
        });
    }
    
    // Initialize color animations
    initColorAnimation();
    
    // Make grid items clickable
    gridItems.forEach(item => {
        item.addEventListener('click', function() {
            const itemId = this.id;
            
            // Create a temporary element to check if HTML exists
            const testLink = document.createElement('a');
            testLink.href = `./projects/${itemId}.html`;
            
            // Check if file exists (indirectly) by first showing the "under construction" popup
            const constructionPopup = document.createElement('div');
            constructionPopup.className = 'construction-popup';
            constructionPopup.innerHTML = `
                <div class="construction-content">
                    <button class="construction-close">&times;</button>
                    <h3>Page Under Construction</h3>
                    <p>This project page is currently being built. Check back soon!</p>
                    <i class="fas fa-hard-hat" style="font-size: 32px; color: #f39c12; margin-top: 15px;"></i>
                </div>
            `;
            
            // Append popup to body initially hidden
            document.body.appendChild(constructionPopup);
            
            // Add event listener to close button
            const closeButton = constructionPopup.querySelector('.construction-close');
            closeButton.addEventListener('click', function() {
                constructionPopup.classList.remove('active');
                setTimeout(() => {
                    constructionPopup.remove();
                }, 300);
            });
            
            // Try to fetch the HTML file to check if it exists
            fetch(`./projects/${itemId}.html`)
                .then(response => {
                    if (response.ok) {
                        // HTML exists, navigate to it
                        window.location.href = `./projects/${itemId}.html`;
                        constructionPopup.remove(); // Remove the popup if it was added
                    } else {
                        // HTML doesn't exist, show the popup
                        constructionPopup.classList.add('active');
                    }
                })
                .catch(error => {
                    // Error occurred, show the popup
                    constructionPopup.classList.add('active');
                    console.log('Project page not found:', error);
                });
        });
    });

    // Dog API functionality
    const dogButton = document.getElementById('fetch-dog-button');
    if (dogButton) {
        dogButton.addEventListener('click', fetchRandomDogImage);
    }
    
    // Resume link to open PDF
    const resumeLink = document.getElementById('resume');
    if (resumeLink) {
        resumeLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.open('./rr-cv.pdf', '_blank');
        });
    }
    
    // Initial check for scroll animations
    checkScroll();
    
    // Check for scroll animations on scroll
    window.addEventListener('scroll', checkScroll);

    // Contact button and popup functionality
    const contactButton = document.getElementById('contact-button');
    const contactPopup = document.getElementById('contact-popup');
    const popupClose = document.getElementById('popup-close');
    const contactForm = document.getElementById('contact-form');
    
    // Toggle contact popup
    if (contactButton && contactPopup) {
        contactButton.addEventListener('click', function() {
            contactPopup.classList.toggle('active');
        });
    }
    
    // Close popup when close button is clicked
    if (popupClose && contactPopup) {
        popupClose.addEventListener('click', function() {
            contactPopup.classList.remove('active');
        });
    }
    
    // Handle contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Email data to send
            const recipientEmail = 'rr789@cornell.edu';
            const emailData = {
                to: recipientEmail,
                from: email,
                subject: `Portfolio Contact Form: Message from ${name}`,
                text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
            };
            
            // Send email using a service like EmailJS or a similar API
            // This is a simplified example that would need to be configured with your email service
            sendEmail(emailData)
                .then(response => {
                    // Clear form
                    contactForm.reset();
                    
                    // Show success message
                    const formContent = contactForm.innerHTML;
                    contactForm.innerHTML = '<div class="success-message">Thank you! Your message has been sent.</div>';
                    
                    // Reset form after delay
                    setTimeout(() => {
                        contactPopup.classList.remove('active');
                        setTimeout(() => {
                            contactForm.innerHTML = formContent;
                        }, 500);
                    }, 3000);
                })
                .catch(error => {
                    console.error('Error sending email:', error);
                    alert('There was an error sending your message. Please try again.');
                });
        });
    }
});

// Function to check which elements should be animated on scroll
function checkScroll() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    animatedElements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight * 0.85) {
            element.classList.add('visible');
        }
    });
}

// Function to fetch and display random dog image
function fetchRandomDogImage() {
    // Show loading indicator if you want
    const dogImageContainer = document.getElementById('dog-image-container');
    if (dogImageContainer) {
        dogImageContainer.innerHTML = '<p>Fetching dog image...</p>';
    }
    
    // Fetch random dog image from API
    fetch('https://dog.ceo/api/breeds/image/random')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                displayDogImage(data.message);
            } else {
                throw new Error('Failed to get dog image');
            }
        })
        .catch(error => {
            console.error('Error fetching dog image:', error);
            if (dogImageContainer) {
                dogImageContainer.innerHTML = '<p>Failed to fetch dog image. Please try again.</p>';
            }
        });
}

// Function to display the dog image on the page
function displayDogImage(imageUrl) {
    const dogImageContainer = document.getElementById('dog-image-container');
    if (dogImageContainer) {
        // Clear previous content
        dogImageContainer.innerHTML = '';
        
        // Create and add image element
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = 'Random Dog';
        img.classList.add('dog-image');
        dogImageContainer.appendChild(img);
    }
}

// Function to send email (implement with your preferred email service)
function sendEmail(emailData) {
    // This is a placeholder for actual email sending functionality
    // You would replace this with your email service API (EmailJS, SendGrid, etc.)
    return new Promise((resolve, reject) => {
        // For demonstration, log the email data and resolve after a delay
        console.log('Email would be sent with data:', emailData);
        
        // Example using EmailJS (you would need to include their library and set up an account)
        // emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', emailData, 'YOUR_USER_ID')
        //     .then(response => resolve(response))
        //     .catch(error => reject(error));
        
        // For now, simulate successful sending
        setTimeout(() => {
            resolve({ status: 'success' });
            // Optionally, you can make this more realistic by occasionally rejecting:
            // Math.random() > 0.9 ? reject(new Error('Random error')) : resolve({ status: 'success' });
        }, 1500);
    });
}


