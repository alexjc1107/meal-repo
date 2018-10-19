'use strict';

let loginUsername = '';
let restaurantName = '';
let entryText = '';
let dishName = '';

/*
let MOCK_MEAL_DATA = {
    "meals": [{
            "id": "1111111",
            "restaurant": "McDonalds",
            "dish": "French Fries",
            "content": "Fries are good",
            "username": "alex",
            "created": 1470016976609
        },
        {
            "id": "2222222",
            "restaurant": "Chick-fil-a",
            "dish": "Spicy Chicken",
            "content": "Spicy Chicken is good",
            "username": "alex",
            "created": 1470012976609
        },
        {
            "id": "333333",
            "restaurant": "Burger King",
            "dish": "Whopper",
            "content": "Whopper is good",
            "username": "testuser",
            "created": 1470011976609
        },
        {
            "id": "4444444",
            "restaurant": "Popeyes",
            "dish": "Fried Chicken",
            "content": "Fried Chicken is good",
            "username": "testuser",
            "created": 1470009976609
        },
        {
            "id": "5555555",
            "restaurant": "Popeyes",
            "dish": "Fried Chicken",
            "content": "Fried Chicken is good",
            "username": "testuser",
            "created": 1470009976610
        },
        {
            "id": "6666666",
            "restaurant": "Popeyes",
            "dish": "Fried Chicken",
            "content": "Fried Chicken is good",
            "username": "alex",
            "created": 1470009976611
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
*/


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
        loginUsername = $('#loginUsername').val();
        console.log(loginUsername);
        const loginPassword = $('#loginPassword').val();
        console.log(loginPassword);
        //renderUserPage();
        getRestaurants();
    });
}

function handleSignUpButton() {
    console.log('handleSignUpButton ran');
    $('#signUpForm').on('submit', (e) => {
        e.preventDefault();
        console.log('sign up clicked');
        loginUsername = $('#signUpUsername').val();
        console.log(loginUsername);
        const signUpPassword = $('#signUpPassword').val();
        console.log(signUpPassword);
        $.ajax({
            url: '/user',
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({
                'username': $('#signUpUsername').val(),
                'password': $('#signUpPassword').val()
            }),
            success: getRestaurants,
            error: (err) => {
                console.log(err);
            }
        });
    });
}

function getRestaurants() {
    const query = {
        url: '/meal',
        type: 'GET',
        success: renderUserPage,
        error: err => console.log(err)
    };
    $.ajax(query);
}

