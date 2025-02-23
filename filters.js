"use strict";

// Initialize selected filters array
let selectedFilters = [];

// Get all filter buttons
const filterButtons = document.querySelectorAll('.filter-button');
const gridItems = document.querySelectorAll('.grid-item');

// Add click event listener to each filter button
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filterId = button.id;
        
        // Toggle button selection
        button.classList.toggle('selected');
        
        // Update selected filters array
        if (selectedFilters.includes(filterId)) {
            selectedFilters = selectedFilters.filter(filter => filter !== filterId);
        } else {
            selectedFilters.push(filterId);
        }
        
        // Handle 'All' filter specially
        if (filterId === 'All') {
            if (selectedFilters.includes('All')) {
                // If 'All' is selected, clear other filters
                selectedFilters = ['All'];
                filterButtons.forEach(btn => {
                    if (btn.id !== 'All') {
                        btn.classList.remove('selected');
                    }
                });
            }
        } else {
            // If another filter is selected, remove 'All'
            const allButton = document.querySelector('#All');
            allButton.classList.remove('selected');
            selectedFilters = selectedFilters.filter(filter => filter !== 'All');
        }

        // Update visible items
        updateVisibleItems();
        
        // Log current filters (for debugging)
        console.log('Selected filters:', selectedFilters);
    });
});

function updateVisibleItems() {
    gridItems.forEach(item => {
        if (selectedFilters.length === 0 || selectedFilters.includes('All')) {
            // Show all items if no filters selected or 'All' is selected
            item.style.display = 'block';
        } else {
            // Check if item has any of the selected filters
            // Note: You'll need to add data attributes to your grid items
            const itemFilters = item.getAttribute('data-filters')?.split(' ') || [];
            const shouldShow = selectedFilters.some(filter => itemFilters.includes(filter));
            item.style.display = shouldShow ? 'block' : 'none';
        }
    });
}


