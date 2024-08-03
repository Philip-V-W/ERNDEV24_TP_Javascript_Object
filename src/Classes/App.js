import config from '../../app.config.json';
import mapboxgl, {LngLat} from 'mapbox-gl';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../assets/styles/style.css';
import MarkerService from "../Services/MarkerService.js";
import Form from "./Form.js";
import Marker from "./Marker.js";

class App {
    constructor() {
        this.elDivMap = null;
        this.map = null;
        this.lngLat = null;
        this.markerService = MarkerService;
        this.form = null;
        this.markers = [];
        this.tempMarker = null;
        this.clickedOnMarker = false;
        this.eventDate = null;
        this.currentDate = null;
        this.daysDifference = null;
    }

    // Start the application
    start() {
        console.log('App started');
        this.loadDom();
        this.initMap();
        const arrMarkers = this.markerService.readStorageData();

        // Add existing markers to the map
        if (arrMarkers.length > 0) {
            arrMarkers.forEach(marker => {
                this.eventDate = new Date(marker.startDate);
                this.currentDate = new Date();
                this.daysDifference = Math.ceil((this.eventDate - this.currentDate) / (1000 * 60 * 60 * 24));

                let markerColor;
                if (this.daysDifference > 3) {
                    markerColor = 'green';
                } else if (this.daysDifference <= 3 && this.daysDifference > 0) {
                    markerColor = 'orange';
                } else {
                    markerColor = 'red';
                }

                const newMarker = new mapboxgl.Marker({color: markerColor})
                    .setLngLat([marker.longitude, marker.latitude])
                    .addTo(this.map);
                this.markers.push(newMarker);
            });

            Marker.displayMarkerData(this);
        }
    }

    // Load the DOM elements
    loadDom() {
        const app = document.getElementById('app');
        this.elDivMap = document.createElement('div');
        this.elDivMap.id = 'map';
        app.appendChild(this.elDivMap);

        this.form = Form.createForm();
        app.appendChild(this.form);

        const sendButton = document.getElementById('sendButton');
        sendButton.addEventListener('click', (e) => {
            e.preventDefault();
            const formData = {
                title: document.getElementById('title').value,
                description: document.getElementById('description').value,
                startDate: document.getElementById('start-date').value,
                endDate: document.getElementById('end-date').value,
                longitude: parseFloat(document.getElementById('longitude').value),
                latitude: parseFloat(document.getElementById('latitude').value)
            };
            const savedMarker = MarkerService.saveStorageData(formData);
            Marker.confirmMarker(this, savedMarker);
        });

        const modifyButton = document.getElementById('modifyButton');
        modifyButton.addEventListener('click', (e) => {
            e.preventDefault();
            Marker.modifyMarkerInfo(this);
        });
    }

    // Initialize the map
    initMap() {
        mapboxgl.accessToken = config.apis.mapbox_gl.apiKey;
        this.map = new mapboxgl.Map({
            container: this.elDivMap,
            style: config.apis.mapbox_gl.map_styles.satellite_streets,
            center: [135.50440880239097, 34.648799335813635],
            zoom: 15
        });

        const nav = new mapboxgl.NavigationControl();
        this.map.addControl(nav, 'top-left');

        this.map.on('click', this.handleClickMap.bind(this));
    }

    // Handle map click event
    handleClickMap(event) {
        if (this.clickedOnMarker) {
            this.clickedOnMarker = false;
            return;
        }

        const coordinates = [event.lngLat.lng, event.lngLat.lat];
        document.getElementById('longitude').value = coordinates[0];
        document.getElementById('latitude').value = coordinates[1];
        document.getElementById('title').value = '';
        document.getElementById('description').value = '';
        document.getElementById('start-date').value = '';
        document.getElementById('end-date').value = '';

        this.lngLat = new LngLat(coordinates[0], coordinates[1]);

        if (this.tempMarker) {
            this.tempMarker.remove();
        }

        this.tempMarker = new mapboxgl.Marker()
            .setLngLat(this.lngLat)
            .addTo(this.map);
    }
}

const app = new App();

export default app;
