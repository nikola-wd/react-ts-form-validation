import React, { Component } from 'react';
import { render } from 'react-dom';
import ContactForm from './ContactForm';
import './style.css';

interface AppProps {}
interface AppState {
  name: string;
}

class App extends Component<AppProps, AppState> {
  constructor(props) {
    super(props);
    this.state = {
      name: 'React',
    };
  }

  render() {
    return <ContactForm />;
  }
}

render(<App />, document.getElementById('root'));
