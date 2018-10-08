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
            "restaurant": "Popeyes",
            "content": "Fried Chicken is good",
            "username": "testuser",
            "created": 1470009976609
        },
        {
            "id": "5555555",
            "restaurant": "Popeyes",
            "content": "Fried Chicken is good",
            "username": "testuser",
            "created": 1470009976610
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
        renderUserPage();
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

function renderUserPage() {
    console.log('renderUserPage ran');
    $('#js-main').html(`
        <p>username</p>
        <button type="button" id="logOutButton">Log Out</button>
        <button type="button" id="addNewEntryButton">Add New Entry</button>
        <p>Restaurants</p>
    `);
    let restaurantList = [];
    let counter = 0;
    MOCK_MEAL_DATA.meals.forEach(meal => {
        restaurantList[counter] = meal.restaurant;
        counter++;
    });
    restaurantList = restaurantList.filter((x, i, a) => a.indexOf(x) == i)
    restaurantList.forEach(uniqueRestaurant => {
        $('#js-main').append(`
            <a href="https://www.google.com">${uniqueRestaurant}</a><br>
        `);
    });
    console.log(restaurantList);
    handleLogoutButton();
    handleAddNewEntryButton();
}

function handleLogoutButton() {
    console.log('handleLogoutButton ran');
    $('#logOutButton').on('click', (e) => {
        console.log('log out clicked');
        handleHome();
    });
}

function handleAddNewEntryButton() {
    console.log('handleAddNewEntryButton ran');
    $('#addNewEntryButton').on('click', (e) => {
        console.log('add new entry clicked');
        renderAddNewEntryPage();
    });
}

function renderAddNewEntryPage() {
    console.log('renderAddNewEntryPage ran');
    $('#js-main').html(`
        <form id="addEntryForm">
            <input type="text" name="restaurantName" placeholder="Restaurant Name" id="restaurantName">
            <input type="text" name="entryText" placeholder="Detail your restaurant experience here" id="entryText">
            <button>Add Entry</button>
        </form>
    `);
    handleAddEntryButton();
}

function handleAddEntryButton() {
    console.log('handleAddEntryButton ran');
    $('#addEntryForm').on('submit', (e) => {
        e.preventDefault();
        console.log('add entry clicked');
        const restaurantName = $('#restaurantName').val();
        console.log(restaurantName);
        const entryText = $('#entryText').val();
        console.log(entryText);
        renderUserPage();
    });
}

function handleHome() {
    renderHomepage();
    handleLoginButton();
    handleSignUpButton();
}

$(handleHome);