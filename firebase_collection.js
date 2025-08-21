// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCQ7sf9LVxEZeOS0Z-IQOMAvm_G6QVwD4s",
    authDomain: "yuh-deep.firebaseapp.com",
    projectId: "yuh-deep",
    storageBucket: "yuh-deep.appspot.com",
    messagingSenderId: "390542449658",
    appId: "1:390542449658:web:cd1e79d8989895c3dea243"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Hunter.io API key
const HUNTER_API_KEY = "cac01122f843bb9dcb998b721f2b0c50fd63962f";

// Function to validate email format (basic regex)
function isValidEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}

// Function to validate email with Hunter.io
async function validateEmailWithHunter(email) {
    try {
        const response = await fetch(`https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${HUNTER_API_KEY}`);
        const data = await response.json();
        return data.data.result === 'deliverable'; // Returns true if the email is deliverable
    } catch (error) {
        console.error('Error validating email with Hunter:', error);
        return false;
    }
}

// Attach event listener to the form submission
document.getElementById("submit").addEventListener('click', async function(e) {
    e.preventDefault(); // Prevent the default form submission

    // Get form values
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    // Debugging logs
    console.log("Username:", username);
    console.log("Email:", email);
    console.log("Subject:", subject);
    console.log("Message:", message);

    // Check if all fields are filled
    if (username && email && subject && message) {
        // Check if the email format is valid using regex
        if (isValidEmail(email)) {
            console.log("Email format is valid. Now validating with Hunter.io...");

            // Validate email with Hunter.io API
            const isEmailValid = await validateEmailWithHunter(email);

            if (isEmailValid) {
                console.log("Email is deliverable according to Hunter.io.");

                // Email is valid and all fields are filled, proceed with setting the data in Firebase
                set(ref(db, 'users/' + username), {
                    username: username,
                    email: email,
                    subject: subject,
                    message: message
                })
                    .then(() => {
                        console.log('Data successfully saved to Firebase.');

                        // Redirect to confirmation page
                        window.location.href = "confirmation.html";
                    })
                    .catch((error) => {
                        console.error('Error writing to Firebase:', error);
                    });
            } else {
                console.log("Email is not deliverable according to Hunter.io.");
                alert("The email address is not valid or deliverable. Please enter a different email.");
            }
        } else {
            console.log("Invalid email format.");
            alert("Please enter a valid email address.");
        }
    } else {
        console.log("Not all fields are filled.");
        alert("Please fill in all details before submitting.");
    }
});
