import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { createTheme } from '@mui/material/styles'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './app/App.jsx'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: 'rgb(235, 231, 218)',
      contrastText: 'rgb(18, 9, 23)',
    },
    secondary: {
      main: 'rgb(82, 74, 79)',
      contrastText: 'rgb(235, 231, 218)',
    },
    background: {
      default: 'rgb(18, 9, 23)',
      paper: 'rgb(30, 20, 35)',
    },
    text: {
      primary: 'rgb(235, 231, 218)',
      secondary: 'rgba(235, 231, 218, 0.72)',
    },
    divider: 'rgba(235, 231, 218, 0.14)',
    error: {
      main: '#ff8d8d',
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
