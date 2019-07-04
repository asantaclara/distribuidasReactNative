import React from "react";
import RestClient from "../rest_api/RestClient";
import {Picker,ActivityIndicator, StyleSheet, View} from "react-native";
import {MonoText} from "./StyledText";
import { AppRegistry, TextInput } from 'react-native';

class RubroSubrubroPicker extends React.Component {

    constructor(props) {
        super(props);
        this.state  = {
            rubros: [],
            subRubros: [],
            isLoaded:false,
            rubroId: '',
            subRubroId: '',
            productoId: '',
            nombre: '',
            marca: '',
            precio: '',
            codigoBarras: '',
        };
        this.subRubro = React.createRef();
        this.producto = React.createRef();

    }

    

    getRubroValue(){
        return{
            codigo: this.state.rubroId
        }
        //return this.state.rubroId
    }

    getSubRubroValue(){
        return{
            codigo: this.state.subRubroId
        }
        //return this.state.subRubroId
    }

    getPrecioValue(){
        return this.state.precio
      }
  
    getNombreValue(){
        return this.state.nombre;
      }
  
      getMarcaValue(){
          return this.state.marca
      }
  
      getCodigoBarrasValue(){
        return this.state.codigoBarras
      }

    componentDidMount() {
        if(this.props.onMounted){
            this.props.onMounted({
                getRubroValue: this.getRubroValue.bind(this),
                getSubRubroValue: this.getSubRubroValue.bind(this),
                getNombreValue: this.getNombreValue.bind(this),
                getPrecioValue: this.getPrecioValue.bind(this),
                getMarcaValue: this.getMarcaValue.bind(this),
                getCodigoBarrasValue: this.getCodigoBarrasValue.bind(this),
            })
        }
    }

    componentWillMount() {
        RestClient.getRubros().then(json => {this.setState({ rubros: json, isLoaded: true})});
    }

    handleRubrosChange(itemValue){
        RestClient.getSubRubrosByRubro(itemValue).then(json => {this.setState({ subRubros: json})});
        this.setState({rubroId: itemValue});
        console.log(itemValue);
    }

    handleSubRubrosChange(itemValue){
        this.setState({subRubroId: itemValue});
        console.log(itemValue)
    }

    changePrecioHandler = event => {
        this.setState({
          precio: event.target.value
        });
      };
      changeNombreHandler = event => {
        this.setState({
          nombre: event.target.value
        });
      };
      changeMarcaHandler = event => {
        this.setState({
          marca: event.target.value
        });
      };
      changeCodigoBarrasHandler = event => {
        this.setState({
          codigoBarras: event.target.value
        });
       }

    render() {
        var  {isLoaded, rubros, subRubros} =this.state;

        if(!isLoaded) {
            return (
                <View>
                    <ActivityIndicator size="large" color="#0c9"/>
                </View>
            )
        } else {
            return (
                <View>
                        <MonoText style={{fontWeight: 'bold'}}>Rubro:</MonoText>
                        <Picker
                            selectedValue={this.state.rubroId}
                            onValueChange={(itemValue, itemIndex) =>{
                                this.setState({rubroId: itemValue});
                                this.handleRubrosChange(itemValue);
                            }}>
                            <Picker.Item key={0} label={'Seleccione un rubro'} value={0}/>
                            {rubros.map((rubro) =>
                                <Picker.Item key={rubro.codigo} label={`${rubro.codigo} ${rubro.descripcion}`} value={rubro.codigo}/>)}
                        </Picker>
                        <MonoText style={{fontWeight: 'bold'}}>SubRubro:</MonoText>
                        <Picker
                            ref={this.subRubro}
                            selectedValue={this.state.subRubroId}
                            onValueChange={(itemValue, itemIndex) =>{
                                this.setState({subRubroId: itemValue});
                                this.handleSubRubrosChange(itemValue);
                            }}>
                            {subRubros.map((subRubro) =>
                                <Picker.Item key={subRubro.codigo} label={`${subRubro.codigo} ${subRubro.descripcion}`} value={subRubro.codigo}/>)}
                        </Picker>
                        <MonoText style={{fontWeight: 'bold'}}>Nombre Producto:</MonoText>
                        <TextInput
                            keyboardType='default'
                            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                            onChangeText={(nombre) => this.setState({nombre})}
                            value={this.state.nombre}
                        />
                         <MonoText style={{fontWeight: 'bold'}}>Marca:</MonoText>
                        <TextInput
                            keyboardType='default'
                            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                            onChangeText={(marca) => this.setState({marca})}
                            value={this.state.marca}
                        />
                         <MonoText style={{fontWeight: 'bold'}}>Precio:</MonoText>
                        <TextInput
                            keyboardType='numeric'
                            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                            onChangeText={(precio) => this.setState({precio})}
                            value={this.state.precio}
                        />
                        <MonoText style={{fontWeight: 'bold'}}>Codigo de Barras:</MonoText>
                        <TextInput
                            keyboardType='numeric'
                            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                            onChangeText={(codigoBarras) => this.setState({codigoBarras})}
                            value={this.state.codigoBarras}
                        />
                </View>
            );
        }
    }
}

export default RubroSubrubroPicker;