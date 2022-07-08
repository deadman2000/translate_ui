import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import type {RouteProps} from "@/types/RouteProps";
import api from "@/api/Api";
import {Spinner} from "@blueprintjs/core";
import {
    Chart as ChartJS,
    LinearScale,
    TimeScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-moment';
import moment from "moment";

ChartJS.register(
    TimeScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler
);

@withRouter
export default class ChartPage extends Component<{} & RouteProps<{id: string}>> {
    state = {
        series: null
    }

    componentDidMount() {
        api.users.chart(this.props.match.params.id)
            .then((series) => {
                this.setState({series})
            })
    }

    render() {
        const {series} = this.state
        if (!series) return <Spinner />

        const options = {
            responsive: true,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day',
                        parser: moment.unix
                    }
                }
            },
            elements: {
                point: {
                    radius: 0
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        };

        const data = {
            datasets: [
                {
                    data: series,
                    fill: 'origin',
                    backgroundColor: "rgba(75,192,192,0.2)",
                    borderColor: "rgba(75,192,192,1)",
                    parsing: {
                        xAxisKey: 'd',
                        yAxisKey: 'l'
                    }
                }
            ],
        };

        return <Line type="line" options={options} data={data} />
    }
}