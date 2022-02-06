import React from "react";
import {withRouter} from "react-router-dom";

import PatchesPage from "@/pages/projects/patches/PatchesPage";
import VolumesPage from "@/pages/projects/volumes/VolumesPage";
import type {RouteProps} from "@/types/RouteProps";
import DownloadPage from "@/pages/projects/download/DownloadPage";

type R = {
    tabid: string
}

@withRouter
export default class ProjectTabContent extends React.Component<{} & RouteProps<R>> {
    render() {
        const tab = this.props.match.params.tabid
        switch (tab) {
            case 'volumes':
                return <VolumesPage />
            case 'patches':
                return <PatchesPage />
            case 'download':
                return <DownloadPage />
        }

        return <div/>
    }
}