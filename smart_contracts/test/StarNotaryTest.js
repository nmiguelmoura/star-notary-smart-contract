const StarNotary = artifacts.require('StarNotary');

contract('StarNotary', accounts => {

    const defaultAccount = accounts[0],
        user1 = accounts[1],
        user2 = accounts[2];

    beforeEach(async function () {
        this.contract = await StarNotary.new({from: defaultAccount});
    });

    describe('can create a star', () => {
        const tokenId = 1;

        beforeEach(async function () {
            await this.contract.createStar("My Star 1", "My Star 1 Story", "1.0", "2.0", "3.0", tokenId, {from: user1});
        });

        it('can create a star and get its name', async function () {
            assert.equal(await this.contract.ownerOf(tokenId), user1);
            assert.equal(await this.contract.getStarNameFromTokenId(tokenId), "My Star 1");
        });

        it('cannot create two stars with same coordinates', async function () {
            const tokenId_2 = 2;
            await expectThrow(this.contract.createStar("My Star 2", "My Star 1 Story", "1.0", "2.0", "3.0", tokenId_2, {from: user1}));

        });
    });

    describe('check for a stored star', () => {
        const tokenId = 1;

        beforeEach(async function () {
            await this.contract.createStar("My Star 1", "My Star 1 Story", "1.0", "2.0", "3.0", tokenId, {from: user1});
        });

        it('check if star exists', async function () {
            assert.equal(await this.contract.checkIfStarExists("1.0", "2.0", "3.0"), true);
            assert.equal(await this.contract.checkIfStarExists("1.1", "2.0", "3.0"), false);
            assert.equal(await this.contract.checkIfStarExists("1.0", "3.0", "3.0"), false);
            assert.equal(await this.contract.checkIfStarExists("1.0", "2.0", "3.01"), false);
        });

        it('get star info with tokenId', async function () {
            const starInfo = await this.contract.tokenIdToStarInfo(tokenId);
            assert.equal(starInfo[0], "My Star 1");
            assert.equal(starInfo[1], "My Star 1 Story");
            assert.equal(starInfo[2], "dec_1.0");
            assert.equal(starInfo[3], "mag_2.0");
            assert.equal(starInfo[4], "cent_3.0");
        });
    });

    describe('trade stars', () => {
        const tokenId = 1,
            price = web3.toWei(0.01, "ether");

        beforeEach(async function () {
            await this.contract.createStar("My Star 1", "My Star 1 Story", "1.0", "2.0", "3.0", tokenId, {from: user1});
        });

        it('owner can put star up for sale', async function () {
            await this.contract.putStarUpForSale(tokenId, price, {from: user1});
            assert.equal(await this.contract.getStarPrice(tokenId), price);
        });

        it('only owner can put star up for sale', async function () {
            await expectThrow(this.contract.putStarUpForSale(tokenId, price, {from: user2}));
        });

        it('obtain list of stars for sale', async function () {
            await this.contract.putStarUpForSale(tokenId, price, {from: user1});

            let list = await this.contract.starsForSale();
            list = list.map(item => item.toNumber());

            assert.equal(list[0], tokenId);
        });

        it('user2 can buy a star from user1', async function () {
            await this.contract.putStarUpForSale(tokenId, price, {from: user1});
            await this.contract.buyStar(tokenId, {from: user2, value: price});

            assert.equal(await this.contract.ownerOf(tokenId), user2);
        });

        it('users balances are correct after transaction', async function () {
            await this.contract.putStarUpForSale(tokenId, price, {from: user1});

            const overpaidAmount = web3.toWei(0.025, "ether"),
                user1BalanceBeforeTransaction = web3.eth.getBalance(user1),
                user2BalanceBeforeTransaction = web3.eth.getBalance(user2);
            await this.contract.buyStar(tokenId, {from: user2, value: overpaidAmount, gasPrice: 0});
            const user1BalanceAfterTransaction = web3.eth.getBalance(user1),
                user2BalanceAfterTransaction = web3.eth.getBalance(user2);

            assert.equal(user1BalanceBeforeTransaction.add(price).toNumber(), user1BalanceAfterTransaction);
            assert.equal(user2BalanceBeforeTransaction.sub(user2BalanceAfterTransaction).toNumber(), price);
        });

        it('user2 cant buy star if underpaid', async function () {
            const underpaidAmount = web3.toWei(0.005, "ether");
            await this.contract.putStarUpForSale(tokenId, price, {from: user1});

            await expectThrow(this.contract.buyStar(tokenId, {from: user2, value: underpaidAmount, gasPrice: 0}));
        });
    });
});

var expectThrow = async function (promise) {
    try {
        await promise;
    } catch (error) {
        assert.exists(error);
        return;
    }

    assert.fail('Expected an error but didnt see one!');
};