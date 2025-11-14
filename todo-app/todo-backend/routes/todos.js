const express = require('express');
const { Todo } = require('../mongo')
const redis = require('../redis');
const router = express.Router();

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

router.get('/statistics', async (_, res) => {
  const added_todos = await redis.getAsync("added_todos");
  if (!added_todos) {
    const all_todos = await Todo.find({});
    const new_added_todos = all_todos.length
    await redis.setAsync('added_todos', new_added_todos);
    res.json({ added_todos: new_added_todos });
  }
  res.json({ added_todos });
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  
  const added_todos = await redis.getAsync("added_todos");
  await redis.setAsync('added_todos', String(Number(added_todos) + 1));

  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  const todo = await Todo.find(req.todo);
  res.send(todo); // Implement this
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const todo = await req.todo.updateOne(req.body);
  res.send(todo); // Implement this
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
