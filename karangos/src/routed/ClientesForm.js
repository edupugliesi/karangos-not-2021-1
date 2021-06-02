import { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import axios from 'axios'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { useHistory, useParams } from 'react-router-dom'
import ConfirmDialog from '../ui/ConfirmDialog'

const useStyles = makeStyles(() => ({
  form: {
    maxWidth: '80%',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    '& .MuiFormControl-root': {
      minWidth: '200px',
      maxWidth: '500px',
      marginBottom: '24px',
    }
  },
  toolbar: {
    marginTop: '36px',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around'
  },
  checkbox: {
    alignItems: 'center'
  }
}))

export default function ClientesForm() {
  const classes = useStyles()

  const [cliente, setCliente] = useState({
    id: null,
    nome: '',
    cpf: '',
    rg: '',
    logradouro: '',
    num_imovel: '',
    complemento: '',
    bairro: '',
    municipio: '',
    uf: '',
    telefone: '',
    email: ''
  })
  const [currentId, setCurrentId] = useState()

  const [snackState, setSnackState] = useState({
    open: false,
    severity: 'success',
    message: 'Cliente salvo com sucesso'  
  })

  const [btnSendState, setBtnSendState] = useState({
    disabled: false,
    label: 'Enviar'
  })

  const [error, setError] = useState({
    nome: '',
    cpf: '',
    rg: '',
    logradouro: '',
    num_imovel: '',
    complemento: '',
    bairro: '',
    municipio: '',
    uf: '',
    telefone: '',
    email: ''
  })

  const [isModified, setIsModified] = useState(false)

  const [dialogOpen, setDialogOpen] = useState(false)

  const [title, setTitle] = useState('Cadastrar Novo Cliente')

  const history = useHistory()
  const params = useParams()

  useEffect(() => {
    // Verifica se tem o parâmetro id na rota. Se tiver, temos que buscar
    // os dados do registro no back-end para edição
    if(params.id) {
      setTitle('Editando cliente')
      getData(params.id)
    }
  }, [])

  async function getData(id) {
    try {
      let response = await axios.get(`https://api.faustocintra.com.br/clientes/${id}`)
      setCliente(response.data)    
    }
    catch(error) {
      setSnackState({
        open: true,
        severity: 'error',
        message: 'Não foi possível carregar os dados para edição.'
      })
    }
  } 

  
  function handleInputChange(event, property) {
    
    
    const clienteTemp = {...cliente}

    if(event.target.id) property = event.target.id

    setCliente({...cliente, [property]: event.target.value})
    clienteTemp[property] = event.target.value
    
    setCliente(clienteTemp)
    validate(clienteTemp)     // Dispara a validação
    
    
  }

  function validate(data) {

    const errorTemp = {
        nome: '',
        cpf: '',
        rg: '',
        logradouro: '',
        num_imovel: '',
        complemento: '',
        bairro: '',
        municipio: '',
        uf: '',
        telefone: '',
        email: ''
    }
    let isValid = true

    // Validação do campo nome
    if(data.nome.trim() === '') {
      errorTemp.nome = 'O nome deve ser preenchida'
      isValid = false
    }

    // Validação do campo cpf
    if(data.cpf.trim() === '') {
      errorTemp.cpf = 'O cpf deve ser preenchido'
      isValid = false
    }

    // Validação do campo RG
    if(data.rg.trim() === '') {
      errorTemp.rg = 'O RG deve ser preenchido'
      isValid = false
    }

    // Validação do campo Logradouro
    if(data.logradouro.trim() === '') {
        errorTemp.logradouro = 'O logradouro deve ser preenchido'
        isValid = false
    }

    // Validação do campo Número do Imóvel
    if(data.num_imovel.trim() === '') {
        errorTemp.num_imovel = 'O Número do Imóvel deve ser preenchido'
        isValid = false
    }

    // Validação do campo Complemento
    if(data.complemento.trim() === '') {
        errorTemp.complemento = 'O Complemento deve ser preenchido'
        isValid = false
    }
    
    // Validação do campo Bairro
    if(data.bairro.trim() === '') {
        errorTemp.bairro = 'O Bairro deve ser preenchido'
        isValid = false
    }

    // Validação do campo Municipio
    if(data.municipio.trim() === '') {
        errorTemp.municipio = 'O Município deve ser preenchido'
        isValid = false
    }

    // Validação do campo UF
    if(data.uf.trim() === '') {
        errorTemp.uf = 'O Estado deve ser preenchido'
        isValid = false
    }

    // Validação do campo Telefone
    if(data.telefone.trim() === '') {
        errorTemp.telefone = 'O Número de Telefone deve ser preenchido'
        isValid = false
    }

    // Validação do campo Email
    if(data.email.trim() === '') {
        errorTemp.email = 'O Email deve ser preenchido'
        isValid = false
    }

    setError(errorTemp)
    return isValid

  }

  async function saveData() {
    try {
      // Desabilitar o botão Enviar
      setBtnSendState({disabled: true, label: 'Enviando...'})

      // Se o registro já existe (edição, verbo HTTP PUT)
      if(params.id) await axios.put(`https://api.faustocintra.com.br/clientes/${params.id}`, cliente)
      // Registro não existe, cria um novo (verbo HTTP POST)
      else await axios.post('https://api.faustocintra.com.br/clientes', cliente)
      
      setSnackState({
        open: true,
        severity: 'success',
        message: 'Cliente salvo com sucesso!'  
      })
      
    }
    catch(error) {
      setSnackState({
        open: true,
        severity: 'error',
        message: 'ERRO: ' + error.message  
      })  
    }
    // Reabilitar o botão Enviar
    setBtnSendState({disabled: false, label: 'Enviar'})
  }

  function handleSubmit(event) {
    
    event.preventDefault() // Evita o recarregamento da página

    // Só salva os dados se eles forem válidos
    if(validate(cliente)) saveData()
    
  }

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  function handleSnackClose(event, reason) {
    // Evita que a snackbar seja fechada clicando-se fora dela
    if(reason === 'clickaway') return
    setSnackState({...snackState, open: false}) // Fecha a snackbar

    // Retorna à página de listagem
    history.push('/list2')   // Retorna à página de listagem
  }

  function handleDialogClose(result) {
    setDialogOpen(false)

    // Se o usuário concordou em voltar
    if(result) history.push('/list2')
  }

  function handleGoBack() {
    // Se o formulário estiver modificado, mostramos o diálogo de confirmação
    if(isModified) setDialogOpen(true)
    // Senão, voltamos diretamente à página de listagem
    else history.push('/list2')
  }

  return (
    <>
      <ConfirmDialog isOpen={dialogOpen} onClose={handleDialogClose}>
        Há dados não salvos. Deseja realmente voltar?
      </ConfirmDialog>

      <Snackbar open={snackState.open} autoHideDuration={6000} onClose={handleSnackClose}>
        <Alert onClose={handleSnackClose} severity={snackState.severity}>
          {snackState.message}
        </Alert>
      </Snackbar>
      
      <h1>{title}</h1>
      <form className={classes.form} onSubmit={handleSubmit}>
        
        <TextField 
          id="nome" 
          label="Nome" 
          variant="filled" 
          value={cliente.nome} 
          onChange={handleInputChange} 
          fullWidth
          required
          error={error.nome !== ''}
          helperText={error.nome} 
        />
        
        <TextField 
          id="cpf" 
          label="CPF" 
          variant="filled" 
          value={cliente.cpf} 
          onChange={handleInputChange} 
          fullWidth
          required
          error={error.cpf !== ''}
          helperText={error.cpf} 
        />

        <TextField 
          id="rg" 
          label="RG" 
          variant="filled" 
          value={cliente.rg} 
          onChange={handleInputChange} 
          fullWidth
          required
          error={error.rg !== ''}
          helperText={error.rg} 
        />

        <TextField 
          id="logradouro" 
          label="Endereço" 
          variant="filled" 
          value={cliente.logradouro} 
          onChange={handleInputChange} 
          fullWidth
          required
          error={error.logradouro !== ''}
          helperText={error.logradouro} 
        />

        <TextField 
          id="num_imovel" 
          label="Número do Imóvel" 
          variant="filled" 
          value={cliente.num_imovel} 
          onChange={handleInputChange} 
          fullWidth
          required
          error={error.num_imovel !== ''}
          helperText={error.num_imovel} 
        />

        <TextField 
          id="complemento" 
          label="Complemento" 
          variant="filled" 
          value={cliente.complemento} 
          onChange={handleInputChange} 
          fullWidth
          required
          error={error.complemento !== ''}
          helperText={error.complemento} 
        />

        <TextField 
          id="bairro" 
          label="Bairro" 
          variant="filled" 
          value={cliente.bairro} 
          onChange={handleInputChange} 
          fullWidth
          required
          error={error.bairro !== ''}
          helperText={error.bairro} 
        />

        <TextField 
          id="municipio" 
          label="Municipio" 
          variant="filled" 
          value={cliente.municipio} 
          onChange={handleInputChange} 
          fullWidth
          required
          error={error.municipio !== ''}
          helperText={error.municipio} 
        />

        <TextField 
          id="uf" 
          label="Estado" 
          variant="filled" 
          value={cliente.uf} 
          onChange={handleInputChange} 
          fullWidth
          required
          error={error.uf !== ''}
          helperText={error.uf} 
        />

        <TextField 
          id="telefone" 
          label="Telefone" 
          variant="filled" 
          value={cliente.telefone} 
          onChange={handleInputChange} 
          fullWidth
          required
          error={error.telefone !== ''}
          helperText={error.telefone} 
        />

        <TextField 
          id="email" 
          label="E-mail" 
          variant="filled" 
          value={cliente.email} 
          onChange={handleInputChange} 
          fullWidth
          required
          error={error.email !== ''}
          helperText={error.email} 
        />

        <Toolbar className={classes.toolbar}>
          <Button 
            variant="contained" 
            color="secondary" 
            type="submit"
            disabled={btnSendState.disabled}
          >
              {btnSendState.label}
          </Button>
          <Button variant="contained" onClick={handleGoBack}>
            Voltar
          </Button>
        </Toolbar>
            
        {/* <div>{JSON.stringify(karango)}<br />currentId: {currentId}</div> */}
      </form>
    </>
  )
}