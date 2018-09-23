class Result {
    constructor() {
        this._init();
    }

    reset() {
        this._result.innerHTML = '';
    }

    setResult(type, info, tokenId) {
        if(!type) {
            this.reset();
        }

        switch(type) {
            case 'starInfo':
                if(info[0] === '') {
                    this._result.innerHTML = "<p>There isn't a star registered with that token id!</p>";
                } else {
                    this._result.innerHTML = `<h3>Star with token ${tokenId}</h3>
                                               <p>Name: ${info[0]}</p>
                                               <p>Story: ${info[1]}</p>
                                               <p>Dec: ${info[2].split('dec_')[1]}</p>
                                               <p>Mag: ${info[3].split('mag_')[1]}</p>
                                               <p>Cent: ${info[4].split('cent_')[1]}</p>`;
                }
                break;

            case 'transaction':
                this._result.innerHTML = `<p>Transaction ${info} registered.</p>`;
                break;

            case 'missing-parameters':
                this._result.innerHTML = '<p>Please fill all info boxes above before submitting.</p>';
                break;

            case 'error':
                this._result.innerHTML = '<p>An error occurred, please try again!</p>';
                break;
        }
    }

    _getDOMReferences() {
        this._result = document.getElementsByClassName('results')[0];
    }

    _init() {
        this._getDOMReferences();
    }
}