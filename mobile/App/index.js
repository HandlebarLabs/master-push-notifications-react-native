import React from "react";
import { ActivityIndicator, View } from "react-native";

import Question from "./screens/Question";
import Waiting from "./screens/Waiting";
import Welcome from "./screens/Welcome";
import EnablePush from "./screens/EnablePush";
import NotificationHistory from "./screens/NotificationHistory";

import Navigator from "./components/Navigator";
import Container from "./components/Container";

import * as UserData from "./util/UserData";
import * as QuestionData from "./util/QuestionData";
import { PushNotificationManager } from "./util/pushNotifications";

class App extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.goToRoute && this.props.goToRoute !== prevProps.goToRoute) {
      this.navigator.goTo(this.props.goToRoute);
    }
  }

  render() {
    if (!this.props.user.ready || !this.props.question.ready) {
      return (
        <Container padding>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        </Container>
      );
    }

    const initialSceneName = this.props.user.onboardingComplete ? "Question" : "Welcome";
    return (
      <Container padding>
        <Navigator
          ref={ref => (this.navigator = ref)}
          initialSceneName={initialSceneName}
          scenes={{
            Welcome: { component: Welcome },
            Question: { component: Question },
            Waiting: { component: Waiting },
            EnablePush: { component: EnablePush },
            NotificationHistory: { component: NotificationHistory },
          }}
        />
      </Container>
    );
  }
}

class WrappedApp extends React.Component {
  state = {
    goToRoute: null,
  };

  handlePushNotification = (data) => {
    if (data.questions && data.nextQuestionTime) {
      this.props.question
        .setQuestions(
          {
            data: {
              questions: data.questions,
              nextQuestionTime: data.nextQuestionTime,
            },
          },
          true,
        )
        .then(() => this.setState({ goToRoute: "Question" }));
    }

    if (data.target === "stats") {
      this.setState({ goToRoute: "Waiting" });
    }
  };

  render() {
    return (
      <PushNotificationManager
        onPushNotificationSelected={this.handlePushNotification}
        onPushNotificationReceived={this.handlePushNotification}
        onTokenReceived={token => this.props.user.storePushToken(token)}
      >
        <App goToRoute={this.state.goToRoute} {...this.props} />
      </PushNotificationManager>
    );
  }
}

export default () => (
  <UserData.Provider>
    <QuestionData.Provider>
      <QuestionData.Consumer>
        {question => (
          <UserData.Consumer>
            {user => <WrappedApp question={question} user={user} />}
          </UserData.Consumer>
        )}
      </QuestionData.Consumer>
    </QuestionData.Provider>
  </UserData.Provider>
);
