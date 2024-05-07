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

const accountNames = ['Project Manager', 'Resource Manager', 'Team Member', 'Portfolio Viewer', 'Administrator'];


const SignUpScreen = () => {

    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');
    const[password1, setPassword1] = useState('');
    const [location, setLocation] = useState('');
    const[securityTextEntry, setSecurityTextEntry] = useState(true);
  
    const onIconPress = () => {
      setSecurityTextEntry(!securityTextEntry);
    };
  
    const onSubmit = async () => {
      if (!username || !password || !password1 || !location){
        Alert.alert('Invalid Input', 'To create a Scheduler you must do the following: Enter a username, Enter a password, Re-enter your password, Select an account type');
        return;
      }
  
      schedulerDB.transaction(txn =>{
        txn.executeSql(
          `SELECT * FROM ${usersTableName} WHERE username = "${username}"`,
          [],
          (_,res) => {
            let user = res.rows.length;
            if (user >= 1){
              Alert.alert('InvalidUser', 'Username is already exists!');
              return;
            } 
            if(password1 != password){
                Alert.alert('Invalid Input','Password and re-entered password are not the same.');
                return;
            }
            else{
              let salt = bcrypt.genSaltSync(3);
              let hash = bcrypt.hashSync(password, salt);
              database.addUser(username, hash);
              navigation.navigate('Home');
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
              <TextInput
              placeholder='Re-enter Password'
              placeholderTextColor='grey'
              value={password}
              autoCapitalize='none'
              onChangeText={setPassword1}
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
            <Text style={styles.buttonText}>Create Your Account</Text>
          </Pressable>
          <Pressable
          style={styles.button}
          onPress={() => navigation.navigate('Sign up')}
        >
          <Text style={styles.description}>Already Have an Accout?</Text>
          <Text style={styles.buttonText}>Sign In Now</Text>
        </Pressable>
        </View>
      </View>
    );
  };
  
  export default SignUpScreen;