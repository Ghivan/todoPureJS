function Controller(){
    let controller = this;

    this.filter = 'all';
    this.order = {
        type: 'name',
        direction: 'asc'
    };
    this.model = new Model();
    this.view = new View();
    this.model.load();

    this.showTasks = function () {
        this.view.createTasksList(this.model.getData(this.order, this.filter), this.order);
        this.setListeners();
    };
    this.addNewTask = function () {
        let taskContent = document.getElementById('NewTaskContent'),
            taskPriority = document.getElementById('NewTaskPriority');

        let checker = controller.model.addTask(taskContent.value, taskPriority.value);
        if (!checker.status){
            alert(checker.error)
        }
        controller.model.save();
        controller.showTasks();
        taskContent.value = '';
    };

    this.removeTask = function () {
        controller.model.removeTask(this.parentNode.id);
        controller.view.removeTaskView(this.parentNode.id);
        controller.model.save();
        event.stopPropagation();
    };
    this.setTaskCompleteness = function () {
        if(this.classList.toggle('complete')){
            controller.model.setTaskCompleteness(this.id);
            if (controller.filter === 'incomplete') controller.view.removeTaskView(this.id);
        } else {
            controller.model.setTaskIncomplete(this.id);
            if (controller.filter === 'complete') controller.view.removeTaskView(this.id);
        }
        controller.model.save();
    };

    this.setTaskPriority = function () {
        controller.model.setTaskPriority(this.parentNode.id, this.value);
        controller.model.save();
        controller.showTasks();
        event.stopPropagation();
    };


    this.orderBy = function (type) {
        return function (e) {
            let elem = e.target;
            controller.order.type = type;
            if (elem.classList.contains('asc') || elem.classList.contains('dsc')){
                if (controller.order.direction === 'asc'){
                    elem.classList.remove('asc');
                    elem.classList.add('dsc');
                    controller.order.direction = 'dsc'
                } else {
                    elem.classList.remove('dsc');
                    elem.classList.add('asc');
                    controller.order.direction = 'asc'
                }
            } else {
                let elemsToClear = document.getElementsByClassName('asc');
                (elemsToClear.length > 0) ? elemsToClear[0].classList.remove('asc') : '';
                elemsToClear = document.getElementsByClassName('dsc');
                (elemsToClear.length > 0) ? elemsToClear[0].classList.remove('dsc') : '';
                elem.classList.add('asc');
                controller.order.direction = 'asc';
            }
            controller.showTasks();
        }
    };

    this.filterTasks = function () {
      controller.filter = this.value;
      controller.showTasks();
    };

    this.setListeners = function () {
        let removeBtns = document.getElementsByClassName('remove-task-btn'),
            tasks = document.getElementById('TasksList').getElementsByTagName('li'),
            priorities = document.getElementById('TasksList').getElementsByTagName('select');
        for (let i = 0; i < removeBtns.length; i++){
            removeBtns[i].addEventListener('click', controller.removeTask)
        }
        for (let i = 0; i < removeBtns.length; i++){
            tasks[i].addEventListener('click', controller.setTaskCompleteness)
        }
        for (let i = 0; i < removeBtns.length; i++){
            priorities[i].addEventListener('change', controller.setTaskPriority)
            priorities[i].addEventListener('click', function(){
                event.stopPropagation();
            })
        }

    };

    document.getElementById('NewTaskAddBtn').addEventListener('click', this.addNewTask);
    document.getElementById('TaskFilter').addEventListener('change', this.filterTasks);
    document.getElementsByClassName('desk-header-status')[0].addEventListener('click', controller.orderBy('completeness'));
    document.getElementsByClassName('desk-header-content')[0].addEventListener('click', controller.orderBy('name'));
    document.getElementsByClassName('desk-header-priority')[0].addEventListener('click', controller.orderBy('priority'));
}

let appController = new Controller();
appController.showTasks();