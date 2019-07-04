import React from "react";
import {Alert, StyleSheet, View, ActivityIndicator, FlatList, Button} from "react-native";
import {ListItem} from "react-native-elements";
import RestClient from "../rest_api/RestClient";
import {MonoText} from "../components/StyledText";
import {withNavigationFocus} from "react-navigation";

class ProductoScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: "Producto",
            headerStyle: {backgroundColor: "#fff"},
            headerTitleStyle: {textAlign: "center", flex: 1}
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            dataSource: [],
           // botonEliminarPedidoAccionado: false,
            //botonFacturarAccionado : false,
        };
    }

    componentWillMount() {
        //ToastAndroid.show('Para eliminar un item presione sobre el mismo', ToastAndroid.SHORT);
        this.fetchProducto();
        const { navigation } = this.props;
        this.focusListener = navigation.addListener("didFocus", () => {
            this.fetchProducto();
        });
    }

    fetchProducto() {
        if(this.props.navigation.state.params){
            RestClient.getProducto((this.state.dataSource.identificador == null) ? this.props.navigation.state.params : this.state.dataSource.identificador)
                .then(json => {{
                    this.setState({ dataSource: json, loading: false});
                }});
        }
    }

    /*handleAgregarItemPress() {
        this.props.navigation.navigate('AgregarItemEnPedido',this.state.dataSource.numeroPedido)
    }*/
    handleEliminarProductoPress() {
        if(!this.state.botonEliminarProductoAccionado){
            this.state.botonEliminarProductoAccionado = true;
            Alert.alert(
                '¿Esta seguro de eliminar el producto?',
                'Esta accion no se puede deshacer',
                [
                    {
                        text: 'Cancelar',
                        onPress: () => {
                            console.log('Cancel Pressed');
                            this.state.botonEliminarProductoAccionado = false
                        },
                        style: 'cancel',
                    },
                    {
                        text: 'ELIMINAR', onPress: () => {
                            console.log('OK Pressed');
                            RestClient.bajaProducto(this.state.dataSource.identificador).then(data => this.props.navigation.navigate('Productos'));

                        }
                    },
                ],
                {cancelable: false},
            );
        }

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
                    <MonoText style={{fontWeight: 'bold'}}>Producto Nro: {dataSource.identificador}</MonoText>
                    <MonoText style={{fontWeight: 'bold'}}>Nombre: {dataSource.nombre}</MonoText>
                    <MonoText style={{fontWeight: 'bold'}}>Marca: {dataSource.marca}</MonoText>
                    <MonoText style={{fontWeight: 'bold'}}>Precio: {dataSource.precio}</MonoText>
                    <MonoText style={{fontWeight: 'bold'}}>Rubro: {dataSource.rubro.descripcion}</MonoText>
                    {/*<MonoText style={{fontWeight: 'bold'}}>Subrubro: {dataSource.subrubro.descripcion}</MonoText>*/}
                    <View style={styles.dialogContentView}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={styles.button_1}>
                                <Button
                                    title="Eliminar Producto"
                                    color="#0d47a1"
                                    onPress={() => {
                                        console.log('Click en eliminar producto');
                                        this.handleEliminarProductoPress();
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
        width: '100%',
        height: 30,
    },
});

export default withNavigationFocus(ProductoScreen);