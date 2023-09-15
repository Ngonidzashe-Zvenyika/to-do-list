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
        saveToStorage();
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
                saveToStorage();
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
        saveToStorage();
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
                saveToStorage();
                break;
            default:
                return "A project with this name already exists in the current folder.";
        }
    }
    addTask = (folderName, name, priority, due, notes) => {
        if (!(this.tasks.some(task => task.name === name))) {
            this.tasks.push(new Task(folderName, name, priority, due, notes));
            this.sortTasks();
            saveToStorage();
        } else return "A task with this name already exists in the current project.";
    }
    removeTask = (task) => {
        const index = this.tasks.findIndex(child => child === task);
        if (index === -1) {
            return "This task does not exist in the current project.";
        }
        this.tasks.splice(index, 1);
        saveToStorage();
    }
    sortTasks = () => {
        this.tasks.sort((a, b) => (isAfter(parseISO(a.due), parseISO(b.due))) ?  1 : -1 );
        saveToStorage();
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
            saveToStorage();
        } else return "A task with this name already exists in the current folder.";
    }
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
        this.tasks.splice(index, 1);
        saveToStorage();
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
            saveToStorage();
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
        saveToStorage();
    }
    sortTasks = () => {
        this.tasks.sort((a, b) => (isAfter(parseISO(a.due), parseISO(b.due))) ?  1 : -1 );
        saveToStorage();
    }
    sortProjects = () => {
        this.projects.sort((a, b) => (isAfter(parseISO(a.due), parseISO(b.due))) ?  1 : -1 );
        saveToStorage();
    }
}

const restoreTaskFunctions = (taskReference) => {
    const taskFunctions = {
        "toggleStatus" : () => {
            taskReference.status = (taskReference.status === true) ? false : true;
            saveToStorage();
        },
        "editDetails" : (parent, name, priority, due, notes) => {
            switch (true) {
                case (taskReference.status === true):
                    return "You may not edit a completed task.";
                case (!(parent.tasks.some(task => task.name === name && task !== taskReference))):
                    taskReference.name = name;
                    taskReference.priority = priority;
                    taskReference.due = due;
                    taskReference.notes = notes;
                    parent.sortTasks();
                    if (!("folder" in parent) && parent.folderName !== "Inbox") {
                        inbox.sortTasks();
                    } else if (parent.folderName === "Inbox" && taskReference.folder !== "Inbox") {
                        const taskFolder = folders.find(folder => folder.folderName === taskReference.folder);
                        taskFolder.sortTasks();
                    } 
                    saveToStorage();
                    break;
                case ("folder" in parent):
                    return "A task with this name already exists in this project.";
                default:
                    return "A task with this name already exists in the current folder.";
            }
        }
    }
    Object.assign(taskReference, taskFunctions);
}

const restoreProjectFunctions = (projectReference) => {
    const projectFunctions = {
        "toggleStatus" : () => {
            const complete = projectReference.tasks.every(task => task.status === true);
            if (complete && projectReference.status === false) {
                projectReference.status = true;
            } else if (projectReference.status === true) {
                projectReference.status = false;
            } else return "This project contains incomplete tasks and may not be checked off.";
            saveToStorage();
        },
        "editDetails" : (folder, name, priority, due, notes) => {
            switch (true) {
                case (projectReference.status === true):
                    return "You may not edit a completed project.";
                case (!(folder.projects.some(project => project.name === name && project !== projectReference))):
                    projectReference.name = name;
                    projectReference.priority = priority;
                    projectReference.due = due;
                    projectReference.notes = notes;
                    folder.sortProjects();
                    if (folder.folderName !== "Inbox") {
                        inbox.sortProjects();
                    } else if (folder.folderName === "Inbox" && projectReference.folder !== "Inbox") {
                        const projectFolder = folders.find(folder => folder.folderName === projectReference.folder);
                        projectFolder.sortProjects();
                    } 
                    saveToStorage();
                    break;
                default:
                    return "A project with this name already exists in the current folder.";
            }
        },
        "addTask" : (folderName, name, priority, due, notes) => {
            if (!(projectReference.tasks.some(task => task.name === name))) {
                projectReference.tasks.push(new Task(folderName, name, priority, due, notes));
                projectReference.sortTasks();
                saveToStorage();
            } else return "A task with projectReference name already exists in the current project.";
        },
        "removeTask" : (task) => {
            const index = projectReference.tasks.findIndex(child => child === task);
            if (index === -1) {
                return "This task does not exist in the current project.";
            }
            projectReference.tasks.splice(index, 1);
            saveToStorage();
        },
        "sortTasks" : () => {
            projectReference.tasks.sort((a, b) => (isAfter(parseISO(a.due), parseISO(b.due))) ?  1 : -1 );
            saveToStorage();
        }
    }
    Object.assign(projectReference, projectFunctions);
}

