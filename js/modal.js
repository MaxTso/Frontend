import { local } from "./api.js";
import { 
    T,
    reload
} from "./main.js"
const focusableElement = 'button, select, input';
const [homePageConfirm, editProjectConfirm] = ['homePage__confirm', 'editproject__confirm']
let focusables = []
let modal_home = document.querySelector('.modal__homepage');
const modalContent = document.querySelector('.modal__content');
let modal_editproject = document.querySelector('.modal__editproject');
let modal_editproject_categorie = document.getElementById('categorie_select');
let modal_addfile = document.getElementById('add_file');
let modal_titleadd = document.getElementById('title_image');
let modal_homePageBox = document.querySelector('.modal__homepage__box')

const box_photo = document.querySelector('.add__photo__box');
let button = document.querySelector('.button__addphoto_confirm');
let form = document.querySelector('.form__addphoto');

let showClassModal = 'modal__section__show';
let hideClassModal = 'modal__section__hide';

let modal_change = false;
export {modal_change}
function isChange(bool){
    modal_change = bool
}
export {isChange}


// Fonction permettant de dire quels sont les éléments focusables dans la page modal actuelle
export function findFocusElementOnActualPage () {
	let homePage = document.querySelector('.modal__homepage')
	let editPage = document.querySelector('.modal__editproject')
	if (homePage.classList.contains(showClassModal)){
		focusables = Array.from(homePage.querySelectorAll(focusableElement))
	} else {
		focusables = Array.from(editPage.querySelectorAll(focusableElement))
	}
}


// Fonction permettant de focus les éléments présent dans la page modal actuelle
function focusInModal(e){
	e.preventDefault();
    let index = focusables.findIndex(f => f === modalContent.querySelector(':focus'))
	index++
    if (index >= focusables.length || index == -1){
		index = 0
	}
    if (focusables[index].hasAttribute('disabled') || focusables[index].style.visibility === "hidden"){
        index++
    }
	if (index >= focusables.length || index == -1){
		index = 0
	}
	focusables[index].focus();
}
export {focusInModal}


// Fonction d'affichage d'un message de succès
function showPositiveMessage(message, id){
    let okMessage = document.getElementById(id)
    switch(id){
        case editProjectConfirm:
            okMessage.style.width = '80%';
            break
        case homePageConfirm:
            okMessage.style.width = '100%'
            break
    }
    okMessage.setAttribute('class', 'confirm positive')
    okMessage.style.visibility = 'visible'
    okMessage.innerText = message
    const timeout = setTimeout(() => {
        okMessage.style.visibility = 'hidden';
        clearTimeout(timeout)
    }, 3000)
}


//Fonction d'affichage d'un message d'erreur
function showNegativeMessage(message, id){
    let okMessage = document.getElementById(id)
    switch(id){
        case editProjectConfirm:
            okMessage.style.width = '80%';
            break
        case homePageConfirm:
            okMessage.style.width = '100%'
            break
    }
    okMessage.setAttribute('class', 'confirm positive')
    okMessage.style.visibility = 'visible'
    okMessage.innerText = message
    const timeout = setTimeout(() => {
        okMessage.style.visibility = 'hidden';
        clearTimeout(timeout)
    }, 3000)
}


// Section création de gallerie
// Création des éléments DOM pour le bouton de suppression des projets
function trashcan() {
    let trashbox = document.createElement('button');
    trashbox.setAttribute('class', 'trash__box');
    let trash = document.createElement('i')
    trash.setAttribute('class', 'fa fa-light fa-trash-can')
    trashbox.appendChild(trash);
    return trashbox
}

// Création des éléments DOM pour le bouton de déplacement des projets
function moveitem() {
    let moovebox = document.createElement('div');
    moovebox.setAttribute('class', 'moove__box');
    let moove = document.createElement('i')
    moove.setAttribute('class', 'fa fa-light fa-arrows-up-down-left-right')
    moovebox.appendChild(moove);
    return moovebox
}

