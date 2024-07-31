'use client'

import { useEffect, useState } from "react";
import { getUser } from "../API/UserAPI";
import Admin from "../Global/layout/AdminLayout";

export default function Page() {
    const [user, setUser] = useState(null as any);
    const ACCESS_TOKEN = typeof window == 'undefined' ? null : localStorage.getItem('accessToken');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (ACCESS_TOKEN)
            getUser()
                .then(r => {
                    setUser(r);
                })
                .catch(e => console.log(e));
        const interval = setInterval(() => { setIsLoading(true); clearInterval(interval) }, 100);
    }, [ACCESS_TOKEN]);

    return (
        <Admin user={user} isLoading={isLoading} className="flex">
            <div className="mt-[30px] ml-[250px] border-2 w-[1400px] h-[800px] rounded-lg bg-gray-700 border-gray-700 flex flex-col items-center justify-center">
                <div className="overflow-x-auto h-[750px]">
                    <table className="table table-lg w-[1200px]">
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>제목</th>
                                <th>신청일자</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="hover:text-secondary">
                                <th>2</th>
                                <td>Hart Hagerty</td>
                                <td>Desktop Support Technician</td>
                            </tr>
                        </tbody>
                    </table>
                    <a href="/propose/create" className="w-[200px] btn-success">생성</a>
                </div>
            </div>
        </Admin>
    );
}
