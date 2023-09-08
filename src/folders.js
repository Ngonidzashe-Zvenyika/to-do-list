class Task {
    constructor (folderName, taskName, priority, due, notes) {
        this.name = taskName;
        this.priority = priority;
        this.due = due;
        this.notes = notes;
        this.status = false;
        this.folder = folderName;
    }
    toggleTaskStatus = () => {
        this.status = (this.status === true) ? false : true;
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
    editTask = (taskName, priority, due, notes, status) => {
        const index = this.tasks.findIndex(task => task.name === taskName);
        if (index === -1) {
            console.log("Task not found");
            return;
        }
        console.log(this.tasks[index]);
        if (priority) this.tasks[index].priority = priority;
        if (due) this.tasks[index].due = due;
        if (notes) this.tasks[index].notes = notes;
        if (status) (this.tasks[index].status) = (this.tasks[index].status) === false ? true : false;
    }
}

export default class Folder {
    constructor (folderName) {
        this.folderName = folderName;
        this.folderTasks = [];
        this.folderProjects = [];
    }
    addFolderTask = (taskName, priority, due, notes) => {
        if (!(this.folderTasks.some(task => task.name === taskName))) {
            this.folderTasks.push(new Task(this.folderName, taskName, priority, due, notes));
        } else console.log("task exists in folder");
    }
    addProject = (projectName, priority, due, notes) => {
        if (!(this.folderProjects.some(project => project.name === projectName))) {
            this.folderProjects.push(new Project(this.folderName, projectName, priority, due, notes));
        } else console.log("project exists in folder");
    }
    addProjectTask = (projectName, taskName, priority, due, notes) => {
        const project = this.folderProjects.find(project => project.name === projectName);
        if (project === undefined) {
            console.log("project doesnt exist in folder");
        } else project.addTask(this.folderName, taskName, priority, due, notes);
    }
    removeFolderTask = (taskName) => {
        const index = this.folderTasks.findIndex(task => task.name === taskName);
        if (index === -1) {
            console.log("Task not found");
            return;
        }
        this.folderTasks.splice(index, 1);
    }
    removeProject = (projectName) => {
        const index = this.folderProjects.findIndex(project => project.name === projectName);
        if (index === -1) {
            console.log("Project not found");
            return;
        }
        this.folderProjects.splice(index, 1);
    }
    removeProjectTask = (projectName, taskName) => {
        const index = this.folderProjects.findIndex(project => project.name === projectName);
        if (index === -1) {
            console.log("Project not found");
            return;
        }
        this.folderProjects[index].removeTask(taskName);
    }
    editFolderTask = (taskName, priority, due, notes, status) => {
        const index = this.folderTasks.findIndex(task => task.name === taskName);
        if (index === -1) {
            console.log("Task not found");
            return;
        }
        console.log(this.folderTasks[index]);
        if (priority) this.folderTasks[index].priority = priority;
        if (due) this.folderTasks[index].due = due;
        if (notes) this.folderTasks[index].notes = notes;
        if (status) (this.folderTasks[index].status) = (this.folderTasks[index].status) === false ? true : false;
    }
    editProject = (projectName, priority, due, notes, status) => {
        const index = this.folderProjects.findIndex(project => project.name === projectName);
        if (index === -1) {
            console.log("Project not found");
            return;
        }
        console.log(this.folderProjects[index]);
        if (priority) this.folderProjects[index].priority = priority;
        if (due) this.folderProjects[index].due = due;
        if (notes) this.folderProjects[index].notes = notes;
        if (status) (this.folderProjects[index].status) = (this.folderProjects[index].status) === false ? true : false;
    }
    editProjectTask = (projectName, taskName, priority, due, notes, status) => {
        const index = this.folderProjects.findIndex(project => project.name === projectName);
        if (index === -1) {
            console.log("Project not found");
            return;
        }
        this.folderProjects[index].editTask(taskName, priority, due, notes, status);
    }
}

