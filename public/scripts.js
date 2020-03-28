//js stuff

// check for Geolocation support on device
if (navigator.geolocation) {
  console.log('Geolocation is supported!');
}
else {
  console.log('Geolocation is not supported for this Browser/OS version yet.');
}

//init stuff
var distance;
document.getElementById('distance').innerHTML = "0";
var progBar = document.getElementById("progressBar")
showAddress();

//check for address and start tracking, or wait for address to be entered
if (localStorage['address']== undefined){
 document.getElementById('status').innerHTML = "Please set home address"; 
 document.getElementById('distance').innerHTML = "-"; 
}
else
{
  geoCoder();
  trackLocation();
  document.getElementById('status').innerHTML = "Tracking your distance"; 
}


//check localstorage
console.log("LS address:"+ localStorage['address']);
console.log("LS lat:"+ localStorage['savedLat']);
console.log("LS long:"+ localStorage['savedLong']);


//init google autocomplete
function initialize() {
  var input = document.getElementById('searchTextField');
  new google.maps.places.Autocomplete(input);
}


//save user input to local storage
function saveAddress(){
  localStorage['address'] = document.getElementById('searchTextField').value;
  console.log("saved address to local storage:"+ localStorage['address']);
  geoCoder();
  restart();
}


function showAddress(){
  var searchDiv = document.getElementById("searchDiv");
  if (searchDiv.style.display === "none") {
    searchDiv.style.display = "block";
  }
  else
  {
    searchDiv.style.display = "none";
  }
}


function trackLocation(){
  //start tracking location if an address is saved
  
  if (localStorage['address']!= undefined){

    navigator.geolocation.watchPosition(function(position) {
    distance = calculateDistance(parseFloat(localStorage['savedLat']), parseFloat(localStorage['savedLong']),
                          position.coords.latitude, position.coords.longitude);
    if (Number.isNaN(distance))
    {
      document.getElementById('distance').innerHTML = "-";
    }
    else {
      document.getElementById('distance').innerHTML = distance;
    }
    

    //update progress bar
    if (distance >= 100) {
          
          progBar.style.width = 100 + "%";
          progBar.innerHTML = "Too Far!";
          window.navigator.vibrate(200);
          
          } else {

          if (Number.isNaN(distance)){
                progBar.style.width = 0 + "%";
          } else
          {
                progBar.style.width = distance + "%";
                progBar.innerHTML = "";        
          }

          }
    });
  }
}

//geocode the address to coordinates
function geoCoder(){
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({ "address": localStorage['address'] }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
          var location = results[0].geometry.location,
              lat      = location.lat(),
              lng      = location.lng();
              localStorage['savedLat'] = lat;
              localStorage['savedLong'] = lng;
      }
  });
}

//some math
function calculateDistance(lat1, lon1, lat2, lon2) {
    var R = 6371e3; // m
    var dLat = (lat2 - lat1).toRad();
    var dLon = (lon2 - lon1).toRad(); 
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    var d = R * c;
    console.log("distance="+d + "R = "+ R);
    return Math.round(d);
    } 
    Number.prototype.toRad = function() {
    return this * Math.PI / 180;
}

//reload page to reset location. Too lazy to do it otherwise.
function restart(){
  location.reload();
}

/*//just for testing local storage. Not used in prod.
function clearLocalCache(){
  localStorage.clear();
}*/