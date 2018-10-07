'use strict';

function renderHomepage() {
    $('#js-main').html(`
    <h1>Meal Repo</h1>
    <form id="loginForm">
        <input type="text" name="loginUsername" placeholder="Username" id="loginUsername", autocomplete="username">
        <input type="password" name="loginPassword" placeholder="Password" id="loginPassword" autocomplete="current-password">
        <button>Log In</button>
    </form>
    <h2>Sign up now, it's free!</h2>
    <form id="signUpForm">
        <input type="text" name="signUpUsername" placeholder="Username" id="signUpUsername", autocomplete="username">
        <input type="password" name="signUpPassword" placeholder="Password" id="signUpPassword" autocomplete="current-password">
        <button>Sign Up</button>
    </form>
    <!--<button id="signUpButton">Sign Up</button>-->
  `);
}

function handleLoginButton() {
    console.log('handleLoginButton ran');
    $('#loginForm').on('submit', (e) => {
        e.preventDefault();
        console.log('log in clicked');
        const loginUsername = $('#loginUsername').val();
        console.log(loginUsername);
        const loginPassword = $('#loginPassword').val();
        console.log(loginPassword);
    });
}

function handleSignUpButton() {
    console.log('handleSignUpButton ran');
    $('#signUpForm').on('submit', (e) => {
        e.preventDefault();
        console.log('sign up clicked');
        const signUpUsername = $('#signUpUsername').val();
        console.log(signUpUsername);
        const signUpPassword = $('#signUpPassword').val();
        console.log(signUpPassword);
    });
}

function handleHome() {
    renderHomepage();
    handleLoginButton();
    handleSignUpButton();
}

$(handleHome);