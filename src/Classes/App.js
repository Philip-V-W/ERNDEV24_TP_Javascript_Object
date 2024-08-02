// on import la config
import config from '../../app.config.json';
// on import la librairie mapbox
import mapboxgl, {LngLat} from 'mapbox-gl';
// on import les librairies bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
// on import les icones de bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css';
// on import le style de mapbox
import 'mapbox-gl/dist/mapbox-gl.css';
// on import notre propre style
import '../assets/styles/style.css';
import MarkerService from "../Services/MarkerService.js";
import Form from "./Form.js";


class App {

    // propriétés
    // container de la map
    elDivMap;
    // instance de la map
    map;
    // coordonnées du clique
    lngLat;
    // marker de la map
    marker;
    // service pour la gestion des markers
    markerService;
    // formulaire
    form;
    markers = [];
    tempMarker;

    markerData


    start() {
        console.log('App started');
        this.loadDom();
        this.initMap();

        this.markerService = MarkerService.readStorageData();

        const arrMarkers = this.markerService

        if (arrMarkers.length <= 0) return;

        arrMarkers.map((marker) => {
            const newMarker = new mapboxgl.Marker()
                .setLngLat([marker.longitude, marker.latitude])
                .addTo(this.map);
            this.markers.push(newMarker);
        });

        this.displayMarkerData();

    }

    // chargement du dom
    loadDom() {
        // on récupère la div app de notre index.html
        const app = document.getElementById('app');
        // on crée un div pour la map
        this.elDivMap = document.createElement('div');
        // on lui donne une classe
        this.elDivMap.id = 'map';
        // on ajoute la div de la map à la div app
        app.appendChild(this.elDivMap);
        // on crée un formulaire
        this.form = Form.createForm();
        // on ajoute le formulaire à la div app
        app.appendChild(this.form);
        // on récupère le bouton du formulaire
        let formData = document.getElementById('sendButton');
        // on ajoute un écouteur sur le bouton du formulaire
        formData.addEventListener('click', (e) => {
            e.preventDefault();
            const savedMarker = MarkerService.saveStorageData();
            this.confirmMarker(savedMarker);
        });


    }

    // initialisation de la map
    initMap() {
        // on va renseigner notre clé d'api a la librairie mapbox
        mapboxgl.accessToken = config.apis.mapbox_gl.apiKey;
        // on va instancier notre map
        this.map = new mapboxgl.Map({
            container: this.elDivMap,
            style: config.apis.mapbox_gl.map_styles.satellite_streets,
            center: [2.79, 42.68],
            zoom: 12
        })

        // ajout de la navigation sur la mpa
        const nav = new mapboxgl.NavigationControl();
        this.map.addControl(nav, 'top-left');

        // ajout d'un écouteur sur la map
        this.map.on('click', this.handleClickMap.bind(this));


    }

    // méthode qui capte le clique sur la map
    handleClickMap(event) {
        // on récupère les coordonnées du clique
        let coordinates = [event.lngLat.lng, event.lngLat.lat];
        // on remplit le champ coordonné du formulaire
        document.getElementById('latitude').value = coordinates[1];
        document.getElementById('longitude').value = coordinates[0];
        // TODO: REMOVE THIS TEST FIELD
        document.getElementById('titre').value = 'Default Title';
        document.getElementById('description').value = 'Default Description';
        document.getElementById('start-date').value = '2023-10-01T12:00';
        document.getElementById('end-date').value = '2023-10-01T14:00';
        // TODO REMOVE ABOVE
        // on crée un objet LngLat
        this.lngLat = new LngLat(coordinates[0], coordinates[1]);
        // on limite le nombre de marker à 1 par event

        if (this.tempMarker) {
            this.tempMarker.remove();
        }
        this.tempMarker = new mapboxgl.Marker()
            .setLngLat(this.lngLat)
            .addTo(this.map);


        // on affiche les coordonnées dans la console
        console.log('Coordinates:', (coordinates));
    }

    confirmMarker() {
        if (this.tempMarker) {
            this.marker = this.tempMarker;
            this.tempMarker = null;
        }

        location.reload();
    }

    removeTempMarker() {
        if (this.tempMarker) {
            this.tempMarker.remove();
            this.tempMarker = null;
        }
    }

    displayMarkerData() {
        const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });

        this.markers.forEach(marker => {
            const markerElement = marker.getElement();

            markerElement.addEventListener('mouseenter', () => {
                this.markerData = this.markerService.find(m =>
                    m.latitude == marker.getLngLat().lat &&
                    m.longitude == marker.getLngLat().lng);
                if (this.markerData) {
                    popup.setLngLat(marker.getLngLat())
                        .setHTML(`<div id="divpopup"><h3>${this.markerData.titre}</h3>
                                    <p>${this.markerData.startDate}</p><p>${this.markerData.endDate}</p></div>`)
                        .addTo(this.map);
                }
            });

            markerElement.addEventListener('mouseleave', () => {
                popup.remove();
            });

            markerElement.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent event bubbling if necessary
                this.markerData = this.markerService.find(m =>
                    m.latitude == marker.getLngLat().lat &&
                    m.longitude == marker.getLngLat().lng);
                if (this.markerData) {
                    popup.setLngLat(marker.getLngLat())
                        .setHTML(`<h3>${this.markerData.titre}</h3><p>${this.markerData.startDate}</p>
                                    <p>${this.markerData.endDate}</p><p>${this.markerData.description}</p>
                                    <p>${this.markerData.latitude}</p><p>${this.markerData.longitude}</p>
                                `)
                        .addTo(this.map);
                }
            });
        });
    }


    displayMarkerDatas() {
        const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });

        this.markers.forEach(marker => {
            marker.getElement().addEventListener('mouseenter', () => {
                this.markerData = this.markerService.find(m =>
                    m.latitude == marker.getLngLat().lat &&
                    m.longitude == marker.getLngLat().lng);
                if (this.markerData) {
                    popup.setLngLat(marker.getLngLat())
                        .setHTML(`<div id="divpopup"><h3>${this.markerData.titre}</h3>
                                    <p>${this.markerData.startDate}</p><p>${this.markerData.endDate}</p></div>`)
                        .addTo(this.map);
                }
            });

            marker.getElement().addEventListener('mouseleave', () => {
                popup.remove();
            });

            marker.getElement().addEventListener('click', () => {
                this.markerData = this.markerService.find(m =>
                    m.latitude == marker.getLngLat().lat &&
                    m.longitude == marker.getLngLat().lng);
                if (this.markerData) {
                    popup.setLngLat(marker.getLngLat())
                        .setHTML(`<h3>${this.markerData.titre}</h3><p>${this.markerData.startDate}</p>
                                    <p>${this.markerData.endDate}</p><p>${this.markerData.description}</p>`)
                        .addTo(this.map);
                }
            });
        });
    }


}

const app = new App();

export default app;