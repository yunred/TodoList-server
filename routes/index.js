const express = require('express');
const router = express.Router();
const todoItem = require('../todo/todoItem');
const Store = require('../store');
const todoStore = new Store();

// 할 일 불러오기
router.get('/category/:category/todo', async (req, res) => {
  const { category } = req.params;

  if (!todoStore.isValid({ res, category })) {
    return;
  }

  try {
    const todoList = todoStore.getTodoListByCategory(category);
    res.status(200).json(todoList);
  } catch (e) {
    res.status(500).json({
      message: '투두 리스트를 가져오는데 에러가 발생했습니다.',
      error: e,
    });
  }
});

// 할 일 추가
router.post('/category/:category/todo', async (req, res) => {
  const { category } = req.params;
  const { text } = req.body;

  if (!todoStore.isValid({ res, category, text })) {
    return;
  }

  if (todoStore.isDuplicatedTodo(category, text)) {
    res.status(400).json({ message: '이미 등록되어 있는 할 일입니다.' });
    return;
  }

  try {
    const newTodoItem = new todoItem(text);
    todoStore.createTodoItem(category, newTodoItem);
    res.status(200).json(newTodoItem);
  } catch (e) {
    res.status(500).json({
      message: '새로운 할 일을 추가하는데 에러가 발생했습니다.',
      error: e,
    });
  }
});

// 할 일 이름 수정
router.put('/category/:category/todo/:todoId', async (req, res) => {
  const { category, todoId } = req.params;
  const { text } = req.body;

  if (!todoStore.isValid({ res, category, todoId, text })) {
    return;
  }

  try {
    todoStore.editTodoItem(category, todoId, text);
    const editedTodo = todoStore.getBytodoId(category, todoId);
    res.status(200).json(editedTodo);
  } catch (e) {
    res.status(500).json({
      message: '할 일을 수정하는데 에러가 발생했습니다.',
      error: e,
    });
  }
});

// 할 일 완료
router.put('/category/:category/todo/:todoId/done', async (req, res) => {
  const { category, todoId } = req.params;
  const { text } = req.body;

  if (!todoStore.isValid({ res, category, todoId, text })) {
    return;
  }

  try {
    todoStore.toggleDoneTodoItem(category, todoId);
    const editedTodo = todoStore.getByTodoId(category, todoId);
    res.status(200).json(editedTodo);
  } catch (e) {
    res.status(500).json({
      message: '할 일을 완료상태로 변경 하는데 에러가 발생했습니다.',
      error: e,
    });
  }
});

// 할 일 삭제
router.delete('/category/:category/todo/:todoId', async (req, res) => {
  const { category, todoId } = req.params;
  const { text } = req.body;
  if (!todoStore.isValid({ res, category, todoId, text })) {
    return;
  }
  try {
    todoStore.deleteTodoItem(category, todoId);
    res.sendStatus(200);
  } catch (e) {
    res.status(500).json({
      message: '할 일을 삭제하는데 에러가 발생했습니다.',
      error: e,
    });
  }
});

module.exports = router;
