     
        $("#place-order").on("click",function() {
    
        alert('hey');
    
    
        });

        
        var pos;
        var itemname;
        var itemprice
        var itemdetails;
        
        var otherShop;
        
        var posi;
        var currentAddressCoords;
        var userCurrentAddress;
    
        var userSelectedAddress;
        var userMarker;
        var userSelectedPickup;
        
        var heya;
        
        var getInput;
        var ehh;
        
        var currPosition;
        
        var map;
        var lat1;
        var long1;
        var currentArea;
       
        var pickupCoords;
        var pickupCoordsLat;
        var pickupCoordsLong;
        
        var inputform;
        var pickupLocationInput;
            var homeform;
        
        
        var geometryID2;
        
       
       var storeMe;
       
        
      // This example adds a search box to a map, using the Google Place Autocomplete
      // feature. People can enter geographical searches. The search box will return a
      // pick list containing a mix of places and predicted search terms.

      // This example requires the Places library. Include the libraries=places
      // parameter when you first load the API. For example:
      // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

      function initAutocomplete() {
        
          
          currentArea = new google.maps.LatLng(currPosition);

          map = new google.maps.Map(document.getElementById('map'), {
          center: currentArea,
         styles: [
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#5d7e9e"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f2f2f2"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.attraction",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "saturation": "100"
            },
            {
                "hue": "#ff0000"
            },
            {
                "weight": "0.01"
            },
            {
                "gamma": "4.98"
            }
        ]
    },
    {
        "featureType": "poi.attraction",
        "elementType": "labels.text",
        "stylers": [
            {
                "saturation": "44"
            },
            {
                "lightness": "6"
            }
        ]
    },
    {
        "featureType": "poi.attraction",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "lightness": "98"
            },
            {
                "saturation": "100"
            },
            {
                "gamma": "10.00"
            }
        ]
    },
    {
        "featureType": "poi.business",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "hue": "#39ff00"
            },
            {
                "saturation": "-24"
            },
            {
                "lightness": "22"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 45
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "lightness": "-5"
            },
            {
                "saturation": "35"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "lightness": "15"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "simplified"
            },
            {
                "color": "#f4a8a8"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text",
        "stylers": [
            {
                "color": "#4e4e4e"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#f4f4f4"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#787878"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "saturation": "8"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#eaf6f8"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "hue": "#00c3ff"
            },
            {
                "saturation": "35"
            },
            {
                "lightness": "-8"
            }
        ]
    }
],
          zoom: 16,
          mapTypeControl: false,
          mapTypeControlOptions: {
              style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
              position: google.maps.ControlPosition.BOTTOM_CENTER
          },
          zoomControl: false,
          zoomControlOptions: {
              position: google.maps.ControlPosition.LEFT_TOP
          },
          scaleControl: true,
          streetViewControl: false,
          streetViewControlOptions: {
              position: google.maps.ControlPosition.LEFT_TOP
          },
          fullscreenControl: false,
        });
       
          
          
    


      
          
          
          
          infoWindow5 = new google.maps.Marker;

          
          
     
          
        
          
        // Create the search box and link it to the UI element.
        var input = document.getElementById('location-input');
         var options = {
               
             
             componentRestrictions: {country: 'ie'}
    };
        var searchBox = new google.maps.places.SearchBox(input, options);
          
       // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });

        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();

          if (places.length == 0) {
            return;
          }

          // Clear out the old markers.
          markers.forEach(function(marker) {
            marker.setMap(null);
          });
          markers = [];

          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            var icon = {
              url: "http://www.myiconfinder.com/uploads/iconsets/2cf65dcba39e9ba577fccb630a2b93bf.png",
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(45, 45)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
              map: map,
              icon: icon,
              title: place.name,
              position: place.geometry.location
            }));
              
              heya = place.geometry.location;
              
            currentAddressCoordsLat = place.geometry.location.lat();
              
            currentAddressCoordsLong = place.geometry.location.lng();

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          map.fitBounds(bounds);
        });
          
          
          
          
          
          
              $(document).ready(function() {
         var currgeocoder;

         //Set geo location lat and long

         navigator.geolocation.getCurrentPosition(function(position, html5Error) {

             geo_loc = processGeolocationResult(position);
             currLatLong = geo_loc.split(",");
             initializeCurrent(currLatLong[0], currLatLong[1]);

        });

        //Get geo location result

       function processGeolocationResult(position) {
             html5Lat = position.coords.latitude; //Get latitude
             html5Lon = position.coords.longitude; //Get longitude
             html5TimeStamp = position.timestamp; //Get timestamp
             html5Accuracy = position.coords.accuracy; //Get accuracy in meters
             return (html5Lat).toFixed(8) + ", " + (html5Lon).toFixed(8);
       }

        //Check value is present or not & call google api function

        function initializeCurrent(latcurr, longcurr) {
             currgeocoder = new google.maps.Geocoder();
             console.log(latcurr + "-- ######## --" + longcurr);
            console.log(latcurr);
            console.log(longcurr);
            currPosition = (latcurr + "," + longcurr);
           // alert(currPosition);
            
            lat1 = latcurr;
            long1 = longcurr;

             if (latcurr != '' && longcurr != '') {
                 var myLatlng = new google.maps.LatLng(latcurr, longcurr);
                 return getCurrentAddress(myLatlng);
             }
       }

        //Get current address

         function getCurrentAddress(location) {
              currgeocoder.geocode({
                  'location': location

            }, function(results, status) {
           
                if (status == google.maps.GeocoderStatus.OK) {
                    
                    console.log(results[0]);
                   $("#location-input").val(results[0].formatted_address);
                   userCurrentAddress = (results[0].formatted_address);
                   currentAddressCoords = (results[0].geometry.location);
                    
                    currentAddressCoordsLat = (results[0].geometry.location.lat());
                    
                    currentAddressCoordsLong = (results[0].geometry.location.lng());
                  
                } else {
                    alert('Geocode was not successful for the following reason: ' + status);
                }
            });
         }
                  
                  
                 

                  
                  
    });
          
        
        
      initMap();    
             
          
      } 
        
      var map2;
      var infowindow;
      var service;
        
    

      function initMap() {
          
       currentArea = new google.maps.LatLng(currPosition);  
          
          
         var dublin = {
              lat: 53.347447,
              lng:  -6.259199
          };
          
          
          
          map2 = new google.maps.Map(document.getElementById('map2'), {
              center: dublin,
              zoom: 15,
              styles: [
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#5d7e9e"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f2f2f2"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.attraction",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "saturation": "100"
            },
            {
                "hue": "#ff0000"
            },
            {
                "weight": "0.01"
            },
            {
                "gamma": "4.98"
            }
        ]
    },
    {
        "featureType": "poi.attraction",
        "elementType": "labels.text",
        "stylers": [
            {
                "saturation": "44"
            },
            {
                "lightness": "6"
            }
        ]
    },
    {
        "featureType": "poi.attraction",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "lightness": "98"
            },
            {
                "saturation": "100"
            },
            {
                "gamma": "10.00"
            }
        ]
    },
    {
        "featureType": "poi.business",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "hue": "#39ff00"
            },
            {
                "saturation": "-24"
            },
            {
                "lightness": "22"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 45
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "lightness": "-5"
            },
            {
                "saturation": "35"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "lightness": "15"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "simplified"
            },
            {
                "color": "#f4a8a8"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text",
        "stylers": [
            {
                "color": "#4e4e4e"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#f4f4f4"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#787878"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "saturation": "8"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#eaf6f8"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "hue": "#00c3ff"
            },
            {
                "saturation": "35"
            },
            {
                "lightness": "-8"
            }
        ]
    }
],
          });
          
          
          
          // Create the search box and link it to the UI element.
        var input2 = document.getElementById('pickup-location-input');
        var searchBox2 = new google.maps.places.SearchBox(input2);
       // map2.controls[google.maps.ControlPosition.TOP_LEFT].push(input2);

        // Bias the SearchBox results towards current map's viewport.
        map2.addListener('bounds_changed', function() {
          searchBox2.setBounds(map.getBounds());
        });

        var markers2 = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox2.addListener('places_changed', function() {
          var places = searchBox2.getPlaces();

          if (places.length == 0) {
            return;
          }

          // Clear out the old markers.
          markers2.forEach(function(marker2) {
            marker2.setMap(null);
          });
          markers2 = [];

          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            var icon2 = {
              url: place.icon2,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers2.push(new google.maps.Marker({
              map: map2,
              icon: icon2,
              title: place.name,
              position: place.geometry.location
            }));
              
              posi = place.geometry.location;
              
              var box = document.getElementById('shopbox');
              
             box.innerHTML = place.name + "<img src='" + place.photos[0].getUrl({'maxWidth': 200, 'maxHeight': 200}) + "'/>";

             
            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          map2.fitBounds(bounds);
        });
        
          
          
          
    

          var request = {
              location: dublin,
              radius: 3000,
              type: ['convenience_store']
          }
          
          
          
          var pickupCoordsLatContainer;
          var pickupCoordsLongContainer;
          
          
          
          
          
           $("#location-back2").on("click",function() {
             
          
          
            inputform = document.getElementById("pickup-location-input");
            homeform = document.getElementById("pickup-location-field");
               
            testform = document.getElementById("location-link");
               
               
             homeform.value = inputform.value;
           // alert(inputform.value);
               
               
            pickupCoordsLatContainer = document.getElementById('pickup-lat');
               
            pickupCoordsLongContainer = document.getElementById('pickup-long');
    
        //Stores coordinates of the pickup location in a variable to then send to database after the order is submitted.
           
        pickupCoordsLatContainer.value = pickupCoordsLat;
        pickupCoordsLongContainer.value = pickupCoordsLong;
               
               
            alert(pickupCoordsLat + "," + pickupCoordsLong);
               
            otherShop = document.getElementById("another-shop");
               
            otherShop.innerHTML = posi;
               
            
               
               
               
               
            
             
          

    
    });
          
          
          
          
          infowindow = new google.maps.InfoWindow();
          service = new google.maps.places.PlacesService(map);
          service.nearbySearch(request, callback);
          
           $(document).ready(function() {
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos2 = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

              
          

            infoWindow.setPosition(pos2);
            infoWindow.setContent("Your current location22");
            infoWindow.open(map2);
            map.setCenter(pos2);
          }, function() {
            handleLocationError(true, infoWindow, map2.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map2.getCenter());
        }
        
        
      
          });
          
          
          
          


      }

      function callback(results, status) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            results.forEach(createMarker);
            results.forEach(printResults);
          }
      }
        
          var marker5;
       
