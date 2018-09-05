const place = {
	actionurl: "https://autocomplete.geocoder.cit.api.here.com/6.2/suggest.json",
	key: "xWyJAJbwxCsixyUso1gA&app_code=Oxd1esiMMAd_ghiCAOewRQ",
	list:[],
	action: (args) => {
		if(args.suggestions === undefined)
			args.suggestions = "";
		for(let placesIndex = 0; placesIndex < args.suggestions.length; placesIndex++)
			place.list[placesIndex] = args.suggestions[placesIndex].label;
	}
};

const placeSuggestions = {
	actionurl: "placeSuggestions",
	place: {
		actionurl: "place",
		list :{
			activeurl: "",
			classplace: "key-hover"
		},
		pattern: null,
		value: "",
		input: (args) => {
			placeSuggestions.place.value = args.target.value;
			AJAXRequest(place.actionurl+"?app_id="+place.key+"&query="+placeSuggestions.place.value, place.action, "GET");
			const ulElement = document.getElementById(placeSuggestions.actionurl);
			ulElement.innerText = "";
			if(placeSuggestions.place.value === "")
				return;
			for(let list of place.list) {
					const liElement = document.createElement("li");
					liElement.setAttribute("id", list);
					liElement.innerText = list;
					ulElement.appendChild(liElement);
					document.getElementById(list).addEventListener("click", placeSuggestions.place.action);
			}
			if(!ulElement.hasChildNodes()) {
				const liElement = document.createElement("li");
				liElement.setAttribute("id", "listMessage");
				liElement.innerText = "No places found";
				ulElement.appendChild(liElement);
			}
		},
		keydown: (args) => {
			if((args.which === 38 || args.which === 40) && document.getElementById(placeSuggestions.actionurl).hasChildNodes()) {
				const placeSuggestionsElement = document.getElementById(placeSuggestions.actionurl);
				if(placeSuggestions.place.list.activeurl === "" || document.getElementById(placeSuggestions.place.list.activeurl) === null) {
					placeSuggestionsElement.firstChild.classList.add(placeSuggestions.place.list.classplace);
					placeSuggestions.place.list.activeurl = placeSuggestionsElement.firstChild.id;
				} else {
					const activeList = document.getElementById(placeSuggestions.place.list.activeurl);
					const listIndex = (Array.from(placeSuggestionsElement.children).indexOf(activeList) - 3) * 30;
					placeSuggestionsElement.scrollTop = listIndex;
					activeList.classList.remove(placeSuggestions.place.list.classplace);
					if(args.which === 38) {
						if(activeList.previousSibling === null) {
							placeSuggestionsElement.lastChild.classList.add(placeSuggestions.place.list.classplace);
							placeSuggestions.place.list.activeurl = placeSuggestionsElement.lastChild.id;
							placeSuggestionsElement.scrollTop = placeSuggestionsElement.scrollHeight;
						} else {
							activeList.previousSibling.classList.add(placeSuggestions.place.list.classplace);
							placeSuggestions.place.list.activeurl = activeList.previousSibling.id;
						}
					} else if(args.which == 40) {
						if(activeList.nextSibling === null) {
							placeSuggestionsElement.firstChild.classList.add(placeSuggestions.place.list.classplace);
							placeSuggestions.place.list.activeurl = placeSuggestionsElement.firstChild.id;
							placeSuggestionsElement.scrollTop = 0;
						} else {
							activeList.nextSibling.classList.add(placeSuggestions.place.list.classplace);
							placeSuggestions.place.list.activeurl = activeList.nextSibling.id;
						}
					}
				}
			} else if(args.which === 13 && placeSuggestions.place.list.activeurl !== ""){
				const placeElement = document.getElementById(placeSuggestions.place.actionurl);
				const activeList = document.getElementById(placeSuggestions.place.list.activeurl);
				const ulElement = document.getElementById(placeSuggestions.actionurl);
				placeElement.value = placeSuggestions.place.value = activeList.id;
				ulElement.innerText = "";
			} else {
				placeSuggestions.place.list.activeurl = "";
			}
		},
		action: (args) => {
			const placeElement = document.getElementById(placeSuggestions.place.actionurl);
			const ulElement = document.getElementById(placeSuggestions.actionurl);
			placeElement.value = placeSuggestions.place.value = args.target.innerText;
			ulElement.innerText = "";
		},
		clearInput: {
			actionurl: "clearInput",
			action: () => {
				const clearInputElement = document.getElementById(placeSuggestions.place.clearInput.actionurl);
				const inputElement = document.getElementById(placeSuggestions.place.actionurl);
				inputElement.value = placeSuggestions.place.value = "";
			}
		}
	}
};

