import React, {useCallback, useEffect,useContext} from 'react';
import {ScrollView, View, TouchableOpacity, StyleSheet, Switch, Text,Alert,Pressable}from  'react-native';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import {useAppDispatch} from '../../../store';
import userSlice from '../../../slices/user';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store/reducer';
import EncryptedStorage from 'react-native-encrypted-storage';
import { AuthContext } from '../../utils/AuthProvider';
import { useNavigation } from "@react-navigation/native";

const SettingScreen = () => {
    const {user, logout} = useContext(AuthContext);
  const navigation = useNavigation();

  
    return (
        <ScrollView >
            <View >
                <View style={styles.row}>
                    <Text style={styles.title}>
                        프로필 설정
                    </Text>
                </View>
                
                <View style={styles.row}>
                    <TouchableOpacity style={styles.section}>
                    <Text style ={styles.TextStyle} >
                            프로필 변경
                        </Text>
                    </TouchableOpacity>
                </View>
                
                <View style={styles.row}>
                    <TouchableOpacity style={styles.section} onPress={() => navigation.navigate('Changepwd')}>
                    <Text style ={styles.TextStyle} >
                            비밀번호 변경
                        </Text>
                    </TouchableOpacity>
                </View>
                
                <View style={styles.row}>
                    <Text style={styles.section}>
                        메세지 알람
                    </Text>
                    <Switch/>

                </View>
                
                <View style={styles.row}>
                    <Text style={styles.section}>
                        게시물 알람
                    </Text>

                    <Switch/>
                </View>
            </View>

            <View >
                <View style={styles.row}>
                    <Text style={styles.title}>
                      고객관리
                    </Text>
                </View>
                <View style={styles.row}>
                    <TouchableOpacity style={styles.section}>
                        <Text style ={styles.TextStyle} >
                            도움말
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.row}>
                    <TouchableOpacity style={styles.section}>
                    <Text style ={styles.TextStyle} >
                            개인 정보 정책
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.row}>
                    <TouchableOpacity style={styles.section}>
                    <Text style ={styles.TextStyle} >
                           이용약관
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.row}>
                    <TouchableOpacity style={styles.section} onPress={() => logout()}>
                        <Text style ={styles.TextStyle} >
                            로그아웃
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

export default SettingScreen;

const styles = StyleSheet.create({
  title:{
      marginVertical: 25,
      fontSize:20,
        fontFamily : "Jalnan" 
     },  
  TextStyle : {
fontFamily : "Jalnan"
  },
  container: {
        backgroundColor: 'black'
    },
    header: {
        paddingVertical: 25
    },
    section: {
        fontFamily : "Jalnan",
        marginVertical: 25
        
    },
    heading: {
        paddingBottom: 12.5
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 17.5,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: 'black',
        alignItems: 'center'
    },
    rowButton: {
        flex: 1,
        paddingVertical: 24
    },
    switch : {
            marginVertical:
            14
    },
    text: {
        color: 'black'
    }
});
