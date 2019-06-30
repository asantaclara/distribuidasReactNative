import React from "react";
import RestClient from "../rest_api/RestClient";
import {Picker,ActivityIndicator, StyleSheet, View} from "react-native";
import {MonoText} from "./StyledText";

class ClientPicker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            clientes: [],
            isLoaded: false,
            clienteCuil: ''

        };
    }

    getClienteValue() {
        return {cuil: this.state.clienteCuil};
    }

    componentDidMount() {
        if (this.props.onMounted) {
            this.props.onMounted({
                getClienteValue: this.getClienteValue.bind(this),
            })
        }
    }

    componentWillMount() {
        RestClient.getClientes().then(json => {
            this.setState({clientes: json, isLoaded: true})
        });
    }

    render() {
        var {isLoaded, clientes} = this.state;

        if (!isLoaded) {
            return (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color="#0c9"/>
                </View>
            )
        } else {
            return (
                <View style={styles.container}>
                    <MonoText>Seleccione un cliente para crear un pedido</MonoText>
                    <Picker
                        selectedValue={this.state.clienteCuil}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({clienteCuil: itemValue})
                        }>
                        <Picker.Item key={0} label={'Seleccione un cliente'} value={0}/>
                        {clientes.map((cliente) =>
                            <Picker.Item key={cliente.cuil} label={`${cliente.numero} ${cliente.nombre}`} value={cliente.cuil}/>)}
                    </Picker>
                </View>
            );
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

export default ClientPicker;
