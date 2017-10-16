const {ipcRenderer} = require('electron');

// get the reference to thje text input field
const taskInputField = document.getElementById("addTask");
// get the reference to the list
const tasksList = document.getElementById("tasksList");

// this fucntion was declared on the INPUT html tag.
function addNewTask(e) {
  // this will hear for the enter key to be pressed
  if(e.keyCode === 13){
    e.preventDefault();
    // create the root element
    var outerDiv = document.createElement("div");
    outerDiv.className = "divRoot";

    // get the text from the input
    var textElement = document.createTextNode(taskInputField.value);
    textElement.className = "textDiv";

    // create a span to put the span element inside it
    var span = document.createElement("span");
    span.className = "textSpan"
    span.appendChild(textElement);


    // create the element for the closing icon
    var xDiv = document.createElement("div");
    xDiv.className = "divCloseCircle";

    outerDiv.appendChild(xDiv);
    outerDiv.appendChild(span);

    // create a new li element
    var li = document.createElement("li");
    li.className="tasks";
    // add the texty to the nerwly created li element
    li.appendChild(outerDiv);
    tasksList.appendChild(li);

    addClickToX(xDiv, li);

    taskInputField.value="";
  }
}

function addClickToX(element, root) {
  element.addEventListener("click", function() {
    tasksList.removeChild(root);
  })
}
