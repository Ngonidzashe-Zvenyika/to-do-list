class Task {
    constructor (folderName, taskName, priority, due, notes) {
        this.name = taskName;
        this.priority = priority;
        this.due = due;
        this.notes = notes;
        this.status = false;
        this.folder = folderName;
    }
    toggleStatus = () => {
        this.status = (this.status === true) ? false : true;
    }
    editDetails = (name, priority, due, notes) => {
        if (name) this.name = name;
        if (priority) this.priority = priority;
        if (due) this.due = due;
        if (notes) this.notes = notes;
    }
}

class Project extends Task {
    constructor (folderName, projectName, priority, due, notes) {
        super(folderName, projectName, priority, due, notes);
        this.tasks = [];
    }
    addTask = (folderName, taskName, priority, due, notes) => {
        if (!(this.tasks.some(task => task.name === taskName))) {
            this.tasks.push(new Task(folderName, taskName, priority, due, notes));
        } else console.log("task exists in project");
    }
    removeTask = (taskName) => {
        const index = this.tasks.findIndex(task => task.name === taskName);
        if (index === -1) {
            console.log("Task not found");
            return;
        }
        this.tasks.splice(index, 1);
    }
}

export default class Folder {
    constructor (folderName) {
        this.folderName = folderName;
        this.folderTasks = [];
        this.folderProjects = [];
    }
    addTask = (taskName, priority, due, notes) => {
        if (!(this.folderTasks.some(task => task.name === taskName))) {
            this.folderTasks.push(new Task(this.folderName, taskName, priority, due, notes));
        } else console.log("task exists in folder");
    }
    removeTask = (taskName) => {
        const index = this.folderTasks.findIndex(task => task.name === taskName);
        if (index === -1) {
            console.log("Task not found");
            return;
        }
        this.folderTasks.splice(index, 1);
    }
    addProject = (projectName, priority, due, notes) => {
        if (!(this.folderProjects.some(project => project.name === projectName))) {
            this.folderProjects.push(new Project(this.folderName, projectName, priority, due, notes));
        } else console.log("project exists in folder");
    }
    removeProject = (projectName) => {
        const index = this.folderProjects.findIndex(project => project.name === projectName);
        if (index === -1) {
            console.log("Project not found");
            return;
        }
        this.folderProjects.splice(index, 1);
    }
}

