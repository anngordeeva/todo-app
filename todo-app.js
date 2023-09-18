(function() {

  // создаем заголовок
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  // создаем форму и возвращаем объект
  function createTodoItemForm() {
    const form = document.createElement('form');
    const input = document.createElement('input');
    const buttonWrapper = document.createElement('div');
    const button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.textContent = 'Добавить дело';
    button.disabled = true;

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    // делаем кнопку неактивной при пустой строке
    input.addEventListener('input', function() {
      if (input.value !== '') {
        button.disabled = false;
      } else  button.disabled = true;
    })
    
    return {
      form,
      input,
      button,
    };
  }
  // создаем массив для списка
  let listArr = [],
      listName = '';

  // создаем список
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  // создаем элемент списка
  function createTodoItem(object) {
    const item = document.createElement('li');
    const buttonGroup = document.createElement('div');
    const doneButton = document.createElement('button');
    const deliteButton = document.createElement('button');
  
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = object.name;
  
    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deliteButton.classList.add('btn', 'btn-danger');
    deliteButton.textContent = 'Удалить';

    if (object.done == true) item.classList.add('list-group-item-success');

    doneButton.addEventListener('click', function() {
      item.classList.toggle('list-group-item-success');

      for (const listItem of listArr) {
        if (listItem.id == object.id) listItem.done = !listItem.done
      }
      // сохраняем список при изменении
      saveList(listArr, listName)
    });

    deliteButton.addEventListener('click', function() {
      if (confirm('Вы уверенны?')) {
        item.remove();

      for (let i = 0; i < listArr.length; i++) {
        if (listArr[i].id == object.id) listArr.splice([i], 1)
        }
      // сохраняем список при удалении
        saveList(listArr, listName)
      }
    });
  
    buttonGroup.append(doneButton);
    buttonGroup.append(deliteButton);
    item.append(buttonGroup);
  
    return {
      item,
      doneButton,
      deliteButton,
    }
  }

  // функция для генерации id
  function getNewId(arr) {
    let maxId = 0;
    for (const i of arr) {
      if(i.id > maxId) maxId = i.id;
    }
    return maxId + 1;
  }

  // функция для сохранения
  function saveList(arr, keyName) {
    localStorage.setItem(keyName, JSON.stringify(arr));
  }

  // создаем приложение
  function createTodoApp(container, title = 'Список дел', keyName) {

    listName = keyName;

    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    // получаем данные из хранилища
    let localData = localStorage.getItem(listName);
    // проверяем на пустоту и преобразовываем строку в массив
    if (localData !== null && localData !== '') listArr = JSON.parse(localData);

    // создаем список из массива
    for (const itemList of listArr) {
      let todoItem = createTodoItem(itemList);
      // добавляем список
      todoList.append(todoItem.item);
    }

    todoItemForm.form.addEventListener('submit', function(e) {
      e.preventDefault();

      if (!todoItemForm.input.value) {
        return;
      }

      // создаем объект из добавленных элементов списка 
      let newItem = {
        id: getNewId(listArr),
        name: todoItemForm.input.value,
        done: false,
      }

      let todoItem = createTodoItem(newItem);

      listArr.push(newItem);

      // сохраняем список при добавлении
      saveList(listArr, listName);

      todoList.append(todoItem.item);
      todoItemForm.button.disabled = true;

      todoItemForm.input.value = '';
    });
  }
  window.createTodoApp = createTodoApp;
})();
