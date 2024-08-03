class Form {

    // Create the form element
    static createForm() {
        this.elForm = document.createElement('form');
        this.elForm.id = 'formField';
        this.elForm.innerHTML = `
            <div class="d-flex flex-column card" style="width: 16rem;">
                <div class="card-body">
                    <input id="title" type="text" title="title" class="form-control" placeholder="Title">
                    <input id="description" type="text" title="description" class="form-control" placeholder="Description">
                    <input id="start-date" type="datetime-local" title="start-date" class="form-control" placeholder="Start Date">
                    <input id="end-date" type="datetime-local" title="end-date" class="form-control" placeholder="End Date">
                    <input id="longitude" type="number" title="longitude" class="form-control" placeholder="Longitude">          
                    <input id="latitude" type="number" title="latitude" class="form-control" placeholder="Latitude">
                    <div class="d-flex justify-content-between">
                        <button id="sendButton" type="submit" class="btn btn-info">Create Event</button>
                        <button id="modifyButton" type="button" class="btn btn-secondary">Modify Event</button>
                    </div>
                </div>
            </div>
        `;
        return this.elForm;
    }
}

export default Form;