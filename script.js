let tasks = [], finishedTasks = [], alltasks = [tasks, finishedTasks];
/* create new Element and append them */
const newNode = (HTMLTag = 'div', parent = eleID('pending')) => {
    let node = document.createElement(HTMLTag);
    parent.appendChild(node);
    return node;
}
const eleID = ID => document.getElementById(ID);
/* when window get load will do this */
window.addEventListener('load', () => {
    eleID('spinner').remove();
    eleID('cover').classList.add('hidden');
    eleID('cover').addEventListener('click', (e) => hideCover(e.target));
    eleID('newTask').classList.remove('none');
});
/* measure the length of the text */
eleID('taskName').addEventListener('input', (e) => {
    if (e.target.value.length >= 4 && e.target.value.length <= 20)
        eleID('addNewTask').removeAttribute('disabled');
    else eleID('addNewTask').disabled = 'disabled';
});
const hideCover = E => {
    if (E === eleID('cover')) eleID('cover').classList.add('hidden');
}
const showCover = () => eleID('cover').classList.remove('hidden');
/*update Tasks*/
const updateTasks = () => {
    eleID('pending').innerHTML = '';
    tasks.forEach(E => {
        let card = newNode();
        card.classList.add('card');

        let paragraph = newNode('p', card);
        paragraph.textContent = E;

        let supButton = newNode('button', card);
        supButton.textContent = 'x';
        supButton.classList.add('removeTask');
        supButton.addEventListener('click', (e) => removeTasks(e));

        let doneButton = newNode('button', card);
        doneButton.classList.add('done');
        doneButton.textContent = '=>';
        doneButton.addEventListener('click', (e) => changeTasksStatus(e.target));
    });
    if (finishedTasks.length > 0) {
        localStorage.setItem('finishedTasks', finishedTasks);
    } else {
        localStorage.removeItem('finishedTasks');
    }
}
const updateFinishedTasks = () => {
    eleID('done').innerHTML = '';
    finishedTasks.forEach(E => {
        let card = newNode('div', eleID('done'));
        card.classList.add('card');

        let paragraph = newNode('p', card);
        paragraph.textContent = E;

        let supButton = newNode('button', card);
        supButton.textContent = 'x';
        supButton.classList.add('removeTask');
        supButton.addEventListener('click', (e) => removeTasks(e));

        let doneButton = newNode('button', card);
        doneButton.classList.add('done');
        doneButton.textContent = '=>';
        doneButton.addEventListener('click', (e) => changeTasksStatus(e.target));
    });
    if (tasks.length > 0) {
        localStorage.setItem('tasks', tasks);
    } else {
        localStorage.removeItem('tasks');
    }
}
const changeTasksStatus = E => {
    E.disabled = 'disabled';
    if (E.parentElement.parentElement === eleID('pending')) {
        finishedTasks.push(E.parentElement.firstElementChild.textContent);
        tasks = tasks.filter((Ele) => Ele !== E.parentElement.firstElementChild.textContent);
    } else {
        tasks.push(E.parentElement.firstElementChild.textContent);
        finishedTasks = finishedTasks.filter((Ele) => Ele !== E.parentElement.firstElementChild.textContent);
    }
    updateTasks();
    updateFinishedTasks();
}
/* remove the task from the array */
const removeTasks = (e) => {
    e.target.disabled = 'disabled';
    console.log(e.target.parentElement.firstElementChild.textContent)
    tasks = tasks.filter((E) => E !== e.target.parentElement.firstElementChild.textContent);
   finishedTasks =finishedTasks.filter((E) => E !== e.target.parentElement.firstElementChild.textContent);
    updateTasks();
    updateFinishedTasks();
}
eleID("addNewTask").addEventListener('click', () => {
    if (alltasks.filter((E) => E === eleID('taskName').value).length === 0) {
        eleID('addNewTask').disabled = 'disabled';
        tasks.push(eleID('taskName').value);
        hideCover(eleID('cover'));
        eleID('taskName').value = '';
        updateTasks();
    } else {
        alert('You already added this task');
    }
});
eleID('addTask').addEventListener('click', () => showCover());
/* update task if it was saved in the localStorage */
if (localStorage.getItem('tasks') !== null) {
    tasks = localStorage.getItem('tasks').split(',');
    updateTasks();
}
if (localStorage.getItem('finishedTasks') !== null) {
    finishedTasks = localStorage.getItem('finishedTasks').split(',');
    updateFinishedTasks();
}
/* Order the tasks */
eleID('sortTasks').addEventListener('click', () => {
    eleID('sortTasks').disabled = 'disabled';
    eleID('reverseTasks').removeAttribute('disabled');
    tasks.sort();
    updateTasks();
});
/* Order the tasks */
eleID('reverseTasks').addEventListener('click', () => {
    eleID('reverseTasks').disabled = 'disabled';
    eleID('sortTasks').removeAttribute('disabled');
    tasks.reverse();
    updateTasks();
});