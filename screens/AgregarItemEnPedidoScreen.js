import React from "react";
import RestClient from "../rest_api/RestClient";
import {Text, ActivityIndicator, Button, FlatList, StyleSheet, View, ImageBackground} from "react-native";
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
          <View style={styles.container}>
            <ImageBackground source={{uri: 'https://upload.wikimedia.org/wikipedia/commons/2/29/LogoUADE.png'}} style={{width: window.width, height: 140}} imageStyle={{opacity:0.2}}>
                <View style={styles.dialogContentView}>
                    <Text style={styles.containerText}>Pedido Nro: {pedido.numeroPedido}</Text>
                    <Text style={styles.containerText}>Cliente: {pedido.cliente.nombre}</Text>
                    <Text style={styles.containerText}>Cuil: {pedido.cliente.cuil}</Text>
                    <Text style={styles.containerText}>Fecha: {pedido.fechaPedido}</Text>
                    <Text style={styles.containerText}>Estado: {pedido.estado}</Text>
                </View>
            </ImageBackground>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: "#EEEEEE",
    },
    containerText: {

        padding: '1%',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    dialogContentView: {
        // flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
});

export default AgregarItemEnPedidoScreen;
