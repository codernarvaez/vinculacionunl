import React from 'react';
import { PrimaryButton } from '../../pages/components/UI';
import { generateAssentPdf } from '../../utils/assentPdfGenerator';
import type { IAthletes } from '../../services/athletes';
import { getNamesCurrentUser } from '../../services/auth';
import { toast } from 'sonner';

interface AssentPdfButtonProps {
  athlete: IAthletes;
}

const AssentPdfButton: React.FC<AssentPdfButtonProps> = ({ athlete }) => {
  const handleDownload = () => {
    try {
      const repName = getNamesCurrentUser() || 'Representante';
      generateAssentPdf(athlete, repName);
      toast.success('Documento de asentimiento descargado');
    } catch (error) {
      console.error('Error al generar PDF:', error);
      toast.error('Error al generar el documento de asentimiento');
    }
  };

  return (
    <PrimaryButton onClick={handleDownload} className="flex items-center justify-center gap-2">
      <span className="material-icons-round text-base">description</span>
      Descargar Asentimiento
    </PrimaryButton>
  );
};

export default AssentPdfButton;
