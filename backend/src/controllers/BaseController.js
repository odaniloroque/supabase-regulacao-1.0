class BaseController {
  constructor() {
    this.handleError = this.handleError.bind(this);
    this.sendResponse = this.sendResponse.bind(this);
  }

  handleError(error, res) {
    console.error('❌ Erro no controlador:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Erro de validação',
        details: error.message
      });
    }

    if (error.name === 'UnauthorizedError') {
      return res.status(401).json({
        error: 'Não autorizado',
        details: error.message
      });
    }

    if (error.code?.startsWith('P')) {
      return res.status(400).json({
        error: 'Erro no banco de dados',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

    return res.status(500).json({
      error: 'Erro interno do servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }

  sendResponse(res, data, status = 200) {
    return res.status(status).json(data);
  }

  validateRequiredFields(data, fields) {
    const missingFields = fields.filter(field => !data[field]);
    if (missingFields.length > 0) {
      throw new Error(`Campos obrigatórios ausentes: ${missingFields.join(', ')}`);
    }
  }
}

module.exports = BaseController; 