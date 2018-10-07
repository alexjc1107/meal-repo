'use strict';

let MOCK_MEAL_DATA = {
    "meals": [{
            "id": "1111111",
            "restaurant": "McDonalds",
            "content": "Fries are good",
            "username": "alex",
            "created": 1470016976609
        },
        {
            "id": "2222222",
            "restaurant": "Chick-fil-a",
            "content": "Spicy Chicken is good",
            "username": "alex",
            "created": 1470012976609
        },
        {
            "id": "333333",
            "restaurant": "Burger King",
            "content": "Whopper is good",
            "username": "testuser",
            "created": 1470011976609
        },
        {
            "id": "4444444",
            "restaurant": "Popeye's",
            "content": "Fried Chicken is good",
            "username": "testuser",
            "created": 1470009976609
        }
    ]
};

let MOCK_USER_DATA = {
    "users": [{
            "id": "11111111",
            "username": "alex",
            "password": "password",
            "created": 1470016976609
        },
        {
            "id": "22222222",
            "username": "testuser",
            "password": "password",
            "created": 1470012976609
        }
    ]
};

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