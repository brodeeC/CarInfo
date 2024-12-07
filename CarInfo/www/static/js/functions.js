//Some code sourced from w3 schools. https://www.w3schools.com/howto/howto_js_mobile_navbar.asp
function displayMenu() {

    const x = document.getElementById("myLinks");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  
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
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}

function showAccordin(){
  var acc = document.getElementsByClassName("accordion");
  var i;

  for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
      /* Toggle between adding and removing the "active" class,
      to highlight the button that controls the panel */
      this.classList.toggle("active");

      /* Toggle between hiding and showing the active panel */
      var panel = this.nextElementSibling;
      if (panel.style.display === "block") {
        panel.style.display = "none";
      } else {
        panel.style.display = "block";
      }
    });
  }
}