const handleElementsVisiblity = {
	placeInputHolder: {
		actionurl: "placeInputHolder",
		action: (args) => {
			if(args.target.id !== "" && document.getElementById(args.target.id) !== null) {
				const clickedElement = document.getElementById(args.target.id);
				const placeInputHolder = document.getElementById(handleElementsVisiblity.placeInputHolder.actionurl);
				if(clickedElement.parentNode !== placeInputHolder)
					document.getElementById(placeSuggestions.actionurl).style.display = "none";
			} else 
				document.getElementById(placeSuggestions.actionurl).style.display = "none";
		}
	},
	placeInput: {
		actionurl: "place",
		input: (args) => {
			if(args.target.id !== "" && document.getElementById(args.target.id) !== null) {
				const inputElement = document.getElementById(args.target.id);
				const placeInput = document.getElementById(handleElementsVisiblity.placeInput.actionurl);
				if(inputElement === placeInput && placeInput.value !== "")
					document.getElementById(placeSuggestions.place.clearInput.actionurl).style.display = "block";
				else
					document.getElementById(placeSuggestions.place.clearInput.actionurl).style.display = "none";
			}
		},
		action: (args) => {
			if(args.target.id !== "" && document.getElementById(args.target.id) !== null) {
				const clickedElement = document.getElementById(args.target.id);
				const placeInput = document.getElementById(handleElementsVisiblity.placeInput.actionurl);
				if(clickedElement === placeInput)
					document.getElementById(placeSuggestions.actionurl).style.display = "block";
			}
		}
	},
	clearInput: {
		actionurl: "clearInput",
		action: (args) => {
			if(args.target.id !== "" && document.getElementById(args.target.id) !== null) {
				const clickedElement = document.getElementById(args.target.id);
				const clearInput = document.getElementById(handleElementsVisiblity.clearInput.actionurl);
				if(clickedElement === clearInput) {
					clearInput.style.display = "none";
					placeSuggestions.place.action(args);
				}
			}
		}
	}
};

function AJAXRequest(url, func, method, args) {
	if(args === undefined)
		args = "";
	var xhr = new XMLHttpRequest();
	xhr.open(method, url, true);
	xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
	xhr.send(args);
	xhr.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			func(JSON.parse(this.responseText));
		}
	};
}

function loadEvents() {
	let elem;
	if(document.getElementById(placeSuggestions.place.actionurl) !== null) {
		elem = document.getElementById(placeSuggestions.place.actionurl);
		elem.addEventListener("input", placeSuggestions.place.input);
		elem.addEventListener("keydown", placeSuggestions.place.keydown);
	}

	if(document.getElementById(placeSuggestions.place.clearInput.actionurl) !== null) {
		elem = document.getElementById(placeSuggestions.place.clearInput.actionurl);
		elem.addEventListener("click", placeSuggestions.place.clearInput.action);
	}
}

function loadClickVisibilityEvents(args) {
	if(document.getElementById(handleElementsVisiblity.placeInputHolder.actionurl) !== null)
		handleElementsVisiblity.placeInputHolder.action(args);

	if(document.getElementById(handleElementsVisiblity.placeInput.actionurl) !== null)
		handleElementsVisiblity.placeInput.action(args);

	if(document.getElementById(handleElementsVisiblity.clearInput.actionurl) !== null)
		handleElementsVisiblity.clearInput.action(args);
}

function loadInputVisibilityEvents(args) {
	if(document.getElementById(handleElementsVisiblity.placeInput.actionurl) !== null)
		handleElementsVisiblity.placeInput.input(args);
}

window.addEventListener("click", loadClickVisibilityEvents);
window.addEventListener("input", loadInputVisibilityEvents);
window.addEventListener("load", loadEvents);
