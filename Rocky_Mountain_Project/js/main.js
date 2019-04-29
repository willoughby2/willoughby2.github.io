    var map = L.map('map').setView([40.35, -105.9], 10);

    $( document ).ready(function() {
    var isMobile = window.matchMedia("only screen and (max-width: 760px)");

        if (isMobile.matches) {
            var map = L.map('map').setView([40.35, -105.675], 10)
        }
    });

    var outdoors = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 15,
    id: 'mapbox.outdoors',
    accessToken: 'pk.eyJ1Ijoid2lsbG91Z2hieTIiLCJhIjoiY2lzc2J5aWtpMDc2ODJ5cGh5MTlxNjczeSJ9.7FKJ5Mye4bhoImWAeCRhZg'
    }).addTo(map);

   var cartoon = L.tileLayer('https://api.mapbox.com/styles/v1/willoughby2/cjb9n8up94k7n2rmybfsduete/tiles/256/{z}/{x}/{y}@2x?access_token={accessToken}', {accessToken: 'pk.eyJ1Ijoid2lsbG91Z2hieTIiLCJhIjoiY2lzc2J5aWtpMDc2ODJ5cGh5MTlxNjczeSJ9.7FKJ5Mye4bhoImWAeCRhZg',
   opacity: 0.6})

    var client = new carto.Client({
        apiKey: '0PKZhjNAs2diwwzAadUkhQ',
        username: 'willoughby2'
    });

    var romoCentersSource = new carto.source.SQL('SELECT * FROM romo_visitorcenters');
    var romoCentersStyle = new carto.style.CartoCSS('#layer {marker-width:16; marker-fill: #EE4D5A; marker-line-color: #FFFFFF; marker-file: url("https://img.clipartxtras.com/a081f306355222c96014d74fe920dbdb_orange-house-clipart-clipartsgramcom-orange-house-clipart_600-600.png")}');
    var romoCentersLayer = new carto.layer.Layer(romoCentersSource, romoCentersStyle, {featureClickColumns: ['centername', 'notes']});

    var romoSummitsSource = new carto.source.SQL('SELECT * from romo_summits');
    var romoSummitsStyle = new carto.style.CartoCSS('#layer { marker-width: 10; marker-fill: #EE4D5A; marker-fill-opacity: 1; marker-allow-overlap: true; marker-line-width: 1; marker-line-color: #FFFFFF; marker-line-opacity: 1; marker-file: url("https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/White_Arrow_Up.svg/1024px-White_Arrow_Up.svg.png");}');
    var romoSummitsLayer = new carto.layer.Layer(romoSummitsSource, romoSummitsStyle, {featureClickColumns: ['feature_na']});

    var romoTrailsSource = new carto.source.SQL('SELECT * from romo_trails');
    var romoTrailsStyle = new carto.style.CartoCSS('#layer {line-color: #303030; line-width: 1; line-opacity: .7}')
    var romoTrailsLayer = new carto.layer.Layer(romoTrailsSource, romoTrailsStyle, {featureClickColumns: ['trlname', 'trluse']});

    var romoPolygonSource = new carto.source.Dataset("romo_polygon");
    var romoPolygonStyle = new carto.style.CartoCSS("#layer {polygon-fill: #E066FF; polygon-opacity: 0.15; ::outline {line-width: 1; line-color: #FFFFFF; line-opacity: 1;}}");
    var romoPolygonLayer = new carto.layer.Layer(romoPolygonSource, romoPolygonStyle);

    var romoPoiSource = new carto.source.SQL("SELECT * FROM poi_userinput WHERE enable='yes'");
    var romoPoiStyle = new carto.style.CartoCSS('#layer {marker-width: 15; marker-fill: #EE4D5A; marker-line-color: #FFFFFF; marker-file: url("https://joesbutchershop.com/wp-content/uploads/2016/07/cameraicon.png")}')
    var romoPoiLayer = new carto.layer.Layer(romoPoiSource, romoPoiStyle, {featureClickColumns: ['title', 'description', 'name']});


    var romoPicnicSource = new carto.source.Dataset("romo_picnicareas");
    var romoPicnicStyle = new carto.style.CartoCSS('#layer {marker-width: 16; marker-fill: #008000; marker-line-color: #FFFFFF; marker-file: url("https://s21124.pcdn.co/wp-content/uploads/2017/05/parks-Icon.png")}')
    var romoPicnicLayer = new carto.layer.Layer(romoPicnicSource, romoPicnicStyle, {featureClickColumns: ['poiname']});

    var romoWaterfallSource = new carto.source.Dataset("romo_falls");
    var romoWaterfallStyle = new carto.style.CartoCSS('#layer {marker-width: 11; marker-fill: #0000FF; marker-line-color: #FFFFFF; marker-file: url("http://panda.mobilepaks.com/wp-content/uploads/2013/12/Light-Blue-Triangle-150x138.png")}')
    var romoWaterfallLayer = new carto.layer.Layer(romoWaterfallSource, romoWaterfallStyle, {featureClickColumns: ['fall_name']});

    client.addLayers([romoPolygonLayer, romoTrailsLayer, romoCentersLayer, romoWaterfallLayer, romoPicnicLayer, romoSummitsLayer]);
    client.addLayer(romoPoiLayer);
    client.getLeafletLayer().addTo(map);

function toggleLayer(toggleLayer,id) {
    if ($('#'+id).is(':checked')) {
        toggleLayer.show();
    } else {
        toggleLayer.hide();
    }
}

