class PersonObject 
{
    constructor(name) 
    {
        this.name = name;
        this.connections = new Set();
        this.restrictions = new Set();
    }
}

const PEOPLE_BUTTON_LIST = "peopleList";
const PERSON_NAME = "personName";
const CONNECTIONS_TABLE = "connectionsTable";
const RESTRICTIONS_TABLE = "restrictionsTable";
const NO_PERSON = "No People Created";

const peopleMap = new Map();

function initialize()
{
    addPerson(new PersonObject("Hayden"));
    addPerson(new PersonObject("Maggie"));
    addPerson(new PersonObject("John"));
    addPerson(new PersonObject("Gary"));
    addPerson(new PersonObject("Lynn"));
    console.log(peopleMap.values());
}

function addNewPerson()
{
    let newPerson = new PersonObject(window.prompt("Enter name:", ""));
    addPerson(newPerson);
}

function addPerson(newPerson)
{
    let peopleButtonList = document.getElementById(PEOPLE_BUTTON_LIST);
    for (const [personName, person] of peopleMap.entries())
    {
        newPerson.connections.add(personName);
    }
    addPersonToAll(newPerson);

    peopleMap.set(newPerson.name, newPerson);

    let newPersonButton = document.createElement("button");
    newPersonButton.id = newPerson.name;
    newPersonButton.classList.add("button");
    newPersonButton.textContent = newPerson.name;
    newPersonButton.addEventListener("click", openPage);

    peopleButtonList.appendChild(newPersonButton);
    openPersonPage(newPerson);
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

    let movePersonButton = document.createElement("button");
    movePersonButton.classList.add("button");
    movePersonButton.textContent = "Remove";

    if (table.id === RESTRICTIONS_TABLE)
        movePersonButton.addEventListener("click", moveToConnections);
    else
        movePersonButton.addEventListener("click", moveToRestrictions);

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
            clearPage(NO_PERSON);
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
}
