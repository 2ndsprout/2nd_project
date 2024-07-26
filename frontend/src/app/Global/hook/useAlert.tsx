import { useState } from 'react';

interface AlertState {
  error: string;
  show: boolean;
  url?: string;
}

function useAlert() {
  const [alertState, setAlertState] = useState<AlertState>({ error: '', show: false });

  function showAlert(error: string, url?: string) {
    setAlertState({ error, show: true, url });
  }

  function closeAlert() {
    setAlertState({ ...alertState, show: false });
  }

  return {
    alertState,
    showAlert,
    closeAlert,
  };
}

export default useAlert;