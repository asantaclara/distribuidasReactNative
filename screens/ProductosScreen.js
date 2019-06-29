import React from "react";
import {StyleSheet, View, ActivityIndicator, FlatList, ScrollView} from "react-native";
import {List, ListItem} from "react-native-elements";
import RestClient from "../rest_api/RestClient";
import {MonoText} from "../components/StyledText";

export default class ProductosScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: "Lista Productos",
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
        this.fetchProductos();
    }

    fetchProductos() {
        RestClient.getProductos().then(json => {
            this.setState({dataSource: json, loading: false})
        });
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
                <ScrollView style={styles.container}>
                    <View style={styles.loader}>
                        <MonoText>Length: {this.state.dataSource.length}</MonoText>
                    </View>
                    <FlatList
                        data={this.state.dataSource}
                        renderItem={({item}) => (
                            <ListItem
                                //roundAvatar
                                title={item.nombre}
                                // subtitle={item.identificador}
                                // containerStyle={{ borderBottomWidth: 0 }}
                            />
                        )}
                        keyExtractor={item => item.identificador.toString()}
                    />
                </ScrollView>
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