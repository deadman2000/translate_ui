import type {IVolume} from "@/model/IVolume";
import {formatDateTime, fromNow} from "@/Utils";
import {Tooltip2} from "@blueprintjs/popover2";
import React from "react";
import {Link} from "react-router-dom";

export function VolumeRow(props: { volume: IVolume, baseUrl: string }) {
    const v = props.volume
    const url = props.baseUrl

    const prTranslated = v.translatedLetters / v.letters
    const prTranslatedP = Math.round(prTranslated * 100)
    const prApproved = v.approvedLetters / v.letters
    const prApprovedP = Math.round(prApproved * 100)

    return <tr>
        <td className="min-width"><Link to={`${url}/${v.code}`}>{v.name}</Link></td>
        <td className="min-width">
            {v.lastSubmit && <Tooltip2 content={formatDateTime(v.lastSubmit)}>{fromNow(v.lastSubmit)}</Tooltip2>}
        </td>
        <td className="max-width">
            {v.translatedLetters > 0 && (
                <div className="progress">
                    <div className="progress-bar bg-success" role="progressbar" style={{width: prApprovedP + "%"}}>
                    </div>
                    <div className="progress-bar" role="progressbar"
                         style={{width: (prTranslatedP - prApprovedP) + "%"}}>
                    </div>
                </div>
            )}
            {!!v.description && <div className="description">{v.description}</div>}
        </td>
        <td className="min-width volume-stats">
            <div>{v.translatedTexts} / {v.texts}</div>
            <div>{v.translatedLetters} / {v.letters}</div>
        </td>
    </tr>
}