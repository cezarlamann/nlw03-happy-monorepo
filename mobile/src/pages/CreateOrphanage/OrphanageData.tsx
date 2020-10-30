import React, { useState } from 'react';
import { ScrollView, Image, View, StyleSheet, Switch, Text, TextInput, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import Api from '../../services/Api';

interface RouteParams{
  position: {
    latitude: number;
    longitude: number;
  }
}

export default function OrphanageData() {

  const route = useRoute();
  const params = route.params as RouteParams;
  const nav = useNavigation();

  const [ name, setName ] = useState("");
  const [ about, setAbout ] = useState("");
  const [ instructions, setInstructions ] = useState("");
  const [ opening_hours, setOpeningHours ] = useState("");
  const [ open_on_weekends, setOpenOnWeekends ] = useState(false);
  const [ images, setImages ] = useState<string[]>([]);

  async function handleSelectImages(){
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
    if (status != "granted") {
      alert("Para adicionar fotos do orfanato, precisamos de acesso nas suas fotos");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (result.cancelled) {
      return;
    }

    setImages([...images, result.uri]);
  }

  function handleOrphanageCreation(){
    const { latitude, longitude } = params.position;
    const data = {
      name,
      about,
      instructions,
      opening_hours,
      open_on_weekends,
      latitude,
      longitude
    }
    const formData = new FormData();
    formData.append('name', name);
    formData.append('about', about);
    formData.append('instructions', instructions);
    formData.append('opening_hours', opening_hours);
    formData.append('open_on_weekends', open_on_weekends.toString());
    formData.append('latitude', latitude.toString());
    formData.append('longitude', longitude.toString());
    images.forEach((img, idx) => formData.append('images',
    {
      type: 'image/jpg',
      name: `img_${idx}.jpg`,
      uri: img
    } as any))

    Api.post('orphanages', formData)
      .then(result => {
        alert("Cadastro Realizado com Sucesso!");
        nav.navigate("OrphanagesMap");
      })
      .catch(error => {
        if (error) {
          console.log(error);
        }
        alert("Ocorreu um erro na gravação das informações. Tente novamente mais tarde");
      })
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 24 }}>
      <Text style={styles.title}>Dados</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={text => setName(text)}
      />

      <Text style={styles.label}>Sobre</Text>
      <TextInput
        style={[styles.input, { height: 110 }]}
        multiline
        value={about}
        onChangeText={text => setAbout(text)}
      />

      {/* <Text style={styles.label}>Whatsapp</Text>
      <TextInput
        style={styles.input}
      /> */}

      <Text style={styles.label}>Fotos</Text>

      <View style={styles.uploadedImagesContainer}>
        {
          images.map(img => {
            return <Image key={img} source={{uri: img}} style={styles.uploadedImage}></Image>
          })
        }
      </View>

      <TouchableOpacity style={styles.imagesInput} onPress={handleSelectImages}>
        <Feather name="plus" size={24} color="#15B6D6" />
      </TouchableOpacity>

      <Text style={styles.title}>Visitação</Text>

      <Text style={styles.label}>Instruções</Text>
      <TextInput
        style={[styles.input, { height: 110 }]}
        multiline
        value={instructions}
        onChangeText={text => setInstructions(text)}
      />

      <Text style={styles.label}>Horario de visitas</Text>
      <TextInput
        style={styles.input}
        value={opening_hours}
        onChangeText={text => setOpeningHours(text)}
      />

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Atende final de semana?</Text>
        <Switch
          thumbColor="#fff"
          trackColor={{ false: '#ccc', true: '#39CC83' }}
          value={open_on_weekends}
          onValueChange={e => setOpenOnWeekends(e)}
        />
      </View>

      <RectButton style={styles.nextButton} onPress={handleOrphanageCreation}>
        <Text style={styles.nextButtonText}>Cadastrar</Text>
      </RectButton>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: {
    color: '#5c8599',
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 0.8,
    borderBottomColor: '#D3E2E6'
  },

  label: {
    color: '#8fa7b3',
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 8,
  },

  comment: {
    fontSize: 11,
    color: '#8fa7b3',
  },

  input: {
    backgroundColor: '#fff',
    borderWidth: 1.4,
    borderColor: '#d3e2e6',
    borderRadius: 20,
    height: 56,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginBottom: 16,
    textAlignVertical: 'top',
  },

  imagesInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderStyle: 'dashed',
    borderColor: '#96D2F0',
    borderWidth: 1.4,
    borderRadius: 20,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },

  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },

  nextButton: {
    backgroundColor: '#15c3d6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
    marginTop: 32,
  },

  nextButtonText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
    color: '#FFF',
  },
  uploadedImagesContainer: {
    flexDirection: "row"
  },
  uploadedImage: {
    width: 64,
    height: 64,
    borderRadius: 20,
    marginBottom: 32,
    marginRight: 8
  },
})