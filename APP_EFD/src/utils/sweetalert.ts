import Swal, { type SweetAlertOptions } from 'sweetalert2';

/**
 * Utility to fire a theme-aware SweetAlert2 modal.
 * It uses the global CSS overrides defined in index.css.
 */
export const showConfirmDialog = async (options: SweetAlertOptions) => {
  return Swal.fire({
    reverseButtons: true,
    customClass: {
      popup: 'swal2-popup',
      title: 'swal2-title',
      confirmButton: 'swal2-confirm',
      cancelButton: 'swal2-cancel',
    },
    // We remove hardcoded background/color to let CSS handle it
    ...options,
    // Ensure primary/secondary colors from theme are used if not provided
    confirmButtonColor: options.confirmButtonColor || 'var(--app-primary)',
    cancelButtonColor: options.cancelButtonColor || 'transparent',
  });
};

export default Swal;
