import React from 'react';

import Alert from '@mui/material/Alert';

const AlertMessage = () => {
    return (
        <div className="alert-message">
            <Alert severity="error" >Отсутствует соединение с сервером :(</Alert>
        </div>
    );
};

export default AlertMessage;