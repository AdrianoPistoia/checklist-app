function insertAfter(referenceNode, newNode) {
	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
let intPropertyValue = (target, property) => {
	return parseInt(window.getComputedStyle(target).getPropertyValue(property));
}
let rawPropertyValue = (target, property) => {
	return window.getComputedStyle(target).getPropertyValue(property);
}
let log = (item) => {
	console.log(item);
}
tab.style.transform = "translateX("+(window.innerWidth-(tab.com))+"px)"

function addPositions(arr, arr2) {
	let aux = [];
	aux[0] = arr[0] + arr2[0];
	aux[1] = arr[1] + arr2[1];
	return aux;
}
