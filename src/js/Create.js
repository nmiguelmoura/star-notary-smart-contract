class Create {
    constructor(starNotary, result) {
        this._starNotary = starNotary;
        this._result = result;

        this._init();
    }

    submit() {
        this._result.reset();

        const name = this._inputs.name.value,
            story = this._inputs.story.value,
            dec = this._inputs.dec.value,
            mag = this._inputs.mag.value,
            cent = this._inputs.cent.value,
            token = this._inputs.token.value;

        if(name && story && dec && mag && cent && token) {
            web3.eth.getAccounts((error, accounts) => {
                if(error) {
                    this._result.setResult('error');
                    return;
                }

                const account = accounts[0];

                this._starNotary.createStar(name, story, dec, mag, cent, token, {from: account}, (error, response) => {
                    if(error) {
                        this._result.setResult('error');
                    } else {
                        this._result.setResult('transaction', response, token);
                    }
                })
            });


        } else {
            this._result.setResult('missing-parameters');
        }



    }

    _getDOMReferences() {
        this._inputs = {
            name: document.getElementsByClassName('input-create-name')[0],
            story: document.getElementsByClassName('input-create-story')[0],
            dec: document.getElementsByClassName('input-create-dec')[0],
            mag: document.getElementsByClassName('input-create-mag')[0],
            cent: document.getElementsByClassName('input-create-cent')[0],
            token: document.getElementsByClassName('input-create-token')[0]
        };
    }

    _init() {
        this._getDOMReferences();
    }
}