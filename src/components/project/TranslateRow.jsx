import React, {Component} from "react";
import {Button} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";

import type {ITextsResponse} from "@/model/ITextsResponse";
import {TranslateEditor} from "@/components/project/TranslateEditor";
import './TranslateRow.scss'

export default class TranslateRow extends Component<{text: ITextsResponse}, {activated: boolean}> {
    state = {
        activated: false
    }

    render() {
        const t = this.props.text
        return <tr id={"t"+t.source.number}>
            <td className="num">{t.source.number}</td>
            <td className="source-text"><pre>{t.source.text}</pre></td>
            <td className="splitter">
                <Button icon={IconNames.CHEVRON_RIGHT}
                        minimal fill
                        onClick={() => this.setState({activated: true})}
            /></td>
            <td className="translate-text">
                {this.state.activated &&
                    <TranslateEditor text={t}
                                     activated={this.state.activated}
                                     onCancel={() => this.setState({activated: false})}
                    />
                }
                {t.translates && t.translates.map(tr => (
                    <TranslateEditor key={tr.author}
                                     text={t}
                                     translate={tr}
                    />
                ))}
            </td>
        </tr>
    }
}