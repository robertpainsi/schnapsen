import React from "react";
import {classNames} from '../utils/utils';
import {cardToImgSrc} from '../utils/schnapsen-utils';

export default class Card extends React.Component {
    render() {
        const {card, onClick, className, style} = this.props;

        return <img src={cardToImgSrc(card)} className={classNames("schnapsen-card", className)} style={style}
                    onClick={onClick}/>;
    }
}
