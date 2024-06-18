function PersonObject(name)
{
    this.name = name;
    this.connections = new Map();
    this.restrictions = new Map();
}

const PEOPLE_BUTTON_LIST = "peopleList";
const PERSON_NAME = "personName";
const CONNECTIONS_TABLE = "connectionsTable";
const RESTRICTIONS_TABLE = "restrictionsTable";

const peopleMap = new Map();

function addNewPerson()
{
    let peopleList = document.getElementById(PEOPLE_BUTTON_LIST);
    let newPerson = new PersonObject(window.prompt("Enter name:", ""));
    for (const [personName, person] of peopleMap.entries())
    {
        newPerson.connections.set(personName, person);
    }
    addPersonToAll(newPerson);

    peopleMap.set(newPerson.name, newPerson);

    let newButton = document.createElement("button");
    newButton.id = newPerson.name;
    newButton.classList.add("button");
    newButton.textContent = newPerson.name;
    newButton.addEventListener("click", openPersonPage);

    peopleList.appendChild(newButton);
    openPage(newPerson);
}

function addPersonToAll(newPerson)
{
    for (const person of peopleMap.values())
    {
        person.connections.set(newPerson.name, newPerson);
    }
}

function removePerson()
{
    let personName = document.getElementById(PERSON_NAME).innerHTML;
    peopleMap.delete(personName);
    removePersonFromAll(personName);

    let personButton = document.getElementById(personName);
    personButton.parentNode.removeChild(personButton);

    if (peopleMap.size == 0)
        emptyPage();
    else
        openPage(peopleMap.values().next().value);
}

function emptyPage()
{
    document.getElementById(PERSON_NAME).innerHTML = "No Person";
    removeTableRows(CONNECTIONS_TABLE);
    removeTableRows(RESTRICTIONS_TABLE);

}

function removePersonFromAll(removalPersonName)
{
    for (const person of peopleMap.values())
    {
        person.connections.delete(removalPersonName);
        person.restrictions.delete(removalPersonName);
    }
}

function openPersonPage(event)
{
    let openPerson = peopleMap.get(event.target.innerHTML);
    openPage(openPerson);
}

function openPage(openPerson)
{
    document.getElementById(PERSON_NAME).innerHTML = openPerson.name;
    removeTableRows(CONNECTIONS_TABLE);
    removeTableRows(RESTRICTIONS_TABLE);

    let connectionsTable = document.getElementById(CONNECTIONS_TABLE);
    for (const person of openPerson.connections.values())
    {
        addRowToTable(connectionsTable, person.name, false);
    }

    let restrictionsTable = document.getElementById(RESTRICTIONS_TABLE);
    for (const person of openPerson.restrictions.values())
    {
        addRowToTable(restrictionsTable, person.name, true);
    }
}

function addRowToTable(table, personName, isRestricted)
{
    let row = table.insertRow(-1);
    row.insertCell(0).innerHTML = personName;
    let removeCell = row.insertCell(1);

    let newButton = document.createElement("button");
    newButton.classList.add("button");
    newButton.textContent = "remove";
    if (isRestricted)
        newButton.addEventListener("click", moveToConnections);
    else
        newButton.addEventListener("click", moveToRestrictions);

    removeCell.appendChild(newButton);
}

function removeTableRows(tableName)
{
    let tableHeaderRowCount = 1;
    let table = document.getElementById(tableName);
    let rowCount = table.rows.length;
    for (let i = tableHeaderRowCount; i < rowCount; i++) {
        table.deleteRow(tableHeaderRowCount);
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
    addRowToTable(restrictionsTable, movingPerson.name, true);

    mainPerson.connections.delete(movingPerson.name);
    mainPerson.restrictions.set(movingPerson.name, movingPerson);
}

function moveToConnections()
{

}
