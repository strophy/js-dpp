const createContactRequestDataTrigger = require('../../../../lib/dataTrigger/dashpayDataTriggers/createContactRequestDataTrigger');

const DataTriggerExecutionContext = require('../../../../lib/dataTrigger/DataTriggerExecutionContext');
const DataTriggerExecutionResult = require('../../../../lib/dataTrigger/DataTriggerExecutionResult');
const DataTriggerConditionError = require('../../../../lib/errors/DataTriggerConditionError');

const createStateRepositoryMock = require('../../../../lib/test/mocks/createStateRepositoryMock');
const getDocumentTransitionFixture = require('../../../../lib/test/fixtures/getDocumentTransitionsFixture');

const getFeatureFlagContractFixture = require('../../../../lib/test/fixtures/getFeatureFlagContractFixture');
const getFeatureFlagDocumentsFixture = require('../../../../lib/test/fixtures/getFeatureFlagDocumentsFixture');
const createFeatureFlagDataTrigger = require('../../../../lib/dataTrigger/featureFlagTriggers/createFeatureFlagDataTrigger');

describe('createFeatureFlagDataTrigger', () => {
  let context;
  let stateRepositoryMock;
  let dataContract;
  let featureFlagDocument;
  let documentTransition;

  beforeEach(function beforeEach() {
    dataContract = getFeatureFlagContractFixture();
    [featureFlagDocument] = getFeatureFlagDocumentsFixture();

    [documentTransition] = getDocumentTransitionFixture({
      create: [featureFlagDocument],
    });

    stateRepositoryMock = createStateRepositoryMock(this.sinonSandbox);
    stateRepositoryMock.fetchLatestPlatformBlockHeader.resolves({
      height: 42,
    });

    context = new DataTriggerExecutionContext(
      stateRepositoryMock,
      dataContract.getOwnerId(),
      dataContract,
    );
  });

  it('should successfully execute if document is valid', async () => {
    const result = await createFeatureFlagDataTrigger(
      documentTransition, context,
    );

    expect(result).to.be.an.instanceOf(DataTriggerExecutionResult);
    expect(stateRepositoryMock.fetchLatestPlatformBlockHeader).to.be.calledOnce();
    expect(result.isOk()).to.be.true();
  });
});
