const featureFlagSchema = null;
const DataContractFactory = require('../../dataContract/DataContractFactory');

const generateRandomIdentifier = require('../utils/generateRandomIdentifier');

const ownerId = generateRandomIdentifier();

/**
 * @return {DataContract}
 */
module.exports = function getFeatureFlagContractFixture() {
  const factory = new DataContractFactory(() => {});
  return factory.create(ownerId, featureFlagSchema);
};
