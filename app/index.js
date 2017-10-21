const {ipcRenderer} = require('electron');


// get the reference to the list
const tasksList = document.getElementById("tasksList");

// this fucntion was declared on the INPUT html tag.
ipcRenderer.on("add-new-task-ui", function(event, task) {
  // create the root element
  var outerDiv = document.createElement("div");
  outerDiv.className = "divRoot";

  // get the text from the input
  var textElement = document.createTextNode(task);
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
});

function addClickToX(element, root) {
  element.addEventListener("click", function() {
    tasksList.removeChild(root);
  })
}
