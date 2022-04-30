import type {IMyInfo} from "@/model/IMyInfo";
import globalStore from "@/stores/GlobalStore";

export class UserInfo
{
    init(info: IMyInfo) {
        this.login = info.login
        this.role = info.role
        this.letters = info.letters
        this.isAdmin = info.role === 'Admin'
        globalStore.setLetters(info.letters)
    }
}

const user = new UserInfo()

export default user
