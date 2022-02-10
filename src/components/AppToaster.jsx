import {Intent, Position, Toaster} from "@blueprintjs/core";

export const toaster = Toaster.create({
    position: Position.TOP,
    maxToasts: 3,
});

export function toastError(message: string) {
    toaster.show({message, intent: Intent.WARNING})
}

export function toast(message: string) {
    toaster.show({message})
}

export function axiosToastCatch(e) {
    if (!e.response)
        toastError(e.message)
    else {
        if (e.response.data.message)
            toastError(e.response.data.message)
        else
            toastError(e.message)
    }
    throw e
}
