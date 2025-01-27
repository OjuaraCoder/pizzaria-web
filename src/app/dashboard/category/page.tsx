import { getCookieServer } from "@/lib/cookieServer";
import { Button } from "../components/button";
import styles from "./styles.module.scss";
import { api } from "@/services/api";
import { redirect } from "next/navigation";

export default function Category() {

    async function handleRegisterCategory( formData: FormData){
        "use server"
        
        const name = formData.get("name");
        if(name === "") return;

        const data = {
            name: name,
        }

        const token = await getCookieServer();

        await api.post("/category", data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .catch((error) => {
            console.log(error);
        });

        redirect("/dashboard");

    }


    return (
        <main className={styles.container}>
            <h1>Nova Categoria</h1>
            <form className={styles.form} action={handleRegisterCategory}>
                <input
                    type="text"
                    name="name"
                    placeholder="Nome da Categoria, ex Pizzas"
                    required
                    className={styles.input}
                />
            <Button name="Cadastrar" />
            </form>
        </main>
    );
}
