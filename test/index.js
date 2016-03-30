import { Axosoft, Habitica } from '../lib';
import assert from 'assert';

const {
  ACTIONABLE_AXOSOFT_URL,
  ACTIONABLE_AXOSOFT_ACCESS_TOKEN,
  ACTIONABLE_AXOSOFT_USER_ID,
  ACTIONABLE_HABITICA_USER_ID,
  ACTIONABLE_HABITICA_API_TOKEN
} = process.env;

function testGetActionables(provider) {
  return provider.getActionables()
  .then((actionables) => {
    // make sure at least one actionable was returned
    assert(actionables.length);

    const actionable = actionables[0];

    // make sure there is a summary
    assert(actionable.summary);
  });
}

describe('axosoft', () => {
  it('should get actionables', () => {
    const axosoft = new Axosoft(
      ACTIONABLE_AXOSOFT_URL,
      ACTIONABLE_AXOSOFT_ACCESS_TOKEN,
      ACTIONABLE_AXOSOFT_USER_ID
    );

    return testGetActionables(axosoft);
  });
});

describe('habitica', () => {
  it('should get actionables', () => {
    const habitica = new Habitica(
      ACTIONABLE_HABITICA_USER_ID,
      ACTIONABLE_HABITICA_API_TOKEN
    );

    return testGetActionables(habitica);
  });
});
