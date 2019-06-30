import React from "react";
import RestClient from "../rest_api/RestClient";
import {ActivityIndicator, Button, FlatList, View} from "react-native";
import {MonoText} from "../components/StyledText";
import {ListItem} from "react-native-elements";
import ProductoPicker from "../components/ProductoPicker";

class AgregarItemEnPedidoScreen extends React.Component  {

  constructor(props) {
    super(props);
    this.state  = {
      pedido: {},
      isLoaded:false,
      botonAccionado: false
    }
    this.ProductoPicker = React.createRef();
  }
  handlerVolverAPedidoClick(numeroPedido){
    if(numeroPedido) {
      this.props.navigation.navigate('Pedido', numeroPedido)
    }
  }

  handleSubmit(event) {
      if(!this.state.botonAccionado){
          this.state.botonAccionado = true;
          event.preventDefault();
          const data = JSON.stringify({
              numeroPedido: this.state.pedido.numeroPedido,
              identificadorProducto: this.ProductoPickerCallbacks.getProductoValue(),
              cantidad: this.ProductoPickerCallbacks.getCantidadValue(),
          });
          console.log(data);
          RestClient.agregarAPedido(data).then(data => this.handlerVolverAPedidoClick(this.state.pedido.numeroPedido));
      }
  }

  componentWillMount() {
    this.fetchPedido();
  }

  fetchPedido() {
    RestClient.getPedido(this.props.navigation.state.params)
      .then(json => {this.setState({ pedido: json, isLoaded: true})});
  }

  render() {
    var {isLoaded, pedido} = this.state;

    if (!isLoaded) {
      return (
          <View>
            <ActivityIndicator size="large" color="#0c9"/>
          </View>
      )
    } else {
      return (

          <View>
            <MonoText>Pedido Nro: {pedido.numeroPedido}</MonoText>
            <MonoText>Cliente: {pedido.cliente.nombre}</MonoText>
            <MonoText>Cuil: {pedido.cliente.cuil}</MonoText>
            <MonoText>Fecha: {pedido.fechaPedido}</MonoText>
            <MonoText>Estado: {pedido.estado}</MonoText>

            <Button
                onPress={this.handleSubmit.bind(this)}
                title="Agregar Item En Pedido"
                color="#0d47a1"
            />
            <ProductoPicker ref={this.ProductoPicker} onMounted={callbacks => this.ProductoPickerCallbacks=callbacks}/>
          </View>
      );
    }
  }
}
export default AgregarItemEnPedidoScreen;
