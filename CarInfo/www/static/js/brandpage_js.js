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
    //TODO: get list of all brands without making brandpage super slow.
    if (value === "") displayCountries("All");

    let dropdown = document.querySelector("select");

    for (i = 0; i < dropdown.options.length; i++) {
        let dropVal = dropdown.options[i].value
        if (isClose(value, dropVal)) return displayCountries(dropVal);
     }
    let country = checkBrands(value)
    if (country !== "") return displayCountries(country);
}

function checkBrands(value){
    let allButtons = document.querySelectorAll("#brands button");

    for (i = 0; i < allButtons.length; i++){
        button = allButtons[i];
        brand = button.id;
        country = button.classList[0];

        if (isClose(value, brand)) return country;
    }
    return "";
}

function checkCars(value){
    console.log(value);
}

function isClose(inVal, dataVal){
    if (inVal.length > dataVal.length) return false;

    inVal = inVal.toLowerCase();
    dataVal = dataVal.toLowerCase();

    let newWord = "";
    for (let i = 0; i < inVal.length; i++) {
        inChar = inVal[i];
        newWord += dataVal[i];
    } 
    return newWord === inVal
}

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

function displayCountries(country=""){
    if (country == ""){
        //Get selected country from dropdown menu
        country = document.querySelector("#countries").value;
    }

    let dropdown = document.querySelector("select");
    dropdown.value = country;

    //Get all brand buttons
    let allButtons = document.querySelectorAll("#brands button");

    //Iterate through each button
    allButtons.forEach(button => {
        let className = "";
        country.split(" ").forEach(word =>{
            className += word;
        });
        //If 'None' is selected in the dropdown
        if (className === "All" && button.classList.length === 2){
            button.classList.toggle("hidden");
        }
        //If current button belongs to selected country and is currently being hidden
        else if (button.classList[0] === className && button.classList.length === 2){
            button.classList.toggle("hidden");
        }

        else if (className === "None" && button.classList.length !== 2){
            button.classList.toggle("hidden");
        }
        //If current button does not belong to selected country, 'None' isn't selected and hidden is
        //not already applied
        else if (button.classList[0] !== className && className !== "All" 
        && button.classList.length !== 2){
            button.classList.toggle("hidden");
        }
    })
}