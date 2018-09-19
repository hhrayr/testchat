import React from 'react';
import PropTypes from 'prop-types';

export default class SessionSelector extends React.PureComponent {
  static propTypes = {
    sessions: PropTypes.shape({
      loading: PropTypes.bool,
      loadingError: PropTypes.object,
      creating: PropTypes.bool,
      creatingError: PropTypes.object,
      createdSession: PropTypes.string,
      data: PropTypes.array,
    }).isRequired,
    createSession: PropTypes.func.isRequired,
    onSelectSession: PropTypes.func.isRequired,
  }

  onSelectSession = (event) => {
    const val = event.target.value;
    if (val === 'new') {
      this.props.createSession();
    } else if (val !== '-') {
      this.props.onSelectSession(val);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.sessions.createdSession && this.props.sessions.creating) {
      this.props.onSelectSession(nextProps.sessions.createdSession);
    }
  }

  renderOptions() {
    const res = [<option key="-" value="-">-- Pealse select --</option>];
    if (this.props.sessions.data) {
      this.props.sessions.data.forEach((token) => {
        res.push(<option key={token} value={token}>{token}</option>);
      });
    }
    res.push(<option key="new" value="new">Create New...</option>);
    return res;
  }

  render() {
    return (
      <div className="form">
        <label>Connect to session</label>
        <select
          onChange={this.onSelectSession}
          value="-"
        >
          {this.renderOptions()}
        </select>
      </div>
    );
  }
}
