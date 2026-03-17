import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import AthletesService from './athletes';
import SchoolsService from './schools';

export class ReportService {
    private static readonly primaryColor = [16, 185, 129]; // #10b981 (Emerald)
    private static readonly headerBg: [number, number, number] = [249, 250, 251]; // #f9fafb (Gray 50)
    private static readonly textColor: [number, number, number] = [17, 24, 39]; // #111827 (Gray 900)
    private static readonly mutedTextColor: [number, number, number] = [107, 114, 128]; // #6b7280 (Gray 500)

    private static initDoc(title: string) {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Header Rect
        doc.setFillColor(this.headerBg[0], this.headerBg[1], this.headerBg[2]);
        doc.rect(0, 0, pageWidth, 45, 'F');

        // Logo/Brand
        doc.setTextColor(this.primaryColor[0], this.primaryColor[1], this.primaryColor[2]);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.text('UNISPORTS', 15, 22);

        doc.setFontSize(10);
        doc.setTextColor(this.mutedTextColor[0], this.mutedTextColor[1], this.mutedTextColor[2]);
        doc.text('UNIVERSIDAD NACIONAL DE LOJA', 15, 28);

        // Report Title
        doc.setTextColor(this.textColor[0], this.textColor[1], this.textColor[2]);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(title.toUpperCase(), 15, 40);

        // Date and decorative line
        doc.setFontSize(9);
        doc.setTextColor(this.mutedTextColor[0], this.mutedTextColor[1], this.mutedTextColor[2]);
        doc.text(`Generado el: ${new Date().toLocaleString()}`, pageWidth - 15, 22, { align: 'right' });

        doc.setDrawColor(this.primaryColor[0], this.primaryColor[1], this.primaryColor[2]);
        doc.setLineWidth(1.5);
        doc.line(0, 45, pageWidth, 45);

        return doc;
    }

    private static addFooter(doc: jsPDF) {
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.setFontSize(8);
        doc.setTextColor(this.mutedTextColor[0], this.mutedTextColor[1], this.mutedTextColor[2]);
        doc.text('© UNISPORTS - Sistema de Gestión de Escuelas de Formación Deportiva UNL', pageWidth / 2, pageHeight - 15, { align: 'center' });
        doc.text(`Página ${doc.internal.pages.length - 1}`, pageWidth - 15, pageHeight - 15, { align: 'right' });
    }

    static async generateTotalInscriptionsReport() {
        const athletes = await AthletesService.getAllAthletes();
        const doc = this.initDoc('Reporte General de Inscripciones');

        let y = 60;
        doc.setFontSize(12);
        doc.setTextColor(this.textColor[0], this.textColor[1], this.textColor[2]);
        doc.setFont('helvetica', 'bold');
        doc.text('Resumen Ejecutivo', 15, y);

        y += 10;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(`Este reporte detalla el estado actual de todas las inscripciones en el sistema UNISPORTS.`, 15, y);

        y += 15;
        autoTable(doc, {
            startY: y,
            head: [['Concepto', 'Total']],
            body: [
                ['Total de Estudiantes Inscritos', athletes.length.toString()],
                ['Inscripciones Activas', athletes.length.toString()],
                ['Escuelas con Registros', new Set(athletes.map(a => a.escuelas?.[0]?.uuid)).size.toString()]
            ],
            theme: 'striped',
            headStyles: { fillColor: this.primaryColor as [number, number, number] },
            styles: { fontSize: 10, cellPadding: 5 }
        });

        this.addFooter(doc);
        doc.save('Reporte_General_UNISPORTS.pdf');
    }

    static async generateInscriptionsBySchoolReport() {
        const athletes = await AthletesService.getAllAthletes();
        const schools = await SchoolsService.getAllSchools();

        const doc = this.initDoc('Estadísticas por Escuela');

        const schoolStats = schools.map(school => {
            const count = athletes.filter(a => a.escuelas?.[0]?.uuid === school.uuid).length;
            return { nombre: school.nombre, count };
        }).sort((a, b) => b.count - a.count);

        let y = 60;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Distribución de Estudiantes por Escuela', 15, y);

        // Add a simple bar chart
        y += 15;
        const chartLeft = 50;
        const maxCount = Math.max(...schoolStats.map(s => s.count), 1);
        const barMaxWidth = 120;

        schoolStats.forEach((stat) => {
            if (y > 250) {
                this.addFooter(doc);
                doc.addPage();
                this.initDoc('Estadísticas por Escuela');
                y = 60;
            }

            doc.setFontSize(8);
            doc.setTextColor(this.textColor[0], this.textColor[1], this.textColor[2]);
            doc.text(stat.nombre, 15, y + 4, { maxWidth: 32 });

            const barWidth = (stat.count / maxCount) * barMaxWidth;
            doc.setFillColor(this.primaryColor[0], this.primaryColor[1], this.primaryColor[2]);
            doc.rect(chartLeft, y, barWidth, 6, 'F');

            doc.setFont('helvetica', 'bold');
            doc.text(stat.count.toString(), chartLeft + barWidth + 3, y + 4.5);
            doc.setFont('helvetica', 'normal');

            y += 12;
        });

        y += 10;
        autoTable(doc, {
            startY: y,
            head: [['Escuela Deportiva', 'Número de Inscritos']],
            body: schoolStats.map(s => [s.nombre, s.count.toString()]),
            theme: 'grid',
            headStyles: { fillColor: this.primaryColor as [number, number, number] },
            margin: { left: 15, right: 15 }
        });

        this.addFooter(doc);
        doc.save('Reporte_Escuelas_UNISPORTS.pdf');
    }

    static async generateStudentsBySchoolReport(schoolUuid: string) {
        const schools = await SchoolsService.getAllSchools();
        const school = schools.find(s => s.uuid === schoolUuid);
        if (!school) throw new Error('Escuela no encontrada');

        const athletes = await AthletesService.getAllAthletes();
        const filteredAthletes = athletes.filter(a => a.escuelas?.[0]?.uuid === schoolUuid);

        const doc = this.initDoc(`Listado: ${school.nombre}`);

        let y = 60;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('Detalles de la Escuela', 15, y);

        y += 8;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(`Rango de Edad: ${school.ranInferior} - ${school.ranSuperior} años`, 15, y);
        doc.text(`Total de Estudiantes: ${filteredAthletes.length}`, 100, y);

        y += 15;
        autoTable(doc, {
            startY: y,
            head: [['#', 'Nombres y Apellidos', 'Cédula', 'Género']],
            body: filteredAthletes.map((a, i) => [
                (i + 1).toString(),
                `${a.nombres} ${a.apellidos}`,
                a.cedula,
                a.genero || 'N/A'
            ]),
            headStyles: { fillColor: [55, 65, 81] }, // Darker for lists
            theme: 'striped',
            margin: { left: 15, right: 15 }
        });

        this.addFooter(doc);
        doc.save(`Lista_${school.nombre.replace(/\s+/g, '_')}.pdf`);
    }
}
