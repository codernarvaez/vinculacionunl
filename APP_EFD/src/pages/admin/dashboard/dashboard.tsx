import { useEffect, useState, useCallback } from 'react';
import { SidebarItem, Table, TableHead, TableBody, TableRow, TableCell, Badge, IconButton, InputField, Modal, SelectField, PrimaryButton } from '../../../pages/components/UI';
import { Link } from 'react-router-dom';
import { logout, getNamesCurrentUser } from '../../../services/auth';
import AdminService, { type AdminUser, type Role } from '../../../services/admin';
import { toast } from 'sonner';
import { ITEMSPERPAGE } from '../../../consts/consts';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const AdminDashboard: React.FC = () => {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = ITEMSPERPAGE;

    // Modals state
    // const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [roles, setRoles] = useState<Role[]>([]);
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

    // Schemas
    // const createAdminSchema = yup.object({
    //     nombres: yup.string().required("Los nombres son obligatorios"),
    //     apellidos: yup.string().required("Los apellidos son obligatorios"),
    //     correo: yup.string().email("Ingresa un correo válido").required("El correo es obligatorio"),
    //     clave: yup.string().min(6, "La contraseña debe tener al menos 6 caracteres").required("La contraseña es obligatoria")
    // });

    const roleSchema = yup.object({
        rol_uuid: yup.string().required("El rol es obligatorio")
    });

    // // Forms Hooks
    // const createForm = useForm<CreateAdminData>({
    //     resolver: yupResolver(createAdminSchema),
    //     defaultValues: { nombres: '', apellidos: '', correo: '', clave: '' }
    // });

    const roleForm = useForm<{ rol_uuid: string }>({
        resolver: yupResolver(roleSchema),
        defaultValues: { rol_uuid: '' }
    });

    const totalPages = Math.ceil(totalUsers / itemsPerPage) || 1;

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const skip = (currentPage - 1) * itemsPerPage;
            const data = await AdminService.getUsers(skip, itemsPerPage, debouncedSearch);
            setUsers(data.items);
            setTotalUsers(data.total);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Error al cargar la lista de usuarios.");
        } finally {
            setLoading(false);
        }
    }, [currentPage, itemsPerPage, debouncedSearch]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1);
        }, 500);

        return () => clearTimeout(handler);
    }, [searchTerm]);

    const fetchRoles = useCallback(async () => {
        try {
            const data = await AdminService.getRoles();
            setRoles(data);
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    }, []);

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    const handleOpenRoleModal = (user: AdminUser) => {
        setSelectedUser(user);
        roleForm.setValue('rol_uuid', user.cuenta.rol?.uuid || '');
        setIsRoleModalOpen(true);
    };

    // const handleCreateAdmin = async (data: CreateAdminData) => {
    //     try {
    //         const success = await AdminService.createAdministrator(data);
    //         if (success) {
    //             toast.success("Administrador creado exitosamente.");
    //             setIsCreateModalOpen(false);
    //             createForm.reset();
    //             fetchUsers();
    //         } else {
    //             toast.error("Error al crear administrador.");
    //         }
    //     } catch (error) {
    //         toast.error("Error de conexión.");
    //     }
    // };

    const handleChangeRole = async (data: { rol_uuid: string }) => {
        if (!selectedUser) return;

        try {
            const success = await AdminService.changeUserRole(selectedUser.cuenta.uuid, data.rol_uuid);
            if (success) {
                toast.success("Rol actualizado exitosamente.");
                setIsRoleModalOpen(false);
                fetchUsers();
            } else {
                toast.error("Error al actualizar el rol.");
            }
        } catch (error) {
            toast.error("Error de conexión.");
        }
    };

    const handleStatusToggle = async (uuid: string, currentStatus: boolean) => {
        const newStatus = !currentStatus;
        try {
            const success = await AdminService.toggleUserStatus(uuid, newStatus);
            if (success) {
                setUsers(users.map(u => u.uuid === uuid ? { ...u, cuenta: { ...u.cuenta, estado: newStatus } } : u));
                fetchUsers();
                toast.success(newStatus ? 'Usuario habilitado.' : 'Usuario deshabilitado.');
            } else {
                toast.error("No se pudo cambiar el estado.");
            }
        } catch (e) {
            toast.error("Error de conexión.");
        }
    };

    const getRoleBadgeVariant = (role?: string) => {
        if (role === 'ADMIN') return 'primary';
        if (role === 'REPRESENTANTE') return 'success';
        return 'neutral';
    };


    return (
        <div className="flex h-screen bg-background-dark text-white font-body overflow-hidden">
            {/* Sidebar con más estilo */}
            <aside className="w-64 flex flex-col bg-[#0d0f12] border-r border-gray-800/50 relative z-20">
                {/* Logo */}
                <div className="h-24 flex items-center px-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
                            <span className="material-icons text-primary text-2xl">admin_panel_settings</span>
                        </div>
                        <h1 className="text-lg font-display font-black tracking-tighter italic">
                            UNI<span className="text-primary font-bold">SPORTS</span>
                        </h1>
                    </div>
                </div>

                {/* Navegación */}
                <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                    <div className="px-4 mb-4">
                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Panel Control</p>
                    </div>
                    <SidebarItem icon="manage_accounts" label="Gestión de Cuentas" active />
                    <SidebarItem icon="analytics" label="Estadísticas Generales" />
                    <SidebarItem icon="settings" label="Configuración del Sistema" />
                </nav>

                {/* User Card en el Footer del Sidebar */}
                <div className="p-4 border-t border-gray-800/50 bg-black/20">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-emerald-400 p-0.5">
                            <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                                <span className="material-icons-outlined text-gray-400 text-sm">shield</span>
                            </div>
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">{getNamesCurrentUser() || "Administrador"}</p>
                            <p className="text-[10px] text-gray-500 uppercase font-medium">Administrador</p>
                        </div>
                    </div>
                    <Link to="/login" onClick={logout} className="flex items-center justify-center w-full px-4 py-2.5 text-xs font-bold text-secondary border border-secondary/20 hover:bg-secondary/10 rounded-lg transition-all uppercase tracking-widest">
                        <span className="material-icons-outlined mr-2 text-sm">logout</span>
                        Cerrar Sesión
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative p-6 lg:p-10">
                <div className="max-w-6xl mx-auto relative z-10">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div>
                            <h2 className="text-4xl font-display font-black uppercase tracking-tight">
                                Gestión de <span className="text-primary"> Usuarios</span>
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">Administre las cuentas del sistema, gestione roles y accesos.</p>
                        </div>

                    </div>

                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row justify-between items-end gap-4 mb-6">
                        <div className="w-full sm:w-96">
                            <InputField
                                id="search"
                                label="Buscar Usuario"
                                placeholder="Filtrar por nombre..."
                                icon="search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-surface-dark rounded-xl border border-gray-800 shadow-xl overflow-hidden pt-4">
                        <div className="px-6 mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                                <span className="material-icons-outlined text-primary">group</span>
                                Directorio de Cuentas
                            </h3>
                            <span className="text-xs font-bold text-gray-500 bg-gray-900 px-3 py-1 rounded-full uppercase tracking-widest">
                                Mostrando {users.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0} - {Math.min(currentPage * itemsPerPage, totalUsers)} de {totalUsers}
                            </span>
                        </div>

                        {loading ? (
                            <div className="p-12 text-center text-gray-500">
                                <span className="material-icons animate-spin text-3xl mb-2 text-primary">sync</span>
                                <p className="text-sm font-medium">Cargando usuarios...</p>
                            </div>
                        ) : users.length === 0 ? (
                            <div className="p-12 text-center text-gray-500">
                                <span className="material-icons text-4xl mb-2">person_off</span>
                                <p className="text-sm font-medium">No se encontraron usuarios.</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHead>
                                    <TableCell header>Nombre Completo</TableCell>
                                    <TableCell header>Rol</TableCell>
                                    <TableCell header>Estado</TableCell>
                                    <TableCell header className="text-right">Acciones</TableCell>
                                </TableHead>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user.uuid}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xs font-bold text-gray-400">
                                                        {user.nombres.charAt(0)}{user.apellidos.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white leading-none">{`${user.nombres} ${user.apellidos}`}</p>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    {user.cuenta.rol && <Badge variant={getRoleBadgeVariant(user.cuenta.rol.nombre)}>{user.cuenta.rol.nombre}</Badge>}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {user.cuenta.estado !== undefined ? (
                                                    user.cuenta.estado ? (
                                                        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                                                            Activa
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1.5 text-xs text-red-500 font-bold">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]"></span>
                                                            Inactiva
                                                        </div>
                                                    )
                                                ) : (
                                                    <span className="text-gray-500 text-[10px]">N/A</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <IconButton
                                                        icon="manage_accounts"
                                                        title="Cambiar Rol"
                                                        onClick={() => handleOpenRoleModal(user)}
                                                    />
                                                    <IconButton
                                                        icon={user.cuenta.estado ? "block" : "check_circle"}
                                                        variant={user.cuenta.estado ? "danger" : "primary"}
                                                        title={user.cuenta.estado ? "Deshabilitar" : "Habilitar"}
                                                        onClick={() => user.cuenta.estado !== undefined && handleStatusToggle(user.cuenta.uuid, user.cuenta.estado)}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}

                        {/* Pagination */}
                        {!loading && totalUsers > 0 && (
                            <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between bg-black/20">
                                <p className="text-xs text-gray-500 font-medium tracking-wide">
                                    Página <span className="text-white font-bold">{currentPage}</span> de <span className="text-white font-bold">{totalPages}</span>
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="p-1.5 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                    >
                                        <span className="material-icons-outlined text-sm">chevron_left</span>
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="p-1.5 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                    >
                                        <span className="material-icons-outlined text-sm">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>



            {/* Modal: Cambiar Rol */}
            <Modal
                isOpen={isRoleModalOpen}
                onClose={() => setIsRoleModalOpen(false)}
                title="Asignar Nuevo Rol"
            >
                {selectedUser && (
                    <form onSubmit={roleForm.handleSubmit(handleChangeRole)} className="space-y-6">
                        <div className="bg-black/20 p-4 rounded-xl border border-gray-800">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Usuario Seleccionado</p>
                            <p className="font-bold text-white">{selectedUser.nombres} {selectedUser.apellidos}</p>
                            <p className="text-xs text-gray-400">{selectedUser.cuenta.correo}</p>
                        </div>

                        <SelectField
                            {...roleForm.register("rol_uuid")}
                            id="role"
                            label="Seleccionar Rol"
                            options={roles.map(r => ({ value: r.uuid, label: r.nombre }))}
                            error={roleForm.formState.errors.rol_uuid?.message}
                        />

                        <div className="pt-2 flex gap-3">
                            <PrimaryButton type="submit">
                                Guardar Cambios
                            </PrimaryButton>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default AdminDashboard;
