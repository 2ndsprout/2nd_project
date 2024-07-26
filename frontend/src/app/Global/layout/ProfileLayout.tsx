import Main from "./mainLayout";
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
                    <SideList user={user} profile={profile} />
                    <div className="flex flex-col mt-4 w-full">
                        {props.children}
                    </div>
                </div>
            </div>
        </Main>
    );
}