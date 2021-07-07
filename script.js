'use strict';
/* All VARIABLES WITH "$" AT THE BEGINNING ARE HTMLElements*/

const eleID = ID => document.getElementById(ID);

const $addNewTask = eleID('addNewTask'),
    $cover = eleID('cover'),
    $spinner = eleID('spinner'),
    $pendingTasks = eleID('pending'),
    $finishedTasks = eleID('finished'),
    $taskName = eleID('taskName'),
    $form = eleID('form'),
    $addTask = eleID('addTask'),
    $tasks = eleID('tasks');

let tasks = [];
/* when window get load will do this */
document.addEventListener('DOMContentLoaded', () => {
    $cover.classList.add('hidden');
    $cover.addEventListener('click', hideCover);
    $spinner.remove();
    setTimeout(() => $form.classList.remove('none'), 500);
});
/*create new Element, append them and return them*/
const newNode = ({ HTMLTag = 'div', $parent, txtContent = '', classes = [] }) => {
    const $node = document.createElement(HTMLTag);
    $node.textContent = txtContent;
    /* ADD CLASS IF IT IS DEFINED */
    if (classes.length !== 0)
        classes.forEach((E) => $node.classList.add(E));
    /* APPEND THE NODE IN THE PARENT NODE (PARAMETER)*/
    $parent.appendChild($node);
    return $node;
}

$tasks.addEventListener('dragstart', (e) => e.dataTransfer.setData('text/plain', e.target.dataset.index));

$tasks.addEventListener('dragover', (e) => {
    e.preventDefault();
    if (e.target === $finishedTasks || e.target === $pendingTasks)
        e.target.classList.add('target');
});

$tasks.addEventListener('dragleave', (e) => e.target.classList.remove('target'));

$tasks.addEventListener('drop', (e) => {
    e.preventDefault();
    e.target.classList.remove('target');
    const index = parseInt(e.dataTransfer.getData('text'));
    tasks[index].isFinished = (e.target === $finishedTasks) ? true : false;
    updateTasks();
});

/* Measure the length of the text */
$taskName.addEventListener('input', function () {
    (this.value.length >= 4 && this.value.length <= 25) ?
        $addNewTask.removeAttribute('disabled') : $addNewTask.setAttribute('disabled', '');
});
function hideCover(e) {
    if (e.target === $cover)
        this.classList.add('hidden');
}
const showCover = () => $cover.classList.remove('hidden');
/* Render tasks */
const tasksRenderer = () => {
    const [pendingTasksFragment, finishedTasksFragment] = [document.createDocumentFragment(), document.createDocumentFragment()];

    tasks.forEach((E) => {
        const isFinished = E.isFinished;
        const $card = newNode({ $parent: (isFinished) ? finishedTasksFragment : pendingTasksFragment, classes: ['card'] });
        $card.setAttribute('draggable', true);
        $card.dataset.index = E.index;

        newNode({ HTMLTag: 'p', $parent: $card, txtContent: E.name });
        newNode({ HTMLTag: 'button', $parent: $card, txtContent: 'x', classes: ['remove','button'] });
        newNode({ HTMLTag: 'button', $parent: $card, txtContent: (isFinished) ? '←' : '✔', classes: ['finish','button'] });
    });
    $pendingTasks.textContent = null;
    $finishedTasks.textContent = null;

    $pendingTasks.append(pendingTasksFragment);
    $finishedTasks.append(finishedTasksFragment);
}
const createTasks = (name) => {
    return {
        index: tasks.length,
        name: name,
        isFinished: false
    }
}
/*update Tasks*/
const updateTasks = () => {
    tasksRenderer();
    (tasks.length >= 1) ? localStorage.setItem('tasks', JSON.stringify(tasks)) : localStorage.removeItem('tasks');
}

function changeTaskStatus(index) {
    const $card = this.parentElement;
    tasks[index].isFinished = (tasks[index].isFinished) ? false : true;
    updateTasks();
}
/* remove the task from the array */
const removeElement = (element) => tasks.filter((E) => E.name !== element);

$form.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskName = $taskName.value.trim();

    const isNew = tasks.filter((E) => E.name === taskName).length === 0;
    const isValid = (taskName.length > 4) ? true : false;

    if (isNew && isValid) {
        $addNewTask.setAttribute('disabled', '');
        $cover.dispatchEvent(new Event('click'));
        tasks.push(createTasks(taskName));
        updateTasks();
    } else
    alert('You already added this task');
    $taskName.value = '';
});

$addTask.addEventListener('click', showCover);

[$finishedTasks, $pendingTasks].forEach((E) => {
    E.addEventListener('click', (e) => {
        const $E = e.target;
        if ($E.parentElement.classList.contains('card')) {
            const index = parseInt($E.parentElement.dataset.index);
            const taskText = $E.parentElement.firstElementChild.textContent;

            if ($E.classList.contains('remove')) {
                $E.parentElement.remove();
                tasks = removeElement(taskText);
                updateTasks();
            } else if ($E.classList.contains('finish'))
                changeTaskStatus.call($E, index);
        }
    })
});
/* update tasks if it was saved in the localStorage */
if (localStorage.tasks) {
    tasks = JSON.parse(localStorage.tasks);
    updateTasks();
}
