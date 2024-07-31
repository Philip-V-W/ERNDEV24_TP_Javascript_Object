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
    // données du formulaire
    elForm;
    // service pour la gestion des markers
    markerService;


    start() {
        console.log('App started');
        this.loadDom();
        this.initMap();

        this.markerService = new MarkerService();

        const arrMarkers = this.markerService.readStorage();

        if (arrMarkers.length <= 0) return;

        arrMarkers.map((marker) => {
            this.markerService.push(marker);
        })

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
        const form = Form.createForm();

        // const saveFormData = Form.saveFormData;
        // on ajoute le formulaire à la div app
        app.appendChild(form);
        // on ajoute un écouteur sur le bouton du formulaire
        form.querySelector('#sendButton').addEventListener('click', (e) => {
            e.preventDefault();
            Form.saveFormData();
        });

        // form.getElementById('#sendButton').addEventListener('click', (e) => {
        //     e.preventDefault();
        //     saveFormData();
        // })
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
        // TODO
        // on crée un objet LngLat
        this.lngLat = new LngLat(coordinates[0], coordinates[1]);
        // on vide le marker si il existe déjà
        if (this.marker) {
            this.marker.remove();
        }
        // on crée un marker
        this.marker = new mapboxgl.Marker()
            .setLngLat(this.lngLat)
            .addTo(this.map);
        // on affiche les coordonnées dans la console
        console.log('Coordinates:', (coordinates));
    }

    // // méthode qui crée un formulaire geographic
    // createForm() {
    //     this.elForm = document.createElement('form');
    //     this.elForm.id = 'formField';
    //     this.elForm.innerHTML = `
    //         <div class="d-flex flex-column card" style="width: 16rem;">
    //             <div class="card-body">
    //                 <input id="titre" type="text" title="title" class="form-control" placeholder="Titre">
    //                 <input id="description" type="text" title="description" class="form-control" placeholder="Description">
    //                 <input id="start-date" type="datetime-local" title="start-date" class="form-control" placeholder="Date de début">
    //                 <input id="end-date" type="datetime-local" title="end-date" class="form-control" placeholder="Date de fin">
    //                 <input id="latitude" type="number" title="latitude" class="form-control" placeholder="Latitude">
    //                 <input id="longitude" type="number" title="longitude" class="form-control" placeholder="Longitude">
    //                 <div class="d-flex justify-content-center">
    //                     <button id="sendButton" type="submit" class="btn btn-info" style="width: 8rem;">Create event</button>
    //                 </div>
    //             </div>
    //         </div>
    //     `;
    //     return this.elForm;
    // }

    // méthode qui affiche les données du marker
    displayMarkerData() {
        // Create a popup, but don't add it to the map yet.
        const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });

        this.map.on('mouseenter', 'places', (e) => {
            // Change the cursor style as a UI indicator.
            this.map.getCanvas().style.cursor = 'pointer';

            // Copy coordinates array.
            const coordinates = e.features[0].geometry.coordinates.slice();
            const description = e.features[0].properties.description;

            // Ensure that if the this.map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            if (['mercator', 'equirectangular'].includes(this.map.getProjection().name)) {
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }
            }

            // Populate the popup and set its coordinates
            // based on the feature found.
            popup.setLngLat(coordinates).setHTML(description).addTo(this.map);
        });

        this.map.on('mouseleave', 'places', () => {
            this.map.getCanvas().style.cursor = '';
            popup.remove();
        });
    }

    // // méthode qui sauvegarde les données du formulaire
    // saveFormData() {
    //     localStorage.setItem('titre', document.getElementById('titre').value);
    //     localStorage.setItem('description', document.getElementById('description').value);
    //     localStorage.setItem('start-date', document.getElementById('start-date').value);
    //     localStorage.setItem('end-date', document.getElementById('end-date').value);
    //     localStorage.setItem('latitude', document.getElementById('latitude').value);
    //     localStorage.setItem('longitude', document.getElementById('longitude').value);
    // }
    //
    //
    // // méthode qui récupère les données du formulaire
    // getFormData() {
    //     return {
    //         titre: localStorage.getItem('titre'),
    //         description: localStorage.getItem('description'),
    //         startDate: localStorage.getItem('start-date'),
    //         endDate: localStorage.getItem('end-date'),
    //         coordinates: localStorage.getItem('coordinates')
    //     }
    // }


}

const app = new App();

export default app;