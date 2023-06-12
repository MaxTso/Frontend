import { local } from "./api.js";
const login = document.querySelector("#loginform");
const error = document.createElement('p');
error.setAttribute('class', 'error');
error.style.color = 'red';
error.style.textAlign = 'center';

function displayError(message){
	const errorElement = document.getElementById('login__error')
	errorElement.innerText = message
	errorElement.style.visibility = 'visible'
	errorElement.classList.add('negative')
	const timeOfError = setTimeout(() => {
		errorElement.style.visibility = 'hidden'
		clearTimeout(timeOfError)
	}, 3000)
}


// Recherche de l'élément login dans le menu de navigation afin de lui appliquer des propriétés spécifique
document.querySelectorAll('nav li').forEach(value => {
	if (value.innerText == "login"){
		value.setAttribute('class', 'onPage')
	}
})


// Ajout de l'event listener sur le bouton de connexion et envoie des données du formulaire à l'API pour vérification
login.addEventListener("submit", (e) => {
	e.preventDefault();
	const data = new FormData(e.currentTarget);
	const jsondata = JSON.stringify({email:data.get('mail'), password:data.get('password')})
	fetchCredential(jsondata)
});

// Fonction d'envoie des données à l'API et d'écoute de la réponse
async function fetchCredential(jsonbody) {
	// Envoi des données du formulaire
	const f = await fetch(`${local}api/users/login`, {
		method:'POST',
		headers: {
			Accept: "application/json",
			"Content-type":"application/json"
		},
		body: jsonbody
	});
	// Ecoute de la réponse
	const previousError = document.querySelector('.error');
	if (f.status == 200) {
		// Si la réponse est ok, on enlève l'erreur si il y en a eu une. 
		const data = await f.json();
		// Puis on stock les données réponses dans le session storage du navigateur
		sessionStorage.setItem('hdr_user', data['userId']);
		sessionStorage.setItem('hdr_t', data['token']);
		window.location.href = '../index.html'
	} else if (f.status == 401){
		// Et on affiche la raison actuelle
		displayError("Vous n'êtes pas authorisé à entrer")
	} else if (f.status == 404) {
		// Pareil que l'erreur ci dessus mais avec une raison d'erreur différente.
		displayError("Aucun utilisateur trouvé")
	}
}