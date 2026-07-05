import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'bellify-secret-key-2026'

/**
 * Middleware que verifica o token JWT e injeta req.usuario.
 */
export function autenticar(req, res, next) {
  const header = req.headers.authorization

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido.' })
  }

  const token = header.split(' ')[1]

  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.usuario = payload // { id, tipo }
    next()
  } catch {
    return res.status(401).json({ error: 'Token inválido ou expirado.' })
  }
}

/**
 * Middleware que restringe o acesso a usuários admin.
 * Deve ser usado DEPOIS do middleware autenticar.
 */
export function admin(req, res, next) {
  if (req.usuario?.tipo !== 'admin') {
    return res.status(403).json({ error: 'Acesso restrito a administradores.' })
  }
  next()
}

export { JWT_SECRET }
