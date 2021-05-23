class Presupuesto {
	constructor(presupuesto) {
		this.presupuesto = Number(presupuesto);
		this.restante = Number(presupuesto);
		this.gastado = 0;
		this.arrayGastos = [];
	}
	static validarPresupuesto() {
		ui.borrarMsjError();
		if (presupuestoInput.value <= 0 || isNaN(presupuestoInput.value)) {
			ui.disablePresupuesto();
			ui.mostrarErrorPresupuesto(`Ingrese un numero entero`);
			return;
		}
		ui.enablePresupuesto();
	}
	static validarNombreGasto() {
		ui.borrarMsjError();
		if (nombreGasto.value === "" || !isNaN(nombreGasto.value)) {
			ui.disableAgregarGasto();
			ui.mostrarErrorGasto(`Ingrese una cadena de texto`);
			return;
		}
		Presupuesto.validarCamposGasto();
	}
	static validarPrecioGasto() {
		ui.borrarMsjError();
		if (precioGasto.value <= 0 || isNaN(precioGasto.value)) {
			ui.disableAgregarGasto();
			ui.mostrarErrorGasto(`Ingrese un numero entero`);
			return;
		}
		Presupuesto.validarCamposGasto();
	}
	static validarCamposGasto() {
		if (
			isNaN(nombreGasto.value) &&
			nombreGasto.value !== "" &&
			precioGasto.value > 0 &&
			!isNaN(precioGasto.value)
		) {
			ui.enableAgregarGasto();
		}
	}
	actualizarRestante() {
		this.gastado = this.arrayGastos.reduce(
			(accum, gasto) => accum + gasto.precioGasto,
			0
		);
		this.restante = this.presupuesto - this.gastado;
	}
}

class UI {
	constructor() {}
	mostrarErrorPresupuesto(msj) {
		const templateError = document.querySelector("#template-error").content;
		templateError.querySelector("#error-paragraph").textContent = msj;
		const clone = templateError.cloneNode(true);

		if (formularioPresupuesto.querySelectorAll("#error").length === 0) {
			formularioPresupuesto.appendChild(clone);
		}
	}
	mostrarErrorGasto(msj) {
		const templateError = document.querySelector("#template-error").content;
		templateError.querySelector("#error-paragraph").textContent = msj;
		const clone = templateError.cloneNode(true);

		if (formularioGastos.querySelectorAll("#error").length === 0) {
			formularioGastos.appendChild(clone);
		}
	}
	borrarMsjError() {
		if (document.querySelector("#error")) {
			document.querySelector("#error").remove();
		}
	}
	disablePresupuesto() {
		const submit = document.querySelector("#submit-presupuesto");
		submit.disabled = true;
		submit.classList.remove("cursor-allowed");
		submit.classList.add("cursor-not-allowed", "opacity-50");
	}
	enablePresupuesto() {
		const submit = document.querySelector("#submit-presupuesto");
		submit.disabled = false;
		submit.classList.add("cursor-allowed");
		submit.classList.remove("cursor-not-allowed", "opacity-50");
	}
	disableAgregarGasto() {
		const submit = document.querySelector("#submit-gasto");
		submit.disabled = true;
		submit.classList.remove("cursor-allowed");
		submit.classList.add("cursor-not-allowed", "opacity-50");
	}
	enableAgregarGasto() {
		const submit = document.querySelector("#submit-gasto");
		submit.disabled = false;
		submit.classList.add("cursor-allowed");
		submit.classList.remove("cursor-not-allowed", "opacity-50");
	}
	resetForm() {
		formularioPresupuesto.reset();
		formularioGastos.reset();
		this.disableAgregarGasto();
		this.disablePresupuesto();
	}
	mostrarPresupuesto({ presupuesto, restante, gastado }) {
		if (document.querySelector("#contenedor-presupuesto")) {
			document.querySelector("#contenedor-presupuesto").remove();
		}
		const listaGastos = document.querySelector("#listado-gastos");
		const templatePresupuesto = document.querySelector(
			"#template-presupuesto"
		).content;
		templatePresupuesto.querySelector("#presupuesto-actual").textContent =
			presupuesto;
		templatePresupuesto.querySelector("#presupuesto-restante").textContent =
			restante;
		if (gastado >= presupuesto - presupuesto * 0.3) {
			templatePresupuesto
				.querySelector("#contenedor-presupuesto__restante")
				.classList.remove("bg-green", "bg-orange");
			templatePresupuesto
				.querySelector("#contenedor-presupuesto__restante")
				.classList.add("bg-red");
		} else if (gastado >= presupuesto - presupuesto * 0.6) {
			templatePresupuesto
				.querySelector("#contenedor-presupuesto__restante")
				.classList.remove("bg-green", "bg-red");
			templatePresupuesto
				.querySelector("#contenedor-presupuesto__restante")
				.classList.add("bg-orange");
		} else {
			templatePresupuesto
				.querySelector("#contenedor-presupuesto__restante")
				.classList.remove("bg-red", "bg-orange");
			templatePresupuesto
				.querySelector("#contenedor-presupuesto__restante")
				.classList.add("bg-green");
		}
		const clone = templatePresupuesto.cloneNode(true);
		listaGastos.appendChild(clone);
	}
	mostrarGastos() {
		this.limpiarHTML();
		const listaGastos = document.querySelector("#listado-gastos__ul");
		const fragment = document.createDocumentFragment();
		const templateGasto = document.querySelector("#template-gasto").content;
		arrayGastos.forEach((gasto) => {
			const { nombreGasto, precioGasto, id } = gasto;
			templateGasto.querySelector("#gasto-nombre").textContent = nombreGasto;
			templateGasto.querySelector(
				"#gasto-precio"
			).textContent = `$${precioGasto}`;
			templateGasto.querySelector("#gasto").setAttribute("data-id", id);
			const clone = templateGasto.cloneNode(true);
			fragment.appendChild(clone);
		});

		listaGastos.appendChild(fragment);
	}
	limpiarHTML() {
		const listaGastosUL = document.querySelector("#listado-gastos__ul");
		while (listaGastosUL.firstChild) {
			listaGastosUL.removeChild(listaGastosUL.firstChild);
		}
	}
	borrarGasto(id) {
		arrayGastos = arrayGastos.filter((gasto) => gasto.id !== id);
	}
	presupuestoInsuficiente() {
		this.mostrarErrorGasto("No hay fondos suficientes disponibles");
	}
	ocultarPresupuesto() {
		const presupuesto = document.querySelector("#presupuesto");
		presupuesto.classList.add("hidden");
		const main = document.querySelector("#main");
		main.classList.remove("hidden");
	}
}
const ui = new UI();
let presupuesto;
const iniciarApp = () => {
	ui.resetForm();
	ui.disablePresupuesto();
	ui.disableAgregarGasto();
};
// Variables
let arrayGastos = [];
const listaGastosUL = document.querySelector("#listado-gastos__ul");
// Formulario presupuesto
const formularioPresupuesto = document.querySelector("#formulario-presupuesto");
const presupuestoInput =
	formularioPresupuesto.querySelector("#presupuesto-input");
