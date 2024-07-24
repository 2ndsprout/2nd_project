import { useState } from 'react';

interface ConfirmState {
  title: string;
  content: string;
  confirm: string;
  show: boolean;
  onConfirm?: () => void;
}

function useConfirm() {
  const [confirmState, setConfirmState] = useState<ConfirmState>({ title: '', content: '', confirm: '', show: false });

  function finalConfirm(title: string, content: string, confirm: string, onConfirm: () => void) {
    setConfirmState({ title, content, confirm, show: true, onConfirm });
  }

  function closeConfirm() {
    setConfirmState({ ...confirmState, show: false });
  }

  return {
    confirmState,
    finalConfirm,
    closeConfirm,
  };
}

export default useConfirm;