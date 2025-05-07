const errorHandler = (err, req, res, next) => {
  console.error('❌ Erro na aplicação:', {
    message: err.message,
    stack: err.stack,
    name: err.name,
    path: req.path,
    method: req.method
  });

  // Erros de validação
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Erro de validação',
      details: err.message
    });
  }

  // Erros de autenticação
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Não autorizado',
      details: err.message
    });
  }

  // Erros do Prisma
  if (err.code?.startsWith('P')) {
    return res.status(400).json({
      error: 'Erro no banco de dados',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  // Erro genérico
  res.status(500).json({
    error: 'Erro interno do servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

module.exports = errorHandler; 