// creo constantes relacionadas al dom
const d = document,
  $table = d.querySelector(".crud-table"),
  $form = d.querySelector(".crud-form"),
  $title = d.querySelector(".crud-title"),
  $template = d.getElementById("crud-template").content,
  $fragment = d.createDocumentFragment();
$cancelar = d.getElementById("cancelar");
const getAll = async () => {
  try {
    //peticion por metodo GET
    let res = await fetch("http://localhost:3000/santos");
    json = await res.json();
    if (!res.ok) throw { status: res.status, statusText: res.statusText };

    console.log(json);
    json.forEach((el) => {
      $template.querySelector(".name").textContent = el.nombre;
      $template.querySelector(".constellation").textContent = el.constelacion;
      $template.querySelector(".edit").dataset.id = el.id;
      $template.querySelector(".edit").dataset.name = el.nombre;
      $template.querySelector(".edit").dataset.constellation = el.constelacion;
      $template.querySelector(".delete").dataset.id = el.id;
      $template.querySelector(".contImg").src = el.imagen;

      //importo un nodo (true para que copie el contenido y no sea un nodo vacio)
      //fragment para no pegar en cada inserccion al dom entonces clono el nodo ahi
      let $clone = d.importNode($template, true);
      $fragment.appendChild($clone);
    });

    //busco en el tbody y agrego el fragmento
    $table.querySelector("tbody").appendChild($fragment);
  } catch (err) {
    showMessage(err);
  }
};

d.addEventListener("DOMContentLoaded", getAll);

d.addEventListener("submit", async (e) => {
  //se ejecuta cuando el objeto que origino el evneto sea igual al que tengo en la variable form
  if (e.target === $form) {
    //desactivo el comportamiento del form que es auto-completarse
    e.preventDefault();

    if (!e.target.id.value) {
      //create-POST
      try {
        let options = {
            method: "POST",
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
              nombre: e.target.nombre.value,
              constelacion: e.target.constelacion.value,
              imagen: e.target.imagen.value,
            }),
          },
          res = await fetch("http://localhost:3000/santos", options),
          json = await res.json();

        if (!res.ok) throw { status: res.status, statusText: res.statusText };
        // location.reload();
      } catch (err) {
        showMessage(err);
      }
    } else {
      //update-PUT
      try {
        let options = {
            method: "PUT",
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
              nombre: e.target.nombre.value,
              constelacion: e.target.constelacion.value,
              imagen: e.target.imagen.value,
            }),
          },
          res = await fetch(
            `http://localhost:3000/santos/${e.target.id.value}`,
            options
          ),
          json = await res.json();

        if (!res.ok) throw { status: res.status, statusText: res.statusText };

        //location.reload();
      } catch (err) {
        showMessage(err);
      }
    }
  }
  if ($cancelar.style.display !== "none") {
    $cancelar.style.display = "none";
  }
});

//obtengo un elemento a editar
d.addEventListener("click", async (e) => {
  if (e.target.matches(".edit")) {
    $title.textContent = "Editar Santo";
    $form.nombre.value = e.target.dataset.name;
    $form.constelacion.value = e.target.dataset.constellation;
    $form.imagen.src = e.target.dataset.contImg;
    $form.id.value = e.target.dataset.id;
    $cancelar.style.display = "inline";
  }
  if (e.target.matches("#cancelar")) {
    $cancelar.style.display = "none";
    $form.nombre.value = "";
    $form.constelacion.value = "";
    $form.imagen.value = "";
  }

  //si el boton que tiene la clase delete
  if (e.target.matches(".delete")) {
    let isDelete = confirm(
      `¿Estas seguro de eliminar el id: ${e.target.dataset.id}?`
    );

    if (isDelete) {
      //Delete-DELETE
      try {
        let options = {
            method: "DELETE",
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
          },
          //el boton de eliminar tiene un dataAtribut entonces usamos dataset (e.target es el boton) (con dataset agarro el id)
          res = await fetch(
            `http://localhost:3000/santos/${e.target.dataset.id}`,
            options
          ),
          json = await res.json();

        //SI HAY UN ERROR SE MANIPULA EN EL CATCH
        if (!res.ok) throw { status: res.status, statusText: res.statusText };

        //location.reload();
      } catch (err) {
        let message = err.statusText || "Ocurrió un error";
        alert(`Error ${err.status}: ${message}`);
      }
    }
  }
});

//------------------MENSAJE DE ERROR-----------------------
function showMessage(err) {
  let message = err.statusText || "Ocurrió un error";
  $form.insertAdjacentHTML(
    "afterend",
    `<p><b>Error ${err.status}: ${message}</b></p>`
  );
}

//------------Cambio la imagen de fondo----------------------
document.addEventListener("DOMContentLoaded", cambiarImgFondo);
function cambiarImgFondo() {
  let fondo = document.querySelector(".cont-padre");
  let numeroRandom = Math.floor(Math.random() * 3);
  fondo.style.backgroundImage = `url('./img/backgroud-${numeroRandom}.jpg')`;
}
