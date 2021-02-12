const lodashCloneDeep = require('lodash.clonedeep');

const DataTriggerExecutionResult = require('../DataTriggerExecutionResult');
const DataTriggerConditionError = require('../../errors/DataTriggerConditionError');

/**
 * Data trigger for feature flag creation process
 *
 * @param {DocumentCreateTransition} documentTransition
 * @param {DataTriggerExecutionContext} context
 *
 * @return {Promise<DataTriggerExecutionResult>}
 */
async function createFeatureFlagDataTrigger(documentTransition, context) {
  const result = new DataTriggerExecutionResult();

  const clonedData = lodashCloneDeep(documentTransition.getData());

  delete clonedData.enableAtHeight;

  if (Object.entries(clonedData).length === 0) {
    result.addError(
      new DataTriggerConditionError(
        documentTransition,
        context.getDataContract(),
        context.getOwnerId(),
        'Feature flag should have all necessary fields',
      ),
    );
  }

  const stateRepository = context.getStateRepository();

  const latestPlatformBlockHeader = await stateRepository.fetchLatestPlatformBlockHeader();

  const { height } = latestPlatformBlockHeader;

  if (documentTransition.get('enableAtHeight') < height) {
    result.addError(
      new DataTriggerConditionError(
        documentTransition,
        context.getDataContract(),
        context.getOwnerId(),
        'Feature flag cannot be enabled in the past',
      ),
    );
  }

  return result;
}

module.exports = createFeatureFlagDataTrigger;
