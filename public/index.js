'use strict';

let loginUsername = '';
let restaurantName = '';
let entryText = '';
let dishName = '';
let imageURL = '';
let imgString = '';

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
                $("#loginForm").trigger('reset');
                alert(`username or password is incorrect`);
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
            success: (next) => {
                console.log('user created');
                $("#signUpForm").trigger('reset');
                alert(`Username registered successfully. Login to continue.`);
            },
            error: (err) => {
                console.log(err);
                console.log("usersignupfailed");
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
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            data: fd,
            contentType: false,
            success: (send) => {
                console.log(send);
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
            <button type="button" id="homeButton" class="navigation">Home</button>
            <h1>Meals at ${e.target.id}</h1>
            <p>Select an entry below to edit</p>
            <section id="mealList" class="mealList">
            </section>
        `);
        console.log(e.target.id);
        restaurantsData.forEach((meal) => {
            if (meal.restaurant == e.target.id && meal.username == loginUsername) {
                console.log(meal);
                let convertDate = new Date(meal.created);
                console.log(convertDate);
                console.log(convertDate.toDateString());
                console.log(meal.imageURL.length);
                if (meal.imageURL.length > 1) {
                    imgString = (`<img class="imgOffset" src="${meal.imageURL}" alt="${meal.dish}"/>`);
                    console.log(imgString);
                } else {
                    imgString = ``;
                };
                console.log(imgString);
                //<img class="imgOffset" src="${meal.imageURL}" alt="${meal.dish}"/>
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
        console.log('handleMealClick ran');
        console.log(e.target.id);
        console.log(restaurantsData.find((mealId) => mealId.id == e.target.id).created);
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
        $('entryText').value = restaurantsData.find((mealId) => mealId.id == e.target.id).content;
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
            success: (res) => console.log(res),
            error: (err) => console.log(err)
        });
        getRestaurants();
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