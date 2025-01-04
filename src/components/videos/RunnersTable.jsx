import type {IRunner} from "@/model/IRunner";
import {Table} from "react-bootstrap";
import {formatDateTime, fromNow} from "@/Utils";
import React from "react";
import {IconNames} from "@blueprintjs/icons";
import {Button, Intent} from "@blueprintjs/core";

export function RunnersTable(props: { runners: IRunner[], onDelete: (runner: IRunner) => void }) {
    return <Table>
        <tbody>
        {props.runners.map(r => <tr key={r.id}>
            <td>{r.id}</td>
            <td>{r.ip}</td>
            <td>{formatDateTime(r.lastActivity)}</td>
            <td>{fromNow(r.lastActivity)}</td>
            <td><Button icon={IconNames.TRASH} intent={Intent.DANGER}
                        minimal onClick={() => props.onDelete(r)}/>
            </td>
        </tr>)}
        </tbody>
    </Table>
}