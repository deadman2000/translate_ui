import type {IRunner} from "@/model/IRunner";
import {Table} from "react-bootstrap";
import {formatDateTime, fromNow} from "@/Utils";
import React from "react";

export function RunnersTable(props: { runners: IRunner[] }) {
    return <Table>
        <tbody>
        {props.runners.map(r => <tr key={r.id}>
            <td>{r.id}</td>
            <td>{r.ip}</td>
            <td>{formatDateTime(r.lastActivity)}</td>
            <td>{fromNow(r.lastActivity)}</td>
        </tr>)}
        </tbody>
    </Table>
}