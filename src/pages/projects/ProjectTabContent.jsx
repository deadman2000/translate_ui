import {FixesPage} from "@/pages/projects/fixes/FixesPage"
import React from "react";
import {withRouter} from "react-router-dom";

import PatchesPage from "@/pages/projects/patches/PatchesPage";
import VolumesPage from "@/pages/projects/volumes/VolumesPage";
import type {RouteProps} from "@/types/RouteProps";
import DownloadPage from "@/pages/projects/download/DownloadPage";

type R = {
    tabid: string,
    project: string,
}

function PageSwitch({tab}: {tab: string}) {
    switch (tab) {
        case 'volumes':
            return <VolumesPage />
        case 'patches':
            return <PatchesPage />
        case 'download':
            return <DownloadPage />
        case 'fixes':
            return <FixesPage />
    }
    return <div/>
}

@withRouter
export default class ProjectTabContent extends React.Component<{} & RouteProps<R>> {
    render() {
        return <>
            <PageSwitch tab={this.props.match.params.tabid} />
        </>
    }
}