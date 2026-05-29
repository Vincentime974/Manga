const form = document.getElementById("animeForm");
const input = document.getElementById("animeInput");
const resultat = document.getElementById("resultat");

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const anime = input.value.trim();

    resultat.innerHTML = "Recherche en cours...";

    fetch("https://api.jikan.moe/v4/anime?q=" + encodeURIComponent(anime))
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {

            if (data.data.length === 0) {
                resultat.innerHTML = "<p>Aucun animé trouvé.</p>";
                return;
            }

            resultat.innerHTML = "";

            data.data.forEach(function(animeData) {

                resultat.innerHTML += `
                    <div class="encadrement">

                        <img src="${animeData.images.jpg.image_url}">

                        <div class="info">

                            <h2>${animeData.title}</h2>

                            <p><strong>Note :</strong> ${animeData.score}</p>

                            <p><strong>Épisodes :</strong> ${animeData.episodes}</p>

                            <p id="resume-${animeData.mal_id}">
                                Traduction...
                            </p>

                        </div>

                    </div>
                `;
            });

            data.data.forEach(function(animeData) {

                fetch("https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=fr&dt=t&q=" + encodeURIComponent(animeData.synopsis))
                    .then(function(response) {
                        return response.json();
                    })
                    .then(function(traduction) {

                        const resume = document.getElementById("resume-" + animeData.mal_id);

                        resume.innerText = traduction[0]
                            .map(function(item) {
                                return item[0];
                            })
                            .join("");
                    });
            });
        })
        .catch(function(error) {
            resultat.innerHTML = "<p>Erreur lors de la recherche.</p>";
            console.log(error);
        });
});