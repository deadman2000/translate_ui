import moment from "moment";

export function formatDateTime(dt: string) {
    if (!dt) return dt
    return moment(dt).format('DD.MM.YY HH:mm:ss')
}

export function fromNow(dt: string) {
    if (!dt) return dt
    return moment(dt).fromNow()
}