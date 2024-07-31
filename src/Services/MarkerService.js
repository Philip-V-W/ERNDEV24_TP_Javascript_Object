const STORAGE_MARKER = 'marker'; // nom utilisé pour stocker les notes dans le localStorage

class MarkerService {

    readStorage() {
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

    // méthode pour sauvegarder les notes dans le localStorage
    saveStorage(arrMarkers) {
        const serializedData = JSON.stringify(arrMarkers);

        try {
            localStorage.setItem(STORAGE_MARKER, serializedData);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des données dans le localStorage', error);
        }

        return false;
    }


}

export default MarkerService;