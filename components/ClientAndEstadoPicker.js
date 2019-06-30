import React from "react";
import RestClient from "../rest_api/RestClient";
import {Picker,ActivityIndicator, StyleSheet, View} from "react-native";
import {MonoText} from "./StyledText";

class ClientAndEstadoPicker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            clientes: [],
            isLoaded: false,
            clienteId: '',
            estado: ''

        };
    }

    getClienteValue() {
        return this.state.clienteId;
    }

    getEstadoValue() {
        return this.state.estado;
    }

    componentDidMount() {
        if (this.props.onMounted) {
            this.props.onMounted({
                getClienteValue: this.getClienteValue.bind(this),
                getEstadoValue: this.getEstadoValue.bind(this),
            })
        }
    }

    componentWillMount() {
        RestClient.getClientes().then(json => {
            this.setState({clientes: json, isLoaded: true})
        });
    }

    render() {
        var {isLoaded, clientes, estados} = this.state;

        if (!isLoaded) {
            return (
                <View>
                    <ActivityIndicator size="large" color="#0c9"/>
                </View>
            )
        } else {
            return (
                <View>
                    <Picker
                        selectedValue={this.state.clienteId}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({clienteId: itemValue})
                        }>
                        <Picker.Item key={0} label={'Seleccione un cliente'} value=""/>
                        {clientes.map((cliente) =>
                            <Picker.Item key={cliente.numero} label={`${cliente.numero} ${cliente.nombre}`} value={cliente.numero}/>)}
                    </Picker>
                    <Picker
                        selectedValue={this.state.estado}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({estado: itemValue})
                        }>
                        <Picker.Item label="Seleccione un estado" value="" />
                        <Picker.Item label="pendiente" value="pendiente" />
                        <Picker.Item label="facturado" value="facturado" />
                    </Picker>
                </View>
            );
        }
    }
}
export default ClientAndEstadoPicker;
