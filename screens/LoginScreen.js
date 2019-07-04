import React, { Component } from 'react';
import {
    ScrollView,
    Text,
    TextInput,
    Button,
    Alert,
    StyleSheet,
    View
} from 'react-native';
import RestClient from "../rest_api/RestClient";
import { withNavigationFocus } from "react-navigation";

export default class Login extends React.Component {
    
    constructor(props) {
        super(props);
        this.state  = {
          usuario: '',
          password: '',
          logueado: false
        };
      }
    
    getUsuarioValue(){
        return this.state.usuario
    }
    
    getPasswordValue(){
        return this.state.password
    }

    componentDidMount() {
        if(this.props.onMounted){
          this.props.onMounted({
            getUsuarioValue: this.getUsuarioValue.bind(this),
            getPasswordValue: this.getPasswordValue.bind(this),
          })
          console.log('Holis')
          
        }
      }
    
    handleCambiarPassword(event) {
        //event.preventDefault();
        const data = JSON.stringify({
          nombre:  this.state.usuario,
          password: this.state.password
        });
        if(this.state.logueado){
          RestClient.cambiarPassword(data).then(response => (response) ? alert("Password Cambiada!"): "");
          this.setState({
            logueado: false
          });
        } else {
          alert("El usuario no fue verificado, logueese");
        }
    }

    handleLoginSubmit(event) {
        //console.log('N: ')//+data.nombre+" p: "+ data.password)
        //event.preventDefault();
        
        const data = JSON.stringify({
          nombre:  this.state.usuario,
          password: this.state.password
        });
        RestClient.login(data).then(response => this.handlerMaximus(response));
       
    }
    //<ScrollView style={{padding: 115,backgroundColor: 'lightblue', flex: 0.3}}>
    //style={{fontSize: 50,color: 'white',fontWeight: 'bold'}}>

    handlerMaximus(a){
      if (a==null){
        Alert.alert("Servidor Caido.", "Disculpe las molestias :(")
      }
      else{
          if(a)
          {
            this.setState({
              logueado: true
            });
            Alert.alert("Bienvenido", "Ha ingresado con exito!")
          }
      }
    }
    render() {
        return (
          <View style={styles.container}>
            <TextInput 
              style={styles.lineaArriba}
            />
              <Text 
                  style={styles.label}>
                  Login
              </Text>
            <TextInput 
              style={styles.linea}
            />
            <TextInput 
                    //style={{fontSize: 30}}
                    placeholder='Usuario' 
                    ref= {(el) => { this.usuario = el; }}
                    onChangeText={(usuario) => this.setState({usuario})}
                    value={this.state.usuario}
                    style={styles.input}
                    />
                    <TextInput 
                    // style={{fontSize: 30}}
                    placeholder='Password'
                    ref= {(el) => { this.password = el; }}
                    onChangeText={(password) => this.setState({password})}
                    value={this.state.password}
                    secureTextEntry={true}
                    style={styles.input}
                    />

                    <Button 
                            /*color="#1e90ff"
                            fontWeight= 'bold'*/
                            //style={{fontSize: 30, height: 100, marginTop: 50}}
                            onPress={() => {
                                this.handleLoginSubmit();}}
                            title="Ingresar"
                            style={styles.button}
                    />
                    <TextInput 
                      style={styles.lineaAabajo}
                    />
                    <Button 
                            /*color="#1e90ff"
                            fontWeight= 'bold'*/
                            //style={{fontSize: 30, height: 100, marginTop: 50}}
                            onPress={() => {
                                this.handleCambiarPassword();}}
                            title="Cambiar Password"
                            style={styles.button}
                            
                    />
            </View>
            )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightblue',
  },
  lineaArriba: {
    borderBottomColor: 'black',
    borderBottomWidth: 2,
    width: 300,
    marginBottom: 20,
    position: 'absolute',
    top: 10,
  },
  label: {
    fontSize: 50,
    color: 'white',
    position: 'absolute',
    top: 50,
      padding: '1%',
      textAlign: 'center',
      fontWeight: 'bold'

  },
  linea: {
    borderBottomColor: 'black',
    borderBottomWidth: 2,
    width: 300,
    marginBottom: 20,
    position: 'absolute',
    top: 117,
  },
  input: {
    width: 200,
    height: 50,
    padding: 10,
    borderWidth: 2,
    borderColor: '#1e90ff',
    marginBottom: 10,
    alignSelf: 'center',
    fontWeight: 'bold',
    backgroundColor: '#f5f5f5',
    opacity:.90,
    color: 'black',
  },
  button: {
    width: 200,
    height: 50,
    paddingBottom: 30,
    marginBottom: 100,
    marginTop: 100,
    color: '#1e90ff',
  },
  lineaAbajo: {
    borderBottomColor: 'black',
    borderBottomWidth: 2,
    width: 300,
    marginTop: 20,
    marginBottom: 20,
  },
});