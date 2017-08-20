function Model(){
    const priorities = ['low','normal','high'];
    const statuses = ['incomplete','complete'];
    this.tasks = [];

    this.save = function(){
        localStorage.setItem('myTasks', JSON.stringify(this.tasks));
    };
    this.load = function () {
        let tasks = JSON.parse(localStorage.getItem('myTasks'));
        if (tasks !== null && Array.isArray(tasks)){
            this.tasks = tasks;
        }
    };
    this.addTask = function (task, priority) {
        if (typeof task !== 'string'){
            console.error('Task should be a string!');
            return {
                status: false,
                error: 'Task should be a string'
            };
        }
        if (task.trim() === '') {
            return {
                status: false,
                error: 'Task shouldn\'t be empty'
            }
        }
        if (this.checkTaskExistance(task)){
            return {
                status: false,
                error: 'Task already exists'
            };
        }
        if (priorities.indexOf(priority) === -1){
            priority = 'normal';
        }

        let id = this.getNewTaskId();
        this.tasks.push({
            id: id,
            task: task,
            status: 'incomplete',
            priority: priority
        });
        return {
            status: true,
            error: ''
        };
    };
    this.checkTaskExistance = function (task) {
        for (let i = 0; i < this.tasks.length; i++){
            if (this.tasks[i].task === task.trim()) return true;
        }
        return false;
    };
    this.getNewTaskId = function () {
        let id = 0;
        for (let i = 0; i < this.tasks.length; i++){
            if (this.tasks[i].id > id){
                id = this.tasks[i].id;
            }
        }
        return (id+1);
    };

    this.removeTask = function (taskId) {
        let id = Number(taskId);
        for (let i = 0; i < this.tasks.length; i++){
            if (this.tasks[i].id === id){
                this.tasks.splice(i, 1);
                return {
                    status: true,
                    error: ''
                };
            }
        }
        return {
            status: false,
            error: 'Task doesn\'t exist'
        };
    };
    this.setTaskCompleteness = function (taskId) {
        let id = Number(taskId);
        for (let i = 0; i < this.tasks.length; i++){
            if (this.tasks[i].id === id){
                this.tasks[i].status = 'complete';
                return {
                    status: true,
                    error: ''
                };
            }
        }
        return {
            status: false,
            error: 'Task doesn\'t exist'
        };
    };
    this.setTaskIncomplete = function (taskId) {
        let id = Number(taskId);
        for (let i = 0; i < this.tasks.length; i++){
            if (this.tasks[i].id === id){
                this.tasks[i].status = 'incomplete';
                return {
                    status: true,
                    error: ''
                };
            }
        }
        return {
            status: false,
            error: 'Task doesn\'t exist'
        };
    };
    this.setTaskPriority = function (taskId, priority) {
        if (priorities.indexOf(priority) === -1){
            return {
                status: false,
                error: 'Select right priority'
            };
        }
        let id = Number(taskId);
        for (let i = 0; i < this.tasks.length; i++){
            if (this.tasks[i].id === id){
                this.tasks[i].priority = priority;
                return {
                    status: true,
                    error: ''
                };
            }
        }
        return {
            status: false,
            error: 'Task doesn\'t exist'
        };
    };

    this.getData = function (order, filter) {
        let data;
        switch (filter){
            case 'complete':
                data = this.getCompleteTasks();
                break;
            case 'incomplete':
                data = this.getIncompleteTasks();
                break;
            default:
                data = this.getAllTasks();
        }


        switch (order.type){
            case 'name':
                return this.sortByName(data, order.direction);
            case 'priority':
                return this.sortByPriority(data, order.direction);
            case 'completeness':
                return this.sortByCompleteness(data, order.direction);
        }
    };
    this.sortByName = function (tasks, direction) {
        switch (direction){
            case 'asc':
                return tasks.sort(function (a, b) {
                    return a.task.toLowerCase() > b.task.toLowerCase();
                });
            case 'dsc':
                return tasks.sort(function (a, b) {
                    return a.task.toLowerCase() < b.task.toLowerCase();
                });
            default:
                return tasks.sort(function (a, b) {
                    return a.task.toLowerCase() > b.task.toLowerCase();
                });
        }
    };

    this.sortByPriority = function (tasks, direction) {
        switch (direction){
            case 'asc':
                return tasks.sort(function (a, b) {
                    return priorities.indexOf(a.priority) > priorities.indexOf(b.priority);
                });
            case 'dsc':
                return tasks.sort(function (a, b) {
                    return priorities.indexOf(a.priority) < priorities.indexOf(b.priority);
                });
            default:
                return tasks.sort(function (a, b) {
                    return priorities.indexOf(a.priority) > priorities.indexOf(b.priority);
                });
        }
    };
    this.sortByCompleteness = function (tasks, direction) {
        switch (direction){
            case 'asc':
                return tasks.sort(function (a, b) {
                    if (statuses.indexOf(a.status) === statuses.indexOf(b.status)){
                        return a.task.toLowerCase() > b.task.toLowerCase();
                    } else {
                        return statuses.indexOf(a.status) > statuses.indexOf(b.status);
                    }
                });
            case 'dsc':
                return tasks.sort(function (a, b) {
                    if (statuses.indexOf(a.status) === statuses.indexOf(b.status)){
                        return a.task.toLowerCase() > b.task.toLowerCase();
                    } else {
                        return statuses.indexOf(a.status) < statuses.indexOf(b.status);
                    }
                });
            default:
                return tasks.sort(function (a, b) {
                    if (statuses.indexOf(a.status) === statuses.indexOf(b.status)){
                        return a.task.toLowerCase() > b.task.toLowerCase();
                    } else {
                        return statuses.indexOf(a.status) > statuses.indexOf(b.status);
                    }
                });
        }
    };

    this.getAllTasks = function () {
        return this.tasks.slice();
    };
    this.getCompleteTasks = function () {
        let tasks = [];
        for (let i = 0; i < this.tasks.length; i++){
            if (this.tasks[i].status === 'complete'){
                tasks.push(this.tasks[i])
            }
        }
        return tasks;
    };
    this.getIncompleteTasks = function () {
        let tasks = [];
        for (let i = 0; i < this.tasks.length; i++){
            if (this.tasks[i].status === 'incomplete'){
                tasks.push(this.tasks[i])
            }
        }
        return tasks;
    }
}