import api from "@/api/Api"
import {toast} from "@/components/AppToaster"
import globalStore from "@/stores/GlobalStore"
import {Button, FileInput, FormGroup, InputGroup, Intent, ProgressBar} from "@blueprintjs/core"
import React, {useEffect, useState} from 'react'
import {Container} from "react-bootstrap"

function ImportPackage() {
    const [file, setFile] = useState()
    const [uploading, setUploading] = useState()
    const [progress, setProgress] = useState()

    const onProgress = (event) => setProgress(event.loaded / event.total)
    const onUploaded = () => {
        setProgress(0)
        setFile(null)
        toast('Uploaded')
    }

    const uploadClick = () => {
        setUploading(true)
        api.project(globalStore.project.code)
            .import(file, onProgress)
            .then(onUploaded)
            .finally(() => setUploading(false))
    }

    return <>
        <FormGroup
            label="Translated Game zip-archive"
            labelFor="game-archive"
            className="pt-4"
        >
            <FileInput id="game-archive"
                       fill
                       text={file ? file.name : "Choose file..."}
                       onInputChange={(e) => setFile(e.target.files[0])} />
            {uploading && <ProgressBar value={progress} intent={Intent.PRIMARY} />}
            <Button onClick={uploadClick} disabled={!file || uploading}>UPLOAD</Button>
        </FormGroup>
    </>
}

function ImportJson() {
    const [file, setFile] = useState()
    const [uploading, setUploading] = useState()
    const [progress, setProgress] = useState()

    const onProgress = (event) => setProgress(event.loaded / event.total)
    const onUploaded = () => {
        setProgress(0)
        setFile(null)
        toast('Uploaded')
    }

    const uploadClick = () => {
        setUploading(true)
        api.project(globalStore.project.code)
            .json(file, onProgress)
            .then(onUploaded)
            .finally(() => setUploading(false))
    }

    return <>
        <FormGroup
            label="Translate in JSON"
            labelFor="json"
            className="pt-4"
        >
            <FileInput id="json"
                       fill
                       text={file ? file.name : "Choose file..."}
                       inputProps={{accept: ".json"}}
                       onInputChange={(e) => setFile(e.target.files[0])} />
            {uploading && <ProgressBar value={progress} intent={Intent.PRIMARY} />}
            <Button onClick={uploadClick} disabled={!file || uploading}>UPLOAD</Button>
        </FormGroup>
    </>
}

function ImportProject() {
    const [project, setProject] = useState('')
    const [loading, setLoading] = useState()

    const importClick = () => {
        setLoading(true)
        api.tools.import(project, globalStore.project.code)
            .then(() => setLoading(false))
    }

    const button = <Button
        onClick={importClick}
        disabled={!project}
        loading={loading}
    >IMPORT</Button>

    return <>
        <FormGroup
            label="Import from porject"
            labelFor="project-import"
            className="pt-4"
        >
            <InputGroup
                id="project-import"
                placeholder="Project code"
                rightElement={button}
                value={project}
                onChange={(e) => setProject(e.target.value)}
            />
        </FormGroup>
    </>
}

export function ImportPage() {
    useEffect(() => {
        document.title = `Import ${globalStore.project.name}`;
    }, [])

    return <Container>
        <ImportPackage/>
        <ImportJson/>
        <ImportProject/>
    </Container>
}