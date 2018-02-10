function initMap(){
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (p) {
        console.log("Detected Latitiude is " + p.coords.latitude);
        console.log("Detected Longitude is " + p.coords.longitude);

        var LatLng = new google.maps.LatLng(p.coords.latitude, p.coords.longitude);
        var mapOptions = {
            center: LatLng,
            zoom: 40,
            //mapTypeId: google.maps.MapTypeId.ROADMAP
            mapTypeId: 'hybrid'
        };
        var map = new google.maps.Map(document.getElementById("dvMap"), mapOptions);
        //USE FOR PLACES AUTOCOMPLETE WHEN READY--- works but autocomplete pops up behind the modal still
        var input = document.getElementById('autoComplete');
        var autoComplete = new google.maps.places.Autocomplete(input);
        var pacContainerInitialized = false; 

        $('#autocomplete').keypress(function() { 
                 if (!auContainerInitialized) { 
                         $('.aucontainer').css('z-index', '9999'); 
                         auContainerInitialized = true; 
                 } 
        }); 


        
        // var marker = new google.maps.Marker({
        //     position: LatLng,
        //     map: map,
        //     title: "<div style = 'height:60px;width:200px'><b>Your location:</b><br />Latitude: " + p.coords.latitude + "<br />Longitude: " + p.coords.longitude
        // });
    

        // google.maps.event.addListener(marker, "click", function (e) {
        //     var infoWindow = new google.maps.InfoWindow();
        //     infoWindow.setContent(marker.title);
        //     infoWindow.open(map, marker);
        // })



        //  Populate Map Markers
        $.get("/api/getFindsFromDB", function(data) {
            console.log(data);
            
            //Use data from API call to build markers
            // for(var i=0; i < data.length; i++){
            //     var LatLngLoopMarker = new google.maps.LatLng(data[i].lat, data[i].lng);
            //     var loopMarker = new google.maps.Marker({
            //         position: LatLngLoopMarker,
            //         map: map,
            //         title: "<div style = 'height:60px;width:200px'><b>Your location:</b><br />Latitude: " + data[i].lat + "<br />Longitude: " + data[i].lng
            //     });

            //     google.maps.event.addListener(loopMarker, "click", function (e) {
            //         var infoWindow = new google.maps.InfoWindow();
            //         infoWindow.setContent(loopMarker.title);
            //         infoWindow.open(map, loopMarker);
            //     });

            // }
           

            function makeLoopMarker(i) {
                var LatLngLoopMarker = new google.maps.LatLng(data[i].lat, data[i].lng);
                // Changes the color of the marker based on the reward value.
                var markerFillColor = "blue";
                // if (data[i].reward <= 30){
                //     markerFillColor = "#228B22";
                // }
                // else if (data[i].reward >30 && data[i].reward <=100){
                //     markerFillColor = "#FFD700";
                // }
                // else if (data[i].reward >= 100){
                //     markerFillColor = "#B22222";
                // }

                if(data[i].isLost == true){
                    markerFillColor = "coral";
                }
                else {
                    markerFillColor = "#549D90";
                }
                
                var loopMarker = new google.maps.Marker({
                  position: LatLngLoopMarker,
                  map: map,
                  label: {
                    color: 'white',
                    fontWeight: 'bold',
                    text: data[i].description,
                  },
                  icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 60.5,
                    fillColor: markerFillColor,
                    fillOpacity: 0.4,
                    strokeWeight: 0.4
                },
                  title: "<div style = 'height:60px;width:200px;color:black;'><br />Missing Item: " + data[i].item + "<br />Description: " + data[i].description + "<br />Reward: " + data[i].reward
                });
                
                google.maps.event.addListener(loopMarker, "click", function (e) {
                  var infoWindow = new google.maps.InfoWindow();
                  infoWindow.setContent(loopMarker.title);
                  infoWindow.open(map, loopMarker);
                });

                // var infoWindow = new google.maps.InfoWindow();
                //   infoWindow.setContent(loopMarker.title);
                //   infoWindow.open(map, loopMarker);

              }  
              
              for(var i=0; i < data.length; i++){
                makeLoopMarker(i);
              
              }
        });
    });
} else {
    alert('Geo Location feature is not supported in this browser.');
}

// BUTTONS AND MODAL STUFF
$('#find__button').on('click', function() {
    $('#find__modal')[0].showModal();
});

