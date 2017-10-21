const {ipcRenderer, remote} = require('electron');


document.getElementById("addTask").focus();

function addNewTask(e) {
  console.log("the value is: " + document.getElementById("addTask").value);
  if(e.keyCode === 13) {
    var task = document.getElementById("addTask").value;
    // check if value is a string and is not empty
    if (!(task === "")) {
      ipcRenderer.send('add-new-task-main', task);
      var window = remote.getCurrentWindow();
      window.close();
    }
  }
}
