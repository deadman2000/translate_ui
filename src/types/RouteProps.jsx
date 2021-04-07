import {RouteComponentProps} from "react-router-dom";

export type RouteProps<S = any> = $Shape<RouteComponentProps<S>>