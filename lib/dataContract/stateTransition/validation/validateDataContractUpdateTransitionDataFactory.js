const ValidationResult = require('../../../validation/ValidationResult');

/**
 *
 * @param {StateRepository} stateRepository
 * @return {validateDataContractUpdateTransitionData}
 */
function validateDataContractUpdateTransitionDataFactory(stateRepository) {
  /**
   * @typedef validateDataContractUpdateTransitionData
   * @param {DataContractCreateTransition} stateTransition
   * @return {ValidationResult}
   */
  async function validateDataContractUpdateTransitionData(stateTransition) {
    const result = new ValidationResult();

    const dataContract = stateTransition.getDataContract();
    const dataContractId = dataContract.getId();

    // Data contract should exist
    const existingDataContract = await stateRepository.fetchDataContract(dataContractId);

    if (!existingDataContract) {
      result.addError(
        new DataContractNotPresentError(dataContract),
      );
    }

    // TODO: implement diff logic using:
    // https://bitbucket.org/atlassian/json-schema-diff/src/master/
    // https://bitbucket.org/atlassian/json-schema-diff-validator/src/master/
    // https://github.com/kpdecker/jsdiff

    return result;
  }

  return validateDataContractUpdateTransitionData;
}

module.exports = validateDataContractUpdateTransitionDataFactory;
