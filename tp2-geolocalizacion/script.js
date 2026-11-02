let map;
let marcador;
let watchId = null;
let historial = [];
let lineaRecorrido;
map = L.map('map').setView([-24.7821, -65.4232], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);
lineaRecorrido = L.polyline([], {
  color: 'red',
  weight: 4
}).addTo(map);
document.getElementById("btnIniciar").addEventListener("click", function () {
  if (!navigator.geolocation) {
    alert("Tu navegador no permite geolocalización.");
    return;
  }
  if (watchId !== null) {
    alert("El seguimiento ya está activo.");
    return;
  }
  watchId = navigator.geolocation.watchPosition(
    actualizarUbicacion,
    mostrarError,
    { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
  );
});
function actualizarUbicacion(position) {
  const latitud = position.coords.latitude;
  const longitud = position.coords.longitude;
  const nuevaUbicacion = [latitud, longitud];
  if (!marcador) {
    marcador = L.circleMarker(nuevaUbicacion, {
      radius: 10, color: "blue", fillColor: "blue", fillOpacity: 1
    }).addTo(map);
  } else {
    marcador.setLatLng(nuevaUbicacion);
  }
  map.setView(nuevaUbicacion, 17);
  historial.push({ latitud: latitud, longitud: longitud });
  lineaRecorrido.addLatLng(nuevaUbicacion);
  mostrarHistorial();
}
function mostrarHistorial() {
  const lista = document.getElementById("listaHistorial");
  lista.innerHTML = "";
  historial.forEach(function (ubicacion, indice) {
    const item = document.createElement("li");
    item.textContent = "Ubicación " + (indice + 1) +
      " | Latitud: " + ubicacion.latitud.toFixed(6) +
      " | Longitud: " + ubicacion.longitud.toFixed(6);
    lista.appendChild(item);
  });
}
document.getElementById("btnDetener").addEventListener("click", function () {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
    alert("Seguimiento detenido.");
  } else {
    alert("No hay seguimiento activo.");
  }
});
document.getElementById("btnLimpiar").addEventListener("click", function () {
  historial = [];
  lineaRecorrido.setLatLngs([]);
  document.getElementById("listaHistorial").innerHTML =
    "<li>Aún no hay ubicaciones registradas.</li>";
});
function mostrarError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("Permiso denegado."); break;
    case error.POSITION_UNAVAILABLE:
      alert("Posición no disponible."); break;
    case error.TIMEOUT:
      alert("Tiempo agotado."); break;
    default:
      alert("Error desconocido.");
  }
}