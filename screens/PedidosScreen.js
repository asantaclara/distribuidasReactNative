import React from "react";
import {Button,StyleSheet,View,ActivityIndicator,FlatList} from "react-native";
import {List, ListItem} from "react-native-elements";
import RestClient from "../rest_api/RestClient";
import * as WebBrowser from "expo-web-browser";
import { withNavigationFocus } from "react-navigation";
import {MonoText} from "../components/StyledText";

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
    }

    componentWillMount() {
        this.fetchPedidos();
        const { navigation } = this.props;
        this.focusListener = navigation.addListener("didFocus", () => {
            this.fetchPedidos();
        });
    }

    fetchPedidos() {
        RestClient.getPedidos().then(json => {
            this.setState({dataSource: json, loading: false})
        });
    }

    handleItemPress(numeroPedido) {
        this.props.navigation.navigate('Pedido', numeroPedido)
    }
    handleNuevoPedidoPress() {
        this.props.navigation.navigate('NuevoPedido')
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
                    <Button
                        onPress={this.handleNuevoPedidoPress.bind(this)}
                        title="Nuevo Pedido"
                        color="#0d47a1"
                        accessibilityLabel="Learn more about this purple button"
                    />
                    <FlatList
                        data={this.state.dataSource}
                        renderItem={({item}) => (
                            <ListItem onPress={this.handleItemPress.bind(this,item.numeroPedido)}
                                title={`N°${item.numeroPedido} - Contenido: ${item.items.length} items - Estado: ${item.estado} `}
                                subtitle={`de ${item.cliente.nombre} - Cuil: ${item.cliente.cuil} `}
                                containerStyle={{borderBottomWidth: 0}}
                            />
                        )}
                        keyExtractor={item => item.numeroPedido.toString()}
                    />
                    <MonoText>Para trabajar sobre el pedido presione sobre el mismo</MonoText>
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

export default withNavigationFocus(PedidosScreen);