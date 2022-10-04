import React,{useEffect, useRef, useState} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SnsScreen from '../screens/SnsScreen/SnsScreen';
import SearchScreen from '../screens/SearchScreen/SearchScreen';
import StoreScreen from '../screens/StoreScreen/Store';
import SettingScreen from '../screens/SettingScreen/SettingScreen';
import AddPostScreen from '../screens/SnsScreen/AddPostScreen';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import ProfileStackScreen from '../screens/ProfileScreen/ProfileStackScreen';
import EditProfile from '../screens/ProfileScreen/EditProfile';
import ChatScreen from '../screens/ChatScreen/ChatScreen';
import Header from '../Chat/Components/common/Header';
import ChatNavigator from '../Chat/ChatNavigator'
import SNSProfileScreen from '../screens/ProfileScreen/SNSprofileScreen'; 
import Store from '../screens/StoreScreen/Store';
import SearchSnsScreen from '../screens/SearchScreen/SearchSnsScreen';
import PostComment from '../screens/SnsScreen/PostComment';
import BestSnsScreen from '../screens/SnsScreen/BestSnsScreen';
import PresentScreen from '../screens/ChatScreen/PresentScreen';
import PresentDetailScreen from '../screens/ChatScreen/PresentDetailScreen'
import Changepwd from '../screens/SettingScreen/Changepwd'
import Icon from "react-native-vector-icons/FontAwesome";
import { useDispatch, useSelector } from 'react-redux';
import counterSlice, { up } from '../../slices/counter';
import userSlice from '../../slices/user';
import { FirebaseStorageTypes } from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import Toast from 'react-native-toast-message';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const FeedStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="SNS"
      component={SnsScreen}
      options={{
        title: '자유로운 소통공간 스타',
        
        headerTitleStyle: {
         fontFamily: 'Jalnan',
         color : 'orange'
        },
        headerStyle: {
          shadowColor: '#fff',
          elevation: 0,
          backgroundColor : '#fff'
        },
        headerRight: () => (
          <View style={{marginRight: 10}}>
            <FontAwesome5.Button
              name="plus"
              size={22}
              backgroundColor="white"
              color="orange"
              onPress={() => navigation.navigate('AddPost')}
            />
          </View>
        ),
      }}
    />
    <Stack.Screen
      name="BestSnsScreen"
      component={BestSnsScreen}
      options={{
        title: 'Top 5 게시물 !',
        headerTitleAlign: 'center',

        headerTitleStyle: {
         fontFamily: 'Jalnan',
         color : 'orange'
        },
        headerStyle: {
          shadowColor: '#fff',
          elevation: 0,
          backgroundColor : '#fff'
        },
        headerBackTitleVisible: false,
        headerBackImage: () => (
          <View style={{marginLeft: 15}}>
            <Ionicons name="arrow-back" size={25} color="black" />
          </View>
        ),
      }}
    />   
    <Stack.Screen
      name="AddPost"
      component={AddPostScreen}
      options={{
        title: '게시글을 작성해보세요!',
        headerTitleAlign: 'center',
        headerTitleStyle: {
        fontFamily: 'Jalnan',
        color : 'orange'
         },
        headerStyle: {
          backgroundColor: 'white',
          shadowColor: 'white',
          elevation: 0,
        },
        headerBackTitleVisible: false,
        headerBackImage: () => (
          <View style={{marginLeft: 15}}>
            <Ionicons name="arrow-back" size={25} color="black" />
          </View>
        ),
      }}
    />
    <Stack.Screen
        name="PostComment"
        component={PostComment}
        options={{
        title: '댓글',
        headerTitleStyle: {
          fontFamily: 'Jalnan',
          color : '#696969'
        },
        headerTitleAlign: 'center',
        headerStyle: {
        backgroundColor: '#fff',
        shadowColor: '#fff',
        elevation: 0,
                    
          
        },
        headerBackTitleVisible: false,
        headerBackImage: () => (
        <View style={{marginLeft: 15}}>
        <Ionicons name="arrow-back" size={25} color="black" />
        </View>
        ),
        }}
        />
    <Stack.Screen
      name="SNSProfile"
      component={SNSProfileScreen}
      options={{
      title: '',
      headerTitleAlign: 'center',
      headerStyle: {
      backgroundColor: '#fff',
      shadowColor: '#fff',
      elevation: 0,
                    
          
      },
       headerBackTitleVisible: false,
       headerBackImage: () => (
       <View style={{marginLeft: 15}}>
       <Ionicons name="arrow-back" size={25} color="black" />
       </View>
       ),
       }}
       />
      <Stack.Screen
        name="SNSProfileScreen"
        component={ProfileScreen}
        options={{
        headerShown: false,
        }}
        />
      <Stack.Screen
      name="CHAT"
      
      options={({route}) => ({
        
        headerShown: false,
        tabBarStyle: { display: 'none' }
      })}
    >
      {props => <ChatScreen {...props}  /> }
    </Stack.Screen>

    
  </Stack.Navigator>
);

const MessageStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen name="Message"  component={ChatNavigator} options={{
      
				headerShown: true,
				header: () => <Header title="채팅" />
			}} />
    
    <Stack.Screen
      name="CHAT"
      
      options={({route}) => ({
        
        headerShown: false,
        tabBarStyle: { display: 'none' }
      })}
    >
      {props => <ChatScreen {...props}  /> }
    </Stack.Screen>
    
    <Stack.Screen
      name="Present"
      component={PresentScreen}
      options={{
        headerShown: false,
        
        
      }}
    />
    <Stack.Screen
      name="PresentDetail"
      component={PresentDetailScreen}
      options={{
        headerShown: false,
        
        
      }}
    />
  </Stack.Navigator>
);
const ProfileStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="ProfileScreen"
      component={ProfileScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="EditProfile"
      component={EditProfile}
      options={{
        title : '프로필을 변경해보세요!',
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontFamily: 'Jalnan',
          color : '#696969'
         },
        headerStyle: {
          backgroundColor: '#fff',
          shadowColor: '#fff',
          elevation: 0,
        },
      }}
    />


  </Stack.Navigator>
  
  
);

const SearchStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="SearchScreen"
      component={SearchScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="SearchSnsScreen"
      component={SearchSnsScreen}
      options={{
        title: '탐색',
        headerTitleAlign: 'center',
        headerStyle: {
        backgroundColor: '#fff',
        shadowColor: '#fff',
        elevation: 0,
                      
            
        },
         headerBackTitleVisible: false,
         headerBackImage: () => (
         <View style={{marginLeft: 15}}>
         <Ionicons name="arrow-back" size={25} color="#545454" />
         </View>
         ),
         }}
         />
         <Stack.Screen
      name="SerachBestSnsScreen"
      component={BestSnsScreen}
      options={{
        title: 'Top 5 게시물 !',
        headerTitleAlign: 'center',

        headerTitleStyle: {
         fontFamily: 'Jalnan',
         color: 'orange'

        },
        headerStyle: {
          shadowColor: '#fff',
          elevation: 0,
          backgroundColor : '#fff'
        },
        headerBackTitleVisible: false,
        headerBackImage: () => (
          <View style={{marginLeft: 15}}>
            <Ionicons name="arrow-back" size={25} color="black" />
          </View>
        ),
      }}
    />   

  </Stack.Navigator>
);


const SettingStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="SettingScreen"
      component={SettingScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="Changepwd"
      component={Changepwd}
      options={{
        title: '비밀번호 변경',
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontFamily: 'Jalnan',
          color : '#696969'

         },
        headerStyle: {
        backgroundColor: '#fff',
        shadowColor: '#fff',
        elevation: 0,
                      
            
        },
         headerBackTitleVisible: false,
         headerBackImage: () => (
         <View style={{marginLeft: 15}}>
         <Ionicons name="arrow-back" size={25} color="#545454" />
         </View>
         ),
         }}
         />
         <Stack.Screen
      name="SerachBestSnsScreen"
      component={BestSnsScreen}
      options={{
        title: 'Top 5 게시물 !',
        headerTitleAlign: 'center',

        headerTitleStyle: {
         fontFamily: 'Jalnan',
         color:'orange'

        },
        headerStyle: {
          shadowColor: '#fff',
          elevation: 0,
          backgroundColor : '#fff'
        },
        headerBackTitleVisible: false,
        headerBackImage: () => (
          <View style={{marginLeft: 15}}>
            <Ionicons name="arrow-back" size={25} color="black" />
          </View>
        ),
      }}
    />   

  </Stack.Navigator>
  
  
);


