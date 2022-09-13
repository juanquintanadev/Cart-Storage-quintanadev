// primero vamos a crear las variables seleccionando elementos

// VARIABLES
const carrito = document.querySelector('#carrito');
// creamos el contenedor donde van a ir a parar los cursos seleccionados, seleccionamos con el id y la etiqueta del body de la tabla
const contenedorCarrito = document.querySelector('#lista-carrito tbody')
// seleccionamos el boton de vaciar carrito para luego asignarle un evento
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#lista-cursos');
// vamos a crear un arreglo que va a ser un carrito de compras, el cual vamos a ir llenando con los clicks
let articulosCarrito = [];


cargarEventos();
function cargarEventos() {
    // cuando agregas un curso presionando agregar carrito
    listaCursos.addEventListener('click', agregarCurso);

    // elimina cursos del carrito
    carrito.addEventListener('click', eliminarCurso);

    // muestra los cursos cargados desde el local storage
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];// luego aca traemos del local storage la info y la cargamos al array
        // si el local esta vacio, devuelve null y este va a dar error, entonces ponemos el or para cargar un arreglo vacio y asi nuestras validaciones no fallan
        carritoHTML();
    });

    // vacia el carrito de cursos
    vaciarCarritoBtn.addEventListener('click', () => {
        // reseteamos el arreglo
        articulosCarrito = [];
        // limpiamos el html tambien
        limpiarHTML();
    });
};

// FUNCIONES
function agregarCurso(e) {
    e.preventDefault();
    // para saber a cual curso estamos dando click tenemos que hacer un TRAVERSING y subir de clases hasta llegar a la descripcion de ese curso
    // conectamos con los botones de agregar al carrito
    if (e.target.classList.contains('agregar-carrito')) {
        const cursoSeleccionado = e.target.parentElement.parentElement; // aqui hacemos TRAVERSING y llegamos al card principal
        leerDatosCurso(cursoSeleccionado);
    };
};

// ahora vamos a leer el contenido del html al que le dimos click y extrae la informacion del curso

function leerDatosCurso(curso) {
    // console.log(curso); 

    // aca vamos a crear un objeto con el contenido del curso actual
    const contenidoCurso = {
        imagen: curso.querySelector('img').src, // lo unico que me interesa de la imagen es el src source de donde esta la imagen, con un punto y su atributo
        nombreCurso: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'), // con esto seleccionamos el enlace y obtenemos el valor que esta en el atributo data-id
        cantidad: 1, // al momento de presionar en agregar el curso la cantidad se pone en 1
    };
    // console.log(contenidoCurso);

    // revisar si un elemento ya existe en el carrito antes de agregarlo nuevamente
    // con some permite iterar sobre un arreglo de objetos y verificar si un elemento existe en el, es como un foreach pero de objetos y sobre cada curso cargado, buscamos su id y lo comparamos con el que se esta seleccionando
    const existe = articulosCarrito.some(curso => curso.id === contenidoCurso.id);
    if (existe) {
        // actualizamos la cantidad seleccionada
        const cursos = articulosCarrito.map(curso => {
            if (curso.id === contenidoCurso.id) {
                curso.cantidad++;
                return curso; // retornamos el curso actualizado con su cantidad
            } else {
                return curso; // aun asi tenemos que retornar un curso porque sino los perdemos a los que no son iguales
            };
        });
        articulosCarrito = [...cursos]; // tomamos el arreglo nuevo que creo el map y lo copiamos en el principal
    } else {
        // ahora vamos a agregar los cursos seleccionados y los vamos agregando al arreglo de articulos
        articulosCarrito = [...articulosCarrito, contenidoCurso];
    };
    console.log(articulosCarrito);
    // aca una vez cargado el arreglo con los datos del curso, llamamos a la funcion para cargarlo al carrito HTML 
    // dentro de ella se limpia lo que habia cargado para cargar lo actualizado en el arreglo
    carritoHTML();
};

// funcion para eliminar curso
function eliminarCurso(e) {
    if(e.target.classList.contains('borrar-curso')){
        // guardamos el id del curso que estamos dando click
        const cursoId = e.target.getAttribute('data-id');
        // eliminamos utilizando filter y con el data-id guardado en la variable donde trae todos los elementos distintos al que tiene el id q queremos eliminar
        // por lo tanto actualizamos el arreglo principal sin ese elemento
        articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId);
        carritoHTML(); // volvemos a iterar sobre el carrito y mostramos su HTML
    };
};
    

// muestra la parte del carrito de compras en la pagina HTML
function carritoHTML() {
    // necesitamos limpiar el contenido HTML porque va a ir agregando lo que habia en el HTML mas el arreglo de carrito
    limpiarHTML();

    // agregamos el HTML al carrito de compras recorriendo el carrito de arreglo 
    articulosCarrito.forEach(curso => {
        // creamos un table road para ir cargando los data con el contenido
        const row = document.createElement('tr');
        // mejoramos nuestro codigo haciendo un destructuring
        const {imagen, nombreCurso, precio, cantidad, id} = curso;
        // inyectamos el html con el contenido del curso a la variable de la etiqueta con tr
        row.innerHTML = `<td>
                            <img src="${imagen}" width=100>
                        </td>
                        <td>${nombreCurso}</td>
                        <td>${precio}</td>
                        <td>${cantidad}</td>
                        <td>
                            <a href="#" class="borrar-curso" data-id="${id}">X</a>
                        </td>`;
        // y aca insertamos el codigo al contenedor principal con el tbody seleccionado al principio
        contenedorCarrito.appendChild(row);
    });

    // una vez limpiado el html y cargado los nuevos elementos para que no se repitan
    // sincronizamos al local storage
    sincronizarStorage();
};

function sincronizarStorage() {
    localStorage.setItem('carrito',JSON.stringify(articulosCarrito));
}

function limpiarHTML() {
    // forma lenta de limpiar el html
    // contenedorCarrito.innerHTML = '';

    // esta forma de limpiar tiene mejor performance
    // lo que hace este codigo es si el padre tiene un hijo, entonces elimina su primer hijo, hasta que la comprobacion ya no tenga hijos se eliminan todos
    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    };
};

