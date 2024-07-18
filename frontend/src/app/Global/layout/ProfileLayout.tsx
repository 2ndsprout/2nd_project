import Main from "./MainLayout";
import SideList from "./SideList";

interface pageInterface {
    children: React.ReactNode,
    user: any
    profile: any
    categories: any[];
}
export default function Profile(props: pageInterface) {
    const user = props.user;
    const profile = props.profile;
    return (
        <Main user={user} profile={profile} categories={props.categories}>
        <div className="flex flex-col w-[1240px]">
            <div className="flex w-full items-end">
                <label className="font-bold text-2xl w-[185px] min-w-[185px]">나의 52번가</label>
                <label className="text-xs">52번가 속 내 정보를 한번에 확인하세요!</label>
            </div>
            <div className="flex">
                <SideList user={user} profile={profile} />
                <div className="flex flex-col mt-4 w-full">
                    {props.children}
                </div>
            </div>
        </div>
    </Main>
    );
}