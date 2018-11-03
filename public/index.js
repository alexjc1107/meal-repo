'use strict';

let loginUsername = '';
let restaurantName = '';
let entryText = '';
let dishName = '';
let imageURL = '';
let imgString = '';
let restaurantData = '';

function renderHomepage() {
    $('#js-main').html(`
        <h1 class="center">Meal Repo</h1>
        <form id="loginForm" class="loginForm">
            <label for="loginUsername" class="formLabel">Username</label>
            <input type="text" name="loginUsername" placeholder="Username" id="loginUsername", autocomplete="username" class="loginTextBox">
            <label for="loginPassword" class="formLabel">Password</label>
            <input type="password" name="loginPassword" placeholder="Password" id="loginPassword" autocomplete="current-password" class="loginTextBox">
            <button class="homepageButton">Log In</button>
        </form>
        <h2>Don't have an account? Sign up now, it's free!</h2>
        <form id="signUpForm">
            <label for="signUpUsername" class="formLabel">Username</label>
            <input type="text" name="signUpUsername" placeholder="Username" id="signUpUsername", autocomplete="username" class="loginTextBox">
            <label for="signUpPassword" class="formLabel">Password</label>
            <input type="password" name="signUpPassword" placeholder="Password" id="signUpPassword" autocomplete="current-password" class="loginTextBox">
            <button class="homepageButton">Sign Up</button>
        </form>
    `);
}

function handleLoginButton() {
    $('#loginForm').on('submit', (e) => {
        e.preventDefault();
        loginUsername = $('#loginUsername').val();
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
                localStorage.setItem('jwt', next.authToken);
                getRestaurants();
            },
            error: (err) => {
                console.log(err);
                $("#loginForm").trigger('reset');
                alert(`username or password is incorrect`);
            }
        });
    });
}

