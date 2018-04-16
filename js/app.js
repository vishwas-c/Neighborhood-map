// Global Variables

var bounds, map, infoWindow;
//Initialize Maps
function initMap() {
  var styles = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ebe3cd"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#523735"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#f5f1e6"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#c9b2a6"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#dcd2be"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#ae9e90"
        }
      ]
    },
    {
      "featureType": "landscape.natural",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#93817c"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#a5b076"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#447530"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f5f1e6"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#fdfcf8"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f8c967"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#e9bc62"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e98d58"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#db8555"
        }
      ]
    },
    {
      "featureType": "road.local",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#806b63"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#8f7d77"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#ebe3cd"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#b9d3c2"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#92998d"
        }
      ]
    }
  ];

  //To set the default region to display
  var bangalore = { lat: 12.972442, lng: 77.580643 };
  var mapoptions = {
    center: bangalore,
    styles: styles,
    zoom: 12

  }
  map = new google.maps.Map(document.getElementById('map'), mapoptions);
  infoWindow = new google.maps.InfoWindow();
  bounds = new google.maps.LatLngBounds();
  ko.applyBindings(new ViewModel());
}

// handle map error if it isn't working
//https://stackoverflow.com/questions/45338480/try-catch-for-error-message-in-google-maps-api
function googleCustomMapsError() {
  alert('Dang! Google maps could not be loaded! Try Again');
}

var ViewModel = function () {
  //Referred CatClicker exercise for self implementation.
  var self = this;
  this.query = ko.observable('');
  //Reference http://knockoutjs.com/documentation/observableArrays.html
  this.placeList = ko.observableArray([]);

  // create location objects and store in array
  locations.forEach(function (location) {
    self.placeList.push(new LocMarker(location));
  });

  // Reference https://opensoul.org/2011/06/23/live-search-with-knockoutjs/
  //To implement Live search
  // locations visible on map
  this.locList = ko.computed(function () {
    var queryFilter = self.query().toLowerCase();
    if (queryFilter) {
      return ko.utils.arrayFilter(self.placeList(), function (location) {
        var result = location.title.toLowerCase().includes(queryFilter);
        location.visible(result);
        return result;
      });
    }
    self.placeList().forEach(function (location) {
      location.visible(true);
    });
    return self.placeList();
  });
};

// Reference- https://github.com/udacity/ud864 - Code provided by Udacity course.

// This function bounds = new google.maps.LatLngBounds();populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, street, city, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    // Clear the infowindow content to give the streetview time to load.
    infowindow.setContent('');
    infowindow.marker = marker;

    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function () {
      infowindow.marker = null;
    });
    var streetViewService = new google.maps.StreetViewService();
    var radius = 100;

    //https://stackoverflow.com/questions/15031191/how-do-i-get-the-street-address-using-getjson-foursquare-venue-api
    var windowContent = '<h4>' + marker.title + '</h4>' + '<IMG height="30" width="100" ALIGN="Left" SRC="http://s3.amazonaws.com/info-mongodb-com/_com_assets/media/foursquare-wordmark.png"> '
      + '<br><br>' + '<p>' + street + "<br>" + city + '<br>' + "</p>";

    // In case the status is OK, which means the pano was found, compute the
    // position of the streetview image, then calculate the heading, then get a
    // panorama from that and set the options
    var getStreetView = function (data, status) {
      if (status == google.maps.StreetViewStatus.OK) {
        var nearStreetViewLocation = data.location.latLng;
        var heading = google.maps.geometry.spherical.computeHeading(
          nearStreetViewLocation, marker.position);
        infowindow.setContent(windowContent + '<div id="pano"></div>');
        var panoramaOptions = {
          position: nearStreetViewLocation,
          pov: {
            heading: heading,
            pitch: 20
          }
        };
        var panorama = new google.maps.StreetViewPanorama(
          document.getElementById('pano'), panoramaOptions);
      } else {
        infowindow.setContent(windowContent + '<div style="color: red">No Street View Found</div>');
      }
    };
    // Use streetview service to get the closest streetview image within
    // 100 meters of the markers position
    streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
    // Open the infowindow on the correct marker.
    infowindow.open(map, marker);
  }
}

// reference https://developers.google.com/maps/documentation/javascript/examples/marker-animations
function toggleBounce(marker) {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}

// Location Model Data
var LocMarker = function (data) {
  var self = this;
  this.title = data.title;
  this.position = data.location;
  this.street = '',
    this.city = '',
  this.visible = ko.observable(true);

  // Style the markers a bit. This will be our listing marker icon.
  var defaultIcon = makeMarkerIcon('CC0000');
  // Create a "highlighted location" marker color for when the user
  // mouses over the marker.
  var highlightedIcon = makeMarkerIcon('FFFF24');

  //Reference https://developer.foursquare.com/docs/api/venues/search 
  // get JSON request of foursquare data
  var foursqrUrl = 'https://api.foursquare.com/v2/venues/search?ll=' + this.position.lat + ',' + this.position.lng + '&client_id=ELBBUPNVTAZ3QAUSYRJPGN3RDWNCL1QKOH2XVTSUPNGBWT25' +
    '&client_secret=QF3HH54CZZOFSUDTABEJYCGRU4BWJG3H24QN0VCO1XKMZDDL' + '&v=20180323' + '&query=' + this.title;

  // https://www.w3schools.com/js/js_json_parse.asp
  $.getJSON(foursqrUrl).done(function (data) {
    var results = data.response.venues[0];
    self.street = results.location.formattedAddress[0] ? results.location.formattedAddress[0] : 'N/A';
    self.city = results.location.formattedAddress[1] ? results.location.formattedAddress[1] : 'N/A';
  }).fail(function () {
    alert('Error with FourSquare API call. Please try again!');
  });

  // Create a marker per location, and put into markers array
  this.marker = new google.maps.Marker({
    position: this.position,
    title: this.title,
    animation: google.maps.Animation.DROP,
    icon: defaultIcon
  });

  self.filterMarkers = ko.computed(function () {
    // to filter markers based on search
    if (self.visible() === true) {
      self.marker.setMap(map);
      bounds.extend(self.marker.position);
      map.fitBounds(bounds);
    } else {
      self.marker.setMap(null);
    }
  });

  // Create an onclick even to open an indowindow at each marker
  this.marker.addListener('click', function () {
    populateInfoWindow(this, self.street, self.city, infoWindow);
    toggleBounce(this);
    map.panTo(this.getPosition());
  });

  // Two event listeners - one for mouseover, one for mouseout,
  // to change the colors back and forth.
  this.marker.addListener('mouseover', function () {
    this.setIcon(highlightedIcon);
  });
  this.marker.addListener('mouseout', function () {
    this.setIcon(defaultIcon);
  });

  // show item info when selected from list
  this.show = function (location) {
    google.maps.event.trigger(self.marker, 'click');
  };

  // creates bounce effect when item selected
  this.bounce = function (place) {
    google.maps.event.trigger(self.marker, 'click');
  };

};

// Reference- https://github.com/udacity/ud864 - Code provided by Udacity course.
// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21, 34));
  return markerImage;
}






