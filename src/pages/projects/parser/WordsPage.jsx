import {classToStr, hex3, wordClassMap} from "@/pages/projects/parser/utils"
import {Button, Checkbox, Classes, Dialog, Icon, InputGroup, Intent, Spinner} from "@blueprintjs/core"
import {IconNames} from "@blueprintjs/icons"
import {Tooltip2} from "@blueprintjs/popover2"
import React, {useEffect, useState} from "react"
import api from "@/api/Api"
import type {IWord} from "@/model/IWord"
import {GlobalStore} from "@/stores/GlobalStore"
import {inject} from "mobx-react"
import LoaderComponent from "@/components/LoaderComponent"
import {Col, Container, Row, Table} from "react-bootstrap"
import './WordsPage.scss'

function WordEditor(props: { project: string, word: IWord }) {
    const {project, word} = props
    const [edit, setEdit] = useState(false)
    const [loading, setLoading] = useState(false)
    const [value, setValue] = useState(word.translate || '')
    const [editValue, setEditValue] = useState('')

    if (edit) {
        const commit = () => {
            const words = editValue.trim()
            if (words === value) {
                setEdit(false)
                return
            }

            setLoading(true)
            api.words.translate(project, word.group, word.class, words)
                .then((w) => {
                    setEdit(false)
                    setValue(w.translate)
                    setEditValue(w.translate)
                })
                .finally(() => setLoading(false))
        }

        const right = <>
            <Button
                icon={IconNames.TICK}
                minimal
                onClick={commit}
            />
            <Button
                icon={IconNames.CROSS}
                minimal
                onClick={() => setEdit(false)}
            />
        </>

        return <InputGroup
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            rightElement={loading ? <Spinner size={15}/> : right}
            onKeyPress={(e) => {
                if (e.key === 'Enter') commit()
            }}
            disabled={loading}
            autoFocus
        />
    }

    return <>
        <Button icon={IconNames.EDIT}
                minimal
                onClick={() => {
                    setEditValue(value)
                    setEdit(true)
                }}
        />
        {value}
    </>
}

function isPass(word: IWord, filter: string) {
    if (!filter) return true
    if (word.words && word.words.indexOf(filter) >= 0) return true
    return !!(word.translate && word.translate.indexOf(filter) >= 0);

}

const WordRow = React.memo((props: { word: IWord, project: string }) => {
    const {word, project} = props
    return <>
        <td>{hex3(word.group)}</td>
        <td>{classToStr(word.class)}</td>
        <td>{word.words}</td>
        <td>
            <WordEditor word={word} project={project}/>
        </td>
        <td className="usage-col">{word.usage &&
            <Tooltip2 content={<div style={{maxWidth: 300}}>{word.usage}</div>}>{word.usage}</Tooltip2>}</td>
    </>
})

function WordRowFilter(props: { word: IWord, project: string, filter: string }) {
    const {word, project, filter} = props
    const pass = isPass(word, filter)
    return <tr style={{display: pass ? "table-row" : "none"}}><WordRow word={word} project={project}/></tr>
}

function WordsList(props: { words: IWord[], project: string, filter: string }) {
    const {words, project, filter} = props
    return words.map((w) => <WordRowFilter key={w.id} word={w} project={project} filter={filter}/>)
}

function CreateWordDialog(props: { open: boolean, create: () => void, cancel: () => void }) {
    const [words, setWords] = useState('')
    const [cl, setClass] = useState(0)

    const setFlag = (f: number, on: boolean) => on ? setClass(cl | f) : setClass(cl & ~f)

    return (
        <Dialog isOpen={props.open}>
            <div className={Classes.DIALOG_BODY}>
                <InputGroup placeholder="word1, word2"
                            onChange={(e) => setWords(e.target.value)}
                            value={words}/>
                {Object.entries(wordClassMap).map(([key, value]) => (
                    <Checkbox key={key}
                              label={key}
                              checked={(cl & value) > 0}
                              onChange={(e) => setFlag(value, e.target.checked)}/>
                ))}
            </div>
            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button text="CREATE"
                            intent={Intent.PRIMARY}
                            onClick={() => {
                                props.create(cl, words)
                                setWords('')
                            }}/>
                    <Button text="CANCEL"
                            onClick={() => {
                                props.cancel()
                                setWords('')
                            }}/>
                </div>
            </div>
        </Dialog>
    )
}

type State = {
    words: IWord[],
    createWord: boolean,
    newWords: IWord[],
    filter: string
}

function WordsValidation(props: { project: string }) {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        api.words.dublicate(props.project)
            .then((words) => {
                if (words) setError('Multiple words: ' + words.join(', '))
                setLoading(false)
            })
    }, [])

    if (loading)
        return <Spinner/>

    if (error)
        return <Tooltip2 content={error}>
            <Icon icon={IconNames.WARNING_SIGN} intent={Intent.WARNING}/>
        </Tooltip2>

    return null
}

@inject("global")
export default class WordsPage extends LoaderComponent<{ global?: GlobalStore }, State> {
    get project() {
        return this.props.global.project.code
    }

    prepare() {
        this.setState({newWords: []})
        return api.words.get(this.project)
            .then((words) => this.setState({words}))
    }

    successRender() {
        return <Container className="pt-2">
            <CreateWordDialog
                open={this.state.createWord}
                create={this.createWord}
                cancel={() => this.setState({createWord: false})}
            />
            <Row>
                <Col sm={2}><Button icon={IconNames.ADD} text="Create word"
                                    onClick={() => this.setState({createWord: true})}/></Col>
                <Col><InputGroup value={this.state.filter}
                                 onChange={(e) => this.setState({filter: e.target.value})}
                                 placeholder="filter"
                                 style={{width: 300}}
                /></Col>
                <Col>
                    <WordsValidation project={this.project}/>
                </Col>
            </Row>
            <Table striped size="sm">
                <thead>
                <tr>
                    <th>ID</th>
                    <th style={{width: "10%"}}>Class</th>
                    <th>Words</th>
                    <th style={{width: "25%"}}>Translate</th>
                    <th style={{width: 50}}/>
                </tr>
                </thead>
                <tbody>
                <WordsList words={this.state.newWords}
                           project={this.project}
                           filter={this.state.filter}/>
                <WordsList words={this.state.words}
                           project={this.project}
                           filter={this.state.filter}/>
                </tbody>
            </Table>
        </Container>
    }

    createWord = (cl: number, words: string) => {
        if (words.trim().length === 0) return
        api.words.translate(this.project, null, cl, words)
            .then((w) => {
                this.state.newWords.push(w)
                this.setState({
                    createWord: false,
                    newWords: this.state.newWords
                })
            })
    }
}