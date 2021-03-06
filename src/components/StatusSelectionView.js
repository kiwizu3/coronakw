import React from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import layout from '../utils/layout';
import {TouchableOpacity} from 'react-native-gesture-handler';
import colors from '../utils/colors';
import fonts from '../utils/fonts';
import {connect} from 'react-redux';
import * as actionTypes from '../store/actionTypes';
import * as constants from '../utils/constants';
import {useTranslation} from 'react-i18next';
import * as actions from '../features/home/healthStatus/actions';

const StatusSelectionView = props => {
  const {t, i18n} = useTranslation();

  const StatusButton = statusCategory => {
    const dividerStyle = false //statusProps.hasDivider
      ? {
          borderEndWidth: 1,
          borderColor: colors.separatorColor,
        }
      : {};
    const handleTouch = () => {
      props.fetchQuestions(statusCategory.questionCategoryId, props.userId);
      // props.sendHealthState(statusProps.healthValue);

      // //show survey if clicked on not healthy
      // if (statusProps.healthValue == constants.UNHEALTHY && !props.isSick) {
      //   //TODO: probably don't show this on every unhealthy click
      //   props.healthSurveyShown(true);
      // }
    };
    return (
      <View style={[styles.statusContainer, dividerStyle]}>
        <TouchableOpacity
          onPress={handleTouch}
          style={{
            flex: 1,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            //opacity: props.healthState === statusProps.healthValue ? 1 : 0.3,
          }}>
          <View style={styles.circle}>
            <Image
              source={{uri: statusCategory.imagePath.replace(/\s+/g, '')}}
              style={styles.emoji}
            />
          </View>
          <Text style={styles.statusTitle}>{statusCategory.title}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const Statuses = () => {
    return (
      <>
        {props.categories.map(item => (
          <StatusButton
            title={item.questionCategoryName}
            imagePath={item.imagePath}
            questionCategoryId={item.questionCategoryId}
            hasDivider={item.hasDivider}
            healthValue={item.healthValue}
          />
        ))}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Statuses />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: layout.radius,
    backgroundColor: 'white',
    height: 160,
  },
  statusContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    height: 160,
  },
  circle: {
    width: 80,
    aspectRatio: 1,
    borderRadius: 40,
    backgroundColor: colors.paleGrey,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emoji: {
    width: 80,
    height: 80,
  },
  statusTitle: {
    fontFamily: fonts.Semibold,
    fontSize: 17,
  },
});

// Map State To Props (Redux Store Passes State To Component)
const mapStateToProps = state => {
  // Redux Store --> Component
  return {
    healthState: state.home.healthState,
    isSick: state.home.isSick,
    userId: state.user.userId,
  };
};

// Map Dispatch To Props (Dispatch Actions To Reducers. Reducers Then Modify The Data And Assign It To Your Props)
const mapDispatchToProps = dispatch => {
  // Action
  return {
    sendHealthState: healthStateValue =>
      dispatch({
        type: actionTypes.SEND_HEALTH_STATE,
        value: healthStateValue,
      }),
    healthSurveyShown: show =>
      dispatch({
        type: actionTypes.HEALTH_SURVEY_SHOWN,
        value: show,
      }),
    fetchQuestions: (QuestionCategoryId, PatientId) =>
      dispatch(actions.fetchQuestions(QuestionCategoryId, PatientId)),
  };
};

// Exports
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StatusSelectionView);
