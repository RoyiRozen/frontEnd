"use strict";
import net from 'net';

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

// Add event listener to dog button
document.addEventListener('DOMContentLoaded', function() {
    const dogButton = document.getElementById('fetch-dog-button');
    if (dogButton) {
        dogButton.addEventListener('click', fetchRandomDogImage);
    }
});


