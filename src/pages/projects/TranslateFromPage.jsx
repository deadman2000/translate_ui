import React, {useEffect, useState} from 'react'
import {Col, Container, Row, Table} from "react-bootstrap";
import {AnchorButton, Button, FormGroup, InputGroup, Intent} from "@blueprintjs/core";
import api from "@/api/Api";
import globalStore from "@/stores/GlobalStore";
import Diff from "react-stylable-diff";
import type {IMatchResult} from "@/model/IMatchResult";
import {IconNames} from "@blueprintjs/icons";

export function TranslateFromPage() {
    const [project, setProject] = useState('')
    const [loading, setLoading] = useState(false)
    const [skip, setSkip] = useState([])
    const [results, setResults] = useState([])
    const [auoload, setAutoload] = useState(false)

    useEffect(() => {
        const s = localStorage.getItem('match_skip')
        if (s) setSkip(s.split(','))
    }, [])

    useEffect(() => {
        if (auoload && !loading && results.length === 0)
            requestNew()
    }, [results, skip, loading, auoload])

    const resetSkip = () => {
        localStorage.removeItem('match_skip')
        setSkip([])
    }

    const saveSkip = (newSkip: [], callback) => {
        localStorage.setItem('match_skip', newSkip.join(','))
        setSkip(newSkip, callback)
    }

    const requestNew = () => {
        if (!project) return
        setLoading(true)
        api.tools.matchText(globalStore.project.code, project, skip, 10)
            .then((response) => {
                setAutoload(response.results.length > 0)
                saveSkip([...skip, ...response.skip])
                setResults(response.results)
            })
            .catch(() => {
                setAutoload(false)
                setResults([])
            })
            .finally(() => setLoading(false))
    }

    const removeResult = (result: IMatchResult) => {
        setResults(results.filter(r => r.id !== result.id))
    }

    const skipResult = (result: IMatchResult) => {
        saveSkip([...skip, result.id])
        removeResult(result)
    }

    const submit = (result: IMatchResult) => {
        api.translate.submitById(globalStore.project.code, result.id, result.tr)
            .then(() => removeResult(result))
    }

    const button = <Button
        onClick={requestNew}
        disabled={!project}
        loading={loading}>GET</Button>

    return <Container>
        <Row className="pt-4">
            <Col>
                <FormGroup
                    label="Porject"
                    labelFor="project"
                    inline
                >
                    <InputGroup
                        id="project"
                        placeholder="Project code"
                        rightElement={button}
                        value={project}
                        onChange={(e) => setProject(e.target.value)}
                    />
                </FormGroup>
            </Col>
            <Col><Button onClick={() => {
                resetSkip()
            }}>RESET ({skip.length})</Button></Col>
        </Row>
        <Table>
            <thead>
            <tr>
                <th className="min-width"/>
                <th/>
                <th className="min-width"/>
                <th className="min-width"/>
                <th className="min-width"/>
            </tr>
            </thead>
            <tbody>
                {results.map((result) => <tr key={result.id}>
                    <td>
                        <AnchorButton
                            href={`/projects/${globalStore.project.code}/volumes/${result.volume}#t${result.number}`}
                            target="_blank"
                            icon={IconNames.DOCUMENT_OPEN}
                            minimal
                        />
                        <AnchorButton
                            href={`/projects/${project}/volumes/${result.srcVolume}#t${result.srcNumber}`}
                            target="_blank"
                            icon={IconNames.SHARE}
                            minimal
                        />
                    </td>
                    <td>
                        <div>
                        <Diff
                            inputA={result.dst}
                            inputB={result.src}
                            type="chars"
                        />
                        </div>
                        <div>
                            {result.tr}
                        </div>
                    </td>
                    <td>
                        {result.score}
                    </td>
                    <td>
                        <Button intent={Intent.DANGER}
                                onClick={() => skipResult(result)}
                        >SKIP</Button>
                    </td>
                    <td>
                        <Button intent={Intent.SUCCESS}
                                onClick={() => submit(result)}
                        >APPLY</Button>
                    </td>
                </tr>)}
            </tbody>
        </Table>
    </Container>
}