import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import { FiArrowRight, FiPlus } from 'react-icons/fi'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

import '../styles/pages/orphanages-map.css';
import mapMarkerImg from '../images/map-marker.svg';
import mapIcon from '../utils/mapIcon';

import api from '../services/api';

interface OrphanageViewList{
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

function OrphanagesMap(){

  const [ orphanages, setOrphanages ] = useState<OrphanageViewList[]>([]);

  useEffect(() => {
    api.get('orphanages').then(response => {
      const orphanages = response.data;
      setOrphanages(orphanages);
    })
  }, []);

  return (
    <div id="page-map">
      <aside>
        <header>
          <img src={mapMarkerImg} alt="Happy"/>
          <h2>Escolha uma entidade assistencial no mapa:</h2>
          <p>Muitas crianças estão esperando a sua visita :)</p>
        </header>

        <footer>
          <strong>Cidade</strong>
          <span>Estado</span>
        </footer>
      </aside>

      <Map center={[-23.38806,-51.9492948]} zoom={15} style={{ width: "100%", height:"100%" }}>
        <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {/* <TileLayer url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`} /> */}

        {orphanages.map(orphanage => {
          return (
            <Marker key={orphanage.id} position={[orphanage.latitude,orphanage.longitude]} icon={mapIcon}>
              <Popup closeButton={false} minWidth={240} maxWidth={240} className="map-popup">
                {orphanage.name}
                <Link to={`/orphanages/${orphanage.id}`}>
                  <FiArrowRight size={20}/>
                </Link>
              </Popup>
            </Marker>)
        })}
      </Map>

      <Link to="/orphanages/create" className="create-orphanage">
        <FiPlus size={32} color="#fff"/>
      </Link>
    </div>
  )
}

export default OrphanagesMap;