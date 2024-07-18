'use client'

interface sideListProps {
    user: any
    profile: any
}

export default function SideList(props: sideListProps) {
    const user = props.user;
    const profile = props.profile;
    return (
        <div className="mt-10 w-[200px] mr-[30px]">
            <div className="flex flex-col items-center border-x-2 border-y-2 border-gray-400 rounded-t-lg py-2 px-4 w-full">
                <img src="/user.png" className="w-[128px] h-[128px]" alt="유저 프로필" />
                <a href="/account/profile text-white">{profile?.name}</a>
            </div>
            <div className="flex flex-col border-x-2 border-y-2 border-gray-400 py-2 px-4 w-full">
                <label className="font-bold mb-3">프로필 정보 변경</label>
                <a href="/account/address" className="text-sm text-gray-500 hover:underline">프로필 정보 수정</a>
                <a href="" className="text-sm text-gray-500 hover:underline" onClick={() => alert('다시 한번 생각해주세요.')}>계정 정보 수정</a>
            </div>
            <div className="flex flex-col border-x-2 border-b-2 border-gray-400 py-2 px-4 w-full">
                <label className="font-bold mb-3">문화 센터</label>
                <a href="/account/log" className="text-sm text-gray-500 hover:underline">프로그램 신청 내역</a>
                <a href="/account/reviews" className="text-sm text-gray-500 hover:underline">내 레슨 목록</a>
                {user?.role != "USER" ? <a href="/account/productList" className="text-sm text-gray-500 hover:underline">수강 회원 목록</a> : <></>}
            </div>
            <div className="flex flex-col border-x-2 border-b-2 border-gray-400 py-2 px-4 w-full">
                <label className="font-bold mb-3"></label>
                <a href="/account/wish" className="text-sm text-gray-500 hover:underline">찜한 상품</a>
                <a href="/account/recent" className="text-sm text-gray-500 hover:underline">최근본 상품</a>
                <a href="/account/chatList" className="text-sm text-gray-500 hover:underline">내 채팅 목록</a>
            </div>
        </div>
    );
}