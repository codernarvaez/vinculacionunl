import React, { useState, useEffect } from 'react';
import { InputField, PrimaryButton, SelectField, TextAreaField } from '../../components/UI';
import { Link } from 'react-router-dom';
import * as yup from "yup";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { methodPOST } from '../../../api/access';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import SchoolsService from '../../../services/schools';
import type { IEscuela } from '../../../services/schools';
import { getUUIDCurrentUser } from '../../../services/auth';
import { getNamesCurrentUser } from '../../../services/auth';
import { jsPDF } from 'jspdf';
interface IFormValues {
  nombres: string;
  apellidos: string;
  cedula: string;
  fechaNac: Date | string | null;
  genero: string;
  escuela: string;
  condicionMedica: string | null;
  foto: File | null;
  aceptoTerminos: boolean;
  aceptoPrivacidad: boolean;
  aceptoImagen: boolean;
  aceptoAsentimiento?: boolean;
}

const initialValues: IFormValues = {
  nombres: "",
  apellidos: "",
  cedula: "",
  fechaNac: null,
  genero: "",
  escuela: "",
  condicionMedica: "",
  foto: null,
  aceptoTerminos: false,
  aceptoPrivacidad: false,
  aceptoImagen: false,
  aceptoAsentimiento: false
};




type SubmitData = Parameters<ReturnType<typeof useForm<IFormValues>>['handleSubmit']>[0];


