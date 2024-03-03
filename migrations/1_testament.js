var Testament = artifacts.require("./TestamentManager.sol");

module.exports = function (deployer) {
    deployer.deploy(Testament);
};