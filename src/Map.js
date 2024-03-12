import React from "react";
import "./Map.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-markercluster';

import { Icon, divIcon, point } from "leaflet";
import Placeholder from "./placeholder.png"

// create custom icon
const customIcon = new Icon({
  // iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
  iconUrl: Placeholder,
  iconSize: [38, 38] // size of the icon
});

// custom cluster icon
const createClusterCustomIcon = function (cluster) {
  return new divIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className: "custom-marker-cluster",
    iconSize: point(33, 33, true)
  });
};

// markers
const markers = [
  {
    geocode: [12.245914085514979, 79.59611009470636],
    popUp: "Kollar ICICI Bank"
  },
  {
    geocode: [12.232884092747348, 79.49285273483387],
    popUp: "Modiyur ICICI Bank"
  },
  {
    geocode: [12.119422441362495, 79.38236576551719],
    popUp: "Ananthapuram ICICI Bank"
  },
  {
    geocode: [10.812364895087802, 78.77200842316836],
    popUp: "Vengur ICICI Bank"
  },
  {
    geocode: [11.931114941309213, 79.28076590969235],
    popUp: "Sithalingamadam ICICI Bank"
  },
  {
    geocode: [11.927369429691284, 79.1959115366784],
    popUp: "Keelathalanur ICICI Bank"
  },
  {
    geocode: [12.205514260688975, 79.7426417268891],
    popUp: "Perumukkal ICICI Bank"
  },
  {
    geocode: [12.322467202995817, 79.48391685202753],
    popUp: "Agalur ICICI Bank"
  },

];

export default function Map() {
  return (
    <MapContainer center={[11.6074, 78.4478]} zoom={8}>
      {/* OPEN STREEN MAPS TILES */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* WATERCOLOR CUSTOM TILES */}
      {/* <TileLayer
        attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg"
      /> */}
      {/* GOOGLE MAPS TILES */}
      {/* <TileLayer
        attribution="Google Maps"
        // url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" // regular
        // url="http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}" // satellite
        url="http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}" // terrain
        maxZoom={20}
        subdomains={["mt0", "mt1", "mt2", "mt3"]}
      /> */}

      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={createClusterCustomIcon}
      >
        {/* Mapping through the markers */}
        {markers.map((marker) => (
          <Marker position={marker.geocode} icon={customIcon}>
            <Popup>{marker.popUp}</Popup>
          </Marker>
        ))}

        {/* Hard coded markers */}
        {/* <Marker position={[51.505, -0.09]} icon={customIcon}>
          <Popup>This is popup 1</Popup>
        </Marker>
        <Marker position={[51.504, -0.1]} icon={customIcon}>
          <Popup>This is popup 2</Popup>
        </Marker>
        <Marker position={[51.5, -0.09]} icon={customIcon}>
          <Popup>This is popup 3</Popup>
        </Marker>
       */}
      </MarkerClusterGroup>
    </MapContainer>
  );
}

