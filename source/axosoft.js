const AxosoftApi = require('node-axosoft');
const _ = require('lodash');

class Axosoft {
  constructor(accountUrl, accessToken, userId) {
    Object.assign(this, { userId });

    this.axosoftApi = new AxosoftApi(accountUrl, {
      access_token: accessToken
    });
  }

  getActionables() {
    const { axosoftApi, userId } = this;

    return new Promise((resolve, reject) => {
      axosoftApi.Items.getItems({ assigned_to_id: userId }, (error, response) => {
        if (error) {
          reject(error);
        } else {
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
          resolve(actionables);
        }
      });
    });
  }
}

module.exports = Axosoft;
