import DownloadPage from "@/pages/projects/download/DownloadPage";
import {ReplacePage} from "@/pages/projects/replace/ReplacePage"
import {ImportPage} from "@/pages/projects/ImportPage"

import PatchesPage from "@/pages/projects/patches/PatchesPage";
import VolumesPage from "@/pages/projects/volumes/VolumesPage";
import type {RouteProps} from "@/types/RouteProps";
import React from "react";
import {withRouter} from "react-router-dom";

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
        case 'replace':
            return <ReplacePage />
        case 'import':
            return <ImportPage />
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