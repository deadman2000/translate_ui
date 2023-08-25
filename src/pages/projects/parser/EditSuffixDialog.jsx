import type {ISuffix} from "@/model/ISuffix"
import {ClassEditor, WordClasses} from "@/pages/projects/parser/utils"
import {Button, Classes, Dialog, InputGroup, Intent} from "@blueprintjs/core"
import React, {useEffect, useState} from "react"
import {Col, Row} from "react-bootstrap"

type CreateFunc = (inpCl: number, inp: string, outCl: number, out: string) => void

type Props = {
    suffix: ISuffix,
    open: boolean,
    create: CreateFunc,
    cancel: () => void
}

export function EditSuffixDialog({suffix, open, create, cancel}: Props) {
    const [inp, setInp] = useState('')
    const [clin, setClassIn] = useState(WordClasses.Noun)
    const [out, setOut] = useState('')
    const [clout, setClassOut] = useState(WordClasses.Noun)

    useEffect(() => {
        if (suffix) {
            setInp(suffix.input)
            setClassIn(suffix.inClass)
            setOut(suffix.output)
            setClassOut(suffix.outClass)
        } else {
            setInp('')
            setClassIn(WordClasses.Noun)
            setOut('')
            setClassOut(WordClasses.Noun)
        }
    }, [suffix])

    return (
        <Dialog isOpen={open}>
            <div className={Classes.DIALOG_BODY}>
                <Row>
                    <Col>
                        <InputGroup placeholder="*from"
                                    onChange={(e) => setInp(e.target.value)}
                                    value={inp}/>
                        <ClassEditor value={clin} onChange={setClassIn}/>
                    </Col>
                    <Col>
                        <InputGroup placeholder="*to"
                                    onChange={(e) => setOut(e.target.value)}
                                    value={out}/>
                        <ClassEditor value={clout} onChange={setClassOut}/>
                    </Col>
                </Row>
            </div>
            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button text="SAVE"
                            intent={Intent.PRIMARY}
                            onClick={() => {
                                create(clin, inp, clout, out)
                                setInp('')
                                setOut('')
                            }}/>
                    <Button text="CANCEL"
                            onClick={() => {
                                cancel()
                                setInp('')
                                setOut('')
                            }}/>
                </div>
            </div>
        </Dialog>
    )
}