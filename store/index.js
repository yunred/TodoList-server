const { nanoid } = require('nanoid');

const validator = {
  isNumber(value) {
    return value && !isNaN(value);
  },
  isEmptyStr(value) {
    return value === '' || value === undefined || value === null;
  },
  isArray(value) {
    return Array.isArray(value);
  },
};

function Store() {
  this.id = nanoid();
  this.todoBoard = {
    daily: [],
    weekly: [],
    monthly: [],
    yearly: [],
  };
  this.isValid = ({ res, category = null, todoId = null, text = null }) => {
    if (
      !validator.isArray(this.todoBoard[category]) &&
      !!this.todoBoard[category]
    ) {
      res.status(404).json({ message: '존재하지 않는 카테고리 입니다.' });
      return;
    }
    if (todoId && !this.isExistTodoItem(category, todoId)) {
      res.status(404).json({ message: '존재하지 않는 할 일 입니다.' });
      return;
    }
    if (text && !this.isValidTodoText(text)) {
      res
        .status(400)
        .json({ message: '할 일은 최소 2글자 이상이어야 합니다.' });
      return;
    }

    return true;
  };
  this.isValidTodoText = text => {
    return typeof text === 'string' && text.length > 1;
  };

  this.createTodoItem = (category, todoItem) => {
    this.todoBoard[category].push(todoItem);
  };
  this.toggleDoneTodoItem = (category, todoId) => {
    const index = this.todoBoard[category].findIndex(
      item => item.id === todoId
    );
    if (this.todoBoard[category][index]) {
      this.todoBoard[category][index].isDone =
        !this.todoBoard[category][index].isDone;
    }
  };
  this.editTodoItem = (category, todoId, text) => {
    this.todoBoard[category].find(item => item.id === todoId).text = text;
  };
  this.getTodoListByCategory = category => {
    return this.todoBoard[category];
  };
  this.getByTodoId = (category, todoId) => {
    return this.todoBoard[category].find(item => item.id === todoId);
  };
  this.isDuplicatedTodo = (category, text) => {
    return !!this.todoBoard[category].find(item => item.text === text);
  };
  this.isExistTodoItem = (category, todoId) => {
    return !!this.todoBoard[category].find(todoItem => todoItem.id === todoId);
  };
  this.deleteTodoItem = (category, todoId) => {
    const todoItemIndex = this.todoBoard[category].findIndex(
      todo => todo.id === todoId
    );
    this.todoBoard[category].splice(todoItemIndex, 1);
    console.log(this.todoBoard[category]);
  };
}

module.exports = Store;
