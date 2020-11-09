import React, { Component } from 'react';
import Tab from './Tab';
import '../Manager.css';

export default class Tabs extends Component{

    state={
        clickTab: ''
    }

    constructor(props) {
        super(props);
        this.state = {
            activeTab: this.props.children[0].props.label,
        };
    }

    componentWillReceiveProps(next_props) {
        this.activeTabForClick();
    }

    activeTabForClick = async () => {
        let tabActivo = this.props.consultaTabActivo();
        await tabActivo.then(response => {
            if(response !== ""){    
                this.setState({activeTab : response})
            }
            else{
                this.state = { activeTab: this.props.children[0].props.label}
            }
        });
    }

    onClickTabItem = (tab) => {
        this.setState({ activeTab: tab });
    }

    deleteTab = async (idTab) => {
        this.props.eliminarReqDeTab(idTab);
        await this.onClickTabItem(this.props.children[0].props.label);
    }

    render(){
        return(
            
            <React.Fragment>
               <div className="tabs">
                    <ol className="tab-list">
                    <Tab
                        activeTab={this.state.activeTab}
                        key={this.props.children[0].props.label}
                        label={this.props.children[0].props.label}
                        onClickItem={this.onClickTabItem}
                        eliminarReqDeTab={this.deleteTab}
                    />

                    
                    {this.props.children[1].props.children.map((child) => {
                        
                        
                        if(child.props !== undefined){
                            const label = child.props.label;

                            return (
                            <Tab
                                activeTab={this.state.activeTab}
                                key={label}
                                label={label}
                                onClickItem={this.onClickTabItem}
                                eliminarReqDeTab={this.deleteTab}
                            />
                            );
                        }
                    })}
                    </ol>

                    <div className="tab-content">
                        {this.props.children[1].props.children.map((child) => {
                            if(child.props !== undefined){
                                if (child.props.label !== this.state.activeTab) return undefined;
                                return child.props.children;
                            }
                            
                        })}
                    </div>

                </div>
            </React.Fragment>
        );
    }
}