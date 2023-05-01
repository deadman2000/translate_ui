import api from "@/api/Api"
import type {IProject} from "@/model/IProject"
import type {ISpellcheck} from "@/model/ISpellcheck"
import {SpellText} from "@/pages/projects/spellcheck/SpellText"
import {GlobalStore} from "@/stores/GlobalStore"
import {AnchorButton, Button, Card, H3, Icon, IconSize, Intent} from "@blueprintjs/core"
import {IconNames} from "@blueprintjs/icons"
import {inject} from "mobx-react"
import React from "react"
import {Container, Table} from "react-bootstrap"

function SpellRow(props: {spell: ISpellcheck, project: IProject, onComplete: () => void}) {
    const {spell, project} = props

    return <tr>
        <td className="min-width"><AnchorButton
            href={`/projects/${project.code}/volumes/${spell.volume}#t${spell.number}`}
            target="_blank"
            icon={IconNames.SHARE}
            minimal
        /></td>
        <td><SpellText id={spell.id} text={spell.text} spells={spell.spellcheck}/></td>
        <td className="min-width"><Button text="Skip" onClick={() => {
            api.spellcheck.skip(spell.id).then(props.onComplete)
        }}/></td>
    </tr>
}

type State = {
    spellchecks: ISpellcheck[],
    ok: boolean
}

@inject("global")
export default class SpellCheckPage extends React.Component<{global?: GlobalStore}, State> {
    state: State = {
        spellchecks: [],
        ok: false
    }

    componentDidMount() {
        this.update()
    }

    update() {
        const project = this.props.global.project
        api.spellcheck.get(project.code)
            .then((spellchecks) => {
                this.setState({
                    spellchecks,
                    ok: spellchecks.length === 0
                })
            })
    }

    render() {
        if (this.state.ok) return <Container className="pt-4">
            <Card style={{width: 300}} elevation={3}>
                <H3><Icon icon={IconNames.TICK_CIRCLE} intent={Intent.SUCCESS} size={IconSize.LARGE}/> All correct!</H3>
            </Card>
        </Container>

        const project = this.props.global.project
        return <Container className="pt-4">
            <Table striped bordered>
                <tbody>
                {this.state.spellchecks.map((s) => (
                    <SpellRow key={s.id}
                              spell={s}
                              project={project}
                              onComplete={() => this.removeSpellcheck(s)}
                    />
                ))}
                </tbody>
            </Table>
        </Container>
    }

    removeSpellcheck(spell: ISpellcheck)
    {
        const {spellchecks} = this.state
        const i = spellchecks.indexOf(spell)
        spellchecks.splice(i, 1)
        this.setState({spellchecks: spellchecks})
        if (spellchecks.length === 0) {
            this.update()
        }
    }
}
