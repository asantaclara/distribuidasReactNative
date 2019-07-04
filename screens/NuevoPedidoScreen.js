import React from "react";
import {StyleSheet, View, ActivityIndicator, FlatList, Button, Image, ImageBackground} from "react-native";
import RestClient from "../rest_api/RestClient.js";
import ClientPicker from "../components/ClientPicker"

export default class NuevoPedidoScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: "Pedido",
            headerStyle: {backgroundColor: "#fff"},
            headerTitleStyle: {textAlign: "center", flex: 1}
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            dataSource: []
        };
        this.clienteSelect = React.createRef();
    }

    handleNuevoPedidoPress(event) {
        const data = JSON.stringify({
            cliente:  this.clienteSelectCallbacks.getClienteValue()});
        RestClient.altaPedido(data).then(response => this.irANuevoPedido(response));
    }

    irANuevoPedido(numeroPedido){
        if (numeroPedido) {
            this.props.navigation.navigate('Pedido', numeroPedido)
        }
    }

    render() {
        if(dataSource != null){
            return (
                <View style={styles.container}>
                    <ClientPicker ref={this.clienteSelect} onMounted={callbacks => this.clienteSelectCallbacks=callbacks}/>
                    <Button
                        onPress={this.handleNuevoPedidoPress.bind(this)}
                        title="Crear Pedido"
                        color="#0d47a1"
                    />
                </View>
            )
        } else {
            return(
                <View>
                    <ImageBackground source={{uri: 'https://media.makeameme.org/created/oh-no-tenemos.jpg\n'}} style={{width: window.width, height: 400}}/>
                </View>
            )
        }


    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff"
    },
    list: {
        paddingVertical: 4,
        margin: 5,
        backgroundColor: "#fff"
    }
});