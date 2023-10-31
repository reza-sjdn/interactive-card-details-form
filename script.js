// OVERVIEW
// - Check if the data are valid
// - If they are valid then format them
// - When user clicks the confirm button, all the inputs appear in output


// Definition of some of the frequent used elements
const inputs = document.getElementsByTagName('input');
const confirmButton = document.getElementById('confirm-btn');
const messageBoxes = document.getElementsByClassName('message-box');
const holderName = document.getElementById('holder-name-field');
const cardNumber = document.getElementById('card-number-field');
const month = document.getElementById('month-field');
const year = document.getElementById('year-field');
const cvc = document.getElementById('cvc-field');

// A string that stores the characters are inserting
let cardNumberString = '';


// Everywhere in the window,
// Enter means click the confirm button
window.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') confirmButton.click();
});


// Loop the input fields of the form to assign the some events
for (let input of inputs) {
    // If one input field focused in, remove the error state
    // and wait for recieving data
    input.addEventListener('focusin', () => {
        input.classList.remove('input-error');
        input.classList.add('input-focus-in');
    
        // Find the associated message box
        let messageBox = input.nextElementSibling;
        if (input === month || input === year) {
            messageBox = input.parentElement.nextElementSibling;
        }
        messageBox.innerHTML = '';
    });


    // If one input field focused out,
    // format the value of the input field
    input.addEventListener('focusout', () => {
        input.classList.remove('input-focus-in');
    
        // Find the associated message box
        let messageBox = input.nextElementSibling;
        if (input === month || input === year) {
            messageBox = input.parentElement.nextElementSibling;
        }
    
        // If the input field was empty
        if (input.value === '') {
            input.classList.add('input-error');
            messageBox.innerHTML = `Can't be blank!`;
        }
    
        // Format
        else {
            if (input === holderName) {
                input.value = standardFullName(input.value);
            }
    
            else if (input === cardNumber) {
                if (input.value.length !== 25) {
                    messageBox.innerHTML = 'Must be 16 digits!';
                }
            }
    
            else if (input === month || input === year) {
                input.value = (input.value).padStart(2, '0');
            }
    
            else if (input === cvc) {
                input.value = (input.value).padStart(4, '0');
            }
        }
    });

}


// This section checks the integrity of card number
// in real-time and also puts hyphen after every 4 digits
cardNumber.addEventListener('input', (event) => {
    // Find the associated message box
    const messageBox = cardNumber.nextElementSibling;

    // If the input was a digit(and also a backspace)
    if (event.data >= '0' && event.data <= '9') {
        // clear the error state if there was and 
        // apply the focus-in state
        messageBox.classList.remove('input-error');
        messageBox.classList.add('input-focus-in');
        messageBox.innerHTML = '';

        // if the input wasn't backspace, append
        // the character to the end of store string
        if (event.data !== null) {
            cardNumberString += event.data;
            const length = cardNumberString.length;
            
            // This part format the card number such that 
            // after every 4 digits, a hyphen showes up
            if (length % 4 === 1 && length > 1 && length <= 13) {
                cardNumber.value = cardNumber.value.slice(0, cardNumber.value.length - 1) +
                                   ' - ' + cardNumber.value[cardNumber.value.length - 1];
            }
        }

        // If the input was a backspace
        else {
            // If the last character in the input field
            // was white space, remove the seperating hyphen
            if (cardNumber.value[cardNumber.value.length - 1] === ' ') {
                cardNumber.value = cardNumber.value.slice(0, cardNumber.value.length - 3);
            }
            
            // Otherwise the user wants to remove the last digit
            // and the store string must be truncated by one character
            const length = cardNumberString.length;
            cardNumberString = cardNumberString.slice(0, length - 1);
        }
    }

    // Otherwise the user has entered a character except digit
    // and it triggers the error state
    else {
        cardNumber.value = cardNumber.value.slice(0, cardNumber.value.length - 1);
        messageBox.classList.remove('input-focus-in');
        messageBox.classList.add('input-error');
        messageBox.innerHTML = 'Wrong format. numbers only!';
    }
});


// This section checks the integrity of month number
// in real-time
month.addEventListener('input', () => {
    // Find the associated message box
    const messageBox = month.parentElement.nextElementSibling;

    const monthNumber = Number(month.value);
    // If the input field was empty or its data was valid
    // put it in the focus-in state
    if (month.value === '' || (monthNumber >= 1 && monthNumber <= 12)) {
        messageBox.classList.remove('input-error');
        messageBox.classList.add('input-focus-in');
        messageBox.innerHTML = '';
    }

    // If the month input was out of range
    else {
        messageBox.classList.remove('input-focus-in');
        messageBox.classList.add('input-error');
        messageBox.innerHTML = 'Must be 1-12!';
    }
})


// When the user clicks the confirm button,
// all the inputs appear in output
// Of course, before it shows information 
// in the output, checks for no-error form
confirmButton.addEventListener('click', () => {
    // Tracker for checking of no-error form
    let everyThingOk = 1;
    // String for showing error message in the alert box
    let alertMessage = '';

    // Loop through all the input fields
    for (const input of inputs) {

        // If there was just one input field empty
        // break and inform the user to enter his/her data
        if (input.value === '') {
            everyThingOk = 0;
            alertMessage = 'Please fill out the form!';
            break;
        }

        // Find the associated message box
        let messageBox = input.nextElementSibling;
        if (input === month || input === year) {
            messageBox = input.parentElement.nextElementSibling;
        }

        // If there was just one message box in error state
        // break and inform the user to fix his/her data
        if (messageBox.textContent !== '') {
            everyThingOk = 0;
            alertMessage = 'Please fix the wrong data!'
            break;
        }
    }

    // If everything was ok, go to output
    // otherwise show an error message in the alert box
    if (everyThingOk) confirm();
    else window.alert(alertMessage);
});


// Get the data from input fields and output them
function confirm() {
    const onCardHolderName = document.getElementById('oncard-holder-name');
    const onCardCardNumber = document.getElementById('oncard-card-number');
    const onCardExpirationDate = document.getElementById('oncard-exp-date');
    const onCardCvc = document.getElementById('oncard-cvc');

    onCardHolderName.innerHTML = holderName.value.toUpperCase();
    onCardCardNumber.innerHTML = divideCardNumber(cardNumberString);
    onCardExpirationDate.innerHTML = (year.value).padStart(2, '0') +
                                     '/' + (month.value).padStart(2, '0');
    onCardCvc.innerHTML = (cvc.value).padStart(4, '0');

    // Replace the form element with the success message element
    document.getElementById('form').style.display = 'none';
    document.getElementById('success-message').style.display = 'block';
}


// This utility function formats the full name
// If the user enters a string in any way it 
// turns it into Aaaa Bbbb format
function standardFullName(fullName) {
    fullName = fullName.toLowerCase().trim();
    const fullNameParts = fullName.split(' ');
    fullName = '';
    for (let part of fullNameParts) {
        if (part === '') continue;
        part = part.replace(part[0], part[0].toUpperCase());
        fullName += (part + ' ');
    }
    fullName = fullName.trimEnd();
    return fullName;
} 


// This utility function seperates card number
// after each 4 digits
function divideCardNumber(cardNumber) {
    let formatted = '';
    formatted += (cardNumber.substring(0, 4) + ' ');
    formatted += (cardNumber.substring(4, 8) + ' ');
    formatted += (cardNumber.substring(8, 12) + ' ');
    formatted += (cardNumber.substring(12, 16));
    return formatted;
}