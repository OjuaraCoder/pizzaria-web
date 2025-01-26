"use client"
import { ChangeEvent, useState } from "react";
import styles from "./styles.module.scss";
import { Plus } from 'lucide-react';
import Image from "next/image";
import { Button } from "@/app/dashboard/components/button";
import { api } from "@/services/api";
import { getCookieClient } from "@/lib/cookieClient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CategoryProps{
    id: string;
    name: string;
}

interface Props{
    categories: CategoryProps[];
}

export function Form({categories}:Props){
    const [image, setImage] = useState<File>();
    const [previewImage, setPreviewImage] = useState("");
    const router = useRouter();

    function handleFile(e: ChangeEvent<HTMLInputElement>){
        if(e.target.files && e.target.files[0]){
            const image = e.target.files[0];
            
            if(image.type !== "image/jpeg" && image.type !== "image/png"){
                console.log("Formato inválido");
                toast.warning("Formato inválido");
            }
            
            setImage(image);
            setPreviewImage(URL.createObjectURL(image));

        }
    }

    async function handleRegisterProduct(formData: FormData){
        const categoryIndex = formData.get("category");
        const name = formData.get("name");
        const price = formData.get("price");
        const description = formData.get("description");


        if(!name || !categoryIndex || !price || !description || !image){
            return;
        }

        const data = new FormData();
        data.append("name",name);
        data.append("price",price);
        data.append("description",description);
        data.append("category_id",categories[Number(categoryIndex)].id);
        data.append("file",image);


        const token = getCookieClient();
        await api.post("/product", data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .catch((err) => {
            console.log(err);
            toast.warning("Falha ao cadastrar o produto");
        })

        toast.success("Produto registrado com sucesso");
        router.push("/dashboard");
    }

    return(
        <main className={styles.container}>
            <h1>Novo Produto</h1>

            <form className={styles.form} action={handleRegisterProduct}>

                <label className={styles.labelImage}>
                    <span>
                        <Plus size={36} color="#FFF"  />
                    </span>
                    <input
                        type="file"
                        accept="image/png, image/jpeg"
                        required
                        onChange={handleFile}
                    />

                    {previewImage && (
                        <Image
                            alt="Imagem de preview"
                            src={previewImage}
                            className={styles.preview}
                            fill={true}
                            quality={100}
                            priority={true}
                        />
                    )}

                </label>

                <select name="category">
                    {categories.map( (category, index) => (
                        <option key={category.id} value={index}>
                            {category.name}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    name="name"
                    placeholder="Digite o nome do produto..."
                    required
                    className={styles.input}
                />

                <input
                    type="text"
                    name="price"
                    placeholder="Preço do produto..."
                    required
                    className={styles.input}
                />     

                <textarea
                   className={styles.input}
                   placeholder="Digite a descrição do produto..."
                   required
                   name="description"                
                />

                <Button name="Cadastrar Produto"/>
            </form>

        </main>
    );
}