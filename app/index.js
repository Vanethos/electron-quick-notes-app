// get the reference to thje text input field
const taskInputField = document.getElementById("addTask");
// get the reference to the list
const tasksList = document.getElementById("tasksList");

// this fucntion was declared on the INPUT html tag.
function addNewTask(e) {
  // this will hear for the enter key to be pressed
  if(e.keyCode === 13){
    e.preventDefault();
    var outerDiv = document.createElement("div");
    var textDiv = document.createElement("div");
    var xDiv = document.createElement("div");
    outerDiv.appendChild(textDiv);
    outerDiv.appendChild(xDiv);

    //styling each div
    textDiv.style.border = "thick solid #0000FF";
    xDiv.style.border = "thick solid #0000FF";

    textDiv.appendChild(document.createTextNode(taskInputField.value));
    xDiv.appendChild(document.createTextNode("X"))

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