//    
//      function printResults(place) {
//          
//        var  box5 = document.getElementById("shopbox");
//          box5.append(place.name + "<br>");
//          
//      };
//        
        var numberID = 0;
        var geoID = 0;
        var  box5;
        
      function createMarker(place) {
          
          box5 = document.getElementById("shopbox2");
          
          
          box5.innerHTML += "<div class='stores'><div class='store-info' id='storeID" + numberID++ + "'>" + place.name + ", " + place.vicinity + "</div><br>"  + "<img class='store-photos' src='" + place.photos[0].getUrl({'maxWidth': 200, 'maxHeight': 200}) + "'/>" + "<div class='store-geometry' id='geometryID" + geoID++ + "'>" + place.geometry.location +"</div></div><br>";
          
        
          
        
          
     //    
          
        $('#storeID2').click(function() {
            
            var storeID2 = document.getElementById("storeID2");
            var pickupLocationInput2 = document.getElementById("pickup-location-input");
            
            var geometryID2 = document.getElementById("geometryID2");
            
            pickupLocationInput2.value = storeID2.innerHTML;
            
            alert(geometryID2.innerHTML);
            storeMe.value = geometryID2.innerHTML;
            
            
            
            
            
         
});
         var pickupLocationInput5;
          
           $('#location-back2').click(function() {
            
          
            
            pickupLocationInput5 = document.getElementById("new-container");
            
            var geometryID2 = document.getElementById("geometryID2");
            
            pickupLocationInput5.value = geometryID2.innerHTML;
            
         
});
        
          
          
          
            $('#storeID1').click(function() {
            
            var storeID1 = document.getElementById("storeID1");
            var pickupLocationInput2 = document.getElementById("pickup-location-input");
                
            pickupLocationInput2.value = storeID1.innerHTML;
});
          
          
          
              
          var placeLoc = place.geometry.location;
            marker5 = new google.maps.Marker({
              map: map2,
              icon: {
                  url: 'http://icons-for-free.com/icon/download-buy_cart_circular_modern_purchase_red_shopping_tray_icon-505716.png',
                  anchor: new google.maps.Point(10, 10),
                  scaledSize: new google.maps.Size(40, 40)
              },
              position: place.geometry.location
              
              
          });
          
          
          
          
           google.maps.event.addListener(marker5, "click", function() {
              
           
                   this.setIcon("http://www.graficacanelaverde.com.br/imagens/carrinho2.png");
                    
        
                

            var request = {
                reference: place.reference
            };
            
              
              service.getDetails(request, function(details, status) {
     
             pickupLocationInput = document.getElementById("pickup-location-input");
             pickupLocationInput.value = details.name + ", " + details.formatted_address;
             pickupCoords = details.geometry.location;
             pickupCoordsLat = details.geometry.location.lat();
                  
             pickupCoordsLong = details.geometry.location.lng();
            
             shopBox = document.getElementById('shopbox');
             shopBox.innerHTML = details.name + " " + 
             details.place_id + " <img src='" + details.photos[0].getUrl({'maxWidth': 300,'maxHeight': 300}) + "'/>" + "<br>" + details.opening_hours.open_now;
                
            
             homeform.value = pickupLocationInput.value;
                
            

            
                    
                
             

              infowindow.setContent([
                details.name,
                details.formatted_address,
                details.geometry.location,
                details.formatted_phone_number].join("<br />"));
              infowindow.open(map, marker5);
            });
              
             
          })
          
          
          
      }
        
        
        var dropoffLocationLatContainer;
        var dropoffLocationLongContainer;
        
        
        
           $("#location-back").on("click",function() {
             
             //saves either the selected location or current location and
            // applies it to the order
    
            
            var userDeliveryLocation = document.getElementById('dropoff-location');
            var selectedLocation = document.getElementById('location-input');
               
               
            dropoffLocationLatContainer = document.getElementById('dropoff-lat');
            dropoffLocationLongContainer = document.getElementById('dropoff-long');
               
               
            dropoffLocationLatContainer.value = currentAddressCoordsLat;
               
           dropoffLocationLongContainer.value = currentAddressCoordsLong;
             
            userDeliveryLocation.value = selectedLocation.value;
             
             //Empty Variable assigned a definite value now once the user returns to the
             //order form screen.
             
             userSelectedAddress = userDeliveryLocation.value;
               
             
             alert(currentAddressCoordsLat + " " + currentAddressCoordsLong);
             
            
    
    
    });
        
          
        
         $("#submit").on("click",function() {
             
             //saves either the selected location or current location and
            // applies it to the order
    
            
            var ad1 = document.getElementById('ad1');
            var ad2 = document.getElementById('ad2');

            var ad3 = document.getElementById('ad3');
            var ad4 = document.getElementById('ad4');
             
            var ad5 = document.getElementById('ad4');
            
           
           itemname =  document.getElementById("itemname");
          itemprice = document.getElementById("itemprice");
        itemdetails = document.getElementById("itemdetails");
             
            
             
            ad1.innerHTML = homeform.value + "<br><br>" + //pickupCoords
                + heya;
            ad2.innerHTML = userSelectedAddress + "<br><br>" +  currentAddressCoords;
            ad3.innerHTML = itemname.value;
            ad4.innerHTML = itemprice.value;
            ad4.innerHTML = itemdetails.value;
             
            
             
            
    
    
    });
        
        
        $("#submitorder").on("click",function() {
    
    alert('hey');
    
    
    });
        
        
        var currentMarker;
        var other;
        
     
    
        
      
        
      
            
          $(document).ready(function() {
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
              
           
              
            userMarker = new google.maps.Marker({
            position: pos,
            map: map,
            icon: {
                  url: 'images/userlocation.png',
                  anchor: new google.maps.Point(30, 42),
                  scaledSize: new google.maps.Size(50, 50)
              }
                
                
                
                
                
        });
              
                    
        
          
          
    

            //infoWindow5.setPosition(pos);
            //infoWindow5.setContent("Your current locatiodn");
            //infoWindow5.open(map);
            map.setCenter(pos);
              
              
              
        var dublinCityCoords = [
       {lat:   53.348812, lng: -6.279980},
         {lat:    53.338666, lng: -6.271912},
        {lat:    53.334054, lng: -6.255261},     
        {lat:    53.352501, lng:  -6.255433}
        
 
        ];

              
              
    // testingCoords is for an extra geofence polygon for testing purposes as I don't live in the dublin city centre area
//so I needed a dummy geofence around me to make sure the geofence functions worked.
              
        var testingCoords = [
            
             {lat:  53.384461, lng: -6.257780},
            {lat:  53.395825, lng: -6.186541},
               {lat:  53.353939, lng: -6.174353},
             {lat:  53.356501, lng: -6.238383}

            

        ];
          
              
              
        alert(pos.lat)

        // Construct the polygon.
        var dublinCityFence = new google.maps.Polygon({
          paths: dublinCityCoords,
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35
        });
        dublinCityFence.setMap(map);
              
              
                  // Construct the polygon.
        var testingFence = new google.maps.Polygon({
          paths: testingCoords,
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35
        });
        testingFence.setMap(map);
              
        
            
var popUp;
 
  
//        google.maps.event.addListener(testingFence , 'click', isInDublinCity);

       google.maps.event.addListenerOnce(map, 'idle', function isInDublinCity(){
           
           
               if(google.maps.geometry.poly.containsLocation(currentMarker, dublinCityFence)){
                
                alert('You are within the Dropzy area limit.');
                   
               
            } else {
                
                
                
                alert('Sorry, Dropzy is only available in Dublin City Centre');
                
                $('.modal-inner').html('Sorry, Dropzy is only available in the Dublin City Centre Area.');
                
                 $('#dropzy-overlay').css('display','block');
                 $('#dropzy-notavailable').css('display','block');
                
                
                
            }
           
          
           
             
           
           
       });
              
               //Close popup that says that dropzy is unavailable in area
              
         $(".modal-button").on( "click", function() {
                  
             $('#dropzy-overlay, #dropzy-notavailable').css('display','none');
                  
              });   
            
              
        
        currentMarker = new google.maps.LatLng(parseFloat(pos.lat), parseFloat(pos.lng));
        alert(you);
              
       other = new google.maps.LatLng(53.243756,  -6.420172);
            
//              
//       function isInDublinCity() {
//            
//            if(google.maps.geometry.poly.containsLocation(currentMarker, testingFence)){
//                
//                alert('You are within the Dropzy area limit.');
//            } else {
//                
//                alert('Sorry, Dropzy is only available in Dublin City Centre');
//            }
//            
//              
//        };    
              
//        var coordinate = new google.maps.LatLng(40, -90);                                                                                                                       
//              
//if(dublinCityFence.containsLatLng(coordinate)) {
//    
//    alert("no");
//    
//} else { 
//    
//    alert("no")
//
//}

              
       
      
          
          }, function() {
              
            
            handleLocationError(true, infoWindow5, map.getCenter());
              
              
              
            
              
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow5, map.getCenter());
        }
              
             
  
        
      
          });
        
        google.maps.event.addDomListener(window, 'load', initAutocomplete);
        
        
     
        
       
var itemDetails;
      
        
function detailsExpand() {
                         
    
      $("#itemdetails").css("display", "block");
      
       }
        
      
function detailsCollapse() {
                         
    
      $("#itemdetails").css("display", "none");
      
       }
        
        
        function exitListview() {
             
    
             
    
             $("#shopbox2").css("display", "none");
           
             
            
             
            
    
    
    }
        
    

    