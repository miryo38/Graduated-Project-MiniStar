import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import FormInput_2 from '../../components/shared/FormInput_2';
import {COLORS} from '../../components/constants/theme';
import SocialButton from '../../components/shared/SocialButton';
import FormButton_2 from '../../components/shared/FormButton_2';
import {AuthContext} from '../../utils/AuthProvider';
import {useDispatch} from 'react-redux';
import userSlice from '../../../slices/user';
const SigninScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {login, googleLogin} = useContext(AuthContext);
  const dispatch = useDispatch();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <SafeAreaView
          style={{
            backgroundColor: COLORS.white,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: 20,
          }}>
          <Image
            source={require('../../../assets/logo2.png')}
            style={styles.logo}
          />

          {/* 이메일 */}
          <FormInput_2
            labelValue={email}
            onChangeText={userEmail => setEmail(userEmail)}
            placeholderText="Email"
            iconType="user"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <FormInput_2
            labelValue={password}
            onChangeText={userPassword => setPassword(userPassword)}
            placeholderText="Password"
            iconType="lock"
            secureTextEntry={true}
          />

          {/* 가입 button */}
          <FormButton_2
            buttonTitle="로그인"
            onPress={() => {
              login(email, password);
              dispatch(
                userSlice.actions.setUser({
                  email: email,
                }),
              );
            }}
          />

          {Platform.OS === 'android' ? (
            <View>
              <SocialButton
                buttonTitle="카카오톡 로그인"
                btnType="facebook"
                color="#3C1E1E"
                backgroundColor="#F7E314"
                onPress={() => Klogin()}
              />

              <SocialButton
                buttonTitle="구글 로그인"
                btnType="google"
                color="#de4d41"
                backgroundColor="#f5e7ea"
                onPress={() => googleLogin()}
              />
            </View>
          ) : null}
          {/* 하단 */}
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
            <Text>계정이 존재하지 않습니까?</Text>
            <Text
              style={{marginLeft: 4, color: COLORS.primary}}
              onPress={() => navigation.navigate('SignUp')}>
              회원가입
            </Text>
          </View>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SigninScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF6347',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  title: {
    fontSize: 50,
    color: 'orange',
    fontWeight: 'bold',
  },
  titleContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  bgImage: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  logo: {
    height: 250,
    width: 350,
    resizeMode: 'cover',
    marginBottom: 20,
  },
});
