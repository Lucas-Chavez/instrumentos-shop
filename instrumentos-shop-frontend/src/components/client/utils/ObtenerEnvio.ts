function obtenerEnvio(costoEnvio: string) {
    const tieneEnvioGratis = costoEnvio === 'G';
    const envio = tieneEnvioGratis ? 'Envío gratis' : `Costo de envío: $${costoEnvio}`;
    const claseEnvio = tieneEnvioGratis ? 'card-envio' : 'card-envio-pago';
    const iconoEnvio = tieneEnvioGratis ? '/img/camion.png' : null;

    return { envio, claseEnvio, iconoEnvio };
}

export default obtenerEnvio;