const STORAGE_MARKER = 'elForm'; // nom utilisé pour stocker les notes dans le localStorage

class MarkerService {

    // méthode pour sauvegarder les notes dans le localStorage
    static saveStorageData() {
        const formData = {
            titre: document.getElementById('titre').value,
            description: document.getElementById('description').value,
            startDate: document.getElementById('start-date').value,
            endDate: document.getElementById('end-date').value,
            latitude: document.getElementById('latitude').value,
            longitude: document.getElementById('longitude').value
        };

        let existingData = JSON.parse(localStorage.getItem(STORAGE_MARKER)) || [];
        existingData.push(formData);

        try {
            localStorage.setItem(STORAGE_MARKER, JSON.stringify(existingData));
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des données dans le localStorage', error);
        }

        // return might be false
        return formData;
    }

   static readStorageData() {
        let arrMarkers = [];

        const serializedData = localStorage.getItem(STORAGE_MARKER);

        if (!serializedData) {
            return arrMarkers;
        }

        try {
            arrMarkers = JSON.parse(serializedData);
        } catch (error) {
            localStorage.removeItem(STORAGE_MARKER);
        }

        return arrMarkers;
    }
}

export default MarkerService;