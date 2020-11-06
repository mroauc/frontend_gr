import React, { Component } from 'react';
import Tab from './Tab';

export default class Tabs extends Component{

    // state = {
    //     activeTab: ''
    // }

    // componentDidMount(){
    //     this.setState({
    //         activeTab: this.props.children[0].props.label
    //     })
    // }

    constructor(props) {
        super(props);
    
        this.state = {
          activeTab: this.props.children[0].props.label,
        };
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
            
            <div>
                {console.log(this.props)}
               <div className="tabs">
                    <ol className="tab-list">
                    {console.log(this.props)}

                    
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
            </div>
        );
    }
}