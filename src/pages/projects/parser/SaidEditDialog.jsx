import api from "@/api/Api"
import type {ISaid} from "@/model/ISaid"
import {IValidateExample} from "@/model/ISaidValidateResult"
import {Button, Classes, Dialog, Icon, InputGroup, Intent} from "@blueprintjs/core"
import {IconNames} from "@blueprintjs/icons"
import {Tooltip2} from "@blueprintjs/popover2"
import React, {useEffect, useState} from "react"
import {Table} from "react-bootstrap"

type Example = {
    text: string,
    validation: IValidateExample,
}

function ExampleRow(props: {
    example: Example,
    onChange: (value: string) => void,
}) {
    const [value, setValue] = useState('')
    useEffect(() => setValue(props.example.text), [props.example])

    const validation = props.example.validation

    return <>
        <td>
            <InputGroup value={value}
                        onChange={(e) => {
                            setValue(e.target.value)
                            props.onChange(e.target.value)
                        }}
                        placeholder="do anything"
                        fill
            />
        </td>
        <td>
            {validation && (
                <Icon
                    icon={validation.match ? IconNames.TICK : IconNames.CROSS}
                    intent={validation.match ? Intent.SUCCESS : Intent.DANGER}
                />
            )}
        </td>
        <td>
            {validation && validation.tree &&
                <Tooltip2 content={<pre className="bp4-code-block">{validation.tree}</pre>}>
                    <Icon icon={IconNames.DIAGRAM_TREE}/>
                </Tooltip2>
            }
        </td>
    </>
}

export function SaidEditDialog(props: { project: string, said: ISaid, update: (said: ISaid) => void, cancel: () => void }) {
    const {project, said} = props
    const [loading, setLoading] = useState(false)
    const [value, setValue] = useState('')
    const [examples, setExamples] = useState([])
    const [validation, setValidation] = useState(null)

    useEffect(() => {
        if (said) {
            setValue(said.patch)
            if (said.examples) {
                const exmp = said.examples.map((e) => {
                    return {text: e}
                })
                exmp.push({text: ''})
                setExamples(exmp)
            }
            else
            {
                setExamples([{text: ''}])
            }
            setValidation(null)
            setLoading(false)
        }
    }, [said])

    const validate = () => {
        const exmp = examples
        api.saids.validate(project, value, exmp.map((e) => e.text.trim()).filter((s) => s.length > 0))
            .then((result) => {
                setValidation(result)
                for (let i = 0; i < result.examples.length; i++) {
                    exmp[i].validation = result.examples[i]
                }
                setExamples([...exmp])
            })
    }

    const update = () => {
        setLoading(true)
        const exmp = examples.map((e) => e.text.trim()).filter((s) => s.length > 0)
        api.saids.update(project, said.script, said.index, value, exmp)
            .then((s) => props.update(s))
            .finally(() => setLoading(false))
    }

    return <Dialog isOpen={!!said}>
        {said && <div className={Classes.DIALOG_BODY}>
            <p>{said.expression}</p>
            <div className="pb-1">
                <InputGroup value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="*/(said,expression)[<!*]>"
                />
                {validation &&
                    <Tooltip2 content={<pre className="bp4-code-block">{validation.saidTree}</pre>}>
                        <Icon icon={IconNames.DIAGRAM_TREE}/>
                    </Tooltip2>
                }
            </div>
            <div>
                Examples:
                <Table size="sm" borderless>
                    <colgroup>
                        <col/>
                        <col width="1%"/>
                        <col width="1%"/>
                    </colgroup>
                    <tbody>
                    {examples.map((e: Example, i) => <tr key={i}>
                        <ExampleRow example={e}
                                    validation={validation && i < validation.examples.length ? validation.examples[i] : null}
                                    onChange={(v) => {
                                        e.text = v
                                        if (v.length > 0 && i === examples.length - 1) {
                                            setExamples([...examples, {text: ''}])
                                        }
                                    }}
                        />
                    </tr>)}
                    </tbody>
                </Table>
            </div>
        </div>}
        <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                <Button text="VALIDATE"
                        icon={IconNames.FORM}
                        onClick={validate}
                        disabled={loading}
                />
                <Button text="UPDATE"
                        intent={Intent.PRIMARY}
                        onClick={update}
                        loading={loading}
                />
                <Button text="CANCEL"
                        onClick={() => {
                            props.cancel()
                        }}
                />
            </div>
        </div>
    </Dialog>
}