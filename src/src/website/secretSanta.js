function addNewPerson()
{
    peopleList = document.getElementById("peopleList");
    newButton = document.createElement("button");
    newButton.classList.add("button");
    newButton.textContent = "Person4";
    peopleList.appendChild(newButton);
}