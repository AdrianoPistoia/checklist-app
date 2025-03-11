class Utils {
    isElectron() {
        return typeof process !== 'undefined' && process.versions?.electron != null;
    }

    setBodyBlack() {
        if (!this.isElectron()) document.body.style.backgroundColor = "black";
    }
}

class NodeManager {
    constructor() {
        this.construirElemento = this.construirElemento.bind(this);
        this.setearAttributos = this.setearAttributos.bind(this);
    }

    construirElemento(tipoDeElemento = '', atributo = {}, texto = '') {
        let elemento = document.createElement(tipoDeElemento);
        this.setearAttributos(elemento, atributo);
        elemento.innerText = texto;
        return elemento;
    }

    setearAttributos(el, attrs) {
        for (const [key, value] of Object.entries(attrs)) {
            if (value != null && value !== "") {
                el.setAttribute(key, value.toString());
            }
        }
    }
}


class ChecklistManager {
    constructor(tabId, addButtonId, saveButtonId) {
        this.tab = document.getElementById(tabId);
        this.addButton = document.getElementById(addButtonId);
        this.saveButton = document.getElementById(saveButtonId);
        this.nodeManager = new NodeManager();
        this.count = 0;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.addButton.addEventListener("click", () => this.handleAddButtonClick());
        this.saveButton.addEventListener("click", () => this.saveChecklist());
        this.initializeDragAndDrop();
        this.initializeMouseHover();
    }

    handleAddButtonClick() {
        const activeInput = document.querySelector("input[type='text']:not([style*='display: none'])");
        !activeInput ? this.addTaskItem() : this.shakeElement(activeInput.closest("li"));
    }

    addTaskItem(taskText = "", isSlashed = false) {
        this.count++;
        const li = this.createTaskElement(taskText, isSlashed);
        this.tab.querySelector("ul").appendChild(li);
        this.focusOnInput();
    }

