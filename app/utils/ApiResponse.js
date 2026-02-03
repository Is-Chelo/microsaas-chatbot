class ApiResponse {
	/**
	 * Respuesta de éxito genérica.
	 */
	static success(res, message = 'Success', data = {}, others = {}, code = 200) {
		return res.status(code).json({
			status: true,
			message,
			errors: [],
			data,
			others,
		});
	}

	/**
	 * Respuesta de recurso creado.
	 */
	static created(res, message = 'Success', data = {}, others = {}, code = 201) {
		return res.status(code).json({
			status: true,
			message,
			errors: [],
			data,
			others,
		});
	}

	/**
	 * Respuesta de error genérica.
	 */
	static error(res, message = 'Error', errors = [], data = null, others = null, code = 500) {
		return res.status(code).json({
			status: false,
			message,
			errors,
			data,
			others,
		});
	}

	/**
	 * Atajo para errores de validación / parámetros inválidos.
	 */
	static invalid(res, message = 'Invalid parameters', errors = []) {
		return ApiResponse.error(res, message, errors, {}, {}, 400);
	}

	/**
	 * Atajo para 404.
	 */
	static notFound(res, message = 'Not found', errors = []) {
		return ApiResponse.error(res, message, errors, {}, {}, 404);
	}
}

module.exports = ApiResponse;
