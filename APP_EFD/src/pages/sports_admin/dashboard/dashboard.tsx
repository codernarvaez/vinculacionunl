import { useEffect, useState, useCallback } from 'react';
import { SidebarItem, Table, TableHead, TableBody, TableRow, TableCell, Badge, IconButton, InputField, Modal, SelectField, TextAreaField, PrimaryButton } from '../../../pages/components/UI';
import { useNavigate } from 'react-router-dom';
import { logout, getNamesCurrentUser, getUUIDCurrentUser } from '../../../services/auth';
import SportsAdminService from '../../../services/sportsAdmin';
import AthletesService, { type IAthletes } from '../../../services/athletes';
import SchoolsService, { type IEscuela } from '../../../services/schools';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import * as yup from "yup";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { API_URL } from '../../../api/access';
import { ITEMSPERPAGE } from '../../../consts/consts';
import { ReportService } from '../../../services/reportService';


type ViewMode = 'ATHLETES' | 'SCHOOLS';

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
}

interface ISchoolFormValues {
    nombre: string;
    descripcion: string;
    ranInferior: number;
    ranSuperior: number;
    administrador_uuid: string | null;
}

const SportsAdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState<ViewMode>('ATHLETES');

    // States for Athletes
    const [athletes, setAthletes] = useState<IAthletes[]>([]);
    const [totalAthletes, setTotalAthletes] = useState(0);
    const [athletesLoading, setAthletesLoading] = useState(false);
    const [athleteSearch, setAthleteSearch] = useState('');
    const [debouncedAthleteSearch, setDebouncedAthleteSearch] = useState('');
    const [athletePage, setAthletePage] = useState(1);

    // Filter States
    const [selectedSchoolFilter, setSelectedSchoolFilter] = useState('');
    const [filterSchools, setFilterSchools] = useState<IEscuela[]>([]);

    // States for Schools
    const [schools, setSchools] = useState<IEscuela[]>([]);
    const [schoolsLoading, setSchoolsLoading] = useState(false);
    const [schoolSearch, setSchoolSearch] = useState('');

    // Edit Athlete Modal States
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedAthlete, setSelectedAthlete] = useState<IAthletes | null>(null);
    const [availableSchools, setAvailableSchools] = useState<IEscuela[]>([]);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    // Reports state
    const [reportsLoading, setReportsLoading] = useState(false);

    const validationSchema = yup.object({
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
        foto: yup.mixed<File>().nullable(),
        aceptoTerminos: yup.boolean().oneOf([true], "Debe aceptar los términos").required()
    });

    const form = useForm<IFormValues>({
        resolver: yupResolver(validationSchema as any),
        defaultValues: {
            nombres: "",
            apellidos: "",
            cedula: "",
            fechaNac: null,
            genero: "",
            escuela: "",
            condicionMedica: "",
            foto: null,
            aceptoTerminos: true
        }
    });

    const schoolValidationSchema = yup.object({
        nombre: yup.string().required("El nombre es obligatorio").max(100, "Máximo 100 caracteres"),
        descripcion: yup.string().required("La descripción es obligatoria").max(255, "Máximo 255 caracteres"),
        ranInferior: yup.number().typeError("Debe ser un número").required("Obligatorio").min(0, "Mínimo 0").max(99, "Máximo 99"),
        ranSuperior: yup.number().typeError("Debe ser un número").required("Obligatorio").min(yup.ref('ranInferior'), "Debe ser mayor al rango inferior").max(100, "Máximo 100")
    });

    const schoolForm = useForm<ISchoolFormValues>({
        resolver: yupResolver(schoolValidationSchema as any),
        defaultValues: {
            nombre: "",
            descripcion: "",
            ranInferior: 0,
            ranSuperior: 0
        }
    });

    // States for Schools Management Modal
    const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);
    const [isEditingSchool, setIsEditingSchool] = useState(false);
    const [editingSchool, setEditingSchool] = useState<IEscuela | null>(null);

    const selectedDate = useWatch({
        control: form.control,
        name: "fechaNac",
    });

    useEffect(() => {
        const fetchFilteredSchools = async () => {
            if (!selectedDate) {
                setAvailableSchools([]);
                return;
            }
            try {
                const dateString = selectedDate instanceof Date
                    ? selectedDate.toISOString().split('T')[0]
                    : selectedDate;
                const data = await SchoolsService.getSchoolsByDate(dateString);
                setAvailableSchools(data);
            } catch (error: unknown) {
                console.error("Error filtering schools:", error);
                if (error instanceof Error) {
                    toast.error("Error al filtrar escuelas", {
                        description: error.message
                    });
                } else {
                    toast.error("Error desconocido al filtrar escuelas");
                }
                setAvailableSchools([]);
            }
        };
        fetchFilteredSchools();
    }, [selectedDate]);

    useEffect(() => {
        const fetchAllSchoolsForFilter = async () => {
            try {
                const data = await SchoolsService.getAllSchools();
                setFilterSchools(data);
            } catch (error) {
                console.error("Error fetching schools for filter:", error);
            }
        };
        fetchAllSchoolsForFilter();
    }, []);

    const itemsPerPage = ITEMSPERPAGE;

    // --- Fetchers ---
    const fetchAthletes = useCallback(async () => {
        setAthletesLoading(true);

        try {
            const skip = (athletePage - 1) * itemsPerPage;
            const data = await SportsAdminService.getAllAthletes(skip, itemsPerPage, debouncedAthleteSearch, selectedSchoolFilter);
            setAthletes(data.items);
            setTotalAthletes(data.total);
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error("Error al cargar atletas", {
                    description: error.message
                });
            } else {
                toast.error("Error desconocido al cargar atletas");
            }
        } finally {
            setAthletesLoading(false);
        }
    }, [athletePage, debouncedAthleteSearch, itemsPerPage, selectedSchoolFilter]);

    const fetchSchools = useCallback(async () => {
        setSchoolsLoading(true);
        try {
            const data = await SchoolsService.getAllSchools();
            setSchools(data);
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error("Error al cargar escuelas", {
                    description: error.message
                });
            } else {
                toast.error("Error desconocido al cargar escuelas");
            }
        } finally {
            setSchoolsLoading(false);
        }
    }, []);

    // --- Search Debounce ---
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedAthleteSearch(athleteSearch);
            setAthletePage(1);
        }, 500);

        return () => clearTimeout(handler);
    }, [athleteSearch]);

    // --- Effects ---
    useEffect(() => {
        if (viewMode === 'ATHLETES') {
            fetchAthletes();
        } else {
            fetchSchools();
        }
    }, [viewMode, fetchAthletes, fetchSchools]);

    const totalAthletePages = Math.ceil(totalAthletes / itemsPerPage) || 1;

    // --- Handlers ---
    const handleRemoveAthleteFromSchool = async (uuid: string) => {
        const result = await Swal.fire({
            title: '¿Seguro que desea remover al atleta de su escuela actual?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Sí, remover',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;

        try {
            const success = await AthletesService.downAtheleteOfSchool(uuid);
            if (success) {
                toast.success("Atleta removido de la escuela.");
                fetchAthletes();
            } else {
                toast.error("No se pudo remover al atleta.");
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error("Error de conexión", {
                    description: error.message
                });
            } else {
                toast.error("Error de conexión desconocido");
            }
        }
    };

    const handleToggleSchoolStatus = async (uuid: string, currentStatus: boolean) => {
        const result = await Swal.fire({
            title: '¿Cambiar estado?',
            text: `¿Estás seguro de que deseas ${currentStatus ? 'desactivar' : 'habilitar'} esta escuela?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: currentStatus ? '#ef4444' : '#10b981',
            cancelButtonColor: '#6b7280',
            confirmButtonText: currentStatus ? 'Sí, desactivar' : 'Sí, habilitar',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;

        try {
            const success = await SchoolsService.changeStateSchoolbyUUID(uuid, { estado: !currentStatus });
            if (success) {
                toast.success(!currentStatus ? 'Escuela habilitada en la oferta.' : 'Escuela desactivada de la oferta.');
                fetchSchools();
            } else {
                toast.error("No se pudo cambiar el estado de la escuela.");
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error("Error de conexión", {
                    description: error.message
                });
            } else {
                toast.error("Error de conexión desconocido");
            }
        }
    };

    const handleOpenSchoolModal = (school?: IEscuela) => {
        if (school) {
            setIsEditingSchool(true);
            setEditingSchool(school);
            schoolForm.reset({
                nombre: school.nombre,
                descripcion: school.descripcion,
                ranInferior: school.ranInferior,
                ranSuperior: school.ranSuperior
            });
        } else {
            setIsEditingSchool(false);
            setEditingSchool(null);
            schoolForm.reset({
                nombre: "",
                descripcion: "",
                ranInferior: 0,
                ranSuperior: 0
            });
        }
        setIsSchoolModalOpen(true);
    };

    const onSchoolSubmit = async (data: ISchoolFormValues) => {
        try {
            const administrador_uuid = getUUIDCurrentUser();
            let success = false;
            if (isEditingSchool && editingSchool) {

                data.administrador_uuid = administrador_uuid;

                success = await SchoolsService.updateSchoolbyUUID(editingSchool.uuid, data);
                if (success) toast.success("Escuela actualizada correctamente");
            } else {
                data.administrador_uuid = administrador_uuid;
                success = await SchoolsService.createSchool(data);
                if (success) toast.success("Escuela creada correctamente");
            }

            if (success) {
                setIsSchoolModalOpen(false);
                fetchSchools();
            } else {
                toast.error("Error al procesar la solicitud");
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error("", {
                    description: error.message
                });
            } else {
                toast.error("Error de conexión desconocido");
            }
        }
    };

    // --- Report Handlers ---
    const handleGenerateGeneralReport = async () => {
        setReportsLoading(true);
        try {
            await ReportService.generateTotalInscriptionsReport();
            toast.success("Reporte general generado");
        } catch (error) {
            console.error(error);
            toast.error("Error al generar reporte general");
        } finally {
            setReportsLoading(false);
        }
    };

    const handleGenerateSchoolStatsReport = async () => {
        setReportsLoading(true);
        try {
            await ReportService.generateInscriptionsBySchoolReport();
            toast.success("Reporte por escuelas generado");
        } catch (error) {
            console.error(error);
            toast.error("Error al generar reporte por escuelas");
        } finally {
            setReportsLoading(false);
        }
    };

    const handleGenerateStudentList = async (schoolUuid: string) => {
        setReportsLoading(true);
        try {
            await ReportService.generateStudentsBySchoolReport(schoolUuid);
            toast.success("Lista de estudiantes generada");
        } catch (error) {
            console.error(error);
            toast.error("Error al generar lista de estudiantes");
        } finally {
            setReportsLoading(false);
        }
    };

    const handleAthleteSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setAthleteSearch(val);
        setAthletePage(1); // Reset page on search
    };

    const handleSchoolFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSchoolFilter(e.target.value);
        setAthletePage(1); // Reset page on filter change
    };

    const handleOpenEditModal = async (athleteUuid: string) => {
        try {
            const athlete = await AthletesService.getAthleteByUUID(athleteUuid);
            if (athlete) {
                // Pre-fetch available schools for this athlete's age
                const dateString = athlete.fechaNac.split('T')[0];
                const schoolsForAge = await SchoolsService.getSchoolsByDate(dateString);
                setAvailableSchools(schoolsForAge);

                setSelectedAthlete(athlete);
                form.reset({
                    nombres: athlete.nombres,
                    apellidos: athlete.apellidos,
                    cedula: athlete.cedula,
                    fechaNac: dateString,
                    genero: athlete.genero,
                    escuela: athlete.escuelas?.[0]?.uuid || '',
                    condicionMedica: athlete.condicionMedica || '',
                    foto: null,
                    aceptoTerminos: true
                });
                setPhotoPreview(API_URL + "/" + athlete.foto);
                setIsEditModalOpen(true);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error("Error al cargar datos del atleta", {
                    description: error.message
                });
            } else {
                toast.error("Error desconocido al cargar datos del atleta");
            }
        }
    };

    const onEditSubmit = async (data: IFormValues) => {
        if (!selectedAthlete) return;

        // 1. Confirmación con SweetAlert2
        const result = await Swal.fire({
            title: '¿Guardar cambios?',
            text: '¿Estás seguro de que deseas actualizar la información de este atleta?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Sí, guardar',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;

        try {
            // 2. Preparación del FormData (Obligatorio para enviar archivos y campos Form)
            const formData = new FormData();

            // Campos de texto básicos
            formData.append('nombres', data.nombres);
            formData.append('apellidos', data.apellidos);
            formData.append('cedula', data.cedula);
            formData.append('genero', data.genero);
            formData.append('condicionMedica', data.condicionMedica || 'Ninguna');

            // 3. Formateo de Fecha (Asegurar formato YYYY-MM-DD)
            let fechaFormateada = "";
            if (data.fechaNac instanceof Date) {
                fechaFormateada = data.fechaNac.toISOString().split('T')[0];
            } else if (typeof data.fechaNac === 'string') {
                fechaFormateada = data.fechaNac.split('T')[0];
            }
            formData.append('fechaNac', fechaFormateada);

            // 4. UUIDs de Relaciones
            // Importante: Asegúrate que selectedAthlete tenga la propiedad representante.uuid
            formData.append('escuela_uuid', data.escuela);

            // 5. Manejo Condicional de la Foto
            // Solo la enviamos si es una instancia de File (archivo nuevo seleccionado)
            if (data.foto && data.foto instanceof File) {
                formData.append('foto', data.foto);
            } else {
                // Si no hay foto nueva, enviamos null o simplemente no la adjuntamos
                // Esto depende de si tu backend acepta Optional[UploadFile] = File(None)
            }

            // 6. Llamada al Servicio
            const success = await AthletesService.putAthleteByUUID(selectedAthlete.uuid, formData);

            if (success) {
                toast.success("Atleta actualizado exitosamente");
                setIsEditModalOpen(false);
                // Refrescar la lista de atletas
                fetchAthletes();
            } else {
                toast.error("El servidor no pudo procesar la actualización");
            }

        } catch (error: unknown) {
            console.error("Error en el submit:", error);
            if (error instanceof Error) {
                toast.error("Error al actualizar atleta", {
                    description: error.message
                });
            } else {
                toast.error("Error desconocido al actualizar atleta");
            }
        }
    };

    const filteredSchools = schools.filter(s => {
        const search = schoolSearch.toLowerCase();
        return s.nombre.toLowerCase().includes(search) || s.descripcion.toLowerCase().includes(search);
    });

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-background-dark text-white font-body overflow-hidden">
            <aside className="w-64 flex flex-col bg-surface-dark border-r border-gray-800/50 relative z-20">
                <div className="h-24 flex items-center px-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
                            <span className="material-icons text-primary text-2xl">sports</span>
                        </div>
                        <h1 className="text-lg font-display font-black tracking-tighter italic">
                            UNI<span className="text-primary font-bold">SPORTS</span>
                        </h1>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                    <div className="px-4 mb-4">
                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Gestión Deportiva</p>
                    </div>
                    <div onClick={() => setViewMode('ATHLETES')} className="cursor-pointer">
                        <SidebarItem icon="directions_run" label="Atletas" active={viewMode === 'ATHLETES'} />
                    </div>
                    <div onClick={() => setViewMode('SCHOOLS')} className="cursor-pointer">
                        <SidebarItem icon="school" label="Escuelas" active={viewMode === 'SCHOOLS'} />
                    </div>
                </nav>

                <div className="p-4 border-t border-gray-800/50 bg-gray-800/20">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-emerald-400 p-0.5">
                            <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                                <span className="material-icons-outlined text-gray-400 text-sm">person</span>
                            </div>
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">{getNamesCurrentUser() || "Admin Deportivo"}</p>
                            <p className="text-[10px] text-gray-500 uppercase font-medium">Administrador</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="flex items-center justify-center w-full px-4 py-2.5 text-xs font-bold text-secondary border border-secondary/20 hover:bg-secondary/10 rounded-lg transition-all uppercase tracking-widest cursor-pointer">
                        <span className="material-icons-outlined mr-2 text-sm">logout</span>
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto relative p-6 lg:p-10">
                <div className="max-w-6xl mx-auto relative z-10">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div>
                            <h2 className="text-4xl font-display font-black uppercase tracking-tight">
                                Panel <span className="text-primary">Deportivo</span>
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">
                                {viewMode === 'ATHLETES' ? "Gestione todos los atletas y sus asignaciones." : "Administre la oferta de escuelas deportivas."}
                            </p>
                        </div>
                        {viewMode === 'SCHOOLS' && (
                            <button
                                onClick={() => handleOpenSchoolModal()}
                                className="group inline-flex items-center justify-center px-6 py-3.5 bg-primary hover:bg-emerald-400 text-black font-black rounded-xl shadow-[0_10px_20px_-5px_rgba(34,197,94,0.4)] transition-all uppercase text-xs tracking-[0.1em] active:scale-95"
                            >
                                <span className="material-icons-outlined mr-2 group-hover:rotate-90 transition-transform">add</span>
                                Nueva Escuela
                            </button>
                        )}
                    </div>

                    {/* Content Based on ViewMode */}
                    {viewMode === 'ATHLETES' ? (
                        <>
                            <div className="flex flex-col sm:flex-row justify-between items-end gap-4 mb-6">
                                <div className="w-full lg:w-2/3 flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1">
                                        <InputField
                                            id="searchAthlete"
                                            label="Buscar Atleta"
                                            placeholder="Buscar por nombre o cédula..."
                                            icon="search"
                                            value={athleteSearch}
                                            onChange={handleAthleteSearchChange}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <SelectField
                                            id="filterSchool"
                                            label="Filtrar por Escuela"
                                            value={selectedSchoolFilter}
                                            onChange={handleSchoolFilterChange}
                                            options={[
                                                { value: '', label: 'Todas las Escuelas' },
                                                ...filterSchools.map(s => ({ value: s.uuid, label: `${s.nombre} (${s.ranInferior}-${s.ranSuperior})` }))
                                            ]}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={handleGenerateGeneralReport}
                                        disabled={reportsLoading}
                                        className="flex items-center gap-2 px-4 py-2 bg-surface-dark border border-gray-800 rounded-lg text-xs font-bold text-gray-300 hover:text-white hover:border-primary transition-all disabled:opacity-50"
                                    >
                                        <span className="material-icons-outlined text-sm text-primary">analytics</span>
                                        {reportsLoading ? "Generando..." : "Reporte General"}
                                    </button>
                                    <button
                                        onClick={handleGenerateSchoolStatsReport}
                                        disabled={reportsLoading}
                                        className="flex items-center gap-2 px-4 py-2 bg-surface-dark border border-gray-800 rounded-lg text-xs font-bold text-gray-300 hover:text-white hover:border-primary transition-all disabled:opacity-50"
                                    >
                                        <span className="material-icons-outlined text-sm text-primary">pie_chart</span>
                                        {reportsLoading ? "Generando..." : "Estadísticas x Escuela"}
                                    </button>
                                </div>
                            </div>
                            <div className="bg-surface-dark rounded-xl border border-gray-800 shadow-xl overflow-hidden pt-4">
                                <div className="px-6 mb-4 flex items-center justify-between">
                                    <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                                        <span className="material-icons-outlined text-primary">groups</span>
                                        Lista de Atletas
                                    </h3>
                                    <span className="text-xs font-bold text-gray-500 bg-gray-900 px-3 py-1 rounded-full uppercase tracking-widest">
                                        Mostrando {athletes.length > 0 ? ((athletePage - 1) * itemsPerPage) + 1 : 0} - {Math.min(athletePage * itemsPerPage, totalAthletes)} de {totalAthletes}
                                    </span>
                                </div>
                                {athletesLoading ? (
                                    <div className="p-12 text-center text-gray-500"><span className="material-icons animate-spin text-3xl mb-2 text-primary">sync</span></div>
                                ) : athletes.length === 0 ? (
                                    <div className="p-12 text-center text-gray-500"><span className="material-icons text-3xl mb-2 text-gray-700">person_off</span><p>No se encontraron atletas.</p></div>
                                ) : (
                                    <Table>
                                        <TableHead>
                                            <TableCell header>Atleta</TableCell>
                                            <TableCell header>Cédula</TableCell>
                                            <TableCell header>Género</TableCell>
                                            <TableCell header>Escuela Actual</TableCell>
                                            <TableCell header className="text-right">Acciones</TableCell>
                                        </TableHead>
                                        <TableBody>
                                            {athletes.map(a => (
                                                <TableRow key={a.uuid}>
                                                    <TableCell>
                                                        <p className="font-bold text-white">{a.nombres} {a.apellidos}</p>
                                                    </TableCell>
                                                    <TableCell><span className="text-gray-400 font-mono text-xs">{a.cedula}</span></TableCell>
                                                    <TableCell>
                                                        <Badge variant={a.genero === 'MASCULINO' ? 'primary' : 'success'}>{a.genero}</Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {a.escuelas && a.escuelas.length > 0 ? (
                                                            <div className="flex flex-wrap gap-1">
                                                                {a.escuelas.map(e => (
                                                                    <div key={e.uuid} className="flex flex-col gap-0.5">
                                                                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20 font-bold uppercase w-fit">
                                                                            {e.nombre}  ({e.ranInferior} a {e.ranSuperior} años)
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <span className="text-[10px] text-gray-600 font-bold uppercase italic">Sin escuela</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <IconButton icon="edit" title="Cambiar Escuela" variant="neutral" onClick={() => handleOpenEditModal(a.uuid)} />
                                                            <IconButton icon="person_remove" title="Dar de baja de escuela" variant="danger" onClick={() => handleRemoveAthleteFromSchool(a.uuid)} />
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                                <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between bg-black/20">
                                    <p className="text-xs text-gray-500 font-medium tracking-wide">Página <span className="text-white font-bold">{athletePage}</span> de <span className="text-white font-bold">{totalAthletePages}</span></p>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => setAthletePage(p => Math.max(p - 1, 1))} disabled={athletePage === 1} className="p-1.5 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-50"><span className="material-icons-outlined text-sm">chevron_left</span></button>
                                        <button onClick={() => setAthletePage(p => Math.min(p + 1, totalAthletePages))} disabled={athletePage === totalAthletePages} className="p-1.5 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-50"><span className="material-icons-outlined text-sm">chevron_right</span></button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex flex-col sm:flex-row justify-between items-end gap-4 mb-6">
                                <div className="w-full sm:w-96">
                                    <InputField
                                        id="searchSchool"
                                        label="Buscar Escuela"
                                        placeholder="Filtrar por nombre..."
                                        icon="search"
                                        value={schoolSearch}
                                        onChange={(e) => { setSchoolSearch(e.target.value); }}
                                    />
                                </div>
                            </div>
                            <div className="bg-surface-dark rounded-xl border border-gray-800 shadow-xl overflow-hidden pt-4">
                                <div className="px-6 mb-4 flex items-center justify-between">
                                    <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                                        <span className="material-icons-outlined text-primary">school</span>
                                        Oferta de Escuelas
                                    </h3>
                                    <span className="text-xs font-bold text-gray-500 bg-gray-900 px-3 py-1 rounded-full uppercase tracking-widest">
                                        Total: {filteredSchools.length}
                                    </span>
                                </div>
                                {schoolsLoading ? (
                                    <div className="p-12 text-center text-gray-500"><span className="material-icons animate-spin text-3xl mb-2 text-primary">sync</span></div>
                                ) : filteredSchools.length === 0 ? (
                                    <div className="p-12 text-center text-gray-500"><span className="material-icons text-3xl mb-2 text-gray-700">school</span><p>No hay escuelas disponibles.</p></div>
                                ) : (
                                    <Table>
                                        <TableHead>
                                            <TableCell header>Nombre</TableCell>
                                            <TableCell header>Edades</TableCell>
                                            <TableCell header>Estado en Oferta</TableCell>
                                            <TableCell header className="text-right">Acciones</TableCell>
                                        </TableHead>
                                        <TableBody>
                                            {filteredSchools.map(s => (
                                                <TableRow key={s.uuid}>
                                                    <TableCell>
                                                        <p className="font-bold text-white">{s.nombre}</p>
                                                        <p className="text-[10px] text-gray-500 truncate max-w-[200px]">{s.descripcion}</p>
                                                    </TableCell>
                                                    <TableCell><span className="text-gray-300 font-medium text-xs">{s.ranInferior} a {s.ranSuperior} años</span></TableCell>
                                                    <TableCell>
                                                        {s.estado ? (
                                                            <Badge variant="success">Habilitada</Badge>
                                                        ) : (
                                                            <Badge variant="neutral">Inactiva</Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <IconButton icon="description" title="Lista de Estudiantes (PDF)" variant="neutral" onClick={() => handleGenerateStudentList(s.uuid)} />
                                                            <IconButton icon="edit" title="Editar Escuela" variant="neutral" onClick={() => handleOpenSchoolModal(s)} />
                                                            <IconButton icon={s.estado ? "visibility_off" : "visibility"} title={s.estado ? "Ocultar de la oferta" : "Mostrar en la oferta"} variant={s.estado ? "danger" : "primary"} onClick={() => handleToggleSchoolStatus(s.uuid, s.estado)} />
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </main>

            {/* Modal de Edición de Atleta */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Actualizar Información de Atleta"
                className="max-w-4xl"
            >
                <div className="mb-6 p-4 bg-primary/5 border border-primary/10 rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="material-icons text-primary">edit_note</span>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-tight">Formulario de Edición</h4>
                        <p className="text-[10px] text-gray-500 font-medium">Actualice los datos personales y de inscripción del deportista.</p>
                    </div>
                </div>

                <form onSubmit={form.handleSubmit(onEditSubmit)} className="space-y-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Foto Preview & Upload (Left Column) */}
                        <div className="w-full md:w-1/3 flex flex-col items-center gap-4">
                            <div className={`w-48 h-48 rounded-2xl border-2 border-dashed bg-black/40 flex items-center justify-center relative overflow-hidden group transition-colors cursor-pointer ${form.formState.errors.foto ? 'border-red-500/50' : 'border-gray-700 hover:border-primary'}`}>
                                {photoPreview ? (
                                    <img src={photoPreview} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" alt="Preview" />
                                ) : (
                                    <div className="text-center">
                                        <span className={`material-icons text-5xl transition-colors ${form.formState.errors.foto ? 'text-red-500/50' : 'text-gray-600 group-hover:text-primary'}`}>
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
                                            form.setValue('foto', file);
                                        }
                                    }}
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                    <span className="material-icons text-white">photo_camera</span>
                                </div>
                            </div>
                            {form.formState.errors.foto && (
                                <p className="text-[10px] text-red-500 font-bold uppercase tracking-tighter animate-pulse">
                                    {form.formState.errors.foto.message as string}
                                </p>
                            )}
                            <p className="text-[10px] text-gray-500 uppercase font-bold text-center leading-tight italic">
                                Rostro despejado • Fondo neutro • Máx 5MB
                            </p>
                        </div>

                        {/* Form Fields (Right Column) */}
                        <div className="flex-1">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                                <InputField {...form.register('nombres')} label="Nombres" id="nombres" icon="person" placeholder="Ana María" error={form.formState.errors.nombres?.message} />
                                <InputField {...form.register('apellidos')} label="Apellidos" id="apellidos" icon="person_outline" placeholder="López García" error={form.formState.errors.apellidos?.message} />
                                <InputField {...form.register('cedula')} label="Cédula" id="cedula" icon="badge" placeholder="1234567890" error={form.formState.errors.cedula?.message} />
                                <InputField {...form.register('fechaNac')} label="Fecha de Nacimiento" id="fechaNac" type="date" icon="calendar_today" error={form.formState.errors.fechaNac?.message} />
                                <SelectField {...form.register('genero')} label="Género" id="genero" options={[{ value: 'MASCULINO', label: 'Masculino' }, { value: 'FEMENINO', label: 'Femenino' }]} error={form.formState.errors.genero?.message} />
                                <SelectField
                                    label="Escuela Deportiva"
                                    id="escuela"
                                    {...form.register('escuela')}
                                    error={form.formState.errors.escuela?.message}
                                    options={availableSchools.map((s) => ({
                                        value: s.uuid,
                                        label: `${s.nombre} (${s.ranInferior}-${s.ranSuperior} años)`
                                    }))}
                                    disabled={!selectedDate || availableSchools.length === 0}
                                />
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-800" />

                    <TextAreaField
                        {...form.register('condicionMedica')}
                        label="Información Médica / Alergias"
                        id="medico"
                        placeholder="Describa cualquier condición o 'Ninguna'"
                        rows={3}
                        error={form.formState.errors.condicionMedica?.message}
                    />

                    <div className="pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsEditModalOpen(false)}
                            className="px-6 py-2.5 rounded border border-red-500 text-red-500 font-bold uppercase text-xs hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                        >
                            Cancelar
                        </button>
                        <PrimaryButton type="submit" className="sm:w-auto px-8 text-base">
                            Guardar Cambios
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Modal de Escuela (Crear/Editar) */}
            <Modal
                isOpen={isSchoolModalOpen}
                onClose={() => setIsSchoolModalOpen(false)}
                title={isEditingSchool ? "Editar Escuela Deportiva" : "Crear Nueva Escuela"}
                className="max-w-2xl"
            >
                <form onSubmit={schoolForm.handleSubmit(onSchoolSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                        <InputField
                            {...schoolForm.register('nombre')}
                            label="Nombre de la Escuela"
                            id="school_nombre"
                            icon="school"
                            placeholder="Ej: Escuela de Fútbol"
                            error={schoolForm.formState.errors.nombre?.message}
                        />

                        <TextAreaField
                            {...schoolForm.register('descripcion')}
                            label="Descripción"
                            id="school_descripcion"
                            placeholder="Breve descripción de la escuela..."
                            rows={3}
                            error={schoolForm.formState.errors.descripcion?.message}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <InputField
                                {...schoolForm.register('ranInferior')}
                                type="number"
                                label="Edad Mínima"
                                id="ranInferior"
                                icon="remove"
                                error={schoolForm.formState.errors.ranInferior?.message}
                            />
                            <InputField
                                {...schoolForm.register('ranSuperior')}
                                type="number"
                                label="Edad Máxima"
                                id="ranSuperior"
                                icon="add"
                                error={schoolForm.formState.errors.ranSuperior?.message}
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsSchoolModalOpen(false)}
                            className="px-6 py-2.5 rounded border border-gray-700 text-gray-400 font-bold uppercase text-xs hover:bg-gray-800 hover:text-white transition-all"
                        >
                            Cancelar
                        </button>
                        <PrimaryButton type="submit" className="sm:w-auto px-8 text-base">
                            {isEditingSchool ? "Actualizar Escuela" : "Crear Escuela"}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default SportsAdminDashboard;
