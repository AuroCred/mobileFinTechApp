import React from "react";
import { View,Text, StyleSheet } from "react-native";


export default function ContactUs() {

    return(
        <View style={stylesDepositPage.mainView}>
            <Text>This is deposit</Text>
        </View>
    )



}

const stylesDepositPage = StyleSheet.create({

    mainView:{
        flex:1,
        justifyContent:'center',
        alignContent:'center'
    }


});