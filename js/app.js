/**
 * Utility Class
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

        // Create the text input field for adding a task
        let textInput = nm.construirElemento("input", { "id": "inp-" + count, "type": "text", "placeholder": "Write your task" }, "");
        textInput.style.display = taskText =="" ? "flex" : "none"; // Make input visible

        // Create the Done button to save the task
        let btnDone = nm.construirElemento("button", { "type": "button", "id": "done-" + count }, "Done");

        // Create the button group for the task (edit and delete buttons)
        let btnGrp = nm.construirElemento("div", { "id": "btnGrp" }, "");
        let delBtn = nm.construirElemento("button", { "id": "del-" + count, "type": "button" }, "X");
        let title = nm.construirElemento("p", { id: "task-" + count }, taskText);  // Use taskText here
        title.style.display = taskText == ""? "none" : "flex"; // Hide the title initially

        // Create the edit button and initialize it
        let editBtn = nm.construirElemento("button", { "id": "edit-" + count, "type": "button" }, "Edit");

        // Add title click event for slashing
        addTitleClickEvent(title, count);

        // Add functionality for the "Done" button (saving the task)
        btnDone.addEventListener("click", () => {
            title.textContent = textInput.value; // Move text from input to title
            title.style.display = "flex"; // Show the title (task)
            textInput.style.display = "none"; // Hide the input field
            btnDone.style.display = "none"; // Hide the Done button
            btnGrp.style.display = "flex"; // Show the button group again

            // Add the title (p element) to the list and remove the input field
            lItem.appendChild(title);
            lItem.appendChild(btnGrp);
        });

        // Add delete functionality
        delBtn.addEventListener("click", () => {
            if(isSlashed) return;
            lItem.remove();
        });

        if(taskText != "") {
            lItem.appendChild(title);
            btnDone.style.display = "none";
            btnGrp.style.display = "flex";
            editBtn.style.display = "flex";
            delBtn.style.display = "flex";
        }else{
            btnGrp.style.display = "none"; 

        }
        // Add the task title initially (empty)
        lItem.appendChild(textInput); // Add input field
        lItem.appendChild(btnDone); // Add Done button
        btnGrp.appendChild(editBtn); // Ensure edit button is added
        btnGrp.appendChild(delBtn);  // Add delete button
        lItem.appendChild(btnGrp);

        // Initially hide the button group when the input is visible

        // Append the task to the checklist
        document.querySelector("#tab>ul").appendChild(lItem);

        // Add edit functionality after the task is saved
        editBtn.addEventListener("click", () => {
            if(isSlashed) return;
            textInput.value = title.textContent; // Set current text to input
            textInput.style.display = "inline-block"; // Show input field
            title.style.display = "none"; // Hide task title
            btnGrp.style.display = "none"; // Hide the button group while editing

            // Hide the Done button (edit mode active)
            btnDone.style.display = "inline-block";

            // Save the edited task when the "Done" button is clicked
            btnDone.addEventListener("click", () => {
                title.textContent = textInput.value; // Update task text
                title.style.display = "flex"; // Show updated task title
                textInput.style.display = "none"; // Hide input field
                btnDone.style.display = "none"; // Hide Done button
                btnGrp.style.display = "flex"; // Show button group again
            });
        });
    }

    /**
     * Loads the checklist from the given JSON data.
     * @param {Array} items An array of task objects.
     */
    function loadChecklist(items) {
        // Clear previous tasks before loading new ones
        document.querySelector("#tab>ul").innerHTML = '';

        // Load new tasks
        items.forEach(item => {
            addTaskItem(item.title, item.isSlashed);
            
        });
    }

    // Add task button
    addButton.addEventListener("click", () => {
        // Check if there is any input field still visible
        const activeInput = document.querySelector("input[type='text']:not([style*='display: none'])");
        if (!activeInput) {
            addTaskItem(); // Add an empty task only if no input field is visible
        } else {
            // Find the first li element with the active input
            const activeLi = document.querySelector("li:has(input[type='text']:not([style*='display: none']))");
            if (activeLi) {
                // Apply shake effect
                activeLi.classList.add("shake");
                // Remove the shake class after the animation ends
                setTimeout(() => {
                    activeLi.classList.remove("shake");
                }, 400);
            }
        }
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
    document.addEventListener("dragover", (event) => {
        event.preventDefault();
        tab.classList.add("slide");
    });

    tab.addEventListener("drop", (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file && file.type === "application/json") {
            const reader = new FileReader();
            reader.onload = function (e) {
                const items = JSON.parse(e.target.result);
                loadChecklist(items);  // Load the tasks and remove previous ones
            };
            reader.readAsText(file);
        }
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
