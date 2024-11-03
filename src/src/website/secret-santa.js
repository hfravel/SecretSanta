class PeoplePair
{
    constructor(giver, receiver) 
    {
        this.giver = giver;
        this.receiver = receiver;
    }
}

const peopleMapCopy = new Map();
let secretSantaPairing;

function generateSecretSantaPairings()
{
    try
    {
        copyPeopleMap();
        
        let numPeople = peopleMap.size;

        let pairingCount = 0;
        while (pairingCount < numPeople)
        {
            let matchingGroup = findMatchingGroups();
            if (matchingGroup != null)
            {
                randomlyCreatePairs(matchingGroup);
                pairingCount += matchingGroup.length;
            }
            else
            {
                pairFirstPerson();
                pairingCount++;
            }
        }
    }
    catch (error)
    {
        console.log(error);
    }

    openForm();
}

function copyPeopleMap()
{
    peopleMapCopy.clear();
    secretSantaPairing = [];

    for (const [personName, person] of peopleMap.entries())
    {
        peopleMapCopy.set(personName, copyPerson(person));
    }
}

function copyPerson(origPerson)
{
    let copiedPerson = new PersonObject(origPerson.name);

    for (const personName of origPerson.connections.values())
    {
        copiedPerson.connections.add(personName);
    }

    return copiedPerson;
}

// No arguments, just use peopleMap to find groups of people with same connections
function findMatchingGroups()
{
    let peopleWithTheSameConnections;
    let peopleCount;

    for (const person1 of peopleMapCopy.values())
    {
        peopleCount = 1;
        peopleWithTheSameConnections = [];

        for (const person2 of peopleMapCopy.values())
        {
            if (person1 !== person2 && equalSets(person1.connections, person2.connections))
            {
                if (peopleCount === person1.connections.size)
                    throw 'Cannot create Secret Santa, too few connections';

                peopleWithTheSameConnections[peopleCount] = person2;
                peopleCount++;
            }
        }

        if (peopleCount === person1.connections.size)
        {
            peopleWithTheSameConnections[0] = person1;
            return peopleWithTheSameConnections;
        }
    }

    return null;
}

function equalSets(set1, set2)
{
    if (set1 === set2)
        return true;

    if (set1.size !== set2.size)
        return false;

    for (const value of set1.values())
    {
        if (!set2.has(value))
            return false;
    }

    return true;
}

// list of people to give, use their matching connections object
function randomlyCreatePairs(givingPeople)
{
    let validConnections = givingPeople[0].connections;
    let count = givingPeople.length;

    if (count !== validConnections.size)
        throw 'Amount of Givers (' + count + ') vs Receivers (' + validConnections.size + ') does not match';

    for (const receiverName of validConnections.values())
    {
        let randomIndex = Math.floor(Math.random() * count);
        let giver = givingPeople[randomIndex];
        
        peopleMapCopy.delete(giver.name);
        secretSantaPairing[secretSantaPairing.length] = new PeoplePair(giver.name, receiverName);

        removePersonFromAllReceivingGroups(receiverName);

        count--;
        givingPeople[randomIndex] = givingPeople[count];
    }
}

// string name, remove this person from all connections
function removePersonFromAllReceivingGroups(name)
{
    for (const person of peopleMapCopy.values())
    {
        person.connections.delete(name);
    }
}

// no arguments, just use peopleMap to get the first Person
function pairFirstPerson()
{
    let giver = peopleMapCopy.values().next().value;
    peopleMapCopy.delete(giver.name);

    let receiverName = chooseRandomPerson(giver.connections);
    if (receiverName == null)
        throw 'Unable to find a receiver for ' + giver.name;
    removePersonFromAllReceivingGroups(receiverName);

    secretSantaPairing[secretSantaPairing.length] = new PeoplePair(giver.name, receiverName);
}

// connections HashMap, choose one at random to assign to mainPerson
function chooseRandomPerson(connections)
{
    let randomIndex = Math.floor(Math.random() * connections.size);
    for (const personName of connections.values())
    {
        if (randomIndex == 0)
            return personName;
        randomIndex--;
    }

    return null;

}

function openForm()
{
    resultsTable = document.getElementById('resultsTable');
    let rowCount = resultsTable.rows.length;

    for (let i = 0; i < rowCount; i++)
    {
        resultsTable.deleteRow(0);
    }

    for (const peoplePair of secretSantaPairing.values())
    {
        let row = resultsTable.insertRow();
        row.insertCell(0).innerHTML = peoplePair.giver + ' &rarr; ' + peoplePair.receiver;
    }

    document.getElementById('resultsForm').style.display = 'block';
}

function closeForm()
{
    document.getElementById('resultsForm').style.display = 'none';
}