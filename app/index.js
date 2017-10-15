// get the reference to thje text input field
var taskInputField = document.getElementById("addTask");

// this fucntion was declared on the INPUT html tag.
function addNewTask(e) {
  // this will hear for the enter key to be pressed
  if(e.keyCode === 13){
    e.preventDefault();
    // as a debug, we will put the input field with another value
    document.getElementById("addTask").value = "Success!";
  }
}
