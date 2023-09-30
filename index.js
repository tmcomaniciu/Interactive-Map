//triggers browser location popup
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  }
}
//setting map and current location variables
let map;
let currentPosition;
// function that shows current position on a marker
function showPosition(position) {
  currentPosition = [position.coords.latitude, position.coords.longitude];
  map = L.map("map").setView(currentPosition, 13);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  L.marker(currentPosition).addTo(map).bindPopup("You are here").openPopup();
}
//event listener that grabs location data for our specific businesses using the FourSquare API
document.getElementById("submit").addEventListener("click", async (event) => {
  event.preventDefault();
  let business = document.getElementById("business").value;
  console.log(business);
  console.log(currentPosition);
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "fsq3fymS/i3YrLU6I5Fqkw9PE5SzEO1IO7GY4EzPHU/Y1T0=",
    },
  };

  fetch(
    `https://api.foursquare.com/v3/places/search?query=${business}&ll=${currentPosition[0]}%2C${currentPosition[1]}&limit=5`,
    options
  )
    .then((response) => response.json())
    .then((response) => displayData(response))
    .catch((err) => console.error(err));
});
// displays the data our API found for us
function displayData(response) {
  for (let i = 0; i < response.results.length; i++) {
    let b = response.results[i];
    L.marker([b.geocodes.main.latitude, b.geocodes.main.longitude])
      .addTo(map)
      .bindPopup(`${b.name}<br />${b.location.address}`)
      .openPopup();
  }
}
//invokes getLocation function
getLocation();
