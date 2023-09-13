class Task {
    constructor (folderName, name, priority, due, notes) {
        this.name = name;
        this.priority = priority;
        this.due = due;
        this.notes = notes;
        this.status = false;
        this.folder = folderName;
    }
    toggleStatus = () => {
        this.status = (this.status === true) ? false : true;
    }
    editDetails = (parent, name, priority, due, notes) => {
        if (this.status === true) {
            return "You may not edit a completed task.";
        } else if (!(parent.tasks.some(task => task.name === name && task !== this))) {
            this.name = name;
            this.priority = priority;
            this.due = due;
            this.notes = notes;
        } else if ("folder" in parent) {
            return "A task with this name already exists in this project.";
        } else return "A task with this name already exists in the current folder.";
    }
}

class Project {
    constructor (folderName, name, priority, due, notes) {
        this.name = name;
        this.priority = priority;
        this.due = due;
        this.notes = notes;
        this.status = false;
        this.folder = folderName;
        this.tasks = [];
    }
    toggleStatus = () => {
        const complete = this.tasks.every(task => task.status === true);
        if (complete && this.status === false) {
            this.status = true;
        } else if (this.status === true) {
            this.status = false;
        } else return "This project contains incomplete tasks and may not be checked off.";
    }
    editDetails = (folder, name, priority, due, notes) => {
        if (this.status === true) {
            return "You may not edit a completed project.";
        } else if (!(folder.projects.some(project => project.name === name && project !== this))) {
            this.name = name;
            this.priority = priority;
            this.due = due;
            this.notes = notes;
        } else return "A project with this name already exists in the current folder.";
    }
    addTask = (folderName, name, priority, due, notes) => {
        if (!(this.tasks.some(task => task.name === name))) {
            this.tasks.push(new Task(folderName, name, priority, due, notes));
        } else return "A task with this name already exists in the current project.";
    }
    removeTask = (task) => {
        const index = this.tasks.findIndex(child => child === task);
        if (index === -1) {
            return "This task does not exist in the current project.";
        }
        this.tasks.splice(index, 1);
    }
}

const Folder = class {
    constructor (folderName) {
        this.folderName = folderName;
        this.tasks = [];
        this.projects = [];
    }
    addTask = (name, priority, due, notes) => {
        if (!(this.tasks.some(task => task.name === name))) {
            const task = new Task(this.folderName, name, priority, due, notes);
            this.tasks.push(task);
            if (this.folderName !== "Inbox") inbox.tasks.push(task);
        } else return "A task with this name already exists in the current folder.";
    }
    removeTask = (task) => {
        const index = this.tasks.findIndex(child => child === task);
        if (index === -1) {
            return "This task does not exist in the current folder.";
        } else if (this.folderName === "Inbox") {
            const folderName = task.folder;
            const originalFolder = folders.find(folder => folder.folderName === folderName);
            const taskIndex = originalFolder.tasks.findIndex(child => child === task);
            if (originalFolder.folderName !== "Inbox") originalFolder.tasks.splice(taskIndex, 1);
            this.tasks.splice(index, 1);
        } else {
            const InboxIndex = inbox.tasks.findIndex(child => child === task);
            inbox.tasks.splice(InboxIndex, 1);
            this.tasks.splice(index, 1);
        }
    }
    addProject = (name, priority, due, notes) => {
        if (!(this.projects.some(project => project.name === name))) {
            const project = new Project(this.folderName, name, priority, due, notes);
            this.projects.push(project);
            if (this.folderName !== "Inbox") inbox.projects.push(project);
        } else return "A Project with this name already exists in the folder.";
    }
    removeProject = (project) => {
        const index = this.projects.findIndex(child => child === project);
        if (index === -1) {
            return "This project does not exist in the current folder.";
        } else if (this.folderName === "Inbox") {
            const folderName = project.folder;
            const originalFolder = folders.find(folder => folder.folderName === folderName);
            const projectIndex = originalFolder.projects.findIndex(child => child === project);
            if (originalFolder.folderName !== "Inbox") originalFolder.projects.splice(projectIndex, 1);
            this.projects.splice(index, 1);
        } else {
            const InboxIndex = inbox.projects.findIndex(child => child === project);
            inbox.projects.splice(InboxIndex, 1);
            this.projects.splice(index, 1);
        }
    }
}

const folders = [new Folder("Inbox"), new Folder("Work"), new Folder("Personal")];
const [inbox, work, personal] = folders;   

personal.addProject("Project", "High", "12 March", "Notes");
personal.addProject("Another Project", "High", "12 March", "Notes");
personal.projects[0].addTask("Personal","Task", "Low", "2 January", "Notes");
personal.projects[0].addTask("Personal", "Another Task", "Low", "2 January", "Notes");
work.addTask("Task", "Low", "2 January", "Notes");
personal.addTask("Another Task", "Low", "2 January", "Notes");

const getFolders = () => {   
    return folders;
}

export {getFolders};






