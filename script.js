// SISTEMA DE GESTIÓN DE TAREAS - CRUD COMPLETO
// Autores: Karol Nicolle Torres Fuentes, Juan Sebastian Patiño Hernandez
// Fecha: 17-02-2026
// Institución: SENA - Técnico en Programación de Software
// Descripción: Implementación completa de CRUD (Create, Read, Update, Delete) con API RESTful

// 1. CONFIGURACIÓN DE LA API
// Definimos la URL base del servidor JSON que está corriendo en el puerto 3000
const API_URL = 'http://localhost:3000';

// 2. SELECCIÓN DE ELEMENTOS DEL DOM
// Seleccionamos el formulario de búsqueda de usuario por su ID
const searchUserForm = document.getElementById('searchUserForm');
// Seleccionamos el input donde el usuario ingresará el número de documento
const documentNumberInput = document.getElementById('documentNumber');

// Seleccionamos la sección donde se mostrarán los datos del usuario encontrado
const userDataSection = document.getElementById('userDataSection');
// Seleccionamos los spans donde mostraremos ID, nombre y email del usuario
const userIdSpan = document.getElementById('userId');
const userNameSpan = document.getElementById('userName');
const userEmailSpan = document.getElementById('userEmail');

// Seleccionamos la sección del formulario para crear tareas
const createTaskSection = document.getElementById('createTaskSection');
// Seleccionamos el formulario completo de creación de tareas
const createTaskForm = document.getElementById('createTaskForm');
// Seleccionamos cada campo del formulario de creación
const taskTitleInput = document.getElementById('taskTitle');
const taskDescriptionInput = document.getElementById('taskDescription');
const taskStatusSelect = document.getElementById('taskStatus');

// Seleccionamos la sección del formulario para editar tareas
const editTaskSection = document.getElementById('editTaskSection');
// Seleccionamos el formulario completo de edición de tareas
const editTaskForm = document.getElementById('editTaskForm');
// Seleccionamos el campo oculto que guardará el ID de la tarea a editar
const editTaskIdInput = document.getElementById('editTaskId');
// Seleccionamos cada campo del formulario de edición
const editTaskTitleInput = document.getElementById('editTaskTitle');
const editTaskDescriptionInput = document.getElementById('editTaskDescription');
const editTaskStatusSelect = document.getElementById('editTaskStatus');
// Seleccionamos el botón de cancelar edición
const cancelEditBtn = document.getElementById('cancelEdit');

// Seleccionamos la sección donde se mostrará la lista de tareas
const tasksListSection = document.getElementById('tasksListSection');
// Seleccionamos el tbody de la tabla donde insertaremos las filas de tareas dinámicamente
const tasksTableBody = document.getElementById('tasksTableBody');

// Seleccionamos el elemento div donde mostraremos mensajes de éxito o error
const messageDiv = document.getElementById('message');

// 3. VARIABLES GLOBALES DE ESTADO
// Variable que almacenará los datos del usuario actualmente seleccionado
let currentUser = null;
// Array que almacenará todas las tareas del usuario actual
let currentTasks = [];
// Array acumulado con tareas de todos los usuarios consultados (no se borra al cambiar usuario)
let allTasks = [];

