const DocumentFactory = require('../../document/DocumentFactory');
const getFeatureFlagContractFixture = require('./getFeatureFlagContractFixture');

const featureFlagDataContract = getFeatureFlagContractFixture();

function getFeatureFlagDocumentsFixture(dataContract = undefined) {
  const factory = new DocumentFactory(
    () => ({
      isValid: () => true,
    }),
    () => {},
  );

  return [
    factory.create(
      dataContract || featureFlagDataContract,
      (dataContract || featureFlagDataContract).getOwnerId(),
      'updateConsensusParams',
      {},
    ),
  ];
}

module.exports = getFeatureFlagDocumentsFixture;
