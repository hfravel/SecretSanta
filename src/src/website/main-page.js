class PersonObject 
{
    constructor(name) 
    {
        this.name = name;
        this.connections = new Set();
    }
}

const PEOPLE_BUTTON_LIST = 'peopleList';
const PERSON_NAME = 'personName';
const CONNECTIONS_TABLE = 'connectionsTable';
const PEOPLE_MAP_STORAGE = 'peopleMapStorage';
const OPEN_PERSON = 'openPerson';
const LAST_SAVE = 'mostRecentSave';
const NO_PERSON = 'No People Created';
const ONE_HOUR = 3600000;

let peopleMap;

function refreshPage()
{
    loadLocalStorage();
    addBackPeopleButtons();
}

function loadLocalStorage()
{
    clearStorageIfExpired();
    peopleMap = JSON.parse(localStorage.getItem(PEOPLE_MAP_STORAGE), reviver);
    if (!(peopleMap instanceof Map))
        peopleMap = new Map();
    else
    {
        let openPersonName = JSON.parse(localStorage.getItem(OPEN_PERSON));
        if (openPersonName == null)
            clearPage(NO_PERSON);
        else
            openPersonPage(peopleMap.get(openPersonName));
    }
}

function clearStorageIfExpired()
{
    lastSave = localStorage.getItem(LAST_SAVE);

    if (!!lastSave && (Date.now() - lastSave) > ONE_HOUR)
    {
        localStorage.clear();
    }
}

function saveLocalStorage(openPersonName)
{
    localStorage.setItem(PEOPLE_MAP_STORAGE, JSON.stringify(peopleMap, replacer));
    localStorage.setItem(OPEN_PERSON, JSON.stringify(openPersonName));
    localStorage.setItem(LAST_SAVE, Date.now());
}

function replacer(key, value) {
    if (value instanceof Map) 
    {
        return {
            dataType: 'Map',
            value: Array.from(value.entries()),
        };
    } 
    else if (value instanceof Set)
    {
        return {
            dataType: 'Set',
            value: Array.from(value.values()),
        };
    }
    else 
    {
        return value;
    }
}

function reviver(key, value) {
    if(typeof value === 'object' && value != null) 
    {
        if (value.dataType === 'Map') 
        {
            return new Map(value.value);
        }
        else if (value.dataType === 'Set')
        {
            return new Set(value.value);
        }
    }
    return value;
}

function addBackPeopleButtons()
{
    for (const person of peopleMap.values())
    {
        createPersonButton(person.name);
    }
}

function createPersonButton(personName)
{
    let peopleButtonList = document.getElementById(PEOPLE_BUTTON_LIST);

    let personButton = document.createElement('button');
    personButton.id = personName;
    personButton.classList.add('green-button');
    personButton.textContent = personName;
    personButton.addEventListener('click', openPage);

    peopleButtonList.appendChild(personButton);
}

function addNewPerson()
{
    let promptMessage = 'Enter name:';
    let retry = true;

    while (retry)
    {
        let personName = window.prompt(promptMessage, '');
        if (personName == null)
        {
            retry = false;
        }
        else if (personName === '')
        {
            promptMessage = 'Name cannot be empty. Hit Cancel or Enter new Name:';
        }
        else if (peopleMap.get(personName) != null)
        {
            promptMessage = 'Name already exists. Enter new Name:';
        }
        else
        {
            retry = false;
            addPerson(new PersonObject(personName));
        }
    }
}

function addPerson(newPerson)
{
    for (const [personName, person] of peopleMap.entries())
    {
        newPerson.connections.add(personName);
    }
    addPersonToAll(newPerson);

    peopleMap.set(newPerson.name, newPerson);

    createPersonButton(newPerson.name);
    openPersonPage(newPerson);

    saveLocalStorage(newPerson.name);
}

function openPage(event)
{
    let openPerson = peopleMap.get(event.target.innerHTML);
    openPersonPage(openPerson);
}

function openPersonPage(openPerson)
{
    clearPage(openPerson.name);

    for (const personName of peopleMap.keys())
    {
        if (personName !== openPerson.name)
        {
            addRowToTable(personName, openPerson.connections.has(personName) );
        }
    }

    saveLocalStorage(openPerson.name);
}

function clearPage(personName)
{
    document.getElementById(PERSON_NAME).innerHTML = personName;
    removeTableRows(CONNECTIONS_TABLE);
}

function removeTableRows(tableName)
{
    let table = document.getElementById(tableName);
    let rowCount = table.rows.length;
    
    for (let i = 1; i < rowCount; i++) 
    {
        table.deleteRow(1);
    }
}

function addRowToTable(personName, allowed)
{
    let row = document.getElementById(CONNECTIONS_TABLE).insertRow(-1);
    row.insertCell(0).innerHTML = personName;
    let secondCell = row.insertCell(1);

    addExclusionButton(secondCell, allowed);
}

function addExclusionButton(secondCell, allowed)
{
    let exclusionButton = document.createElement('button');

    exclusionButton.classList.add( allowed ? 'green-button' : 'red-button' );
    exclusionButton.textContent = allowed ? 'Included' : 'Excluded';
    exclusionButton.addEventListener('click', allowed ? setToExclude : setToInclude);

    secondCell.appendChild(exclusionButton);
}

function addPersonToAll(newPerson)
{
    for (const person of peopleMap.values())
    {
        person.connections.add(newPerson.name);
    }
}

function removePerson()
{
    let removalPersonName = document.getElementById(PERSON_NAME).innerHTML;
    if (peopleMap.delete(removalPersonName))
    {
        removePersonFromAll(removalPersonName);

        let removalPersonButton = document.getElementById(removalPersonName);
        removalPersonButton.parentNode.removeChild(removalPersonButton);

        if (peopleMap.size === 0)
        {
            clearPage(NO_PERSON);
            saveLocalStorage(null);
        }
        else
            openPersonPage(peopleMap.values().next().value);
    }
}

function removePersonFromAll(removalPersonName)
{
    for (const person of peopleMap.values())
    {
        person.connections.delete(removalPersonName);
    }
}

function setToExclude(event)
{
    let mainPerson = peopleMap.get(document.getElementById(PERSON_NAME).innerHTML);
    let tableRow = event.target.parentNode.parentNode.rowIndex;

    let connectionsTable = document.getElementById(CONNECTIONS_TABLE);

    let movingPerson = peopleMap.get(connectionsTable.rows[tableRow].cells[0].innerHTML);
//    connectionsTable.deleteRow(tableRow);
//    addRowToTable(movingPerson.name, false);
    connectionsTable.rows[tableRow].deleteCell(1);
    addExclusionButton(connectionsTable.rows[tableRow].insertCell(1), false);

    mainPerson.connections.delete(movingPerson.name);

    saveLocalStorage(mainPerson.name);
}

function setToInclude(event)
{
    let mainPerson = peopleMap.get(document.getElementById(PERSON_NAME).innerHTML);
    let tableRow = event.target.parentNode.parentNode.rowIndex;

    let connectionsTable = document.getElementById(CONNECTIONS_TABLE);

    let movingPerson = peopleMap.get(connectionsTable.rows[tableRow].cells[0].innerHTML);
//    connectionsTable.deleteRow(tableRow);
//    addRowToTable(movingPerson.name, true);
    connectionsTable.rows[tableRow].deleteCell(1);
    addExclusionButton(connectionsTable.rows[tableRow].insertCell(1), true);

    mainPerson.connections.add(movingPerson.name);

    saveLocalStorage(mainPerson.name);
}
