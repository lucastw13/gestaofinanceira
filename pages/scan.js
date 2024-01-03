
import { React, useEffect,useState } from 'react';
import axios from 'axios';
import { Container, Label, Input, Button, Form, FormGroup } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { QrReader } from 'react-qr-reader';

function Scan() {
  const [data, setData] = useState('No result');

  function ler() {
    console.log(document.getElementById("imagem").value)

    var preview = document.getElementById('preview');
    var file = document.getElementById("imagem").files[0];
    var reader = new FileReader();

    reader.onloadend = function () {
      preview.src = reader.result;
      console.log(reader)
      const blob = DataURIToBlob(reader.result)
      console.log(blob)
      const formData = new FormData();
      formData.append('file', blob, 'image.jpg')
      console.log(formData)

      axios.post("http://api.qrserver.com/v1/read-qr-code/",formData)
      .then(response => {
        if (response.data != null) {
          for (var item of response.data) {
            for (var itemSymbol of item.symbol) {
              console.log(itemSymbol)
              if (itemSymbol.data != null) {
                console.log(itemSymbol.data)
                document.getElementById("base64").value = itemSymbol.data
              }
            }
          }
        }
      }, (error) => {
        console.log("error: " + error)
      })
    }

    if (file) {
      reader.readAsDataURL(file);
    } else {
      preview.src = "";
    }

    
  }
  function DataURIToBlob(dataURI) {
    const splitDataURI = dataURI.split(',')
    const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

    const ia = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++)
        ia[i] = byteString.charCodeAt(i)

    return new Blob([ia], { type: mimeString })
  }

  return (
    <Container>
      <Form>
        <FormGroup>
          <Label for="base64">Base64</Label>
          <Input type="textarea" id="base64" />
        </FormGroup>
        <FormGroup>
          <Input type="file" id="imagem" />
          <img id="preview" src="" height="200" alt="Prévia da imagem..."></img>
        </FormGroup>
        <Button color="danger" onClick={ler}>Ler</Button>

        <QrReader
        constraints={{
          facingMode: 'environment'
        }}
        onResult={(result, error) => {
          if (!!result) {
            setData(result?.text);
          }

          if (!!error) {
            console.info(error);
          }
        }}
        style={{ width: '100%' }}
      />
      <p>{data}</p>
      </Form>
    </Container >
  );
}

export default Scan;