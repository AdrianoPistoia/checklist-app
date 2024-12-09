function insertAfter(referenceNode, newNode) {
	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
let intPropertyValue = (target, property) => {
	return parseInt(window.getComputedStyle(target).getPropertyValue(property));
}

tab.style.transform = "translateX("+(window.innerWidth-(tab.com))+"px)"

function addPositions(arr, arr2) {
	let aux = [];
	aux[0] = arr[0] + arr2[0];
	aux[1] = arr[1] + arr2[1];
	return aux;
}
// function construirElemento(tipoDeElemento = '', atributo = { },texto = ''){
//     let elemento = document.createElement(`${tipoDeElemento}`);
//     setearAttributos(elemento, atributo);
//     elemento.innerText = texto;
//     return elemento;
// };

// function setearAttributos(el, attrs){
//     for(var key in attrs) {
//       el.setAttribute(key, attrs[key]);
//     }
// }