const AxosoftApi = require('node-axosoft');
const _ = require('lodash');

function promisify(apiFunction, ...args) {
  return new Promise((resolve, reject) => {
    args.push((error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
    apiFunction.apply(null, args);
  });
}

class Axosoft {
  constructor(accountUrl, accessToken) {
    const axosoftApi = this.axosoftApi = new AxosoftApi(accountUrl, {
      access_token: accessToken
    });

    // get the userId from the API
    this.userIdPromise = promisify(axosoftApi.Me.get)
      .then((response) => response.data.id);
  }

  getActionables() {
    const { axosoftApi, userIdPromise } = this;

    // return items assigned to the user
    return userIdPromise
      .then((userId) => promisify(axosoftApi.Items.getItems, { assigned_to_id: userId }))
      .then((response) => {
        const items = response.data;
        const actionables = _(items)
          .map((item) => ({
            provider: 'axosoft',
            id: `${item.item_type}-${item.id}`,
            summary: item.name,
            tags: { [item.release.id]: true },
            workflow_step: item.workflow_step.id
          }))
          .value();

        return actionables;
      });
  }
}

module.exports = Axosoft;
