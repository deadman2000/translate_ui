import React from "react";
import {withRouter} from "react-router-dom";
import SaidsSwitchPage from "@/pages/projects/saids/SaidsSwitchPage"
import VolumesListPage from "@/pages/projects/volumes/VolumesListPage"
import DownloadPage from "@/pages/projects/download/DownloadPage";
import {ImportPage} from "@/pages/projects/ImportPage"
import SuffixesPage from "@/pages/projects/suffixes/SuffixesPage"
import WordsPage from "@/pages/projects/words/WordsPage"
import PatchesPage from "@/pages/projects/patches/PatchesPage";
import ProjectLeftMenu from "@/components/project/ProjectLeftMenu"
import {ReplacePage} from "@/pages/projects/replace/ReplacePage"
import {SettingsPage} from "@/pages/projects/SettingsPage"
import SpellCheckPage from "@/pages/projects/spellcheck/SpellCheckPage"
import SearchPage from "@/pages/SearchPage"
import ValidatePage from "@/pages/projects/validate/ValidatePage";

type R = {
    tabid: string,
    project: string,
}

function PageSwitch({tab}: { tab: string }) {
    switch (tab) {
        case 'volumes':
            return <VolumesListPage/>
        case 'patches':
            return <PatchesPage/>
        case 'download':
            return <DownloadPage/>
        case 'spellcheck':
            return <SpellCheckPage/>
        case 'replace':
            return <ReplacePage/>
        case 'import':
            return <ImportPage/>
        case 'settings':
            return <SettingsPage/>
        case 'search':
            return <SearchPage/>
        case 'words':
            return <WordsPage/>
        case 'suffixes':
            return <SuffixesPage/>
        case 'saids':
            return <SaidsSwitchPage/>
        case 'validate':
            return <ValidatePage/>
    }
    return <div/>
}

@withRouter
export default class ProjectTabContent extends React.Component<{} & RouteProps<R>> {
    render() {
        return <>
            <ProjectLeftMenu>
                <PageSwitch tab={this.props.match.params.tabid}/>
            </ProjectLeftMenu>
        </>
    }
}