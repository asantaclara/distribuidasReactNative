import React from 'react';
import { Platform } from 'react-native';
import {
  createStackNavigator,
  createBottomTabNavigator,
} from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import PedidosScreen from '../screens/PedidosScreen';
import PedidoScreen from "../screens/PedidoScreen";
import NuevoPedidoScreen from "../screens/NuevoPedidoScreen";
import AgregarItemEnPedidoScreen from "../screens/AgregarItemEnPedidoScreen";
import LoginScreen from "../screens/LoginScreen";
import ProductoScreen from "../screens/ProductoScreen";
import Productos2Screen from "../screens/Productos2Screen";
import NuevoProductoScreen from "../screens/NuevoProductoScreen";

const ProductosStack = createStackNavigator({
  Productos: Productos2Screen,
  Producto: ProductoScreen,
  NuevoProducto: NuevoProductoScreen
});

ProductosStack.navigationOptions = {
  tabBarLabel: 'Productos',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios' ? `ios-cart`: 'md-cart'
      }
    />
  ),
};

const PedidosStack = createStackNavigator({
  Pedidos: PedidosScreen,
  Pedido: PedidoScreen,
  NuevoPedido: NuevoPedidoScreen,
  AgregarItemEnPedido: AgregarItemEnPedidoScreen
});

PedidosStack.navigationOptions = {
  tabBarLabel: 'Pedidos',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-journal' : 'md-gift'}
    />
  ),
};

const SettingsStack = createStackNavigator({
  Settings: LoginScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Cuenta',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-contact' : 'md-person'}
    />
  ),
};

export default createBottomTabNavigator({
  SettingsStack,
  ProductosStack,
  PedidosStack,
});
