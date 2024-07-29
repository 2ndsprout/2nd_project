import Main from "./MainLayout";
import SideList from "./SideList";

interface pageInterface {
    children: React.ReactNode,
    user: any
    profile: any
    isLoading: boolean

}
export default function Profile(props: pageInterface) {
    const user = props.user;
    const profile = props.profile;
    return (
        <Main user={user} profile={profile} isLoading={props.isLoading}>
            <div className="flex flex-col w-[1500px]">
                <div className="flex">
                    <div className="mt-4 ml-48">
                        <SideList user={user} profile={profile} />
                    </div>
                    <div className="flex flex-col mt-8 w-full">
                        {props.children}
                    </div>
                </div>
            </div>
        </Main>
    );
}