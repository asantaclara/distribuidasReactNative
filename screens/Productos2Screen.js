import React from "react";
import {Button, StyleSheet, View, ActivityIndicator, FlatList, ToastAndroid} from "react-native";
import {List, ListItem, SearchBar} from "react-native-elements";
import RestClient from "../rest_api/RestClient";
import * as WebBrowser from "expo-web-browser";
import { withNavigationFocus } from "react-navigation";
import {MonoText} from "../components/StyledText";
import ClientAndEstadoPicker from "../components/ClientAndEstadoPicker.js"
import ProductoPicker from "../components/ProductoPicker";
import ClientPicker from "../components/ClientPicker";

class Productos2Screen extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: "Lista Productoss",
            headerStyle: {backgroundColor: "#fff"},
            headerTitleStyle: {textAlign: "center", flex: 1}
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            dataSource: [],
            //search: ''
        };
         //this.arrayholder = [];
       this.productoEstadoSelect = React.createRef();
    }

    componentWillMount() {
        ToastAndroid.show('Para eliminar un producto presione sobre el mismo', ToastAndroid.SHORT);
        this.fetchProductos();
        const { navigation } = this.props;
        this.focusListener = navigation.addListener("didFocus", () => {
            this.fetchProductos();
        });
    }

    fetchProductos(data) {
        RestClient.getProductos(data).then(json => {
            this.setState({dataSource: json, loading: false})
            //search: text;
        });
    }

    handleItemPress(identificador) {
        this.props.navigation.navigate('Producto', identificador)
    }
    handleNuevoProductoPress() {
        this.props.navigation.navigate('NuevoProducto')
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
                    <View style={{ flexDirection: 'row' }}>
                        <View style={styles.button_1}>
                            <Button
                                onPress={this.handleNuevoProductoPress.bind(this)}
                                title="Nuevo Producto"
                                color="#0d47a1"
                            />
                        </View>
                    </View>
                   {/*<SearchBar
                        round
                        searchIcon={{ size: 24 }}
                        onChangeText={text => this.SearchFilterFunction(text)}
                       // onClear={text => this.SearchFilterFunction('')}
                        placeholder="Type Here..."
                        value={this.state.search}
                   />*/}
                    <FlatList
                        data={this.state.dataSource}
                        renderItem={({item}) => (
                            <ListItem onPress={this.handleItemPress.bind(this,item.identificador)}
                                title={`Producto N°${item.identificador}`}
                                subtitle={`${item.nombre}`}
                                containerStyle={{borderBottomWidth: 0}}
                            />
                        )}
                        keyExtractor={item => item.identificador.toString()}
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
        width: '100%',
        height: 30,
    },
});

export default withNavigationFocus(Productos2Screen);