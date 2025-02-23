"use strict";
import net from 'net';
import { prompt } from 'prompt-sync';
import { faFacebook, faInstagram, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';

let button = document.querySelector('button');

button.addEventListener('click', () => {
    alert('Button clicked');
    let counter = 1;
    counter++;
    alert( 2 * counter );
});

let counter = 1;
alert( 2 * counter );
counter++;
alert( 2 * counter );

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

// Helper function to store the input (modify as needed)
function storeInput(value) {
    // Example: Store in an array
    const inputList = window.inputList || [];
    inputList.push(value);
    window.inputList = inputList;
    
    console.log('Stored inputs:', inputList); // For debugging
}

let linkedinIcon = document.querySelector('.fa-linkedin');
linkedinIcon.addEventListener('click', () => {
    window.open('https://www.linkedin.com/in/royi-rozen/', '_blank');
});


