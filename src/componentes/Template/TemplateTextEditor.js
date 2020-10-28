import React, {Component} from 'react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CKEditor from '@ckeditor/ckeditor5-react';


class TemplateTextEditor extends Component{
    render(){
        return(
            <div className="editor">
                <label htmlFor="template">Template</label>
                <CKEditor
                    editor={ClassicEditor}
                    data={this.props.template}
                    onChange={ (event, editor)=>{
                        const data= editor.getData();
                        this.props.obtenerTemplate(data);
                    }}
                />
            </div>
        );
    }
}

export default TemplateTextEditor;