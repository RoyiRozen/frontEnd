"use strict";

document.addEventListener('DOMContentLoaded', () => {
    const contactButton = document.getElementById('contact-button');
    const contactPopup = document.getElementById('contact-popup');
    const closeButton = document.getElementById('popup-close');
    const contactForm = document.getElementById('contact-form');

    // Toggle popup when contact button is clicked
    contactButton.addEventListener('click', () => {
        contactPopup.classList.add('active');
    });

    // Close popup when close button is clicked
    closeButton.addEventListener('click', () => {
        contactPopup.classList.remove('active');
    });

    // Close popup when clicking outside
    document.addEventListener('click', (e) => {
        if (!contactPopup.contains(e.target) && !contactButton.contains(e.target)) {
            contactPopup.classList.remove('active');
        }
    });

    // Handle form submission
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Store in localStorage with timestamp
        const timestamp = new Date().toISOString();
        const lead = {
            name,
            email,
            message,
            timestamp
        };
        
        // Get existing leads or initialize empty array
        const existingLeads = JSON.parse(localStorage.getItem('contactLeads') || '[]');
        existingLeads.push(lead);
        
        // Save updated leads
        localStorage.setItem('contactLeads', JSON.stringify(existingLeads));
        
        // Hide form fields and show success message
        const formFields = contactForm.querySelector('.form-fields');
        const formDivider = contactForm.querySelector('.form-divider');
        const formActions = contactForm.querySelector('.form-actions');
        
        formFields.style.display = 'none';
        formDivider.style.display = 'none';
        formActions.style.display = 'none';
        
        // Create and show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <h3>Thank you!</h3>
                <p>Your message has been sent successfully.</p>
                <p>I will get back to you soon!</p>
            </div>
        `;
        
        contactForm.appendChild(successMessage);
        
        // Close popup after 3 seconds
        setTimeout(() => {
            contactPopup.classList.remove('active');
            // Reset form and remove success message after popup is closed
            setTimeout(() => {
                contactForm.reset();
                successMessage.remove();
                formFields.style.display = 'block';
                formDivider.style.display = 'block';
                formActions.style.display = 'block';
            }, 500);
        }, 3000);
    });

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