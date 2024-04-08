const express = require('express');
const router = express.Router();
const Task = require('../models/task');

router.post('/', async (req, res) => {
    try {
        const { title, description, status } = req.body;
        const task = new Task({ title, description, status });
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (error) {
        console.error('Error adding task:', error.message);
        res.status(500).send('Server error');
    }
});

// Get all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error.message);
        res.status(500).send('Server error');
    }
});

// Delete a task by ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTask = await Task.findByIdAndDelete(id);
        if (!deletedTask) {
            return res.status(404).send('Task not found');
        }
        res.json(deletedTask);
    } catch (error) {
        console.error('Error deleting task:', error.message);
        res.status(500).send('Server error');
    }
});


router.put('/:id',async (req,res)=>{

    try{
        const  {id}  = req.params;
        const { title, description, status } = req.body;
        const updatedTask = await Task.findByIdAndUpdate(id, { title, description, status }, { new: true });
        if (!updatedTask) {
            return res.status(404).send('Task not found');
        }
        res.json(updatedTask);
    }

    catch (error){
        console.log('Error  updating  tasks' ,error.message);
        res.status(500).send("Server error")
    }
})


module.exports = router;
