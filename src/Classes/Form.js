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

    // Create the map overlay element
    static createMapSettings() {
        this.elMapSettings = document.createElement('mapSettings');
        this.elMapSettings.className = 'map-overlay top';
        this.elMapSettings.innerHTML = `
            <div class="map-overlay-inner">
                <fieldset class="select-fieldset">
                    <label>Select a map Style</label>
                    <select id="mapStyle" name="mapPreset">
                        <option value="Streets">Streets</option>
                        <option value="Outdoors">Outdoors</option>
                        <option value="Light">Light</option>
                        <option value="Dark">Dark</option>
                        <option value="Satellite">Satellite</option>
                        <option value="Satellite streets" selected>Satellite Streets</option>
                        <option value="Navigation day">Navigation Day</option>
                        <option value="Navigation night">Navigation Night</option>
                    </select>
                </fieldset>
            <!-- <fieldset> --> <!-- TODO: can't seem to get this to work -->
                <!-- <label for="showPlaceLabels">Show place labels</label> -->
                <!-- <input type="checkbox" id="showPlaceLabels" checked=""> -->
            <!-- </fieldset> -->
                <fieldset>
                    <label for="showPointOfInterestLabels">Show POI labels</label>
                    <input type="checkbox" id="showPointOfInterestLabels" checked="">
                </fieldset>
                <fieldset>
                    <label for="showRoadLabels">Show road labels</label>
                    <input type="checkbox" id="showRoadLabels" checked="">
                </fieldset>
                <fieldset>
                    <label for="showTransitLabels">Show transit labels</label>
                    <input type="checkbox" id="showTransitLabels" checked="">
                </fieldset>
            </div>
        `;
        return this.elMapSettings;
    }
}

export default Form;