import React, {useEffect, useContext, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  Image
  
} from 'react-native';


const PointGuide = () => {
  
  return (
      <ScrollView>
    <View style={styles.container}>
    <Text style={styles.TitleText}>포인트</Text>
    <Text style={styles.SubText}>포인트는 미니홈피를 꾸밀 수 있는 아이템들을 구입하기 위해 필요 합니다. 미니룸을 꾸밀 수 있는 가구, 미니미, 벽지 등</Text>
   
    <Text style={styles.SubText}>을 구입할 수 있습니다.</Text>
    <Text style={styles.TitleText}>포인트를 얻을 수 있는 경로</Text>
   
    <Text style={styles.TitleText}>1. 미니홈피, SNS 게시물 작성</Text>
    <Text style={styles.SubText}>미니홈피 사진첩 게시물, SNS의 게시물을 작성할 시 20 포인트를 얻을 수 있습니다.</Text>
    <Image
        source={require('../../../assets/guide/guide1.png')}
        style={{height : 350, width : 300}}
      /> 
          <Image
        source={require('../../../assets/guide/guide2.png')}
        style={{height : 250, width : 500}}
      /> 
    <Text style={styles.TitleText}>2. 미니홈피, SNS 댓글 작성</Text>
    <Text style={styles.SubText}>미니홈피의 댓글, SNS 댓글 작성 시 5포인트를 얻을 수 있습니다.</Text>
    <Image
        source={require('../../../assets/guide/guide3.png')}
        style={{height : 250, width : 300}}
      /> 
    <Text style={styles.TitleText}>3. 미니룸 동물, 식물 키우기</Text>
    <Text style={styles.SubText}>상점에서 동물, 식물을 구입 후 성장시킬 시 포인트를 얻을 수 있습니다.</Text>

    </View>
    </ScrollView>
  );
};

export default PointGuide;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        
      },
    
    TitleText :{
        marginLeft : 15, 
        marginTop : 10, 
        marginBottom : 10,
        fontSize : 20 , 
        color : '#191919', 
        fontWeight : 'bold'
    },
    SubText : {
        marginLeft : 15, 
        fontSize : 15,
        color : '#191919',
        marginBottom : 2,
    }
});
