import React, { Component } from 'react'

export default class Tab extends Component {

    state={
        estadoDelete: false
    }

    onClick = () => {
        const { label, onClickItem } = this.props;
        onClickItem(label);
    }

    render(){
        return(

            <li
                className={this.props.activeTab === this.props.label ? "tab-list-item tab-list-active" : "tab-list-item"}
                onClick={this.onClick}
            >
                {this.props.label}
            </li>
        );
    }
}