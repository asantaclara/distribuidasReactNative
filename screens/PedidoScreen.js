import React from "react";
import {StyleSheet, View, ActivityIndicator, FlatList, Button} from "react-native";
import {List, ListItem} from "react-native-elements";
import RestClient from "../rest_api/RestClient";
import * as WebBrowser from "expo-web-browser";
import {MonoText} from "../components/StyledText";
import {withNavigationFocus} from "react-navigation";

class PedidoScreen extends React.Component {
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
    }

    componentWillMount() {
        this.fetchPedido();
        const { navigation } = this.props;
        this.focusListener = navigation.addListener("didFocus", () => {
            this.fetchPedido();
        });
    }

    fetchPedido() {
        console.log(this.props.navigation.state.params);
        if(this.props.navigation.state.params){
            RestClient.getPedido((this.state.dataSource.numeroPedido == null) ? this.props.navigation.state.params : this.state.dataSource.numeroPedido)
                .then(json => {{
                    this.setState({ dataSource: json, loading: false});
                    console.log(json);
                }});
        }
    }

    handleFacturarPress() {
        RestClient.facturarPedido(this.state.dataSource.numeroPedido).then(data => this.fetchPedido());
    }
    handleAgregarItemPress() {
        this.props.navigation.navigate('AgregarItemEnPedido',this.state.dataSource.numeroPedido)
    }
    handleEliminarPedidoPress() {
        RestClient.bajaPedido(this.state.dataSource.numeroPedido).then(data => this.props.navigation.navigate('Pedidos'));
    }
    handleItemPress(numeroItem) {
        const data = JSON.stringify({
            numeroPedido: this.state.dataSource.numeroPedido,
            identificadorItem: numeroItem});
        RestClient.eliminarItemDePedido(data).then(data => this.fetchPedido());
    }


    render() {
        var {loading, dataSource} = this.state;

        if (loading) {
            return (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color="#0c9"/>
                </View>
            )
        } else {
            return (
                <View style={styles.container}>
                    <MonoText>Pedido Nro: {dataSource.numeroPedido}</MonoText>
                    <MonoText>Cliente: {dataSource.cliente.nombre}</MonoText>
                    <MonoText>Cuil: {dataSource.cliente.cuil}</MonoText>
                    <MonoText>Fecha: {dataSource.fechaPedido}</MonoText>
                    <MonoText>Estado: {dataSource.estado}</MonoText>
                    <MonoText>Cantidad Items: {dataSource.items.length}</MonoText>
                    <Button
                        onPress={this.handleFacturarPress.bind(this)}
                        title="Facturar"
                        color="#0000FF"
                        accessibilityLabel="Learn more about this purple button"
                    />
                    <Button
                        onPress={this.handleAgregarItemPress.bind(this)}
                        title="Agregar Item"
                        color="#FF0000"
                        accessibilityLabel="Learn more about this purple button"
                    />
                    <Button
                        onPress={this.handleEliminarPedidoPress.bind(this)}
                        title="Eliminar Pedido"
                        color="#00FF00"
                        accessibilityLabel="Learn more about this purple button"
                    />
                    <FlatList
                        data={this.state.dataSource.items}
                        renderItem={({item}) => (
                            <ListItem
                                onPress={this.handleItemPress.bind(this,item.numero)}
                                title={item.producto.nombre}
                                subtitle={`Cantidad: ${item.cantidad} Precio: $${item.producto.precio}`}
                                containerStyle={{borderBottomWidth: 0}}
                            />
                        )}
                        keyExtractor={(item, index) => index.toString()}
                    />
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

export default withNavigationFocus(PedidoScreen);