const restoreFolderFunctions = (folderReference) => {
    const folderFunctions = {
        "addTask" : (name, priority, due, notes) => {
            if (!(folderReference.tasks.some(task => task.name === name))) {
                const task = new Task(folderReference.folderName, name, priority, due, notes);
                folderReference.tasks.push(task);
                folderReference.sortTasks();
                if (folderReference.folderName !== "Inbox") {
                    inbox.tasks.push(task);
                    inbox.sortTasks()
                }
                saveToStorage();
            } else return "A task with this name already exists in the current folder.";
        },
        "removeTask" : (task) => {
            const index = folderReference.tasks.findIndex(child => child === task);
            if (index === -1) {
                return "This task does not exist in the current folder.";
            } else if (folderReference.folderName === "Inbox" && task.folder !== "Inbox") {
                const taskFolder = folders.find(folder => folder.folderName === task.folder);
                const taskIndex = taskFolder.tasks.findIndex(child => child === task);
                taskFolder.tasks.splice(taskIndex, 1);
            } else {
                const InboxIndex = inbox.tasks.findIndex(child => child === task);
                inbox.tasks.splice(InboxIndex, 1);
            }
            folderReference.tasks.splice(index, 1);
            saveToStorage();
        },
        "addProject" : (name, priority, due, notes) => {
            if (!(folderReference.projects.some(project => project.name === name))) {
                const project = new Project(folderReference.folderName, name, priority, due, notes);
                folderReference.projects.push(project);
                folderReference.sortProjects();
                if (folderReference.folderName !== "Inbox") {
                    inbox.projects.push(project);
                    inbox.sortProjects();
                }
                saveToStorage();
            } else return "A Project with this name already exists in the folder.";
        },
        "removeProject" : (project) => {
            const index = folderReference.projects.findIndex(child => child === project);
            if (index === -1) {
                return "This project does not exist in the current folder.";
            } else if (folderReference.folderName === "Inbox" && project.folder !== "Inbox") {
                const projectFolder = folders.find(folder => folder.folderName === project.folder);
                const projectIndex = projectFolder.projects.findIndex(child => child === project);
                projectFolder.projects.splice(projectIndex, 1);
            } else {
                const InboxIndex = inbox.projects.findIndex(child => child === project);
                inbox.projects.splice(InboxIndex, 1);
            }
            folderReference.projects.splice(index, 1);
            saveToStorage();
        },
        "sortTasks" : () => {
            folderReference.tasks.sort((a, b) => (isAfter(parseISO(a.due), parseISO(b.due))) ?  1 : -1 );
            saveToStorage();
        },
        "sortProjects" : () => {
            folderReference.projects.sort((a, b) => (isAfter(parseISO(a.due), parseISO(b.due))) ?  1 : -1 );
            saveToStorage();
        }
    }
    Object.assign(folderReference, folderFunctions);
}

let folders = [new Folder("Inbox"), new Folder("Work"), new Folder("Personal")];
let [inbox] = folders;   

const saveToStorage = () => {
    if ("localStorage" in window) localStorage.setItem("folders", JSON.stringify(folders));
}  

const getFolders = () => {
    if ("localStorage" in window) {
        if ("folders" in localStorage) {
            const storage = JSON.parse(localStorage["folders"]);
            storage.forEach(folder => {
                restoreFolderFunctions(folder);
                folder.tasks.forEach(task => restoreTaskFunctions(task));
                folder.projects.forEach(project => {
                    restoreProjectFunctions(project);
                    project.tasks.forEach(task => restoreTaskFunctions(task));
                });
    
            });
            folders = storage;
            [inbox] = folders;
            inbox.tasks.forEach((task, index) => {
                if (task.folder !== "Inbox") {
                    const taskFolder = folders.find(folder => folder.folderName === task.folder);
                    const child = taskFolder.tasks.find(child => child.name === task.name);
                    inbox.tasks.splice(index, 1, child);
                }
            })
            inbox.projects.forEach((project, index) => {
                if (project.folder !== "Inbox") {
                    const projectFolder = folders.find(folder => folder.folderName === project.folder);
                    const child = projectFolder.projects.find(child => child.name === project.name);
                    inbox.projects.splice(index, 1, child);
                }
            })
        } 
    }
    return folders;
}

export {getFolders};