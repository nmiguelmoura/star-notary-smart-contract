class Search {
    constructor(starNotary, result) {
        this._starNotary = starNotary;
        this._result = result;

        this._init();
    }

    submit() {
        this._result.reset = "";

        const token = this._inputToken.value;

        this._starNotary.tokenIdToStarInfo(token, (error, response) => {
            if (error) {
                this._result.setResult('error');
                return;
            }

            this._result.setResult('starInfo', response, token);
        });
    }

    _getDOMReferences() {
        this._inputToken = document.getElementsByClassName('input-search-token')[0];

    }

    _init() {
        this._getDOMReferences();
    }
}