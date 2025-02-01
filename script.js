document.getElementById('loginButton').addEventListener('click', function() {
    alert('Próximamente: Página de inicio de sesión.');
    // Aquí puedes redirigir a la página de login cuando esté lista.
});
document.getElementById('trainingForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que la página se recargue al enviar

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    fetch("https://script.google.com/u/0/home/projects/13ZOBUsBuQxyZDkYd8VQbOI9gVTguDCw8ss2poiO4D9RVEXVnak8Ytsum/edit", { // Sustituye con tu URL de Google Apps Script
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(() => {
        alert("Formulario enviado con éxito.");
        this.reset();
    })
    .catch(error => console.error("Error al enviar datos:", error));
});
