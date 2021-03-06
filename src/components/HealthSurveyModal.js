import React from 'react';
import {View, StyleSheet, Text, Image, SafeAreaView} from 'react-native';
import {TouchableOpacity, FlatList} from 'react-native-gesture-handler';
import images from '../utils/images';
import colors from '../utils/colors';
import fonts from '../utils/fonts';
import {connect} from 'react-redux';
import Button from './Button';
import {useTranslation} from 'react-i18next';
import * as actions from '../features/home/healthStatus/actions';
import reactotron from 'reactotron-react-native';

const HealthSurveyModal = props => {
  const {t, i18n} = useTranslation();

  const styles = StyleSheet.create({
    content: {
      backgroundColor: 'white',
      padding: 16,
      borderRadius: 15,
      borderColor: colors.opacityBlack,
    },
    contentTitle: {
      textAlign: 'left',
      fontFamily: fonts.Semibold,
      color: colors.opacityBlack,
      fontSize: 15,
      marginBottom: 6,
    },
    contentSubTitle: {
      textAlign: 'left',
      fontFamily: fonts.Bold,
      fontSize: 22,
      marginBottom: 24,
    },
    contentQuestion: {
      fontFamily: fonts.Medium,
      fontSize: 17,
      marginBottom: 12,
    },
    questionContainer: {
      flexDirection: 'row',
      padding: 16,
      paddingBottom: 24,
      paddingTop: 24,
      flex: 1,
      justifyContent: 'space-between',
    },
    list: {
      width: '100%',
    },
    listSeparator: {
      height: 1,
      backgroundColor: colors.separatorColor,
    },
  });

  const Question = questionProps => {
    const question = questionProps.item;
    const checked =
      props.answers.hasOwnProperty(question.questionOptionId) &&
      props.answers[question.questionOptionId] === true;
    const handleTouch = () => {
      if (props.single) {
        props.changeAnswerYesNo({
          id: question.questionOptionId,
          answer: !checked,
        });
      } else {
        props.changeAnswer({id: question.questionOptionId, answer: !checked});
      }
    };

    return (
      <TouchableOpacity onPress={handleTouch} style={styles.questionContainer}>
        <Text style={styles.contentQuestion}>{question.optionText}</Text>
        <Image source={checked ? images.check : images.uncheck} />
      </TouchableOpacity>
    );
  };

  const pressedButton = () => {
    if (props.onSelectOptions) {
      let arr = [];
      Object.keys(props.answers).forEach(key => {
        if (props.answers[key]) {
          arr.push(key);
        }
      });
      const answerText = arr.join();
      props.onSelectOptions(answerText);
    }
  };

  const ListSeparator = () => <View style={styles.listSeparator} />;

  const Questions = () => {
    return (
      <FlatList
        style={styles.list}
        data={props.question.options}
        renderItem={Question}
        ItemSeparatorComponent={ListSeparator}
        keyExtractor={item => item.questionOptionId + ''}
      />
    );
  };

  const values = Object.values(props.answers);

  var numberOfSymptoms =
    values.length > 0
      ? Object.values(props.answers).reduce(
          (p, c) => (c === true ? p + 1 : p),
          0,
        )
      : 0;

  var buttonMsg =
    t('healthSurveyModal.confirm') +
    ` ${numberOfSymptoms} ` +
    t('healthSurveyModal.symptoms');
  if (props.single) {
    buttonMsg = t('healthSurveyModal.confirm');
  } else if (numberOfSymptoms === 0) {
    buttonMsg = t('healthSurveyModal.noSymptoms');
  } else if (numberOfSymptoms === 1) {
    buttonMsg = t('healthSurveyModal.oneSymptom');
  } else if (numberOfSymptoms === 2) {
    buttonMsg = t('healthSurveyModal.twoSymptoms');
  }

  const MultiOptionQuestion = () => {
    return (
      <View style={styles.content}>
        {/* <Text style={styles.contentTitle}>{t('healthSurveyModal.title')}</Text> */}
        <Text style={styles.contentSubTitle}>
          {props.question.questionText}
        </Text>
        <Questions />
        <Button text={buttonMsg} onPress={pressedButton} />
      </View>
    );
  };
  return (
    <SafeAreaView>
      <MultiOptionQuestion />
    </SafeAreaView>
  );
};

// Map State To Props (Redux Store Passes State To Component)
const mapStateToProps = state => {
  // Redux Store --> Component
  return {
    showSurvey: state.home.showSurvey,
    answers: state.home.answers,
  };
};

// Map Dispatch To Props (Dispatch Actions To Reducers. Reducers Then Modify The Data And Assign It To Your Props)
const mapDispatchToProps = dispatch => {
  // Action
  return {
    changeAnswer: response => dispatch(actions.changeAnswer(response)),
    changeAnswerYesNo: response =>
      dispatch(actions.changeAnswerYesNo(response)),
  };
};

// Exports
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HealthSurveyModal);
