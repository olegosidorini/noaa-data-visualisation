require("babel-core/register");
require("babel-polyfill");
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

import 'ol/ol.css';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import Point from 'ol/geom/Point';
import Overlay from 'ol/Overlay';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import VectorSource from 'ol/source/Vector';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {fromLonLat} from 'ol/proj';



const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({
    center: [0, 0],
    zoom: 0
  })
});


var points = [];
var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://www.ncdc.noaa.gov/cdo-web/api/v2/stations?datatypeid=TAVG&datasetid=GHCND&limit=999');
xhr.setRequestHeader('token', 'OjEytOjyDWXeESKGtizkKGJgGukXiNJu');
xhr.send();
xhr.onreadystatechange = function() { 
  if (xhr.readyState != 4) return;
  if (xhr.status != 200) {
    console.log(xhr.status + ': ' + xhr.statusText);
  } else {
    JSON.parse(xhr.responseText).results.forEach(element => {
      var point  = new Feature({
        geometry: new Point(fromLonLat([element.longitude, element.latitude])),
        id : element.id,
        name : element.name,
        mindate : element.mindate,
        maxdate : element.maxdate
      });
      points.push(point);
    });
    var vectorSource = new VectorSource({
      features: points,
    });
    
    var vectorLayer = new VectorLayer({
      source: vectorSource,
    });
    map.addLayer(vectorLayer);
  }
}

/**
 * Elements that make up the popup
 */
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

/**
 * Create an overlay to anchor the popup to the map.
 */
var overlay = new Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 250,
  },
});

/**
 * Add a click handler to hide the popup.
 * @return {boolean} Don't follow the href.
 */
closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

map.addOverlay(overlay);
// display popup on click
map.on('singleclick', function (evt) {
  var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
    return feature;
  });
  if (feature) {
    var coordinates = feature.getGeometry().getCoordinates();
    ReactDOM.render(
      <React.StrictMode>
        <App  point={feature.values_}/>
      </React.StrictMode>,
      content
    );
    overlay.setPosition(coordinates);
    
    map.addOverlay(overlay);
  }
});

