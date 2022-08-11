import React, { useState, useEffect, useRef } from 'react';
import { Map, View } from 'ol';
import VectorLayer from 'ol/layer/Vector';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import { transform } from 'ol/proj.js';
import OSM from 'ol/source/OSM';
import { Vector as VectorSource } from 'ol/source';
import 'ol/ol.css';
import './MapWindow.css';
import GeoJSON from 'ol/format/GeoJSON';
import axios from 'axios';

import Overlay from 'ol/Overlay';
import XYZ from 'ol/source/XYZ';
import { toLonLat } from 'ol/proj';
import { toStringHDMS } from 'ol/coordinate';
import { ZoomSlider, ScaleLine } from 'ol/control';
import { getUid } from 'ol/util';
import { Fill, Stroke, Style, Icon, Circle, Text } from 'ol/style';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import Select from '@mui/material/Select';

export default function MapWindow() {

  const [selectedJunctionOrder, setselectedJunctionOrder] = useState('all');
  const [selectedBasin, setselectedBasin] = useState('all');
  const [basinNumbers, setbasinNumbers] = useState([]);
  const [junctionOrder, setjunctionOrder] = useState([]);

  const [map, setMap] = useState(new Map({
    target: '',
    layers: [
      new TileLayer({
        source: new OSM(),
      }),

    ],
    view: new View({
      center: transform([78.4875, 30.3880], 'EPSG:4326', 'EPSG:3857'),
      zoom: 12,
    }),
  }));

  const [popup, setPopup] = useState(new Overlay({}));

  const mapElement = useRef();
  const mapRef = useRef();
  mapRef.current = map;

  const container = useRef();
  const content = useRef();

  const closePopUp = function () {
    map.getOverlayById('info').setPosition(undefined);
    return false;
  };

  // Layer addition funcition
  const addJunctionLayer = (junctionOrder) => {

    map.getLayers().forEach((e)=>{
      if (e){
      
      if (e.get('name') === 'JunctionPointLayer'){
        map.removeLayer(e);
        return;
      }
    }

    })

    // Style for junctions
    var JunctionPointStyle = new Style({
      image: new Circle({
        radius: 10,
        fill: new Fill({ color: 'red' }),
        stroke: new Stroke({
          color: [255, 255, 255], width: 2
        })
      }),
      text: new Text({
        font: '20px Ariel',
        placement: 'point',
        fill: new Fill({
          color: '#000'
        }),
        stroke: new Stroke({
          color: '#fff',
          width: 1
        }),
        textAlign: 'left'
      })
    })

    var url = 'http://127.0.0.1:8000/BasinManager/JunctionPoint/'
    if (junctionOrder){
      url+=`?grid_code=${junctionOrder}`
    }
    console.log(url)
    axios.get(url, {headers: {Authorization: `Token ${localStorage.getItem('beAuthToken')}`}}).then((response) => {
      const vectorSource = new VectorSource({
        features: new GeoJSON().readFeatures(response.data),
      });

      var JunctionPointLayer = new VectorLayer({
        source: vectorSource,
        zIndex: 18,
        properties: { 'name': 'JunctionPointLayer' },
        style: function (feature) {
          const grid_code = feature.get('grid_code');
          JunctionPointStyle.getText().setText(`Junction Order: ${grid_code}`)
          return JunctionPointStyle
        }
      });

      map.addLayer(JunctionPointLayer);

      if (!junctionOrder){
      var tempJunctionOrderList = []
      response.data.features.forEach((e)=>{
        tempJunctionOrderList.push(e.properties.grid_code)
      })
      tempJunctionOrderList = [...new Set(tempJunctionOrderList)];
      setjunctionOrder(tempJunctionOrderList)
    }
    })
  }


  useEffect(() => {

    console.log("Map changes")
    map.setTarget('map');

    map.addControl(new ZoomSlider());
    map.addControl(new ScaleLine({
      steps: 4,
      text: true,
      minWidth: 140,
    }));


    const DEMLayer = new TileLayer({
      source: new TileWMS({
        url: 'http://localhost:8080/geoserver/BasinExplorer/wms',
        params: {
          service: 'WMS',
          request: 'GetMap',
          layers: 'BasinExplorer:srtm_dem_3857',
          width: 661, height: 768,
          srs: 'EPSG:3857'
        },
        serverType: 'geoserver',
        transition: 0
      }),
      properties: { 'name': 'DEMLayer' }
    })
    map.addLayer(DEMLayer);

    const style = new Style({
      stroke: new Stroke({
        color: '#eeeeee',
        width: 1.8
      }),
      text: new Text({
        font: '50px Calibri',
        placement: 'centre',
        fill: new Fill({
          color: '#000'
        }),
        stroke: new Stroke({
          color: '#fff',
          width: 3
        })
      }),
    });

    // Add other layers
    axios.get('http://127.0.0.1:8000/BasinManager/Watershed/', {headers: {Authorization: `Token ${localStorage.getItem('beAuthToken')}`}}).then((response) => {
      const vectorSource = new VectorSource({
        features: new GeoJSON().readFeatures(response.data),
      });


      const WatershedLayer = new VectorLayer({
        source: vectorSource,
        properties: { 'name': 'WatershedLayer' },
        style: function (feature) {
          const gridcode = feature.get('gridcode');
          style.getStroke().setColor("#000000");
          style.getText().setText(`Basin: ${gridcode}`)
          return style;
        }
      });

      map.addLayer(WatershedLayer)

      // Fill the selection
      console.log('basinNumbers', basinNumbers)
      if (basinNumbers.length <= 0){

      var tempbasinNumbers = []
      response.data.features.forEach((f)=> {
        console.log(f.properties.gridcode);
        tempbasinNumbers.push(f.properties.gridcode)
      })
      setbasinNumbers(tempbasinNumbers)

    }

    });


    const streamStyle = new Style({
      stroke: new Stroke({
        color: '#123abc',
      }),
    });

    axios.get('http://127.0.0.1:8000/BasinManager/RiverStream/', {headers: {Authorization: `Token ${localStorage.getItem('beAuthToken')}`}}).then((response) => {
      const vectorSource = new VectorSource({
        features: new GeoJSON().readFeatures(response.data),
      });

      const RiverStreamLayer = new VectorLayer({
        source: vectorSource,
        zIndex: 12,
        properties: { 'name': 'RiverStreamLayer' },
        style: function (feature) {
          const grid_code = feature.get('grid_code');
          streamStyle.getStroke().setWidth(grid_code * 2);
          return streamStyle;
        }
      });

      map.addLayer(RiverStreamLayer)
    });

    // Style for junctions
    // const iconStyle = new Style({
    //   image: new Icon({
    //     anchor: [0.5, 46],
    //     anchorXUnits: 'fraction',
    //     anchorYUnits: 'pixels',
    //     src: '../data/icon.png',
    //   }),
    // });



    addJunctionLayer()

  }, [])



  useEffect(() => {

    console.log("Map changes")

    // Add overlay pop 
    setPopup(new Overlay({
      id: 'info',
      element: container.current,
      autoPan: {
        animation: {
          duration: 250,
        },
      },
    }));

    // Add click handler
    map.on('singleclick', (evt) => {

      const coordinate = evt.coordinate;
      const hdms = toStringHDMS(toLonLat(coordinate));
      var newHTML = '<p>Location:</p> <code>' + hdms + '</code>'


      map.forEachFeatureAtPixel(evt.pixel, (f, l) => {
        console.log(f, l)
        newHTML += `<li><code>` + f.get('grid_code') + `</code></li>`
      })
      // console.log(map.getAllLayers().forEach((e)=>{
      //   console.log(e.get('name'))
      // }))

      // var url = DEMLayer.source.getFeatureInfoUrl(
      //   evt.coordinate,
      //   map.view.getResolution(),
      //   'EPSG:3857',
      //   {'INFO_FORMAT': 'text/html'}
      // );
      // console.log(url)





      content.current.innerHTML = newHTML;
      map.getOverlayById('info').setPosition(coordinate);
    });
  }, [map])

  useEffect(() => {
    map.addOverlay(popup);
  }, [popup, map]);

  const selectJunctionOrder = (event) => {
    setselectedJunctionOrder(event.target.value)

    addJunctionLayer(event.target.value)
  }

  const selectBasin = (event) => {
    setselectedBasin(event.target.value)
  }

  return (
    <div className='map-component'>

      <div className='search-box'>
        <FormControl fullWidth variant="filled" sx={{ m: 1, minWidth: 120, borderRadius: '10px' }}>
          <InputLabel >Junction Order</InputLabel>
          <Select
            value={selectedJunctionOrder}
            onChange={selectJunctionOrder}
          >

            {junctionOrder.map((juncOrder) => (
              <MenuItem key={juncOrder} value={juncOrder}>
                Order: {juncOrder}
              </MenuItem>
            ))}
            <MenuItem value='all'>
                Order: All
              </MenuItem>


          </Select>
        </FormControl>

        <FormControl fullWidth variant="filled" sx={{ m: 1, minWidth: 120, borderRadius: '10px' }}>
          <InputLabel >Basin</InputLabel>
          <Select
            value={selectedBasin}
            onChange={selectBasin}
          >
           {basinNumbers.map((basinNumber) => (
              <MenuItem key={basinNumber} value={basinNumber}>
                Basin: {basinNumber}
              </MenuItem>
            ))}
            <MenuItem value='all'>
            Basin: All
              </MenuItem>
          </Select>
        </FormControl>
      </div>

      <div ref={mapElement} id='map' className="map-container" />
      <div ref={container} className="ol-popup">
        <a href="#" onClick={closePopUp} className="ol-popup-closer"></a>
        <div ref={content} ></div>
      </div>
    </div>
  )
}