// Formulario Gastos
const formularioGastos = document.querySelector("#formulario-gasto");
const nombreGasto = formularioGastos.querySelector("#nombre-gasto");
const precioGasto = formularioGastos.querySelector("#precio-gasto");
const loadEventListeners = () => {
	presupuestoInput.addEventListener("blur", Presupuesto.validarPresupuesto);
	formularioPresupuesto.addEventListener("submit", (e) => {
		e.preventDefault();
		ui.limpiarHTML();
		presupuesto = new Presupuesto(presupuestoInput.value);
		arrayGastos = [];
		ui.ocultarPresupuesto();
		ui.mostrarPresupuesto(presupuesto);
	});
	nombreGasto.addEventListener("blur", Presupuesto.validarNombreGasto);
	precioGasto.addEventListener("blur", Presupuesto.validarPrecioGasto);
	formularioGastos.addEventListener("submit", (e) => {
		e.preventDefault();
		const objGasto = {
			nombreGasto: nombreGasto.value,
			precioGasto: Number(precioGasto.value),
			id: Date.now(),
		};
		if (presupuesto.gastado + objGasto.precioGasto > presupuesto.presupuesto) {
			ui.presupuestoInsuficiente();
			return;
		}
		arrayGastos = [...arrayGastos, objGasto];
		presupuesto.arrayGastos = arrayGastos;
		presupuesto.actualizarRestante();
		ui.mostrarPresupuesto(presupuesto);
		ui.mostrarGastos();
		ui.resetForm();
	});
	listaGastosUL.addEventListener("click", (e) => {
		const id = Number(e.target.parentElement.getAttribute("data-id"));
		ui.borrarGasto(id);
		presupuesto.arrayGastos = arrayGastos;
		presupuesto.actualizarRestante();
		ui.mostrarPresupuesto(presupuesto);
		ui.mostrarGastos();
	});
	document.addEventListener("load", iniciarApp);
	document.addEventListener("DOMContentLoaded", iniciarApp);
};
loadEventListeners();
