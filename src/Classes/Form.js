class Form {

// méthode qui crée un formulaire geographic
   static createForm() {
        this.elForm = document.createElement('form');
        this.elForm.id = 'formField';
        this.elForm.innerHTML = `
            <div class="d-flex flex-column card" style="width: 16rem;">
                <div class="card-body">
                    <input id="titre" type="text" title="title" class="form-control" placeholder="Titre">
                    <input id="description" type="text" title="description" class="form-control" placeholder="Description">
                    <input id="start-date" type="datetime-local" title="start-date" class="form-control" placeholder="Date de début">
                    <input id="end-date" type="datetime-local" title="end-date" class="form-control" placeholder="Date de fin">
                    <input id="latitude" type="number" title="latitude" class="form-control" placeholder="Latitude">
                    <input id="longitude" type="number" title="longitude" class="form-control" placeholder="Longitude">          
                    <div class="d-flex justify-content-center">
                        <button id="sendButton" type="submit" class="btn btn-info" style="width: 8rem;">Create event</button>
                    </div>
                </div>
            </div>
        `;
        return this.elForm;
    }

    // méthode qui sauvegarde les données du formulaire
   static saveFormData() {
        localStorage.setItem('titre', document.getElementById('titre').value);
        localStorage.setItem('description', document.getElementById('description').value);
        localStorage.setItem('start-date', document.getElementById('start-date').value);
        localStorage.setItem('end-date', document.getElementById('end-date').value);
        localStorage.setItem('latitude', document.getElementById('latitude').value);
        localStorage.setItem('longitude', document.getElementById('longitude').value);
    }


    // méthode qui récupère les données du formulaire
    getFormData() {
        return {
            titre: localStorage.getItem('titre'),
            description: localStorage.getItem('description'),
            startDate: localStorage.getItem('start-date'),
            endDate: localStorage.getItem('end-date'),
            coordinates: localStorage.getItem('coordinates')
        }
    }

}

export default Form;