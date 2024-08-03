import mapboxgl from "mapbox-gl";
import MarkerService from "../Services/MarkerService.js";

class Marker {
    // Display marker data on the map
    static displayMarkerData(appInstance) {

        const {markers, map, markerService} = appInstance;
        const popup = new mapboxgl.Popup({closeButton: false, closeOnClick: false});

        markers.forEach(marker => {
            const markerElement = marker.getElement();
            markerElement.classList.add('marker-buffer');

            const tooltip = new mapboxgl.Popup({closeButton: false, closeOnClick: false, offset: 25});

            markerElement.addEventListener('mouseenter', () => {
                if (!popup.isOpen()) {
                    const allMarkers = markerService.readStorageData();
                    const markerData = allMarkers.find(m => m.latitude === marker.getLngLat().lat && m.longitude === marker.getLngLat().lng);

                    if (markerData) {
                        appInstance.eventDate = new Date(markerData.startDate);
                        appInstance.currentDate = new Date();
                        appInstance.timeDifference = appInstance.eventDate - appInstance.currentDate;
                        appInstance.daysDifference = Math.ceil(appInstance.timeDifference / (1000 * 60 * 60 * 24));
                        appInstance.hoursDifference = Math.ceil((appInstance.timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

                        let message = '';
                        if (appInstance.daysDifference <= 3 && appInstance.daysDifference > 0) {
                            message = `<div class="alert alert-warning">Attention, event starts in 
                                        ${appInstance.daysDifference} days and 
                                        ${appInstance.hoursDifference} hours!</div>`;
                        } else if (appInstance.daysDifference <= 0) {
                            message = '<div class="alert alert-danger">Dang it, it looks like you missed this event!</div>';
                        }

                        tooltip.setLngLat(marker.getLngLat())
                            .setHTML(`
                                    <div class="card">
                                        <div class="card-body text-center pt-4">
                                            <h5 class="card-title">${markerData.title}</h5>
                                            <div class="card-text">
                                                <p>
                                                    <b>Start:</b> ${markerData.startDate}<br>
                                                    <b>End:</b> ${markerData.endDate}
                                                </p>
                                                <div class="mt-3">${message}</div>
                                            </div>
                                        </div>
                                    </div>
                                    `)
                            .addTo(map);
                    }
                }
            });

            markerElement.addEventListener('mouseleave', () => {
                tooltip.remove();
            });

            markerElement.addEventListener('click', () => {
                appInstance.clickedOnMarker = true;
                const allMarkers = markerService.readStorageData();
                const markerData = allMarkers.find(m => m.latitude === marker.getLngLat().lat && m.longitude === marker.getLngLat().lng);

                if (markerData) {
                    document.getElementById('title').value = markerData.title;
                    document.getElementById('description').value = markerData.description;
                    document.getElementById('start-date').value = markerData.startDate;
                    document.getElementById('end-date').value = markerData.endDate;
                    document.getElementById('longitude').value = markerData.longitude;
                    document.getElementById('latitude').value = markerData.latitude;

                    popup.setLngLat(marker.getLngLat())
                        .setHTML(`
                                <div class="card">
                                    <div class="card-body">
                                        <p class="card-text">
                                           <b>Start:</b> ${markerData.startDate}<br><br>
                                           <b>End:</b> ${markerData.endDate}<br><br>
                                           <b>Description:</b><br>
                                           ${markerData.description}<br><br>
                                           <b>Location:</b><br>
                                           Longitude: ${markerData.longitude}<br>
                                           Latitude: ${markerData.latitude}
                                        </p>
                                    </div>
                                </div>
                                `)
                        .addTo(map);

                    map.once('dragstart', () => {
                        popup.remove();
                    });
                }
            });
        });
    }


    // Confirm marker creation and refresh markers on the map
    static confirmMarker(appInstance, savedMarker) {
        if (appInstance.tempMarker) {
            MarkerService.saveStorageData(savedMarker);
            appInstance.tempMarker.remove();
            appInstance.tempMarker = null;
            this.refreshMarkers(appInstance);
        }
    }

    // Modify marker information and refresh markers on the map
    static modifyMarkerInfo(appInstance) {
        const updatedData = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            startDate: document.getElementById('start-date').value,
            endDate: document.getElementById('end-date').value,
            longitude: parseFloat(document.getElementById('longitude').value),
            latitude: parseFloat(document.getElementById('latitude').value)
        };

        MarkerService.updateMarkerData(updatedData);
        this.refreshMarkers(appInstance);
    }

    // Refresh markers on the map
    static refreshMarkers(appInstance) {
        const {map, markers, markerService} = appInstance;

        // Remove existing markers from the map
        markers.forEach(marker => marker.remove());
        markers.length = 0;

        // Retrieve updated marker data from storage
        const allMarkers = markerService.readStorageData();

        // Add new markers to the map
        allMarkers.forEach(markerData => {
            const newMarker = new mapboxgl.Marker({color: markerData.color})
                .setLngLat([markerData.longitude, markerData.latitude])
                .addTo(map);
            markers.push(newMarker);
        });

        // Display updated marker data
        this.displayMarkerData(appInstance);
    }
}

export default Marker;
