import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import './dialog.css'

class Dialog extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  } 

  render(){ return (<noscript></noscript>); }

  componentDidMount(){
    // console.log('Dialog mount', this.props)
    this.renderPopup();
  }
  componentDidUpdate() {
    // console.log('Dialog update', this.props)
    this.renderPopup();
  }
  componentWillUnmount() {
    ReactDOM.unmountComponentAtNode(this.popup);
    document.body.removeChild(this.popup);
  }

  renderPopup() {
    if (!this.popup) {
        this.popup = document.createElement("div");
        this.popup.setAttribute('class','dialog')
        document.body.appendChild(this.popup);
    }

    ReactDOM.render(
       <div className="dialog-wrapper">
          <div className="dialog-shadow"/>
            <div className="dialog-overlay">
              {this.props.content}
            </div>
      </div>,
      this.popup
    );
  }
}

export default Dialog;