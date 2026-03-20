import React from 'react';

const CookiePolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-background-dark text-white font-body py-16 px-6 relative">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black text-white">Política de Cookies</h1>
          <p className="text-gray-400 text-lg">Escuelas de Formación Deportiva – Universidad Nacional de Loja</p>
        </div>

        <div className="bg-surface-dark border border-white/5 rounded-2xl p-8 space-y-8">
          
          <section className="space-y-4">
            <p className="text-gray-300 leading-relaxed italic border-l-4 border-primary pl-4 py-2 bg-primary/10">
              Última actualización: 20 de marzo de 2026<br/>
              En la Universidad Nacional de Loja (UNL), nos comprometemos a proteger su privacidad y a ser transparentes sobre las tecnologías que utilizamos. Esta Política de Cookies explica qué son las cookies, cómo las utilizamos en nuestro sitio web oficial de las Escuelas de Formación Deportiva y cuáles son sus derechos para controlar su uso.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">1. ¿Qué son las cookies?</h2>
            <p className="text-gray-300 leading-relaxed">
              Las cookies son pequeños archivos de texto que se almacenan en su navegador o dispositivo cuando visita un sitio web. Permiten que el sitio web "recuerde" sus acciones o preferencias (como inicio de sesión, idioma o hábitos de navegación) durante un periodo de tiempo, para que no tenga que volver a configurarlos cada vez que regresa al sitio.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">2. Tipos de cookies que utilizamos</h2>
            <p className="text-gray-300 leading-relaxed">Nuestro sitio web utiliza las siguientes categorías de cookies:</p>
            <ul className="list-disc pl-5 text-gray-300 space-y-4">
              <li>
                <strong>Cookies Técnicas (Estrictamente Necesarias):</strong> Son esenciales para que el sitio funcione correctamente. Permiten la navegación, el acceso a áreas seguras (como el panel de inscripción de deportistas) y la gestión de la seguridad. Estas cookies no pueden ser desactivadas.
              </li>
              <li>
                <strong>Cookies de Estadística / Analíticas:</strong> Nos permiten contar las visitas y fuentes de tráfico para medir y mejorar el rendimiento de nuestro sitio. Nos ayudan a saber qué secciones son las más populares y cómo se mueven los padres de familia por la web. Toda la información es agregada y, por tanto, anónima.
              </li>
              <li>
                <strong>Cookies de Preferencias:</strong> Permiten que el sitio web recuerde información que cambia el aspecto o el comportamiento del sitio, como su región o el idioma preferido.
              </li>
              <li>
                <strong>Cookies de Terceros:</strong> Algunas funciones (como videos de entrenamientos insertados desde YouTube o mapas de ubicación) pueden utilizar cookies de proveedores externos. La UNL no controla estas cookies; le sugerimos consultar las políticas de privacidad de dichos terceros.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">3. Base Legal para el Tratamiento</h2>
            <p className="text-gray-300 leading-relaxed">
              De conformidad con la Ley Orgánica de Protección de Datos Personales (LOPDP) del Ecuador, la base legal para el uso de cookies no esenciales es su consentimiento explícito. Al ingresar al sitio, se le presentará un panel de configuración donde podrá aceptar o rechazar las cookies según su preferencia.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">4. Cuadro Detallado de Cookies</h2>
            <div className="overflow-x-auto rounded-lg border border-gray-800">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-gray-900 text-xs uppercase text-gray-300">
                  <tr>
                    <th className="px-6 py-3">Nombre de la Cookie</th>
                    <th className="px-6 py-3">Proveedor</th>
                    <th className="px-6 py-3">Finalidad</th>
                    <th className="px-6 py-3">Duración</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  <tr className="bg-surface-dark">
                    <td className="px-6 py-4 font-medium text-white">_unl_session</td>
                    <td className="px-6 py-4">Propia (UNL)</td>
                    <td className="px-6 py-4">Mantener la sesión de usuario activa.</td>
                    <td className="px-6 py-4">Sesión</td>
                  </tr>
                  <tr className="bg-surface-dark">
                    <td className="px-6 py-4 font-medium text-white">_ga</td>
                    <td className="px-6 py-4">Google Analytics</td>
                    <td className="px-6 py-4">Distinguir a los usuarios para fines estadísticos.</td>
                    <td className="px-6 py-4">2 años</td>
                  </tr>
                  <tr className="bg-surface-dark">
                    <td className="px-6 py-4 font-medium text-white">_gid</td>
                    <td className="px-6 py-4">Google Analytics</td>
                    <td className="px-6 py-4">Agrupar el comportamiento del usuario.</td>
                    <td className="px-6 py-4">24 horas</td>
                  </tr>
                  <tr className="bg-surface-dark">
                    <td className="px-6 py-4 font-medium text-white">cookie_consent</td>
                    <td className="px-6 py-4">Propia (UNL)</td>
                    <td className="px-6 py-4">Recordar si el usuario aceptó las cookies.</td>
                    <td className="px-6 py-4">1 año</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">5. ¿Cómo puede gestionar o desactivar las cookies?</h2>
            <p className="text-gray-300 leading-relaxed">Usted tiene el control total sobre las cookies de este sitio:</p>
            <ul className="list-disc pl-5 text-gray-300 pt-2 space-y-2">
              <li><strong>Banner de configuración:</strong> Al inicio de su visita, puede elegir qué categorías de cookies permite.</li>
              <li><strong>Configuración del navegador:</strong> Puede configurar su navegador para que bloquee o le avise sobre estas cookies. Tenga en cuenta que, si se bloquean las cookies técnicas, algunas partes del sitio (como los formularios de inscripción) podrían no funcionar correctamente.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">6. Actualizaciones de la Política</h2>
            <p className="text-gray-300 leading-relaxed">
              La UNL se reserva el derecho de modificar esta política para adaptarla a cambios técnicos en la web o a nuevas exigencias legales. Le recomendamos revisar este documento periódicamente para estar informado sobre cómo protegemos su privacidad.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">7. Contacto</h2>
            <p className="text-gray-300 leading-relaxed">
              Si tiene dudas sobre esta Política de Cookies o sobre cómo manejamos sus datos personales en las Escuelas de Formación Deportiva, puede contactarnos a través del correo institucional: <a href="mailto:soporte.deportes@unl.edu.ec" className="text-primary hover:underline">soporte.deportes@unl.edu.ec</a> o dirigirse a la Coordinación de Deportes en el campus universitario.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
