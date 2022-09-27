import styled from 'styled-components';

export const InputWrapper = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    width: 100%;
    background-color: white;
`;
export const InputTitle = styled.TextInput`
    justify-content: center;
    align-items: center;
    font-size: 18px;
    width:90%;
    height:40px;
    margin: 10px;
`;

export const InputWrapperGuest = styled.View`
    flex-direction: row;
    align-items: center;
    width: 100%;
    background-color: white;
    margin:15px;
`;

export const InputField = styled.TextInput`
    justify-content: center;
    align-items: center;
    font-size: 24px;
    text-align: center;
    width:90%;
    margin-bottom: 15px;
`;


export const InputFieldGuest = styled.TextInput`
    font-size: 15px;
    justify-content: flex-start;
    width:73%;
    height:40px;
    borderBottomColor: #ffa500;
    borderBottomWidth:1px;


`;

export const AddImageD = styled.Image`
    width: 30%;
    height: 100px;
    margin-left: 15px;
`;
export const AddImage = styled.Image`
    width: 70%;
    height: 150px;
    margin-bottom: 15px;
`;

export const StatusWrapper = styled.View`
    justify-content: center;
    align-items: center;
`;

export const SubmitBtn = styled.TouchableOpacity`
    flex-direction: row;
    justify-content: center;
    background-color: #FF6347;
    border-radius: 5px;
    padding: 10px 25px;
`;

export const SubmitBtnGuest = styled.TouchableOpacity`
    justify-content: center;
    background-color: #ffa500;
    border-radius: 5px;
    margin-left:15px;
    padding: 10px 25px;
`;

export const SubmitBtnText = styled.Text`
    font-size: 18px;
    font-family: 'Jalnan';
    color: white;
`;

export const Boundary = styled.View`
    borderWidth:1;
    borderColor: #fff;
    borderBottomColor:#b0b0b0;
    justify-content: center;
    align-items: center;
    width:90%;
`;

export const SubmitBtnTextGuest = styled.Text`
    font-size: 15px;
    font-family: 'Lato-Bold';
    font-weight: bold;
    color: white;
`;
export const InputFieldDiary = styled.TextInput`
    justify-content: flex-start;
    align-items: center;
    font-size: 18px;
    width:90%;
    textAlignVertical:top;
    margin-bottom: 15px;
`;

export const DiaryBtn = styled.TouchableOpacity`
    flex-direction: row;
    justify-content: center;
    background-color: #FFA500;
    padding: 10px 25px;
    border-radius: 5px;
    /*
    borderWidth:1;
    borderColor: #FFA500;
    */

    /*    margin:10px;
    width:100;
    border-radius: 5px;
    height:40;*/
`;

export const DiaryBtnText = styled.Text`
    font-size: 15px;
    color: #fff;
`;
