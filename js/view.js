function View(){
    this.tasksContainer = document.getElementById('TasksList');
    this.createTasksList = function (tasks, order) {
        this.tasksContainer.innerHTML = '';
        for (let i=0; i < tasks.length; i++){
            this.tasksContainer.appendChild(this.createTaskView(tasks[i]))
        }
    };
    this.createTaskView = function (task) {
        const priorities = ['low','normal','high'];
        let container = document.createElement('li'),
            priorityBlock = document.createElement('select'),
            taskContentContainer = document.createElement('span'),
            removeBtn = document.createElement('span');
        taskContentContainer.textContent = task.task;
        taskContentContainer.classList.add('task-content');
        container.appendChild(taskContentContainer);
        container.id = task.id;
        for (let i = 0; i < priorities.length; i++){
            let option = document.createElement('option');
            option.textContent = priorities[i];
            if (task.priority === priorities[i]){
                option.setAttribute('selected', true)
            }
            priorityBlock.appendChild(option)
        }
        container.appendChild(priorityBlock);
        removeBtn.textContent = 'x';
        removeBtn.classList.add('remove-task-btn');
        container.appendChild(removeBtn);
        if (task.status === 'complete'){
            container.classList.add('complete')
        }
        return container;
    };

    this.removeTaskView = function (id) {
        this.tasksContainer.removeChild(document.getElementById(id));
    }
}
