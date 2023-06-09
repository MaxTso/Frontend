const login = document.querySelector("#loginform");
const error = document.createElement('p');
error.setAttribute('class', 'error');
error.style.color = 'red';
error.style.textAlign = 'center';

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
	const f = await fetch('http://localhost:5678/api/users/login', {
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
		if (previousError !== null) {
			previousError.remove();
		}
		const data = await f.json();
		// Puis on stock les données réponses dans le session storage du navigateur
		sessionStorage.setItem('hdr_user', data['userId']);
		sessionStorage.setItem('hdr_t', data['token']);
		window.location.href = '../index.html'
	} else if (f.status == 401){
		// Si il y a une erreur, on enlève la précédente erreur qui n'as potentiellement rien à voir avec celle ci
		if (previousError !== null) {
			previousError.remove();
		}
		// Et on affiche la raison actuelle
		error.innerText = "Vous n'êtes pas authorisé à entrer"
		login.insertBefore(error, login.firstChild);
	} else if (f.status == 404) {
		// Pareil que l'erreur ci dessus mais avec une raison d'erreur différente.
		if (previousError !== null) {
			previousError.remove();
		}
		error.innerText = "Aucun utilisateur trouvé"
		login.insertBefore(error, login.firstChild);
	} throw new Error("Impossible de contacter l'api")
}