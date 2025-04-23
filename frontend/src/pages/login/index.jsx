import '../../index.css'

function Login() {
  
  return (
  <div className="login-container">
    <div className="login-card">
      <h2>Entrar</h2>
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Senha" />
      <button>Login</button>
    </div>
  </div>
  )
}

export default Login
