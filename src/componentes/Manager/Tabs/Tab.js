import React, { Component } from 'react'

export default class Tab extends Component {

    state={
        estadoDelete: false
    }

    onClick = () => {
        if(this.state.estadoDelete === false){
            const { label, onClickItem } = this.props;
            onClickItem(label);
        }
        else
            this.setState({estadoDelete : false})
    }

    onDelete = async (idTab) => {
        await this.setState({estadoDelete : true});
        this.props.eliminarReqDeTab(idTab);
    }

    render(){
        return(

            <li
                className={this.props.activeTab === this.props.label ? "tab-list-item tab-list-active" : "tab-list-item"}
                onClick={this.onClick}
            >
                {this.props.label}&nbsp; &nbsp; 
                <p className="equis" onClick={() => {this.onDelete(this.props.label)}}><b >x</b></p>
            </li>
        );
    }
}