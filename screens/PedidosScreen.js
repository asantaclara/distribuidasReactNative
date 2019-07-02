import React from "react";
import {Button, StyleSheet, View, ActivityIndicator, FlatList, ToastAndroid, ImageBackground, Text} from "react-native";
import {ListItem} from "react-native-elements";
import RestClient from "../rest_api/RestClient";
import { withNavigationFocus } from "react-navigation";
import ClientAndEstadoPicker from "../components/ClientAndEstadoPicker.js"

class PedidosScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: "Lista Pedidos",
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
        this.clienteEstadoSelect = React.createRef();
    }

    componentWillMount() {
        ToastAndroid.show('Para trabajar sobre el pedido presione sobre el mismo / Azul: Facturado / Verde: Pendiente', ToastAndroid.LONG);
        this.fetchPedidos();
        const { navigation } = this.props;
        this.focusListener = navigation.addListener("didFocus", () => {
            this.fetchPedidos();
        });
    }

    fetchPedidos(data) {
        RestClient.getPedidos(data).then(json => {
            this.setState({dataSource: json, loading: false})
        });
    }

    handleItemPress(numeroPedido) {
        this.props.navigation.navigate('Pedido', numeroPedido)
    }
    handleNuevoPedidoPress() {
        this.props.navigation.navigate('NuevoPedido')
    }
    handleFiltrarPress() {
        const data = {
            clienteId:  this.clienteEstadoSelectCallbacks.getClienteValue(),
            estado:  this.clienteEstadoSelectCallbacks.getEstadoValue()
        };
        this.fetchPedidos(data);
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color="#0c9"/>
                </View>
            )
        } else {
            return (
                <View style={styles.container}>
                    <ClientAndEstadoPicker ref={this.clienteEstadoSelect} onMounted={callbacks => this.clienteEstadoSelectCallbacks=callbacks}/>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={styles.button_1}>
                            <Button
                                onPress={this.handleNuevoPedidoPress.bind(this)}
                                title="Nuevo Pedido"
                                color="#0d47a1"
                                accessibilityLabel="Learn more about this purple button"
                            />
                        </View>
                        <View style={styles.button_1}>
                            <Button
                                onPress={this.handleFiltrarPress.bind(this)}
                                title="Filtrar"
                                color="#0d47a1"
                                accessibilityLabel="Learn more about this purple button"
                            />
                        </View>
                    </View>
                    <FlatList
                        data={this.state.dataSource}
                        renderItem={({item}) => (
                            <ListItem
                                onPress={this.handleItemPress.bind(this,item.numeroPedido)}
                                title={`N° de pedido: ${item.numeroPedido}`}
                                subtitle={`de ${item.cliente.nombre} - Cuil: ${item.cliente.cuil} `}
                                containerStyle={{borderBottomWidth: 0}}
                                badge={{ value: item.items.length, textStyle: { color: 'white' }, containerStyle: 'center', status: (item.estado == 'facturado') ? 'primary' : 'success' }}
                            />
                        )}
                        keyExtractor={item => item.numeroPedido.toString()}
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
    }, dialogContentView: {
        // flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    button_1: {
        width: '50%',
        height: 30,
    },
});

export default withNavigationFocus(PedidosScreen);