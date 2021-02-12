const DataContractCreateTransition = require('../DataContractCreateTransition');

const InvalidDataContractIdError = require('../../../errors/InvalidDataContractIdError');

const generateDataContractId = require('../../generateDataContractId');

const convertBuffersToArrays = require('../../../util/convertBuffersToArrays');

const dataContractCreateTransitionSchema = require('../../../../schema/dataContract/stateTransition/dataContractCreate');
const Identifier = require('../../../identifier/Identifier');

/**
 * @param {JsonSchemaValidator} jsonSchemaValidator
 * @param {validateDataContract} validateDataContract
 * @param {validateStateTransitionSignature} validateStateTransitionSignature
 * @param {validateIdentityExistence} validateIdentityExistence
 * @return {validateDataContractUpdateTransitionStructure}
 */
function validateDataContractUpdateTransitionStructureFactory(
  jsonSchemaValidator,
  validateDataContract,
  validateStateTransitionSignature,
  validateIdentityExistence,
) {
  /**
   * @typedef validateDataContractUpdateTransitionStructure
   * @param {RawDataContractUpdateTransition} rawStateTransition
   * @return {ValidationResult}
   */
  async function validateDataContractUpdateTransitionStructure(rawStateTransition) {
    const result = jsonSchemaValidator.validate(
      dataContractCreateTransitionSchema,
      convertBuffersToArrays(rawStateTransition),
    );

    if (!result.isValid()) {
      return result;
    }

    // Validate Data Contract
    const rawDataContract = rawStateTransition.dataContract;

    result.merge(
      await validateDataContract(rawDataContract),
    );

    if (!result.isValid()) {
      return result;
    }

    // Validate Data Contract ID
    const generatedId = generateDataContractId(
      rawDataContract.ownerId, rawStateTransition.entropy,
    );

    if (!generatedId.equals(rawDataContract.$id)) {
      result.addError(
        new InvalidDataContractIdError(rawDataContract),
      );

      return result;
    }

    const ownerId = new Identifier(rawDataContract.ownerId);

    // Data Contract identity must exists and confirmed
    result.merge(
      await validateIdentityExistence(ownerId),
    );

    if (!result.isValid()) {
      return result;
    }

    // Verify ST signature
    const stateTransition = new DataContractCreateTransition(rawStateTransition);

    result.merge(
      await validateStateTransitionSignature(stateTransition, ownerId),
    );

    return result;
  }

  return validateDataContractUpdateTransitionStructure;
}

module.exports = validateDataContractUpdateTransitionStructureFactory;
