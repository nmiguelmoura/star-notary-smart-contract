var HDWalletProvider = require("truffle-hdwallet-provider");

var mnemonic = "fame peanut hurdle inflict champion spike outside aisle shy link dinosaur lumber";

module.exports = {
    networks: {
        development: {
            host: "127.0.0.1",
            port: 8545,
            network_id: "*"
        },
        rinkeby: {
            provider: function() {
                return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/bad754ac561d489894e7c982de6192f9")
            },
            network_id: 4,
            gas: 4500000,
            gasPrice: 10000000000
        }
    }
};
