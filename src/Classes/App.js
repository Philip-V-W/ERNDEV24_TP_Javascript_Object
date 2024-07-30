// on import la config
import config from '../../app.config.json';
// on import la librairie mapbox
import mapboxgl from 'mapbox-gl';
// on import les librairies bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
// on import les icones de bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css';
// on import le style de mapbox
import 'mapbox-gl/dist/mapbox-gl.css';
// on import notre propre style
import '../assets/styles/style.css';


class App {

    // propriétés
    // container de la map
    elDivMap;

    // instance de la map
    map;


    start() {
        console.log('App started');
        this.loadDom();
        this.initMap();
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
        const form = this.createForm();
        // on ajoute le formulaire à la div app
        app.appendChild(form);
        // on ajoute un écouteur sur le bouton du formulaire
        form.querySelector('#sendButton').addEventListener('click', (e) => {
            e.preventDefault();
            this.saveFormData();
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
        console.log(event);
    }

    // méthode qui crée un formulaire geographic
    createForm() {
        this.elForm = document.createElement('form');
        this.elForm.id = 'formField';
        this.elForm.innerHTML = `
            <input id="titre" type="text" title="title" placeholder="Titre">
            <input id="description" type="text" title="description" placeholder="Description">
            <input id="start-date" type="date" title="start-date" placeholder="Date de début">
            <input id="end-date" type="date" title="end-date" placeholder="Date de fin">
            <input id="coordinates" type="text" title="coordinates" placeholder="Coordonnées">
            <button id="sendButton" type="submit">Send</button>
        `;
        return this.elForm;
    }

    // méthode qui crée un bouton
    createButton(text, id) {
        const btn = document.createElement('button');
        btn.id = id;
        btn.innerHTML = text;
        return btn;
    }

    // méthode qui sauvegarde les données du formulaire
    saveFormData() {
        localStorage.setItem('titre', document.getElementById('titre').value);
        localStorage.setItem('description', document.getElementById('description').value);
        localStorage.setItem('start-date', document.getElementById('start-date').value);
        localStorage.setItem('end-date', document.getElementById('end-date').value);
        localStorage.setItem('coordinates', document.getElementById('coordinates').value);
    }

}

const app = new App();

export default app;