'use client';

import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';

declare global {
    interface Window {
        daum: any;
    }
}

interface IAddr {
    address: string;
    zonecode: string;
}

interface DaumPostcodeProps {
    onAddressChange?: (address: IAddr) => void; // 콜백 함수 타입 정의
}

const DaumPostcode: React.FC<DaumPostcodeProps> = ({ onAddressChange }) => {
    const [addr, setAddr] = useState<IAddr>({ address: '', zonecode: '' });
    const scriptLoadedRef = useRef(false);

    useEffect(() => {
        if (!scriptLoadedRef.current) {
            const script = document.createElement('script');
            script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
            script.async = true;
            script.onload = () => {
                scriptLoadedRef.current = true;
            };
            document.head.appendChild(script);
        }
    }, []);

    const openPostcode = () => {
        if (window.daum && window.daum.Postcode) {
            new window.daum.Postcode({
                oncomplete: (data: any) => {
                    const newAddr = {
                        address: data.address,
                        zonecode: data.zonecode,
                    };
                    setAddr(newAddr);
                    if (onAddressChange) {
                        onAddressChange(newAddr); // 상위 컴포넌트에 주소 전달
                    }
                }
            }).open();
        }
    };

    return (
        <div>
            <Head>
                <title>Daum Postcode</title>
            </Head>
            <button onClick={openPostcode} className="p-2 bg-blue-500 text-white rounded text-sm">주소 검색</button>
            <div hidden>
                {addr.address && <p>주소: {addr.address}</p>}
                {addr.zonecode && <p>우편번호: {addr.zonecode}</p>}
            </div>
        </div>
    );
};

export default DaumPostcode;
