const selectModal = document.querySelector(".modal");
const modal = document.getElementById(selectModal.getAttribute('id'))
const modalContent = document.querySelector('.modal__content');
let gallery = document.querySelector(".gallery");
let categorie = document.querySelector(".categorie");
let body = document.querySelector('body');
let connect = false;
let T;

// MODIFICATION DOM PARTIE ADMINISTRATEUR
// Création de l'overlay et ajout à la page.
function overlay_edit_change_html () {					
	let editMode = document.createElement('div');			
	let span = document.createElement('span');			
	let image = document.createElement('img');			
	let publish = document.createElement('div');			
	let spanPublish = document.createElement('span');			

	editMode.setAttribute('class', 'edit_mode');			
	publish.setAttribute('class', 'publish');			

	spanPublish.innerText = 'publier les changements';			
	image.src = '../assets/icons/editer_white.png';			
	span.innerText = 'Mode édition';			

	publish.appendChild(spanPublish)			
	editMode.appendChild(span).appendChild(image)			
	editMode.appendChild(publish)			

	body.insertBefore(editMode, body.firstChild);			
}


// Creation du span de modification du site
function modif(spanclass){
	let span = document.createElement('span');
	let image = document.createElement('img');

	image.src ='../assets/icons/editer_black.png';
	image.style.all = 'unset'
	image.style.float ='left';
	image.style.marginRight = '5px';
	span.innerText = 'Modifier';
	span.setAttribute('class', spanclass);
	span.appendChild(image);
	span.style.cursor = 'pointer';
	return span
}

// Ajout de la partie modifier en dessous de l'image de profil
function portrait_modifier(){
	let portrait = document.querySelector("#introduction figure");
	let portrait_modifier = document.createElement('div');
	portrait_modifier.style.cssText= `
		display: block;
		width: 80%;
		margin: auto;`
	portrait_modifier.appendChild(modif('portrait_modifier'))
	portrait.appendChild(portrait_modifier)
}

// Suppression de l'h2 et ajout d'une div contenant le H2 et le span modifier
function project_modifier(){
	document.querySelector('#portfolio h2').remove()
	let port = document.querySelector('#portfolio')
	let divTitleProject = document.createElement('div')
	let h2 = document.createElement('h2');

	h2.innerText = "Mes Projets";
	h2.style.margin = "0"
	divTitleProject.style.cssText = `
	display: flex;
	justify-content: center;
	align-items: center;
	height: 50px;
	gap: 2%;
	margin-bottom: 10%;`

	divTitleProject.appendChild(h2)
	divTitleProject.appendChild(modif('project_modifier'))
	port.insertBefore(divTitleProject, categorie)
}


// Appel de l'api afin d'obtenir tous les projets
async function fetchAllProjectData() {
	const f = await fetch("http://localhost:5678/api/works");
	if (f.ok === true) {
		const data = await f.json();
		return data;
	}
	throw new Error("Impossible de contacter l'API");
}


// Appel de l'api afin d'obtenir toutes les catégories
async function fetchCategoryData() {
	const f = await fetch("http://localhost:5678/api/categories");
	if (f.ok === true) {
		const data = await f.json();
		return data;
	}
	throw new Error("Impossible de contacter l'API");
}

// PARTIE INSERTION DYNAMIQUE DES PROJETS ET TRI

// Fonction de tri et de création des boutons de catégorie
async function category() {
	// Récupération de toutes les catégories
	let array = await fetchCategoryData();
	// création du bouton tous
	let createButton = document.createElement("div");
	let textButton = document.createElement("span");
	textButton.innerText = `Tous`;
	createButton.appendChild(textButton);
	categorie
		.appendChild(createButton)
		.setAttribute("class", "categ all selected");
	// Boucle pour créer les boutons de catégorie
	for (let i = 0; i < array.length; i++) {
		let createButton = document.createElement("div");
		let textButton = document.createElement("span");
		// catégorie du formulaire modal
		let modal_select = document.getElementById("categorie_select")
		if (modal_select.children.length < 4){
			let modal_categorie = document.createElement('option');
			modal_categorie.value = `${array[i]["name"]}_${array[i]["id"]}`;
			modal_categorie.innerText = `${array[i]["name"]}`
			modal_select.appendChild(modal_categorie)
		}
		// Ajout catégorie page principal
		textButton.innerText = `${array[i]["name"]}`;
		createButton.appendChild(textButton);
		categorie
			.appendChild(createButton)
			.setAttribute("class", `categ ${array[i]["id"]}`);
	}
	// Récupération de la classe catégorie où sont les boutons de filtres catégorie
	const categ = document.querySelectorAll(".categ");

	// Boucle sur les boutons de catégorie pour ajouter l'écoute des boutons
	for (let i = 0; i < categ.length; i++) {
		categ[i].addEventListener("click", function () {
			for (let i = 0; i < categ.length; i++) {
				categ[i].classList.remove("selected");
			}
			categ[i].classList.add("selected");
			// Une fois un bouton cliquer, on sélectionner toutes les section(figure > img, figcaption) et le numéro du bouton appuyé
			const allfig = document.querySelectorAll(".gallery figure");
			let selectedCategory = categ[i].className.split(" ")[1];
			// Si le bouton appuyé est Tous, on affiche tous les projets
			if (selectedCategory == "all") {
				for (let i = 0; i < allfig.length; i++) {
					// On fait en sorte d'afficher des projets potentiellement caché
					allfig[i].classList.remove("hide");
				}
			} else {
				// Si on appuie pas sur all, on fait juste en sorte de cacher ceux dont l'id correspond au bouton et ré afficher les autres
				for (let i = 0; i < allfig.length; i++) {
					if (!allfig[i].className.match(selectedCategory)) {
						allfig[i].classList.add("hide");
					} else {
						allfig[i].classList.remove("hide");
					}
				}
			}
		});
	}
}


