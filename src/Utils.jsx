import moment from "moment";

export function formatDateTime(dt: string) {
    if (!dt) return dt
    return moment(dt).format('YY.DD.MM HH:mm')
}

export function fromNow(dt: string) {
    if (!dt) return dt
    return moment(dt).fromNow()
}