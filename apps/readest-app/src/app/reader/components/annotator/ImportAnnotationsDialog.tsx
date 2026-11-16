import React from 'react';
import { MdDataObject, MdMenuBook, MdNightlightRound } from 'react-icons/md';
import { useTranslation } from '@/hooks/useTranslation';
import { BRAND_NAME } from '@/services/branding';
import { BoxedList, NavigationRow } from '@/components/settings/primitives';
import Dialog from '@/components/Dialog';

interface ImportAnnotationsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImportMoonReader: () => void;
  onImportReadEra: () => void;
  onImportReadest: () => void;
}

/**
 * Dedicated modal listing the annotation-import sources. Each source is a
 * boxed-list row; new providers (Calibre, KOReader, …) are added by dropping
 * another `<NavigationRow>` here and wiring its callback in the Annotator.
 */
const ImportAnnotationsDialog: React.FC<ImportAnnotationsDialogProps> = ({
  isOpen,
  onClose,
  onImportMoonReader,
  onImportReadEra,
  onImportReadest,
}) => {
  const _ = useTranslation();

  return (
    <Dialog
      isOpen={isOpen}
      title={_('Import Annotations')}
      onClose={onClose}
      boxClassName='sm:h-auto! sm:max-h-[90vh]! sm:w-[420px]!'
      contentClassName='sm:px-6!'
    >
      <BoxedList
        title={_('Import From')}
        description={_(
          'Import highlights and notes exported from {{brand}} or another reading app.',
          { brand: BRAND_NAME },
        )}
      >
        <NavigationRow
          icon={MdDataObject}
          title={BRAND_NAME}
          status={_('{{brand}} annotations file (.json)', { brand: BRAND_NAME })}
          onClick={onImportReadest}
        />
        <NavigationRow
          icon={MdNightlightRound}
          title={_('Moon+ Reader')}
          status={_('Moon+ Reader export file (.mrexpt)')}
          onClick={onImportMoonReader}
        />
        <NavigationRow
          icon={MdMenuBook}
          title={_('ReadEra')}
          status={_('ReadEra backup file (.bak)')}
          onClick={onImportReadEra}
        />
      </BoxedList>
    </Dialog>
  );
};

export default ImportAnnotationsDialog;
