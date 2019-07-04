import React from "react";
import {Button, StyleSheet, View, ActivityIndicator, FlatList, ToastAndroid, ImageBackground} from "react-native";
import {ListItem} from "react-native-elements";
import RestClient from "../rest_api/RestClient";

import {withNavigationFocus} from "react-navigation";


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
        ToastAndroid.show('Para eliminar un producto toque sobre el mismo', ToastAndroid.SHORT);
        this.fetchProductos();
        const {navigation} = this.props;
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
            if (this.state.dataSource != null) {
                return (
                    <View style={styles.container}>
                        <View style={{flexDirection: 'row'}}>
                            <View style={styles.button_1}>
                                <Button
                                    onPress={this.handleNuevoProductoPress.bind(this)}
                                    title="Nuevo Producto"
                                    color="#0d47a1"
                                />
                            </View>
                        </View>
                        <FlatList
                            data={this.state.dataSource}
                            renderItem={({item}) => (
                                <ListItem onPress={this.handleItemPress.bind(this, item.identificador)}
                                          title={`Producto N°${item.identificador}`}
                                          subtitle={`${item.nombre}`}
                                          containerStyle={{borderBottomWidth: 0}}
                                />
                            )}
                            keyExtractor={item => item.identificador.toString()}
                        />
                    </View>
                )

            } else {
                return (
                    <View>
                        <ImageBackground source={{uri: 'https://media.makeameme.org/created/oh-no-tenemos.jpg\n'}}
                                         style={{width: window.width, height: 400}}>
                        </ImageBackground>
                    </View>
                )
            }
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