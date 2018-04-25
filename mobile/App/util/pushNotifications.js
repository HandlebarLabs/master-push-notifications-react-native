import React from "react";
import { View, AppState, Linking, Alert, Platform } from "react-native";
import OneSignal from "react-native-onesignal";
// import PushNotification from 'react-native-push-notification'
// import moment from "moment";

let pushToken;
export const getPushToken = () => Promise.resolve(pushToken);

export const openSettings = () => Linking.openURL("app-settings:");

export const registerForPushNotifications = () => {
  if (Platform.OS === "android") {
    return Promise.resolve();
  }

  OneSignal.registerForPushNotifications();
  return Promise.resolve();
};

// TODO: Badge number
// export const setBadgeNumber = (number = 0) => Notifications.setBadgeNumberAsync(number);
// export const setBadgeNumber = (number = 0) =>
//   PushNotification.setApplicationIconBadgeNumber(number);
export const setBadgeNumber = (number = 0) => Promise.resolve(number);

export class PushNotificationManager extends React.Component {
  static defaultProps = {
    onPushNotificationSelected: () => null,
    onPushNotificationReceived: () => null,
    onTokenReceived: () => null,
  };

  componentDidMount() {
    OneSignal.inFocusDisplaying(0);
    setBadgeNumber(0);

    AppState.addEventListener("change", this.handleAppStateChange);
    OneSignal.addEventListener("received", this.onReceived);
    OneSignal.addEventListener("opened", this.onOpened);
    OneSignal.addEventListener("ids", this.onIds);
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this.handleAppStateChange);
    OneSignal.removeEventListener("received", this.onReceived);
    OneSignal.removeEventListener("opened", this.onOpened);
    OneSignal.removeEventListener("ids", this.onIds);
  }

  onOpened = ({ notification }) => {
    if (!notification.isAppInFocus) {
      this.props.onPushNotificationSelected(notification.payload.additionalData);
    }
  };

  onReceived = (notification) => {
    if (notification.isAppInFocus) {
      Alert.alert("New questions available!", "Do you have what it takes?", [
        { text: "Ignore", style: "cancel" },
        {
          text: "Show Me",
          onPress: () => this.props.onPushNotificationReceived(notification.payload.additionalData),
        },
      ]);
    }
  };

  onIds = (device) => {
    pushToken = device.pushToken;
    this.props.onTokenReceived(device.pushToken);
  };

  handleAppStateChange = (nextAppState) => {
    if (nextAppState === "active") {
      setBadgeNumber(0);
    }
  };

  render() {
    return <View style={{ flex: 1 }}>{this.props.children}</View>;
  }
}

// TODO: Local notifications
// export const scheduleStatsNotification = () =>
//   Notifications.scheduleLocalNotificationAsync(
//     {
//       title: "Your stats are in!",
//       body: "See how you're doing",
//       data: {
//         target: "stats",
//       },
//     },
//     {
//       time: moment()
//         .day(7)
//         .hour(12)
//         .minute(30)
//         .toDate(), // next sunday at 12:30,
//       // time: moment()
//       //   .seconds(moment().seconds() + 15)
//       //   .toDate(),
//       repeat: "week",
//     },
//   ).catch(() => console.log("notifications disabled"));
// export const scheduleStatsNotification = PushNotification.localNotificationSchedule({
//   title: "Your stats are in!",
//   body: "See how you're doing",
//   data: {
//     target: "stats",
//   },
//   time: moment()
//     .day(7)
//     .hour(12)
//     .minute(30)
//     .toDate(), // next sunday at 12:30,
//   // time: moment()
//   //   .seconds(moment().seconds() + 15)
//   //   .toDate(),
//   repeatType: "week",
// });
// export const scheduleStatsNotification = () => Promise.resolve();
