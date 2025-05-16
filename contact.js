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
        
        try {
            // Send email using EmailJS
            await emailjs.send(
                'service_xxxxxxx', // Replace with your EmailJS service ID
                'template_xxxxxxx', // Replace with your EmailJS template ID
                {
                    to_email: 'rr789@cornell.edu',
                    from_name: name,
                    from_email: email,
                    message: message,
                },
                'public_key_xxxxxxx' // Replace with your EmailJS public key
            );
            
            // Store in localStorage with additional details
        const timestamp = new Date().toISOString();
        const lead = {
            name,
            email,
            message,
                timestamp,
                status: 'Unread', // Add status tracking
                notes: '' // Add ability to add notes
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

        } catch (error) {
            console.error('Failed to send email:', error);
            alert('Failed to send message. Please try again later.');
        }
    });

    // Add a keyboard shortcut to access the lead sheet (Shift + Alt + L)
    document.addEventListener('keydown', function(e) {
        if (e.shiftKey && e.altKey && e.key === 'L') {
            e.preventDefault();
            showLeadSheet();
        }
    });
    
    // Enhanced CSV export function
    function exportLeadsToCSV(leads) {
        // Create CSV content with more detailed headers
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Date,Time,Name,Email,Message,Status,Notes\n";
        
        leads.forEach(lead => {
            const date = new Date(lead.timestamp);
            const formattedDate = date.toLocaleDateString();
            const formattedTime = date.toLocaleTimeString();
            
            const row = [
                formattedDate,
                formattedTime,
                lead.name.replace(/,/g, " "), // Clean name
                lead.email,
                lead.message.replace(/,/g, " ").replace(/\n/g, " "), // Clean message
                lead.status || 'Unread',
                (lead.notes || '').replace(/,/g, " ").replace(/\n/g, " ") // Clean notes
            ].join(",");
            csvContent += row + "\n";
        });
        
        // Create and trigger download
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        const fileName = `contact_leads_${new Date().toISOString().split('T')[0]}.csv`;
        
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Enhanced lead sheet display
    function showLeadSheet() {
        const password = prompt("Enter admin password to view leads:");
        if (password !== "RR2025") {
            alert("Incorrect password");
            return;
        }
        
        const leads = JSON.parse(localStorage.getItem('contactLeads')) || [];
        
        const modal = document.createElement('div');
        modal.className = 'lead-sheet-modal';
        
        const tableHTML = `
        <div class="lead-sheet-container">
            <div class="lead-sheet-header">
                <h2>Contact Messages (${leads.length})</h2>
                <div class="lead-sheet-actions">
                <button id="export-leads" class="export-button">Export CSV</button>
                    <button id="clear-leads" class="clear-button">Clear All</button>
                <button id="close-leads" class="close-button">&times;</button>
                </div>
            </div>
            <div class="lead-table-wrapper">
            <table class="lead-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Message</th>
                            <th>Status</th>
                            <th>Notes</th>
                    </tr>
                </thead>
                <tbody>
                        ${leads.length === 0 ? 
                            `<tr><td colspan="6" style="text-align: center;">No messages yet</td></tr>` :
                            leads.map(lead => `
                                <tr>
                                    <td>${new Date(lead.timestamp).toLocaleString()}</td>
                        <td>${lead.name}</td>
                        <td>${lead.email}</td>
                        <td>${lead.message}</td>
                                    <td>
                                        <select class="status-select" data-timestamp="${lead.timestamp}">
                                            <option value="Unread" ${lead.status === 'Unread' ? 'selected' : ''}>Unread</option>
                                            <option value="Read" ${lead.status === 'Read' ? 'selected' : ''}>Read</option>
                                            <option value="Replied" ${lead.status === 'Replied' ? 'selected' : ''}>Replied</option>
                                        </select>
                                    </td>
                                    <td>
                                        <textarea class="notes-input" data-timestamp="${lead.timestamp}">${lead.notes || ''}</textarea>
                                    </td>
                    </tr>
                            `).join('')
        }
                </tbody>
            </table>
        </div>
        </div>`;
        
        modal.innerHTML = tableHTML;
        document.body.appendChild(modal);
        
        // Add event listeners for the new functionality
        modal.querySelector('#export-leads').addEventListener('click', () => exportLeadsToCSV(leads));
        modal.querySelector('#clear-leads').addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all messages? This cannot be undone.')) {
                localStorage.removeItem('contactLeads');
                modal.remove();
            }
        });
        modal.querySelector('#close-leads').addEventListener('click', () => modal.remove());
        
        // Add event listeners for status and notes updates
        modal.querySelectorAll('.status-select, .notes-input').forEach(element => {
            element.addEventListener('change', (e) => {
                const timestamp = e.target.dataset.timestamp;
                const leads = JSON.parse(localStorage.getItem('contactLeads')) || [];
                const leadIndex = leads.findIndex(l => l.timestamp === timestamp);
                
                if (leadIndex !== -1) {
                    if (e.target.classList.contains('status-select')) {
                        leads[leadIndex].status = e.target.value;
                    } else {
                        leads[leadIndex].notes = e.target.value;
                    }
                    localStorage.setItem('contactLeads', JSON.stringify(leads));
                }
            });
        });
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