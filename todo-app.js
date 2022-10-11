(function () {
  let todoListArray = [],
    currentLocalKey = '';

  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');

    button.disabled = true;

    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';

    buttonWrapper.append(button);
    form.append(input);
    buttonWrapper.append(button);
    form.append(buttonWrapper);

    input.addEventListener('input', function () {
      if (input.value !== '') {
        button.disabled = false;
      } else {
        button.disabled = true;
      }
    });

    return {
      form,
      input,
      button,
    };
  }

  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  function createTodoItem(obj) {
    let item = document.createElement('li');
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = obj.name;

    if (obj.done) {
      item.classList.toggle('list-group-item-success');
    }

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    doneButton.addEventListener('click', function () {
      item.classList.toggle('list-group-item-success');

      for (let work of todoListArray) {
        if (work.id === obj.id) {
          work.done = work.done ? false : true;
        }
      }
      updateLocalStorage(todoListArray);
    });

    deleteButton.addEventListener('click', function () {
      if (confirm('Вы уверены?')) {
        item.remove();
        for (let i = 0; i < todoListArray.length; i++) {
          if (todoListArray[i].id === obj.id) {
            todoListArray.splice(i, 1);
          }
        }
      }
      updateLocalStorage(todoListArray);
    });

    return {
      item,
      doneButton,
      deleteButton,
    };
  }

  function getItemId(array) {
    let max = 0;

    for (let itemArray of array) {
      if (itemArray.id > max) {
        max = itemArray.id;
      }
    }

    return max + 1;
  }

  function updateLocalStorage(storageArray) {
    localStorage.setItem(currentLocalKey, JSON.stringify(storageArray));
  }

  function createTodoApp(container, title = 'Список дел', localStorageKey, defaulTodoObject = []) {
    console.log(defaulTodoObject);
    console.log(localStorageKey);
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    currentLocalKey = localStorageKey;

    let localStorageItems = localStorage.getItem(currentLocalKey);

    if (localStorageItems !== '' && localStorageItems !== null) {
      todoListArray = JSON.parse(localStorageItems);
    } else {
      todoListArray = defaulTodoObject;
      updateLocalStorage(todoListArray);
    }

    for (let todoListItem of todoListArray) {
      todoList.append(createTodoItem(todoListItem).item);
    }

    todoItemForm.form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!todoItemForm.input.value) {
        return;
      }

      let newItemObject = { id: getItemId(todoListArray), name: todoItemForm.input.value, done: false };

      let todoItem = createTodoItem(newItemObject);

      todoListArray.push(newItemObject);

      todoList.append(todoItem.item);

      todoItemForm.input.value = '';

      todoItemForm.button.disabled = true;

      updateLocalStorage(todoListArray);
    });
  }

  window.createTodoApp = createTodoApp;
})();
