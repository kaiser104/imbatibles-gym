document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que la página se recargue

    const formData = new FormData(this);
    const data = {
        nombres: formData.get('nombres'),
        apellidos: formData.get('apellidos'),
        tipoDocumento: formData.get('tipoDocumento'),
        documento: formData.get('documento'),
        email: formData.get('email'),
        celular: formData.get('celular'),
        fechaNacimiento: formData.get('fechaNacimiento'),
        objetivo: Array.from(formData.getAll('objetivo')), // Obtener todos los objetivos seleccionados
        descripcionObjetivo: formData.get('descripcionObjetivo'),
        talla: formData.get('talla'),
        peso: formData.get('peso')
    };

    fetch("https://script.google.com/macros/s/AKfycby-5CzLfyubqk4kdfUS7TqVGovYdhgKuBaHHVCfJ0HQ479RaFUAQnpCRzkwW3Y-QLRZLg/exec", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.text())
    .then(() => {
        alert("Registro exitoso.");
        this.reset(); // Limpia el formulario
    })
    .catch(error => console.error("Error al enviar datos:", error));
});