// Fonction de création des projets dans la gallerie
function addGalleryItem(src, name, categoryId, id) {
	// Création des éléments de la gallerie
	const figure = document.createElement("figure");
	const img = document.createElement("img");
	const figcaption = document.createElement("figcaption");

	// Ajout des attribut et texte
	img.src = `${src}`;
	figcaption.innerText = `${name}`;

	// Ajout dans le code HTML des éléments créer
	figure.appendChild(img).setAttribute("alt", `${name}`);
	figure.appendChild(figcaption);
	figure.setAttribute('Id', `${id}`)
	gallery.appendChild(figure).setAttribute("class", `${categoryId}`);
}


// Fonction d'ajout des projets et catégories après chargement de la page
async function pushElementAfterCall() {
	// Récupération des résultats de l'appel à l'API
	const t = await fetchAllProjectData();
	// Boucle sur les résultats de l'api pour ajouter les projets dans la gallerie et obtenir les catégories
	for (let i = 0; i < t.length; i++) {
		addGalleryItem(t[i]["imageUrl"], t[i]["title"], t[i]["categoryId"], t[i]['id']);
	}
	await category();
}


// Fonction de rechargement de tous les projets avec la suppression de ceux afficher et un nouvel appel à l'api pour réafficher les élements
function reload() {
	document.querySelectorAll(".gallery figure").forEach(element => {
		element.remove()
	})
	document.querySelectorAll(".categ").forEach(element => {
		element.remove()
	})
	pushElementAfterCall();
}

// Fonction permettant de regrouper toutes les actions pour la fermeture de la modale
function close(){
	modal.style.display = 'none'
	removeWhenClose()
	reset_form()
	modal.removeAttribute('tabindex')
	if (modal_change){
		reload()
	}
}


// Permet de savoir si un utilisateur est connecté 
if (sessionStorage.getItem('hdr_t') !== null){
	T = sessionStorage.getItem('hdr_t');
	connect = true
}

// Quand la personne est connecté, toutes les modifications du sites, lié à la connexion
if (connect) {
	// Ajout des modifications d'interfaces
	overlay_edit_change_html();
	portrait_modifier()
	project_modifier()
	categorie.setAttribute('class', 'hide')
	// Changement du nav li "login" en "logout" et lors du clic déconnecte la personne.
	document.querySelectorAll('nav li').forEach(value => {
		if (value.innerText == 'login'){
			value.innerText = "logout";
			value.addEventListener('click', () => {
				sessionStorage.clear();
				window.location.href = "../index.html";
				connect = false;
			})
		}
	})

	// Ecoute du bouton modifier pour les projets et affichage de la modale
	document.querySelector('.project_modifier').addEventListener('click', (e) => {
		modal.style.display = "flex";
		modalHomeGallery();
		modalHomepageShow();
		modal_change = false;
		findFocusElementOnActualPage()
	})
	// Permet de quitter la modale en cliquant à côté de la modale
	modal.addEventListener('click', (e) => {
		if (e.target !== modal) return
		close()
	})
	// Ecoute la croix de la modale afin de quitter celle ci 
	document.querySelectorAll('.fa-xmark').forEach(a => {
		a.addEventListener('click', (e) => {
			close()
		})
	})
	// Permet de quitter la modale en appuyant sur échap et permet de tab sur les éléments de la modale
	document.addEventListener('keydown', (e) => {
		if (modal.style.display === "flex" && e.key === 'Escape' || e.key === 'esc'){
			close()
		}
		if (modal.style.display === 'flex' && e.key === 'Tab'){
			if (modal.style.display === 'flex'){
				focusInModal(e)
			}
		}
	})
}

// Appel de la fonction au chargement du script pour afficher les projets après chargement de la page
pushElementAfterCall();
