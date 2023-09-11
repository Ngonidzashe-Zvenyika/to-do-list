import "./style.css";
import Folder from "./folders.js"
import {renderApplication} from "./render.js";

const folders = [new Folder("Personal"), new Folder("Work")];
const [personal] = folders;
personal.addProject("Project", "High", "12 March", "Notes");
personal.addProject("Another Project", "High", "12 March", "Notes");
personal.folderProjects[0].addTask("")
personal.folderProjects[0].addTask("Task", "")
personal.folderProjects[0].addTask("Psdsfdfs", "Low")
personal.addTask("Task", "Low", "2 January", "Notes");
personal.addTask("Another Task", "Low", "2 January", "Notes");
renderApplication(folders);