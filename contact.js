"use strict";

document.addEventListener('DOMContentLoaded', function() {
    // Contact popup functionality
    const contactButton = document.getElementById('contact-button');
    const contactPopup = document.getElementById('contact-popup');
    const popupClose = document.getElementById('popup-close');
    const contactForm = document.getElementById('contact-form');
    
    if (contactButton && contactPopup) {
        contactButton.addEventListener('click', function() {
            contactPopup.classList.add('active');
        });
    }
    
    if (popupClose && contactPopup) {
        popupClose.addEventListener('click', function() {
            contactPopup.classList.remove('active');
        });
    }
    
    // Handle form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = contactForm.querySelector('input[name="name"]').value;
            const email = contactForm.querySelector('input[name="email"]').value;
            const message = contactForm.querySelector('textarea[name="message"]').value;
            
            // Send email using EmailJS or similar service
            sendEmail(name, email, message);
        });
    }
    
    // Email sending function
    function sendEmail(name, email, message) {
        // You'll need to sign up for a service like EmailJS, Formspree, or use your own backend
        // Below is an example using EmailJS
        
        // First, create an account at emailjs.com
        // Replace these with your actual EmailJS user ID and template ID
        const emailjsUserId = 'YOUR_EMAILJS_USER_ID';
        const emailjsTemplateId = 'YOUR_EMAILJS_TEMPLATE_ID';
        const emailjsServiceId = 'YOUR_EMAILJS_SERVICE_ID';
        
        const templateParams = {
            from_name: name,
            from_email: email,
            message: message
        };
        
        // Display loading state
        const sendButton = contactForm.querySelector('.send-button');
        const originalButtonText = sendButton.textContent;
        sendButton.textContent = 'Sending...';
        sendButton.disabled = true;
        
        // Note: You need to include the EmailJS SDK in your HTML to use this
        // <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
        
        // This is commented out as you'll need to configure EmailJS properly
        /*
        emailjs.send(emailjsServiceId, emailjsTemplateId, templateParams, emailjsUserId)
            .then(function() {
                // Show success message
                contactForm.innerHTML = '<div style="text-align: center; padding: 20px;"><h3>Message Sent!</h3><p>Thank you for reaching out. I\'ll get back to you soon.</p></div>';
            })
            .catch(function(error) {
                // Show error message
                sendButton.textContent = originalButtonText;
                sendButton.disabled = false;
                alert('Sorry, there was an error sending your message. Please try again later.');
                console.error('EmailJS error:', error);
            });
        */
        
        // For now, just simulate success
        setTimeout(() => {
            contactForm.innerHTML = '<div style="text-align: center; padding: 20px;"><h3>Message Sent!</h3><p>Thank you for reaching out. I\'ll get back to you soon.</p></div>';
        }, 1500);
    }
    
    // Scroll animation functionality
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    function checkScroll() {
        animatedElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight * 0.85) {
                element.classList.add('visible');
            }
        });
    }
    
    // Initial check on page load
    checkScroll();
    
    // Check on scroll
    window.addEventListener('scroll', checkScroll);
}); 