// Fonction de création de la gallerie modale avec un event listener sur les boutons de suppression de projet
function modalHomeGallery(){
    let box = document.querySelector('.modal__gallery__box')
    document.querySelectorAll('.gallery figure').forEach(a => {
        let copyFigure = a.cloneNode(true);
        copyFigure.setAttribute('id', `modal_${a.getAttribute('id')}`)
        copyFigure.appendChild(trashcan()).addEventListener('click', (e) => {
            e.stopPropagation()
            let actualModalImage = e.currentTarget.parentElement.getAttribute('id');
            let imageId = actualModalImage.split('_')[1]
            deleteWork(imageId, actualModalImage)
        })
        copyFigure.querySelector('figcaption').innerText = 'Editer';
        box.appendChild(copyFigure)
    })
    box.children[0].appendChild(moveitem());
}
export {modalHomeGallery}

// Fonction d'effacement de la gallerie modale afin de remettre une nouvelle version lors de la prochaine ouverture
function removeWhenClose(){
    let modal_gallery = document.querySelector('.modal__gallery__box');
    while (modal_gallery.firstChild){
        modal_gallery.removeChild(modal_gallery.lastChild)
}}
export {removeWhenClose}


// Fonction de suppression de projet
async function deleteWork(id, modalId) {
	// Envoi des données du formulaire avec l'id du lien en paramètre de la fonction
	const f = await fetch(`${local}api/works/${id}`, {
		method:'DELETE',
		headers: {
			Accept: "application/json",
			"Content-type":"application/json",
            'Authorization': `Bearer ${T}`
		}
	})
    if (f.ok) {
        // Si ok, suppression des éléments dans le DOM, indique un changement via la modale_change et affichage d'un message d'erreur ou de succès
        document.getElementById(`${modalId}`).remove()
        document.getElementById(`${id}`).remove()
        modal_change = true
        showPositiveMessage('Suppression réussie', homePageConfirm)
    } else {
        showNegativeMessage('La Suppression à échoué', homePageConfirm)
        
    }
};


// Affiche la page modale principale
function modalHomepageShow(){
    modal_home.classList.add(showClassModal)
    if (modal_home.classList.contains(hideClassModal)){
        modal_home.classList.remove(hideClassModal)
    }
    if (modal_editproject.classList.contains(showClassModal) || !modal_editproject.classList.contains(hideClassModal)){
        modal_editproject.classList.remove(showClassModal)
        modal_editproject.classList.add(hideClassModal)
    }
}
export {modalHomepageShow}

// Affiche la page modale d'ajout de photo
function modalEditProjectShow(){
    modal_editproject.classList.add(showClassModal)
    if (modal_editproject.classList.contains(hideClassModal)){
        modal_editproject.classList.remove(hideClassModal)
    }
    if (modal_home.classList.contains(showClassModal)){
        modal_home.classList.remove(showClassModal)
        modal_home.classList.add(hideClassModal)
    }
}

// Fonction permettant de reset la partie du formulaire qui gère l'ajout de photo
function resetFormAddPhoto(){
    let imported_image = document.querySelector('.imported')
    if (imported_image){
        box_photo.setAttribute('class', 'add__photo__box')
        imported_image.remove()
    }
}

// Fonction permettant de remettre à zéro le formulaire
function reset_form() {
    resetFormAddPhoto()
    modal_titleadd.value = ''
    modal_editproject_categorie.value = ''
    button.setAttribute('disabled', true)
}
export {reset_form}

// Fonction permettant de savoir si tous les champs sont remplis afin de débloquer le bouton valider
function form_check () {
    console.log(modal_editproject_categorie.value);
    console.log(modal_titleadd.value);
    console.log(document.querySelector('.imported_image'));
    if (modal_editproject_categorie.value && modal_titleadd.value && document.querySelector('.imported_image')){
        button.removeAttribute('disabled')
    } 
    else {
        button.setAttribute('disabled', true)
    }
}


// Ecoute du bouton de la page d'accueil pour ajouter une photo et passer sur la page modal permettant l'ajout de photo
document.querySelector('.add_photo').addEventListener('click', () => {
    modalEditProjectShow();
    findFocusElementOnActualPage();
    removeWhenClose()
})


