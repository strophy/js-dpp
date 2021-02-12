const AbstractStateTransitionIdentitySigned = require(
  '../../stateTransition/AbstractStateTransitionIdentitySigned',
);

const DataContract = require('../DataContract');

class DataContractUpdateTransition extends AbstractStateTransitionIdentitySigned {
  /**
   * @param {RawDataContractUpdateTransition} rawDataContractUpdateTransition
   */
  constructor(rawDataContractUpdateTransition) {
    super(rawDataContractUpdateTransition);

    this.dataContract = new DataContract(rawDataContractUpdateTransition.dataContract);
  }

  /**
   * Get Data Contract
   *
   * @return {DataContract}
   */
  getDataContract() {
    return this.dataContract;
  }

  /**
   * Set Data Contract
   *
   * @param {DataContract} dataContract
   * @return {DataContractCreateTransition}
   */
  setDataContract(dataContract) {
    this.dataContract = dataContract;

    return this;
  }
}

/**
 * @typedef {RawStateTransitionIdentitySigned & Object} RawDataContractUpdateTransition
 * @property {RawDataContract} dataContract
 */

/**
 * @typedef {JsonStateTransitionIdentitySigned & Object} JsonDataContractUpdateTransition
 * @property {JsonDataContract} dataContract
 */

module.exports = DataContractUpdateTransition;
