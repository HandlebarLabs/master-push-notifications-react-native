import React from "react";
import moment from "moment";
import { View } from "react-native";

import Container from "../components/Container";
import Card from "../components/Card";
import { H1, H2 } from "../components/Text";
import { SecondaryButton } from "../components/Button";
import Stats from "../components/Stats";

import * as UserData from "../util/UserData";
import * as QuestionData from "../util/QuestionData";

class Waiting extends React.Component {
  handleLogout = () => {
    this.props.logout();
    this.props.goTo("Welcome");
  };

  render() {
    return (
      <Container>
        <Card>
          <H2 center> Next question in:</H2>
          <H1>
            {this.props.nextQuestionTime
              ? moment(new Date(this.props.nextQuestionTime)).toNow(true)
              : "..."}
          </H1>
          <Stats
            username={this.props.username}
            correct={this.props.correctAnswered}
            total={this.props.totalAnswered}
          />
        </Card>
        <View>
          <SecondaryButton border={false} onPress={this.handleLogout}>
            Logout
          </SecondaryButton>
        </View>
      </Container>
    );
  }
}

const WithUserData = props => (
  <UserData.Consumer>
    {({
 logout, totalAnswered, correctAnswered, username,
}) => (
  <Waiting
    {...props}
    logout={logout}
    totalAnswered={totalAnswered}
    correctAnswered={correctAnswered}
    username={username}
  />
    )}
  </UserData.Consumer>
);

const WithQuestionData = props => (
  <QuestionData.Consumer>
    {({ nextQuestionTime }) => <WithUserData {...props} nextQuestionTime={nextQuestionTime} />}
  </QuestionData.Consumer>
);

export default WithQuestionData;