function handleSignUpButton() {
    $('#signUpForm').on('submit', (e) => {
        e.preventDefault();
        $.ajax({
            url: '/api/users/',
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({
                'username': $('#signUpUsername').val(),
                'password': $('#signUpPassword').val()
            }),
            success: () => {
                $("#signUpForm").trigger('reset');
                alert(`Username registered successfully. Login to continue.`);
            },
            error: (err) => {
                console.log(err);
                $("#signUpForm").trigger('reset');
                alert(`${err.responseJSON.location} ${err.responseJSON.message}`);
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
            renderUserPage(next);
        },
        error: (err) => {
            console.log(err);
        }
    });
}

function renderUserPage(restaurantsData) {
    $('#js-main').html(`
        <p class="welcome">Welcome ${loginUsername}</p>
        <div class="navigation">
            <button type="button" id="homeButton">Home</button>
            <button type="button" id="logOutButton" class="logOutButton">Log Out</button>
        </div>
        <h1>Restaurants</h1>
        <p>Choose a restaurant to view the dishes you've saved or select New Entry below</p>
        <button type="button" id="addNewEntryButton" class="center newEntryButton">New Entry</button>
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
    restaurantList.sort((a, b) => a.localeCompare(b));
    restaurantList.forEach((uniqueRestaurant) => {
        $('#restaurantList').append(`
        <li><a href="#" id="${uniqueRestaurant}" class="restaurantLI">${uniqueRestaurant}</a></li>
    `);
    });
    handleLogoutButton();
    handleAddNewEntryButton();
    handleRestaurantClick(restaurantsData);
    handleHomeButton();
}

function handleLogoutButton() {
    $('#logOutButton').on('click', (e) => {
        localStorage.setItem('jwt', '');
        handleHome();
    });
}

function handleAddNewEntryButton() {
    $('#addNewEntryButton').on('click', (e) => {
        renderAddNewEntryPage();
    });
}

function renderAddNewEntryPage() {
    $('#js-main').html(`
        <button type="button" id="homeButton" class="navigation">Home</button>
        <h1>Add New Entry</h1>
        <p>Select a photo of your dish, click "Upload Photo", and add in details below</p> 
        <form action="/upload" id="uploadForm" method="post" enctype="multipart/form-data">
            <label for="photoUpload">1.</label>
            <input type="file" name="photoUpload" id="photoUpload" accept="image/*" class="editMeal">
            <label for="photoUploadButton">2.</label>      
            <button type="submit" id="photoUploadButton" name="photoUploadButton" class="editMeal">Upload Photo</button>
        </form>
        <div id="imageDisplayArea"></div>
        <form id="addEntryForm">
            <label for="restaurantName">3. Restaurant Name</label>
            <input type="text" name="restaurantName" placeholder="Restaurant Name" id="restaurantName" class="editMeal" required>
            <label for="dishName">4. Dish Name</label>
            <input type="text" name="dishName" placeholder="Dish Name" id="dishName" class="editMeal" required>
            <label for="entryText">5. Review</label>
            <textarea name="entryText" cols="40" rows="5" id="entryText" placeholder="Detail your restaurant experience here" class="editMeal"></textarea>
            <button class="submitEditButton">Add Entry</button>
        </form>
    `);
    handleAddEntryButton();
    handleHomeButton();
    handleUploadSubmitButton();
}

function handleUploadSubmitButton() {
    $('#uploadForm').on('click', '#photoUploadButton', (e) => {
        let fd = new FormData($("form").get(0));
        e.preventDefault();
        $.ajax({
            url: '/upload',
            type: 'POST',
            processData: false,
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            data: fd,
            contentType: false,
            success: (send) => {
                $('#imageDisplayArea').html(`
                    <img src="${send}" alt="User uploaded image" />
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
    $('#addEntryForm').on('submit', (e) => {
        e.preventDefault();
        $.ajax({
            url: '/meal',
            type: 'POST',
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({
                'restaurant': $('#restaurantName').val(),
                'dish': $('#dishName').val(),
                'content': $('#entryText').val(),
                'username': loginUsername,
                'imageURL': imageURL
            }),
            success: () => {
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
            <button type="button" id="homeButton" class="navigation">Home</button>
            <h1>Meals at ${e.target.id}</h1>
            <p>Select an entry below to edit</p>
            <section id="mealList" class="mealList">
            </section>
        `);
        restaurantsData.forEach((meal) => {
            if (meal.restaurant == e.target.id && meal.username == loginUsername) {
                let convertDate = new Date(meal.created);
                if (meal.imageURL.length > 1) {
                    imgString = (`<img class="imgOffset" src="${meal.imageURL}" alt="${meal.dish}"/>`);
                } else {
                    imgString = ``;
                };
                $('#mealList').append(`
                    <div class="card center">
                        <a class="card-link" href="#" id="${meal.id}">${meal.dish}</a>
                        ${imgString}
                        <p class="meal-date">Date: ${convertDate.toDateString().substr(4,12)}</p>
                        <p>Review: ${meal.content}</p>
                    </div>
                `);
            };
        });
        imgString = '';
        handleMealClick(restaurantsData);
        handleHomeButton();
    });
}

function handleMealClick(restaurantsData) {
    $('#mealList').on('click', (e) => {
        e.preventDefault();
        $('#js-main').html(`
            <button type="button" id="homeButton" class="navigation">Home</button>
            <h1>Editing Meal: ${restaurantsData.find(mealId => mealId.id == e.target.id).dish}</h1>
            <button type="button" id="deleteEntryButton" class="deleteEntryButton">Delete Entry</button>
            <form id="editEntryForm">
                <label for="restaurantName">Restaurant Name</label>    
                <input type="text" name="restaurantName" value="${restaurantsData.find((mealId) => mealId.id == e.target.id).restaurant}" id="restaurantName" class="editMeal">
                <label for="dishName">Dish Name</label>
                <input type="text" name="dishName" value="${restaurantsData.find((mealId) => mealId.id == e.target.id).dish}" id="dishName" class="editMeal">
                <label for="entryText">Review</label>
                <textarea name="entryText" cols="40" rows="5" id="entryText" class="editMeal">${restaurantsData.find((mealId) => mealId.id == e.target.id).content}</textarea>
                <button class="editMeal">Submit Edits</button>
            </form>
            
        `);
        handleEditSubmitButton(e.target.id);
        handleDeleteEntryButton(e.target.id, restaurantsData.find((mealId) => mealId.id == e.target.id).imageURL);
        handleHomeButton();
    });
}

function handleEditSubmitButton(mealId) {
    $('#editEntryForm').on('submit', (e) => {
        e.preventDefault();
        $.ajax({
            url: '/meal',
            type: 'PUT',
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({
                'restaurant': $('#restaurantName').val(),
                'dish': $('#dishName').val(),
                'content': $('#entryText').val(),
                'id': mealId
            }),
            error: (err) => {
                console.log(err);
            }
        });
        getRestaurants();
    });
}

function handleDeleteEntryButton(mealId, imageURL) {
    $('#deleteEntryButton').on('click', (e) => {
        $.ajax({
            url: '/meal',
            type: 'DELETE',
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({
                'id': mealId
            }),
            error: (err) => console.log(err)
        });
        if (imageURL.length > 1) {
            $.ajax({
                url: '/upload',
                type: 'DELETE',
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('jwt')
                },
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({
                    'imageURL': imageURL
                }),
                error: (err) => console.log(err)
            });
        };
        getRestaurants();
    });
}

function handleHomeButton() {
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