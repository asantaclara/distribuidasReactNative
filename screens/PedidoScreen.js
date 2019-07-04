import React from "react";
import {ImageBackground, Text, ToastAndroid, Alert, StyleSheet, View, ActivityIndicator, FlatList, Button} from "react-native";
import {ListItem} from "react-native-elements";
import RestClient from "../rest_api/RestClient";
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
        ToastAndroid.show('Para eliminar un item presione sobre el mismo durante unos segundos', ToastAndroid.SHORT);
        this.fetchPedido();
        const { navigation } = this.props;
        this.focusListener = navigation.addListener("didFocus", () => {
            this.fetchPedido();
        });
    }

    fetchPedido() {
        if(this.props.navigation.state.params){
            RestClient.getPedido((this.state.dataSource.numeroPedido == null) ? this.props.navigation.state.params : this.state.dataSource.numeroPedido)
                .then(json => {{
                    this.setState({ dataSource: json, loading: false});
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
        } else {
            Alert.alert(
                'El pedido ya fue facturado'
            )
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
            if(this.state.dataSource != null ){
                return (
                    <View style={styles.container}>
                        <ImageBackground source={{uri: 'https://upload.wikimedia.org/wikipedia/commons/2/29/LogoUADE.png'}} style={{width: window.width, height: 180}} imageStyle={{opacity:0.2}}>
                            <View style={styles.dialogContentView}>
                                <Text style={styles.containerText}>Pedido Nro: {dataSource.numeroPedido}</Text>
                                <Text style={styles.containerText}>Cliente: {dataSource.cliente.nombre}</Text>
                                <Text style={styles.containerText}>Cuil: {dataSource.cliente.cuil}</Text>
                                <Text style={styles.containerText}>Fecha: {dataSource.fechaPedido}</Text>
                                <Text style={styles.containerText}>Estado: {dataSource.estado}</Text>
                                <Text style={styles.containerText}>Cantidad Items: {dataSource.items.length}</Text>
                            </View>
                        </ImageBackground>
                        <View style={styles.dialogContentView}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={styles.button_1}>
                                    <Button
                                        title="Facturar"
                                        color="#0d47a1"
                                        onPress={() => {
                                            console.log('Click en facturado');
                                            this.handleFacturarPress();
                                        }}
                                    />
                                </View>
                                <View style={styles.button_1}>
                                    <Button
                                        title="Agregar Item"
                                        color="#0d47a1"
                                        onPress={() => {
                                            console.log('Click en agregar Item');
                                            this.handleAgregarItemPress();
                                        }}
                                    />
                                </View>
                                <View style={styles.button_1}>
                                    <Button
                                        title="Eliminar Pedido"
                                        color="#0d47a1"
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
                                    onLongPress={this.handleItemPress.bind(this,item.numero)}
                                    title={item.producto.nombre}
                                    subtitle={`Cantidad: ${item.cantidad} Precio: $${item.producto.precio}`}
                                    containerStyle={{borderBottomWidth: 0}}
                                />
                            )}
                            keyExtractor={(item, index) => index.toString()}
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
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EEEEEE",
    },
    containerText: {
        padding: '1%',
        textAlign: 'center',
        fontWeight: 'bold'
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