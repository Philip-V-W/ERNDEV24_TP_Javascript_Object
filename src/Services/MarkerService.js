const STORAGE_MARKER = 'elForm'; // Storage key for markers

class MarkerService {

    // Save marker data to localStorage
    static saveStorageData(formData) {
        // Validate formData and ensure it contains a startDate
        if (!formData || !formData.startDate) {
            console.error('Invalid formData:', formData);
            return;
        }
        // Retrieve existing marker data from localStorage or initialize an empty array
        let existingData = JSON.parse(localStorage.getItem(STORAGE_MARKER)) || [];
        // Check if the marker data already exists in the existingData array
        const existingMarker = existingData.find(marker =>
            marker.latitude === formData.latitude && marker.longitude === formData.longitude
        );
        if (!existingMarker) {
            // Calculate the number of days between the event date and the current date
            const eventDate = new Date(formData.startDate);
            const currentDate = new Date();
            const daysDifference = Math.ceil((eventDate - currentDate) / (1000 * 60 * 60 * 24));
            // Determine marker color based on the daysDifference
            if (daysDifference > 3) {
                formData.color = 'green';
            } else if (daysDifference <= 3 && daysDifference > 0) {
                formData.color = 'orange';
            } else {
                formData.color = 'red';
            }
            // Add the new marker data to the existing data array
            existingData.push(formData);
            // Save the updated marker data back to localStorage
            try {
                localStorage.setItem(STORAGE_MARKER, JSON.stringify(existingData));
            } catch (error) {
                console.error('Error saving data to localStorage', error);
            }
        }
        return formData;
    }

    // Read marker data from localStorage
    static readStorageData() {
        let arrMarkers = [];
        const serializedData = localStorage.getItem(STORAGE_MARKER);
        // If no data is found, return an empty array
        if (!serializedData) {
            return arrMarkers;
        }
        // Parse the serialized data from localStorage
        try {
            arrMarkers = JSON.parse(serializedData);
        } catch (error) {
            console.error('Error parsing localStorage data:', error);
            localStorage.removeItem(STORAGE_MARKER);
            return arrMarkers;
        }
        // Ensure the parsed data is an array
        if (!Array.isArray(arrMarkers)) {
            arrMarkers = [];
        }
        // Filter out invalid marker data
        arrMarkers = arrMarkers.filter(marker => {
            return marker && typeof marker === 'object' && marker.startDate && marker.endDate && marker.latitude && marker.longitude;
        });
        return arrMarkers;
    }

    // Update marker data in localStorage
    static updateMarkerData(updatedData) {
        // Retrieve existing marker data from localStorage or initialize an empty array
        let existingData = JSON.parse(localStorage.getItem(STORAGE_MARKER)) || [];
        // Ensure the existing data is an array
        if (!Array.isArray(existingData)) {
            existingData = [];
        }
        // Find the index of the marker to be updated
        const markerIndex = existingData.findIndex(marker =>
            marker && typeof marker === 'object' && marker.latitude === updatedData.latitude && marker.longitude === updatedData.longitude
        );
        // If the marker is found, update its data
        if (markerIndex !== -1) {
            // Calculate the number of days between the event date and the current date
            const eventDate = new Date(updatedData.startDate);
            const currentDate = new Date();
            const daysDifference = Math.ceil((eventDate - currentDate) / (1000 * 60 * 60 * 24));
            // Determine marker color based on the daysDifference
            if (daysDifference > 3) {
                updatedData.color = 'green';
            } else if (daysDifference <= 3 && daysDifference > 0) {
                updatedData.color = 'orange';
            } else {
                updatedData.color = 'red';
            }
            // Update the marker data in the existing data array
            existingData[markerIndex] = updatedData;
            // Save the updated marker data back to localStorage
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