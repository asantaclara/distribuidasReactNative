import React from "react";
import RestClient from "../rest_api/RestClient";
import {Picker,ActivityIndicator, StyleSheet, View} from "react-native";
import {MonoText} from "./StyledText";
import { AppRegistry, TextInput } from 'react-native';

class ProductoPicker extends React.Component {

    constructor(props) {
        super(props);
        this.state  = {
            rubros: [],
            subRubros: [],
            productos: [],
            isLoaded:false,
            rubroId: '',
            subRubroId: '',
            productoId: '',
            cantidad: ''
        };
        this.subRubro = React.createRef();
        this.producto = React.createRef();

    }

    getProductoValue(){
        return this.state.productoId
    }
    getRubroValue(){
        return this.state.rubroId
    }

    getSubRubroValue(){
        return this.state.subRubroId
    }

    getCantidadValue(){
        return this.state.cantidad
    }

    componentDidMount() {
        if(this.props.onMounted){
            this.props.onMounted({
                getRubroValue: this.getRubroValue.bind(this),
                getSubRubroValue: this.getSubRubroValue.bind(this),
                getProductoValue: this.getProductoValue.bind(this),
                getCantidadValue: this.getCantidadValue.bind(this),

            })
        }
    }

    componentWillMount() {
        RestClient.getRubros().then(json => {this.setState({ rubros: json, isLoaded: true})});
    }

    handleRubrosChange(itemValue){
        RestClient.getSubRubrosByRubro(itemValue).then(json => {this.setState({ subRubros: json})});
        this.setState({rubroId: itemValue});
    }

    handleSubRubrosChange(itemValue){
        RestClient.getProductosBySubRubro(itemValue).then(json => {this.setState({ productos: json})});
        this.setState({subRubroId: itemValue});
    }

    handleProductosChange(itemValue){
        this.setState({productoId: itemValue});
    }

    changeCantidadHandler = event => {
        this.setState({
            cantidad: event.target.value
        });
    };

    render() {
        var  {isLoaded, rubros, subRubros, productos} =this.state;

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

                        <MonoText style={{fontWeight: 'bold'}}>Producto:</MonoText>
                        <Picker
                            ref={this.producto}
                            selectedValue={this.state.productoId}
                            onValueChange={(itemValue, itemIndex) =>{
                                this.setState({productoId: itemValue});
                                this.handleProductosChange(itemValue);
                            }}>
                            {productos.map((producto) =>
                                <Picker.Item key={producto.identificador} label={`${producto.identificador} ${producto.nombre}`} value={producto.identificador}/>)}
                        </Picker>
                        <MonoText style={{fontWeight: 'bold'}}>Cantidad:</MonoText>
                        <TextInput
                            keyboardType='numeric'
                            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                            onChangeText={(cantidad) => this.setState({cantidad})}
                            value={this.state.cantidad}
                        />
                </View>
            );
        }
    }
}

export default ProductoPicker;