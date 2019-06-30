import React from "react";
import {Alert, StyleSheet, View, ActivityIndicator, FlatList, Button} from "react-native";
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
            dataSource: [],
            botonEliminarPedidoAccionado: false,
            botonFacturarAccionado : false,
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
        if(!this.state.botonFacturarAccionado){
            this.state.botonFacturarAccionado = true;
            Alert.alert(
                'Esta seguro de facturar el pedido?',
                'Esta accion no se puede deshacer',
                [
                    {
                        text: 'Cancelar',
                        onPress: () => {
                            console.log('Cancel Pressed')
                            this.state.botonFacturarAccionado = false;
                        },
                        style: 'cancel',
                    },
                    {
                        text: 'FACTURAR', onPress: () => {
                            console.log('OK Pressed');
                            RestClient.facturarPedido(this.state.dataSource.numeroPedido).then(data => this.fetchPedido());
                        }
                    },
                ],
                {cancelable: false},
            );
        }

    }
    handleAgregarItemPress() {
        this.props.navigation.navigate('AgregarItemEnPedido',this.state.dataSource.numeroPedido)
    }
    handleEliminarPedidoPress() {
        if(!this.state.botonEliminarPedidoAccionado){
            this.state.botonEliminarPedidoAccionado = true;
            Alert.alert(
                'Esta seguro de eliminar el pedido?',
                'Esta accion no se puede deshacer',
                [
                    {
                        text: 'Cancelar',
                        onPress: () => {
                            console.log('Cancel Pressed');
                            this.state.botonEliminarPedidoAccionado = false
                        },
                        style: 'cancel',
                    },
                    {
                        text: 'ELIMINAR', onPress: () => {
                            console.log('OK Pressed');
                            RestClient.bajaPedido(this.state.dataSource.numeroPedido).then(data => this.props.navigation.navigate('Pedidos'));

                        }
                    },
                ],
                {cancelable: false},
            );
        }

    }
    handleItemPress(numeroItem) {
        Alert.alert(
            'Esta seguro de eliminar el item?',
            'Esta accion no se puede deshacer',
            [
                {
                    text: 'Cancelar',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'ELIMINAR', onPress: () => {
                        console.log('OK Pressed');
                        const data = JSON.stringify({
                            numeroPedido: this.state.dataSource.numeroPedido,
                            identificadorItem: numeroItem});
                        RestClient.eliminarItemDePedido(data).then(data => this.fetchPedido());
                    }
                },
            ],
            {cancelable: false},
        );

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
                    <View style={styles.dialogContentView}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={styles.button_1}>
                                <Button
                                    title="FACTURAR"
                                    color="#0000FF"
                                    onPress={() => {
                                        console.log('Click en facturado');
                                        this.handleFacturarPress();
                                    }}
                                />
                            </View>
                            <View style={styles.button_1}>
                                <Button
                                    title="AGREGAR ITEM"
                                    color="#00FF00"
                                    onPress={() => {
                                        console.log('Click en agregar Item');
                                        this.handleAgregarItemPress();
                                    }}
                                />
                            </View>
                            <View style={styles.button_1}>
                                <Button
                                    title="ELIMINAR PEDIDO"
                                    color="#FF0000"
                                    onPress={() => {
                                        console.log('Click en eliminar pedido');
                                        this.handleEliminarPedidoPress();
                                    }}
                                />
                            </View>
                        </View>
                    </View>
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
                    <MonoText>Para eliminar un item presione sobre el mismo</MonoText>
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
    },
    dialogContentView: {
        // flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    button_1: {
        width: '33.333333333333%',
        height: 30,
    },
});

export default withNavigationFocus(PedidoScreen);