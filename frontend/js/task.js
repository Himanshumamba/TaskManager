document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');

    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const status = document.getElementById('status').value;

        const taskData = {
            title,
            description,
            status
        };

        try {
            const response = await fetch('http://localhost:5000/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskData)
            });

            if (!response.ok) {
                throw new Error('Failed to add task');
            }

            const newTask = await response.json();
            displayTask(newTask);
            taskForm.reset();
        } catch (error) {
            console.error('Error:', error.message);
        }
    });

    async function fetchTasks() {
        try {
            const response = await fetch('http://localhost:5000/api/tasks');
            const tasks = await response.json();
            tasks.forEach(task => displayTask(task));
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    function displayTask(task) {
        const taskItem = document.createElement('div');
        taskItem.classList.add('task');
        taskItem.dataset.taskId = task._id; // Set data attribute for task ID
        taskItem.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <p>Status: ${task.status}</p>
            <button class="delete-btn">Delete</button>
            <button class="edit-btn">Edit</button>
            <div class="update-form" style="display: none;">
                <input type="text" class="update-title" placeholder="New Title">
                <textarea class="update-description" placeholder="New Description"></textarea>
                <select class="update-status">
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                </select>
                <button class="save-btn">Save</button>
                <button class="close-btn">Close </button>

            </div>
        `;
        taskList.appendChild(taskItem);
    }

    taskList.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const taskItem = e.target.parentElement;
            const taskId = taskItem.dataset.taskId;
            deleteTask(taskId, taskItem);
        } else if (e.target.classList.contains('edit-btn')) {
            const taskItem = e.target.parentElement;
            const updateForm = taskItem.querySelector('.update-form');
            updateForm.style.display = 'block';
        } else if(e.target.classList.contains('close-btn')){
            const  closeIt  = e.target.parentElement;
            closeIt.style.display ='none';
        } else if (e.target.classList.contains('save-btn')) {
            const taskItem = e.target.parentElement.parentElement;
            const taskId = taskItem.dataset.taskId;
            const updateTitle = taskItem.querySelector('.update-title').value;
            const updateDescription = taskItem.querySelector('.update-description').value;
            const updateStatus = taskItem.querySelector('.update-status').value;

            const updateData = {
                title: updateTitle,
                description: updateDescription,
                status: updateStatus
            };

            try {
                const updatedTask = await updateTask(taskId, updateData);
                // Update task details in UI
                taskItem.querySelector('h3').textContent = updatedTask.title;
                taskItem.querySelector('p:nth-of-type(1)').textContent = updatedTask.description;
                taskItem.querySelector('p:nth-of-type(2)').textContent = `Status: ${updatedTask.status}`;
                // Hide update form
                taskItem.querySelector('.update-form').style.display = 'none';
            } catch (error) {
                console.error('Error:', error.message);
            }
        }
    });

    async function deleteTask(id, taskItem) {
        try {
            const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete task');
            }

            taskItem.remove(); // Remove the task item directly
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    async function updateTask(id, updatedData) {
        try {
            const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });
            if (!response.ok) {
                throw new Error('Failed to update task');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error.message);
            throw error;
        }
    }

    fetchTasks();
});
