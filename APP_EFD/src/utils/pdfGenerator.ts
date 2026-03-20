import { jsPDF } from 'jspdf';
import type { IAthletes } from '../services/athletes';
import { API_URL } from '../api/access';

export const generateAthletePdf = async (athlete: IAthletes) => {
    // Estándar ISO/IEC 7810 ID-1: 85.6 x 53.98 mm
    const doc = new jsPDF({
        orientation: 'l', // Horizontal
        unit: 'mm',
        format: [85.6, 54]
    });

    const primaryColor = '#D90429'; //gris
    const darkBg = '#fff';
    const surfaceColor = '#fff';
    const textColor = '#000';
    const subTextColor = '#02051A';

    // --- Capa Base (Fondo) ---
    doc.setFillColor(darkBg);
    doc.rect(0, 0, 85.6, 54, 'F');

    // Decoración: Franja lateral derecha elegante
    doc.setFillColor(primaryColor);
    doc.rect(82.6, 0, 3, 54, 'F');

    // Panel de datos (Efecto superficie)
    doc.setFillColor(surfaceColor);
    doc.roundedRect(36, 8, 43, 38, 2, 2, 'F');

    // --- Logo ---
    const logoUrl = '/unl_0_2.png';
    try {
        const logoData = await getBase64Image(logoUrl);
        doc.addImage(logoData, 'PNG', 8, 6, 22, 8);
    } catch (e) {
        doc.setTextColor(primaryColor);
        doc.setFontSize(8);
        doc.text('UNISPORTS', 8, 10);
    }

    // --- Foto del Atleta (Diseño Circular/Cuadrado Pulido) ---
    const photoUrl = athlete.foto ? `${API_URL}/${athlete.foto}` : 'https://via.placeholder.com/150';
    try {
        const photoData = await getBase64Image(photoUrl);

        // Marco de la foto
        doc.setDrawColor(primaryColor);
        doc.setLineWidth(0.5);
        doc.rect(8, 18, 24, 28, 'D'); // Rectángulo proporcional para cédula
        doc.addImage(photoData, 'JPEG', 8.25, 18.25, 23.5, 27.5);
    } catch (e) {
        doc.setFillColor(surfaceColor);
        doc.rect(8, 18, 24, 28, 'F');
    }

    // --- Nombre y Apellido ---
    doc.setTextColor(textColor);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    const name = athlete.nombres.toUpperCase();
    const surname = athlete.apellidos.toUpperCase();
    doc.text(name, 39, 15);
    doc.text(surname, 39, 19);

    // Etiqueta "DEPORTISTA" (Badge)
    doc.setFillColor(primaryColor);
    doc.roundedRect(39, 21, 20, 4, 1, 1, 'F');
    doc.setTextColor(darkBg);
    doc.setFontSize(6);
    doc.text('DEPORTISTA', 49, 24, { align: 'center' });

    // --- Detalles (Columna Derecha) ---
    const drawInfo = (label: string, value: string, y: number) => {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(subTextColor);
        doc.setFontSize(5.5);
        doc.text(label.toUpperCase(), 39, y);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(textColor);
        doc.setFontSize(7);
        // Truncar texto si es muy largo para la escuela
        const displayValue = value.length > 25 ? value.substring(0, 25) + '...' : value;
        doc.text(displayValue, 39, y + 3.5);
    };

    drawInfo('Cédula de Identidad', athlete.cedula || '0000000000', 30);
    drawInfo('Escuela Deportiva', athlete.escuelas?.[0]?.nombre || 'Sin escuela asignada', 38);
    drawInfo('Categoría', athlete.escuelas?.[0]?.ranInferior + ' - ' + athlete.escuelas?.[0]?.ranSuperior, 46);


    doc.setTextColor(subTextColor);
    doc.text('ACTIVATE UNL', 79, 50, { align: 'right' });

    // Descarga
    doc.save(`ID_${athlete.cedula}_${athlete.apellidos}.pdf`);
};

const getBase64Image = async (url: string): Promise<string> => {
    try {
        const cleanUrl = `${url}${url.includes('?') ? '&' : '?'}nocache=${Date.now()}`;

        const response = await fetch(cleanUrl, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Cache-Control': 'no-cache'
            }
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const blob = await response.blob();

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error("Fetch failed, falling back to Image object", error);

        // Fallback to the traditional method
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.setAttribute('crossOrigin', 'anonymous');
            // Adding a timestamp to bypass cache, which sometimes causes CORS issues if the previous request didn't have CORS headers
            img.src = url + (url.includes('?') ? '&' : '?') + 't=' + new Date().getTime();

            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0);
                    const dataURL = canvas.toDataURL('image/jpeg', 0.8);
                    resolve(dataURL);
                } catch (e) {
                    reject(new Error("CORS blocking canvas export"));
                }
            };
            img.onerror = (e) => reject(e);
        });
    }
};
