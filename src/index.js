import "./style.css";
import Folder from "./folders.js"
import {renderApplication} from "./render.js";

const folders = [new Folder("Personal"), new Folder("Work")];
const [personal] = folders;
personal.addProject("Project", "High", "12 March", "Notes");
personal.addProject("Another Project", "High", "12 March", "Notes");
personal.addProjectTask("Project")
personal.addProjectTask("Project", "")
personal.addProjectTask("Project", "j")
personal.addFolderTask("Task", "Low", "2 January", "Notes");
personal.addFolderTask("Another Task", "Low", "2 January", "Notes");
renderApplication(folders);