function renderUserPage(restaurantsData) {
    console.log('renderUserPage ran');
    console.log(loginUsername);
    console.log(restaurantsData);
    /*$('#js-main').html(`
        <p>Welcome ${loginUsername}</p>
        <button type="button" id="homeButton">Home</button>
        <button type="button" id="logOutButton">Log Out</button>
        <button type="button" id="addNewEntryButton">Add New Entry</button>
        <p>Restaurants</p>
        <ul id="restaurantList">
        </ul>
    `);
    let restaurantList = [];
    let counter = 0;
    MOCK_MEAL_DATA.meals.forEach(meal => {
        if (loginUsername == meal.username) {
            restaurantList[counter] = meal.restaurant;
            counter++;
        };
    });
    restaurantList = restaurantList.filter((x, i, a) => a.indexOf(x) == i)
    restaurantList.forEach(uniqueRestaurant => {
        $('#restaurantList').append(`
            <li><a href="#" id="${uniqueRestaurant}" class="restaurantLI">${uniqueRestaurant}</a></li>
        `);
    });
    console.log(restaurantList);*/

    $('#js-main').html(`
        <p>Welcome ${loginUsername}</p>
        <button type="button" id="homeButton">Home</button>
        <button type="button" id="logOutButton">Log Out</button>
        <button type="button" id="addNewEntryButton">Add New Entry</button>
        <p>Restaurants</p>
        <ul id="restaurantList">
        </ul>
    `);
    let restaurantList = [];
    let counter = 0;
    restaurantsData.forEach(meal => {
        if (loginUsername == meal.username) {
            restaurantList[counter] = meal.restaurant;
            counter++;
        };
    });
    restaurantList = restaurantList.filter((x, i, a) => a.indexOf(x) == i)
    restaurantList.forEach(uniqueRestaurant => {
        $('#restaurantList').append(`
        <li><a href="#" id="${uniqueRestaurant}" class="restaurantLI">${uniqueRestaurant}</a></li>
    `);
    });
    console.log(restaurantList);


    handleLogoutButton();
    handleAddNewEntryButton();
    handleRestaurantClick(restaurantsData);
    handleHomeButton();
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
        <button type="button" id="homeButton">Home</button>    
        <form id="addEntryForm">
            <label for="restaurantName">Restaurant Name</label>
            <input type="text" name="restaurantName" placeholder="Restaurant Name" id="restaurantName">
            <label for="dishName">Dish Name</label>
            <input type="text" name="dishName" placeholder="Dish Name" id="dishName">
            <label for="entryText">Detail</label>
            <input type="text" name="entryText" placeholder="Detail your restaurant experience here" id="entryText">
            <button>Add Entry</button>
        </form>
    `);
    handleAddEntryButton();
    handleHomeButton();
}

function handleAddEntryButton() {
    console.log('handleAddEntryButton ran');
    $('#addEntryForm').on('submit', (e) => {
        e.preventDefault();
        console.log('add entry clicked');
        restaurantName = $('#restaurantName').val();
        console.log(restaurantName);
        dishName = $('#dishName').val();
        console.log(dishName);
        entryText = $('#entryText').val();
        console.log(entryText);
        /*MOCK_MEAL_DATA.meals.push({
            "id": "7777777",
            "restaurant": $('#restaurantName').val(),
            "dish": $('#dishName').val(),
            "content": $('#entryText').val(),
            "username": loginUsername,
            "created": 1470009976612
        });*/

        $.ajax({
            url: '/meal',
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({
                'restaurant': $('#restaurantName').val(),
                'dish': $('#dishName').val(),
                'content': $('#entryText').val(),
                'username': loginUsername
            }),
            success: (send) => console.log(send),
            error: (err) => {
                console.log(err);
            }
        });

        getRestaurants();
    });
}

function handleRestaurantClick(restaurantsData) {
    $('.restaurantLI').on('click', (e) => {
        e.preventDefault();
        $('#js-main').html(`
            <button type="button" id="homeButton">Home</button>
            <h1>Meals at ${e.target.id}</h1>
            <section id="mealList">
            </section>
        `);
        console.log(e.target.id);
        restaurantsData.forEach(meal => {
            if (meal.restaurant == e.target.id && meal.username == loginUsername) {
                console.log(meal);
                $('#mealList').append(`
                    <div class="card">
                        <a class="card-link" href="#" id="${meal.id}"></a>
                        <h2>${meal.dish}</h2>
                        <p>Review: ${meal.content}</p>
                        <p>Date: ${meal.created}</p>
                        <p>ID: ${meal.id}</p>
                    </div>
                `);
            };
        });
        handleMealClick(restaurantsData);
        handleHomeButton();
    });
}

function handleMealClick(restaurantsData) {
    $('#mealList').on('click', (e) => {
        e.preventDefault();
        console.log('handleMealClick ran');
        console.log(e.target.id);
        console.log(restaurantsData.find(mealId => mealId.id == e.target.id).created);
        $('#js-main').html(`
            <button type="button" id="homeButton">Home</button>
            <h1>Editing Meal: ${restaurantsData.find(mealId => mealId.id == e.target.id).dish}</h1>
            <form id="editEntryForm">
                <input type="text" name="restaurantName" value="${restaurantsData.find(mealId => mealId.id == e.target.id).restaurant}" id="restaurantName">
                <input type="text" name="dishName" value="${restaurantsData.find(mealId => mealId.id == e.target.id).dish}" id="dishName">
                <input type="text" name="entryText" value="${restaurantsData.find(mealId => mealId.id == e.target.id).content}" id="entryText">
                <button>Submit</button>
            </form>
            <button type="button" id="deleteEntryButton">Delete Entry</button>
        `);
        let objIndex = restaurantsData.findIndex((entry => entry.id == e.target.id));
        console.log(objIndex);
        handleEditSubmitButton(e.target.id);
        handleDeleteEntryButton(e.target.id);
        handleHomeButton();
    });
}

function handleEditSubmitButton(mealId) {
    console.log('handleEditSubmitButton ran');
    $('#editEntryForm').on('submit', (e) => {
        e.preventDefault();
        console.log('edit entry clicked');
        restaurantName = $('#restaurantName').val();
        console.log(restaurantName);
        dishName = $('#dishName').val();
        console.log(dishName);
        entryText = $('#entryText').val();
        console.log(entryText);
        /*MOCK_MEAL_DATA.meals[objIndex].restaurant = $('#restaurantName').val();
        MOCK_MEAL_DATA.meals[objIndex].dish = $('#dishName').val();
        MOCK_MEAL_DATA.meals[objIndex].content = $('#entryText').val();
        console.log(MOCK_MEAL_DATA.meals[objIndex]);*/


        $.ajax({
            url: '/meal',
            type: 'PUT',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({
                'restaurant': $('#restaurantName').val(),
                'dish': $('#dishName').val(),
                'content': $('#entryText').val(),
                'id': mealId
            }),
            success: (send) => console.log(send),
            error: (err) => {
                console.log(err);
            }
        });


        getRestaurants();
    });
}

function handleDeleteEntryButton(mealId) {
    console.log('handleDeleteEntryButton ran');
    $('#deleteEntryButton').on('click', (e) => {
        //let removed = MOCK_MEAL_DATA.meals.splice(objIndex, 1);
        const query = {
            url: '/meal',
            type: 'DELETE',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({
                'id': mealId
            }),
            success: getRestaurants,
            error: err => console.log(err)
        };
        $.ajax(query);
        //console.log(removed);
        //renderUserPage();
    });
}

function handleHomeButton() {
    console.log('handleHomeButton ran');
    $('#homeButton').on('click', (e) => {
        getRestaurants();
    });
}

function handleHome() {
    renderHomepage();
    handleLoginButton();
    handleSignUpButton();
}

$(handleHome);