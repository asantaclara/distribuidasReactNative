import React, { Component } from 'react';
import RestClient from "../rest_api/RestClient";
import {ActivityIndicator, Button, FlatList, View} from "react-native";
import RubroSubrubroPicker  from "../components/RubroSubrubroPicker";

class NuevProductoScreen extends React.Component  {

  constructor(props) {
    super(props);
    this.state  = {
      rubros: [],
      subRubros: [],
      isLoaded:false,
      rubroId: '',
      subRubroId: '',
      precio: '',
      nombre: '',
      marca: '',
      codigoBarras: '',
      botonAccionado: false
    }
    this.RubroSubrubroPicker = React.createRef();
  }
  handlerVolverAProductos(){
      this.props.navigation.navigate('Productos')
  }

  handleSubmit(event) {
      if(!this.state.botonAccionado){
          this.state.botonAccionado = true;
          event.preventDefault();
          const data = JSON.stringify({
            rubro: this.RubroSubrubroPickerCallbacks.getRubroValue(),
            subRubro: this.RubroSubrubroPickerCallbacks.getSubRubroValue(),
            nombre: this.RubroSubrubroPickerCallbacks.getNombreValue(),
            marca: this.RubroSubrubroPickerCallbacks.getMarcaValue(),
            precio: this.RubroSubrubroPickerCallbacks.getPrecioValue(),
            codigoBarras: this.RubroSubrubroPickerCallbacks.getCodigoBarrasValue(),
          });
          
          RestClient.altaProducto(data).then(alert("Se ha creado un nuevo producto")).then((data => this.handlerVolverAProductos()));
          console.log(data);
      }
  }

  

  componentWillMount() {
    RestClient.getRubros().then(json => {this.setState({ rubros: json, isLoaded: true})});
  }

  /*irAProductos(){
    this.props.history.push('/productos');
  }*/

  handleRubrosChange(event){
    RestClient.getSubRubrosByRubro(event.target.value).then(json => {this.setState({ subRubros: json})});
    this.setState({rubroId: event.target.value});
 }

 handleSubRubrosChange(event){
    this.setState({subRubroId: event.target.value});
 }

  render() {
    var {isLoaded, producto} = this.state;

    if (!isLoaded) {
      return (
          <View>
            <ActivityIndicator size="large" color="#0c9"/>
          </View>
      )
    } else {
      return (

          <View>
            <RubroSubrubroPicker ref={this.RubroSubrubroPicker} onMounted={callbacks => this.RubroSubrubroPickerCallbacks=callbacks}/>
            <Button
                onPress={this.handleSubmit.bind(this)}
                title="Crear Producto"
                color="#0d47a1"
            />
          </View>
      );
    }
  }
}
export default NuevProductoScreen;
