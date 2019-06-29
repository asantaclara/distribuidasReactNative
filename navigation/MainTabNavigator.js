import React from 'react';
import { Platform } from 'react-native';
import {
  createStackNavigator,
  createBottomTabNavigator,
} from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
//import HomeScreen from '../screens/HomeScreen';
//import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ProductosScreen from '../screens/ProductosScreen';
import PedidosScreen from '../screens/PedidosScreen';
import PedidoScreen from "../screens/PedidoScreen";
import NuevoPedidoScreen from "../screens/NuevoPedidoScreen";

const ProductosStack = createStackNavigator({
  Productos: ProductosScreen,
});

ProductosStack.navigationOptions = {
  tabBarLabel: 'Productos',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

const PedidosStack = createStackNavigator({
  Pedidos: PedidosScreen,
  Pedido: PedidoScreen,
  NuevoPedido: NuevoPedidoScreen
});

PedidosStack.navigationOptions = {
  tabBarLabel: 'Pedidos',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'}
    />
  ),
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  ),
};

export default createBottomTabNavigator({
  ProductosStack,
  PedidosStack,
  SettingsStack,
});
