import type {IMyInfo} from "@/model/IMyInfo";
import globalStore from "@/stores/GlobalStore";

export class UserInfo
{
    init(info: IMyInfo) {
        this.login = info.login
        this.role = info.role
        this.isAdmin = info.role === 'Admin'
        globalStore.setUserInfo(info)
    }
}

const user = new UserInfo()

export default user
