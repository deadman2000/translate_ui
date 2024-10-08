import React from "react"
import {inject} from "mobx-react";
import LoaderComponent from "@/components/LoaderComponent";
import {GlobalStore} from "@/stores/GlobalStore";
import api from "@/api/Api";
import {Container, Table} from "react-bootstrap";
import type {IValidate} from "@/model/IValidate";
import {IconNames} from "@blueprintjs/icons";
import {AnchorButton, H3} from "@blueprintjs/core";
import Diff from "react-stylable-diff";

type State = {
    result: IValidate,
}

@inject("global")
export default class ValidatePage extends LoaderComponent<{ global?: GlobalStore }, State> {
    get project() {
        return this.props.global.project.code
    }

    prepare() {
        document.title = `Validate ${this.props.global.project.name}`;
        return api.project(this.project).validate()
            .then((result) => this.setState({result}))
    }

    successRender() {
        const res = this.state.result
        return <Container className="pt-2">
            <Table>
                <thead>
                <tr>
                    <th className="min-width"/>
                    <th className="min-width">Volume</th>
                    <th className="min-width">#</th>
                    <th>Text</th>
                </tr>
                </thead>
                <tbody>
                {res.symbols.length > 0 && <tr><td colSpan={4}><H3>Wrong symbols</H3></td></tr>}
                {res.symbols.map((s) => <tr>
                    <td>
                        <AnchorButton
                            href={`/projects/${this.project}/volumes/${s.volume}#t${s.number}`}
                            target="_blank"
                            icon={IconNames.SHARE}
                            minimal
                        />
                    </td>
                    <td>{s.volume}</td>
                    <td>{s.number}</td>
                    <td>
                        <Diff
                            inputA={s.tr}
                            inputB={s.converted}
                            type="chars"
                        /></td>
                </tr>)}
                {res.lines.length > 0 && <tr><td colSpan={4}><H3>Line count mismatch</H3></td></tr>}
                {res.lines.map((s) => <tr>
                    <td>
                        <AnchorButton
                            href={`/projects/${this.project}/volumes/${s.volume}#t${s.number}`}
                            target="_blank"
                            icon={IconNames.SHARE}
                            minimal
                        />
                    </td>
                    <td>{s.volume}</td>
                    <td>{s.number}</td>
                    <td>
                        <Diff
                            inputA={s.src}
                            inputB={s.tr}
                            type="chars"
                        /></td>
                </tr>)}
                </tbody>
            </Table>
        </Container>
    }
}