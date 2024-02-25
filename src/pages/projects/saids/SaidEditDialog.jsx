import api from "@/api/Api"
import type {ISaid} from "@/model/ISaid"
import type {ISaidValidateResult, IValidateWord} from "@/model/ISaidValidateResult"
import {ISaidTestResult} from "@/model/ISaidValidateResult"
import {classToStr} from "@/pages/projects/saids/utils"
import globalStore from "@/stores/GlobalStore"
import {Button, Classes, Dialog, H2, Icon, InputGroup, Intent, Tag} from "@blueprintjs/core"
import {IconNames} from "@blueprintjs/icons"
import {Tooltip2} from "@blueprintjs/popover2"
import React, {useEffect, useState} from "react"
import {Table} from "react-bootstrap"
import type {ISaidTest} from "@/model/ISaidTest";

type SaidTest = {
    said: string,
    positive: boolean,
    validation: ISaidTestResult,
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

function SaidTestRow(props: {
    test: SaidTest,
    onChange: (value: ISaidTest) => void,
}) {
    const [value, setValue] = useState('')
    const [positive, setPositive] = useState(true)
    useEffect(() => {
        setValue(props.test.said)
        setPositive(props.test.positive)
    }, [props.test])

    const validation = props.test.validation

    return <>
        <tr>
            <td>
                <InputGroup value={value}
                            onChange={(e) => {
                                setValue(e.target.value)
                                props.onChange({said: e.target.value, positive: positive})
                            }}
                            placeholder="do anything"
                            fill
                />
            </td>
            <td>
                {validation && (
                    validation.error ?
                        (<Tooltip2 content={validation.error}>
                            <Icon
                                icon={IconNames.WARNING_SIGN}
                                intent={Intent.DANGER}
                            />
                        </Tooltip2>):
                        (<Button
                            minimal
                            icon={validation.match ? IconNames.TICK : IconNames.CROSS}
                            intent={validation.match === positive ? Intent.SUCCESS : Intent.DANGER}
                            onClick={() => {
                                const p = !positive
                                setPositive(p)
                                props.onChange({said: value, positive: p})
                            }}
                        />)
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
    const [tests, setTests] = useState([])
    const [validation, setValidation]: [ISaidValidateResult, Function] = useState(null)

    useEffect(() => {
        if (said) {
            api.saids.translate(project, said.patch)
                .then((patch) => setValue(patch))

            setValue(said.patch)
            if (said.tests) {
                const tsts : SaidTest[] = said.tests.map((t) => ({said: t.said, positive: t.positive}))
                tsts.push({said: '', positive: true})
                setTests(tsts)
            } else {
                setTests([{said: '', positive: true}])
            }
            setValidation(said.validation)
            setLoading(false)
        }
    }, [said])

    useEffect(() => {
        if (validation && validation.tests) {
            for (let i = 0; i < validation.tests.length; i++) {
                tests[i].validation = validation.tests[i]
            }
            setTests([...tests])
        }
    }, [validation])

    const validate = () => {
        const tsts = tests
            .map((t) => ({said: t.said.trim(), positive: t.positive}))
            .filter((t) => t.said.length > 0)
        api.saids.validate(project, value, tsts)
            .then((result) => {
                setValidation(result)
            })
    }

    const update = () => {
        setLoading(true)
        const tsts = tests.map((t) => ({said: t.said.trim(), positive: t.positive}))
            .filter((t) => t.said.length > 0)
        api.saids.update(project, said.script, said.index, value, tsts)
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
                    <td colSpan={3}>Tests:</td>
                </tr>
                {tests.map((t: SaidTest, i) =>
                    <SaidTestRow key={i}
                                test={t}
                                validation={validation && validation.tests && i < validation.tests.length ? validation.tests[i] : null}
                                onChange={(nt: ISaidTest) => {
                                    t.said = nt.said
                                    t.positive = nt.positive
                                    if (nt.said.length > 0 && i === tests.length - 1) {
                                        setTests([...tests, {said: '', positive: true}])
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