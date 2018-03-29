import {api} from "../controllers/pages";
import {controller, get, post, all} from '../decorator/route'

@controller('')
export class user {

    @all(':type')
    async GET_user(ctx, next) {
        await api(ctx, next)
    }
}
