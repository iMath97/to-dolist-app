// imports
import Data from "./data.js"

let data = new Data();

let Lists = data.getData();

console.log(Lists);

const subjectsDiv = document.getElementById("subjectContainer");
const subjectTitelData = document.getElementById('subject-titel-data');
const points = document.getElementById('points');

let index = 0;

let amountSubjects = Lists.length;

// subjects sidebar
function renderSidebar(){
    subjectsDiv.innerHTML = "";
    amountSubjects = Lists.length;

    if(amountSubjects > 0){
        for(let i = 0; i<amountSubjects;i++){
            // create card
            let card = document.createElement("div");
            card.classList.add("card");
            let id = "number_" + i.toString();
            card.setAttribute("id", id);

            // create card-titel
            let subject = document.createElement("p");
            subject.classList.add("card-titel");
            subject.innerText = Lists[i].subject;

            subjectsDiv.appendChild(card);
            card.appendChild(subject);
        }
    } else {
        let empty = document.createElement("p");
        empty.classList.add("empty");
        empty.innerText = "Nog geen lijsten gemaakt!";

        subjectsDiv.appendChild(empty);
    }
}

renderSidebar();

// data rendering
function renderData(index){
    points.innerHTML = "";
    amountSubjects = Lists.length;

    if(amountSubjects > 0){
        // render title
        subjectTitelData.innerText = Lists[index].subject;

        // render points
        const numberOfPoints = Lists[index].punten.length;
        let element;

        for(let i = 0; i<numberOfPoints; i++){
            element = document.createElement("li");
            element.innerText = Lists[index].punten[i];

            let imgDel = document.createElement("img");
            imgDel.setAttribute("src", "img/delete.svg");
            let id = "point_"+i;
            imgDel.setAttribute("id", id);
            imgDel.classList.add("delete");

            element.appendChild(imgDel);
            points.appendChild(element);
        }
    } else {
        subjectTitelData.innerText = "";
    }
}

// standard first list rendering
renderData(index);

// new subject
const inputForm = document.getElementById('inputForm');
inputForm.addEventListener('submit', (e) => {
    e.preventDefault();
});

const newPoint = document.getElementById('newPoint');
const newSub = document.getElementById('newSub');

// add point
newPoint.addEventListener("click", () => {
    // get input
    const input = document.getElementById('input').value;

    if(input != null && input != ""){
        Lists[index].punten.push(input);
        document.getElementById('input').value = "";
        renderData(index);
        writeFile();
        interactivePoints();
    }
})

// add subject
newSub.addEventListener("click", () => {
    // get input
    const input = document.getElementById('input').value;
    
    if(input != null && input != ""){
        Lists.push({subject: input, punten: []});
        document.getElementById('input').value = "";
        renderSidebar();
        writeFile();
        interactivePoints();
    }
})

// select points
function interactivePoints(){
    for(let i = 0; i<Lists.length; i++){
        let point = document.getElementById("number_"+i);
        point.addEventListener("click", () => {
            console.log("clicked on number: " + i);
            renderData(i);
            index = i;
            deletePoint();
        })
        deletePoint();
    }
}

interactivePoints();
deletePoint();

// remove points
function deletePoint(){
    if(amountSubjects > 0){
        for(let j = 0; j<Lists[index].punten.length; j++){
            let point = document.getElementById("point_"+j);
            point.addEventListener("click", () => {
                console.log("clicked on point: " + j);
                Lists[index].punten.splice(j, 1);
                renderData(index);
                writeFile();
                deletePoint();
            })
        }
    }
}

// remove subject
const delButton = document.getElementById('deleteSub');

delButton.addEventListener("click", () => {
    Lists.splice(index, 1);
    renderData(0);
    index = 0;
    renderSidebar();
    writeFile();
    interactivePoints();
});


// update json file
function writeFile(){
    let newList = JSON.stringify(Lists);
    data.writeData(newList);
}