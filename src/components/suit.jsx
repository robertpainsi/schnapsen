import React from "react";
import {classNames} from '../utils/utils';
import {suitToImgSrc} from '../utils/schnapsen-utils';

class Suit extends React.Component {
    render() {
        const {suit, className, style} = this.props;

        return (
            <img src={suitToImgSrc(suit)} className={classNames("schnapsen-suit", className)} style={style}/>
        );
    }
}

export default Suit;
