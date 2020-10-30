import React, { ChangeEvent, FormEvent, useState } from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet'

import { FiPlus } from "react-icons/fi";

import '../styles/pages/create-orphanage.css';
import Sidebar from "../components/Sidebar";
import mapIcon from "../utils/mapIcon";
import api from "../services/api";
import { useHistory } from "react-router-dom";

export default function CreateOrphanage() {

  const [position, setPosition] = useState({
    latitude: 0,
    longitude: 0
  });

  const history = useHistory();

  const [ name, setName ] = useState("");
  const [ about, setAbout ] = useState("");
  const [ instructions, setInstructions ] = useState("");
  const [ opening_hours, setOpeningHours ] = useState("");
  const [ open_on_weekends, setOpenOnWeekends ] = useState(false);
  const [ images, setImages ] = useState<File[]>([]);
  const [ previewImages, setPreviewImages ] = useState<string[]>([]);

  function handleSelectedImages(event: ChangeEvent<HTMLInputElement>){
    if (!event.target.files) {
      return;
    }
    let selectedImages = Array.from(event.target.files)
      .filter(img => images.map(i => i.name).indexOf(img.name) === -1);

    selectedImages = [...images, ...selectedImages];
    setImages(selectedImages);

    const selectedImagesPreview = selectedImages.map(img => {
      return URL.createObjectURL(img);
    });

    setPreviewImages(selectedImagesPreview);
  }

  function handleSubmit(event: FormEvent){
    event.preventDefault();

    const data = new FormData();
    data.append('name', name);
    data.append('about', about);
    data.append('instructions', instructions);
    data.append('opening_hours', opening_hours);
    data.append('open_on_weekends', open_on_weekends.toString());
    data.append('latitude', position.latitude.toString());
    data.append('longitude', position.longitude.toString());
    images.forEach(img => data.append('images', img));

    api.post('orphanages', data)
      .then(result => {
        alert("Cadastro Realizado com Sucesso!");
        history.push('/app');
      })
      .catch(error => {
        if (error) {
          console.log(error);
        }
        alert("Ocorreu um erro na gravação das informações. Tente novamente mais tarde");
      })
  }

  function handleMapClick(event : LeafletMouseEvent){
    setPosition({
      latitude: event.latlng.lat,
      longitude: event.latlng.lng
    });
  }

  return (
    <div id="page-create-orphanage">
      <Sidebar/>
      <main>
        <form className="create-orphanage-form" onSubmit={handleSubmit}>
          <fieldset>
            <legend>Dados</legend>

            <Map
              center={[-27.2092052,-49.6401092]}
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onclick={handleMapClick}
            >
              <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {/* <TileLayer
                url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
              /> */}

              { position.latitude !== 0 &&
                <Marker
                  interactive={false}
                  icon={mapIcon}
                  position={[position.latitude,position.longitude]}
                />
              }
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input id="name" value={name} onChange={evt => setName(evt.target.value)}/>
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea id="name" maxLength={300} value={about} onChange={evt => setAbout(evt.target.value)}/>
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                {
                  previewImages.map(img => {
                    return (
                      <img key={img} className="new-image" src={img} alt=""/>
                    )
                  })
                }
                <label className="new-image" htmlFor="image[]">
                  <FiPlus size={24} color="#15b6d6" />
                </label>

              </div>
              <input multiple onChange={handleSelectedImages} type="file" id="image[]"/>
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea id="instructions" value={instructions} onChange={evt => setInstructions(evt.target.value)} />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de funcionamento</label>
              <input id="opening_hours" value={opening_hours} onChange={evt => setOpeningHours(evt.target.value)} />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button type="button" onClick={evt => setOpenOnWeekends(true)} className={ open_on_weekends ? "active" : ""}>Sim</button>
                <button type="button" onClick={evt => setOpenOnWeekends(false)} className={ !open_on_weekends ? "inactive" : ""}>Não</button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
