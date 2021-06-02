import {useState, useEffect} from 'react'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import { makeStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import InputMask from 'react-input-mask'
import InputAdornment from '@material-ui/core/InputAdornment'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import axios from 'axios'

const useStyles = makeStyles(() => ({
  form: {
    //backgroundColor: 'green', // Cor de debug
    maxWidth: '80%',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    '& .MuiFormControl-root' : {
      minWidth: '200px',
      maxWidth: '500px',
      marginBottom: '25px',
    }
  },
  toolbar: {
    marginTop: '36px',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around'
  },
  Checkbox: {
    alignItems: 'center'
  }
}))

/* Classes de caracteres de entrada para a máscada do campo placa 
  1) Três primeiras posições: quaisquer letra de A a Z ~> (Maiúsculo ou minúsculo) [A-Za-z]
  2) Posições numéricas (1º, a 3º e a 4º depois do traço) ~> [0-9]
  3) 2º posição após o traço: pode receber digitos ou letras de A a J (maiúsculas ou minúsculas) ~> [0-9A-Ja-j]
*/

// Representando as classes de caracteres da máscara como um objeto

const formatChars = {
  'A': '[A-Za-z]',
  '0': '[0-9]',
  '#': '[0-9A-Ja-j]'
}

// Finalmente, a máscada de entrada do campo placa

const placaMask = 'AAA-0#00'

// Máscara para CPF: '000.000.000-00'
// Máscara para CNPJ: '00.000.000/0000-0'

export default function KarangosForm() {

  const classes = useStyles()

  const [karango, setKarango] = useState({
    id: null,
    marca: '',
    modelo: '',
    cor: '',
    ano_fabricacao: (new Date()).getFullYear(), // Ano corrente
    importado: '0',
    placa: '',
    preco: 0
  })

  const [currentId, setCurrentId] = useState()
  const [importadoChecked, setImportadoChecked] = useState()

  function handleInputChange(event, property){
    //Se houver id no event.target, ele será o nome da propriedade
    //senão, usaremos o valor do segundo parâmetro
    if(event.target.id) property = event.target.id

    if(property === 'importado'){
      const newState = ! importadoChecked
      setKarango({...karango, importado: (newState ? '1': '0')})
      setImportadoChecked(newState)
    }
    else if(property === 'placa'){
      setKarango({...karango, [property]: event.target.value.toUpperCase()})
    }
    else {
      // Quando o nome de uma propriedade de um objeto aparece entre [],
      // Isso se chama "propriedade calculada". O nome da propriedade vai
      // corresponder a avaliação da expressão entre os colchetes 
      setCurrentId(event.target.id)
      setKarango({...karango, [property]: event.target.value})
    }
  }

  function years(){
    let result = []
    for(let i = (new Date()).getFullYear(); i >= 1900; i--) result.push(i)
    return result
  }

  async function saveData(){
    try {
      await axios.post('https://api.faustocintra.com.br/karangos', karango)
      alert('Dados salvos com sucesso')
      //A FAZER: Retornar a página de listagem
    }
    catch(error){
      alert('ERRO: ' + error.message)
    }
  }

  function handleSubmit(event){
    event.preventDefault() //Evitar o recarregamento da página

    saveData()
  }

  return (
    <>
      <h1>Cadastrar Novo Karango</h1>
      <form className = {classes.form} onSubmit={handleSubmit}>

        <TextField id="marca" label="Marca" variant="filled" value={karango.marca} onChange={handleInputChange} fullWidth/>
        
        <TextField id="modelo" label="Modelo" variant="filled" value={karango.modelo} onChange={handleInputChange} fullWidth/>

        <TextField id="cor" label="Cor" variant="filled" value={karango.cor} onChange={event => handleInputChange(event, 'cor')} select fullWidth>

            <MenuItem value="Amarelo">Amarelo</MenuItem>
            <MenuItem value="Azul">Azul</MenuItem>
            <MenuItem value="Bege">Bege</MenuItem>
            <MenuItem value="Branco">Branco</MenuItem>
            <MenuItem value="Cinza">Cinza</MenuItem>
            <MenuItem value="Dourado">Dourado</MenuItem>
            <MenuItem value="Laranja">Laranja</MenuItem>
            <MenuItem value="Marrom">Marrom</MenuItem>
            <MenuItem value="Prata">Prata</MenuItem>
            <MenuItem value="Preto">Preto</MenuItem>
            <MenuItem value="Roxo">Roxo</MenuItem>
            <MenuItem value="Verde">Verde</MenuItem>
            <MenuItem value="Vermelho">Vermelho</MenuItem>

        </TextField>

        <TextField id="ano_fabricacao" label="Ano de Fabricação" variant="filled" value={karango.ano_fabricacao} onChange={event => handleInputChange(event, 'ano_fabricacao')} select fullWidth>
          {
            years().map(year => <MenuItem value={year}>{year}</MenuItem>)
          }
        </TextField>
             
        <InputMask 
          formatChars={formatChars} 
          mask={placaMask} 
          id="placa" 
          onChange={event => handleInputChange(event, 'placa')} 
          value={karango.placa}
        >
          {() => <TextField label="Placa" variant="filled" fullWidth/>}
        </InputMask>

        <TextField 
          id="preco" 
          label="Preço" 
          variant="filled" 
          value={karango.preco} 
          onChange={handleInputChange}
          fullWidth
          type="Number"
          onFocus={event => event.target.select()}
          InputProps={{
              startAdornment: <InputAdornment position="start">R$</InputAdornment>,
            }} 
        />

        <FormControl className={classes.Checkbox} fullWidth>
          <FormControlLabel
            control={<Checkbox checked={importadoChecked} onChange={handleInputChange} id="importado" />}
            label="importado?"
          />
        </FormControl>

        <Toolbar className={classes.toolbar}>
            <Button variant="contained" color="secondary" type="submit">Enviar</Button>
            <Button variant="contained">Voltar</Button>
        </Toolbar>

        <div>{JSON.stringify(karango)}<br />currentId: {currentId}</div>
      </form>
    </>
  )
}