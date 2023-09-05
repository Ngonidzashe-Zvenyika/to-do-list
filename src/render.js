export {renderApplication};

function renderApplication(folders) {
    const body = document.querySelector("body");
    body.innerHTML = "<header><h1>Taskmaster</h1></header><main><nav></nav><div id='folder-container'><div id='folder-container-header'></div></div></main><footer>Made by <a href='https://github.com/Ngonidzashe-Zvenyika'>Ngonidzashe Zvenyika</a></footer>";
    renderFolderButtons(folders);
}

function renderFolderButtons(folders) {
    folders.forEach(folder => {
        const nav = document.querySelector("nav");
        const folderButton = document.createElement("button");
        folderButton.innerText = folder.folderName;
        folderButton.addEventListener("click", () => {
            renderSelectedFolder(folder);
        })
        nav.appendChild(folderButton);
    })
}

function renderSelectedFolder(folder) {
    const NewContainerHeading = () => {
        const containerHeading = document.createElement("h2");
        containerHeading.innerText = folder.folderName;
        return containerHeading;
    }
    const NewTaskButton = () => {
        const newTaskButton = document.createElement("button");
        newTaskButton.classList.add("new-task");
        newTaskButton.innerHTML = "&#10133;";
        newTaskButton.addEventListener("click", () => {
        })
        return newTaskButton;
    }
    const appendContainerHeader = () => {
        const folderContainerHeader = document.getElementById("folder-container-header");
        folderContainerHeader.replaceChildren();
        folderContainerHeader.appendChild(NewContainerHeading());
        folderContainerHeader.appendChild(NewTaskButton());
    }
    appendContainerHeader();
}


