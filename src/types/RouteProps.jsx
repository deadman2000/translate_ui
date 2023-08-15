import {RouteComponentProps} from "@types/react-router"

export type RouteProps<S = any> = $Shape<RouteComponentProps<S>>