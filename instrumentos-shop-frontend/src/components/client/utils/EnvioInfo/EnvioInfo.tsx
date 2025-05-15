// EnvioInfo.tsx
import React from 'react';
import './envioInfo.css'

interface EnvioInfoProps {
    claseEnvio: string;
    iconoEnvio: string | null;
    envio: string;
}

const EnvioInfo: React.FC<EnvioInfoProps> = ({ claseEnvio, iconoEnvio, envio }) => {
    return (
        <p className={claseEnvio}>
            {iconoEnvio && (
                <span className="icono-envio-producto">
                    <img src={iconoEnvio} alt="Icono envío" />
                </span>
            )} {envio}
        </p>
    );
};

export default EnvioInfo;