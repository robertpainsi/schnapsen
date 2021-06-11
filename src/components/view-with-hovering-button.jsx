import React from "react";

class ViewWithHoveringButton extends React.Component {
    render() {
        const {disabled, onClick, buttonContent} = this.props;
        return (
            <div className="d-inline position-relative">
                {this.props.children}
                <button disabled={disabled} onClick={onClick} className="btn btn-secondary w-100 p-1" style={{
                    position: 'absolute',
                    bottom: -20,
                    left: 0,
                    right: 0,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }}>{buttonContent}</button>
            </div>
        );
    }
}

export default ViewWithHoveringButton;
