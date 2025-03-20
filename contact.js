"use strict";

document.addEventListener('DOMContentLoaded', function() {
    // Contact button and popup functionality
    const contactButton = document.getElementById('contact-button');
    const contactPopup = document.getElementById('contact-popup');
    const popupClose = document.getElementById('popup-close');
    const contactForm = document.getElementById('contact-form');
    
    // Initialize leads array from localStorage or create empty array
    let leads = JSON.parse(localStorage.getItem('contactLeads')) || [];
    
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
            
            // Create lead object with timestamp
            const lead = {
                name: name,
                email: email,
                message: message,
                timestamp: new Date().toISOString()
            };
            
            // Add lead to array
            leads.push(lead);
            
            // Save leads to localStorage
            localStorage.setItem('contactLeads', JSON.stringify(leads));
            
            // Log for debugging
            console.log('Lead saved:', lead);
            
            // Email data to send (if you have a backend)
            const recipientEmail = 'rr789@cornell.edu';
            const emailData = {
                to: recipientEmail,
                from: email,
                subject: `Portfolio Contact Form: Message from ${name}`,
                text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
            };
            
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
        });
    }
    
    // Add a keyboard shortcut to access the lead sheet (Shift + Alt + L)
    document.addEventListener('keydown', function(e) {
        if (e.shiftKey && e.altKey && e.key === 'L') {
            e.preventDefault();
            showLeadSheet();
        }
    });
    
    // Function to display leads in a modal
    function showLeadSheet() {
        // Check if admin password is required
        const password = prompt("Enter admin password to view leads:");
        if (password !== "RR2025") { // Simple password protection
            alert("Incorrect password");
            return;
        }
        
        // Create modal element
        const modal = document.createElement('div');
        modal.className = 'lead-sheet-modal';
        
        // Get leads from localStorage
        const leads = JSON.parse(localStorage.getItem('contactLeads')) || [];
        
        // Create table to display leads
        let tableHTML = `
        <div class="lead-sheet-container">
            <div class="lead-sheet-header">
                <h2>Contact Leads</h2>
                <button id="export-leads" class="export-button">Export CSV</button>
                <button id="close-leads" class="close-button">&times;</button>
            </div>
            <table class="lead-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Message</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        if (leads.length === 0) {
            tableHTML += `
                <tr>
                    <td colspan="4" style="text-align: center;">No leads yet</td>
                </tr>
            `;
        } else {
            leads.forEach(lead => {
                const date = new Date(lead.timestamp).toLocaleString();
                tableHTML += `
                    <tr>
                        <td>${date}</td>
                        <td>${lead.name}</td>
                        <td>${lead.email}</td>
                        <td>${lead.message}</td>
                    </tr>
                `;
            });
        }
        
        tableHTML += `
                </tbody>
            </table>
        </div>
        `;
        
        modal.innerHTML = tableHTML;
        document.body.appendChild(modal);
        
        // Add CSS for the modal
        const style = document.createElement('style');
        style.textContent = `
            .lead-sheet-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.8);
                z-index: 2000;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            
            .lead-sheet-container {
                background-color: white;
                width: 80%;
                max-width: 1000px;
                max-height: 80vh;
                border-radius: 10px;
                overflow: auto;
                padding: 20px;
            }
            
            .lead-sheet-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 10px;
                border-bottom: 1px solid #ddd;
            }
            
            .lead-table {
                width: 100%;
                border-collapse: collapse;
            }
            
            .lead-table th,
            .lead-table td {
                padding: 10px;
                text-align: left;
                border-bottom: 1px solid #ddd;
            }
            
            .lead-table th {
                background-color: #f5f5f5;
                font-weight: bold;
            }
            
            .export-button {
                background-color: #2c3e50;
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 5px;
                cursor: pointer;
            }
            
            .close-button {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);
        
        // Add event listeners
        document.getElementById('close-leads').addEventListener('click', function() {
            document.body.removeChild(modal);
        });
        
        document.getElementById('export-leads').addEventListener('click', function() {
            exportLeadsToCSV(leads);
        });
    }
    
    // Function to export leads to CSV
    function exportLeadsToCSV(leads) {
        // Create CSV content
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Date,Name,Email,Message\n";
        
        leads.forEach(lead => {
            const date = new Date(lead.timestamp).toLocaleString();
            const row = [
                date,
                lead.name.replace(/,/g, " "), // Replace commas to avoid CSV formatting issues
                lead.email,
                lead.message.replace(/,/g, " ").replace(/\n/g, " ") // Clean message text
            ].join(",");
            csvContent += row + "\n";
        });
        
        // Create download link
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "contact_leads.csv");
        document.body.appendChild(link);
        
        // Trigger download
        link.click();
        
        // Clean up
        document.body.removeChild(link);
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