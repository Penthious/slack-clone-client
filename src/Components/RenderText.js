import React, { Component } from 'react';

export default class MyComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
    };
  }

  async componentWillMount() {
    const response = await fetch(this.props.url);
    const text = await response.text();

    this.setState({ text });
  }

  render() {
    const { text } = this.state;
    return (
      <div>
        <div>===============</div>
        <p>{text}</p>
        <div>===============</div>
      </div>
    );
  }
}
