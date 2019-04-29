/* eslint-disable no-console */
/*eslint-env browser*/
/*eslint-parser: babel-eslint*/

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

    var romoPoiUserSource = new carto.source.SQL('SELECT * FROM poi_userinput WHERE enable = \'yes\'');

    var romoPoiUserStyle = new carto.style.CartoCSS('#layer {marker-width: 10; marker-fill: #EE4D5A; marker-line-color: #FFFFFF;}');

    var romoPoiUserLayer = new carto.layer.Layer(romoPoiUserSource, romoPoiUserStyle);

    var romoCentersSource = new carto.source.SQL('SELECT * FROM romo_visitorcenters');

    var romoCentersStyle = new carto.style.CartoCSS('#layer {marker-width:16; marker-fill: #EE4D5A; marker-line-color: #FFFFFF; marker-file: url("https://img.clipartxtras.com/a081f306355222c96014d74fe920dbdb_orange-house-clipart-clipartsgramcom-orange-house-clipart_600-600.png")}');

    var romoCentersLayer = new carto.layer.Layer(romoCentersSource, romoCentersStyle);

    var romoSummitsSource = new carto.source.SQL('SELECT * from romo_summits');

    var romoSummitsStyle = new carto.style.CartoCSS('#layer { marker-width: 10; marker-fill: #EE4D5A; marker-fill-opacity: 1; marker-allow-overlap: true; marker-line-width: 1; marker-line-color: #FFFFFF; marker-line-opacity: 1; marker-file: url("https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/White_Arrow_Up.svg/1024px-White_Arrow_Up.svg.png");}');

    var romoSummitsLayer = new carto.layer.Layer(romoSummitsSource, romoSummitsStyle, {
      featureClickColumns: ['feature_na']
    });

    var romoTrailsSource = new carto.source.SQL('SELECT * from romo_trails');

    var romoTrailsStyle = new carto.style.CartoCSS('#layer {line-color: #303030; line-width: 1; line-opacity: .7}')

    var romoTrailsLayer = new carto.layer.Layer(romoTrailsSource, romoTrailsStyle);

    var romoPolygonSource = new carto.source.Dataset("romo_polygon");

    var romoPolygonStyle = new carto.style.CartoCSS("#layer {polygon-fill: #E066FF; polygon-opacity: 0.15; ::outline {line-width: 3; line-color: #FFFFFF; line-opacity: 1;}}");

    var romoPolygonLayer = new carto.layer.Layer(romoPolygonSource, romoPolygonStyle);

    client.addLayers([romoPolygonLayer, romoTrailsLayer, romoCentersLayer, romoPoiUserLayer, romoSummitsLayer]);
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

const summitsPopup = L.popup({ closeButton: false });
romoSummitsLayer.on('featureClicked', featureEvent => {
  summitsPopup.setLatLng(featureEvent.latlng);
  let summit = featureEvent.data.feature_na;
  summitsPopup.setContent('<h2>${summit}</h2>');
  summitsPopup.openOn(map);
})
