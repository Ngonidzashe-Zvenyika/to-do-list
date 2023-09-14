import {isAfter, parseISO} from 'date-fns';

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
        switch (true) {
            case (this.status === true):
                return "You may not edit a completed task.";
            case (!(parent.tasks.some(task => task.name === name && task !== this))):
                this.name = name;
                this.priority = priority;
                this.due = due;
                this.notes = notes;
                parent.sortTasks();
                if (!("folder" in parent) && parent.folderName !== "Inbox") {
                    inbox.sortTasks();
                } else if (parent.folderName === "Inbox" && this.folder !== "Inbox") {
                    const taskFolder = folders.find(folder => folder.folderName === this.folder);
                    taskFolder.sortTasks();
                } 
                break;
            case ("folder" in parent):
                return "A task with this name already exists in this project.";
            default:
                return "A task with this name already exists in the current folder.";
        }
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
        switch (true) {
            case (this.status === true):
                return "You may not edit a completed project.";
            case (!(folder.projects.some(project => project.name === name && project !== this))):
                this.name = name;
                this.priority = priority;
                this.due = due;
                this.notes = notes;
                folder.sortProjects();
                if (folder.folderName !== "Inbox") {
                    inbox.sortProjects();
                } else if (folder.folderName === "Inbox" && this.folder !== "Inbox") {
                    const projectFolder = folders.find(folder => folder.folderName === this.folder);
                    projectFolder.sortProjects();
                } 
                break;
            default:
                return "A project with this name already exists in the current folder.";
        }
    }
    addTask = (folderName, name, priority, due, notes) => {
        if (!(this.tasks.some(task => task.name === name))) {
            this.tasks.push(new Task(folderName, name, priority, due, notes));
            this.sortTasks();
        } else return "A task with this name already exists in the current project.";
    }
    removeTask = (task) => {
        const index = this.tasks.findIndex(child => child === task);
        if (index === -1) {
            return "This task does not exist in the current project.";
        }
        this.tasks.splice(index, 1);
    }
    sortTasks = () => {
        this.tasks.sort((a, b) => (isAfter(parseISO(a.due), parseISO(b.due))) ?  1 : -1 );
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
            this.sortTasks();
            if (this.folderName !== "Inbox") {
                inbox.tasks.push(task);
                inbox.sortTasks()
            }
        } else return "A task with this name already exists in the current folder.";    }
    removeTask = (task) => {
        const index = this.tasks.findIndex(child => child === task);
        if (index === -1) {
            return "This task does not exist in the current folder.";
        } else if (this.folderName === "Inbox" && task.folder !== "Inbox") {
            const taskFolder = folders.find(folder => folder.folderName === task.folder);
            const taskIndex = taskFolder.tasks.findIndex(child => child === task);
            taskFolder.tasks.splice(taskIndex, 1);
        } else {
            const InboxIndex = inbox.tasks.findIndex(child => child === task);
            inbox.tasks.splice(InboxIndex, 1);
        }
        this.tasks.splice(index, 1)
    }
    addProject = (name, priority, due, notes) => {
        if (!(this.projects.some(project => project.name === name))) {
            const project = new Project(this.folderName, name, priority, due, notes);
            this.projects.push(project);
            this.sortProjects();
            if (this.folderName !== "Inbox") {
                inbox.projects.push(project);
                inbox.sortProjects();
            }
        } else return "A Project with this name already exists in the folder.";
    }
    removeProject = (project) => {
        const index = this.projects.findIndex(child => child === project);
        if (index === -1) {
            return "This project does not exist in the current folder.";
        } else if (this.folderName === "Inbox" && project.folder !== "Inbox") {
            const projectFolder = folders.find(folder => folder.folderName === project.folder);
            const projectIndex = projectFolder.projects.findIndex(child => child === project);
            projectFolder.projects.splice(projectIndex, 1);
        } else {
            const InboxIndex = inbox.projects.findIndex(child => child === project);
            inbox.projects.splice(InboxIndex, 1);
        }
        this.projects.splice(index, 1);
    }
    sortTasks = () => {
        this.tasks.sort((a, b) => (isAfter(parseISO(a.due), parseISO(b.due))) ?  1 : -1 );
    }
    sortProjects = () => {
        this.projects.sort((a, b) => (isAfter(parseISO(a.due), parseISO(b.due))) ?  1 : -1 );
    }
}

const folders = [new Folder("Inbox"), new Folder("Work"), new Folder("Personal")];
const [inbox, work, personal] = folders;   

personal.addProject("10", "High", "2023-07-10", "Notes");
personal.addProject("9", "High", "2023-07-09", "Notes");
personal.addProject("8", "High", "2023-07-08", "Notes");
personal.addProject("7", "High", "2023-07-07", "Notes");
personal.addProject("1 year later", "High", "2024-07-01", "Notes");
personal.addProject("Another Project", "High", "2023-07-09", "Notes");
personal.projects[0].addTask("Personal","Task", "Low", "2023-07-05", "Notes");
personal.projects[0].addTask("Personal", "Another Task", "Low", "2023-07-05", "Notes");
personal.addTask("Task", "Low", "2023-07-05", "Notes");
personal.addTask("Another Tsk", "Low", "2023-07-01", "Notes");
personal.addTask("Another sk", "Low", "2033-06-02", "Notes")
personal.addTask("Another Task", "Low", "2023-07-02", "Notes");
personal.addTask("Another sk", "Low", "2033-06-02", "Notes");
inbox.sortProjects()
inbox.sortTasks()

const getFolders = () => {   
    return folders;
}

export {getFolders};






