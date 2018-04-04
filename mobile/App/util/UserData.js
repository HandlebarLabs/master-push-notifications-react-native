import React from "react";
import { AsyncStorage } from "react-native";

const defaultState = {
  ready: false,
  onboardingComplete: false,
  username: null,
  totalAnswered: 0,
  correctAnswered: 0,
  answers: {},
};

const UserContext = React.createContext(defaultState);

export const Consumer = UserContext.Consumer;

export class Provider extends React.Component {
  state = defaultState;

  componentDidMount() {
    AsyncStorage.getItem("userData")
      .then((state) => {
        this.setState({
          ...JSON.parse(state),
          ready: true,
        });
      })
      .catch((err) => {
        alert("An error occurred loading your user data.");
        console.log("user data loading error", err);
      });
  }

  componentDidUpdate() {
    AsyncStorage.setItem("userData", JSON.stringify({ ...this.state, ready: false }));
  }

  setUsername = (username = null) => {
    this.setState({ username });
  };

  answerQuestion = (question, answer) => {
    this.setState(state => ({
      answers: {
        ...state.answers,
        [question._id]: { wasCorrect: answer.correct, answer: answer.answer },
      },
      totalAnswered: state.totalAnswered + 1,
      correctAnswered: answer.correct ? state.correctAnswered + 1 : state.correctAnswered,
    }));
  };

  completeOnboarding = () => this.setState({ onboardingComplete: true });

  logout = () => {
    this.setState({ ...defaultState, ready: true });
  };

  render() {
    return (
      <UserContext.Provider
        value={{
          ...this.state,
          logout: this.logout,
          completeOnboarding: this.completeOnboarding,
          setUsername: this.setUsername,
          answerQuestion: this.answerQuestion,
        }}
      >
        {this.props.children}
      </UserContext.Provider>
    );
  }
}
