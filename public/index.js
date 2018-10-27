'use strict';

let loginUsername = '';
let restaurantName = '';
let entryText = '';
let dishName = '';
let imageURL = '';

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
        $.ajax({
            url: '/api/auth/login/',
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({
                "username": $('#loginUsername').val(),
                "password": $('#loginPassword').val()
            }),
            success: (next) => {
                console.log('authenticated');
                console.log(next);
                localStorage.setItem('jwt', next.authToken);
                console.log(localStorage.getItem('jwt'));
                getRestaurants();
            },
            error: (err) => {
                console.log(err);
            }
        });

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
            url: '/api/users/',
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({
                'username': $('#signUpUsername').val(),
                'password': $('#signUpPassword').val()
            }),
            success: console.log('user created'),
            error: (err) => {
                console.log(err);
            }
        });
    });
}

function getRestaurants() {
    $.ajax({
        url: '/meal',
        type: 'GET',
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('jwt')
        },
        success: (next) => {
            console.log(next);
            renderUserPage(next);
        },
        error: (err) => {
            console.log(err);
        }
    });
}

function renderUserPage(restaurantsData) {
    console.log('renderUserPage ran');
    console.log(loginUsername);
    console.log(restaurantsData);

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
    restaurantsData.forEach((meal) => {
        if (loginUsername == meal.username) {
            restaurantList[counter] = meal.restaurant;
            counter++;
        };
    });
    restaurantList = restaurantList.filter((x, i, a) => a.indexOf(x) == i)
    restaurantList.forEach((uniqueRestaurant) => {
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
        localStorage.setItem('jwt', '');
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
            
        <form action="/upload" id="uploadForm" method="post" enctype="multipart/form-data">
                <input type="file" name="photoUpload" />
                <input type="submit" id="photoUploadButton" value="Upload Photo"/>
        </form>
        <div id="imageDisplayArea"></div>
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
    handleUploadSubmitButton();
}

function handleUploadSubmitButton() {
    console.log('handleUploadSubmitButton ran');
    $('#uploadForm').on('click', '#photoUploadButton', (e) => {
        console.log('upload prevented default behavior')
        var fd = new FormData($("form").get(0));
        e.preventDefault();
        $.ajax({
            url: '/upload',
            type: 'POST',
            processData: false,
            data: fd,
            contentType: false,
            success: (send) => {
                console.log(send);
                $('#imageDisplayArea').html(`
                    <img src="${send}" />
                `);
                imageURL = send;
            },
            error: (err) => {
                console.log(err);
            }
        });
    });
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
        console.log(imageURL);
        $.ajax({
            url: '/meal',
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({
                'restaurant': $('#restaurantName').val(),
                'dish': $('#dishName').val(),
                'content': $('#entryText').val(),
                'username': loginUsername,
                'imageURL': imageURL
            }),
            success: (send) => {
                console.log(send);
                imageURL = '';
            },
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
        restaurantsData.forEach((meal) => {
            if (meal.restaurant == e.target.id && meal.username == loginUsername) {
                console.log(meal);
                $('#mealList').append(`
                    <div class="card">
                        <a class="card-link" href="#" id="${meal.id}"></a>
                        <h2>${meal.dish}</h2>
                        <p>Review: ${meal.content}</p>
                        <p>Date: ${meal.created}</p>
                        <p>ID: ${meal.id}</p>
                        <img src="${meal.imageURL}" />
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
        console.log(restaurantsData.find((mealId) => mealId.id == e.target.id).created);
        $('#js-main').html(`
            <button type="button" id="homeButton">Home</button>
            <h1>Editing Meal: ${restaurantsData.find(mealId => mealId.id == e.target.id).dish}</h1>
            <form id="editEntryForm">
                <input type="text" name="restaurantName" value="${restaurantsData.find((mealId) => mealId.id == e.target.id).restaurant}" id="restaurantName">
                <input type="text" name="dishName" value="${restaurantsData.find((mealId) => mealId.id == e.target.id).dish}" id="dishName">
                <input type="text" name="entryText" value="${restaurantsData.find((mealId) => mealId.id == e.target.id).content}" id="entryText">
                <button>Submit</button>
            </form>
            <button type="button" id="deleteEntryButton">Delete Entry</button>
        `);
        let objIndex = restaurantsData.findIndex((entry) => entry.id == e.target.id);
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
        const query = {
            url: '/meal',
            type: 'DELETE',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({
                'id': mealId
            }),
            success: getRestaurants(),
            error: (err) => console.log(err)
        };
        $.ajax(query);

    });
}

function handleHomeButton() {
    console.log('handleHomeButton ran');
    $('#homeButton').on('click', (e) => {
        imageURL = '';
        getRestaurants();
    });
}

function handleHome() {
    renderHomepage();
    handleLoginButton();
    handleSignUpButton();
}

$(handleHome);