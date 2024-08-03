import config from '../../app.config.json';
import mapboxgl, { LngLat } from 'mapbox-gl';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../assets/styles/style.css';
import MarkerService from "../Services/MarkerService.js";
import Form from "./Form.js";
import Marker from "./Marker.js";

// Main application class
class App {

    // Constructor to initialize properties
    constructor() {
        // Initialize properties
        this.elDivMap = null; // Map container element
        this.map = null; // Map instance
        this.lngLat = null; // Coordinates of the clicked point
        this.markerService = MarkerService; // Marker service for handling marker data
        this.form = null; // Form instance
        this.markers = []; // Array to store marker instances
        this.tempMarker = null; // Temporary marker instance
        this.clickedOnMarker = false; // Flag to check if a marker was clicked
        this.eventDate = null; // Event date
        this.currentDate = null; // Current date
        this.daysDifference = null; // Difference in days between event date and current date
    }

    // Start the application
    start() {
        console.log('App started');
        this.loadDom(); // Load DOM elements
        this.initMap(); // Initialize the map
        // Retrieve existing markers from storage
        const arrMarkers = this.markerService.readStorageData();
        // Add existing markers to the map
        if (arrMarkers.length > 0) {
            arrMarkers.forEach(marker => {
                this.eventDate = new Date(marker.startDate);
                this.currentDate = new Date();
                this.daysDifference = Math.ceil((this.eventDate - this.currentDate) / (1000 * 60 * 60 * 24));
                // Determine marker color based on event date
                let markerColor;
                if (this.daysDifference > 3) {
                    markerColor = 'green';
                } else if (this.daysDifference <= 3 && this.daysDifference > 0) {
                    markerColor = 'orange';
                } else {
                    markerColor = 'red';
                }
                // Create and add marker to the map
                const newMarker = new mapboxgl.Marker({ color: markerColor })
                    .setLngLat([marker.longitude, marker.latitude])
                    .addTo(this.map);
                this.markers.push(newMarker);
            });
            // Display marker data
            Marker.displayMarkerData(this);
        }
    }

    // Load the DOM elements
    loadDom() {
        const app = document.getElementById('app'); // Get the main app container
        this.elDivMap = document.createElement('div'); // Create a div for the map
        this.elDivMap.id = 'map'; // Set the id for the map div
        app.appendChild(this.elDivMap); // Append the map div to the app container

        this.form = Form.createForm(); // Create the form
        app.appendChild(this.form); // Append the form to the app container

        // Add event listener for the send button
        const sendButton = document.getElementById('sendButton');
        sendButton.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default form submission
            const formData = {
                title: document.getElementById('title').value,
                description: document.getElementById('description').value,
                startDate: document.getElementById('start-date').value,
                endDate: document.getElementById('end-date').value,
                longitude: parseFloat(document.getElementById('longitude').value),
                latitude: parseFloat(document.getElementById('latitude').value)
            };
            const savedMarker = MarkerService.saveStorageData(formData); // Save marker data
            Marker.confirmMarker(this, savedMarker); // Confirm marker creation
        });
        // Add event listener for the modify button
        const modifyButton = document.getElementById('modifyButton');
        modifyButton.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default form submission
            Marker.modifyMarkerInfo(this); // Modify marker information
        });
    }

    // Initialize the map
    initMap() {
        mapboxgl.accessToken = config.apis.mapbox_gl.apiKey; // Set Mapbox access token
        this.map = new mapboxgl.Map({
            container: this.elDivMap, // Map container element
            style: config.apis.mapbox_gl.map_styles.satellite_streets, // Map style
            center: [135.50440880239097, 34.648799335813635], // Initial map center coordinates
            zoom: 15 // Initial map zoom level
        });
        // Add navigation control to the map
        const nav = new mapboxgl.NavigationControl();
        this.map.addControl(nav, 'top-left'); // Add navigation control to the top-left corner

        // Add click event listener to the map
        this.map.on('click', this.handleClickMap.bind(this)); // Bind the click event handler
    }

    // Handle map click event
    handleClickMap(event) {
        // If a marker was clicked, reset the flag and return
        if (this.clickedOnMarker) {
            this.clickedOnMarker = false;
            return;
        }
        // Get coordinates from the click event
        const coordinates = [event.lngLat.lng, event.lngLat.lat];
        document.getElementById('longitude').value = coordinates[0]; // Set longitude in the form
        document.getElementById('latitude').value = coordinates[1]; // Set latitude in the form
        document.getElementById('title').value = ''; // Clear title field
        document.getElementById('description').value = ''; // Clear description field
        document.getElementById('start-date').value = ''; // Clear start date field
        document.getElementById('end-date').value = ''; // Clear end date field

        this.lngLat = new LngLat(coordinates[0], coordinates[1]); // Set the clicked coordinates

        // Remove existing temporary marker if any
        if (this.tempMarker) {
            this.tempMarker.remove();
        }
        // Add new temporary marker to the map
        this.tempMarker = new mapboxgl.Marker()
            .setLngLat(this.lngLat)
            .addTo(this.map);
    }
}

// Create and export an instance of the App class
const app = new App();

export default app;