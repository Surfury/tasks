/* All VARIABLES WITH "$" AT THE BEGINNING ARE HTMLElements*/
'use strict';
const eleID = ID => document.getElementById(ID);
(() => {
    let tasks = [], finishedTasks = [], alltasks = [...tasks,...finishedTasks];
    const $addNewTask = eleID('addNewTask'),
    $cover = eleID('cover'),
    $pendingTasks = eleID('pending'),
    $doneTasks = eleID('done'),
    $taskName = eleID('taskName');
    /*create new Element, append them and return them*/
    const newNode = (HTMLTag = 'div', $parent, txtContent = '', Class) => {
        const node = document.createElement(HTMLTag);
        if (txtContent !== undefined)
            node.textContent = txtContent;
        /* ADD CLASS IF IT IS DEFINED */
        if (Class !== undefined)
            node.classList.add(Class);
        /* APPEND THE NODE IN THE PARENT NODE (PARAMETER)*/
        $parent.append(node);
        return node;
    }
    /* when window get load will do this */
    addEventListener('load', () => {
        $cover.classList.add('hidden');
        $cover.addEventListener('click', hideCover);
        eleID('spinner').remove();
        setTimeout(() => eleID('newTask').classList.remove('none'), 500);
    });
    /* measure the length of the text */
    $taskName.addEventListener('input', function () {
        if (this.value.length >= 4 && this.value.length <= 20)
            $addNewTask.removeAttribute('disabled');
        else $addNewTask.disabled = 'disabled';
    });
    function hideCover(event) {
        if (event.target === cover)
            this.classList.add('hidden');
    }
    const showCover = () => cover.classList.remove('hidden');
    /* Render tasks */
    function tasksRenderer(arr,$parent,finished) {
        const fragment = document.createDocumentFragment();
        arr.forEach(E => {
            const card = newNode(undefined, fragment, undefined, 'card');

            newNode('p', card, E);

            const supButton = newNode('button', card, 'x', 'removeTask');
            supButton.addEventListener('click', removeTasks);

            const doneButton = (finished === true) ?
                newNode('button', card, '<-', 'finished') :
                newNode('button', card, '✔', 'finished');
            doneButton.addEventListener('click', changeTasksStatus);
        });
        $parent.innerHTML = '';
        $parent.append(fragment);
    }
    /*update Tasks*/
    const updateTasks = () => {
        alltasks = [...tasks, ...finishedTasks];
        tasksRenderer(tasks,$pendingTasks,false);

        if (tasks.length > 0)
            localStorage.setItem('tasks', tasks);
        else
            localStorage.removeItem('tasks');
    }

    const updateFinishedTasks = () => {
        alltasks = [...tasks, ...finishedTasks];
        tasksRenderer(finishedTasks,$doneTasks,true);

        if (finishedTasks.length > 0)
            localStorage.setItem('finishedTasks', finishedTasks);
        else
            localStorage.removeItem('finishedTasks');
    }

    function changeTasksStatus() {
        this.setAttribute('disabled', '');
        if (this.parentElement.parentElement === $pendingTasks) {
            finishedTasks.push(this.parentElement.firstElementChild.textContent);
            tasks = tasks.filter((E) => E !== this.parentElement.firstElementChild.textContent);
        } else {
            tasks.push(this.parentElement.firstElementChild.textContent);
            finishedTasks = finishedTasks.filter((E) => E !== this.parentElement.firstElementChild.textContent);
        }
        updateTasks();
        updateFinishedTasks();
    }
    /* remove the task from the array */
    function removeTasks() {
        const taskText = this.parentElement.firstElementChild.textContent;
        this.setAttribute('disabled', 'disabled');
        tasks = tasks.filter((E) => E !== taskText);
        finishedTasks = finishedTasks.filter((E) => E !== taskText);
        updateTasks();
        updateFinishedTasks();
    }
    $addNewTask.addEventListener('click', () => {
        if (alltasks.filter((E) => E.toLowerCase() === $taskName.value.toLowerCase()).length === 0) {
            $addNewTask.setAttribute('disabled', 'disabled');
            tasks.push($taskName.value);
            $cover.dispatchEvent(new Event('click'));
            $taskName.value = '';
            updateTasks();
        } else {
            eleID("taskName").value = '';
            alert('You already added this task');
        }
    });
    eleID('addTask').addEventListener('click', showCover);
    /* update task if it was saved in the localStorage */
    if (localStorage.getItem('tasks') !== null) {
        tasks = localStorage.getItem('tasks').split(',');
        updateTasks();
    }
    if (localStorage.getItem('finishedTasks') !== null) {
        finishedTasks = localStorage.getItem('finishedTasks').split(',');
        updateFinishedTasks();
    }
    alltasks = [...tasks, ...finishedTasks];
})();
