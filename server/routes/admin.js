import {admin} from "../controllers/admin";
import {controller, get, post, all} from '../decorator/route'

@controller('admin')
export class user {

    @all(':type')
    async GET_user(ctx, next) {
        await api(ctx, next)
    }
}
