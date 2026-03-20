import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-background-dark text-white font-body py-16 px-6 relative">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black text-white">Política de Privacidad y LOPDP</h1>
          <p className="text-gray-400 text-lg">Escuelas de Formación Deportiva – Universidad Nacional de Loja</p>
        </div>

        <div className="bg-surface-dark border border-white/5 rounded-2xl p-8 space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">1. Responsable del Tratamiento</h2>
            <p className="text-gray-300 leading-relaxed">
              La <strong>Universidad Nacional de Loja (UNL)</strong>, con domicilio en la ciudad de Loja, Ecuador, a través de su coordinación de Escuelas de Formación Deportiva, es la responsable del tratamiento de sus datos personales y los de su representado.
            </p>
            <ul className="list-disc pl-5 text-gray-300">
              <li><strong>Contacto:</strong> proteccion.datos@unl.edu.ec</li>
              <li><strong>Dirección:</strong> Ciudad Universitaria "Guillermo Falconí Espinosa", Loja - Ecuador.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">2. Marco Legal</h2>
            <p className="text-gray-300 leading-relaxed">Esta política se rige estrictamente por:</p>
            <ul className="list-disc pl-5 text-gray-300 space-y-2">
              <li>La Constitución de la República del Ecuador (Art. 66, numeral 19).</li>
              <li>La Ley Orgánica de Protección de Datos Personales (LOPDP), publicada en el Registro Oficial Suplemento 459 del 26 de mayo de 2021.</li>
              <li>Normativa técnica emitida por la Superintendencia de Protección de Datos.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">3. Finalidades del Tratamiento</h2>
            <p className="text-gray-300 leading-relaxed">Los datos recolectados a través de este sitio web y los formularios de inscripción serán tratados para las siguientes finalidades:</p>
            <ul className="list-decimal pl-5 text-gray-300 space-y-2">
              <li><strong>Gestión Administrativa:</strong> Registro, matriculación y control de asistencias a las escuelas deportivas.</li>
              <li><strong>Seguimiento Deportivo:</strong> Evaluación del rendimiento físico, técnico y médico del deportista.</li>
              <li><strong>Seguridad Médica:</strong> Atención preventiva basada en el historial de salud y contacto en caso de emergencias.</li>
              <li><strong>Comunicación Institucional:</strong> Notificaciones sobre horarios, eventos, competencias y noticias de la UNL.</li>
              <li><strong>Uso de Imagen:</strong> Registro fotográfico y audiovisual de actividades deportivas para difusión académica e institucional (previo consentimiento).</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">4. Tratamiento de Datos de Menores</h2>
            <p className="text-gray-300 leading-relaxed">
              Dado que nuestra actividad se dirige principalmente a menores de edad, la UNL aplica protocolos reforzados de seguridad. El tratamiento de estos datos solo se realiza bajo el consentimiento explícito del padre, madre o representante legal, velando siempre por el interés superior del menor y su derecho a la intimidad.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">5. Derechos del Titular (Derechos ARCO+)</h2>
            <p className="text-gray-300 leading-relaxed">De acuerdo con la LOPDP, usted tiene derecho a solicitar en cualquier momento:</p>
            <ul className="list-disc pl-5 text-gray-300 space-y-2">
              <li><strong>Acceso:</strong> Conocer qué datos tenemos y cómo los usamos.</li>
              <li><strong>Eliminación:</strong> Solicitar la supresión de datos cuando ya no sean necesarios o el tratamiento sea ilícito.</li>
              <li><strong>Rectificación y Actualización:</strong> Corregir información inexacta o desactualizada.</li>
              <li><strong>Oposición:</strong> Oponerse al tratamiento de sus datos para fines específicos.</li>
              <li><strong>Portabilidad:</strong> Recibir sus datos en un formato compatible para transferirlos a otro responsable.</li>
            </ul>
            <p className="text-gray-300 pt-2">Para ejercer estos derechos, debe enviar una solicitud escrita al correo oficial de contacto.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">6. Medidas de Seguridad</h2>
            <p className="text-gray-300 leading-relaxed">
              Implementamos medidas técnicas, organizativas y jurídicas para evitar la pérdida, robo, uso indebido o acceso no autorizado a la información, incluyendo encriptación de datos en el sitio web y acceso restringido a servidores institucionales.
            </p>
          </section>
        </div>

        <div className="bg-surface-dark border border-white/5 rounded-2xl p-8 space-y-6 mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Consentimiento Informado - Representantes Legales</h2>
            <p className="text-gray-300 leading-relaxed">
              La Universidad Nacional de Loja, a través de sus Escuelas de Formación Deportiva, busca no solo el desarrollo físico de sus estudiantes, sino también la generación de conocimiento técnico y científico que mejore los procesos de entrenamiento. Por ello, solicitamos su autorización para el tratamiento de los datos de su representado(a).
            </p>
            <p className="text-gray-300 leading-relaxed">
              <strong>Compromiso de Confidencialidad y Seguridad:</strong> Almacenamos datos en sistemas seguros. No compartimos información personal con terceros ajenos sin autorización. Para cualquier publicación científica, los datos serán anonimizados.
            </p>
            <div className="flex justify-center mt-6">
                <button 
                  onClick={() => window.print()}
                  className="bg-primary text-black font-bold px-6 py-3 rounded flex items-center gap-2 hover:bg-opacity-90 transition-colors"
                >
                  <span className="material-icons">download</span>
                  Descargar Política de Privacidad (PDF)
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
