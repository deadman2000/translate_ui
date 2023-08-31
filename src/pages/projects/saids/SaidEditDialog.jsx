import api from "@/api/Api"
import type {ISaid} from "@/model/ISaid"
import type {ISaidValidateResult, IValidateWord} from "@/model/ISaidValidateResult"
import {IValidateExample} from "@/model/ISaidValidateResult"
import {classToStr} from "@/pages/projects/saids/utils"
import globalStore from "@/stores/GlobalStore"
import {Button, Classes, Dialog, H2, Icon, InputGroup, Intent, Tag} from "@blueprintjs/core"
import {IconNames} from "@blueprintjs/icons"
import {Tooltip2} from "@blueprintjs/popover2"
import React, {useEffect, useState} from "react"
import {Table} from "react-bootstrap"

type Example = {
    text: string,
    validation: IValidateExample,
}

function SaidTag(props: { token: string }) {
    const {token} = props
    const [words, setWords] = useState(null)

    useEffect(() => {
        if (token.length === 3) {
            api.words.words(globalStore.project.code, parseInt(token, 16))
                .then((words) => setWords(words))
        }
    }, [])

    if (words) {
        return <Tooltip2 content={words.map((w, i) => <div key={`${i}${w}`}>{w}</div>)}>
            <Tag round>{token}</Tag>
        </Tooltip2>
    }
    return <Tag round>{token}</Tag>
}

function getWordClass(id: string) {
    const cl = parseInt(id.split(':')[0], 16)
    return classToStr(cl)
}

function WordTag(props: { word: IValidateWord }) {
    const {word} = props
    if (!word.isValid)
        return <Tag intent={Intent.DANGER} round>{word.word}</Tag>

    const hex = word.ids.map((i) => i.split(':')[1]).join('/')
    return <Tooltip2 content={<>
        <div>{word.word}</div>
        {word.ids.map((id, i) => <div key={i}>{id}  {getWordClass(id)}</div>)}
    </>}>
        <Tag round intent={word.ids.length > 1 ? Intent.WARNING : Intent.NONE}>{hex}</Tag>
    </Tooltip2>
}

function ExampleRow(props: {
    example: Example,
    onChange: (value: string) => void,
}) {
    const [value, setValue] = useState('')
    useEffect(() => setValue(props.example.text), [props.example])

    const validation = props.example.validation

    return <>
        <tr>
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
                        <Icon icon={IconNames.DIAGRAM_TREE} className="color-gray"/>
                    </Tooltip2>
                }
            </td>
        </tr>
        {validation && validation.words && <tr>
            <td colSpan={3}>
                {validation.words.map((w, i) => (
                    <WordTag word={w} key={i}/>
                ))}
            </td>
        </tr>}
    </>
}

export function SaidEditDialog(props: { project: string, said: ISaid, update: (said: ISaid) => void, cancel: () => void }) {
    const {project, said} = props
    const [loading, setLoading] = useState(false)
    const [value, setValue] = useState('')
    const [examples, setExamples] = useState([])
    const [validation, setValidation]: [ISaidValidateResult, Function] = useState(null)

    useEffect(() => {
        if (said) {
            setValue(said.patch)
            if (said.examples) {
                const exmp = said.examples.map((e) => {
                    return {text: e}
                })
                exmp.push({text: ''})
                setExamples(exmp)
            } else {
                setExamples([{text: ''}])
            }
            setValidation(said.validation)
            setLoading(false)
        }
    }, [said])

    useEffect(() => {
        if (validation && validation.examples) {
            for (let i = 0; i < validation.examples.length; i++) {
                examples[i].validation = validation.examples[i]
            }
            setExamples([...examples])
        }
    }, [validation])

    const validate = () => {
        api.saids.validate(project, value, examples.map((e) => e.text.trim()).filter((s) => s.length > 0))
            .then((result) => {
                setValidation(result)
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
            <H2 className="bp4-text-overflow-ellipsis">{said.expression}</H2>
            <Table size="sm" borderless>
                <colgroup>
                    <col/>
                    <col width="1%"/>
                    <col width="1%"/>
                </colgroup>
                <tbody>
                <tr>
                    <td colSpan={2}>
                        <InputGroup value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    placeholder="*/(said,expression)[<!*]>"
                        />
                    </td>
                    <td>
                        {validation && (
                            validation.error ? <Tooltip2 content={validation.error}>
                                    <Icon icon={IconNames.CROSS} intent={Intent.DANGER}/>
                                </Tooltip2>
                                :
                                <Tooltip2 content={<pre className="bp4-code-block">{validation.saidTree}</pre>}>
                                    <Icon icon={IconNames.DIAGRAM_TREE} className="color-gray"/>
                                </Tooltip2>
                        )}
                    </td>
                </tr>
                {validation && validation.said && <tr>
                    <td colSpan={3}>
                        {validation.said.map((s, i) => <SaidTag key={`${i}${s}`} token={s}/>)}
                    </td>
                </tr>}
                <tr>
                    <td colSpan={3}>Examples:</td>
                </tr>
                {examples.map((e: Example, i) =>
                    <ExampleRow key={i}
                                example={e}
                                validation={validation && validation.examples && i < validation.examples.length ? validation.examples[i] : null}
                                onChange={(v) => {
                                    e.text = v
                                    if (v.length > 0 && i === examples.length - 1) {
                                        setExamples([...examples, {text: ''}])
                                    }
                                }}
                    />)}
                </tbody>
            </Table>
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