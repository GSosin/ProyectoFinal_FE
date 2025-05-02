"use client";

import { useRouter } from "next/navigation";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import styles from "./Login.module.css";

export default function Login() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <Card className={styles.card} title="Ingresa a tu cuenta">
        <form className={styles.form}>
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-envelope"></i>
            </span>
            <InputText placeholder="Email" type="email" />
          </div>

          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-lock"></i>
            </span>
            <Password
              placeholder="Contraseña"
              feedback={false}
              toggleMask
              className={styles.passwordField}
            />
          </div>

          <Button label="Ingresar" className="p-button-primary" />

          <p className={styles.registerText}>
            Todavía no tienes una cuenta?{" "}
            <span
              className={styles.registerLink}
              onClick={() => router.push("/register")}
            >
              Registrate aqui
            </span>
          </p>
        </form>
      </Card>
    </div>
  );
}
