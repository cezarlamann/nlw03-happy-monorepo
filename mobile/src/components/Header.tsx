import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface HeaderProps{
  title: string;
  showCancel?: boolean;
}

export default function Header({ title, showCancel = true}: HeaderProps){

  const nav = useNavigation();

  function handleGoBack(){
    nav.goBack();
  }

  function handleCancel(){
    nav.navigate("OrphanagesMap");
  }

  return (
    <View style={styles.container}>
      <BorderlessButton onPress={handleGoBack}>
        <Feather name="arrow-left" size={24} color="#15b6d6"/>
      </BorderlessButton>
      <Text style={styles.title}>{title}</Text>
      {
        showCancel === true ?
        (<BorderlessButton onPress={handleCancel}>
          <Feather name="x" size={24} color="#ff669d" />
        </BorderlessButton>)
        :
        (
          <View />
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#f9fafc",
    borderColor: "#dde3f0",
    paddingTop: 44,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  title: {
    fontFamily: "Nunito_600SemiBold",
    color: "#8fa7b3",
    fontSize: 16,
  }
})