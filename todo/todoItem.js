const { nanoid } = require('nanoid');

function todoItem(text) {
  this.id = nanoid();
  this.text = text;
  this.isDone = false;
}

module.exports = todoItem;
