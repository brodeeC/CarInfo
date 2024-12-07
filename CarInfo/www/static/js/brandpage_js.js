let brandList = [];

async function loadOptions(){
    const response = await fetch('/cars'); 
    const data = await response.json();
    //Get list of all countries cars are from
    const countries = Object.keys(data);

    //Gets dropdown menu
    let dropdown = document.querySelector("select");

    countries.forEach(country =>{

      //Creates an option
      let option = document.createElement("option");

      //Gives it the value of the country
      option.setAttribute("value", country);

      let countryName = country;

      //If the country is South Korea
      if (country == "SouthKorea") countryName = "South Korea";

      //Adds text node with country as its value
      option.appendChild(document.createTextNode(countryName));

      //Apends it to dropdown
      dropdown.appendChild(option);
    });
    let option = document.createElement("option");
    option.setAttribute("value", "None");
    option.appendChild(document.createTextNode("None"));
    option.setAttribute("id", "None");
    dropdown.appendChild(option);

    loadButtons(data);
}

async function loadButtons(data){
    let div = document.getElementById("brands");

    //Get list of all countries cars are from
    const countries = Object.keys(data);
    countries.forEach(country =>{
      
        let makeData = Object.keys(data[country]);

        //Iterate throught the makes
        Object.values(makeData).forEach(make =>{
            let button = document.createElement("button");
            let anchor = document.createElement("a");

            brandList.push(make);

            //Set url
            anchor.setAttribute("href", `/car/${country}/${make}`)

            let className = "";
            country.split(" ").forEach(word =>{
            className += (word);
            });

            button.setAttribute("class", className);

            button.setAttribute("id", make);

            let logoLink = data[country][make]["logo"];

            let image = document.createElement("img");
            image.setAttribute("src", logoLink);

            button.appendChild(image);

            anchor.appendChild(button);

            div.appendChild(anchor);
        });

    });
}

function suggestions(value){
    //Nothing in search box
    if (value === "") {
        setDataList("");
        return displayCountries("All");
    }

    //Get dropdown values
    let dropdown = document.querySelector("select");

    datalist = document.getElementById("suggestionBox");
    datalist.innerHTML = "";

    for (i = 0; i < dropdown.options.length; i++) {
        let dropVal = dropdown.options[i].value
        //If close - displays dropdown value
        if ((dropVal !== "All" && dropVal !== "None") && isClose(value, dropVal)) {
            setDataList(dropVal);
            if (value.toLowerCase() === dropVal.toLocaleLowerCase()) return displayCountries(dropVal);
        }
     }
    //If it's a brand, display the country it's from
    brandList = checkBrands(value);
    if (brandList.length !== 0) toggleBrands(brandList);

    //Check cars
    checkCars(value)
}

function toggleBrands(brandList){
    if (brandList.length === 0) return displayCountries("All");

    let allButtons = document.querySelectorAll("#brands button");
    allButtons.forEach(button => {
        brandList.forEach(brand => {
            let count = 1;
            if (button.id === brand && (!button.classList.contains("checked"))){
                console.log(count);
                count++;
                button.classList.toggle("checked");
                if (button.classList.contains("hidden")) button.classList.toggle("hidden");
            }
            else if (!button.classList.contains("checked") && (!button.classList.contains("hidden"))) {
                button.classList.toggle("hidden");
            }
        });
    });
}

/**
 * Set's the inside of the suggestion box with clickable buttons
 * @param {*} value - value to set
 */
function setDataList(value){
    //Unhide it if it's hidden
    if (datalist.classList.length > 1) datalist.classList.toggle("hidden");

    //If the search input is empty
    if (value === "") datalist.classList.toggle("hidden");

    //Button set up
    let button = document.createElement("button");
    button.setAttribute("onclick", `fillBox('${value}')`);
    button.appendChild(document.createTextNode(value));
    datalist.appendChild(button);
}

/**
 * Fills input box with passed value
 * @param {*} value 
 */
