//TODO: get user location then find taco trucks near them, not random
//https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition
async function getCoords() {
  //user might reject or accept or take 5min to see that i asked them to give permission
  //dont return promise resolve inline
  let pos = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });

  //make it a little less accurate so not invasive of user privacy by rounding away digits
  return [Math.floor(pos.coords.latitude), Math.floor(pos.coords.longitude)];
}
function createMap(coords, tacoTrucks) {
  //Create map

  var map = L.map("map").setView(coords, 13);
  //Load tiles
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  //Add markers
  tacoTrucks.forEach((t) => createMarker(t, map));
}

function createMarker(t, map) {
  //map was undefined but their code didn't throw ref error
  // console.log("whats wrong", t, map)
  var marker = L.marker([t.lat, t.long]).bindPopup(t.name).addTo(map);
}

//get tacos from api
let tacos_api_base_url = "https://60d23844858b410017b2d60b.mockapi.io/tacos";
async function getTacoTrucks() {
  let response = await fetch(tacos_api_base_url);
  let data = await response.json();
  return data;
}

async function searchTrucks(searchTerm) {
  //load some data from an api
  //hard to make this global because it is loaded in promise
  let tacoTrucks = await getTacoTrucks();
  // console.log(tacoTrucks)
  //look inside each truck name does contain searchTerm?
  if (searchTerm === undefined || searchTerm === "") {
    return tacoTrucks;
  }
  return tacoTrucks.filter((t) => t.name.includes(searchTerm.toLowerCase()));
}

//entry point of our code
async function main() {
  let tacoTrucks = await searchTrucks();
  console.log(tacoTrucks);

  //get coords
  let coords = await getCoords();
  console.log(coords);
  //add map to screen
  createMap(coords, tacoTrucks);
}

//execute main
main();