$('#lost__button').on('click', () => {
    $('#lost__modal')[0].showModal();
});

$('#submit__lost').on('click', () => {
    event.preventDefault();
    var lostName = $("#lostName").val().trim();
    var lostItem = $("#lostItem").val().trim();
    var lostDescription = $("#lostDescription").val().trim();
    //var lostLat = $("#lostLat").val().trim();
    var lostAutoComplete = $("#autocomplete").val().trim();
    //var lostLong = $("#lostLong").val().trim();
    var lostReward = $("#reward").val(); 
    
    //console.log(lostName + ' ' + lostItem + ' ' + lostDescription + ' ' + lostLat + ' ' + lostLong);
  
    //Lazy geocoding!
    $.post({
        url: '/api/geocode',
        data: {providedLocation:lostAutoComplete}
    }).then(function(responseGeo){
        console.log("****************");
        console.log(responseGeo.lat);
        console.log(responseGeo.lng);

        var latFromLocation = responseGeo.lat;
        var longFromLocation = responseGeo.lng;
    
    
        // POST route for saving a new lost item to the database
        // isLost default value is "TRUE" for the submit_lost modal
        $.post({
            url: '/api/new',
            data: {user: lostName, item: lostItem, description: lostDescription, longitude:longFromLocation, lattitude:latFromLocation, reward:lostReward, isLost:true}
        }).then(function(response){
            console.log(response);
        })
    
    
    })



    

    // CLEARS LOST MODAL
    $("#lostName").val('');
    $("#lostItem").val('');
    $("#lostDescription").val('');
    $("#lostLat").val('');
    $("#lostLong").val('');
    $("#lostLong").val('');
    $("#reward").val(''); 
    
    // Closes the Lost modal
    $('#lost__modal')[0].close();

    
    // Wait 4 seconds then reload page.
    setTimeout(function(){
        if (true) {
            location.reload();
        }
      }, 4000)


});
// ---------------------------------

$('#submit__find').on('click', () => {
    event.preventDefault();
    var foundName = $("#findName").val().trim();
    var foundItem = $("#findItem").val().trim();
    var findDescription = $("#findDescription").val().trim();
    //var lostLat = $("#lostLat").val().trim();
    var findAutoComplete = $("#findAutoComplete").val().trim();
    //var lostLong = $("#lostLong").val().trim();
    //var lostReward = $("#reward").val(); 
    
    //console.log(lostName + ' ' + lostItem + ' ' + lostDescription + ' ' + lostLat + ' ' + lostLong);
  
    //Lazy geocoding!
    $.post({
        url: '/api/geocode',
        data: {providedLocation:findAutoComplete}
    }).then(function(findresponseGeo){
        console.log("****************");
        console.log(findresponseGeo.lat);
        console.log(findresponseGeo.lng);

        var findlatFromLocation = findresponseGeo.lat;
        var findlongFromLocation = findresponseGeo.lng;
    
    
        // POST route for saving a new lost item to the database
        // isLost default value is "TRUE" for the submit_lost modal
        $.post({
            url: '/api/new',
            data: {user: foundName, item: foundItem, description: findDescription, longitude:findlongFromLocation, lattitude:findlatFromLocation, reward:"-1", isLost:false}
        }).then(function(response){
            console.log(response);
        })
    
    
    })



    

    // CLEARS FOUND MODAL
    $("#findName").val('');
    $("#findItem").val('');
    $("#findDescription").val('');
    $("#findAutocomplete").val('');
     
    
    // Closes the Lost modal
    $('#find__modal')[0].close();

    
    // Wait 4 seconds then reload page.
    setTimeout(function(){
        if (true) {
            location.reload();
        }
      }, 4000)


});



// ----------------------
$('.close').on('click', () => {
    $('#lost__modal')[0].close();
    $('#find__modal')[0].close();
});

var input = document.getElementById("autocomplete");
var autocomplete = new google.maps.places.Autocomplete(input, {types: ['geocode']});
//var autocomplete = new google.maps.places.SearchBox(input);
console.log("I'm here");
console.log(input); 
autocomplete.addListener('place_changed', fillInAddress);
function fillInAddress(){
    var  place = autocomplete.getPlace();

}

}
//PAGE LOADER ANIMATION//
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function(){
   if ($('.page__loader').length > 0) {
     $('.page__loader').remove();
   }
 }, 7000)
 });

 