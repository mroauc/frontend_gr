import React, { Component } from 'react';
import Tab from './TabEstatico';
import '../../Manager.css';

export default class Tabs extends Component{

    constructor(props) {
        super(props);
    
        this.state = {
          activeTab: this.props.children[0].props.label
        };
      }

    onClickTabItem = (tab) => {
        this.setState({ activeTab: tab });
    }

    render(){
        return(
            
            <React.Fragment>
                <div className="tabs-inferior">
                    <ol className="tab-list" style={{marginLeft:'-10px', width:'calc(100% + 20px)'}}>

                        {this.props.children.map((child) => {
                            
                            if(child.props !== undefined){
                                const label = child.props.label;

                                return (
                                <Tab
                                    activeTab={this.state.activeTab}
                                    key={label}
                                    label={label}
                                    onClickItem={this.onClickTabItem}
                                />
                                );
                            }
                        })}
                    </ol>

                    <div className="tab-content-inferior">
                        {this.props.children.map((child) => {
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