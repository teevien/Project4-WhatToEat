const zomatoURL = 'https://developers.zomato.com/api/v2.1';
const app = {
    locationsURL: zomatoURL + '/locations',
    cuisinesURL: zomatoURL + '/cuisines',
    restaurantURL: zomatoURL + '/search',
    key: '96da6937114a6901ec154be1338c5427'
};

// 4. when user types in the city, captures the value in variable "userInput" which is then passed into getLocation function
app.locationForm = function() {
    $('.submit').on('click', function(e) {
        e.preventDefault();
        app.userInput = $('#userInput').val();
        app.getLocation(app.userInput)
        .then(() => {
            // console.log('userinput', app.userInput);
        })
    })
}


// 3. uses the "userInput" from locationForm, updates the header to the location the user typed and returns the CITY ID associated with the userInput city. the cityId is passed into the getCuisine function
app.getLocation = function(userInput) {
    return $.ajax({
        method: 'GET',
        url: app.locationsURL,
        dataType: 'json',
        headers: {
            'user-key': app.key
        },
        data: {
            query: userInput
        },
    }).then((res) => {
        $('#displayCity').text(userInput);
        app.cityId = res.location_suggestions[0].city_id;
        app.entityId = res.location_suggestions[0].entity_id;
        app.entityType = res.location_suggestions[0].entity_type;
        app.getCuisine(app.cityId);
    })
}


// 5. uses the city id from getLocation, makes ajax call to return an array of cuisines offered in that cityID, this array is used in displayCuisine function to append each cuisine name into the form
app.getCuisine = function(cityId) {
    return $.ajax({
        method: 'GET',
        url: app.cuisinesURL,
        dataType: 'json',
        headers: {
            'user-key': app.key
        },
        data: {
            city_id: cityId
        },
    }).then((res) => {
        app.cuisinesArray = res.cuisines;
        app.displayCuisine(app.cuisinesArray);
    })
}

// 6. uses the cuisine array from getCuisine and iterates over each item in the array to return the cuisine id and name and append it to the Form Select, the cuisine name retrieved from the array is passed into cuisineForm
app.displayCuisine = function (cuisinesArray) {
    cuisinesArray.forEach((cuisine) => {
        $('#cuisineList').append(`<option value="${cuisine.cuisine.cuisine_id}">${cuisine.cuisine.cuisine_name}</option>`)
    })
};
   
// 7. on CLICK of the "show restaurant" button, grab the value of the selected option (in this case, the value will equal the cuisine_id). the value is stored in a variable "cuisineId" and passed into getRestaurant function
app.cuisineForm = function() {
    $('.submitCuisine').on('click', function(e){
        e.preventDefault();
        var selector = document.getElementById('cuisineList');
       app.cuisineId = selector[selector.selectedIndex].value;
       app.getRestaurant(app.cuisineId);
    })
}

app.getRestaurant = function() {
    $.ajax({
        method: 'GET',
        url: app.restaurantURL,
        dataType: 'json',
        headers: {
            'user-key': app.key
        },
        data: {
            cuisines: app.cuisineId,
            entity_id: app.entityId,
            entity_type: app.entityType
        }
    }).then((res) => {
        console.log(res.restaurants);
        app.restaurantsArray = res.restaurants;
        app.displayRestaurants(app.restaurantsArray);
    })
}


app.displayRestaurants = function(restaurantsArray) {
    restaurantsArray.forEach((restaurant) => { 
        $('#restaurantName').append(`<h1>${restaurant.restaurant.name}</h1>`)
    })
}

// 2. create init function
app.init = function() {
    app.getLocation();
    app.locationForm();
    app.getCuisine();
    app.cuisineForm();
    app.getRestaurant();
};

// 1. document ready
$(function(){
    app.init();
})