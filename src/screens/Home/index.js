import React, {useState} from 'react';
import {View, Text, Pressable, SafeAreaView, TextInput, TouchableOpacity, Alert} from 'react-native';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import bcrypt from 'react-native-bcrypt';
import { openDatabase } from "react-native-sqlite-storage";
import database from '../../components/Handlers/database';
import SelectDropdown from 'react-native-select-dropdown';


const schedulerDB = openDatabase({name: 'Scheduler.db'});
const usersTableName= 'users';

const HomeScreen = () => {

  const[username, setUsername] = useState('');
  const[password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const[securityTextEntry, setSecurityTextEntry] = useState(true);

  const accountNames = ['Project Manager', 'Resource Manager', 'Team Member', 'Portfolio Viewer', 'Administrator'];


  const onIconPress = () => {
    setSecurityTextEntry(!securityTextEntry);
  };

  const onSubmit = async () => {
    if (!username || !password || !location){
      Alert.alert('Invalid Input', 'To sign into Scheduler you must do the following:Enter your username and password Select your accout type');
      return;
    }

    shopperDB.transaction(txn =>{
      txn.executeSql(
        `SELECT * FROM ${usersTableName} WHERE username = "${username}"`,
        [],
        (_,res) => {
          let user = res.rows.length;
          if (user == 0){
            Alert.alert('Invalid', 'Username is invalid!');
            return;
          }
          if (!location){
            alert('Invalid user','Please select an account type!');
            return;
          } 
        else{
            let item = res.rows.item(0);
            let isPasswordCorrect = bcrypt.compareSync(password, item.password);
            if(!isPasswordCorrect){
              Alert.alert('Invalid User', 'Password is invalid!');
              return;
            }
            if (user != 0 && isPasswordCorrect && location){
              navigation.navigate('Start Shopping!');
            }
          }
        },
        error => {
          console.log('Error getting user ' + error.message);
        }
      );
    });
    
  };

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <SafeAreaView style={{flex: 0.0}} />
      <View style={styles.header}>
        <Text style={styles.title}>
          Welcome to Scheduler          
        </Text>
        <TextInput
        placeholder='Enter Username'
        placeholderTextColor='grey'
        value={username}
        autoCapitalize='none'
        onChangeText={setUsername}
        style={{
          color: 'black',
          fontSize: 16, 
          width: '100%',
          marginVerticle: 15,
          borderColor: 'lightgrey',
          borderWidth: 1.0,
          paddingTop: 100,
        }}
        />
        <View
        style={{
          flexDirection: 'row',
          width: '100%',
          borderBottomWidth: 1.0,
          borderColor: 'lightgry',
          marginVertical: 15,
        }}
        >
          <TextInput
            placeholder='Enter Password'
            placeholderTextColor='grey'
            value={password}
            autoCapitalize='none'
            onChangeText={setPassword}
            secureTextEntry={securityTextEntry}
            style={{
              color: 'black',
              fontSize: 16,
              width: '100%',
              flex: 1,
            }}
            />
            <TouchableOpacity onPress={onIconPress}>
              {securityTextEntry === true ? (
                <Entypo name="eye" size={20} />
              ) : (
                <Entypo name="eye-with-line" size ={20} />
              )
              }
            </TouchableOpacity>
        </View>
      </View>
      <SelectDropdown
                data={accountNames}
                defaultValue={location}
                defaultButtonText={'Select Account Type'}
                onSelect={(selectedItem, index) => {
                    setLocation(selectedItem);
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                    return item;
                }}
                buttonStyle={styles.dropdownBtnStyle}
                buttonTextStyle={styles.dropdownBtnTxtStyle}
                dropdownStyle={styles.dropdownDropdownStyle}
                rowStyle={styles.dropdownRowStyle}
                rowTextStyle={styles.dropdownRowTxtStyle}
            />
      <View style={styles.bottom}>
        <Pressable                   
          style={styles.button}
          onPress={() => onSubmit()}>
          <Text style={styles.buttonText}>Sign in</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.description}>Don't Have an Accout?</Text>
          <Text style={styles.buttonText}>Create One Now</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default HomeScreen;