"use client";

import { register } from "@/api/auth";
import Alerts from "@/components/alerts";
import { setAuthToken } from "@/utils/cookies";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Register = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    surname: "",
    password: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email.includes("@")) newErrors.email = "Email invalide";
    if (formData.name.trim().length < 2) newErrors.name = "Nom trop court";
    if (formData.surname.trim().length < 2) newErrors.surname = "Prénom trop court";
    if (formData.password.length < 6) newErrors.password = "Mot de passe trop court";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
  
    if (!validateForm()) return;
  
    try {
      const result = await register(formData);
    
      if (!result.success) {
        const errorMessage =
          typeof result.error === "object" && "error" in result.error
            ? result.error.error
            : result.error;
        setErrorMessage(errorMessage || "Une erreur est survenue");
        return;
      }
      
      if (result.data?.token) {
        setAuthToken(result.data.token);
        router.push("/movies")
      }
  
    } catch (error) {
      console.error( error);
    }
  };
  

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-center text-2xl font-semibold text-gray-700">Créer un compte</h2>

        {errorMessage && <Alerts text={errorMessage} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Champ Email */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              placeholder="exemple@email.com"
              required
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>

          {/* Champ Nom */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">Nom</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              placeholder="Jean"
              required
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Champ Prénom */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">Prénom</label>
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              placeholder="Dupont"
              required
            />
            {errors.surname && <p className="mt-1 text-sm text-red-500">{errors.surname}</p>}
          </div>

          {/* Champ Mot de Passe */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">Mot de passe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              placeholder="********"
              required
            />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
          </div>

          {/* Bouton d'inscription */}
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            S'inscrire
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Déjà un compte ? <a href="/auth/login" className="text-blue-600 hover:underline">Connectez-vous</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