    createTaskElement(taskText, isSlashed) {
        const { construirElemento } = this.nodeManager;
        const id = this.count;
        const li = construirElemento("li", { id: `item-${id}` });
        if (isSlashed) li.classList.add("slashed");

        const textInput = construirElemento("input", {
            id:                 `inp-${id}`,
            type:               "text",
            placeholder:        "Write your task",
        });
        const title         = construirElemento("p", { id: `task-${id}` }, taskText);
        const doneButton    = this.createButton(`done-${id}`, "Done", () => this.saveTask(textInput, title, doneButton));
        const editButton    = this.createButton(`edit-${id}`, "Edit", () => this.editTask(title, textInput, doneButton));
        const deleteButton  = this.createButton(`del-${id}`, "X", () => this.deleteTask(li));
        const buttonGroup   = construirElemento("div", { class: "btn-group" });
        buttonGroup.append(editButton, deleteButton);
        li.append(textInput, title, doneButton, buttonGroup);
        this.toggleTaskView(textInput, title, doneButton.nextSibling, doneButton, true);

        li.addEventListener("click", (event) => {
            if (!event.target.matches("button, input")) { // Ignore clicks on buttons and inputs
                li.classList.toggle("slashed");
            }
        });

        textInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                this.saveTask(textInput, title, doneButton)
            }
        });

        return li;
    }

    saveTask(input, title, doneButton) {
        title.textContent = input.value;
        this.toggleTaskView(input, title, doneButton.nextSibling, doneButton ,false);
    }

    editTask(input, title, doneButton) {
        input.value = title.textContent;
        this.toggleTaskView(input, title, doneButton.nextSibling, doneButton, true);
    }

    focusOnInput(){
        const input = document.getElementById("inp-"+this.count);
        input.focus();
    }

    deleteTask(taskElement) {
        taskElement.remove();
    }

    /**
     * 
     * @param {HTMLElement} element 
     * @param {*} bool 
     */
    setDisplay(element, bool) {
        if (!element.style) {
            console.log("style: "+element.style+"\nNo hay estilo");
            // element.setAttribute("style=display:"+(bool ? "flex" : "none"));
            element.classList.toggle("display");
        }else{
            console.log("style: "+element.style.display+"\nHay estilo");
            element.style.display = bool ? "flex" : "none";
        }
    }
    

    /**
     * 
     * @param {HTMLElement} input 
     * @param {HTMLElement} title 
     * @param {HTMLElement} buttonGroup 
     * @param {HTMLElement} doneButton 
     * @param {boolean} isEditing 
     */
    toggleTaskView(input, title, buttonGroup, doneButton, isEditing = false) {
        this.setDisplay(input,isEditing);
        this.setDisplay(title,!isEditing);
        this.setDisplay(buttonGroup,!isEditing);
        this.setDisplay(doneButton,isEditing);
        console.log("is Editing: "+isEditing);
        // input.style.display             = isEditing     ? "flex"   : "none";
        // title.style.display             = !isEditing    ? "flex"   : "none";
        // buttonGroup.style.display       = !isEditing    ? "flex"   : "none";
        // doneButton.style.display        = isEditing     ? "flex"   : "none";
        
    }

    createButton(id, text, onClick) {
        const button = this.nodeManager.construirElemento("button", { id, type: "button" }, text);
        button.addEventListener("click", onClick);
        return button;
    }

    shakeElement(element) {
        element.classList.add("shake");
        setTimeout(() => element.classList.remove("shake"), 400);
    }

    saveChecklist() {
        const items = Array.from(this.tab.querySelectorAll("li")).map(li => ({
            title: li.querySelector("p").textContent,
            isSlashed: li.classList.contains("slashed"),
        }));

        const data              = JSON.stringify(items);
        const downloadAnchor    = document.createElement("a");
        downloadAnchor.href     = `data:text/json;charset=utf-8,${encodeURIComponent(data)}`;
        downloadAnchor.download = "checklist.json";
        downloadAnchor.click();
    }

    loadChecklist(items) {
        this.tab.querySelector("ul").innerHTML = "";
        items.forEach(({ title, isSlashed }) => {
            let i = 0; 
            this.addTaskItem(title, isSlashed);
            let lastTask = document.getElementsByTagName("li");
            this.toggleTaskView(lastTask[i].closest("input"),lastTask[0].closest("p"),lastTask[0].closest(".buttonGroup"),lastTask[0].closest(".doneButton"),false);
            i++;
        });
    }

    initializeDragAndDrop() {
        // document.addEventListener("dragover", e => e.preventDefault()); // Global dragover to prevent default
        document.addEventListener("dragover", e => {
            e.preventDefault();
            // if (this.isDragging) {
            //     this.isDragging = true; // Set dragging flag
            //     this.tab.classList.add("slide");
            //     console.log("is dragging over")
            // }
            this.tab.classList.remove("pre-slide");
            this.tab.classList.add("slide");
            console.log("is dragging over")
        });
    
        // this.tab.addEventListener("dragleave", e => {
        //     if (this.isDragging) {
        //         this.isDragging = false; // Reset dragging flag
        //         this.tab.classList.remove("drag-active");
        //     }
        // });
    
        this.tab.addEventListener("drop", e => {
            e.preventDefault();
            // this.tab.classList.remove("drag-active");
            this.isDragging = false;
    
            const file = e.dataTransfer.files[0];
            if (file?.type === "application/json") {
                const reader = new FileReader();
                reader.onload = () => {
                    try {
                        const items = JSON.parse(reader.result);
                        this.loadChecklist(items);
                    } catch (error) {
                        console.error("Invalid JSON file:", error);
                    }
                };
                reader.readAsText(file);
            } else {
                console.error("Only JSON files are supported.");
            }
        });
    }
    
    initializeMouseHover() {
        document.addEventListener("mousemove", e => {
            if (this.isDragging) return; // Skip hover logic if dragging
            const rect = this.tab.getBoundingClientRect();
            const isNearTab = e.clientX > rect.left - 100 && e.clientX < rect.left;
            this.tab.classList.toggle("pre-slide", isNearTab);
        });
    
        this.tab.addEventListener("mouseover", () => {
            if (this.isDragging) return; // Skip mouseover logic if dragging
            this.tab.classList.remove("pre-slide");
            this.tab.classList.add("slide");
        });
    
        this.tab.addEventListener("mouseleave", () => {
            if (this.isDragging) return; // Skip mouseleave logic if dragging
            this.tab.classList.remove("slide");
        });
    }
}

// Initialize the application
window.onload = () => {
    const util = new Utils();
    util.setBodyBlack();

    new ChecklistManager("tab", "add-button", "save-button");
};
