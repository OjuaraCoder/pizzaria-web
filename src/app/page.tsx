import styles from "./page.module.scss";
import logoImg from "/public/logo.svg";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/services/api";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { toast } from "sonner";

export default function Home() {

  async function handleLogin(formData: FormData){
    "use server"
     const email = formData.get("email");
     const password = formData.get("password");

     try {
      const response = await api.post("/session",{
        email,
        password
      });

      if(!response.data.token){
        console.log("usuario não identificado");
        toast("usuario não identificado");
        return;
      }

      const expressTime = 24 * 60 * 60 * 1000; // 1 dia
      (await cookies()).set("session", response.data.token,{
        maxAge: expressTime,
        path: "/",
        httpOnly: false,
        secure: process.env.NODE_ENV === "production"
      });

     } catch (err) {
       console.log(err);
       return;
     }

     redirect("/dashboard");

  }

  return (
    <>
      <div className={styles.containerCenter}>
        <Image
         src={logoImg} 
         alt="Logo da pizzaria" 
         />

        <section className={styles.login}>
          <form  action={handleLogin} >
            <input
             type="email"
             required
             name="email" 
             placeholder="Digite seu email..."
             className={styles.input}
            />
            <input
             type="password"
             required
             name="password" 
             placeholder="*************"
             className={styles.input}
            />  
            <button type="submit" className={styles.button}>
              Acessar
            </button>
          </form>

          <Link href="/signup" className={styles.text}>
            Não possui uma conta? Cadastra-se          
          </Link>
        </section>
      </div>
    </>
  );
}
