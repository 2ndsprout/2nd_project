import React, { useState } from 'react';

interface ConfirmModalProps {
    title: string;
    content: string;
    confirm: string;
    show: boolean;
    onConfirm?: () => void;

}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ title, content, confirm, show, onConfirm }) => {

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-5 rounded shadow-lg">
              <div className="text-lg font-semibold text-secondary">{title}</div>
              <p className="text-gray-400">{content}</p>
              <div className="mt-4 flex justify-end">
                <button onClick={() => !show} className="mr-2 p-2 bg-gray-600 rounded text-white hover:bg-gray-500">취소</button>
                <button onClick={onConfirm} className="p-2 bg-yellow-600 rounded text-white hover:bg-yellow-500">{confirm}</button>
              </div>
            </div>
          </div>
    );
};

export default ConfirmModal;

