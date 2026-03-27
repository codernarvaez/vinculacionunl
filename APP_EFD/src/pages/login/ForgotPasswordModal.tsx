import React, { useState } from 'react';
import { Modal, InputField, PrimaryButton } from '../components/UI';
import { toast } from 'sonner';
import { methodPOST } from '../../api/access';

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRequestCode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return toast.error("El correo es obligatorio");
        
        setLoading(true);
        try {
            await methodPOST('/cuentas/recuperacion/solicitar', { correo: email });
            toast.success("Código enviado exitosamente", { description: "Revisa tu bandeja de entrada o la consola en desarrollo." });
            setStep(2);
        } catch (error: any) {
            toast.error(error.message || "Error al solicitar el código");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code) return toast.error("El código es obligatorio");

        setLoading(true);
        try {
            await methodPOST('/cuentas/recuperacion/verificar', { correo: email, codigo: code });
            toast.success("Código validado correctamente");
            setStep(3);
        } catch (error: any) {
            toast.error(error.message || "Código inválido o expirado");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword.length < 8 || newPassword.length > 25) {
            return toast.error("La contraseña debe tener entre 8 y 25 caracteres");
        }
        if (newPassword !== confirmPassword) {
            return toast.error("Las contraseñas no coinciden");
        }

        setLoading(true);
        try {
            await methodPOST('/cuentas/recuperacion/restablecer', { correo: email, codigo: code, nueva_clave: newPassword });
            toast.success("Contraseña restablecida exitosamente", { description: "Ahora puedes iniciar sesión con tu nueva clave." });
            onClose();
            // Reset state for next time
            setStep(1);
            setEmail('');
            setCode('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            toast.error(error.message || "Error al restablecer la contraseña");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Recuperar Contraseña">
            <div className="space-y-6">
                {step === 1 && (
                    <form onSubmit={handleRequestCode} className="space-y-6">
                        <p className="text-sm text-gray-400">Introduce tu correo electrónico para recibir un código de verificación.</p>
                        <InputField
                            label="Correo Electrónico"
                            id="reset-email"
                            type="email"
                            icon="email"
                            placeholder="usuario@correo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <PrimaryButton type="submit" disabled={loading}>
                            {loading ? "Enviando..." : "Enviar Código"}
                        </PrimaryButton>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyCode} className="space-y-6">
                        <p className="text-sm text-gray-400">Hemos enviado un código de 6 dígitos a <span className="text-white font-medium">{email}</span>.</p>
                        <InputField
                            label="Código de Verificación"
                            id="reset-code"
                            type="text"
                            icon="pin"
                            placeholder="123456"
                            maxLength={6}
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                            required
                        />
                        <div className="flex flex-col gap-3">
                            <PrimaryButton type="submit" disabled={loading}>
                                {loading ? "Verificando..." : "Verificar Código"}
                            </PrimaryButton>
                            <button 
                                type="button" 
                                onClick={() => setStep(1)} 
                                className="text-xs text-gray-500 hover:text-white transition-colors"
                            >
                                ¿Correo incorrecto? Volver atrás
                            </button>
                        </div>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleResetPassword} className="space-y-6">
                        <p className="text-sm text-gray-400">Crea una nueva contraseña para tu cuenta (8-25 caracteres).</p>
                        <div className="space-y-4">
                            <InputField
                                label="Nueva Contraseña"
                                id="new-password"
                                type="password"
                                icon="lock"
                                placeholder="••••••••"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <InputField
                                label="Confirmar Contraseña"
                                id="confirm-password"
                                type="password"
                                icon="lock_reset"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <PrimaryButton type="submit" disabled={loading}>
                            {loading ? "Restableciendo..." : "Cambiar Contraseña"}
                        </PrimaryButton>
                    </form>
                )}
            </div>
        </Modal>
    );
};
