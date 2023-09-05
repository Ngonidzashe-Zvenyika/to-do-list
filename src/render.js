export {renderApplication};

function renderApplication(folders) {
    const body = document.querySelector("body");
    body.innerHTML = "<header><h1>Taskmaster</h1></header><main><nav></nav><div id='folder-container'><div id='folder-container-header'></div></div></main><footer>Made by <a href='https://github.com/Ngonidzashe-Zvenyika'>Ngonidzashe Zvenyika</a></footer>";
    renderFolders(folders);
}

function renderFolders(folders) {
    folders.forEach(folder => {
        const nav = document.querySelector("nav");
        const folderButton = document.createElement("button");
        folderButton.innerText = folder.folderName;
        folderButton.addEventListener("click", () => {
        })
        nav.appendChild(folderButton);
    })
}


