import { useEffect, useState, useCallback } from 'react';
import { SidebarItem, Table, TableHead, TableBody, TableRow, TableCell, Badge, IconButton, InputField } from '../../../pages/components/UI';
import { Link } from 'react-router-dom';
import { logout, getNamesCurrentUser } from '../../../services/auth';
import SportsAdminService from '../../../services/sportsAdmin';
import type { IAthletes } from '../../../services/athletes';
import type { IEscuela } from '../../../services/schools';
import { toast } from 'sonner';

type ViewMode = 'ATHLETES' | 'SCHOOLS';

const SportsAdminDashboard: React.FC = () => {
    const [viewMode, setViewMode] = useState<ViewMode>('ATHLETES');

    // States for Athletes
    const [athletes, setAthletes] = useState<IAthletes[]>([]);
    const [totalAthletes, setTotalAthletes] = useState(0);
    const [athletesLoading, setAthletesLoading] = useState(false);
    const [athleteSearch, setAthleteSearch] = useState('');
    const [athletePage, setAthletePage] = useState(1);

    // States for Schools
    const [schools, setSchools] = useState<IEscuela[]>([]);
    const [totalSchools, setTotalSchools] = useState(0);
    const [schoolsLoading, setSchoolsLoading] = useState(false);
    const [schoolSearch, setSchoolSearch] = useState('');
    const [schoolPage, setSchoolPage] = useState(1);

    const itemsPerPage = 5;

    // --- Fetchers ---
    const fetchAthletes = useCallback(async () => {
        setAthletesLoading(true);
        try {
            const skip = (athletePage - 1) * itemsPerPage;
            const data = await SportsAdminService.getAllAthletes(skip, itemsPerPage, athleteSearch);
            setAthletes(data.items);
            setTotalAthletes(data.total);
        } catch (error) {
            toast.error("Error al cargar atletas");
        } finally {
            setAthletesLoading(false);
        }
    }, [athletePage, athleteSearch, itemsPerPage]);

    const fetchSchools = useCallback(async () => {
        setSchoolsLoading(true);
        try {
            const skip = (schoolPage - 1) * itemsPerPage;
            const data = await SportsAdminService.getAllSchools(skip, itemsPerPage);
            setSchools(data.items);
            setTotalSchools(data.total);
        } catch (error) {
            toast.error("Error al cargar escuelas");
        } finally {
            setSchoolsLoading(false);
        }
    }, [schoolPage, itemsPerPage]);

    // --- Effects ---
    useEffect(() => {
        if (viewMode === 'ATHLETES') {
            fetchAthletes();
        } else {
            fetchSchools();
        }
    }, [viewMode, fetchAthletes, fetchSchools]);

    const totalAthletePages = Math.ceil(totalAthletes / itemsPerPage) || 1;
    const totalSchoolPages = Math.ceil(totalSchools / itemsPerPage) || 1;

    // --- Handlers ---
    const handleRemoveAthleteFromSchool = async (uuid: string) => {
        if (!confirm("¿Seguro que desea remover al atleta de su escuela actual?")) return;

        try {
            const success = await SportsAdminService.updateAthleteSchool(uuid, ''); // Backend likely expects empty string or specific ID for no school
            if (success) {
                toast.success("Atleta removido de la escuela.");
                fetchAthletes();
            } else {
                toast.error("No se pudo remover al atleta.");
            }
        } catch (e) { toast.error("Error de conexión"); }
    };

    const handleToggleSchoolStatus = async (uuid: string, currentStatus: boolean) => {
        try {
            const success = await SportsAdminService.toggleSchoolStatus(uuid, !currentStatus);
            if (success) {
                setSchools(schools.map(s => s.uuid === uuid ? { ...s, estado: !currentStatus } : s));
                toast.success(!currentStatus ? 'Escuela habilitada en la oferta.' : 'Escuela desactivada de la oferta.');
            } else {
                toast.error("No se pudo cambiar el estado de la escuela.");
            }
        } catch (e) { toast.error("Error de conexión"); }
    };

    const handleAthleteSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setAthleteSearch(val);
        setAthletePage(1); // Reset page on search
    };

    // Note: The schools endpoint doesn't seem to have a 'q' param in docs, but we'll apply client-side filtering if needed or just fetch all.
    // Given the schools endpoint docs, it only has skip/limit.
    const filteredSchools = schools.filter(s => {
        const search = schoolSearch.toLowerCase();
        return s.nombre.toLowerCase().includes(search) || s.descripcion.toLowerCase().includes(search);
    });

    return (
        <div className="flex h-screen bg-background-dark text-white font-body overflow-hidden">
            <aside className="w-64 flex flex-col bg-[#0d0f12] border-r border-gray-800/50 relative z-20">
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

                <div className="p-4 border-t border-gray-800/50 bg-black/20">
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
                    <Link to="/login" onClick={logout} className="flex items-center justify-center w-full px-4 py-2.5 text-xs font-bold text-secondary border border-secondary/20 hover:bg-secondary/10 rounded-lg transition-all uppercase tracking-widest">
                        <span className="material-icons-outlined mr-2 text-sm">logout</span>
                        Cerrar Sesión
                    </Link>
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
                            <button className="group inline-flex items-center justify-center px-6 py-3.5 bg-primary hover:bg-emerald-400 text-black font-black rounded-xl shadow-[0_10px_20px_-5px_rgba(34,197,94,0.4)] transition-all uppercase text-xs tracking-[0.1em] active:scale-95">
                                <span className="material-icons-outlined mr-2 group-hover:rotate-90 transition-transform">add</span>
                                Nueva Escuela
                            </button>
                        )}
                    </div>

                    {/* Content Based on ViewMode */}
                    {viewMode === 'ATHLETES' ? (
                        <>
                            <div className="flex flex-col sm:flex-row justify-between items-end gap-4 mb-6">
                                <div className="w-full sm:w-96">
                                    <InputField
                                        id="searchAthlete"
                                        label="Buscar Atleta"
                                        placeholder="Buscar por nombre o cédula..."
                                        icon="search"
                                        value={athleteSearch}
                                        onChange={handleAthleteSearchChange}
                                    />
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
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <IconButton icon="edit" title="Cambiar Escuela" variant="neutral" />
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
                                        onChange={(e) => { setSchoolSearch(e.target.value); setSchoolPage(1); }}
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
                                        Mostrando {totalSchools > 0 ? ((schoolPage - 1) * itemsPerPage) + 1 : 0} - {Math.min(schoolPage * itemsPerPage, totalSchools)} de {totalSchools}
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
                                                            <IconButton icon="edit" title="Editar Escuela" variant="neutral" />
                                                            <IconButton icon={s.estado ? "visibility_off" : "visibility"} title={s.estado ? "Ocultar de la oferta" : "Mostrar en la oferta"} variant={s.estado ? "danger" : "primary"} onClick={() => handleToggleSchoolStatus(s.uuid, s.estado)} />
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                                <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between bg-black/20">
                                    <p className="text-xs text-gray-500 font-medium tracking-wide">Página <span className="text-white font-bold">{schoolPage}</span> de <span className="text-white font-bold">{totalSchoolPages}</span></p>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => setSchoolPage(p => Math.max(p - 1, 1))} disabled={schoolPage === 1} className="p-1.5 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-50"><span className="material-icons-outlined text-sm">chevron_left</span></button>
                                        <button onClick={() => setSchoolPage(p => Math.min(p + 1, totalSchoolPages))} disabled={schoolPage === totalSchoolPages} className="p-1.5 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-50"><span className="material-icons-outlined text-sm">chevron_right</span></button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default SportsAdminDashboard;
