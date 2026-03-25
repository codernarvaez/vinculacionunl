import { jsPDF } from 'jspdf';
import type { IAthletes } from '../services/athletes';

export const generateAssentPdf = (athlete: IAthletes, representativeName: string) => {
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text("CONSENTIMIENTO INFORMADO PARA REPRESENTANTES LEGALES", 105, 20, { align: "center" });
  doc.setFontSize(10);
  doc.text("Escuelas de Formación Deportiva – Universidad Nacional de Loja (UNL)", 105, 28, { align: "center" });

  doc.setFontSize(10);
  const text1 = "1. Información General\nLa Universidad Nacional de Loja, a través de sus Escuelas de Formación Deportiva, busca no solo el desarrollo físico de sus estudiantes, sino también la generación de conocimiento técnico y científico que mejore los procesos de entrenamiento. Por ello, solicitamos su autorización para el tratamiento de los datos de su representado(a).\n\n2. ¿Qué datos recolectamos y para qué?\nAl firmar este documento, usted autoriza la recopilación y tratamiento de:\n- Datos de Identidad: Nombres, apellidos, fecha de nacimiento y número de cédula del menor y su representante.\n- Datos de Salud y Antropometría: Peso, talla, índice de masa corporal, historial de lesiones y condiciones médicas preexistentes.\n- Datos de Rendimiento: Resultados de pruebas físicas, técnicas y tácticas durante los entrenamientos y competencias.\n- Registro Audiovisual: Fotografías y videos de las actividades deportivas con fines de análisis técnico, registro institucional o promoción de las escuelas.";

  const splitText1 = doc.splitTextToSize(text1, 180);
  doc.text(splitText1, 15, 40);

  const currentY = doc.getTextDimensions(splitText1).h + 45;

  const text2 = `DECLARACIÓN DE ACEPTACIÓN\n\nYo, ${representativeName || 'Representante'}, en mi calidad de Padre / Madre / Tutor Legal del menor ${athlete.nombres} ${athlete.apellidos}, declaro que:\n- He leído y comprendido la finalidad del tratamiento de los datos.\n- Autorizo libremente el uso de la información y registros de mi representado para los fines deportivos y académicos de la Universidad Nacional de Loja.`;
  const splitText2 = doc.splitTextToSize(text2, 180);
  doc.text(splitText2, 15, currentY);

  doc.text("Firma del Representante: _______________________", 15, currentY + 40);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 150, currentY + 40);

  // Calcular edad para el asentimiento
  const parsedFn = new Date(athlete.fechaNac);
  let age = new Date().getFullYear() - parsedFn.getFullYear();
  if (new Date().getMonth() - parsedFn.getMonth() < 0 || (new Date().getMonth() - parsedFn.getMonth() === 0 && new Date().getDate() < parsedFn.getDate())) {
    age--;
  }

  // Si es mayor de 12 se agrega sección de Asentimiento
  if (age >= 12 && age <= 17) {
    doc.addPage();
    doc.setFontSize(14);
    doc.text("ASENTIMIENTO PARA NIÑOS / ADOLESCENTES", 105, 20, { align: "center" });
    doc.setFontSize(10);
    const text3 = `Yo, ${athlete.nombres} ${athlete.apellidos}, de ${age} años de edad, entiendo que la UNL va a recolectar datos sobre mis entrenamientos, peso, talla, y podría tomar mis fotografías/videos.\nAl marcar SÍ, acepto participar en este seguimiento.`;
    const splitText3 = doc.splitTextToSize(text3, 180);
    doc.text(splitText3, 15, 40);
    doc.text(`Deportista: _______________________\nFecha: ${new Date().toLocaleDateString()}`, 15, 80);
  }

  doc.save(`Consentimiento_${athlete.nombres}_${athlete.apellidos}.pdf`);
};