function fillBox(value){
    document.getElementById("suggestionBox").classList.toggle("hidden");
    document.getElementById("brandInput").value = value;
}

/**
 * Checks through list of all buttons to see if any are == value
 * @param {*} value 
 * @returns 
 */
function checkBrands(value){
    //Get buttons class=country and id=brand
    let allButtons = document.querySelectorAll("#brands button");

    brandList = [];
    for (i = 0; i < allButtons.length; i++){
        button = allButtons[i];
        brand = button.id;
        country = button.classList[0];

        //Reset buttons from toggling them
        if (button.classList.contains("checked")) button.classList.toggle("checked");

        //check if brand might be the value
        if (isClose(value, brand)) {
            setDataList(brand);
            brandList.push(brand);
        }
    }
    return brandList;
}

/**
 * Iterates over dataset to check each car with user value to predict search
 * @param {*} value 
 * @returns 
 */
async function checkCars(value){
    //Get data
    const response = await fetch('/cars'); 
    const data = await response.json();

    const countries = Object.keys(data);

    //Iterate through countries, brands, and cars
    for (i = 0; i < countries.length; i++){
        let country = countries[i];
        const brands = Object.keys(data[country]);

        for (j = 0; j < brands.length; j++){
            let brand = brands[j];
            let cars = Object.keys(data[country][brand]);

            for (k = 0; k < cars.length; k++){
                let car = cars[k];
                //if it's the logo I don't want it
                if (car !== "logo"){
                    //Name of car
                    let  model = data[country][brand][car]["model"];

                    //if model may be value
                    if (isClose(value, model)) {
                        setDataList(model);
                        return country;
                    }
                }
            }
        }
    }
    return "";
}


/**
 * Predicts if two strings are the same
 * @param {*} inVal - user inputted value
 * @param {*} dataVal - value from data
 * @returns true/false
 */
function isClose(inVal, dataVal){
    if (inVal.length > dataVal.length) return false;

    inVal = inVal.toLowerCase();
    dataVal = dataVal.toLowerCase();

    let newWord = "";
    for (let i = 0; i < inVal.length; i++) {
        newWord += dataVal[i];
    } 
    return newWord === inVal
}

/**
 * Post request on search query, displays results
 */
async function submitSearch(){
    // Sending the POST request
    const response = await fetch('/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            val: document.getElementById("brandInput").value
        })
    });

    // Checking if the response is okay
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parsing the JSON response
    const data = await response.json();

    document.getElementById("brandInput").value = "";

    //If user searched brand or car
    if (data.type == "brand" || data.type == "car") {
        window.location.href = data.url;
    }
    else{
        //Display brands on brandpage
        displayCountries(data.value)
    }
}

/**
 * Selects the country in the dropdown and displays logos of all brands in our dataset
 * @param {*} country - optional, manually select dropdown option and display logos
 */
function displayCountries(country=""){
    //Get selected country from dropdown menu
    if (country == "") country = document.querySelector("#countries").value;
        
    let dropdown = document.querySelector("select");
    dropdown.value = country;

    //Get all brand buttons
    let allButtons = document.querySelectorAll("#brands button");

    //Iterate through each button
    allButtons.forEach(button => {
        //Multiple words - ex: "South Korea" => SouthKorea
        let className = "";
        country.split(" ").forEach(word =>{
            className += word;
        });
        //If 'All' is selected in the dropdown - displays all
        if (className === "All" && button.classList.contains("hidden")){
            button.classList.toggle("hidden");
        }
        //If current button belongs to selected country and is currently being hidden
        else if (button.classList[0] === className && button.classList.contains("hidden")){
            button.classList.toggle("hidden");
        }

        //Hides everything
        else if (className === "None" && (!button.classList.contains("hidden"))){
            button.classList.toggle("hidden");
        }
        //If current button does not belong to selected country, 'All' isn't selected and hidden is
        //not already applied
        else if (button.classList[0] !== className && className !== "All" 
        && (!button.classList.contains("hidden"))){
            button.classList.toggle("hidden");
        }
    })
}