const AppStack = () => {
  const [min, setMin] = useState(6);
  const [sec, setSec] = useState(0);
  const time = useRef(360);
  const timerId = useRef(null);
  const dispatch = useDispatch();
  const count = useSelector(state => {return state.count.value});
  const showToast = name => {
    Toast.show({
      type: 'success',
      text1: '포인트 획득완료!',
      text2: `정상적으로 업데이트 했습니다!👋`,
    });
  };
  useEffect(()=>{
  timerId.current = setInterval(() => { // 로그인시 미니펫용 카운터
    setMin(parseInt(time.current / 60));
    setSec(time.current % 60);
    time.current -=1;
    
    console.log(time.current);
  }, 10);

  return () => clearInterval(timerId.current);
  },[]);

  useEffect(()=>{
    const promise = new Promise((resolve, reject) => {
      if(time.current %60===0) {
        resolve(1);
      } else if(time.current <=1){
        reject('타이머 종료');
      }
      });
    promise.then((item) => {
      dispatch(counterSlice.actions.up(item)); //로그인후 앱스택 접속시 시작, 미니룸 펫 키우기용
      console.log(`먹이 꺼-억${item} - 먹은갯수:${count}`);
    })
    .catch((error) => {
      dispatch(counterSlice.actions.down(1));
      clearInterval(timerId.current);
  
        firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then(documentSnapshot => {
          if (documentSnapshot.exists) {
            firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .update({
              point: documentSnapshot.data().point + 300,
        });
          }
        });
        showToast();
    });
  },[sec]);
  const getTabBarVisibility = (route) => {
    const routeName = route.state
      ? route.state.routes[route.state.index].name
      : '';

    if (routeName === 'SNS') {
      return false;
    }
    return true;
  };

  return (
    <Tab.Navigator screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'orange',
        tabBarHideOnKeyboard: true,
        
        
        
      }}>
            <Tab.Screen
        name="Home"
        component={ProfileStackScreen}
        options={{
          
          // tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
      
      <Tab.Screen
      name="Search"
      component={SearchStack}
      options={{
        
        tabBarIcon: ({color,size}) => (
          <Icon name="search" size={size} color={color} />
        ),
      }}
    />
<Tab.Screen
        name="SNSTAP"
        component={FeedStack}
        options={({route}) => ({
          tabBarLabel: 'SNS',
          // tabBarVisible: route.state && route.state.index === 0,
          tabBarIcon: ({color, size}) => (
            <Icon name="home"
              color={color}
              size={size}
            />
          ),
        })}
      />

    
 
      <Tab.Screen
        name="CHATATP"
        component={MessageStack}
        options={({route}) => ({
          tabBarVisible: getTabBarVisibility(route),
          tabBarLabel: 'CHAT',
          
          // Or Hide tabbar when push!
          // https://github.com/react-navigation/react-navigation/issues/7677
          // tabBarVisible: route.state && route.state.index === 0,
          // tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <Ionicons name="chatbubble-outline" color={color}size={size}
            />
          ),
        })}
      />
          <Tab.Screen
      name="STORE"
      component={Store}
      options={{
        
        tabBarIcon: ({size,color}) => (
          <Icon name="shopping-bag" size={size} color={color} />
        ),
      }}
    />
         <Tab.Screen
      name="SETTING"
      component={SettingStack}
      options={{
        
        tabBarIcon: ({size,color}) => (
          <Ionicons name="settings"
            size={size}
            color={color}
          />
        ),
      }}
    />
  
    </Tab.Navigator>
  );
};

export default AppStack;
