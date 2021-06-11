import React from "react";
import Game from './game';
import getGameData from '../models/data';

export default class App extends React.Component {
    constructor(props) {
        super(props);

        getGameData()
            .then(data => this.setState({data}))
            .catch(console.error);

        this.state = {
            data: null,
        }
    }

    render() {
        const {data} = this.state;
        if (!data) {
            return <h2>Loading…</h2>;
        }
        return <Game data={data}/>;
    }
}