const ParticipantRegister: React.FC = () => {
  const validationSchema: yup.ObjectSchema<IFormValues> = yup.object({
    nombres: yup.string().required("Los nombres son obligatorios").max(50, "Máximo 50 caracteres"),
    apellidos: yup.string().required("Los apellidos son obligatorios").max(50, "Máximo 50 caracteres"),
    cedula: yup.string().required("La cédula es obligatoria").matches(/^\d{10}$/, "Debe tener 10 dígitos"),
    fechaNac: yup
      .date()
      .nullable()
      .required("La fecha es obligatoria")
      .max(new Date(), "No puede ser futura")
      .typeError("Fecha inválida"),
    genero: yup.string().required("Obligatorio").oneOf(['MASCULINO', 'FEMENINO'], "Seleccione un género válido"),
    escuela: yup.string().required("Debe seleccionar una escuela deportiva"),
    condicionMedica: yup
      .string()
      .max(255, "Máximo 255 caracteres")
      .nullable()
      .transform((value) => (value === "" ? null : value))
      .default(null),
    foto: yup.mixed<File>().required("La foto es obligatoria"),
    aceptoTerminos: yup.boolean().oneOf([true], "Debe aceptar los términos").required(),
    aceptoPrivacidad: yup.boolean().oneOf([true], "Debe aceptar la política de privacidad").required(),
    aceptoImagen: yup.boolean().required(),
    aceptoAsentimiento: yup.boolean().when('fechaNac', (fechaNac, schema) => {
        if (!fechaNac) return schema;
        const fn = Array.isArray(fechaNac) ? fechaNac[0] : (fechaNac as any);
        if (fn) {
           const parsedFn = new Date(fn);
           const today = new Date();
           let age = today.getFullYear() - parsedFn.getFullYear();
           const m = today.getMonth() - parsedFn.getMonth();
           if (m < 0 || (m === 0 && today.getDate() < parsedFn.getDate())) {
               age--;
           }
           if (age >= 12 && age <= 17) {
               return schema.oneOf([true], "El menor debe dar su asentimiento").required("El menor debe asentir");
           }
        }
        return schema.notRequired();
    })
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const navigate = useNavigate();

  const form = useForm<IFormValues>({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema)
  });

  const [schools, setSchools] = useState<IEscuela[]>([]);

  const selectedDate = useWatch({
    control: form.control,
    name: "fechaNac",
  });

  useEffect(() => {
    const fetchSchoolsByAge = async () => {
      if (!selectedDate) {
        setSchools([]);
        form.setValue('escuela', '');
        return;
      }

      try {
        const dateString = selectedDate instanceof Date
          ? selectedDate.toISOString().split('T')[0]
          : selectedDate;

        const data = await SchoolsService.getSchoolsByDate(dateString);
        setSchools(data);

        // 3. Usa form.setValue (asegúrate de que esté disponible)
        form.setValue('escuela', '');

      } catch (error) {
        console.error("Error al filtrar escuelas:", error);
        toast.error("No hay escuelas disponibles para la edad ingresada");
        setSchools([]);
      }
    };

    fetchSchoolsByAge();
  }, [selectedDate, form]);


  const onSubmit: SubmitData = async (data) => {
    const result = await Swal.fire({
      title: '¿Confirmar registro?',
      text: '¿Estás seguro de que deseas registrar a este participante?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Sí, registrar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    try {
      const fechaFormateada = data.fechaNac instanceof Date
        ? data.fechaNac.toISOString().split('T')[0]
        : String(data.fechaNac).split('T')[0];
      const formData = new FormData();

      const representanteUUID = getUUIDCurrentUser();
      const condicionFinal = data.condicionMedica?.trim() || "Ninguna";

      formData.append('nombres', data.nombres);
      formData.append('apellidos', data.apellidos);
      formData.append('cedula', data.cedula);
      formData.append('fechaNac', fechaFormateada);
      formData.append('genero', data.genero);
      formData.append('escuela_uuid', data.escuela);
      formData.append('acepto_terminos', String(data.aceptoTerminos));
      formData.append('representante_uuid', representanteUUID || '');
      formData.append('condicionMedica', condicionFinal);

      if (data.foto) {
        formData.append('foto', data.foto);
      }

      // Generar PDF del Consentimiento Informado
      try {
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

        const text2 = `DECLARACIÓN DE ACEPTACIÓN\n\nYo, ${getNamesCurrentUser() || 'Representante'}, en mi calidad de Padre / Madre / Tutor Legal del menor ${data.nombres} ${data.apellidos}, declaro que:\n- He leído y comprendido la finalidad del tratamiento de los datos.\n- Autorizo libremente el uso de la información y registros de mi representado para los fines deportivos y académicos de la Universidad Nacional de Loja.`;
        const splitText2 = doc.splitTextToSize(text2, 180);
        doc.text(splitText2, 15, currentY);

        doc.text("Firma del Representante: _______________________", 15, currentY + 40);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 150, currentY + 40);

        // Si es mayor de 12 se agrega sección de Asentimiento
        const parsedFn = new Date(fechaFormateada);
        let age = new Date().getFullYear() - parsedFn.getFullYear();
        if (new Date().getMonth() - parsedFn.getMonth() < 0 || (new Date().getMonth() - parsedFn.getMonth() === 0 && new Date().getDate() < parsedFn.getDate())) {
            age--;
        }
        if (age >= 12 && age <= 17) {
            doc.addPage();
            doc.setFontSize(14);
            doc.text("ASENTIMIENTO PARA NIÑOS / ADOLESCENTES", 105, 20, { align: "center" });
            doc.setFontSize(10);
            const text3 = `Yo, ${data.nombres} ${data.apellidos}, de ${age} años de edad, entiendo que la UNL va a recolectar datos sobre mis entrenamientos, peso, talla, y podría tomar mis fotografías/videos.\nAl marcar SÍ, acepto participar en este seguimiento.`;
            const splitText3 = doc.splitTextToSize(text3, 180);
            doc.text(splitText3, 15, 40);
            doc.text(`Deportista: _______________________\nFecha: ${new Date().toLocaleDateString()}`, 15, 80);
        }

        // Save PDF and maybe open it
        doc.save(`Consentimiento_${data.nombres}_${data.apellidos}.pdf`);
      } catch (e) {
        console.error("No se pudo generar el PDF", e);
      }

      const response = await methodPOST('/participantes', formData);
      if (response.code === 201) {
        toast.success("Participante registrado exitosamente", {
          description: "Redirigiendo al panel de representantes..."
        });
        navigate('/athletes/dashboard');
      } else {
        toast.error("Error al registrar participante", {
          description: response.msg || "Ocurrió un error inesperado"
        });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error("Error al registrar participante", {
          description: error.message
        });
      } else {
        toast.error("Error desconocido al registrar participante");
      }
    }
  };




  return (
    <div className="min-h-screen bg-background-dark text-white font-body relative overflow-x-hidden">

      {/* Decoración de fondo unificada */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"></div>
      </div>

      <nav className="bg-surface-dark border-b border-gray-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="material-icons text-primary">sports_soccer</span>
          <span className="font-display text-2xl font-bold tracking-tighter">ACTÍVATE <span className="text-primary">UNL</span></span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium hidden sm:block text-gray-300">{getNamesCurrentUser()}</span>
          <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 border border-gray-700">
            <span className="material-icons text-sm">person</span>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-4xl mx-auto py-10 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display uppercase tracking-wider text-white">Nuevo Participante</h1>
          <p className="text-gray-400 text-sm">Complete la información para la inscripción deportiva.</p>
        </div>

        {/* Formulario */}
        <div className="bg-surface-dark border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 sm:p-8 space-y-8">

            <div className="flex flex-col md:flex-row gap-8">
              {/* Foto Subida */}
              <div className="w-full md:w-1/3 flex flex-col items-center gap-4">
                <div
                  className={`w-48 h-48 rounded-2xl border-2 border-dashed bg-black/40 flex items-center justify-center relative overflow-hidden group transition-colors cursor-pointer ${form.formState.errors.foto ? 'border-red-500/50' : 'border-gray-700 hover:border-primary'
                    }`}
                >
                  {photoPreview ? (
                    <img src={photoPreview} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <div className="text-center">
                      <span className={`material-icons text-5xl transition-colors ${form.formState.errors.foto ? 'text-red-500/50' : 'text-gray-600 group-hover:text-primary'
                        }`}>
                        add_a_photo
                      </span>
                      <p className="text-[10px] text-gray-500 uppercase font-bold mt-2">Subir Foto</p>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setPhotoPreview(URL.createObjectURL(file));
                        form.setValue('foto', file, { shouldValidate: true });
                      }
                    }}
                  />
                </div>

                {/* Mensaje de Error dinámico */}
                {form.formState.errors.foto && (
                  <p className="text-[10px] text-red-500 font-bold uppercase tracking-tighter animate-pulse">
                    {form.formState.errors.foto.message}
                  </p>
                )}

                <p className="text-[10px] text-gray-500 uppercase font-bold text-center leading-tight italic">
                  Rostro despejado • Fondo neutro • Máx 5MB
                </p>
              </div>


              {/* Inputs de Datos */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField {...form.register('nombres')} label="Nombres" id="nombres" placeholder="Ana María" error={form.formState.errors.nombres?.message || ''} />
                <InputField {...form.register('apellidos')} label="Apellidos" id="apellidos" placeholder="López García" error={form.formState.errors.apellidos?.message || ''} />
                <InputField {...form.register('cedula')} label="Cédula" id="cedula" placeholder="1234567890" error={form.formState.errors.cedula?.message || ''} />
                <InputField {...form.register('fechaNac')} label="Fecha de Nacimiento" id="fechaNac" type="date" error={form.formState.errors.fechaNac?.message || ''} />
                <SelectField {...form.register('genero')} label="Género" id="genero" options={[{ value: 'MASCULINO', label: 'Masculino' }, { value: 'FEMENINO', label: 'Femenino' }]} error={form.formState.errors.genero?.message || ''} />
                <SelectField
                  label="Escuela Deportiva"
                  id="escuela"
                  {...form.register('escuela')}
                  error={form.formState.errors.escuela?.message || ''}
                  options={
                    schools.length > 0
                      ? schools.map((school) => ({
                        value: school.uuid,
                        label: `${school.nombre} (${school.ranInferior}-${school.ranSuperior} años)`
                      }))
                      : [{ value: '', label: selectedDate ? 'No hay escuelas para esta edad' : 'Seleccione una fecha primero' }]
                  }
                  disabled={!selectedDate || schools.length === 0}
                  className={!selectedDate ? 'opacity-50 cursor-not-allowed' : ''}
                />
              </div>
            </div>

            <hr className="border-gray-800" />

            <TextAreaField
              {...form.register('condicionMedica')}
              label="Información Médica / Alergias"
              id="medico"
              placeholder="Describa cualquier condición o 'Ninguna'"
              rows={3}
              error={form.formState.errors.condicionMedica?.message || ''}
            />

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className={`bg-black/40 p-4 rounded-lg flex items-start gap-3 border ${form.formState.errors.aceptoPrivacidad ? 'border-red-500/50' : 'border-gray-800'}`}>
                  <input
                    {...form.register('aceptoPrivacidad')}
                    type="checkbox"
                    id="privacidad"
                    className="mt-1 rounded border-gray-700 bg-gray-900 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="privacidad" className="text-xs text-gray-400 leading-relaxed cursor-pointer">
                    Acepto la Política de Privacidad y el tratamiento de mis datos personales según la LOPDP.
                  </label>
                  <Link to="/politica-privacidad" target="_blank" className="text-xs text-primary hover:underline ml-auto font-medium shrink-0">
                    Leer política
                  </Link>
                </div>
                {form.formState.errors.aceptoPrivacidad && (
                  <span className="text-[10px] text-red-500 font-bold tracking-wider ml-1">
                    {form.formState.errors.aceptoPrivacidad.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <div className={`bg-black/40 p-4 rounded-lg flex items-start gap-3 border ${form.formState.errors.aceptoImagen ? 'border-red-500/50' : 'border-gray-800'}`}>
                  <input
                    {...form.register('aceptoImagen')}
                    type="checkbox"
                    id="imagen"
                    className="mt-1 rounded border-gray-700 bg-gray-900 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="imagen" className="text-xs text-gray-400 leading-relaxed cursor-pointer">
                    Autorizo el uso de mi imagen (fotografías/videos) para fines institucionales deportivos.
                  </label>
                </div>
              </div>

              {selectedDate && (() => {
                const parsedFn = new Date(selectedDate as any);
                const today = new Date();
                let age = today.getFullYear() - parsedFn.getFullYear();
                const m = today.getMonth() - parsedFn.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < parsedFn.getDate())) {
                    age--;
                }
                if (age >= 12 && age <= 17) {
                  return (
                    <div className="flex flex-col gap-2">
                      <div className={`bg-black/40 p-4 rounded-lg flex items-start gap-3 border ${form.formState.errors.aceptoAsentimiento ? 'border-red-500/50' : 'border-gray-800'}`}>
                        <input
                          {...form.register('aceptoAsentimiento')}
                          type="checkbox"
                          id="asentimiento"
                          className="mt-1 rounded border-gray-700 bg-gray-900 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                        />
                        <label htmlFor="asentimiento" className="text-xs text-gray-400 leading-relaxed cursor-pointer flex-1">
                          <span className="font-bold text-white mb-1 block">Asentimiento Informado (Menores de edad)</span>
                          He leído el Asentimiento Informado y SÍ QUIERO participar y que usen mis datos para mi entrenamiento.
                        </label>
                      </div>
                      {form.formState.errors.aceptoAsentimiento && (
                        <span className="text-[10px] text-red-500 font-bold tracking-wider ml-1">
                          {form.formState.errors.aceptoAsentimiento.message}
                        </span>
                      )}
                    </div>
                  );
                }
                return null;
              })()}

              <div className="flex flex-col gap-2">
                <div className={`bg-black/40 p-4 rounded-lg flex items-start gap-3 border ${form.formState.errors.aceptoTerminos ? 'border-red-500/50' : 'border-gray-800'}`}>
                  <input
                    {...form.register('aceptoTerminos')}
                    type="checkbox"
                    id="consent"
                    className="mt-1 rounded border-gray-700 bg-gray-900 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="consent" className="text-xs text-gray-400 leading-relaxed cursor-pointer">
                    Certifico que la información es verídica y acepto los términos y condiciones de las Escuelas de Formación UNL.
                  </label>
                  <Link to="#" className="text-xs text-primary hover:underline ml-auto font-medium shrink-0">
                    Leer términos
                  </Link>
                </div>

                {form.formState.errors.aceptoTerminos && (
                  <span className="text-[10px] text-red-500 font-bold tracking-wider ml-1">
                    {form.formState.errors.aceptoTerminos.message}
                  </span>
                )}
              </div>
            </div>

            {/* Botones de acción final */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-800">
              <Link
                to="/athletes/dashboard"
                className="px-6 py-2.5 rounded border border-red-500 text-red-500 font-bold uppercase text-xs hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
              >
                Cancelar
              </Link>
              <PrimaryButton type="submit" className="sm:w-auto px-8 text-base">
                Guardar Participante
              </PrimaryButton>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ParticipantRegister;