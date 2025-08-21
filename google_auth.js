// Firebase SDK imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// Firebase configuration
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
const auth = getAuth(app);

// Function to set up Google Sign-In button
function setupGoogleSignInButton(buttonId) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.addEventListener('click', function () {
            const provider = new GoogleAuthProvider();
            signInWithPopup(auth, provider)
                .then((result) => {
                    const user = result.user;
                    console.log("User signed in: ", user);
                    window.location.href = `google_confirmation.html?email=${encodeURIComponent(user.email)}`;
                })
                .catch((error) => {
                    if (error.code === 'auth/popup-closed-by-user') {
                        alert("You closed the sign-in popup before completing the process.");
                    } else if (error.code === 'auth/network-request-failed') {
                        alert("Network error. Please check your connection and try again.");
                    } else {
                        console.error('Error during sign-in: ', error);
                    }
                });
        });
    } else {
        console.warn(`Button with ID "${buttonId}" not found.`);
    }
}

// Set up sign-in buttons
setupGoogleSignInButton('googleSignInBtnBasic');
setupGoogleSignInButton('googleSignInBtnPro');
