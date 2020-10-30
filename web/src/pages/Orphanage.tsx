import React, { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FiClock, FiInfo } from "react-icons/fi";
import { Map, Marker, TileLayer } from "react-leaflet";
import { useParams } from 'react-router-dom';

import '../styles/pages/orphanage.css';
import Sidebar from "../components/Sidebar";
import mapIcon from "../utils/mapIcon";
import api from "../services/api";

interface OrphanageView{
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  about: string;
  instructions: string;
  opening_hours: string;
  open_on_weekends: false,
  images: Array<{
    id: number;
    url: string;
  }>;
}

interface OrphanageRouteParams{
  id: string;
}

export default function Orphanage() {

  const [ orphanage, setOrphanage ] = useState<OrphanageView>();
  const [ currentImgOnView, setCurrentImgOnView] = useState("");
  const params = useParams<OrphanageRouteParams>();

  useEffect(() => {

    api.get(`orphanages/${params.id}`).then(response => {
      const orph = response.data as OrphanageView;
      setOrphanage(orph);
      setCurrentImgOnView(orph.images[0].url);
    })
  }, [params.id]);

  const handleImgClick = (url: string) => {
    setCurrentImgOnView(url);
  }

  if (!orphanage) {
    return <p>Carregando...</p>;
  }
  else{
    return (
    <div id="page-orphanage">
      <Sidebar/>

      <main>
        <div className="orphanage-details">
          <img src={currentImgOnView} alt={orphanage?.name} />

          <div className="images">

            {
              orphanage.images.map(img => {
                return (
                  <button onClick={() => handleImgClick(img.url)} key={img.id}
                    className={currentImgOnView === img.url ? "active" : ""} type="button">
                    <img src={img.url} alt={orphanage.name} />
                  </button>
                )
              })
            }
          </div>

          <div className="orphanage-details-content">
            <h1>{orphanage.name}</h1>
            <p>{orphanage.about}</p>

            <div className="map-container">
              <Map
                center={[orphanage.latitude,orphanage.longitude]}
                zoom={16}
                style={{ width: '100%', height: 280 }}
                dragging={true}
                touchZoom={false}
                zoomControl={true}
                scrollWheelZoom={false}
                doubleClickZoom={true}
              >
                <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {/* <TileLayer
                  url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
                /> */}
                <Marker interactive={false} icon={mapIcon} position={[orphanage.latitude,orphanage.longitude]} />
              </Map>

              <footer>
                <a target="_blank" rel="noopener noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${orphanage.latitude},${orphanage.longitude}`}>Ver rotas no Google Maps</a>
              </footer>
            </div>

            <hr />

            <h2>Instruções para visita</h2>
            <p>{orphanage.instructions}</p>

            <div className="open-details">
              <div className="hour">
                <FiClock size={32} color="#15B6D6" />
                {orphanage.opening_hours}
              </div>
              {
                orphanage.open_on_weekends ?
                (
                  <div className="open-on-weekends">
                    <FiInfo size={32} color="#39CC83" />
                    Atendemos <br />
                    fim de semana
                  </div>
                )
                 :
                (
                  <div className="not-open-on-weekends">
                    <FiInfo size={32} color="#FF669D" />
                    Não atendemos <br />
                    fim de semana
                  </div>
                )
              }
            </div>

            <button type="button" className="contact-button">
              <FaWhatsapp size={20} color="#FFF" />
              Entrar em contato
            </button>
          </div>
        </div>
      </main>
    </div>
  );
  }


}