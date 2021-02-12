const DataTriggerExecutionResult = require('./DataTriggerExecutionResult');
const DataTriggerConditionError = require('../errors/DataTriggerConditionError');

/**
 * Data trigger to restrict actions for owners only
 *
 * @param {
 *   DocumentCreateTransition |
 *   DocumentReplaceTransition |
 *   DocumentDeleteTransition } documentTransition
 * @param {DataTriggerExecutionContext} context
 *
 * @return {Promise<DataTriggerExecutionResult>}
 */
async function allowOnlyOwnerTrigger(documentTransition, context) {
  const result = new DataTriggerExecutionResult();

  if (!context.getOwnerId().equals(context.getDataContract().getOwnerId())) {
    result.addError(
      new DataTriggerConditionError(
        documentTransition,
        context.getDataContract(),
        context.getOwnerId(),
        'Only owner is allowed to execute the action',
      ),
    );
  }

  return result;
}

module.exports = allowOnlyOwnerTrigger;