function toggleBase() {
    if (document.getElementById("outdoors").checked) {
        map.removeLayer(cartoon);
        outdoors.addTo(map).bringToBack();
    } else if (document.getElementById("cartoon").checked) {
        map.removeLayer(outdoors);
        cartoon.addTo(map).bringToBack();
    } else {alert("Basemap not found.")}
}

var sidebar = L.control.sidebar('sidebar').addTo(map);
sidebar.open('home');

const popup = L.popup();
function openPopUp(featureEvent) {
  popup.setLatLng(featureEvent.latLng);
  if (!popup.isOpen()) {
    let content ='<div class="widget"><p class="lorem">';
    if (featureEvent.data.title) {
      content +=  '<b>Visitor Suggested POI</b><br> Title: ' + featureEvent.data.title +  '<br>' + 'Description: ' + featureEvent.data.description +  '<br><br>' + 'Submitted By: ' + featureEvent.data.name;
    }

    if (featureEvent.data.feature_na) {
      content += '<b>Summit</b><br> Name: ' + featureEvent.data.feature_na;
    }

    if (featureEvent.data.trlname) {
      content += '<b>Trail</b><br> Name: ' + featureEvent.data.trlname + '<br>' + 'Use: ' + featureEvent.data.trluse;
    }

    if (featureEvent.data.poiname) {
      content += '<b>Picnic Area</b><br> Name: ' + featureEvent.data.poiname;
    }

    if (featureEvent.data.fall_name) {
      content += '<b>Waterfall</b><br> Name: ' + featureEvent.data.fall_name;
    }

    if (featureEvent.data.centername) {
      content += '<b>Visitor Center</b><br> Name: ' + featureEvent.data.centername + '<br>' + 'Availability: ' + featureEvent.data.notes;
    }

    content += '</p></div>'

    popup.setContent(content);
    popup.openOn(map);
  }
};

romoPoiLayer.on('featureClicked', openPopUp);
romoSummitsLayer.on('featureClicked', openPopUp);
romoTrailsLayer.on('featureClicked', openPopUp);
romoCentersLayer.on('featureClicked', openPopUp);
romoPicnicLayer.on('featureClicked', openPopUp);
romoWaterfallLayer.on('featureClicked', openPopUp);

var marker = L.marker({
  title: "My Location",
  draggable: true
});
function getPOILatLng() {
  map.on('click', function(e) {
    popup.removeFrom(map);

        marker.setLatLng(e.latlng).addTo(map);

        alert("Location Selected");
    document.getElementById('lat').value = e.latlng.lat;
    document.getElementById('lng').value = e.latlng.lng;
    finish();
  })
}

function getUserLocation() {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var lat = position.coords.latitude,
        lng = position.coords.longitude;
        marker.setLatLng([lat,lng]).addTo(map);
        document.getElementById('lat').value = lat;
        document.getElementById('lng').value = lng;

      })
    } else {
            // if browser doesn't support Geolocation
            alert("Geolocation is disabled. Please select location on the map instead.");
          }
}

function setData() {
  var enteredname = pname.value;
  var enteredtitle = title.value;
  var entereddescription = description.value;
  var gpslat = lat.value;
  var gpslng = lng.value;

  if (!enteredname, !enteredtitle, !entereddescription, !gpslat, !gpslng) {
    alert("Please enter values for all fields")
  } else {  var sql = "INSERT INTO poi_userinput (the_geom, name, title, description, enable, latitude, longitude) VALUES (ST_SetSRID(ST_GeomFromGeoJSON('";
      var sql2 = '{"type":"Point","coordinates":[' + gpslng + "," + gpslat + "]}'),4326),'" + enteredname + "','" + enteredtitle + "','" + entereddescription + "', 'no','"+ gpslat + "','" + gpslng +"')";
      var pURL = sql+sql2;
      submitToProxy(pURL);
      console.log("Feature has been submitted to the Proxy");
      alert("Your record has been submitted for review. Thank you!");
    }
}

var submitToProxy = function(q){
      $.post("php/callProxy.php", {
        qurl:q,
        cache: false,
        timeStamp: new Date().getTime()
      }, function(data) {
        console.log(data);
      });
    };

function radiusLocation() {
  alert('Please choose your location on the map')
  map.on('click', function(e) {
    marker.setLatLng(e.latlng).addTo(map);

    var lat = e.latlng.lat;
    var lng = e.latlng.lng;

    document.getElementById('rlat').value = lat;
    document.getElementById('rlng').value = lng;

  })
}

function getUserRadiusLocation() {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var lat = position.coords.latitude,
        lng = position.coords.longitude;
        marker.setLatLng([lat,lng]).addTo(map);

        document.getElementById('rlat').value = lat;
        document.getElementById('rlng').value = lng;

        alert("Location found at LAT: " + lat + " and LONG: " + lng);
      })
    } else {
            // if browser doesn't support Geolocation
            alert("Geolocation is disabled. Please select location on the map instead.");
          }
}

var fcircle;
function radiusSearch() {
  var circle;
  if (!document.getElementById('rlat').value, !document.getElementById('rlng').value) {
    alert('Please select your location first');
  } else if (!document.getElementById('radius_input').value) {
    alert('Please enter a radius distance');
    console.log(document.getElementById('radius_input').value);
  } else {
    if (fcircle) {
      map.clearLayers(fcircle);
    }
    var rinput = document.getElementById('radius_input').value;
    var rlat = document.getElementById('rlat').value;
    var rlng = document.getElementById('rlng').value;

    var rinputm = rinput * 1609.34;
    var circle = L.circle([rlat,rlng], {
      color: 'gray',
      opacity: 10,
      radius: rinputm
    }).addTo(map);
    map.fitBounds(circle.getBounds(), {paddingTopLeft:[200,0]});

  }
}
