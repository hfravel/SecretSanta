class PersonObject 
{
    constructor(name) 
    {
        this.name = name;
        this.connections = new Set();
        this.restrictions = new Set();
    }
}

const PEOPLE_BUTTON_LIST = 'peopleList';
const PERSON_NAME = 'personName';
const CONNECTIONS_TABLE = 'connectionsTable';
const RESTRICTIONS_TABLE = 'restrictionsTable';
const PEOPLE_MAP_STORAGE = 'peopleMapStorage';
const OPEN_PERSON = 'openPerson';
const NO_PERSON = 'No People Created';

let peopleMap;

function refreshPage()
{
    loadLocalStorage();
    addBackPeopleButtons();
}

function loadLocalStorage()
{
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

function saveLocalStorage(openPersonName)
{
    localStorage.setItem(PEOPLE_MAP_STORAGE, JSON.stringify(peopleMap, replacer));
    localStorage.setItem(OPEN_PERSON, JSON.stringify(openPersonName));
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
    personButton.classList.add('button');
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

    let connectionsTable = document.getElementById(CONNECTIONS_TABLE);
    for (const personName of openPerson.connections.values())
    {
        addRowToTable(connectionsTable, personName);
    }

    let restrictionsTable = document.getElementById(RESTRICTIONS_TABLE);
    for (const personName of openPerson.restrictions.values())
    {
        addRowToTable(restrictionsTable, personName);
    }

    saveLocalStorage(openPerson.name);
}

function clearPage(personName)
{
    document.getElementById(PERSON_NAME).innerHTML = personName;
    removeTableRows(CONNECTIONS_TABLE);
    removeTableRows(RESTRICTIONS_TABLE);
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

function addRowToTable(table, personName)
{
    let row = table.insertRow(-1);
    row.insertCell(0).innerHTML = personName;
    let removeCell = row.insertCell(1);

    let movePersonButton = document.createElement('button');
    movePersonButton.classList.add('button');
    movePersonButton.textContent = 'Remove';

    if (table.id === RESTRICTIONS_TABLE)
        movePersonButton.addEventListener('click', moveToConnections);
    else
        movePersonButton.addEventListener('click', moveToRestrictions);

    removeCell.appendChild(movePersonButton);
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
        person.restrictions.delete(removalPersonName);
    }
}

function moveToRestrictions(event)
{
    let mainPerson = peopleMap.get(document.getElementById(PERSON_NAME).innerHTML);
    let tableRow = event.target.parentNode.parentNode.rowIndex;

    let connectionsTable = document.getElementById(CONNECTIONS_TABLE);
    let restrictionsTable = document.getElementById(RESTRICTIONS_TABLE);

    let movingPerson = peopleMap.get(connectionsTable.rows[tableRow].cells[0].innerHTML);
    connectionsTable.deleteRow(tableRow);
    addRowToTable(restrictionsTable, movingPerson.name);

    mainPerson.connections.delete(movingPerson.name);
    mainPerson.restrictions.add(movingPerson.name);

    saveLocalStorage(mainPerson.name);
}

function moveToConnections(event)
{
    let mainPerson = peopleMap.get(document.getElementById(PERSON_NAME).innerHTML);
    let tableRow = event.target.parentNode.parentNode.rowIndex;

    let connectionsTable = document.getElementById(CONNECTIONS_TABLE);
    let restrictionsTable = document.getElementById(RESTRICTIONS_TABLE);

    let movingPerson = peopleMap.get(restrictionsTable.rows[tableRow].cells[0].innerHTML);
    restrictionsTable.deleteRow(tableRow);
    addRowToTable(connectionsTable, movingPerson.name);

    mainPerson.restrictions.delete(movingPerson.name);
    mainPerson.connections.add(movingPerson.name);

    saveLocalStorage(mainPerson.name);
}
