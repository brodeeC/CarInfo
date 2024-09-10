function displayMenu() {
    var x = document.getElementById("myLinks");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
    
  }

  //Function that makes the site dark based on the users settings.
  function App() {

    const isDark = window.matchMedia("(prefers-color-scheme:dark)").matches
  
    const lightTheme = {
      backgroundColor : "white",
      color : "black"
    }
  
    const darkTheme = {
      backgroundColor : "black",
      color : "white"
    }
  
    return (
      <div style={isDark?darkTheme:lightTheme}>
        Hello World
      </div>
    );
  }
  
  export default App;