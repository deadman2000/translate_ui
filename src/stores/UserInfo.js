import type {IMyInfo} from "@/model/IMyInfo";

export class UserInfo
{
    init(info: IMyInfo) {
        this.login = info.login
        this.role = info.role
        this.isAdmin = info.role === 'Admin'
    }
}

const user = new UserInfo()

export default user
