import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Registro from "./Registro";
import Registro2 from "./Registro2";
import Registro3 from "./Registro3";
import api from "../api"; // Asegúrate de que la ruta es correcta

const RegistroContainer = () => {
  // Estado para controlar el paso actual (1, 2 o 3)
  const [step, setStep] = useState(1);
  // Estado para acumular los datos ingresados en cada paso
  const [registrationData, setRegistrationData] = useState({});
  // Estados para mensajes de error y éxito
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Función para avanzar al siguiente paso y acumular los datos del paso actual
  const handleNextStep = (dataFromStep) => {
    setRegistrationData((prevData) => ({ ...prevData, ...dataFromStep }));
    setStep((prevStep) => prevStep + 1);
  };

  // Función para retroceder un paso (para permitir la edición de datos)
  const handlePreviousStep = () => {
    setStep((prevStep) => (prevStep > 1 ? prevStep - 1 : 1));
  };

  // Función para el envío final de los datos al backend
  const handleFinalSubmit = async (dataFromStep) => {
    const completeData = { ...registrationData, ...dataFromStep };
  
    const transformedData = { 
      nombre: completeData.nombre,
      apellido: completeData.apellido,
      cc: completeData.documento,
      fecha_nacimiento: completeData.fechaNacimiento,
      email: completeData.correo,
      password: completeData.password,
      genero: completeData.genero,
      preferencias_literarias: completeData.temaPreferencia,
      recibir_noticias: completeData.recibir_noticias,  // ✅ CORRECTO AQUÍ
      historial_compras: completeData.historial_compras || [],
      reservas: completeData.reservas || [],
    };
    console.log("Datos que se enviarán:", transformedData);
    try {
      await api.post("registrar_cliente/", transformedData);
      setSuccess("Registro completado exitosamente. Redirigiendo al login...");
      setTimeout(() => {
        navigate("/login"); 
      }, 2000);
    } catch (err) {
      console.error("Error en el registro:", err);
      console.error("Detalles del error:", err.response?.data);
      setError("Error en el registro, por favor intente de nuevo.");
    }
  };

  // Renderizamos el componente según el paso actual, pasando la prop initialData
  const renderStep = () => {
    switch (step) {
      case 1:
        return <Registro onNext={handleNextStep} initialData={registrationData} />;
      case 2:
        return <Registro2 onNext={handleNextStep} onPrevious={handlePreviousStep} initialData={registrationData} />;
      case 3:
        return <Registro3 onSubmit={handleFinalSubmit} onPrevious={handlePreviousStep} initialData={registrationData} />;
      default:
        return <Registro onNext={handleNextStep} initialData={registrationData} />;
    }
  };

  return (
    <div>
      {renderStep()}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      {success && <p className="text-green-500 text-center mt-4">{success}</p>}
    </div>
  );
};

export default RegistroContainer;