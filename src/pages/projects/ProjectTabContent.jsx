import DownloadPage from "@/pages/projects/download/DownloadPage";
import {ImportPage} from "@/pages/projects/ImportPage"
import PatchesPage from "@/pages/projects/patches/PatchesPage";
import ProjectLeftMenu from "@/pages/projects/ProjectLeftMenu"
import {ReplacePage} from "@/pages/projects/replace/ReplacePage"
import {SettingsPage} from "@/pages/projects/SettingsPage"
import SpellCheckPage from "@/pages/projects/spellcheck/SpellCheckPage"
import VolumesListPage from "@/pages/projects/volumes/VolumesListPage"
import React from "react";
import {withRouter} from "react-router-dom";

type R = {
    tabid: string,
    project: string,
}

function PageSwitch({tab}: {tab: string}) {
    switch (tab) {
        case 'volumes':
            return <VolumesListPage/>
        case 'patches':
            return <PatchesPage />
        case 'download':
            return <DownloadPage />
        case 'spellcheck':
            return <SpellCheckPage />
        case 'replace':
            return <ReplacePage />
        case 'import':
            return <ImportPage />
        case 'settings':
            return <SettingsPage />
    }
    return <div/>
}

@withRouter
export default class ProjectTabContent extends React.Component<{} & RouteProps<R>> {
    render() {
        return <>
            <ProjectLeftMenu>
                <PageSwitch tab={this.props.match.params.tabid} />
            </ProjectLeftMenu>
        </>
    }
}