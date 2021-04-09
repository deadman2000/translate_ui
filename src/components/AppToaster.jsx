import {Intent, Position, Toaster} from "@blueprintjs/core";

const toaster = Toaster.create({
    position: Position.TOP,
});

export function toastError(message: string) {
    toaster.show({message, intent: Intent.WARNING})
}

export function toast(message: string) {
    toaster.show({message, intent: Intent.PRIMARY})
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