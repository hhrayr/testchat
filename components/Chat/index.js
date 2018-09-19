import React from 'react';
import PropTypes from 'prop-types';
import './chat.scss';

export default class Chat extends React.PureComponent {
  static propTypes = {
    chat: PropTypes.shape({
      token: PropTypes.string,
      user: PropTypes.string,
      messages: PropTypes.arrayOf(PropTypes.shape({
        message: PropTypes.string,
        user: PropTypes.string,
        __timestamp: PropTypes.number,
      })),
      creatingUser: PropTypes.bool,
      creatingUserError: PropTypes.any,
    }).isRequired,
    createUser: PropTypes.func.isRequired,
    createUserReset: PropTypes.func.isRequired,
    sendMessage: PropTypes.func.isRequired,
  }

  state = { message: '' };

  componentWillReceiveProps(nextProps) {
    if (this.messagesContainer &&
      nextProps.chat.messages &&
      this.props.chat.messages) {
      setTimeout(() => {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
      }, 200);
    }
  }

  createUser = () => {
    if (!this.props.chat.creatingUser) {
      const user = this.userInput.value;
      if (user) {
        this.props.createUser({
          token: this.props.chat.token,
          user,
        });
      }
    }
  };

  createUserReset = () => {
    this.props.createUserReset();
  }

  onMessageInputKeyDonw = (event) => {
    if (this.state.message &&
      (event.which === 13 || event.keyCode === 13)) {
      this.props.sendMessage({
        token: this.props.chat.token,
        data: {
          message: this.state.message,
          user: this.props.chat.user,
        },
      });
      this.setState({ message: '' });
      return false;
    }
    return true;
  }

  renderUserCreateUserBox() {
    return (
      <div className="create-user">
        {!this.props.chat.creatingUserError
          ? this.renderUserCreateUserForm()
          : this.renderUserCreateUserError()
        }
      </div>
    );
  }

  renderUserCreateUserForm() {
    return (
      <div className="form">
        <input
          ref={(c) => { this.userInput = c; }}
          type="text"
          placeholder="Enter your name..."
        />
        <button onClick={this.createUser}>
          {this.props.chat.creatingUser
            ? '...'
            : 'OK'
          }
        </button>
      </div>
    );
  }

  renderUserCreateUserError() {
    return (
      <div className="error form">
        <p>
          {this.props.chat.creatingUserError.message || this.props.chat.creatingUserError}
        </p>
        <button onClick={this.createUserReset}>
          Enter another name
        </button>
      </div>
    );
  }

  renderMessagesBox() {
    return (
      <div className="message-container">
        <div className="messages" ref={(e) => { this.messagesContainer = e; }}>
          {this.renderMessages()}
        </div>
        <div className="user-input">
          <div className="user">
            {this.props.chat.user}
          </div>
          <div className="input">
            <input
              onChange={(e) => { this.setState({ message: e.target.value }); }}
              onKeyDown={this.onMessageInputKeyDonw}
              value={this.state.message}
              type="text"
              placeholder="Enter message..."
            />
          </div>
        </div>
      </div>
    );
  }

  renderMessages() {
    if (this.props.chat.messages) {
      return this.props.chat.messages.map((message) => {
        const messageCOntainerClass = ['message'];
        if (message.user === this.props.chat.user) {
          messageCOntainerClass.push('own');
        }
        if (message.user === 'SYSTEM_USER') {
          messageCOntainerClass.push('system');
        }
        return (
          <div key={message.__id} className={messageCOntainerClass.join(' ')}>
            <div className="headline">
              <div className="timestamp">
                {new Date(message.__timestamp).toLocaleString()}
              </div>
              {message.user !== this.props.chat.user &&
                message.user !== 'SYSTEM_USER' &&
                <div className="user">
                  {message.user}
                </div>
              }
            </div>
            <div className="msg">
              {message.message}
            </div>
          </div>
        );
      });
    }
    return null;
  }

  render() {
    return (
      <div className="chat">
        <div className="headline">
          <p>{this.props.chat.token}</p>
        </div>
        <div className="body">
          {this.props.chat.user
            ? this.renderMessagesBox()
            : this.renderUserCreateUserBox()
          }
        </div>
      </div>
    );
  }
}
