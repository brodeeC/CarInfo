//Fetches images for yhe slideshow
    async function fetchImages() {
    const response = await fetch('/CarInfo/cars'); // Adjust the path if necessary
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
        return '/CarInfo' + car.dark;
    }
    else return '/CarInfo' + car.light;
}

// Function to dynamically populate slideshow with random images
async function loadRandomImages() {
    const data = await fetchImages(); // Fetch images from JSON
    const randomCarData = shuffleArray(data); // Shuffle images randomly

    let disp = document.getElementById("Slideshow-Container");
    let count = 1;
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
        if (count === 1){
            img.setAttribute("onload", "currentSlide(1)");
        }
        else{
            img.setAttribute("onchange", `currentSlide(${count})`);
        }

        a.appendChild(img);
        div.appendChild(a);

        //Adds caption to images
        let caption = document.createElement("h2");
        caption.setAttribute("id", "caption");
        caption.appendChild(document.createTextNode(`${car.year} ${car.make} ${car.model}`));
        div.appendChild(caption);

        disp.appendChild(div);
        count++;
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
            url = `/CarInfo/${country}/${brand}/${car.model}`;
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

//Code for the Slideshow featured on the Homepage.
//Some code sourced from w3 schools. https://www.w3schools.com/howto/howto_js_slideshow.asp
let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  //If next will do the plus 1 operation
  //If previous will do -1 which will result in the previous slide
  slideIndex = slideIndex + n;
  showSlides(slideIndex);
}

// Thumbnail image controls
function currentSlide(n) {
  slideIndex = n;
  showSlides(slideIndex);
}

//Combine the plus/previous slides into the showSlides function

//Implementation for going to the next slide.
function showSlides(n) {
  let i;
  //Setting variables to correspond with class names mentioned in the homepage.html
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");

  //Resets the slide to be the first slide when the user presses the next button on the last slide.
  if (n > slides.length) {slideIndex = 1}
  
  //Resets the slide to be the last slide when the user is on the first slide and presses the previous button.
  if (n < 1) {slideIndex = slides.length}
  
  //Makes sure that when the user moves on from the image the next image is shown where the previous image was shown.
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  //Updates the dots to correctly display which image you are on.
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" bottle", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " bottle";
}
