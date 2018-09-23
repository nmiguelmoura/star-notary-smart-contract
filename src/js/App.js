class App {
    constructor() {
        this._currentFrame = null;
        this._init();
    }

    _submitClick(event) {
        event.preventDefault();

        const name = event.currentTarget.getAttribute('name');
        switch(name) {
            case 'create-submit':
                this._create.submit();
                break;

            case 'search-submit':
                this._search.submit();
                break;
        }

    }

    _mainClick(event) {
        const name = event.currentTarget.getAttribute("data-name");

        if(name !== this._currentFrame) {
            this._result.reset();

            if(this._currentFrame) {
                this._frames[this._currentFrame].className = "frame-hide";
            }

            this._frames[name].className = "frame-show";
            this._currentFrame = name;
        }
    }

    _addListeners() {
        const mainClickBound = this._mainClick.bind(this);
        this._mainBtns.create.addEventListener('click', mainClickBound, false);
        this._mainBtns.search.addEventListener('click', mainClickBound, false);

        const submitClickBound = this._submitClick.bind(this);
        this._submitButtons.create.addEventListener('click', submitClickBound, false);
        this._submitButtons.search.addEventListener('click', submitClickBound, false);
    };

    _getDOMReferences() {
        this._mainBtns = {
            create: document.getElementsByClassName('create-star-button')[0],
            search: document.getElementsByClassName('search-star-button')[0]
        };

        this._frames = {
            createStar: document.getElementById('createStar'),
            searchStar: document.getElementById('searchStar')
        };

        this._submitButtons = {
            create: document.getElementsByClassName('create-submit-button')[0],
            search: document.getElementsByClassName('search-submit-button')[0]
        };
    }

    _init() {
        if(typeof web3 != 'undefined') {
            web3 = new Web3(web3.currentProvider) // what Metamask injected
        } else {
            // Instantiate and set Ganache as your provider
            web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        }

        // The default (top) wallet account from a list of test accounts
        web3.eth.defaultAccount = web3.eth.accounts[0];

        // The interface definition for your smart contract (the ABI)
        var StarNotary = web3.eth.contract(
            [
                {"constant":true,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_approved","type":"address"},{"name":"_tokenId","type":"uint256"}],"name":"approve","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"tokenIdToStarInfo","outputs":[{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"_dec","type":"string"},{"name":"_mag","type":"string"},{"name":"_cent","type":"string"}],"name":"checkIfStarExists","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"buyStar","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_tokenId","type":"uint256"},{"name":"_price","type":"uint256"}],"name":"putStarUpForSale","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"getStarNameFromTokenId","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"starsForSale","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_operator","type":"address"},{"name":"_approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"starsPutForSale","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_story","type":"string"},{"name":"_dec","type":"string"},{"name":"_mag","type":"string"},{"name":"_cent","type":"string"},{"name":"_tokenId","type":"uint256"}],"name":"createStar","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_tokenId","type":"uint256"},{"name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"getStarPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":true,"name":"_tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_approved","type":"address"},{"indexed":true,"name":"_tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_operator","type":"address"},{"indexed":false,"name":"_approved","type":"bool"}],"name":"ApprovalForAll","type":"event"}
            ]
        );
        // Grab the contract at specified deployed address with the interface defined by the ABI
        var starNotary = StarNotary.at('0x6630166F1dCC3A9a5e13A756c085966a36e1FDC4');
        this._result = new Result();
        this._create = new Create(starNotary, this._result);
        this._search = new Search(starNotary, this._result);
        this._getDOMReferences();
        this._addListeners();
    }
}

const app = new App();
