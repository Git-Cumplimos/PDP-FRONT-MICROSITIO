import { useState } from "react";
import "./App.css";
import classes from "./App.module.css";

function App() {
  const [formData, setFormData] = useState({
    tipoDocumento: "CC",
    numeroDocumento: "",
    nombre: "",
    apellido: "",
    nombreEmpresa: "",
    numeroCelular: "",
    validarNumeroCelular: "",
    correoElectronico: "",
    validacionCorreoElectronico: "",
  });

  const isFormValid = () => {
    for (let key in formData) {
      // Excepción para cuando tipoDocumento es "NIT"
      if (formData.tipoDocumento === "NIT") {
        if (key === "nombre" || key === "apellido") {
          continue; // Omite la validación de estos campos
        }
      } else {
        if (key === "nombreEmpresa") {
          continue; // Omite la validación de este campo
        }
      }
      if (formData[key].trim() === "") {
        return false;
      }
    }
    return true;
  };

  const onChangeFormat = (ev) => {
    const name = ev.target.name;
    let value = ev.target.value;

    if (name === "tipoDocumento") {
      setFormData((d) => ({
        ...d,
        tipoDocumento: value,
      }));
    }

    if (name === "numeroDocumento") {
      if (value.match(/\D+/g)) {
        return;
      }
      setFormData((d) => ({
        ...d,
        numeroDocumento: value,
      }));
    }

    if (name === "nombreEmpresa") {
      const regex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ ]+$/;
      if (regex.test(value) || value === "") {
        setFormData((d) => ({
          ...d,
          nombreEmpresa: value,
        }));
      } else {
        return;
      }
    }

    if (name === "nombre" || name === "apellido") {
      const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]*$/;
      if (regex.test(value) || value === "") {
        setFormData((d) => ({
          ...d,
          [name]: value,
        }));
      } else {
        return;
      }
    }

    if (name === "numeroCelular" || name === "validarNumeroCelular") {
      const regex = /^3\d{0,9}$/;

      if (!value.startsWith("3")) {
        ev.target.setCustomValidity("El número debe empezar con un 3.")
      }
      if (regex.test(value) || value === "") {
        setFormData((d) => ({
          ...d,
          [name]: value,
        }));
      } else {
        return;
      }
    }

    if (name === "correoElectronico") {
      const inputValue = value;
      setFormData((d) => ({
        ...d,
        [name]: inputValue,
      }));
    }

    setFormData((old) => ({
      ...old,
      [name]: value,
    }));
  };

  const { formulario, contenedor, flex, margenImagen, realizarPago, cancelar } = classes;

  const validateNumber = (phone) => {
    const regex = /^3\d{9}$/;
    return regex.test(phone);
  };

  const validateEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };

  const sendForm = () => {
    if (isFormValid()) {
      const data = `
        tipoDocumento: ${formData.tipoDocumento},
        numeroDocumento: ${formData.numeroDocumento},
        nombre: ${formData.nombre},
        apellido: ${formData.apellido},
        nombreEmpresa: ${formData.nombreEmpresa},
        numeroCelular: ${formData.numeroCelular},
        validarNumeroCelular: ${formData.validarNumeroCelular},
        correoElectronico: ${formData.correoElectronico},
        validacionCorreoElectronico: ${formData.validacionCorreoElectronico}`;
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        };
        fetch('http://localhost:8000/backend/pasarela-pagos/consulta-datos-usuario', requestOptions)
        .then(response => response.json())
        .then(data => console.log(data));
    }
  };

  const cleanForm = () => {
    setFormData({
      tipoDocumento: "CC",
      numeroDocumento: "",
      nombre: "",
      apellido: "",
      nombreEmpresa: "",
      numeroCelular: "",
      validarNumeroCelular: "",
      correoElectronico: "",
      validacionCorreoElectronico: "",
    });
  };

  return (
    <>
      <div className={contenedor}>
        <img className={margenImagen} src="https://d3b4nuu4etccm0.cloudfront.net/assets/img/LogoGou.png" alt="logo Gou" />

        <form
          className={formulario}
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className={flex}>
            <label htmlFor="tipoDocumento">Tipo de documento</label>
            <select name="tipoDocumento" id="tipoDocumento" value={formData.tipoDocumento} onChange={onChangeFormat}>
              <option value="CC">Cédula de Ciudadania</option>
              <option value="CE">Cédula de Extranjeria</option>
              <option value="TI">Tarjeta de Identidad</option>
              <option value="NIT">Número de Identificacion Tributaria (NIT)</option>
              <option value="RUT">Registro Unico Tributario (RUT)</option>
            </select>
          </div>
          <div className={flex}>
            <label htmlFor="numeroDocumento">Número de documento</label>
            <input
              type="tel"
              name="numeroDocumento"
              autoComplete="off"
              value={formData.numeroDocumento}
              minLength={5}
              maxLength={11}
              onChange={onChangeFormat}
              onInvalid={(e) => e.target.setCustomValidity("Por favor, Ingrese al menos 5 caracteres.")}
              onInput={(e) => e.target.setCustomValidity("")}
              required
            />
          </div>
          {/* {renderComponent()} */}
          {formData.tipoDocumento === "NIT" ? (
            <>
              <label htmlFor="nombreEmpresa">Nombre Empresa</label>
              <input
                type="text"
                name="nombreEmpresa"
                autoComplete="off"
                value={formData.nombreEmpresa}
                onChange={onChangeFormat}
                onInvalid={(e) => e.target.setCustomValidity("Ingrese un nombre no incluir caracteres especiales")}
                onInput={(e) => e.target.setCustomValidity("")}
                required
                pattern="^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ ]+$"
              />
            </>
          ) : (
            <>
              <div className={flex}>
                <label htmlFor="nombre">Nombres</label>
                <input
                  type="text"
                  name="nombre"
                  autoComplete="off"
                  value={formData.nombre}
                  maxLength="40"
                  onChange={onChangeFormat}
                  onInvalid={(e) => e.target.setCustomValidity("Ingrese un nombre no incluir números o caracteres especiales.")}
                  onInput={(e) => e.target.setCustomValidity("")}
                  required
                />
              </div>
              <div className={flex}>
                <label htmlFor="apellido">Apellidos</label>
                <input
                  type="text"
                  name="apellido"
                  autoComplete="off"
                  value={formData.apellido}
                  maxLength="40"
                  onChange={onChangeFormat}
                  onInvalid={(e) => e.target.setCustomValidity("Ingrese un apellido no incluir números o caracteres especiales.")}
                  onInput={(e) => e.target.setCustomValidity("")}
                  required
                />
              </div>
            </>
          )}
          <div className={flex}>
            <label htmlFor="numeroCelular">Número de Celular</label>
            <input
              type="tel"
              name="numeroCelular"
              autoComplete="off"
              value={formData.numeroCelular}
              onChange={onChangeFormat}
              onBlur={(e) => {
                if (!validateNumber(e.target.value)) {
                  e.target.setCustomValidity("El número debe comenzar con 3 y tener exactamente 10 dígitos.");
                } else {
                  e.target.setCustomValidity("");
                }
              }}
              onInput={(e) => {e.target.setCustomValidity("")}}
              required
            />
          </div>
          <div className={flex}>
            <label htmlFor="validarNumeroCelular">Confirmar Número de Celular</label>
            <input
              type="tel"
              name="validarNumeroCelular"
              autoComplete="off"
              value={formData.validarNumeroCelular}
              onPaste={(e) => {
                e.preventDefault();
              }}
              onChange={onChangeFormat}
              onBlur={(e) => {
                if (e.target.value !== formData.numeroCelular) {
                  e.target.setCustomValidity("Los números no coinciden.");
                } else {
                  e.target.setCustomValidity("");
                }
              }}
              onInvalid={(e) => {
                e.target.setCustomValidity("Los números no coinciden o no es un número válido.");
              }}
              onInput={(e) => e.target.setCustomValidity("")}
              required
            />
          </div>

          <div className={flex}>
            <label htmlFor="correoElectronico">Correo Electrónico</label>
            <input
              type="text"
              name="correoElectronico"
              autoComplete="off"
              value={formData.correoElectronico}
              onChange={onChangeFormat}
              onBlur={(e) => {
                if (!validateEmail(e.target.value)) {
                  e.target.setCustomValidity("Por favor, ingrese una dirección de correo válida, Ejm: username@gmail.com.");
                }
              }}
              onInvalid={(e) => e.target.setCustomValidity("El correo electrónico ingresado no es válido, intente de nuevo.")}
              onInput={(e) => e.target.setCustomValidity("")}
              required
            />
          </div>
          <div className={flex}>
            <label htmlFor="validacionCorreoElectronico">Confirmar Correo Electrónico</label>
            <input
              type="text"
              name="validacionCorreoElectronico"
              autoComplete="off"
              value={formData.validacionCorreoElectronico}
              onPaste={(e) => {
                e.preventDefault();
              }}
              onChange={(e) => {
                const inputValue = e.target.value;
                setFormData((d) => ({
                  ...d,
                  validacionCorreoElectronico: inputValue,
                }));
                e.target.setCustomValidity("");
              }}
              onBlur={(e) => {
                if (e.target.value !== formData.correoElectronico) {
                  e.target.setCustomValidity("El correo electrónico no coincide.");
                } else if (!validateEmail(e.target.value)) {
                  e.target.setCustomValidity("Por favor, ingrese una dirección de correo válida, Ejm: username@gmail.com.");
                } else {
                  e.target.setCustomValidity("");
                }
              }}
              onInvalid={(e) => e.target.setCustomValidity("El correo electrónico ingresado no es válido, intente de nuevo.")}
              onInput={(e) => e.target.setCustomValidity("")}
              required
            />
          </div>
          <button
            className={realizarPago}
            onClick={() => {
              sendForm();
            }}
          >
            Realizar Pago
          </button>
          <button
            className={cancelar}
            onClick={(e) => {
              e.preventDefault();
              cleanForm();
            }}
          >
            Cancelar
          </button>
        </form>
      </div>
    </>
  );
}

export default App;
