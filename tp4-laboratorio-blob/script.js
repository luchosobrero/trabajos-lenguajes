    let blobActual = null;
const texto = document.getElementById("texto");
const estado = document.getElementById("estado");
const contenido = document.getElementById("contenido");
const tipoBlob = document.getElementById("tipoBlob");

function mostrarEstado(mensaje, correcto = false) {
    estado.querySelector("span:last-child").textContent = mensaje;
    estado.classList.toggle("correcto", correcto);
}

function crearBlob() {
    const textoIngresado = texto.value.trim();
    if (!textoIngresado) {
        mostrarEstado("Escribí algún texto antes de crear el BLOB.");
        contenido.textContent = "No se pudo crear el BLOB porque el contenido está vacío.";
        tipoBlob.textContent = "Sin contenido";
        return;
    }
    blobActual = new Blob([textoIngresado], { type: "text/plain" });
    mostrarEstado(`BLOB creado correctamente · ${blobActual.size} bytes`, true);
    contenido.textContent = textoIngresado;
    tipoBlob.textContent = `type: ${blobActual.type} · size: ${blobActual.size} bytes`;
}

function descargarBlob() {
    if (!blobActual) {
        crearBlob();
    }
    if (!blobActual) {
        return;
    }
    const url = URL.createObjectURL(blobActual);
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = "archivo-blob.txt";
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    URL.revokeObjectURL(url);
    mostrarEstado("Archivo BLOB descargado como «archivo-blob.txt».", true);
}

async function usarSlice() {
    if (!blobActual) {
        crearBlob();
    }
    if (!blobActual) {
        return;
    }
    const inicio = 0;
    const fin = Math.min(25, blobActual.size);
    const fragmento = blobActual.slice(inicio, fin, "text/plain");
    const textoFragmento = await fragmento.text();
    
    contenido.textContent = `BLOB original (${blobActual.size} bytes):\n${texto.value}\n\nSlice [${inicio}:${fin}] (${fragmento.size} bytes):\n${textoFragmento}`;
    tipoBlob.textContent = `slice() → ${fragmento.size} bytes`;
    mostrarEstado(`Slice aplicado: se tomaron los primeros ${fragmento.size} bytes.`, true);
}

document.getElementById("crearBlob").addEventListener("click", crearBlob);
document.getElementById("descargarBlob").addEventListener("click", descargarBlob);
document.getElementById("usarSlice").addEventListener("click", usarSlice);