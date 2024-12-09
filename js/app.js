/**
 * TODO
 * Refactor, isolate and deepen the scope of NodeManager
 * cuando se presiona un edit, precargar el nombre de la task para la edicion
 * cuando la task esta slashed, botones desactivados excepto el de borrar
 * 
 * css refactor and specialization
 */
class Utils {
    isElectron() {
        return typeof process !== 'undefined' && process.versions != null && process.versions.electron != null;
    }
    setBodyBlack() {
        if (!this.isElectron()) {
            document.body.style.backgroundColor = "black";
        }
    }
}

class NodeManager {
    construirElemento(tipoDeElemento = '', atributo = {}, texto = '') {
        let elemento = document.createElement(`${tipoDeElemento}`);
        this.setearAttributos(elemento, atributo);
        elemento.innerText = texto;
        return elemento;
    }

    setearAttributos(el, attrs) {
        for (var key in attrs) {
            el.setAttribute(key, attrs[key]);
        }
    }
}

window.onload = function () {
    let util = new Utils();
    util.setBodyBlack();

    const nm = new NodeManager();
    let tab = document.getElementById("tab");
    let count = 0;
    let addButton = document.getElementById("add-button");
    let addBtnPressed = false;

    // Function to handle the 'click' event on the title
    function addTitleClickEvent(title, count) {
        title.addEventListener("click", (event) => {
            if (event.target.matches("#task-" + count)) {
                title.parentElement.classList.toggle("slashed");
            }
        });
    }

    addButton.addEventListener("click", () => {
        if (addBtnPressed) {
            return;
        }
        count++;
        addBtnPressed = true;

        // Create elements
        let lItem = nm.construirElemento("li", { "id": "item-" + count }, "");
        let textInput = nm.construirElemento("input", { "id": "inp-" + count, "type": "text", "placeholder": "Write your task" }, "");
        let btnDone = nm.construirElemento("button", { "type": "button", "id": "done-" + count }, "Set Task");
        let btnGrp = nm.construirElemento("div", { "id": "btnGrp" }, "");
        let delBtn = nm.construirElemento("button", { "id": "del-" + count, "type": "button" }, "X");
        let title = nm.construirElemento("p", { id: "task-" + count }, textInput.value);
        let editBtn = nm.construirElemento("button", { "id": "edit-" + count, "type": "button" }, "Edit");
        let doneEditBtn = nm.construirElemento("button", { "id": "donEdit-" + count, "class": "btn btn-primary col-1" }, "");
        doneEditBtn.innerHTML = `<svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 14.5C5 14.5 6.5 14.5 8.5 18C8.5 18 14.0588 8.83333 19 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>`;

        // Add 'click' event listener to the title
        addTitleClickEvent(title, count);

        btnDone.addEventListener("click", () => {
            addBtnPressed = false;

            delBtn.addEventListener("click", () => {
                lItem.remove();
            });

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

            lItem.appendChild(textInput);
            title.textContent = textInput.value;
            lItem.appendChild(title);
            btnGrp.appendChild(editBtn);
            btnGrp.appendChild(delBtn);
            lItem.appendChild(btnGrp);
            textInput.style.display = "none";
            title.style.display = "flex";
            btnDone.remove();
        });

        document.querySelector("#tab>ul").appendChild(lItem);
        lItem.appendChild(textInput);
        lItem.appendChild(btnDone);
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
