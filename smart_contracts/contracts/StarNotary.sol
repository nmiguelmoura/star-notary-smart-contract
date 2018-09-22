pragma solidity ^0.4.23;

import './ERC721Token.sol';

contract StarNotary is ERC721Token {

    struct Coordinates {
        string dec;
        string mag;
        string cent;
    }

    struct Star {
        string name;
        string story;
        Coordinates coordinates;
    }

    mapping(bytes32 => uint256) hashToTokenId;
    mapping(uint256 => Star) public tokenIdToStarInfo;
    mapping(uint256 => uint256) public starsPutForSale;
    uint256[] starsPutForSaleIndex;

    function createStar(string _name, string _story, string _dec, string _mag, string _cent, uint256 _tokenId) public returns(string) {

        bytes32 hashCoord = hashCoordinates(_dec, _mag, _cent);

        require(hashToTokenId[hashCoord] == 0, 'Star already exists');

        Coordinates memory newCoordinates = Coordinates(_dec, _mag, _cent);
        Star memory newStar = Star(_name, _story, newCoordinates);

        tokenIdToStarInfo[_tokenId] = newStar;

        ERC721Token.mint(_tokenId);

        hashToTokenId[hashCoord] = _tokenId;
    }

    function tokenIdToStarInfo(uint256 _tokenId) public view returns (string, string, string, string, string) {
        Star memory star = tokenIdToStarInfo[_tokenId];
        return (star.name, star.story, concatStr("dec_", star.coordinates.dec, ""), concatStr("mag_", star.coordinates.mag, ""), concatStr("cent_", star.coordinates.cent, ""));
    }

    function getStarNameFromTokenId(uint256 _tokenId) public view returns (string) {
        return tokenIdToStarInfo[_tokenId].name;
    }

    function hashCoordinates(string _dec, string _mag, string _cent) internal returns (bytes32) {
        return keccak256(abi.encodePacked(concatStr(_dec, _mag, _cent)));
    }

    function concatStr(string _str1, string _str2, string _str3) internal returns (string) {
        bytes memory _bstr1 = bytes(_str1);
        bytes memory _bstr2 = bytes(_str2);
        bytes memory _bstr3 = bytes(_str3);
        string memory res = new string(_bstr1.length + _bstr2.length + _bstr3.length);
        bytes memory bres = bytes(res);

        uint i = 0;
        for(uint a = 0; a < _bstr1.length; a++) bres[i++] = _bstr1[a];
        for(uint b = 0; b < _bstr2.length; b++) bres[i++] = _bstr2[b];
        for(uint c = 0; c < _bstr3.length; c++) bres[i++] = _bstr3[c];

        return string(bres);
    }

    function checkIfStarExists(string _dec, string _mag, string _cent) public view returns (bool) {
        bytes32 hashCoord = hashCoordinates(_dec, _mag, _cent);
        return hashToTokenId[hashCoord] != 0;
    }

    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        require(msg.sender == this.ownerOf(_tokenId), "User is not the owner of the star.");

        starsPutForSale[_tokenId] = _price;

        starsPutForSaleIndex.push(_tokenId);
    }

    function getStarPrice(uint256 _tokenId) public view returns (uint256) {
        return starsPutForSale[_tokenId];
    }

    function starsForSale() public view returns (uint256[]) {
        uint len = starsPutForSaleIndex.length;

        uint256[] stars;

        for(uint i = 0; i < len; i++) {
            if(starsPutForSale[starsPutForSaleIndex[i]] != 0) {
                stars.push(starsPutForSaleIndex[i]);
            }
        }

        return stars;
    }

    function buyStar(uint256 _tokenId) public payable {
        require(starsPutForSale[_tokenId] > 0, "Star is not for sale");

        uint256 starCost = starsPutForSale[_tokenId];
        address starOwner = this.ownerOf(_tokenId);

        require(msg.value >= starCost, "Payment not enough to buy star");

        clearPreviousStarState(_tokenId);

        transferFromHelper(starOwner, msg.sender, _tokenId);

        if(msg.value > starCost) {
            msg.sender.transfer(msg.value - starCost);
        }

        starOwner.transfer(starCost);
    }

    function clearPreviousStarState(uint256 _tokenId) private {
        tokenToApproved[_tokenId] = address(0);
        starsPutForSale[_tokenId] = 0;
    }
}