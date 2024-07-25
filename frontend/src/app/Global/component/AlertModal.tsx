import { faBell } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

interface AlertModalProps {
    error: string;
    show: boolean;
    url?: string;
    onClose: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({ error, show, url, onClose}) => {
    
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-5 rounded shadow-lg">
                <div className="text-lg font-semibold text-secondary"><FontAwesomeIcon icon={faBell} size='xl' /></div>
                <p className="text-white">{error}</p>
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={() => {
                            if (url) {
                                window.location.href = url;
                            } else {
                                onClose();
                            }
                        }}
                        className="text-sm mr-2 p-2 bg-gray-600 rounded text-white hover:bg-gray-500"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
}
export default AlertModal;