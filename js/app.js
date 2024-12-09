/**
 * TODO
 * Refactor, isolate and deepen the scope of NodeManager
 * cuando se presiona un edit, precargar el nombre de la task para la edicion
 * cuando la task esta slashed, botones desactivados excepto el de borrar
 * 
 * css refactor and specialization
 */
class Utils {
    /**
     * checks whether the app is running as an app or inside a web browser.
     * @returns {boolean} whether it is a browser or an Electron app
     */
    isElectron() {
        return typeof process !== 'undefined' && process.versions != null && process.versions.electron != null;
    }

    /**
     * Sets the background color of the body to black
     */
    setBodyBlack() {
        if (!this.isElectron()) {
            document.body.style.backgroundColor = "black";
        }
    }
}

/**
 * Manager Class that manages general Node creations
 */
class NodeManager {
    /**
     * 
     * @param {HTMLElement} tipoDeElemento type of element to be created.
     * @param {JSON} atributo JSON notation of attributes set on given element.
     * @param {string} texto Inner text if needed and available.
     * @returns {HTMLElement} returns filled HTMLElement.
     */
    construirElemento(tipoDeElemento = '', atributo = {}, texto = '') {
        let elemento = document.createElement(`${tipoDeElemento}`);
        this.setearAttributos(elemento, atributo);
        elemento.innerText = texto;
        return elemento;
    }

    /**
     * 
     * @param {HTMLElement} el HTMLElement to be created.
     * @param {JSON} attrs JSON Notation of attributes to give to the element.
     */
    setearAttributos(el, attrs) {
        for (var key in attrs) {
            el.setAttribute(key, attrs[key]);
        }
    }
}

window.onload = function () {
    const util = new Utils();
    util.setBodyBlack();
    const nm = new NodeManager();

    let tab = document.getElementById("tab");
    let count = 0;
    let addButton = document.getElementById("add-button");
    let saveButton = document.getElementById("save-button");
    let addBtnPressed = false;

    /**
     * Adds the slashed effect to a given title on click.
     * count parameter determines part of the ID of the previous element
     * @param {HTMLElement} title 
     * @param {number} count 
     */
    function addTitleClickEvent(title, count) {
        title.addEventListener("click", (event) => {
            if (event.target.matches("#task-" + count)) {
                title.parentElement.classList.toggle("slashed");
            }
        });
    }

    /**
     * Adds a task item to the checklist.
     * @param {string} taskText Optional text to initialize the task title.
     * @param {boolean} isSlashed Optional flag to set the slashed class.
     */
    function addTaskItem(taskText = "", isSlashed = false) {
        count++;
        let lItem = nm.construirElemento("li", { "id": "item-" + count }, "");
        if (isSlashed) lItem.classList.add("slashed");

        let textInput = nm.construirElemento("input", { "id": "inp-" + count, "type": "text", "placeholder": "Write your task" }, "");
        textInput.style.display = "none"; // Ensure input is hidden initially
        let btnDone = nm.construirElemento("button", { "type": "button", "id": "done-" + count }, "Set Task");
        let btnGrp = nm.construirElemento("div", { "id": "btnGrp" }, "");
        let delBtn = nm.construirElemento("button", { "id": "del-" + count, "type": "button" }, "X");
        let title = nm.construirElemento("p", { id: "task-" + count }, taskText);
        title.style.display = "flex"; // Ensure title is displayed initially
        let editBtn = nm.construirElemento("button", { "id": "edit-" + count, "type": "button" }, "Edit");
        let doneEditBtn = nm.construirElemento("button", { "id": "donEdit-" + count, "class": "btn btn-primary col-1" }, "");
        doneEditBtn.innerHTML = `<svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 14.5C5 14.5 6.5 14.5 8.5 18C8.5 18 14.0588 8.83333 19 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>`;

        // Add title click event for slashing
        addTitleClickEvent(title, count);

        // Add edit functionality
        editBtn.addEventListener("click", () => {
            textInput.value = title.textContent;
            textInput.style.display = "flex";
            title.style.display = "none";
            btnGrp.insertBefore(doneEditBtn, editBtn);
            editBtn.style.display = "none";

            doneEditBtn.addEventListener("click", () => {
                editBtn.style.display = "flex";
                textInput.style.display = "none";
                title.textContent = textInput.value;
                title.style.display = "flex";
                doneEditBtn.remove();
            });
        });

        // Add delete functionality
        delBtn.addEventListener("click", () => {
            lItem.remove();
        });

        // Finalize task addition
        lItem.appendChild(title);
        btnGrp.appendChild(editBtn);
        btnGrp.appendChild(delBtn);
        lItem.appendChild(btnGrp);
        document.querySelector("#tab>ul").appendChild(lItem);
    }

    /**
     * Loads the checklist from a JSON array.
     * @param {Array} items List of task items to load.
     */
    function loadChecklist(items) {
        const ul = document.querySelector("#tab>ul");
        ul.innerHTML = ""; // Clear existing items
        items.forEach((item) => addTaskItem(item.title, item.isSlashed));
    }

    // Add task button
    addButton.addEventListener("click", () => {
        if (addBtnPressed) {
            return;
        }
        addBtnPressed = true;
        addTaskItem(); // Add an empty task
    });

    // Save checklist as JSON
    saveButton.addEventListener("click", () => {
        const items = [];
        document.querySelectorAll("#tab>ul>li").forEach((li) => {
            const title = li.querySelector("p").textContent;
            const isSlashed = li.classList.contains("slashed");
            items.push({ title, isSlashed });
        });

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(items));
        const downloadAnchor = document.createElement("a");
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "checklist.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    });

    // Drag-and-drop functionality
    tab.addEventListener("dragover", (event) => {
        event.preventDefault();
        tab.classList.add("drag-over");
    });

    tab.addEventListener("dragleave", () => {
        tab.classList.remove("drag-over");
    });

    tab.addEventListener("drop", (event) => {
        event.preventDefault();
        tab.classList.remove("drag-over");
        const file = event.dataTransfer.files[0];
        if (file && file.type === "application/json") {
            const reader = new FileReader();
            reader.onload = function (e) {
                const items = JSON.parse(e.target.result);
                loadChecklist(items);
            };
            reader.readAsText(file);
        }
    });

    // Slide effect on drag
    document.addEventListener("dragenter", () => {
        tab.classList.add("slide");
    });
    document.addEventListener("mousemove", (e) => {
        if (e.clientX > tab.getBoundingClientRect().left - 100 && e.clientX < tab.getBoundingClientRect().left) {
            tab.classList.add("pre-slide");
        } else {
            tab.classList.remove("pre-slide");
        }
    });
    tab.addEventListener("mouseover", () => {
        tab.classList.remove("pre-slide");
        tab.classList.add("slide");
    });
    tab.addEventListener("mouseleave", () => {
        tab.classList.remove("slide");
    });
};
