'use client';

import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import styles from './Register.module.css';

export default function Register() {
    const router = useRouter();

    return (
        <div className={styles.container}>
            <Card className={styles.card} title="Registro">
                <form className={styles.form}>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-user"></i>
                        </span>
                        <InputText placeholder="Nombre" className={styles.tallInput} />
                    </div>

                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-user"></i>
                        </span>
                        <InputText placeholder="Apellido" className={styles.tallInput} />
                    </div>

                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-envelope"></i>
                        </span>
                        <InputText placeholder="Email" type="email" className={styles.tallInput} />
                    </div>

                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-calendar"></i>
                        </span>
                        <Calendar placeholder="Fecha de nacimiento" className={styles.tallInput} />
                    </div>

                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-phone"></i>
                        </span>
                        <InputText placeholder="Telefono" className={styles.tallInput} />
                    </div>

                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-lock"></i>
                        </span>
                        <Password placeholder="Contraseña" toggleMask className={styles.tallInput} />
                    </div>

                    <Button label="Registrarme" className="p-button-primary" />

                    <p className={styles.loginText}>
                        Ya tienes una cuenta?{' '}
                        <span 
                            className={styles.loginLink}
                            onClick={() => router.push('/')}
                        >
                            Ingresa aqui
                        </span>
                    </p>
                </form>
            </Card>
        </div>
    );
} 