// 4. FUNCIONES DE UTILIDAD PARA MENSAJES
// Función para mostrar mensajes de éxito al usuario
// Parámetro: text - El texto del mensaje a mostrar
function showSuccessMessage(text) {
    // Asignamos el texto del mensaje al div
    messageDiv.textContent = text;
    // Removemos la clase 'error' si existiera
    messageDiv.classList.remove('error');
    // Agregamos la clase 'success' para aplicar estilos de éxito
    messageDiv.classList.add('success');
    // Hacemos visible el mensaje cambiando el display
    messageDiv.style.display = 'block';
    // Configuramos un temporizador para ocultar el mensaje después de 3 segundos
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

// Función para mostrar mensajes de error al usuario
// Parámetro: text - El texto del mensaje de error a mostrar
function showErrorMessage(text) {
    // Asignamos el texto del error al div
    messageDiv.textContent = text;
    // Removemos la clase 'success' si existiera
    messageDiv.classList.remove('success');
    // Agregamos la clase 'error' para aplicar estilos de error
    messageDiv.classList.add('error');
    // Hacemos visible el mensaje cambiando el display
    messageDiv.style.display = 'block';
    // Configuramos un temporizador para ocultar el mensaje después de 5 segundos (más tiempo para errores)
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

// 5. FUNCIONES DE BÚSQUEDA DE USUARIO
// Función asíncrona para buscar un usuario por su documento en la API
// Parámetro: documento - Número de documento del usuario a buscar
// Retorna: Objeto con los datos del usuario o null si no se encuentra
async function searchUserByDocument(documento) {
    try {
        // Construimos la URL completa para hacer la petición GET a /users
        const url = `${API_URL}/users`;
        // Realizamos la petición HTTP GET usando fetch
        // await pausa la ejecución hasta que la promesa se resuelva
        const response = await fetch(url);
        
        // Verificamos si la respuesta fue exitosa (código 200-299)
        if (!response.ok) {
            // Si hay error, lanzamos una excepción con el mensaje
            throw new Error('Error al consultar usuarios');
        }
        
        // Convertimos la respuesta JSON a un array de JavaScript
        const users = await response.json();
        
        // Buscamos el usuario cuyo documento coincida con el buscado
        // Convertimos ambos a string para comparar correctamente
        const user = users.find(u => u.documento.toString() === documento.toString());
        
        // Retornamos el usuario encontrado o null si no existe
        return user || null;
        
    } catch (error) {
        // Si ocurre cualquier error (red, servidor, etc.) lo mostramos en consola
        console.error('Error en búsqueda de usuario:', error);
        // Mostramos mensaje de error al usuario
        showErrorMessage('Error al buscar usuario. Verifica que el servidor esté corriendo.');
        // Retornamos null para indicar que falló la búsqueda
        return null;
    }
}

// Función para mostrar los datos del usuario en la interfaz
// Parámetro: user - Objeto con los datos del usuario (documento, nombre, correo)
function displayUserData(user) {
    // Insertamos el documento del usuario en el span correspondiente
    userIdSpan.textContent = user.documento;
    // Insertamos el nombre del usuario en el span correspondiente
    userNameSpan.textContent = user.nombre;
    // Insertamos el correo del usuario en el span correspondiente
    userEmailSpan.textContent = user.correo;
    
    // Hacemos visible la sección de datos del usuario
    userDataSection.style.display = 'block';
    // Hacemos visible la sección del formulario de creación de tareas
    createTaskSection.style.display = 'block';
}

// Función para ocultar los datos del usuario y resetear la interfaz
function hideUserData() {
    // Ocultamos la sección de datos del usuario
    userDataSection.style.display = 'none';
    // Ocultamos la sección del formulario de creación de tareas
    createTaskSection.style.display = 'none';
    // Ocultamos la sección del formulario de edición de tareas
    editTaskSection.style.display = 'none';
    // Ocultamos la lista de tareas
    tasksListSection.style.display = 'none';
    
    // Limpiamos los valores de los spans
    userIdSpan.textContent = '';
    userNameSpan.textContent = '';
    userEmailSpan.textContent = '';
}

// 6. FUNCIONES CRUD PARA TAREAS
// Función asíncrona para obtener todas las tareas de un usuario específico (READ)
// Parámetro: userDocumento - Documento del usuario cuyas tareas queremos obtener
// Retorna: Array con las tareas del usuario
async function getUserTasks(userDocumento) {
    try {
        // Construimos la URL para obtener todas las tareas con filtro por usuario
        const url = `${API_URL}/tasks?userDocumento=${userDocumento}`;
        // Realizamos la petición GET
        const response = await fetch(url);
        
        // Verificamos si la respuesta fue exitosa
        if (!response.ok) {
            throw new Error('Error al obtener tareas');
        }
        
        // Convertimos la respuesta JSON a un array de tareas
        const tasks = await response.json();
        // Retornamos el array de tareas
        return tasks;
        
    } catch (error) {
        // Capturamos y mostramos cualquier error
        console.error('Error al obtener tareas:', error);
        showErrorMessage('Error al cargar las tareas');
        // Retornamos array vacío en caso de error
        return [];
    }
}

// Función asíncrona para crear una nueva tarea en la API (CREATE)
// Parámetro: taskData - Objeto con los datos de la tarea a crear
// Retorna: Objeto con la tarea creada (incluyendo su ID generado) o null si falla
async function createTask(taskData) {
    try {
        // Construimos la URL para el endpoint de tareas
        const url = `${API_URL}/tasks`;
        
        // Configuramos las opciones de la petición POST
        const options = {
            method: 'POST', // Método HTTP para crear recursos
            headers: {
                'Content-Type': 'application/json' // Indicamos que enviamos JSON
            },
            body: JSON.stringify(taskData) // Convertimos el objeto a string JSON
        };
        
        // Realizamos la petición POST con las opciones configuradas
        const response = await fetch(url, options);
        
        // Verificamos si la creación fue exitosa
        if (!response.ok) {
            throw new Error('Error al crear tarea');
        }
        
        // Convertimos la respuesta a objeto JavaScript
        // El servidor retorna la tarea creada con su ID asignado
        const createdTask = await response.json();
        
        // Retornamos la tarea creada
        return createdTask;
        
    } catch (error) {
        // Capturamos y mostramos el error
        console.error('Error al crear tarea:', error);
        showErrorMessage('Error al registrar la tarea');
        // Retornamos null para indicar fallo
        return null;
    }
}

// Función asíncrona para actualizar una tarea existente (UPDATE)
// Parámetros: taskId - ID de la tarea a actualizar
//             taskData - Objeto con los nuevos datos de la tarea
// Retorna: Objeto con la tarea actualizada o null si falla
async function updateTask(taskId, taskData) {
    try {
        // Construimos la URL incluyendo el ID de la tarea específica
        const url = `${API_URL}/tasks/${taskId}`;
        
        // Configuramos las opciones de la petición PUT
        const options = {
            method: 'PUT', // PUT actualiza el recurso completo
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData) // Convertimos los datos a JSON
        };
        
        // Realizamos la petición PUT
        const response = await fetch(url, options);
        
        // Verificamos si la actualización fue exitosa
        if (!response.ok) {
            throw new Error('Error al actualizar tarea');
        }
        
        // Obtenemos la tarea actualizada desde la respuesta
        const updatedTask = await response.json();
        
        // Retornamos la tarea actualizada
        return updatedTask;
        
    } catch (error) {
        // Capturamos y mostramos el error
        console.error('Error al actualizar tarea:', error);
        showErrorMessage('Error al actualizar la tarea');
        // Retornamos null para indicar fallo
        return null;
    }
}

// Función asíncrona para eliminar una tarea (DELETE)
// Parámetro: taskId - ID de la tarea a eliminar
// Retorna: true si se eliminó correctamente, false si falló
async function deleteTask(taskId) {
    try {
        // Construimos la URL incluyendo el ID de la tarea a eliminar
        const url = `${API_URL}/tasks/${taskId}`;
        
        // Configuramos las opciones de la petición DELETE
        const options = {
            method: 'DELETE' // DELETE elimina el recurso
        };
        
        // Realizamos la petición DELETE
        const response = await fetch(url, options);
        
        // Verificamos si la eliminación fue exitosa
        if (!response.ok) {
            throw new Error('Error al eliminar tarea');
        }
        
        // Retornamos true para indicar éxito
        return true;
        
    } catch (error) {
        // Capturamos y mostramos el error
        console.error('Error al eliminar tarea:', error);
        showErrorMessage('Error al eliminar la tarea');
        // Retornamos false para indicar fallo
        return false;
    }
}

// 7. FUNCIONES DE MANIPULACIÓN DEL DOM PARA TAREAS
// Función para mostrar todas las tareas en la tabla del DOM
// Parámetro: tasks - Array de tareas a mostrar
function displayTasks(tasks) {
    // Limpiamos el contenido actual del tbody (eliminamos filas anteriores)
    tasksTableBody.innerHTML = '';
    
    // Verificamos si hay tareas para mostrar
    if (tasks.length === 0) {
        // Si no hay tareas, mostramos un mensaje en la tabla
        const emptyRow = document.createElement('tr');
        const emptyCell = document.createElement('td');
        // Configuramos la celda para que ocupe todas las columnas
        emptyCell.colSpan = 6;
        // Centramos el texto
        emptyCell.style.textAlign = 'center';
        // Asignamos el mensaje
        emptyCell.textContent = 'No hay tareas registradas para este usuario';
        // Agregamos la celda a la fila
        emptyRow.appendChild(emptyCell);
        // Agregamos la fila al tbody
        tasksTableBody.appendChild(emptyRow);
    } else {
        // Si hay tareas, recorremos el array y creamos una fila por cada tarea
        tasks.forEach((task, index) => {
            // Creamos el elemento TR (fila de tabla)
            const row = document.createElement('tr');
            
            // Creamos la celda del número de tarea (índice + 1)
            const numberCell = document.createElement('td');
            numberCell.textContent = index + 1;
            row.appendChild(numberCell);
            
            // Creamos la celda del título de la tarea
            const titleCell = document.createElement('td');
            titleCell.textContent = task.title;
            row.appendChild(titleCell);
            
            // Creamos la celda de la descripción de la tarea
            const descriptionCell = document.createElement('td');
            descriptionCell.textContent = task.description;
            row.appendChild(descriptionCell);
            
            // Creamos la celda del estado de la tarea
            const statusCell = document.createElement('td');
            statusCell.textContent = task.status;
            row.appendChild(statusCell);
            
            // Creamos la celda del nombre del usuario
            const userCell = document.createElement('td');
            userCell.textContent = task.userName;
            row.appendChild(userCell);
            
            // Creamos la celda de acciones (botones editar y eliminar)
            const actionsCell = document.createElement('td');
            
            // Creamos el botón de editar
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Editar';
            editBtn.className = 'btn-edit';
            // Agregamos evento click que llamará a la función de edición con el ID de la tarea
            editBtn.onclick = () => startEditTask(task.id);
            
            // Creamos el botón de eliminar
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Eliminar';
            deleteBtn.className = 'btn-delete';
            // Agregamos evento click que llamará a la función de confirmación de eliminación
            deleteBtn.onclick = () => confirmDeleteTask(task.id);
            
            // Agregamos ambos botones a la celda de acciones
            actionsCell.appendChild(editBtn);
            actionsCell.appendChild(deleteBtn);
            
            // Agregamos la celda de acciones a la fila
            row.appendChild(actionsCell);
            
            // Agregamos la fila completa al tbody de la tabla
            tasksTableBody.appendChild(row);
        });
    }
    
    // Hacemos visible la sección de tareas
    tasksListSection.style.display = 'block';
}

// Función para preparar el formulario de edición con los datos de una tarea
// Parámetro: taskId - ID de la tarea a editar
async function startEditTask(taskId) {
    // Buscamos la tarea en el acumulado global usando el ID
    const task = allTasks.find(t => String(t.id) === String(taskId));
    
    // Verificamos que la tarea existe
    if (!task) {
        showErrorMessage('Tarea no encontrada');
        return;
    }
    
    // Guardamos el ID de la tarea en el campo oculto del formulario de edición
    editTaskIdInput.value = task.id;
    // Cargamos el título actual en el input de edición
    editTaskTitleInput.value = task.title;
    // Cargamos la descripción actual en el textarea de edición
    editTaskDescriptionInput.value = task.description;
    // Seleccionamos el estado actual en el select de edición
    editTaskStatusSelect.value = task.status;
    
    // Ocultamos el formulario de creación de tareas
    createTaskSection.style.display = 'none';
    // Mostramos el formulario de edición de tareas
    editTaskSection.style.display = 'block';
    
    // Hacemos scroll hasta el formulario de edición para que el usuario lo vea
    editTaskSection.scrollIntoView({ behavior: 'smooth' });
}

// Función para cancelar la edición y volver al formulario de creación
function cancelEdit() {
    // Limpiamos todos los campos del formulario de edición
    editTaskIdInput.value = '';
    editTaskTitleInput.value = '';
    editTaskDescriptionInput.value = '';
    editTaskStatusSelect.value = '';
    
    // Ocultamos el formulario de edición
    editTaskSection.style.display = 'none';
    // Mostramos el formulario de creación
    createTaskSection.style.display = 'block';
}

// Función para confirmar la eliminación de una tarea
// Parámetro: taskId - ID de la tarea a eliminar
async function confirmDeleteTask(taskId) {
    // Buscamos la tarea en el acumulado global para obtener su título
    const task = allTasks.find(t => t.id === taskId);
    
    // Verificamos que la tarea existe
    if (!task) {
        showErrorMessage('Tarea no encontrada');
        return;
    }
    
    // Mostramos un diálogo de confirmación al usuario
    // confirm() retorna true si el usuario acepta, false si cancela
    const confirmDelete = confirm(`¿Estás seguro de que deseas eliminar la tarea "${task.title}"?`);
    
    // Si el usuario confirmó la eliminación
    if (confirmDelete) {
        // Llamamos a la función que hace la petición DELETE a la API
        const success = await deleteTask(taskId);
        
        // Si la eliminación fue exitosa
        if (success) {
            // Eliminamos la tarea del acumulado global
            allTasks = allTasks.filter(t => t.id !== taskId);
            // Eliminamos la tarea del array del usuario actual
            currentTasks = currentTasks.filter(t => t.id !== taskId);
            // Mostramos mensaje de éxito
            showSuccessMessage('Tarea eliminada exitosamente');
            // Refrescamos la tabla con el acumulado actualizado
            displayTasks(allTasks);
        }
    }
}

// Función para cargar y mostrar las tareas del usuario actual
async function loadUserTasks() {
    // Verificamos que hay un usuario seleccionado
    if (!currentUser) {
        return;
    }
    
    // Obtenemos las tareas del usuario desde la API
    const tasks = await getUserTasks(currentUser.documento);
    // Guardamos las tareas del usuario actual en la variable global
    currentTasks = tasks;

    // Agregamos las tareas nuevas al acumulado global, evitando duplicados por ID
    tasks.forEach(task => {
        if (!allTasks.find(t => t.id === task.id)) {
            allTasks.push(task);
        }
    });

    // Mostramos todas las tareas acumuladas en la tabla
    displayTasks(allTasks);
}

// 8. MANEJADORES DE EVENTOS (EVENT HANDLERS)
// Manejador del evento submit del formulario de búsqueda de usuario
// Parámetro: e - Objeto del evento
async function handleSearchUser(e) {
    // Prevenimos el comportamiento por defecto del formulario (recargar la página)
    e.preventDefault();
    
    // Obtenemos el valor del input de documento y eliminamos espacios
    const documento = documentNumberInput.value.trim();
    
    // Validamos que el documento no esté vacío
    if (!documento) {
        showErrorMessage('Por favor ingresa un número de documento');
        return;
    }
    
    // Buscamos el usuario en la API
    const user = await searchUserByDocument(documento);
    
    // Verificamos si se encontró el usuario
    if (user) {
        // Guardamos el usuario en la variable global
        currentUser = user;
        // Mostramos los datos del usuario en la interfaz
        displayUserData(user);
        // Cargamos las tareas del usuario
        await loadUserTasks();
        // Mostramos mensaje de éxito
        showSuccessMessage(`Usuario ${user.nombre} encontrado`);
        // Limpiamos el campo de búsqueda
        documentNumberInput.value = '';
    } else {
        // Si no se encontró, mostramos error y limpiamos la interfaz
        showErrorMessage('Usuario no encontrado. Verifica el documento ingresado.');
        currentUser = null;
        hideUserData();
    }
}

// Manejador del evento submit del formulario de creación de tareas
// Parámetro: e - Objeto del evento
async function handleCreateTask(e) {
    // Prevenimos el comportamiento por defecto del formulario
    e.preventDefault();
    
    // Verificamos que hay un usuario seleccionado
    if (!currentUser) {
        showErrorMessage('Primero debes buscar un usuario');
        return;
    }
    
    // Obtenemos y limpiamos los valores de los campos
    const title = taskTitleInput.value.trim();
    const description = taskDescriptionInput.value.trim();
    const status = taskStatusSelect.value;
    
    // Validamos que todos los campos estén completos
    if (!title || !description || !status) {
        showErrorMessage('Por favor completa todos los campos de la tarea');
        return;
    }
    
    // Construimos el objeto con los datos de la nueva tarea
    const taskData = {
        title: title,
        description: description,
        status: status,
        userDocumento: currentUser.documento,
        userName: currentUser.nombre
    };
    
    // Enviamos la tarea a la API para crearla
    const createdTask = await createTask(taskData);
    
    // Verificamos si la creación fue exitosa
    if (createdTask) {
        // Agregamos la nueva tarea al acumulado global y al array del usuario actual
        allTasks.push(createdTask);
        currentTasks.push(createdTask);
        // Mostramos mensaje de éxito
        showSuccessMessage('Tarea registrada exitosamente');
        // Limpiamos el formulario
        createTaskForm.reset();
        // Refrescamos la tabla con el acumulado actualizado
        displayTasks(allTasks);
    }
}

// Manejador del evento submit del formulario de edición de tareas
// Parámetro: e - Objeto del evento
async function handleEditTask(e) {
    // Prevenimos el comportamiento por defecto del formulario
    e.preventDefault();
    
    // Obtenemos el ID de la tarea a editar desde el campo oculto
    const taskId = parseInt(editTaskIdInput.value);
    // Obtenemos y limpiamos los valores de los campos
    const title = editTaskTitleInput.value.trim();
    const description = editTaskDescriptionInput.value.trim();
    const status = editTaskStatusSelect.value;
    
    // Validamos que todos los campos estén completos
    if (!title || !description || !status) {
        showErrorMessage('Por favor completa todos los campos de la tarea');
        return;
    }
    
    // Construimos el objeto con los datos actualizados de la tarea
    const taskData = {
        title: title,
        description: description,
        status: status,
        userDocumento: currentUser.documento,
        userName: currentUser.nombre
    };
    
    // Enviamos la actualización a la API
    const updatedTask = await updateTask(taskId, taskData);
    
    // Verificamos si la actualización fue exitosa
    if (updatedTask) {
        // Actualizamos la tarea en el acumulado global
        const idx = allTasks.findIndex(t => String(t.id) === String(taskId));
        if (idx !== -1) allTasks[idx] = updatedTask;
        // Actualizamos también en el array del usuario actual
        const idx2 = currentTasks.findIndex(t => String(t.id) === String(taskId));
        if (idx2 !== -1) currentTasks[idx2] = updatedTask;
        // Mostramos mensaje de éxito
        showSuccessMessage('Tarea actualizada exitosamente');
        // Cancelamos el modo de edición (limpia el formulario y lo oculta)
        cancelEdit();
        // Refrescamos la tabla con el acumulado actualizado
        displayTasks(allTasks);
    }
}

// 9. INICIALIZACIÓN DE LA APLICACIÓN
// Función que se ejecuta cuando el DOM está completamente cargado
function initApp() {
    // Agregamos el event listener al formulario de búsqueda de usuario
    // 'submit' se dispara cuando el usuario envía el formulario
    searchUserForm.addEventListener('submit', handleSearchUser);
    
    // Agregamos el event listener al formulario de creación de tareas
    createTaskForm.addEventListener('submit', handleCreateTask);
    
    // Agregamos el event listener al formulario de edición de tareas
    editTaskForm.addEventListener('submit', handleEditTask);
    
    // Agregamos el event listener al botón de cancelar edición
    cancelEditBtn.addEventListener('click', cancelEdit);
    
    // Mostramos mensaje en consola indicando que la app está lista
    console.log('✅ Sistema de Gestión de Tareas iniciado correctamente');
    console.log('📡 API URL:', API_URL);
    console.log('🔧 Asegúrate de que json-server esté corriendo en el puerto 3000');
}

// Esperamos a que el DOM esté completamente cargado antes de inicializar
// DOMContentLoaded se dispara cuando todo el HTML ha sido parseado
document.addEventListener('DOMContentLoaded', initApp);