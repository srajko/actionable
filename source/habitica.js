const HabiticaApi = require('habitica');
const _ = require('lodash');

class Habitica {
  constructor(habiticaUserId, habiticaApiToken) {
    this.habitica = new HabiticaApi({
      uuid: habiticaUserId,
      token: habiticaApiToken
    });
  }

  getActionables() {
    return this.habitica.task.get()
      .then(tasks =>
        _(tasks)
          .filter((task) => task.type === 'todo' && !task.completed)
          .map((todo) => ({
            provider: 'habitica',
            id: todo.id,
            summary: todo.text,
            tags: todo.tags,
            difficulty: todo.priority
          }))
          .reverse()
          .value()
        );
  }
}

module.exports = Habitica;
