import "./style.css";
import {getFolders} from "./folders.js"
import {displayApplication} from "./render.js";

const folders = getFolders();
displayApplication(folders);
