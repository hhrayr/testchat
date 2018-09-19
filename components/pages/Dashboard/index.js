import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Chat from '../../Chat';
import SessionSelector from '../../SessionSelector';
import {
  getAllSessions,
  createSession,
  createChat,
  createUser,
  createUserReset,
  sendMessage,
} from '../../../redux/chat/actions';
import './dashboard.scss';

class Dashboard extends React.Component {
  static propTypes = {
    sessions: PropTypes.object.isRequired,
    chat: PropTypes.object.isRequired,
    createChat: PropTypes.func.isRequired,
    getAllSessions: PropTypes.func.isRequired,
    createSession: PropTypes.func.isRequired,
    createUser: PropTypes.func.isRequired,
    createUserReset: PropTypes.func.isRequired,
    sendMessage: PropTypes.func.isRequired,
  }

  componentDidMount() {
    if (this.props.getAllSessions) {
      this.props.getAllSessions();
    }
  }

  onSelectSession = (token) => {
    this.props.createChat({
      token,
    });
  }

  renderChat() {
    if (this.props.chat) {
      return (
        <Chat
          key="chat"
          chat={this.props.chat}
          createUser={this.props.createUser}
          createUserReset={this.props.createUserReset}
          sendMessage={this.props.sendMessage}
        />
      );
    }
    return null;
  }

  renderSessionSelector() {
    if (!this.props.chat) {
      return (
        <SessionSelector
          key="session-selector"
          sessions={this.props.sessions}
          createSession={this.props.createSession}
          onSelectSession={this.onSelectSession}
        />
      );
    }
    return null;
  }

  render() {
    return [
      this.renderSessionSelector(),
      this.renderChat(),
    ];
  }
}

export default connect(
  (state) => {
    return {
      sessions: state.chat.sessions,
      chat: state.chat.chat,
    };
  },
  {
    getAllSessions,
    createSession,
    createChat,
    createUser,
    createUserReset,
    sendMessage,
  },
)(Dashboard);
