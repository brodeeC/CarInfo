//Fetches images for yhe slideshow
    async function fetchImages() {
    const response = await fetch('/cars'); // Adjust the path if necessary
    const data = await response.json();
    return data

}

//Randomly shuffles the data
function shuffleArray(data){
    //Get list of all countries cars are from
    const countries = Object.keys(data);
    let cars = []
    countries.forEach(country =>{
        //Get the make of each car within the country
        let makes = Object.keys(data[country]);
        //Get the full 'make' object
        let brands = data[country];
        makes.forEach(make=>{
            //Get the 'model' object of each car 
            models = brands[make];

            //Logo gets in the way
            delete models.logo

            //Get just the values
            Object.values(models).forEach(car =>{
            cars.push(car);
            });
        });
    });

    let carArr = [];
    //i is the number of cars in the slideshow
    for (let i = 8; i > 0; i--){
        //Allows for the images to be selected equally while being placed in any position
        let ran = Math.floor(Math.random() * (cars.length)); //Makes sure the random number gets smaller

        //Gets random car object
        carArr.push(cars[ran]);

        //Remove car from array
        let index = cars.indexOf(cars[ran]);
        cars.splice(index, 1);
    }
    return carArr;
}

function imageMode(car){
    //if dark mode
    //found on https://stackoverflow.com/questions/56393880/how-do-i-detect-dark-mode-using-javascript
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return car.dark;
    }
    else return car.light;
}

// Function to dynamically populate slideshow with random images
async function loadRandomImages() {
    const data = await fetchImages(); // Fetch images from JSON
    const randomCarData = shuffleArray(data); // Shuffle images randomly

    let disp = document.getElementById("Slideshow-Container");
    let count = 0;
    randomCarData.forEach(car => {
        let div = document.createElement("div");
        div.setAttribute("class", "mySlides");

        url = createUrl(data, car);

        let a = document.createElement("a");
        a.setAttribute("href", url)

        let img = document.createElement("img");
        img.setAttribute("class", "carslide");

        //get light/dark mode depending on system settings
        let image = imageMode(car);
        img.setAttribute("src", image);
        if (count === 0){
            img.setAttribute("onload", "currentSlide(1)");
        }

        a.appendChild(img);
        div.appendChild(a);

        //Adds caption to images
        let caption = document.createElement("h2");
        caption.setAttribute("id", "caption");
        caption.appendChild(document.createTextNode(`${car.year} ${car.make} ${car.model}`));
        div.appendChild(caption);

        disp.appendChild(div);
        //count++;
    })
    loadInfo(data);
}

function createUrl(data, car){
    let make = car.make;

    let countries = Object.keys(data);

    let url = "";

    countries.forEach(country => {
        let brandData = data[country]; 

        let brands = Object.keys(brandData);

        brands.forEach(brand => {
        if (make == brand){
            url = `/${country}/${brand}/${car.model}`;
        }
        })
    })
    return url;
}

// Load random images on page load
window.onload = function() {
    loadRandomImages(); 
};

function loadInfo(data){
    countries = Object.keys(data);

    let countryCount = countries.length;

    let makeCount = 0;

    let modelCount = 0;

    countries.forEach(country =>{
        //Get the make of each car within the country
        let makes = Object.keys(data[country]);
        makeCount += makes.length

        //Get the full 'make' object
        let brands = data[country];
        makes.forEach(make=>{
            //Get the 'model' object of each car 
            models = Object.keys(brands[make]);

            modelCount += models.length
        });

    });
    countryP = document.getElementById("countriesP");
    countryP.appendChild(document.createTextNode(`There are ${countryCount} countries represented.`))
    
    makeP = document.getElementById("makes");
    makeP.appendChild(document.createTextNode(`There are ${makeCount} makes.`)) 

    modelP = document.getElementById("models");
    modelP.appendChild(document.createTextNode(`There are ${modelCount} models.`)) 
}