//Some code sourced from w3 schools. https://www.w3schools.com/howto/howto_js_mobile_navbar.asp
function displayMenu() {

    const x = document.getElementById("myLinks");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  
}