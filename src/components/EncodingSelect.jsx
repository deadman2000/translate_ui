import React, {Component} from "react";
import api from "@/api/Api";
import {IEncoding} from "@/model/IEncoding";
import Select from "react-select";

type Props = {
    value: string,
    onChange: (value: string) => void,
}

type State = {
    encodings: IEncoding[],
    byName: Map<string, IEncoding>,
    selected: IEncoding,
}

export class EncodingSelect extends Component<Props,State> {
    state : State = {
        encodings: [],
        byName: null,
        selected: null,
    }

    componentDidMount() {
        api.tools.encodings().then(result => {
            const byName = new Map(result.map(e => [e.name, e]))
            const selected = byName.get(this.props.value)
            this.setState({encodings: result, byName, selected})
        })
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot) {
        if (this.props.value !== prevProps.value)
        {
            if (this.state.byName) {
                const selected = this.state.byName.get(this.props.value)
                this.setState({selected})
            }
        }
    }

    render() {
        if (!this.state.byName) return <></>

        return <Select
            options={this.state.encodings}
            defaultValue={this.state.selected}
            getOptionLabel={option => option.displayName}
            getOptionValue={option => option.name}
            onChange={this.selectItem}
        />
    }

    selectItem = (v: IEncoding) => {
        if (!v) return
        if (this.props.onChange)
            this.props.onChange(v.name)
    }
}