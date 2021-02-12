const DataTriggerExecutionContext = require('../../../lib/dataTrigger/DataTriggerExecutionContext');

const createStateRepositoryMock = require('../../../lib/test/mocks/createStateRepositoryMock');

const getDocumentTransitionFixture = require('../../../lib/test/fixtures/getDocumentTransitionsFixture');

const DataTriggerExecutionResult = require('../../../lib/dataTrigger/DataTriggerExecutionResult');
const getDataContractFixture = require('../../../lib/test/fixtures/getDataContractFixture');
const getDocumentsFixture = require('../../../lib/test/fixtures/getDocumentsFixture');
const AbstractDocumentTransition = require('../../../lib/document/stateTransition/documentTransition/AbstractDocumentTransition');
const allowOnlyOwnerTrigger = require('../../../lib/dataTrigger/allowOnlyOwnerTrigger');
const Identifier = require('../../../lib/identifier/Identifier');

describe('allowOnlyOwnerTrigger', () => {
  let documentTransition;
  let context;
  let stateRepositoryMock;
  let dataContract;
  let document;
  let documentTransitions;
  let otherContext;

  beforeEach(function beforeEach() {
    dataContract = getDataContractFixture();
    ([document] = getDocumentsFixture(dataContract));

    documentTransitions = {
      create: getDocumentTransitionFixture({
        create: [document],
      })[0],
      replace: getDocumentTransitionFixture({
        create: [],
        replace: [document],
      })[0],
      delete: getDocumentTransitionFixture({
        create: [],
        delete: [document],
      })[0],
    };

    stateRepositoryMock = createStateRepositoryMock(this.sinonSandbox);
    context = new DataTriggerExecutionContext(
      stateRepositoryMock,
      dataContract.getOwnerId(),
      dataContract,
    );

    otherContext = new DataTriggerExecutionContext(
      stateRepositoryMock,
      Identifier.from('5zcXZpTLWFwZjKjq3ME5KVavtZa9YUaZESVzrndehBhq'),
      dataContract,
    );
  });

  Object.values(AbstractDocumentTransition.ACTION_NAMES).forEach((actionName) => {
    it(`should fail if document transition ownerId and data contract ownerId are different (${actionName} action)`, async () => {
      documentTransition = documentTransitions[actionName];
      const result = await allowOnlyOwnerTrigger(documentTransition, otherContext);

      expect(result).to.be.an.instanceOf(DataTriggerExecutionResult);
      expect(result.getErrors()[0].message).to.equal('Only owner is allowed to execute the action');
      expect(result.isOk()).to.be.false();
    });

    it(`should pass if document transition ownerId and data contract ownerId are equal (${actionName} action)`, async () => {
      documentTransition = documentTransitions[actionName];
      const result = await allowOnlyOwnerTrigger(documentTransition, context);

      expect(result).to.be.an.instanceOf(DataTriggerExecutionResult);
      expect(result.isOk()).to.be.true();
    });
  });
});
