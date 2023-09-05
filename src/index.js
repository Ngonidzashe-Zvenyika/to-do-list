import "./style.css";
import Folder from "./folders.js"
import {renderApplication} from "./render.js";

const folders = [new Folder("Personal"), new Folder("Work")];
const [personal, work] = folders;

renderApplication(folders);