// Ecoute du bouton de l'icone flêche gauche pour revenir sur la page précédente du modal (page principal)
document.querySelector('.fa-arrow-left').addEventListener('click', () => {
    modalHomepageShow();
    modalHomeGallery()
    reset_form();
    findFocusElementOnActualPage();
})

// Ecoute de l'entrée de l'image, insertion de l'image dans une div afin de l'afficher
modal_addfile.addEventListener('change', (e) =>{
    e.preventDefault()
    e.stopPropagation()
    const file = e.target.files[0]
    if (!file.type.startwith === 'image/') return

    box_photo.setAttribute('class', hideClassModal)

    let box_imported_img = document.createElement('div')
    box_imported_img.setAttribute('class', 'add__photo__box imported')
    let image = document.createElement('img')
    image.setAttribute('class','imported_image')
    image.file = file
    box_imported_img.appendChild(image)
    form.insertBefore(box_imported_img, form.firstChild)

    const reader = new FileReader();
    reader.onload = (e) => {
        image.src = e.target.result
    };
    reader.readAsDataURL(file);

    form_check()
})

// Ecoute de l'input select afin de voir si une catégorie à été sélectionner et si les deux autres 
// champs requis sont remplis pour débloquer le bouton
modal_editproject_categorie.addEventListener('change', (e) => {
    e.stopPropagation()
    form_check()
})

// Ecoute de l'input afin de voir si un titre à été écrit et si les deux autres 
// champs requis sont remplis pour débloquer le bouton
modal_titleadd.addEventListener('change', (e) => {
    e.stopPropagation()
    form_check()
})

// Ecoute du formulaire pour éviter les comportements par défaut, notamment avec la touche entrée dans l'input
modal_editproject.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault()
})


// Ecoute du bouton de validation d'envoi de l'image
button.addEventListener('click', () => {
    // Si le bouton à l'attribue désactivé, rien ne se passe
    if (button.hasAttribute('disabled')) return

    // création de variable nécessaire au traitement, les 3 premières dans l'ordre: l'image, le titre, l'id de la catégorie
    const image = document.querySelector('.imported_image')
    const title_value = modal_titleadd.value
    const category_value = modal_editproject_categorie.value.split('_')[1]
    const messageResult = document.querySelector('.confirm')
    // Création du formulaire qui sera envoyé
    let formToSend = new FormData();

    // Ajout des données nécessaires: image, titre, id de la catégorie
    formToSend.append('image', image.file)
    formToSend.append('title', title_value)
    formToSend.append('category', category_value)

    // Permet d'envoyer la requête au serveur avec les données ainsi que le token d'autorisation
    let request = new XMLHttpRequest();
    request.open('POST', 'http://localhost:5678/api/works')
    request.setRequestHeader('Authorization', `Bearer ${T}`)

    // Traitement des réponses:
    // réponse 201: Reset de formulaire afin de pouvoir envoyer autre chose et affichage d'un message de réussite
    // Autre réponse: Une erreur s'est produite donc affichage du message d'erreur et reset de la partie formulaire ajout photo
    request.onload = (e) => {
        if (request.status === 201){
            reset_form()
            reload()
            showPositiveMessage(`Envoi de " ${title_value}" réussi`, editProjectConfirm)
            modal_change = true
        } else if (request.status === 400){
            resetFormAddPhoto()
            showNegativeMessage("L'envoi a échoué, formulaire incorrecte", editProjectConfirm)
        } else if (request.status === 401){
            resetFormAddPhoto()
            showNegativeMessage("Vous n'êtes pas authorisé à envoyer la photo", editProjectConfirm)
        } else if (request.status === 500){
            resetFormAddPhoto()
            showNegativeMessage("L'envoi a échoué, formulaire incorrecte", editProjectConfirm)
        }
    } 
    // Envoie de la requête avec en paramètre le Formdata
    request.send(formToSend)
})