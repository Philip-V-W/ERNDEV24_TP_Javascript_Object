const STORAGE_MARKER = 'elForm'; // Storage key for markers

class MarkerService {
    // Save marker data to localStorage
    static saveStorageData(formData) {
        if (!formData || !formData.startDate) {
            console.error('Invalid formData:', formData);
            return;
        }

        let existingData = JSON.parse(localStorage.getItem(STORAGE_MARKER)) || [];

        // Determine marker color based on date logic
        const eventDate = new Date(formData.startDate);
        const currentDate = new Date();
        const daysDifference = Math.ceil((eventDate - currentDate) / (1000 * 60 * 60 * 24));

        if (daysDifference > 3) {
            formData.color = 'green';
        } else if (daysDifference <= 3 && daysDifference > 0) {
            formData.color = 'orange';
        } else {
            formData.color = 'red';
        }

        existingData.push(formData);

        try {
            localStorage.setItem(STORAGE_MARKER, JSON.stringify(existingData));
        } catch (error) {
            console.error('Error saving data to localStorage', error);
        }

        return formData;
    }

    // Read marker data from localStorage
    static readStorageData() {
        let arrMarkers = [];
        const serializedData = localStorage.getItem(STORAGE_MARKER);

        if (!serializedData) {
            return arrMarkers;
        }

        try {
            arrMarkers = JSON.parse(serializedData);
        } catch (error) {
            console.error('Error parsing localStorage data:', error);
            localStorage.removeItem(STORAGE_MARKER);
            return arrMarkers;
        }

        // Ensure arrMarkers is an array
        if (!Array.isArray(arrMarkers)) {
            arrMarkers = [];
        }

        // Validate data integrity
        arrMarkers = arrMarkers.filter(marker => {
            return marker && typeof marker === 'object' && marker.startDate && marker.endDate && marker.latitude && marker.longitude;
        });

        return arrMarkers;
    }

    // Update marker data in localStorage
    static updateMarkerData(updatedData) {
        let existingData = JSON.parse(localStorage.getItem(STORAGE_MARKER)) || [];

        // Ensure existingData is an array
        if (!Array.isArray(existingData)) {
            existingData = [];
        }

        // Find the marker index and update its data
        const markerIndex = existingData.findIndex(marker =>
            marker && typeof marker === 'object' && marker.latitude === updatedData.latitude && marker.longitude === updatedData.longitude
        );

        if (markerIndex !== -1) {
            // Determine marker color based on date logic
            const eventDate = new Date(updatedData.startDate);
            const currentDate = new Date();
            const daysDifference = Math.ceil((eventDate - currentDate) / (1000 * 60 * 60 * 24));

            if (daysDifference > 3) {
                updatedData.color = 'green';
            } else if (daysDifference <= 3 && daysDifference > 0) {
                updatedData.color = 'orange';
            } else {
                updatedData.color = 'red';
            }

            existingData[markerIndex] = updatedData;

            // Save updated data back to localStorage
            try {
                localStorage.setItem(STORAGE_MARKER, JSON.stringify(existingData));
            } catch (error) {
                console.error('Error saving data to localStorage:', error);
            }
        } else {
            console.error('Marker not found for update');
        }
    }
}

export default MarkerService;
