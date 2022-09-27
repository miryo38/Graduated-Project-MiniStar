import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import { windowHeight, windowWidth } from '../../utils/Dimentions';

const FormButton_2 = ({buttonTitle, ...rest}) => {
  return (
    <TouchableOpacity style={styles.buttonContainer} {...rest}>
      <Text style={styles.buttonText}>{buttonTitle}</Text>
    </TouchableOpacity>
  );
};

export default FormButton_2;

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 10,
    width: '90%',
    height: windowHeight / 15,
    backgroundColor: 'orange',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 3,
  },
  buttonText: {
    fontSize: 18,
    fontFamily : 'Jalnan',
    color: '#ffffff',
  },
});
